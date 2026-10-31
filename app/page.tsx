"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, AudioLines, Check, ChevronDown, Clipboard, ClipboardCheck, FileDown, FileText, Layers3, LockKeyhole, ShieldCheck, Sparkles, Stethoscope, Volume2 } from "lucide-react";
import { AudioUploader } from "@/components/AudioUploader";
import { ClinicalNote } from "@/components/ClinicalNote";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { VoiceSummaryPlayer } from "@/components/VoiceSummaryPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateSummary, processAudio } from "@/lib/api";
import { downloadClinicalPdf } from "@/lib/clinical-pdf";
import type { ClinicalData } from "@/lib/types";

const blank: ClinicalData = { chief_complaint: "", history_of_present_illness: "", examination_findings: "", provisional_diagnosis: "", medicines: [], advice: "", follow_up: "" };

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [clinicalData, setClinicalData] = useState<ClinicalData | null>(null);
  const [transcription, setTranscription] = useState("");
  const [summaryAudio, setSummaryAudio] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => { if (!file) { setPreviewUrl(""); return; } const url = URL.createObjectURL(file); setPreviewUrl(url); return () => URL.revokeObjectURL(url); }, [file]);
  const noteText = useMemo(() => {
    if (!clinicalData) return "";
    const sections = [["Chief complaint", clinicalData.chief_complaint], ["History of present illness", clinicalData.history_of_present_illness], ["Examination findings", clinicalData.examination_findings], ["Provisional diagnosis", clinicalData.provisional_diagnosis], ["Medicines", clinicalData.medicines.map(m => [m.name, m.dosage, m.frequency, m.duration].filter(Boolean).join(" / ")).join("\n")], ["Advice", clinicalData.advice], ["Follow-up", clinicalData.follow_up]];
    return `AAROGYANOTE - CLINICAL NOTE\nDraft for clinician review\n\n${sections.map(([title, body]) => `${title.toUpperCase()}\n${body || "Not mentioned"}`).join("\n\n")}`;
  }, [clinicalData]);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setProcessing(true); setError(""); setClinicalData(null); setTranscription(""); setSummaryAudio(null);
    try { const result = await processAudio(file); setTranscription(result.transcription); setClinicalData(result.clinical_data); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't process this recording. Please try again."); }
    finally { setProcessing(false); }
  }, [file]);

  const handleSummary = async () => {
    if (!clinicalData) return;
    setSummaryLoading(true); setError("");
    try { const result = await generateSummary(clinicalData); setSummaryAudio(`data:${result.mime_type};base64,${result.audio_base64}`); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't create the audio summary."); }
    finally { setSummaryLoading(false); }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(noteText); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setError("Clipboard access is unavailable in this browser."); }
  };

  const handlePdfDownload = async () => {
    if (!clinicalData) return;
    setPdfLoading(true);
    try { await downloadClinicalPdf(clinicalData); }
    catch { setError("We couldn't create the PDF. Please try again."); }
    finally { setPdfLoading(false); }
  };

  return <main>
    <header className="topbar no-print"><a className="brand" href="#top"><span className="brand-mark"><Stethoscope size={20} strokeWidth={1.8} /></span><span>Aarogya<span className="brand-note">Note</span></span></a><nav className="top-links"><a href="#how-it-works">How it works</a><ThemeToggle /><span className="secure-pill"><LockKeyhole size={12} /> Private workspace</span></nav></header>
    <section id="top" className="hero-shell no-print"><div className="hero-copy"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hero-kicker"><span className="pulse-dot" /> BUILT FOR BETTER CARE</motion.div><motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .07 }}>Be present with<br />your <em>patients.</em></motion.h1><motion.p className="hero-description" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .13 }}>Let AarogyaNote take care of the notes. Turn your consultation recording into a clear, structured clinical draft in moments.</motion.p><motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}><span><ShieldCheck size={15} /> Clinician-reviewed drafts</span><i /> <span><LockKeyhole size={14} /> Private by design</span></motion.div></div><motion.div className="hero-card neu-card" initial={{ opacity: 0, y: 20, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: .15, duration: .6 }}><div className="hero-card-top"><span className="hero-card-badge"><Activity size={14} /> VISIT NOTE</span><span className="hero-card-date">TODAY | 10:42 AM</span></div><div className="hero-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div className="hero-note-preview"><div><b>Chief complaint</b><span>Intermittent headache for 3 days</span></div><div><b>Assessment</b><span className="preview-line"></span></div><div><b>Plan</b><span className="preview-line short"></span></div></div><div className="hero-card-foot"><span><Check size={13} /> Draft ready</span><span>01:24 <AudioLines size={14} /></span></div><div className="hero-float"><Sparkles size={15} /> Note prepared</div></motion.div></section>

    <section className="workspace-shell no-print" id="workspace"><div className="section-heading"><div><p className="eyebrow">YOUR CONSULTATION WORKSPACE</p><h2>A clear note starts with a conversation.</h2><p className="muted">Upload an audio recording to get started. Your notes are always a draft for your review.</p></div><span className="step-counter"><span>01</span> / 03</span></div>
      <div className="workspace-grid"><div className="upload-card neu-card"><div className="card-heading"><span className="card-heading-icon"><AudioLines size={18} /></span><div><h3>Add a recording</h3><p>Choose a patient conversation to get started.</p></div><span className="step-badge">01</span></div><AudioUploader file={file} onFile={f => { setFile(f); setClinicalData(null); setTranscription(""); setSummaryAudio(null); setError(""); }} onClear={() => { setFile(null); setClinicalData(null); setTranscription(""); setSummaryAudio(null); setError(""); }} onError={setError} disabled={processing} />{file && previewUrl && <div className="audio-preview"><span><Volume2 size={15} /> Preview recording</span><audio controls src={previewUrl} /></div>}<div className="upload-card-footer"><span><LockKeyhole size={13} /> Audio is processed securely</span><span>MP3 / WAV / M4A / WEBM · up to 30 MB</span></div><button onClick={handleProcess} disabled={!file || processing} className="primary-button">{processing ? <><span className="button-spinner" /> Preparing your note</> : <>Create clinical note <ArrowRight size={17} /></>}</button></div>
        <div className="steps-card">
          <div className="steps-title">
            <p className="eyebrow">A THOUGHTFUL WORKFLOW</p>
            <h3>From conversation<br /><em>to clarity.</em></h3>
          </div>
          <div className="workflow-step"><span className="workflow-number">01</span><span className="workflow-icon"><AudioLines size={18} /></span><div><b>Listen</b><span>Voice, carefully transcribed</span></div></div>
          <div className="workflow-connector" />
          <div className="workflow-step"><span className="workflow-number">02</span><span className="workflow-icon"><Layers3 size={18} /></span><div><b>Organize</b><span>Clinical details, structured</span></div></div>
          <div className="workflow-connector" />
          <div className="workflow-step"><span className="workflow-number">03</span><span className="workflow-icon"><ClipboardCheck size={18} /></span><div><b>Review</b><span>A draft that's ready for you</span></div></div>
          <div className="steps-foot"><ShieldCheck size={14} /> <span>You stay in control of every note.</span></div>
        </div></div>
      <AnimatePresence>{processing && <ProcessingLoader />}</AnimatePresence>{error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner" role="alert"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error">&times;</button></motion.div>}
    </section>

    <AnimatePresence>{clinicalData && <motion.section className="results-shell" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}><div className="results-heading"><div><p className="eyebrow">YOUR NOTE IS READY FOR REVIEW</p><h2>Clinical note <span className="draft-label"><span /> DRAFT</span></h2><p className="muted">Review every detail before adding to the patient record.</p></div><div className="result-actions"><button className="neu-button secondary-button" onClick={handlePdfDownload} disabled={pdfLoading}><FileDown size={16} /> {pdfLoading ? "Preparing PDF…" : "Save PDF"}</button><button className="neu-button secondary-button" onClick={handleCopy}>{copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}{copied ? "Copied" : "Copy note"}</button></div></div>
      <div className="result-card neu-card print-card"><div className="result-card-top"><div className="result-card-title"><span className="result-icon"><FileText size={18} /></span><div><h3>Visit summary</h3><p>Structured clinical documentation</p></div></div><span className="review-badge"><Check size={13} /> Ready for review</span></div><ClinicalNote data={clinicalData} /></div>
      <div className="result-lower"><div className="prescription-card neu-card print-card"><div className="lower-heading"><div className="lower-title"><span className="lower-icon"><Clipboard size={17} /></span><div><h3>Draft prescription</h3><p>For clinician review and approval</p></div></div><span className="prescription-mark">Rx</span></div><PrescriptionCard medicines={clinicalData.medicines} /></div><div className="voice-card neu-card"><div className="lower-heading"><div className="lower-title"><span className="lower-icon voice"><Volume2 size={17} /></span><div><h3>Voice summary</h3><p>A listenable version of the note</p></div></div></div><VoiceSummaryPlayer audio={summaryAudio} onGenerate={handleSummary} loading={summaryLoading} /></div></div>
      <details className="transcript-disclosure"><summary><span><AudioLines size={15} /> View source transcription</span><ChevronDown size={15} /></summary><p>{transcription}</p></details>
      <div className="review-reminder"><ShieldCheck size={16} /> This is an AI-assisted draft. Verify the details and use your clinical judgment before saving or prescribing.</div>
    </motion.section>}</AnimatePresence>

    <section className="how-section no-print" id="how-it-works"><div className="how-inner"><span className="how-mark"><Stethoscope size={20} /></span><div><p className="eyebrow">MADE FOR THE MOMENTS THAT MATTER</p><h2>More time for the person.<br /><em>Less time with the paperwork.</em></h2></div><p>Clear clinical notes help you stay focused in the room. AarogyaNote helps with the first draft, so you can focus on what matters most: care.</p></div></section>
    <footer className="footer no-print"><a className="brand" href="#top"><span className="brand-mark"><Stethoscope size={18} /></span><span>Aarogya<span className="brand-note">Note</span></span></a><span>Thoughtful tools for thoughtful care.</span><a href="#workspace">Back to workspace</a></footer>
  </main>;
}







