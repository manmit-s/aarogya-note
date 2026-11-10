# AarogyaNote
### AI-Assisted Clinical Documentation for Indian Healthcare

**Project:** [AarogyaNote](https://github.com/manmit-s/aarogya-note)

### Problem
Doctors spend valuable time manually documenting patient consultations. In India, these conversations frequently involve regional languages, code-mixing, and medical terminology, making automated clinical documentation challenging.

### Proposed Solution
AarogyaNote converts recorded doctor-patient consultations into structured clinical documentation using AI. It aims to reduce documentation effort while allowing doctors to focus more on patient care.

### How It Works
1. **Audio Input:** Upload a recorded consultation in supported audio formats.
2. **Speech Recognition:** Gnani AI Prisma v2.5 transcribes the conversation.
3. **Clinical Extraction:** GPT-OSS-120B extracts relevant information into structured SOAP notes.
4. **Validation:** Pydantic validates the generated data structure.
5. **Audio Generation:** Gnani AI Timbre v2.5 generates a spoken clinical summary.
6. **Export:** Generate structured clinical notes, prescription summaries, and downloadable PDFs.

### Technology Stack
- **Frontend:** Next.js, React, TypeScript
- **Backend:** Python, FastAPI, Pydantic
- **Speech-to-Text:** Gnani AI Prisma v2.5
- **LLM:** GPT-OSS-120B via Groq
- **Text-to-Speech:** Gnani AI Timbre v2.5

### Evaluation & Future Scope
Preliminary testing on four synthetic Hinglish consultations achieved 73.8% average field agreement across ten manually evaluated extraction fields. This is an initial evaluation, not clinical accuracy.

A key proposed improvement is evaluating Gnani's Evon model for multilingual clinical information extraction, particularly across Indian regional languages and code-mixed conversations.

### Impact
AarogyaNote demonstrates how Indian-language AI and speech technologies can assist healthcare professionals by reducing repetitive documentation work.

**Note:** AarogyaNote is a prototype clinical documentation assistant. All generated notes and prescriptions require qualified clinician review before clinical use.