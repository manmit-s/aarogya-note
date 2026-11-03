# AarogyaNote

> **Clinical conversation, clearly documented.**  
> Turn doctor–patient consultation audio into structured clinical notes and draft prescriptions in moments.

---

## Overview

**AarogyaNote** is an ambient clinical documentation assistant designed for care teams in India. During outpatient visits, physicians frequently spend 30–40% of consultation time typing notes into electronic records rather than maintaining eye contact and engaging with patients.

AarogyaNote listens to doctor–patient conversations (including code-mixed **Hinglish**, Hindi, and English), transcribes the consultation, and extracts structured clinical notes along with a draft prescription and an audio summary—ready for clinician review and approval.

---

## Why This Project (Gnani AI Internship Submission)

This project was built as a submission for the **Gnani AI Internship Contest**.

### Purposeful Speech & Language AI
Most voice AI showcases focus on generic conversational chatbots or simple voice bots. AarogyaNote addresses a high-friction, real-world domain where Indian language speech recognition and clinical extraction provide tangible social and clinical impact:

- **Indian Language & Code-Mixed Acoustic Reality**: Real consultations across India rarely happen in pure English or pure Hindi. Doctors and patients naturally switch between languages (e.g., *"Pet me burning sensation ho rahi hai after meals"*). AarogyaNote utilizes **Gnani AI's Prisma** speech recognition engine, engineered specifically for Indic phonetics and code-mixed speech.
- **Listen, Don't Distract**: Instead of requiring rigid command-and-control voice inputs, the system works ambiently on natural dialogues between clinician and patient.
- **Multimodal Output**: Beyond text notes, the platform leverages **Gnani AI's Timbre** speech synthesis to produce spoken summaries for quick auditory review or patient take-home guidance.

---

## Features

- **Hinglish & Multilingual Audio Ingestion**: Process consultation recordings in MP3, WAV, M4A, or WebM formats (up to 30 MB).
- **Indic Speech Recognition**: Transcribes multi-speaker clinical dialogues with medical terminology awareness using **Gnani Prisma v2.5**.
- **Structured Clinical Extraction (SOAP Framework)**:
  - **Chief Complaint** (Presenting symptoms)
  - **History of Present Illness** (Chronology, aggravating factors, symptom characteristics)
  - **Examination Findings** (Physical exam observations, vitals)
  - **Provisional Diagnosis** (Assessment / clinical impression)
  - **Prescription Details** (Medication name, dosage, frequency, duration)
  - **Advice & Follow-Up** (Lifestyle guidance, precautions, review timeline)
- **Draft Prescription Card**: Formats medication regimens into clean, readable cards with dedicated dose, frequency, and duration metadata.
- **Spoken Voice Summary**: Generates a natural spoken briefing of the visit using **Gnani Timbre v2.5** TTS.
- **Tactile Neumorphic Review UI**: A soft, medical-grade dual-shadow surface system (light and dark mode) designed to minimize visual fatigue.
- **One-Click Clinical PDF Export**: Formats the approved draft into a standardized printable document using `@react-pdf/renderer`.
- **Privacy-First Architecture**: Audio and clinical notes are processed in memory and are not permanently persisted to databases.

---

## How It Works

```
┌─────────────────────────┐
│ Doctor–Patient Audio    │  (Hinglish / Hindi + English conversation)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Gnani AI Prisma v2.5    │  (Indic Speech-to-Text)
└────────────┬────────────┘
             │ Raw Consultation Transcript
             ▼
┌─────────────────────────┐
│ Clinical Extraction LLM │  (Structured clinical parsing & validation)
└────────────┬────────────┘
             │ Structured JSON
             ▼
┌─────────────────────────────────────────────────────────────┐
│ AarogyaNote Clinician Workspace                             │
│ ├─ Structured Clinical Summary (Chief Complaint, HPI, etc.) │
│ ├─ Draft Prescription (Dosage, Frequency, Duration)         │
│ ├─ Spoken Summary Player (Gnani Timbre TTS)                 │
│ └─ Clinical Note PDF Export                                 │
└─────────────────────────────────────────────────────────────┘
```

