# API Reference

The AarogyaNote FastAPI backend exposes RESTful endpoints for speech recognition, structured clinical extraction, audio summarization, and end-to-end consultation processing.

**Base URL:** `http://localhost:8000`  
**Interactive OpenAPI Docs:** `http://localhost:8000/docs`

---

## Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/process` | End-to-end pipeline: Audio file to transcript and structured clinical data |
| `POST` | `/api/transcribe` | Standalone speech-to-text using Gnani Prisma v2.5 |
| `POST` | `/api/extract` | Standalone SOAP clinical extraction using Groq LPU |
| `POST` | `/api/generate-summary` | Text-to-speech spoken summary using Gnani Timbre v2.5 |

---

## 1. End-to-End Processing

### `POST /api/process`

Accepts an audio recording of a consultation and returns both the raw transcript and validated clinical note schema.

#### Request
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` *(binary, required)*: Consultation audio recording (`.wav`, `.mp3`, `.m4a`, `.webm`). Maximum size: 30 MB.

#### Response
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "transcription": "नमस्ते, बताइए क्या प्रॉब्लम है सर 3 दिन से बुखार आ रहा है बॉडी भी बहुत दर्द कर रही है बिल्कुल एनर्जी नहीं है टेम्प्रेचर कितना गया है कल रात 102 तक गया था Paracetamol 650 mg TDS ले लीजिए 3 दिन के लिए...",
  "clinical_data": {
    "chief_complaint": "Fever for 3 days with severe body ache and lack of energy",
    "history_of_present_illness": "Fever started 3 days ago, reaching up to 102°F. Associated with body ache and weakness. No abdominal pain or diarrhea reported.",
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
    "advice": "Drink plenty of water and ORS, take complete bed rest, light diet",
    "follow_up": "Review after 3 days if fever does not subside or immediately if red flags occur"
  }
}
```

---

## 2. Audio Summarization

### `POST /api/generate-summary`

Generates an Indic spoken voice summary from structured clinical findings using **Gnani Timbre v2.5**.

#### Request
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "clinical_data": {
    "chief_complaint": "Fever for 3 days with severe body ache",
    "history_of_present_illness": "Started 3 days ago, up to 102°F",
    "examination_findings": "Temperature 100°F",
    "provisional_diagnosis": "Probable viral fever",
    "medicines": [
      {
        "name": "Paracetamol",
        "dosage": "650 mg",
        "frequency": "Thrice daily",
        "duration": "3 days"
      }
    ],
    "advice": "Adequate rest and hydration",
    "follow_up": "Review in 3 days"
  }
}
```

#### Response
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "audio_base64": "UklGRi...",
  "mime_type": "audio/mpeg"
}
```

---

## 3. Standalone Speech-to-Text

### `POST /api/transcribe`

Transcribes an audio file into text using **Gnani Prisma v2.5** with Indic code-mixed vocabulary handling.

#### Request
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` *(binary, required)*: Audio file (`.wav`, `.mp3`, `.m4a`, `.webm`).

#### Response
- **Status:** `200 OK`
```json
{
  "transcription": "नमस्ते, बताइए क्या प्रॉब्लम है..."
}
```

---

## 4. Standalone Clinical Extraction

### `POST /api/extract`

Parses a raw consultation transcript into a validated clinical data schema using Groq LLM inference.

#### Request
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "transcription": "Doctor: Namaste, bataiye kya problem hai. Patient: Sir 3 din se fever hai..."
}
```

#### Response
- **Status:** `200 OK`
- **Body:** Returns `ClinicalData` schema object.

---

## Error Handling & Status Codes

| HTTP Status | Error Detail | Resolution |
|---|---|---|
| `400 Bad Request` | `The uploaded audio file is empty.` | Provide a valid non-empty audio file. |
| `413 Payload Too Large` | `Audio must be 30 MB or smaller.` | Compress audio or shorten the recording duration. |
| `415 Unsupported Media Type` | `Unsupported audio type. Upload MP3, WAV, M4A, or WebM audio.` | Ensure audio MIME type is supported. |
| `502 Bad Gateway` | `Gnani Prisma request failed (HTTP ...)` | Verify `GNANI_API_KEY` and upstream connectivity to `api.vachana.ai`. |
| `503 Service Unavailable` | `Groq extraction is not configured.` | Set `GROQ_API_KEY` in `backend/.env`. |
| `504 Gateway Timeout` | `Prisma transcription timed out.` | Check upstream provider availability. |

