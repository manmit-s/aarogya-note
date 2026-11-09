# AarogyaNote (आरोग्यNote)

<div align="center">

[![aarogya-note.png](https://i.postimg.cc/8cwyPXHv/aarogya-note.png)](https://postimg.cc/tnZdB58R)

### *Ambient Clinical Documentation & Prescription Intelligence for Indian Healthcare*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Gnani AI Prisma](https://img.shields.io/badge/Gnani_AI-Prisma_v2.5_(STT)-FF6F00?style=for-the-badge)](https://vachana.ai)
[![Gnani AI Timbre](https://img.shields.io/badge/Gnani_AI-Timbre_v2.5_(TTS)-7B1FA2?style=for-the-badge)](https://vachana.ai)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge)](https://groq.com/)

[Overview](#overview) • [Why This Project](#why-this-project-gnani-ai-internship-submission) • [Core Features](#key-features) • [System Architecture](#system-architecture) • [Evaluation & Benchmarks](#empirical-evaluation--benchmarks) • [Quickstart](#quickstart--installation) • [API Reference](#api-reference)

</div>

---

## Overview

**AarogyaNote** is an ambient clinical intelligence workspace purpose-built for outpatient departments (OPDs) and consultation clinics across India.

In Indian healthcare settings, doctors routinely examine **60 to 100+ patients every single day**. Physicians spend **30% to 40% of their consultation time** manually typing notes, updating electronic health records, or scribbling paper prescriptions rather than maintaining eye contact and listening to their patients.

AarogyaNote transforms outpatient consultations by listening ambiently to doctor–patient conversations—fluent in natural **code-mixed Hinglish** (Hindi + English), pure Hindi, and English. In seconds, it converts the dialogue into **structured SOAP clinical notes**, an **actionable draft prescription card**, a **natural spoken audio summary**, and an **exportable vector PDF**, empowering clinicians to focus 100% on patient care.

---

## Why This Project (Gnani AI Internship Submission)

This project was engineered as a flagship submission for the **Gnani AI Internship Contest**.

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                        THE REALITY OF INDIAN OPDs                      │
   │                                                                        │
   │  Doctor: "Aapko kab se fever mehsoos ho raha hai?"                     │
   │  Patient: "Sir, 3 din se hai... sath me pet me burning sensation hoti" │
   │  Doctor: "Theek hai. Paracetamol 650mg TDS le lijiye after meals."     │
   │                                                                        │
   │  [!] Standard Western ASR: Chokes on code-mixed phonetics & local terms│
   │  [*] Gnani Prisma v2.5: Transcribes Indic speech & dialects accurately │
   └────────────────────────────────────────────────────────────────────────┘
```

### Solving the Code-Mixed Acoustic Reality
Standard speech-to-text models trained predominantly on Western acoustic datasets degrade severely when encountering code-mixed Indian languages. Indian clinical consultations are rarely conducted in textbook English or formal Hindi; they flow fluidly through code-switched vernaculars:
> *"Pet me burning sensation ho rahi hai after meals"*  
> *"Gale me kharash hai aur kal raat se chills feel ho rahe hain"*

AarogyaNote harnesses **Gnani AI's Voice Intelligence Platform** to address this core linguistic challenge:

1. **Gnani AI Prisma v2.5 (Indic Speech Recognition)**:
   - Engineered for Indic phonetics, multi-speaker clinical dialogues, and code-mixed `hi-IN` vocabulary.
   - Accurately captures colloquial symptom expressions and maps them to clinical context.

2. **Gnani AI Timbre v2.5 (Indic Speech Synthesis)**:
   - Utilizes the expressive `Nalini` voice to synthesize natural, fluent spoken briefings.
   - Provides doctors with a rapid auditory review between patients and offers patients an accessible audio summary in their own language.

3. **High-Impact Clinical Utility**:
   - Rather than creating another generic conversational chatbot, AarogyaNote addresses a high-friction administrative bottleneck in Indian hospitals, demonstrating the real-world value of specialized Indic voice AI.

---

## Key Features

### Code-Mixed Multilingual Speech Recognition
- Ingests consultation recordings in **MP3, WAV, M4A, or WebM** formats (up to 30 MB).
- Powered by **Gnani Prisma v2.5** (`hi-IN`), designed specifically for the phonetic nuances of Indian English and Hindi dialogues.
- **Acoustic Chunking Pipeline**: Seamlessly handles long consultations via in-memory 25-second windowing—processing full 60–70s recordings in **under 1.5 seconds** with zero external dependencies.

### Structured SOAP Clinical Extraction
- Automatically maps unorganized consultation transcripts into standardized clinical documentation:
  - **Chief Complaint**: Presenting symptoms and primary reasons for visit.
  - **History of Present Illness (HPI)**: Chronological progression, duration, aggravating and relieving factors.
  - **Examination Findings**: Clinician-observed physical findings, vitals, and objective signs.
  - **Provisional Diagnosis**: Assessment and primary clinical impressions.
  - **Advice & Lifestyle Guidance**: Hydration, dietary precautions, and rest instructions.
  - **Follow-Up Timeline**: Explicit review dates and red-flag escalation triggers.

### Intelligent Draft Prescription Card
- Formats prescribed medications into structured, readable cards.
- Surfaces dedicated metadata chips for **Dose**, **Frequency** (e.g., *Once daily, TDS*), and **Duration** (e.g., *5 days*).
- Clinical safety guardrail: Explicit clinician review notices prevent unauthorized dispensing.

### Spoken Audio Briefing (Gnani Timbre TTS)
- Generates natural, fluent spoken briefings of the consultation using **Gnani Timbre v2.5** (`Nalini` voice).
- Integrated with a custom Neumorphic audio player featuring play/pause controls, progress seeking, and animated soundwave visualization.

### Tactile Neumorphic Design System
- Custom-built medical UI inspired by modern tactile skeuomorphism and soft UI design.
- Dual-shadow light/dark surface tokens (`--neu-raised-*`, `--neu-inset-*`), specular highlights, etched borders, and zero visual clutter to eliminate clinical screen fatigue.

### One-Click Clinical PDF Export
- Client-side vector PDF generation via `@react-pdf/renderer`.
- Automatically formats the structured note, prescription grid, patient metadata, and doctor signature block into a hospital-ready document.

### Privacy-by-Design Architecture
- Consultations and audio buffers are processed entirely **in-memory**.
- Zero persistent storage of raw patient audio or identifiable transcripts, aligning with HIPAA and Indian Digital Personal Data Protection (DPDP) principles.

---

## System Architecture

```
                               ┌────────────────────────────────┐
                               │  Doctor–Patient Consultation   │
                               │  (Code-Mixed Hinglish / Hindi) │
                               └───────────────┬────────────────┘
                                               │ Audio File (WAV/MP3/M4A)
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ FASTAPI BACKEND (app/services/gnani.py)                                                 │
│                                                                                         │
│  ┌───────────────────────────────┐               ┌───────────────────────────────────┐  │
│  │   In-Memory Audio Slicer      │ ──25s chunks─►│ Gnani AI Prisma v2.5 (STT)        │  │
│  │   (Python wave module)        │               │ hi-IN Indic Speech Recognition    │  │
│  └───────────────────────────────┘               └─────────────────┬─────────────────┘  │
│                                                                    │ Consultation Text  │
│                                                                    ▼                    │
│  ┌───────────────────────────────┐               ┌───────────────────────────────────┐  │
│  │ Pydantic v2 Schema Validator  │◄──JSON Output─│ Groq LPU Inference                │  │
│  │ (ClinicalData & Medicine)     │               │ openai/gpt-oss-120b SOAP Parser   │  │
│  └───────────────┬───────────────┘               └───────────────────────────────────┘  │
│                  │                                                                      │
│                  │ Verified Clinical Schema                                             │
│                  ▼                                                                      │
│  ┌───────────────────────────────┐                                                      │
│  │ Gnani AI Timbre v2.5 (TTS)    │ ──MP3 Audio──► Nalini Indic Spoken Briefing          │
│  └───────────────────────────────┘                                                      │
└──────────────────────────────────────────────┬──────────────────────────────────────────┘
                                               │ REST API Response
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ NEXT.JS APP ROUTER WORKSPACE (Frontend UI)                                              │
│                                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  Tactile Clinical Note  │  │   Prescription Card     │  │   Voice Summary Player  │  │
│  │  (SOAP 2-Column Grid)   │  │   (Dosage / Frequency)  │  │   (Animated Waveform)   │  │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  │
│                                              │                                          │
│                                              ▼                                          │
│                           ┌─────────────────────────────────────┐                       │
│                           │ Vector PDF Generation & EMR Export  │                       │
│                           └─────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Empirical Evaluation & Benchmarks

AarogyaNote was evaluated on a controlled evaluation suite of synthetic outpatient consultations (`n=4`) spanning major OPD clinical domains:

1. **Viral Fever & Body Ache** (`transcript1.wav` — 60.5s)
2. **Gastritis & Functional Dyspepsia** (`transcript2.wav` — 62.1s)
3. **Upper Respiratory Infection** (`transcript3.wav` — 71.4s)
4. **Knee Osteoarthritis & Vitamin D Deficiency** (`transcript4.wav` — 64.8s)

### 1. Clinical Extraction Accuracy (Groq `gpt-oss-120b`)
Evaluated against hand-curated gold-standard clinical notes across 10 distinct narrative and prescription categories:

| Clinical Field | Score | Performance Notes |
| :--- | :---: | :--- |
| **Chief Complaint** | **100.0%** | Perfect symptom identification across all 4 scenarios |
| **Examination Findings** | **100.0%** | Accurately distinguished clinician exam from patient remarks |
| **Medicine Duration** | **92.0%** | High precision on treatment length (e.g., *5 days, 1 month*) |
| **Medicine Dosage** | **83.0%** | Exact dosage identification (e.g., *650mg, 40mg*) |
| **Follow-Up Schedule** | **75.0%** | Correct review timelines extracted |
| **Medicine Name** | **75.0%** | Exact pharmaceutical extraction in 3 out of 4 consultations |
| **Provisional Diagnosis** | **75.0%** | Correct diagnostic assessments with uncertainty preserved |
| **Advice & Precautions** | **62.0%** | Captured dietary instructions and rest advice |
| **History of Illness (HPI)**| **50.0%** | Chronology preserved; partial detail on secondary triggers |
| **Overall Macro Accuracy** | **73.8%** | **Strong clinical extraction baseline** |

### 2. End-to-End Latency Benchmark
Measured with live cloud API calls:

| Pipeline Stage | Mean Latency | Latency Range | Notes |
| :--- | :---: | :---: | :--- |
| **Gnani Prisma v2.5 (STT)** | **3.29s** | 1.33s – 8.86s | Sequential chunked acoustic ingestion |
| **Groq LPU Extraction** | **3.02s** | 2.12s – 3.92s | Strict JSON schema generation |
| **Total Pipeline Latency** | **6.31s** | 3.71s – 12.79s | Complete consultation to clinical draft |
| **Gnani Timbre v2.5 (TTS)** | **3.50s** | 2.80s – 4.20s | Spoken Hindi briefing generation |

> [!NOTE]
> **STT Script Sensitivity**: Prisma returns native Devanagari script for Hindi speech. When compared against romanized reference scripts without transliteration normalization, raw string-level WER/CER overstates lexical errors. In clinical practice, semantic extraction accuracy remains high (73.8%).

---

## Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router) | `15.5` | React server/client architecture, modern routing |
| **UI Library** | [React](https://react.dev/) | `19.1` | Component UI and reactive state |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.9` | End-to-end type safety |
| **Styling** | Tactile Neumorphic CSS | Custom | Dual-shadow medical design system |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer-motion.com/) | Latest | Clean iconography and micro-interactions |
| **Smooth Scrolling** | [Lenis](https://github.com/darkroomengineering/lenis) | `1.1` | Inertial momentum scrolling |
| **Document Export** | [@react-pdf/renderer](https://react-pdf.org/) | `4.3` | Client-side vector PDF generation |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) | `0.115` | High-throughput async REST API |
| **Validation** | [Pydantic v2](https://docs.pydantic.dev/) | `2.11` | Strict clinical schema modeling |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | `0.34` | Production ASGI HTTP server |
| **Speech Recognition** | **Gnani AI Prisma v2.5** | `hi-IN` | Indic code-mixed speech-to-text |
| **Speech Synthesis** | **Gnani AI Timbre v2.5** | `Nalini` | Natural Indic text-to-speech |
| **LLM Inference** | [Groq](https://groq.com/) (`openai/gpt-oss-120b`) | Latest | Low-latency structured clinical parsing |

---

## Quickstart & Installation

### Prerequisites
- **Node.js**: `v20.9.0` or higher
- **Python**: `3.11` or higher
- **Gnani AI API Key**: [vachana.ai](https://vachana.ai)
- **Groq API Key**: [console.groq.com](https://console.groq.com)

---

### Step 1: Backend Setup

```bash
# 1. Clone repository and navigate to backend
git clone https://github.com/your-username/aarogya-note.git
cd aarogya-note/backend

# 2. Create and activate a Python virtual environment
# Windows (PowerShell):
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS:
python3 -m venv .venv
source .venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Create your environment configuration file
cp .env.example .env
```

Configure your credentials in `backend/.env`:

```ini
# Gnani AI Configuration
GNANI_API_KEY=your_gnani_api_key_here
GNANI_API_BASE_URL=https://api.vachana.ai
PRISMA_URL=https://api.vachana.ai/stt/v3
TIMBRE_URL=https://api.vachana.ai/api/v1/tts/inference
PRISMA_MODEL=prisma-v2.5
PRISMA_LANGUAGE_CODE=hi-IN
TIMBRE_MODEL=timbre-v2.5
TIMBRE_VOICE=Nalini
TIMBRE_LANGUAGE=auto

# Groq LLM Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_URL=https://api.groq.com/openai/v1/chat/completions
EXTRACTION_MODEL=openai/gpt-oss-120b

# App Configuration
FRONTEND_ORIGINS=http://localhost:3000
MAX_AUDIO_SIZE_MB=30
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```
*API will run at `http://localhost:8000`. OpenAPI documentation is available at `http://localhost:8000/docs`.*

---

### Step 2: Frontend Setup

Open a new terminal window from the project root:

```bash
# 1. Navigate to project root
cd aarogya-note

# 2. Install Node dependencies
npm install

# 3. Create frontend environment file
cp .env.local.example .env.local
```

Ensure `.env.local` points to your backend:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the Next.js development server:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Testing with Sample Consultations

The repository comes bundled with 4 pre-recorded consultation audio files ready for immediate testing:

```
samples/tts-generations/
├── transcript1.wav    # Scenario 1: Viral fever, severe body ache, temperature 102°F
├── transcript2.wav    # Scenario 2: Chronic dyspepsia, acidity, bloating
├── transcript3.wav    # Scenario 3: Acute upper respiratory tract infection, sore throat
└── transcript4.wav    # Scenario 4: Bilateral knee pain, osteoarthritis, vitamin D deficiency
```

Simply drag and drop any of these files into the AarogyaNote dashboard to experience the end-to-end pipeline in action.

---

## API Reference

### `POST /api/process`
End-to-end consultation processing endpoint. Ingests raw audio and returns both the verbatim transcript and extracted clinical schema.

- **Request**: `multipart/form-data`
  - `file`: Audio file (`audio/wav`, `audio/mpeg`, `audio/mp4`, `audio/webm`)
- **Response**: `200 OK`
```json
{
  "transcription": "नमस्ते, बताइए क्या प्रॉब्लम है सर 3 दिन से बुखार आ रहा है...",
  "clinical_data": {
    "chief_complaint": "Fever for 3 days with severe body ache and lack of energy",
    "history_of_present_illness": "Fever started 3 days ago, reaching up to 102°F...",
    "examination_findings": "Temperature 100°F, throat mildly congested, chest clear",
    "provisional_diagnosis": "Probable viral fever",
    "medicines": [
      {
        "name": "Paracetamol",
        "dosage": "650 mg",
        "frequency": "Thrice daily after meals",
        "duration": "3 days"
      },
      {
        "name": "Cetirizine",
        "dosage": "10 mg",
        "frequency": "Once daily at bedtime",
        "duration": "3 days"
      }
    ],
    "advice": "Drink plenty of water and ORS, adequate bed rest",
    "follow_up": "Review after 3 days if fever does not subside"
  }
}
```

### `POST /api/generate-summary`
Generates a natural spoken briefing of the clinical record via **Gnani Timbre**.

- **Request**: `application/json`
  - Body: `{ "clinical_data": { ... } }`
- **Response**: `200 OK`
```json
{
  "audio_base64": "UklGRi...",
  "mime_type": "audio/mpeg"
}
```

### `POST /api/transcribe`
Standalone speech-to-text endpoint powered by **Gnani Prisma v2.5**.

- **Request**: `multipart/form-data` (`file`)
- **Response**: `{ "transcription": "..." }`

### `POST /api/extract`
Standalone structured extraction endpoint using Groq LPU inference.

- **Request**: `{ "transcription": "..." }`
- **Response**: `ClinicalData` JSON object.

---

## Project Structure

```
aarogya-note/
├── app/
│   ├── globals.css              # Tactile Neumorphic design system & responsive layout tokens
│   ├── layout.tsx               # Root layout, metadata configuration & Inter typography
│   ├── page.tsx                 # Main clinical dashboard, upload zone & state orchestrator
│   ├── icon.png                 # Application favicon
│   └── apple-icon.png           # iOS home screen touch icon
├── components/
│   ├── AudioUploader.tsx        # Drag-and-drop recording cartridge with format validation
│   ├── ClinicalNote.tsx         # Tactile 2-column SOAP clinical note viewer
│   ├── ClinicalNotePdf.tsx      # Declarative vector PDF template (@react-pdf/renderer)
│   ├── PrescriptionCard.tsx     # Formatted prescription card with dose, frequency & duration chips
│   ├── ProcessingLoader.tsx     # Neumorphic progress loader with AarogyaNote emblem
│   ├── SmoothScroll.tsx         # Lenis smooth scrolling container
│   ├── ThemeToggle.tsx          # Dual-shadow light/dark mode surface switcher
│   └── VoiceSummaryPlayer.tsx   # Audio player with animated soundwave visualizer
├── lib/
│   ├── api.ts                   # Typed HTTP client for FastAPI backend endpoints
│   ├── clinical-pdf.ts          # Client-side PDF compilation and download trigger
│   ├── logo-base64.ts           # Embedded vector-compatible asset for PDF headers
│   └── types.ts                 # TypeScript domain types for clinical data and responses
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── gnani.py         # Prisma STT, Timbre TTS & Groq LLM integration adapters
│   │   ├── config.py            # Pydantic Settings configuration & .env path resolver
│   │   ├── main.py              # FastAPI app initialization, CORS & lifespan hooks
│   │   ├── prompts.py           # Clinical SOAP schema extraction system prompt
│   │   ├── routes.py            # REST API endpoints (/process, /transcribe, /extract, /summary)
│   │   └── schemas.py           # Pydantic v2 validation models
│   ├── requirements.txt         # Python runtime dependencies
│   └── .env.example             # Backend environment template
├── samples/
│   ├── eval/                    # Benchmark scripts, latency stats & evaluation reports
│   ├── gold/                    # Reference gold-standard clinical notes
│   ├── hypotheses/              # Raw Prisma STT transcript outputs
│   ├── transcripts/             # Verified consultation dialogue references
│   └── tts-generations/         # 4 evaluation audio recordings (.wav)
├── assets/
│   └── AarogyaNote_Logo.png     # Official high-resolution brand emblem
├── README.md                    # Project documentation
└── package.json                 # Node dependencies and build scripts
```

---

## Future Roadmap

- [ ] **EHR / EMR Integration (FHIR & HL7)**: Direct export to hospital management systems following Ayushman Bharat Digital Mission (ABDM) guidelines.
- [ ] **Streaming Speech Recognition**: Real-time WebSocket streaming transcription allowing notes to form as the patient speaks.
- [ ] **Expanded Indic Languages**: Deep acoustic fine-tuning for regional Indian dialects including Tamil, Telugu, Kannada, Bengali, and Marathi.
- [ ] **Clinician Inline Editing & Audit Log**: In-place note editing with change tracking prior to final digital signature.

---

## Clinical Safety & Disclaimer

> [!CAUTION]
> **Important Medical Notice**: AarogyaNote is an AI-assisted documentation drafting tool created for research and demonstration purposes. All generated clinical notes, provisional diagnoses, and prescriptions are **draft suggestions** and must be reviewed, verified, and signed off by a licensed medical practitioner before use in clinical care. AarogyaNote does not make autonomous clinical judgments or replace professional medical expertise.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

<div align="center">

**Built with pride for the Gnani AI Internship Submission**  
*Empowering clinicians, one consultation at a time.*

</div>
