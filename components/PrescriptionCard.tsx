"use client";

import type { Medicine } from "@/lib/types";

export function PrescriptionCard({ medicines }: { medicines: Medicine[] }) {
  return (
    <div className="prescription-body">
      {medicines.length ? (
        <div className="rx-list">
          {medicines.map((medicine, index) => {
            const num = String(index + 1).padStart(2, "0");
            const chips = [
              medicine.dosage ? `Dose · ${medicine.dosage}` : null,
              medicine.frequency ? `Frequency · ${medicine.frequency}` : null,
              medicine.duration ? `Duration · ${medicine.duration}` : null,
            ].filter(Boolean) as string[];

            return (
              <div className="rx-item" key={`${medicine.name || "med"}-${index}`}>
                <div className="rx-item-header">
                  <span className="rx-number">{num}</span>
                  <strong className="rx-name">
                    {medicine.name || "Prescribed medication"}
                  </strong>
                </div>

                {chips.length > 0 && (
                  <div className="rx-chips">
                    {chips.map((chip, chipIdx) => (
                      <span className="rx-chip" key={chipIdx}>
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-value prescription-empty">
          No medicines were mentioned in the recording.
        </p>
      )}

      <div className="rx-footer-notice">
        Draft for clinician review. Confirm all medicines and instructions before prescribing.
      </div>
    </div>
  );
}
