# AarogyaNote

AarogyaNote turns a doctor-patient recording into a structured clinical note, a printable draft prescription, and an optional spoken summary. It includes a Next.js App Router frontend and FastAPI backend.

## Requirements

- Node.js 20.9+
- Python 3.11+
- Gnani AI credentials for Prisma and Timbre, plus a Groq API key for transcript extraction

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and configure your Gnani API key and model endpoints.
2. Start the API:

   ```powershell
   cd backend
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

3. From the repository root, start the web app:

   ```powershell
   npm install
   Copy-Item .env.local.example .env.local
   npm run dev
   ```

Open http://localhost:3000. API docs are at http://localhost:8000/docs.

## Gnani adapter configuration

Set `GNANI_API_KEY` and `GROQ_API_KEY` in `backend/.env`. Prisma v2.5 and Timbre v2.5 use Gnani's documented endpoints by default; their endpoint URLs can be overridden. Prisma uses `X-API-Key-ID`, `audio_file`, and a configurable language code. Recordings over the REST duration limit fall back to Prisma Batch, including presigned uploads for files over 10 MB. Timbre returns MP3 audio. Groq handles structured transcript extraction through its OpenAI-compatible chat-completions endpoint using `openai/gpt-oss-120b`. Set `GROQ_API_KEY` in `backend/.env`; `GROQ_URL` and `EXTRACTION_MODEL` have defaults. If a provider is not configured, the API returns a clear configuration error rather than fabricated clinical output.

## Privacy and clinical review

Audio and notes are processed in memory and are not persisted by this application. Generated notes and prescriptions are drafts; a licensed clinician must review and approve them before use. Use patient information only after configuring an approved deployment, retention policy, and vendor agreement.



