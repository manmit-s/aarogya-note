import asyncio
import base64
import json
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

import httpx
from fastapi import HTTPException, UploadFile

from app.config import settings
from app.prompts import CLINICAL_EXTRACTION_SYSTEM_PROMPT
from app.schemas import ClinicalData

ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/webm", "video/webm", "application/octet-stream"}


def _endpoint(configured: str, service: str) -> str:
    url = configured
    if not settings.gnani_api_key or not url:
        raise HTTPException(status_code=503, detail=f"Gnani {service} is not configured. Set GNANI_API_KEY and its endpoint URL in backend/.env.")
    return url


def _headers() -> dict[str, str]:
    return {"X-API-Key-ID": settings.gnani_api_key}


def _check(response: httpx.Response, service: str) -> None:
    if response.is_error:
        if response.status_code == 429:
            raise HTTPException(status_code=502, detail=f"Gnani {service} was rate-limited (HTTP 429). Wait briefly and retry; if it continues, check your Gnani API quota and batch limits.")
        raise HTTPException(status_code=502, detail=f"Gnani {service} request failed (HTTP {response.status_code}). Check endpoint and credentials.")


def _retry_delay(response: httpx.Response, attempt: int) -> float:
    retry_after = response.headers.get("Retry-After")
    if retry_after:
        try:
            return max(0.0, min(float(retry_after), 60.0))
        except ValueError:
            try:
                retry_at = parsedate_to_datetime(retry_after)
                if retry_at.tzinfo is None:
                    retry_at = retry_at.replace(tzinfo=timezone.utc)
                return max(0.0, min((retry_at - datetime.now(timezone.utc)).total_seconds(), 60.0))
            except (TypeError, ValueError, OverflowError):
                pass
    return float(2 ** attempt)


async def _batch_read(client: httpx.AsyncClient, url: str, service: str, *, params: dict[str, str] | None = None) -> httpx.Response:
    for attempt in range(6):
        response = await client.get(url, headers=_headers(), params=params)
        if response.status_code == 429 or response.status_code in {502, 503, 504}:
            if attempt < 5:
                await asyncio.sleep(_retry_delay(response, attempt))
                continue
        _check(response, service)
        return response
    raise HTTPException(status_code=502, detail=f"Gnani {service} failed after repeated retries.")


def _find_text(payload: Any, keys: tuple[str, ...]) -> str:
    if isinstance(payload, str):
        return payload.strip()
    if isinstance(payload, dict):
        for key in keys:
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        for key in ("data", "result", "output", "choices", "message"):
            if key in payload:
                found = _find_text(payload[key], keys)
                if found:
                    return found
    if isinstance(payload, list):
        for item in payload:
            found = _find_text(item, keys)
            if found:
                return found
    return ""


async def _transcribe_batch(content: bytes, filename: str, content_type: str) -> str:
    base = settings.gnani_api_base_url.rstrip("/")
    if not base:
        raise HTTPException(status_code=503, detail="Set GNANI_API_BASE_URL to enable long recording transcription.")
    config = {"model": settings.prisma_model, "language_code": settings.prisma_language_code, "mode": "transcribe", "with_diarization": False, "is_multi_channel": False}
    headers = _headers()
    timeout = httpx.Timeout(45.0)
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            if len(content) <= 10 * 1024 * 1024:
                response = await client.post(f"{base}/stt/v3/batch/jobs", headers=headers, files=[("config", (None, json.dumps(config), "application/json")), ("files", (filename, content, content_type))])
                _check(response, "Prisma batch")
                job = response.json()
            else:
                response = await client.post(f"{base}/stt/v3/batch/v2/jobs", headers=headers, json={"config": config, "source": {"type": "direct_upload_url", "files": [{"filename": filename}]}})
                _check(response, "Prisma batch")
                job = response.json()
                upload = job.get("uploads", [])[0]
                uploaded = await client.put(upload["url"], headers=upload.get("headers", {}), content=content)
                _check(uploaded, "Prisma audio upload")
            job_id = job.get("job_id")
            if not job_id:
                raise HTTPException(status_code=502, detail="Prisma batch did not return a job ID.")
            for attempt in range(6):
                started = await client.post(f"{base}/stt/v3/batch/jobs/{job_id}/start", headers=headers)
                if started.status_code == 429 or started.status_code in {502, 503, 504}:
                    if attempt < 5:
                        await asyncio.sleep(_retry_delay(started, attempt))
                        continue
                _check(started, "Prisma batch start")
                break
            for _ in range(240):
                await asyncio.sleep(10)
                status_response = await _batch_read(client, f"{base}/stt/v3/batch/jobs/{job_id}", "Prisma batch status")
                status = status_response.json().get("status", "").upper()
                if status == "COMPLETED":
                    break
                if status in {"FAILED", "CANCELLED", "ERROR"}:
                    raise HTTPException(status_code=502, detail="Prisma could not transcribe this recording.")
            else:
                raise HTTPException(status_code=504, detail="Prisma batch transcription timed out. Please try again.")
            files_response = await _batch_read(client, f"{base}/stt/v3/batch/jobs/{job_id}/files", "Prisma batch results", params={"status": "COMPLETED"})
            files = files_response.json()
            urls = []
            def collect_urls(value: Any) -> None:
                if isinstance(value, dict):
                    if isinstance(value.get("transcript_url"), str):
                        urls.append(value["transcript_url"])
                    for child in value.values():
                        collect_urls(child)
                elif isinstance(value, list):
                    for child in value:
                        collect_urls(child)
            collect_urls(files)
            for transcript_url in urls:
                transcript_response = await client.get(transcript_url)
                _check(transcript_response, "Prisma transcript download")
                transcript = _find_text(transcript_response.json(), ("full_transcript", "transcript", "text"))
                if transcript:
                    return transcript
            raise HTTPException(status_code=502, detail="Prisma batch completed without returning transcript text.")
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="Prisma batch transcription timed out. Please try again.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Could not connect to the Prisma batch service.") from exc

