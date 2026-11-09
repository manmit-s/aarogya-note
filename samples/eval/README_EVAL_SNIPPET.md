## Evaluation

**Evaluation (n=4 synthetic consultations).** We created four controlled Hinglish doctor–patient scripts covering viral fever, gastritis/acidity, upper respiratory infection, and knee pain with vitamin D deficiency, then synthesized them with TTS. These are synthetic samples, not real patient data.

- Prisma v2.5 (`hi-IN`): average WER **103.1%** and CER **85.0%** against romanized reference scripts. Prisma returned Devanagari for much of the Hindi speech; scores are script-sensitive and are not transliteration-normalized.
- Groq structured extraction (`openai/gpt-oss-120b`): manually adjudicated field accuracy **73.8%**; medicine name + stated dose were exact in **2/4** samples. There was **1 unsupported medicine entry** and **1 unsupported diagnosis label** in the four outputs.
- Mean adapter-call latency: **6.31s** end to end (**3.29s** Prisma + **3.02s** extraction; range **3.71–12.79s**).

Full synthetic references, audio, Prisma hypotheses, gold notes, model outputs, scoring details, and per-sample latency are in [`samples/`](samples/). With n=4 and script-sensitive STT scoring, these results are an initial controlled evaluation rather than a general performance claim.
