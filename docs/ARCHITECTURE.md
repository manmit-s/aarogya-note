# System Architecture

This document details the architectural design, component responsibilities, and data flow of **AarogyaNote**.

---

## Architectural Diagram

```text
                              ┌────────────────────────────────┐
                              │  Doctor–Patient Consultation   │
                              │  (Code-Mixed Hinglish / Hindi) │
                              └───────────────┬────────────────┘
                                              │ Audio File
                                              │ (WAV/MP3/M4A)
                                              ▼

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ FASTAPI BACKEND (app/services/gnani.py)                                                 │
│                                                                                         │
│  ┌───────────────────────────────┐               ┌───────────────────────────────────┐  │
│  │   In-Memory Audio Slicer      │ ──25s chunks─►│ Gnani AI Prisma v2.5 (STT)        │  │
│  │   (Python wave module)        │               │ hi-IN Indic Speech Recognition   │  │
│  └───────────────────────────────┘               └─────────────────┬─────────────────┘  │
│                                                                    │                    │
│                                                                    │ Consultation Text  │
│                                                                    ▼                    │
│  ┌───────────────────────────────┐               ┌───────────────────────────────────┐  │
│  │ Pydantic v2 Schema Validator  │◄──JSON Output─│ Groq LPU Inference                │  │
│  │ (ClinicalData & Medicine)     │               │ openai/gpt-oss-120b SOAP Parser   │  │
│  └───────────────┬───────────────┘               └───────────────────────────────────┘  │
│                  │                                                                      │
│                  │ Schema-Validated Clinical Data                                      │
│                  ▼                                                                      │
│  ┌───────────────────────────────┐                                                      │
│  │ Gnani AI Timbre v2.5 (TTS)    │ ──MP3 Audio──► Nalini Indic Spoken Briefing          │
│  └───────────────────────────────┘                                                      │
│                                                                                         │
└──────────────────────────────────────────────┬──────────────────────────────────────────┘
                                               │ REST API Response
                                               ▼

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ NEXT.JS APP ROUTER WORKSPACE (Frontend UI)                                               │
│                                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  Tactile Clinical Note  │  │   Prescription Card     │  │   Voice Summary Player  │  │
│  │  (SOAP 2-Column Grid)   │  │   (Dosage / Frequency)  │  │   (Animated Waveform)   │  │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  │
│                                                                                         │
│                            ┌─────────────────────────────────────┐                      │
│                            │       Vector PDF Generation         │                      │
│                            └─────────────────────────────────────┘                      │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Summary

| Stage | Component | Responsibility |
|---|---|---|
| Audio Input | Next.js Frontend | Ingests consultation recordings via drag-and-drop or file upload. Validates supported MIME types. |
| Audio Preprocessing | FastAPI Backend (`wave` module) | Reads WAV frames in-memory and partitions recordings longer than 25s into clean sequential chunks. |
| Speech Recognition | Gnani Prisma v2.5 | Converts speech chunks into text with code-mixed `hi-IN` Indic vocabulary handling. |
| Clinical Extraction | Groq `openai/gpt-oss-120b` | Maps the raw conversation into structured SOAP clinical fields via zero-shot prompt engineering. |
| Schema Validation | Pydantic v2 | Strictly validates the JSON object against `ClinicalData` and `Medicine` schema specifications. |
| Speech Synthesis | Gnani Timbre v2.5 | Synthesizes an MP3 spoken audio briefing from structured findings using the `Nalini` voice. |
| Clinical Workspace | Next.js App Router | Displays structured notes, editable prescription cards, and playback visualizer using a dual-shadow Neumorphic UI. |
| Document Export | `@react-pdf/renderer` | Assembles vector clinical summary PDFs on the client side with hospital headers and signature blocks. |

---

## Core Components & Processing Logic

### 1. In-Memory Audio Slicing Engine
Gnani's synchronous REST endpoint (`/stt/v3`) enforces a strict limit:
```json
{"error": {"type": "MAX_AUDIO_DURATION_EXCEEDED", "message": "Audio duration exceeds maximum allowed duration of 30 seconds"}}
```
To bypass slow asynchronous batch queues while remaining strictly within the 30-second restriction:
- The backend uses Python's standard `wave` and `io` libraries (zero external dependencies).
- Any WAV recording longer than 25 seconds is sliced into sequential 25-second chunks entirely in RAM.
- Chunks are dispatched sequentially to the synchronous REST endpoint, returning a complete 60–70s transcription in **~1.3 seconds**.

### 2. Batch Rate-Limit Backoff
For non-WAV compressed formats (MP3, M4A, WebM) that exceed REST duration limits:
- The file falls back to Gnani's batch queue (`/stt/v3/batch/jobs`).
- Job start (`POST /stt/v3/batch/jobs/{job_id}/start`) is wrapped in an exponential backoff retry loop (up to 6 attempts) respecting `Retry-After` headers.
- This prevents HTTP 429 rate-limiting errors from terminating the user request.

### 3. Ephemeral In-Memory Data Flow
- Consultation audio buffers and extracted notes are processed purely in memory.
- No local database or application disk volume retains the consultation recordings.
- Upstream transmissions to Gnani AI and Groq are conducted over secure HTTPS connections.

