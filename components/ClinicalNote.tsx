"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ClipboardList,
  FileText,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import type { ClinicalData } from "@/lib/types";

export function ClinicalNote({ data }: { data: ClinicalData }) {
  const rows = [
    {
      left: {
        title: "Chief complaint",
        icon: HeartPulse,
        value: data.chief_complaint,
      },
      right: {
        title: "History of present illness",
        icon: FileText,
        value: data.history_of_present_illness,
      },
    },
    {
      left: {
        title: "Examination findings",
        icon: Stethoscope,
        value: data.examination_findings,
      },
      right: {
        title: "Provisional diagnosis",
        icon: Activity,
        value: data.provisional_diagnosis,
      },
    },
    {
      left: {
        title: "Advice",
        icon: ClipboardList,
        value: data.advice,
      },
      right: {
        title: "Follow-up",
        icon: Activity,
        value: data.follow_up,
      },
    },
  ];

  return (
    <div className="clinical-grid">
      {rows.map((row, idx) => (
        <div className="clinical-row" key={idx}>
          {/* Left item */}
          <div className="clinical-item">
            <div className="clinical-item-head">
              <span className="clinical-icon-tile">
                <row.left.icon size={16} strokeWidth={1.8} />
              </span>
              <h4>{row.left.title}</h4>
            </div>
            <div className="clinical-item-body">
              {row.left.value?.trim() ? (
                <p>{row.left.value}</p>
              ) : (
                <p className="empty-value">Not mentioned in recording</p>
              )}
            </div>
          </div>

          {/* Right item */}
          <div className="clinical-item">
            <div className="clinical-item-head">
              <span className="clinical-icon-tile">
                <row.right.icon size={16} strokeWidth={1.8} />
              </span>
              <h4>{row.right.title}</h4>
            </div>
            <div className="clinical-item-body">
              {row.right.value?.trim() ? (
                <p>{row.right.value}</p>
              ) : (
                <p className="empty-value">Not mentioned in recording</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
