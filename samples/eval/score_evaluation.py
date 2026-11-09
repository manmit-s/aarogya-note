"""Score stored hypotheses with jiwer and render the evaluation reports.

Install jiwer with: python -m pip install -r samples/eval/requirements.txt
The extraction rubric below is a manual adjudication of the saved model JSONs.
"""

from __future__ import annotations

import os
import re
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EVAL_DIR = ROOT / "samples" / "eval"

extra_deps = os.environ.get("AAROGYA_EVAL_DEPS")
if extra_deps:
    sys.path.insert(0, extra_deps)

from jiwer import cer, wer  # noqa: E402


SAMPLES = {
    "transcript1": "Viral fever",
    "transcript2": "Gastritis/acidity",
    "transcript3": "Upper respiratory infection",
    "transcript4": "Knee pain + vitamin D",
}

# Six narrative fields plus the four medicine detail dimensions. Medicine
# dimensions are averaged over the expected/predicted medicine slots per case;
# omitted medicines contribute zeroes. Values follow the rubric in the report.
FIELD_SCORES = {
    "transcript1": {
        "chief_complaint": 1.0,
        "history_of_present_illness": 0.5,
        "examination_findings": 1.0,
        "provisional_diagnosis": 1.0,
        "medicine_name": 1.0,
        "medicine_dosage": 1.0,
        "medicine_frequency": 0.5,
        "medicine_duration": 1.0,
        "advice": 0.5,
        "follow_up": 0.5,
    },
    "transcript2": {
        "chief_complaint": 1.0,
        "history_of_present_illness": 0.5,
        "examination_findings": 1.0,
        "provisional_diagnosis": 0.5,
        "medicine_name": 1.0,
        "medicine_dosage": 1.0,
        "medicine_frequency": 0.5,
        "medicine_duration": 1.0,
        "advice": 1.0,
        "follow_up": 1.0,
    },
    "transcript3": {
        "chief_complaint": 1.0,
        "history_of_present_illness": 0.5,
        "examination_findings": 1.0,
        "provisional_diagnosis": 1.0,
        "medicine_name": 2.0 / 3.0,
        "medicine_dosage": 1.0,
        "medicine_frequency": 0.0,
        "medicine_duration": 1.0,
        "advice": 0.5,
        "follow_up": 0.5,
    },
    "transcript4": {
        "chief_complaint": 1.0,
        "history_of_present_illness": 0.5,
        "examination_findings": 1.0,
        "provisional_diagnosis": 0.5,
        "medicine_name": 1.0 / 3.0,
        "medicine_dosage": 1.0 / 3.0,
        "medicine_frequency": 0.0,
        "medicine_duration": 2.0 / 3.0,
        "advice": 0.5,
        "follow_up": 1.0,
    },
}

EXACT_MEDICINE_NAME_AND_DOSE = {
    "transcript1": True,
    "transcript2": True,
    "transcript3": False,
    "transcript4": False,
}

DIAGNOSIS_SCORES = {
    sample: scores["provisional_diagnosis"]
    for sample, scores in FIELD_SCORES.items()
}


def strip_role_labels(text: str) -> str:
    """Remove non-spoken script headings before comparing acoustic text."""
    return re.sub(r"(?im)^\s*(?:doctor|patient):\s*", "", text)


def markdown_percent(value: float) -> str:
    return f"{100 * value:.1f}%"


def score_stt() -> list[tuple[str, str, float, float]]:
    rows = []
    for sample, domain in SAMPLES.items():
        reference = (ROOT / "samples" / "transcripts" / f"{sample}.txt").read_text(
            encoding="utf-8-sig"
        )
        hypothesis = (ROOT / "samples" / "hypotheses" / f"{sample}.txt").read_text(
            encoding="utf-8-sig"
        )
        reference = strip_role_labels(reference)
        rows.append((sample, domain, wer(reference, hypothesis), cer(reference, hypothesis)))
    return rows


def write_wer_report(rows: list[tuple[str, str, float, float]]) -> None:
    avg_wer = sum(row[2] for row in rows) / len(rows)
    avg_cer = sum(row[3] for row in rows) / len(rows)
    lines = [
        "# STT evaluation",
        "",
        "**Controlled synthetic TTS samples (n=4).** Audio was transcribed through the project's existing Prisma v2.5 adapter with `hi-IN`. The inputs are synthetic, not patient recordings.",
        "",
        "| Sample | Domain | WER | CER |",
        "|---|---|---:|---:|",
    ]
    for sample, domain, sample_wer, sample_cer in rows:
        lines.append(
            f"| {sample} | {domain} | {markdown_percent(sample_wer)} | {markdown_percent(sample_cer)} |"
        )
    lines.extend(
        [
            f"| **Unweighted average** | **4 samples** | **{markdown_percent(avg_wer)}** | **{markdown_percent(avg_cer)}** |",
            "",
            "## Method and limitation",
            "",
            "WER and CER were computed with `jiwer` 4.x. The reference's line-leading `Doctor:` and `Patient:` labels were removed as script metadata; jiwer's default case/whitespace normalization was used, with no transliteration or punctuation normalization. The references are romanized Hinglish while Prisma returned Devanagari for much of the Hindi speech, so these scores are script-sensitive and overstate lexical errors where the words are equivalent across scripts. Treat them as a strict raw-script comparison, not a language-normalized recognition score.",
            "",
            "Raw reference transcripts are in `samples/transcripts/`; raw Prisma outputs are in `samples/hypotheses/`.",
            "",
        ]
    )
    (EVAL_DIR / "wer_results.md").write_text("\n".join(lines), encoding="utf-8")