async def transcribe(audio: UploadFile) -> str:
    if audio.content_type and audio.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported audio type. Upload MP3, WAV, M4A, or WebM audio.")
    content = await audio.read(settings.max_audio_size_mb * 1024 * 1024 + 1)
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded audio file is empty.")
    if len(content) > settings.max_audio_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"Audio must be {settings.max_audio_size_mb} MB or smaller.")
    try:
        async with httpx.AsyncClient(timeout=180) as client:
            response = await client.post(_endpoint(settings.prisma_url, "prisma"), headers=_headers(), data={"model": settings.prisma_model, "language_code": settings.prisma_language_code}, files={"audio_file": (audio.filename or "recording", content, audio.content_type or "application/octet-stream")})
        if response.status_code == 400:
            try:
                error_type = response.json().get("error", {}).get("type")
            except (ValueError, AttributeError):
                error_type = None
            if error_type == "MAX_AUDIO_DURATION_EXCEEDED":
                return await _transcribe_batch(content, audio.filename or "recording", audio.content_type or "application/octet-stream")
        _check(response, "Prisma")
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="Prisma transcription timed out. Try a shorter recording.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Could not connect to the Prisma transcription service.") from exc
    try:
        payload = response.json()
    except ValueError:
        payload = {"transcription": response.text}
    transcript = _find_text(payload, ("transcription", "transcript", "text"))
    if not transcript:
        raise HTTPException(status_code=502, detail="Prisma returned no transcription text.")
    return transcript


async def extract(transcription: str) -> ClinicalData:
    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="Groq extraction is not configured. Set GROQ_API_KEY in backend/.env.")
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(settings.groq_url, headers={"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"}, json={"model": settings.extraction_model, "messages": [{"role": "system", "content": CLINICAL_EXTRACTION_SYSTEM_PROMPT}, {"role": "user", "content": transcription}], "temperature": 0.1, "max_completion_tokens": 1800, "response_format": {"type": "json_object"}})
        if response.is_error:
            raise HTTPException(status_code=502, detail=f"Groq extraction request failed (HTTP {response.status_code}). Check Groq credentials and model access.")
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="Groq extraction timed out. Please try again.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Could not connect to Groq extraction service.") from exc
    try:
        result = response.json()
        candidate = _find_text(result, ("clinical_data", "structured_data", "output", "text", "content", "response"))
        structured = result
        if isinstance(result, dict):
            for key in ("clinical_data", "structured_data", "data", "result", "output"):
                value = result.get(key)
                if isinstance(value, dict) and "chief_complaint" in value:
                    structured = value
                    break
        if not candidate and isinstance(structured, dict) and "chief_complaint" in structured:
            candidate = json.dumps(structured)
        candidate = candidate.strip()
        if candidate.startswith("```"):
            candidate = candidate.split("\n", 1)[-1].removesuffix("```").strip()
        return ClinicalData.model_validate(json.loads(candidate))
    except (ValueError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="Groq returned invalid data; the clinical note did not match the required structure.") from exc

async def generate_summary(clinical_data: ClinicalData) -> tuple[str, str]:
    note = clinical_data.model_dump()
    lines = [("Chief complaint", note["chief_complaint"]), ("History", note["history_of_present_illness"]), ("Examination", note["examination_findings"]), ("Provisional diagnosis", note["provisional_diagnosis"]), ("Advice", note["advice"]), ("Follow-up", note["follow_up"])]
    text = "Clinical summary. " + " ".join(f"{label}: {value}." for label, value in lines if value)
    if note["medicines"]:
        text += " Medicines: " + "; ".join(", ".join(v for v in [m["name"], m["dosage"], m["frequency"], m["duration"]] if v) for m in note["medicines"]) + "."
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(_endpoint(settings.timbre_url, "timbre"), headers={**_headers(), "Content-Type": "application/json"}, json={"model": settings.timbre_model, "voice": settings.timbre_voice, "language": settings.timbre_language, "text": text, "audio_config": {"container": "mp3", "bitrate": "128k"}})
        _check(response, "Timbre")
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=504, detail="Timbre voice summary timed out. Please try again.") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Could not connect to the Timbre voice service.") from exc
    mime_type = response.headers.get("content-type", "audio/mpeg").split(";")[0]
    if mime_type.startswith("audio/"):
        audio_bytes = response.content
    else:
        try:
            result = response.json()
            encoded = _find_text(result, ("audio_base64", "audio", "data"))
            if not encoded:
                raise ValueError("missing audio")
            audio_bytes = base64.b64decode(encoded)
            mime_type = result.get("mime_type", "audio/mpeg") if isinstance(result, dict) else "audio/mpeg"
        except (ValueError, TypeError) as exc:
            raise HTTPException(status_code=502, detail="Timbre returned no playable audio.") from exc
    if not audio_bytes:
        raise HTTPException(status_code=502, detail="Timbre returned an empty audio response.")
    return base64.b64encode(audio_bytes).decode("ascii"), mime_type