1. **Record / Upload**: The clinician uploads a consultation audio file or dropzone recording.
2. **Transcribe**: Gnani Prisma converts speech into text with code-mixed Indic vocabulary handling.
3. **Extract & Structure**: The backend maps the raw conversation into structured clinical fields.
4. **Review & Approve**: The doctor reviews every detail on the tactile workspace, edits as needed, listens to the summary, and exports the note.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Motion** | Custom Tactile Neumorphic CSS System, [Framer Motion](https://www.framer-motion.com/), [Lucide React](https://lucide.dev/), `@fontsource/inter` |
| **Document Generation** | [@react-pdf/renderer](https://react-pdf.org/) (client-side clinical PDF engine) |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), [Pydantic v2](https://docs.pydantic.dev/), [Uvicorn](https://www.uvicorn.org/), Python 3.11+ |
| **Speech-to-Text (STT)** | **Gnani AI Prisma v2.5** (`hi-IN` code-mixed REST / Batch pipeline) |
| **Text-to-Speech (TTS)** | **Gnani AI Timbre v2.5** (`Nalini` voice, natural Indic synthesis) |
| **Clinical Extraction** | Groq API (`openai/gpt-oss-120b` JSON extraction model) |

---

## Setup & Installation

### Prerequisites

- **Node.js** 20.9 or higher
- **Python** 3.11 or higher
- **Gnani AI API Key** (for Prisma STT & Timbre TTS)
- **Groq API Key** (for structured clinical extraction)

---

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
py -m venv .venv
.\.venv\Scripts\Activate.ps1    # On macOS/Linux: source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
Copy-Item .env.example .env    # On macOS/Linux: cp .env.example .env
```

Open `backend/.env` and provide your credentials:

```ini
GNANI_API_KEY=your-gnani-api-key
GROQ_API_KEY=your-groq-api-key

# Service endpoints (defaults work out of the box)
GNANI_API_BASE_URL=https://api.vachana.ai
PRISMA_URL=https://api.vachana.ai/stt/v3
TIMBRE_URL=https://api.vachana.ai/api/v1/tts/inference
PRISMA_LANGUAGE_CODE=hi-IN
```

Start the FastAPI development server:

```powershell
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive documentation is hosted at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

In a new terminal window from the repository root:

```powershell
# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Open the **AarogyaNote** workspace at `http://localhost:3000`.
2. In the **Add a recording** card, drag and drop an audio file (e.g., MP3 or WAV consultation recording) or click to browse.
3. Click **Create clinical note**. The animated status loader will monitor transcription and clinical extraction.
4. Review the generated documentation:
   - **Visit Summary**: Examine Chief Complaint, History of Present Illness, Examination Findings, Provisional Diagnosis, Advice, and Follow-up.
   - **Draft Prescription**: Verify prescribed medications, dosages, frequencies, and durations.
   - **Voice Summary**: Click **Create audio** to generate and listen to a spoken summary of the consultation.
   - **Transcript**: Expand the source transcript drawer to verify speech-to-text accuracy.
5. Click **Download PDF** to export a clean clinical note, or **Copy note** to transfer the text directly into your EMR system.

---

## Project Structure

```
aarogya-note/
├── app/
│   ├── globals.css              # Tactile Neumorphic design tokens & responsive styling
│   ├── layout.tsx               # Root layout, typography imports, and brand metadata
│   ├── page.tsx                 # Main consultation workspace and results dashboard
│   ├── icon.png                 # Browser favicon and application icon
│   └── apple-icon.png           # iOS touch icon
├── components/
│   ├── AudioUploader.tsx        # Drag-and-drop audio cartridge with validation
│   ├── ClinicalNote.tsx         # 2-column pairwise clinical documentation layout
│   ├── ClinicalNotePdf.tsx      # Declarative PDF template for export
│   ├── PrescriptionCard.tsx     # Formatted prescription card with dosage chips
│   ├── ProcessingLoader.tsx     # Animated progress state with AarogyaNote emblem
│   ├── SmoothScroll.tsx         # Lenis smooth scrolling integration
│   ├── ThemeToggle.tsx          # Light and dark mode surface switcher
│   └── VoiceSummaryPlayer.tsx   # Audio player with animated waveform display
├── lib/
│   ├── api.ts                   # Client communication layer for backend endpoints
│   ├── clinical-pdf.ts          # PDF blob generator and download handler
│   ├── logo-base64.ts           # Embedded vector-compatible asset for PDF headers
│   └── types.ts                 # TypeScript interfaces for clinical data & responses
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── gnani.py         # Prisma STT, Timbre TTS, and Groq extraction adapters
│   │   ├── config.py            # Environment validation and settings
│   │   ├── main.py              # FastAPI app initialization and CORS middleware
│   │   ├── prompts.py           # Clinical SOAP schema extraction prompts
│   │   ├── routes.py            # Audio processing and summary endpoints
│   │   └── schemas.py           # Pydantic data models
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Backend environment template
├── assets/
│   └── AarogyaNote_Logo.png     # Official AarogyaNote brand emblem
├── public/                      # Static assets and web font fallbacks
├── README.md                    # Project documentation
└── package.json                 # Node dependencies and build scripts
```

---

## Future Improvements

- **FHIR / HL7 Integration**: Standardize output formats for direct export into hospital electronic medical record (EMR/EHR) systems.
- **Live Streaming Transcription**: Utilize WebSocket-based streaming speech recognition for real-time note drafting during the consultation.
- **Deeper Indic Dialect Support**: Extend out-of-the-box vocabulary and acoustics across regional Indian languages including Tamil, Telugu, Kannada, Marathi, and Bengali.
- **Clinician Inline Editing**: Allow inline editing of individual fields with live audit diff tracking before final sign-off.

---

## Disclaimer

> **Important**: AarogyaNote is an AI-assisted documentation drafting tool created for research and demonstration purposes. All generated clinical notes, provisional diagnoses, and prescriptions are drafts and must be reviewed, verified, and signed off by a licensed medical practitioner before use in patient care.
