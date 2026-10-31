"use client";
import { motion } from "framer-motion";
import { AudioWaveform, FileText, Sparkles } from "lucide-react";

const steps = ["Listening to your recording", "Organizing clinical details", "Preparing your note"];
export function ProcessingLoader() {
  return <motion.div className="processing-card neu-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="processing-orbit"><span></span><AudioWaveform size={26} /></div><div><p className="eyebrow">WORKING ON YOUR VISIT</p><h3>Turning conversation into clarity</h3><p className="muted">This usually takes less than a minute.</p></div><div className="processing-steps">{steps.map((step, i) => <div key={step} className="processing-step"><span className="step-dot">{i === 0 ? <AudioWaveform size={14} /> : i === 1 ? <Sparkles size={13} /> : <FileText size={13} />}</span>{step}<span className="step-pulse" /></div>)}</div></motion.div>;
}
