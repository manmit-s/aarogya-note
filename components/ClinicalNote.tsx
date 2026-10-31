"use client";
import { motion } from "framer-motion";
import { Activity, ClipboardList, HeartPulse, Stethoscope } from "lucide-react";
import type { ClinicalData } from "@/lib/types";

type TextKey = Exclude<keyof ClinicalData, "medicines">;
const fields: { key: TextKey; title: string; icon: typeof HeartPulse }[] = [
  { key: "chief_complaint", title: "Chief complaint", icon: HeartPulse },
  { key: "history_of_present_illness", title: "History of present illness", icon: ClipboardList },
  { key: "examination_findings", title: "Examination findings", icon: Stethoscope },
  { key: "provisional_diagnosis", title: "Provisional diagnosis", icon: Activity },
  { key: "advice", title: "Advice", icon: ClipboardList },
  { key: "follow_up", title: "Follow-up", icon: Activity }
];

export function ClinicalNote({ data }: { data: ClinicalData }) {
  return <div className="note-grid">{fields.map(({ key, title, icon: Icon }, i) => <motion.article key={key} className="note-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}><span className="note-icon"><Icon size={16} strokeWidth={1.8} /></span><div><h3>{title}</h3><p>{data[key] || <span className="empty-value">Not mentioned in recording</span>}</p></div></motion.article>)}</div>;
}
