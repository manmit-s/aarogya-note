"""Run the project's existing Prisma and Groq adapters on the synthetic samples."""

from __future__ import annotations

import asyncio
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app.services.gnani import extract, transcribe  # noqa: E402
from starlette.datastructures import UploadFile  # noqa: E402


async def main() -> None:
    timings: dict[str, dict[str, float]] = {}
    for index in range(1, 5):
        sample = f"transcript{index}"
        audio_path = ROOT / "samples" / "tts-generations" / f"{sample}.wav"
        hypothesis_path = ROOT / "samples" / "hypotheses" / f"{sample}.txt"
        extraction_path = ROOT / "samples" / "extractions" / f"{sample}.json"

        stt_started = time.perf_counter()
        with audio_path.open("rb") as audio_file:
            transcription = await transcribe(
                UploadFile(filename=audio_path.name, file=audio_file)
            )
        stt_seconds = time.perf_counter() - stt_started
        hypothesis_path.write_text(transcription.rstrip() + "\n", encoding="utf-8")

        extraction_started = time.perf_counter()
        clinical_data = await extract(transcription)
        extraction_seconds = time.perf_counter() - extraction_started
        extraction_path.write_text(
            json.dumps(clinical_data.model_dump(), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        timings[sample] = {
            "stt_seconds": round(stt_seconds, 3),
            "extraction_seconds": round(extraction_seconds, 3),
            "end_to_end_seconds": round(stt_seconds + extraction_seconds, 3),
        }
        print(
            f"{sample}: STT {stt_seconds:.2f}s, extraction "
            f"{extraction_seconds:.2f}s, end-to-end "
            f"{stt_seconds + extraction_seconds:.2f}s"
        )

    (ROOT / "samples" / "eval" / "latency.json").write_text(
        json.dumps(timings, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    asyncio.run(main())
