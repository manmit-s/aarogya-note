# AarogyaNote (आरोग्यNote)

<div align="center">

[![aarogya-note.png](https://i.postimg.cc/8cwyPXHv/aarogya-note.png)](https://postimg.cc/tnZdB58R)

### ***Ambient Clinical Documentation & Prescription Intelligence for Indian Healthcare***

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

**AarogyaNote** is an AI-assisted clinical documentation workspace designed around outpatient consultations in the Indian healthcare context.

Doctor–patient conversations in India frequently involve code-mixed speech, particularly Hinglish, where Hindi and English are used naturally within the same sentence. Turning these conversations into structured clinical documentation can be time-consuming, especially when important symptoms, examination findings, and prescription details need to be recorded accurately.

AarogyaNote takes an uploaded consultation recording and processes it through an AI pipeline to generate:

- **A verbatim-style transcript** using Gnani AI Prisma v2.5.
- **Structured SOAP clinical notes** using Groq-hosted `openai/gpt-oss-120b`.
- **A draft prescription card** containing extracted medicine names, dosage, frequency, and duration.
- **A spoken audio briefing** generated using Gnani AI Timbre v2.5.
- **An exportable PDF** of the generated clinical documentation.

The goal is to demonstrate how Indic speech recognition and language models can assist with clinical documentation workflows. The generated output is a draft and requires review by a qualified medical professional.

---

## Why This Project (Gnani AI Internship Submission)

This project was developed as a submission for the **Gnani AI Great Indian AI Internship Challenge**.

### Solving the Code-Mixed Acoustic Reality

```text
   ┌────────────────────────────────────────────────────────────────────────┐
   │                        THE REALITY OF INDIAN OPDs                      │
   │                                                                        │
   │  Doctor: "Aapko kab se fever mehsoos ho raha hai?"                     │
   │  Patient: "Sir, 3 din se hai... sath me pet me burning sensation hoti" │
   │  Doctor: "Theek hai. Paracetamol 650mg TDS le lijiye after meals."     │
   │                                                                        │
   │  [!] Code-mixed speech: Hindi, English & local clinical terms         │
   │  [*] Gnani Prisma v2.5: Used for Indic speech transcription            │
   └────────────────────────────────────────────────────────────────────────┘
```

Indian clinical conversations are rarely limited to textbook English or formal Hindi. They often move naturally between languages and contain colloquial symptom descriptions, medicine names, and regional expressions.

For example:

> **"Pet me burning sensation ho rahi hai after meals"**

> **"Gale me kharash hai aur kal raat se chills feel ho rahe hain"**

These language patterns create challenges for speech recognition and downstream information extraction. AarogyaNote explores a workflow using Gnani AI's voice models to process such recordings and turn the resulting transcript into structured documentation.

### Gnani AI Integration

AarogyaNote uses two models from Gnani AI's voice intelligence platform:

1. **Gnani AI Prisma v2.5 (Indic Speech Recognition)**
   - Used to convert uploaded consultation audio into text.
   - Configured with the `hi-IN` language code.
   - The resulting transcript is passed to the clinical extraction stage.
   - Recognition quality is evaluated separately from downstream clinical field extraction.

2. **Gnani AI Timbre v2.5 (Indic Speech Synthesis)**
   - Used to generate spoken summaries from the extracted clinical data.
   - Uses the `Nalini` voice configuration.
   - Provides an audio-based way to review the generated documentation.

3. **Clinical Documentation Workflow**
   - Converts an unstructured transcript into a structured clinical draft.
   - Separates consultation details, examination findings, provisional diagnosis, advice, and medication information.
   - Provides a PDF export for reviewing or retaining the generated draft.

Rather than building another general-purpose chatbot, AarogyaNote demonstrates a focused application of speech AI and language models to a specific documentation workflow.

---

## Key Features

### Code-Mixed Multilingual Speech Recognition

- Accepts consultation recordings in **MP3, WAV, M4A, and WebM** formats, subject to the configured upload-size limit.
- Uses **Gnani Prisma v2.5** with the `hi-IN` language configuration.
- Includes an in-memory audio chunking pipeline for supported WAV processing.
- Processes audio through the Prisma API and passes the resulting transcript to the extraction pipeline.

**Implementation note:** The current chunking implementation uses Python's `wave` module and should not be interpreted as a format-independent streaming pipeline. Processing is based on uploaded recordings, not live microphone transcription.

### Structured SOAP Clinical Extraction

The transcript is passed to a Groq-hosted language model using a structured extraction prompt. The generated response is validated against Pydantic schemas.

The extracted documentation includes:

- **Chief Complaint:** Presenting symptoms and the primary reason for consultation.
- **History of Present Illness (HPI):** Symptom progression, duration, and relevant details from the conversation.
- **Examination Findings:** Clinician-reported observations and physical findings.
- **Provisional Diagnosis:** The diagnostic assessment extracted from the consultation.
- **Advice & Lifestyle Guidance:** Instructions such as hydration, dietary precautions, and rest.
- **Follow-Up Timeline:** Review instructions and follow-up information.
- **Medication Details:** Medicine name, dosage, frequency, and duration where available in the transcript.

The output is schema-validated, but schema validation does not establish that the generated clinical information is medically correct.

### Intelligent Draft Prescription Card

- Formats extracted medication details into structured, readable cards.
- Displays available metadata for **Dose**, **Frequency**, and **Duration**.
- Makes the extracted prescription easier to inspect.
- Includes clinician-review notices to make clear that generated medication information is not an authorized prescription.

### Spoken Audio Briefing (Gnani Timbre TTS)

- Generates spoken summaries using **Gnani Timbre v2.5**.
- Uses the configured `Nalini` voice.
- Includes a custom audio player with play/pause controls, progress seeking, and animated soundwave visualization.

### Tactile Neumorphic Design System

- Custom-built medical interface inspired by tactile skeuomorphism and soft UI design.
- Dual-shadow light/dark surface tokens (`--neu-raised-*`, `--neu-inset-*`).
- Specular highlights, etched borders, and responsive layout components.
- Designed to keep the generated documentation and prescription details easy to inspect.

### One-Click Clinical PDF Export

- Client-side PDF generation through `@react-pdf/renderer`.
- Formats the structured note, prescription details, patient metadata, and doctor signature area into a downloadable document.
- The generated PDF is an export of the AI-produced draft, not an integrated hospital record.

### Ephemeral In-Memory Processing

- Consultation recordings and uploaded audio buffers are handled in-memory by the application server during processing.
- The application does not intentionally persist raw audio recordings or consultation data to a local database or application disk storage.
- Audio and derived content are transmitted to external AI providers, including Gnani AI and Groq, to perform the requested inference.
- Handling of data by those providers is governed by their respective policies and applicable agreements.

AarogyaNote is a **research and demonstration prototype**, not a certified clinical deployment. In-memory handling by the application server does not imply that upstream providers or hosting infrastructure have zero retention. Production deployment would require appropriate security controls, provider agreements, and applicable data-protection and healthcare compliance reviews.

---

## System Architecture

AarogyaNote operates as a decoupled full-stack clinical workspace:

1. **Audio Ingestion & Slicing:** Audio uploads are partitioned into in-memory 25-second windows via the Python standard library `wave` module to stay strictly within real-time REST duration thresholds without hitting batch queue delays.
2. **Speech Recognition:** Transcribed via **Gnani AI Prisma v2.5** (`hi-IN`) with specialized Indic code-mixed vocabulary handling.
3. **Structured SOAP Extraction:** Extracted and validated into standardized clinical fields using Groq LPU inference (`openai/gpt-oss-120b`) and Pydantic v2 schemas.
4. **Multimodal Briefing & Review:** Synthesizes spoken audio summaries via **Gnani AI Timbre v2.5** (`Nalini` voice) and renders a dual-shadow tactile Neumorphic workspace with one-click vector PDF generation.

For complete architectural diagrams, component responsibilities, and dataflow specifications:  
**[View Full System Architecture Guide](docs/ARCHITECTURE.md)**

---

## Empirical Evaluation & Benchmarks

AarogyaNote was evaluated on a controlled benchmark of **four synthetic outpatient consultations** generated via Gnani Timbre TTS spanning viral fever, dyspepsia, upper respiratory infection, and osteoarthritis:

- **Clinical Field Agreement:** **73.8%** macro agreement across 10 clinical fields (100% agreement on Chief Complaints and Physical Exam observations; 83% on Dosage; 92% on Duration).
- **End-to-End Pipeline Latency:** Mean of **6.31s** (3.29s Gnani Prisma STT + 3.02s Groq extraction).
- **Speech Recognition Analysis:** Detailed evaluation of raw WER/CER metrics and the impact of script normalization (Devanagari output vs. Romanized reference scripts).

For the complete evaluation methodology, dataset breakdowns, scoring rubrics, and detailed latency metrics:  
**[View Full Evaluation & Benchmarks Report](docs/EVALUATION.md)**

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router) | `15.5` | Application routing and frontend architecture |
| **UI Library** | [React](https://react.dev/) | `19.1` | Component-based user interface |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.9` | Typed frontend development |
| **Styling** | Tactile Neumorphic CSS | Custom | Light/dark design system |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) | As configured | Icons and interface animations |
| **Smooth Scrolling** | [Lenis](https://github.com/darkroomengineering/lenis) | `1.1` | Smooth scrolling |
| **Document Export** | [@react-pdf/renderer](https://react-pdf.org/) | `4.3` | Client-side PDF generation |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) | `0.115` | Async REST API |
| **Validation** | [Pydantic v2](https://docs.pydantic.dev/) | `2.11` | Structured data validation |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | `0.34` | Python application server |
| **Speech Recognition** | **Gnani AI Prisma v2.5** | `hi-IN` | Indic speech-to-text |
| **Speech Synthesis** | **Gnani AI Timbre v2.5** | `Nalini` | Indic text-to-speech |
| **LLM Inference** | [Groq](https://groq.com/) (`openai/gpt-oss-120b`) | As configured | Structured clinical extraction |

---

## Quickstart & Installation

### Prerequisites

- **Node.js:** `v20.9.0` or higher
- **Python:** `3.11` or higher
- **Gnani AI API Key:** [vachana.ai](https://vachana.ai)
- **Groq API Key:** [console.groq.com](https://console.groq.com)

---

### Step 1: Backend Setup

```bash
# 1. Clone repository and navigate to backend
git clone https://github.com/manmit-s/aarogya-note.git

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

**API will run at `http://localhost:8000`. OpenAPI documentation is available at `http://localhost:8000/docs`.**

---

### Step 2: Frontend Setup

Open a new terminal window from the project root:

```bash
# 1. Navigate to project root
cd aarogya-note

# 2. Install Node dependencies
npm install
```

Create a frontend environment file named `.env.local` in the project root:

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

The repository includes four generated consultation audio files for testing the end-to-end workflow:

```text
samples/tts-generations/

├── transcript1.wav    # Scenario 1: Viral fever, severe body ache, temperature 102°F
├── transcript2.wav    # Scenario 2: Chronic dyspepsia, acidity, bloating
├── transcript3.wav    # Scenario 3: Acute upper respiratory tract infection, sore throat
└── transcript4.wav    # Scenario 4: Bilateral knee pain, osteoarthritis, vitamin D deficiency
```

Select or drag and drop one of these recordings into the AarogyaNote dashboard to run it through the application pipeline.

These are synthetic demonstration recordings, not real patient consultations.

---

## API Reference

The FastAPI backend exposes asynchronous RESTful endpoints for speech recognition, structured clinical extraction, audio summarization, and end-to-end processing.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/process` | End-to-end pipeline: Audio file to transcript and structured clinical data |
| `POST` | `/api/generate-summary` | Generates a spoken briefing via Gnani Timbre v2.5 (`Nalini` voice) |
| `POST` | `/api/transcribe` | Standalone speech-to-text powered by Gnani Prisma v2.5 (`hi-IN`) |
| `POST` | `/api/extract` | Standalone clinical JSON extraction via Groq LPU inference |

For complete request/response schemas, JSON payloads, error status codes, and OpenAPI documentation:  
**[View Full API Reference Guide](docs/API.md)**

---

## Project Structure

```text
aarogya-note/
│
├── app/
│   ├── globals.css              # Tactile Neumorphic design system & responsive layout tokens
│   ├── layout.tsx               # Root layout, metadata configuration & typography
│   ├── page.tsx                 # Main clinical dashboard, upload zone & state orchestrator
│   ├── icon.png                 # Application favicon
│   └── apple-icon.png           # iOS home screen touch icon
│
├── components/
│   ├── AudioUploader.tsx        # Drag-and-drop recording upload component
│   ├── ClinicalNote.tsx         # Tactile 2-column SOAP clinical note viewer
│   ├── ClinicalNotePdf.tsx      # Declarative vector PDF template
│   ├── PrescriptionCard.tsx     # Prescription card with dose, frequency & duration
│   ├── ProcessingLoader.tsx     # Processing loader
│   ├── SmoothScroll.tsx         # Lenis smooth scrolling container
│   ├── ThemeToggle.tsx          # Light/dark mode switcher
│   └── VoiceSummaryPlayer.tsx   # Audio player with animated soundwave visualizer
│
├── lib/
│   ├── api.ts                   # Typed HTTP client for FastAPI endpoints
│   ├── clinical-pdf.ts          # Client-side PDF compilation and download
│   ├── logo-base64.ts           # Embedded logo asset for PDF headers
│   └── types.ts                 # TypeScript domain types and response definitions
│
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── gnani.py         # Prisma STT, Timbre TTS & Groq integration
│   │   ├── config.py            # Pydantic Settings configuration
│   │   ├── main.py              # FastAPI initialization, CORS & lifespan hooks
│   │   ├── prompts.py           # Clinical SOAP extraction system prompt
│   │   ├── routes.py            # REST API endpoints
│   │   └── schemas.py           # Pydantic v2 validation models
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Backend environment template
│
├── samples/
│   ├── eval/                    # Benchmark scripts, latency stats & evaluation reports
│   ├── gold/                    # Reference clinical notes
│   ├── hypotheses/              # Raw Prisma STT transcript outputs
│   ├── transcripts/             # Consultation dialogue references
│   └── tts-generations/         # Four generated evaluation audio recordings
│
├── assets/
│   └── AarogyaNote_Logo.png     # Brand emblem
│
├── README.md                    # Project documentation
└── package.json                 # Node dependencies and build scripts
```

---

## Future Roadmap

- [ ] **EHR / EMR Integration (FHIR & HL7):** Explore interoperability with hospital information systems and relevant Indian digital health standards.
- [ ] **Streaming Speech Recognition:** Real-time WebSocket transcription, allowing notes to form as the consultation progresses.
- [ ] **Expanded Indic Languages:** Evaluate and extend support for regional languages including Tamil, Telugu, Kannada, Bengali, and Marathi.
- [ ] **Clinician Inline Editing & Audit Log:** Enable editing of generated notes with change tracking before final approval.
- [ ] **Improved Evaluation:** Expand the synthetic test set, add transliteration-aware WER/CER normalization, and introduce more systematic field-level evaluation.
- [ ] **Clinical Error Handling:** Improve safeguards for uncertain medicine names, dosage values, diagnosis extraction, and missing information.

---

## Clinical Safety & Disclaimer

> [!CAUTION]
>
> **Important Medical Notice:** AarogyaNote is an AI-assisted documentation drafting tool created for research and demonstration purposes. All generated clinical notes, provisional diagnoses, and prescription details are **draft suggestions**. They must be reviewed, corrected where necessary, and approved by a licensed medical practitioner before use in clinical care.
>
> AarogyaNote does not make autonomous clinical decisions, authorize medication dispensing, or replace professional medical expertise. The application has not been clinically validated for independent use in patient care.

---

## License

No license file is currently specified in this repository. Unless a license is added, the project should not be assumed to be available for unrestricted reuse, modification, or redistribution.

---

<div align="center">

**Built with pride for the Gnani AI Great Indian AI Internship Challenge**

*Empowering clinicians, one consultation at a time.*

</div>