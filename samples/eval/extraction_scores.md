# Clinical extraction evaluation

**Controlled synthetic TTS samples (n=4).** Groq extraction model: `openai/gpt-oss-120b`. Each saved extraction was generated from its Prisma hypothesis (`samples/hypotheses/`) and compared with the hand-written reference-derived gold note (`samples/gold/`). No patient data was used.

## Per-sample field scores

Scores are manually adjudicated: 1.0 = exact/near-exact meaning, 0.5 = partially correct/incomplete, 0.0 = missing, wrong, or unsupported. The four medicine columns average each detail across the sample's medicine list; omitted medicines score zero. Field accuracy is the macro average of 10 categories (six narrative fields plus four medicine detail categories) over four samples.

| Sample | Chief complaint | HPI | Examination | Diagnosis | Medicine name | Medicine dosage | Medicine frequency | Medicine duration | Advice | Follow-up | Mean |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| transcript1 (Viral fever) | 1.00 | 0.50 | 1.00 | 1.00 | 1.00 | 1.00 | 0.50 | 1.00 | 0.50 | 0.50 | 80.0% |
| transcript2 (Gastritis/acidity) | 1.00 | 0.50 | 1.00 | 0.50 | 1.00 | 1.00 | 0.50 | 1.00 | 1.00 | 1.00 | 85.0% |
| transcript3 (Upper respiratory infection) | 1.00 | 0.50 | 1.00 | 1.00 | 0.67 | 1.00 | 0.00 | 1.00 | 0.50 | 0.50 | 71.7% |
| transcript4 (Knee pain + vitamin D) | 1.00 | 0.50 | 1.00 | 0.50 | 0.33 | 0.33 | 0.00 | 0.67 | 0.50 | 1.00 | 58.3% |
| **Overall** | 1.00 | 0.50 | 1.00 | 0.75 | 0.75 | 0.83 | 0.25 | 0.92 | 0.62 | 0.75 | **73.8%** |

## Summary metrics

| Metric | Score |
|---|---:|
| Overall field accuracy (case-macro) | **73.8%** |
| Medicine name + stated dose exact (all items in a sample) | **2/4 samples** |
| Hallucinated medicine entries | **1** (1/9 = 11.1% of extracted medicine rows) |
| Unsupported diagnosis label | **1** |
| Unsupported medicine/diagnosis items / medicine rows (requested denominator) | **2/9 = 22.2%** |
| Provisional diagnosis fully correct | **2/4 samples** (2 additional partial) |
| Per-medicine-detail weighted field accuracy (sensitivity check) | **69.5%** |

The combined hallucination ratio follows the requested numerator (unsupported medicines plus unsupported diagnosis labels) over extracted medicine rows; the medicine-only rate is also shown because that is the comparable denominator. The unsupported medicine entry was `Beta steam lo` in sample 3 (the reference says Betadine gargle); the unsupported diagnosis label was `Functional dyspepsia` in sample 2 (the doctor said acidity/gastritis symptoms).

Other notable errors: sample 1 omitted the stated once-nightly Cetirizine timing; sample 3 added unsupported twice-daily frequencies; sample 4 output 63,000 instead of 60,000 IU, changed the calcium frequency, and omitted Aceclofenac + Paracetamol. These are small-sample manual judgments, not clinician-validated findings.

Gold notes: `samples/gold/`; model JSON: `samples/extractions/`; source references: `samples/transcripts/`.


## Adapter-call latency

Sequential local adapter timings, including the provider round trips. These are not benchmark-grade latency estimates.

| Sample | Prisma STT (s) | Groq extraction (s) | End to end (s) |
|---|---:|---:|---:|
| transcript1 | 1.590 | 2.126 | 3.715 |
| transcript2 | 1.355 | 2.972 | 4.327 |
| transcript3 | 1.335 | 3.065 | 4.400 |
| transcript4 | 8.868 | 3.920 | 12.789 |
| **Average** | **3.287** | **3.021** | **6.308** |

These timings cover sequential calls to the existing backend adapters and include provider round trips. The small sample is not a benchmark-grade latency estimate.
