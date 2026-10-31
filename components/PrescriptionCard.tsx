"use client";
import type { Medicine } from "@/lib/types";

export function PrescriptionCard({ medicines }: { medicines: Medicine[] }) {
  return <div className="prescription-body">{medicines.length ? <div className="medicine-list">{medicines.map((medicine, index) => <div className="medicine-row" key={`${medicine.name}-${index}`}><span className="medicine-number">{String(index + 1).padStart(2, "0")}</span><div className="medicine-details"><strong>{medicine.name || "Medicine"}</strong><div>{[[medicine.dosage, "Dose"], [medicine.frequency, "Frequency"], [medicine.duration, "Duration"]].filter(([value]) => value).map(([value, label]) => <span className="medicine-chip" key={label}>{label} · {value}</span>)}</div></div></div>)}</div> : <p className="empty-value prescription-empty">No medicines were mentioned in the recording.</p>}<div className="draft-notice">Draft for clinician review. Confirm all medicines and instructions before prescribing.</div></div>;
}
