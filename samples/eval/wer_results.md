# STT evaluation

**Controlled synthetic TTS samples (n=4).** Audio was transcribed through the project's existing Prisma v2.5 adapter with `hi-IN`. The inputs are synthetic, not patient recordings.

| Sample | Domain | WER | CER |
|---|---|---:|---:|
| transcript1 | Viral fever | 104.2% | 83.9% |
| transcript2 | Gastritis/acidity | 106.5% | 83.9% |
| transcript3 | Upper respiratory infection | 103.0% | 85.0% |
| transcript4 | Knee pain + vitamin D | 98.8% | 87.5% |
| **Unweighted average** | **4 samples** | **103.1%** | **85.0%** |

## Method and limitation

WER and CER were computed with `jiwer` 4.x. The reference's line-leading `Doctor:` and `Patient:` labels were removed as script metadata; jiwer's default case/whitespace normalization was used, with no transliteration or punctuation normalization. The references are romanized Hinglish while Prisma returned Devanagari for much of the Hindi speech, so these scores are script-sensitive and overstate lexical errors where the words are equivalent across scripts. Treat them as a strict raw-script comparison, not a language-normalized recognition score.

Raw reference transcripts are in `samples/transcripts/`; raw Prisma outputs are in `samples/hypotheses/`.
