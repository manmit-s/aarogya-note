"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  Clipboard,
  ClipboardCheck,
  FileDown,
  FileText,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AudioUploader } from "@/components/AudioUploader";
import { ClinicalNote } from "@/components/ClinicalNote";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { VoiceSummaryPlayer } from "@/components/VoiceSummaryPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateSummary, processAudio } from "@/lib/api";
import { downloadClinicalPdf } from "@/lib/clinical-pdf";
import type { ClinicalData } from "@/lib/types";

export default function HomePage() {
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

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const noteText = useMemo(() => {
    if (!clinicalData) return "";
    const sections = [
      ["Chief complaint", clinicalData.chief_complaint],
      ["History of present illness", clinicalData.history_of_present_illness],
      ["Examination findings", clinicalData.examination_findings],
      ["Provisional diagnosis", clinicalData.provisional_diagnosis],
      [
        "Medicines",
        clinicalData.medicines
          .map((m) => [m.name, m.dosage, m.frequency, m.duration].filter(Boolean).join(" / "))
          .join("\n"),
      ],
      ["Advice", clinicalData.advice],
      ["Follow-up", clinicalData.follow_up],
    ];
    return `AAROGYANOTE - CLINICAL NOTE\nDraft for clinician review\n\n${sections
      .map(([title, body]) => `${title.toUpperCase()}\n${body || "Not mentioned"}`)
      .join("\n\n")}`;
  }, [clinicalData]);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setClinicalData(null);
    setTranscription("");
    setSummaryAudio(null);
    try {
      const result = await processAudio(file);
      setTranscription(result.transcription);
      setClinicalData(result.clinical_data);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn't process this recording. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const handleSummary = async () => {
    if (!clinicalData) return;
    setSummaryLoading(true);
    setError("");
    try {
      const result = await generateSummary(clinicalData);
      setSummaryAudio(`data:${result.mime_type};base64,${result.audio_base64}`);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn't create the audio summary."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(noteText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  const handlePdfDownload = async () => {
    if (!clinicalData) return;
    setPdfLoading(true);
    try {
      await downloadClinicalPdf(clinicalData);
    } catch {
      setError("We couldn't create the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <main>
      {/* Topbar Navigation */}
      <header className="topbar no-print">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Image
              src="/AarogyaNote_Logo.png"
              alt="AarogyaNote Logo"
              width={34}
              height={34}
              priority
              className="brand-logo"
            />
          </span>
          <span>
            Aarogya<span className="brand-note">Note</span>
          </span>
        </a>
        <nav className="top-links">
          <a href="#how-it-works" className="nav-anchor">
            How it works
          </a>
          <div className="top-actions">
            <ThemeToggle />
            <span className="secure-pill">
              <LockKeyhole size={13} strokeWidth={2} />
              <span>Private workspace</span>
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Presentation */}
      <section id="top" className="hero-shell no-print">
        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-kicker"
          >
            <span className="pulse-well">
              <span className="pulse-dot" />
            </span>
            <span>BUILT FOR BETTER CARE</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
          >
            Be present with
            <br />
            your <em>patients.</em>
          </motion.h1>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            Let AarogyaNote take care of the documentation. Transform consultation
            recordings into structured, clinician-reviewed drafts in moments.
          </motion.p>
          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <span className="trust-pill">
              <ShieldCheck size={14} strokeWidth={2} />
              <span>Clinician-reviewed drafts</span>
            </span>
            <span className="trust-pill">
              <LockKeyhole size={13} strokeWidth={2} />
              <span>Private by design</span>
            </span>
          </motion.div>
        </div>

        {/* Hero Tactile Hardware Preview */}
        <motion.div
          className="hero-card neu-card"
          initial={{ opacity: 0, y: 20, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="hero-card-top">
            <span className="hero-card-badge">
              <Image
                src="/AarogyaNote_Logo.png"
                alt=""
                width={14}
                height={14}
                className="badge-logo"
              />
              <span>VISIT NOTE</span>
            </span>
            <span className="hero-card-date">TODAY · 10:42 AM</span>
          </div>

          {/* Recessed Neumorphic Waveform Trough */}
          <div className="hero-wave-trough">
            <div className="hero-wave">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>

          <div className="hero-note-preview">
            <div className="preview-row">
              <b>Chief complaint</b>
              <span>Intermittent headache for 3 days</span>
            </div>
            <div className="preview-row">
              <b>Assessment</b>
              <span className="preview-line" />
            </div>
            <div className="preview-row">
              <b>Plan & Prescription</b>
              <span className="preview-line short" />
            </div>
          </div>

          <div className="hero-card-foot">
            <span className="draft-ready-indicator">
              <Check size={13} strokeWidth={2.4} /> Draft ready
            </span>
            <span className="duration-pill">
              01:24 <AudioLines size={14} />
            </span>
          </div>

          <div className="hero-float">
            <Sparkles size={14} />
            <span>Note prepared</span>
          </div>
        </motion.div>
      </section>

      {/* Consultation Workspace */}
      <section className="workspace-shell no-print" id="workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR CONSULTATION WORKSPACE</p>
            <h2>A clear note starts with a conversation.</h2>
            <p className="muted">
              Upload an audio recording to get started. Your notes are always a draft for
              licensed clinician review.
            </p>
          </div>
          <span className="step-counter">
            <span>01</span> / 03
          </span>
        </div>

        <div className="workspace-grid">
          {/* Audio Upload Card */}
          <div className="upload-card neu-card">
            <div className="card-heading">
              <span className="card-heading-icon">
                <AudioLines size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>Add a recording</h3>
                <p>Choose a patient conversation to begin transcription.</p>
              </div>
              <span className="step-badge">STEP 01</span>
            </div>

            <AudioUploader
              file={file}
              onFile={(f) => {
                setFile(f);
                setClinicalData(null);
                setTranscription("");
                setSummaryAudio(null);
                setError("");
              }}
              onClear={() => {
                setFile(null);
                setClinicalData(null);
                setTranscription("");
                setSummaryAudio(null);
                setError("");
              }}
              onError={setError}
              disabled={processing}
            />

            {file && previewUrl && (
              <div className="audio-preview-well">
                <div className="preview-label">
                  <Volume2 size={14} />
                  <span>Audio preview</span>
                </div>
                <audio controls src={previewUrl} className="custom-audio-control" />
              </div>
            )}

            <div className="upload-card-footer">
              <span>
                <LockKeyhole size={13} /> Audio is processed in memory
              </span>
              <span>MP3 · WAV · M4A · WEBM · up to 30 MB</span>
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className="primary-button"
            >
              {processing ? (
                <>
                  <span className="button-spinner" /> Preparing your note…
                </>
              ) : (
                <>
                  <span>Create clinical note</span>
                  <ArrowRight size={17} strokeWidth={2.2} />
                </>
              )}
            </button>
          </div>

          {/* Workflow Steps Card */}
          <div className="steps-card neu-card">
            <div className="steps-title">
              <p className="eyebrow">A THOUGHTFUL WORKFLOW</p>
              <h3>
                From conversation
                <br />
                <em>to clinical clarity.</em>
              </h3>
            </div>

            <div className="workflow-steps-list">
              <div className="workflow-step">
                <span className="workflow-number">01</span>
                <span className="workflow-icon">
                  <AudioLines size={17} strokeWidth={2} />
                </span>
                <div>
                  <b>Listen & Transcribe</b>
                  <span>High-fidelity multi-speaker transcription</span>
                </div>
              </div>

              <div className="workflow-connector" />

              <div className="workflow-step">
                <span className="workflow-number">02</span>
                <span className="workflow-icon">
                  <Layers3 size={17} strokeWidth={2} />
                </span>
                <div>
                  <b>Structure Details</b>
                  <span>SOAP framework & clinical extraction</span>
                </div>
              </div>

              <div className="workflow-connector" />

              <div className="workflow-step">
                <span className="workflow-number">03</span>
                <span className="workflow-icon">
                  <ClipboardCheck size={17} strokeWidth={2} />
                </span>
                <div>
                  <b>Clinician Review</b>
                  <span>Approve note, prescription & voice summary</span>
                </div>
              </div>
            </div>

            <div className="steps-foot">
              <ShieldCheck size={14} strokeWidth={2} />
              <span>You stay in full control of every clinical draft.</span>
            </div>
          </div>
        </div>

        <AnimatePresence>{processing && <ProcessingLoader />}</AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-banner"
            role="alert"
          >
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error notification"
            >
              &times;
            </button>
          </motion.div>
        )}
      </section>

      {/* Clinical Results Section */}
      <AnimatePresence>
        {clinicalData && (
          <motion.section
            className="results-shell"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="results-heading">
              <div>
                <p className="eyebrow">YOUR NOTE IS READY FOR REVIEW</p>
                <h2>
                  Clinical documentation
                  <span className="draft-label">
                    <Image
                      src="/AarogyaNote_Logo.png"
                      alt=""
                      width={12}
                      height={12}
                      className="draft-logo"
                    />
                    <span>DRAFT</span>
                  </span>
                </h2>
                <p className="muted">
                  Review every detail before copying or adding to the patient record.
                </p>
              </div>
              <div className="result-actions">
                <button
                  className="neu-button secondary-button"
                  onClick={handlePdfDownload}
                  disabled={pdfLoading}
                >
                  <FileDown size={15} strokeWidth={2} />
                  <span>{pdfLoading ? "Preparing PDF…" : "Download PDF"}</span>
                </button>
                <button
                  className="neu-button secondary-button"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <ClipboardCheck size={15} strokeWidth={2} className="text-teal" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={15} strokeWidth={2} />
                      <span>Copy note</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visit Summary Card with Structured Clinical Bento Grid */}
            <div className="result-card neu-card print-card">
              <div className="result-card-top">
                <div className="result-card-title">
                  <span className="result-icon">
                    <FileText size={17} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3>Visit summary</h3>
                    <p>Structured clinical documentation</p>
                  </div>
                </div>
                <span className="review-badge">
                  <Check size={13} strokeWidth={2.4} /> Ready for review
                </span>
              </div>
              <ClinicalNote data={clinicalData} />
            </div>

            {/* Lower Row: Prescription and Voice Summary */}
            <div className="result-lower">
              <div className="prescription-card neu-card print-card">
                <div className="lower-heading">
                  <div className="lower-title">
                    <span className="lower-icon">
                      <Clipboard size={17} strokeWidth={2} />
                    </span>
                    <div>
                      <h3>Draft prescription</h3>
                      <p>For clinician review and approval</p>
                    </div>
                  </div>
                  <span className="prescription-mark">Rx</span>
                </div>
                <PrescriptionCard medicines={clinicalData.medicines} />
              </div>

              <div className="voice-card neu-card">
                <div className="lower-heading">
                  <div className="lower-title">
                    <span className="lower-icon voice">
                      <Volume2 size={17} strokeWidth={2} />
                    </span>
                    <div>
                      <h3>Voice summary</h3>
                      <p>A spoken version of the note</p>
                    </div>
                  </div>
                </div>
                <VoiceSummaryPlayer
                  audio={summaryAudio}
                  onGenerate={handleSummary}
                  loading={summaryLoading}
                />
              </div>
            </div>

            {/* Source Transcription Disclosure */}
            <details className="transcript-disclosure">
              <summary>
                <span>
                  <AudioLines size={15} />
                  <span>View source conversation transcription</span>
                </span>
                <ChevronDown size={15} />
              </summary>
              <p>{transcription}</p>
            </details>

            {/* Verification reminder */}
            <div className="review-reminder">
              <ShieldCheck size={16} strokeWidth={2} />
              <span>
                This is an AI-assisted draft. Verify the details and use your clinical
                judgment before saving or prescribing.
              </span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* How It Works Section */}
      <section className="how-section no-print" id="how-it-works">
        <div className="how-inner">
          <span className="how-mark">
            <Image
              src="/AarogyaNote_Logo.png"
              alt="AarogyaNote Logo"
              width={38}
              height={38}
              className="how-logo"
            />
          </span>
          <div>
            <p className="eyebrow">MADE FOR THE MOMENTS THAT MATTER</p>
            <h2>
              More time for the person.
              <br />
              <em>Less time with the paperwork.</em>
            </h2>
          </div>
          <p>
            Clear clinical notes help you stay fully present in the consultation room.
            AarogyaNote handles the heavy lifting of the first draft, so care teams can
            focus on what matters most: patient care.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer no-print">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Image
              src="/AarogyaNote_Logo.png"
              alt="AarogyaNote Logo"
              width={28}
              height={28}
              className="brand-logo"
            />
          </span>
          <span>
            Aarogya<span className="brand-note">Note</span>
          </span>
        </a>
        <span>Thoughtful tools for thoughtful care.</span>
        <a href="#workspace" className="footer-back-link">
          Back to workspace
        </a>
      </footer>
    </main>
  );
}