def write_extraction_report() -> None:
    sample_means = {
        sample: sum(scores.values()) / len(scores)
        for sample, scores in FIELD_SCORES.items()
    }
    overall = sum(sample_means.values()) / len(sample_means)
    # Equal weighting of each individual medicine detail, instead of the
    # case-macro field-category method above.
    narrative_sum = sum(
        FIELD_SCORES[sample][field]
        for sample in FIELD_SCORES
        for field in (
            "chief_complaint",
            "history_of_present_illness",
            "examination_findings",
            "provisional_diagnosis",
            "advice",
            "follow_up",
        )
    )
    medication_detail_points = 26.0
    medication_detail_slots = 40
    row_weighted = (narrative_sum + medication_detail_points) / (
        6 * len(SAMPLES) + medication_detail_slots
    )
    medicine_name_dose_samples = sum(EXACT_MEDICINE_NAME_AND_DOSE.values())
    fully_correct_diagnoses = sum(value == 1.0 for value in DIAGNOSIS_SCORES.values())
    extracted_medicine_rows = 9
    hallucinated_medicines = 1
    unsupported_diagnoses = 1
    combined_hallucination_rate = (
        hallucinated_medicines + unsupported_diagnoses
    ) / extracted_medicine_rows

    field_labels = [
        ("chief_complaint", "Chief complaint"),
        ("history_of_present_illness", "HPI"),
        ("examination_findings", "Examination"),
        ("provisional_diagnosis", "Diagnosis"),
        ("medicine_name", "Medicine name"),
        ("medicine_dosage", "Medicine dosage"),
        ("medicine_frequency", "Medicine frequency"),
        ("medicine_duration", "Medicine duration"),
        ("advice", "Advice"),
        ("follow_up", "Follow-up"),
    ]
    lines = [
        "# Clinical extraction evaluation",
        "",
        "**Controlled synthetic TTS samples (n=4).** Groq extraction model: `openai/gpt-oss-120b`. Each saved extraction was generated from its Prisma hypothesis (`samples/hypotheses/`) and compared with the hand-written reference-derived gold note (`samples/gold/`). No patient data was used.",
        "",
        "## Per-sample field scores",
        "",
        "Scores are manually adjudicated: 1.0 = exact/near-exact meaning, 0.5 = partially correct/incomplete, 0.0 = missing, wrong, or unsupported. The four medicine columns average each detail across the sample's medicine list; omitted medicines score zero. Field accuracy is the macro average of 10 categories (six narrative fields plus four medicine detail categories) over four samples.",
        "",
        "| Sample | " + " | ".join(label for _, label in field_labels) + " | Mean |",
        "|---|" + "---:|" * (len(field_labels) + 1),
    ]
    for sample, domain in SAMPLES.items():
        values = FIELD_SCORES[sample]
        cells = [f"{values[field]:.2f}" for field, _ in field_labels]
        lines.append(
            f"| {sample} ({domain}) | "
            + " | ".join(cells)
            + f" | {sample_means[sample]:.1%} |"
        )
    lines.extend(
        [
            f"| **Overall** | "
            + " | ".join(
                f"{sum(FIELD_SCORES[s][field] for s in SAMPLES) / len(SAMPLES):.2f}"
                for field, _ in field_labels
            )
            + f" | **{markdown_percent(overall)}** |",
            "",
            "## Summary metrics",
            "",
            "| Metric | Score |",
            "|---|---:|",
            f"| Overall field accuracy (case-macro) | **{markdown_percent(overall)}** |",
            f"| Medicine name + stated dose exact (all items in a sample) | **{medicine_name_dose_samples}/4 samples** |",
            f"| Hallucinated medicine entries | **{hallucinated_medicines}** (1/9 = 11.1% of extracted medicine rows) |",
            f"| Unsupported diagnosis label | **{unsupported_diagnoses}** |",
            f"| Unsupported medicine/diagnosis items / medicine rows (requested denominator) | **{hallucinated_medicines + unsupported_diagnoses}/9 = {markdown_percent(combined_hallucination_rate)}** |",
            f"| Provisional diagnosis fully correct | **{fully_correct_diagnoses}/4 samples** (2 additional partial) |",
            f"| Per-medicine-detail weighted field accuracy (sensitivity check) | **{markdown_percent(row_weighted)}** |",
            "",
            "The combined hallucination ratio follows the requested numerator (unsupported medicines plus unsupported diagnosis labels) over extracted medicine rows; the medicine-only rate is also shown because that is the comparable denominator. The unsupported medicine entry was `Beta steam lo` in sample 3 (the reference says Betadine gargle); the unsupported diagnosis label was `Functional dyspepsia` in sample 2 (the doctor said acidity/gastritis symptoms).",
            "",
            "Other notable errors: sample 1 omitted the stated once-nightly Cetirizine timing; sample 3 added unsupported twice-daily frequencies; sample 4 output 63,000 instead of 60,000 IU, changed the calcium frequency, and omitted Aceclofenac + Paracetamol. These are small-sample manual judgments, not clinician-validated findings.",
            "",
            "Gold notes: `samples/gold/`; model JSON: `samples/extractions/`; source references: `samples/transcripts/`.",
            "",
        ]
    )
    latencies = json.loads((EVAL_DIR / "latency.json").read_text(encoding="utf-8"))
    mean_stt = sum(item["stt_seconds"] for item in latencies.values()) / len(latencies)
    mean_extract = sum(item["extraction_seconds"] for item in latencies.values()) / len(latencies)
    mean_e2e = sum(item["end_to_end_seconds"] for item in latencies.values()) / len(latencies)
    min_e2e = min(item["end_to_end_seconds"] for item in latencies.values())
    max_e2e = max(item["end_to_end_seconds"] for item in latencies.values())
    latency_lines = [
        "",
        "## Adapter-call latency",
        "",
        "Sequential local adapter timings, including the provider round trips. These are not benchmark-grade latency estimates.",
        "",
        "| Sample | Prisma STT (s) | Groq extraction (s) | End to end (s) |",
        "|---|---:|---:|---:|",
    ]
    for sample, timing in latencies.items():
        latency_lines.append(
            f"| {sample} | {timing['stt_seconds']:.3f} | "
            f"{timing['extraction_seconds']:.3f} | {timing['end_to_end_seconds']:.3f} |"
        )
    latency_lines.append(
        f"| **Average** | **{mean_stt:.3f}** | **{mean_extract:.3f}** | **{mean_e2e:.3f}** |"
    )
    lines.extend(latency_lines)
    lines.extend(
        [
            "",
            "These timings cover sequential calls to the existing backend adapters and include provider round trips. The small sample is not a benchmark-grade latency estimate.",
            "",
        ]
    )
    (EVAL_DIR / "extraction_scores.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )
    snippet = [
        "## Evaluation",
        "",
        "**Evaluation (n=4 synthetic consultations).** We created four controlled Hinglish doctor–patient scripts covering viral fever, gastritis/acidity, upper respiratory infection, and knee pain with vitamin D deficiency, then synthesized them with TTS. These are synthetic samples, not real patient data.",
        "",
        f"- Prisma v2.5 (`hi-IN`): average WER **{markdown_percent(sum(row[2] for row in score_stt()) / len(SAMPLES))}** and CER **{markdown_percent(sum(row[3] for row in score_stt()) / len(SAMPLES))}** against romanized reference scripts. Prisma returned Devanagari for much of the Hindi speech; scores are script-sensitive and are not transliteration-normalized.",
        f"- Groq structured extraction (`openai/gpt-oss-120b`): manually adjudicated field accuracy **{markdown_percent(overall)}**; medicine name + stated dose were exact in **{medicine_name_dose_samples}/4** samples. There was **1 unsupported medicine entry** and **1 unsupported diagnosis label** in the four outputs.",
        f"- Mean adapter-call latency: **{mean_e2e:.2f}s** end to end (**{mean_stt:.2f}s** Prisma + **{mean_extract:.2f}s** extraction; range **{min_e2e:.2f}–{max_e2e:.2f}s**).",
        "",
        "Full synthetic references, audio, Prisma hypotheses, gold notes, model outputs, scoring details, and per-sample latency are in [`samples/`](samples/). With n=4 and script-sensitive STT scoring, these results are an initial controlled evaluation rather than a general performance claim.",
        "",
    ]
    (EVAL_DIR / "README_EVAL_SNIPPET.md").write_text(
        "\n".join(snippet), encoding="utf-8"
    )


def main() -> None:
    rows = score_stt()
    write_wer_report(rows)
    write_extraction_report()
    print((EVAL_DIR / "wer_results.md").read_text(encoding="utf-8"))
    print((EVAL_DIR / "extraction_scores.md").read_text(encoding="utf-8"))
    print((EVAL_DIR / "README_EVAL_SNIPPET.md").read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
