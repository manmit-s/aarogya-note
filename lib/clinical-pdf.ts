import { createElement } from "react";
import type { ClinicalData } from "@/lib/types";

export async function downloadClinicalPdf(data: ClinicalData) {
  const [{ pdf }, { ClinicalNotePdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/ClinicalNotePdf"),
  ]);
  const date = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const pdfDocument = createElement(ClinicalNotePdf, { data, dateLabel: date }) as unknown as Parameters<typeof pdf>[0];
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `aarogyanote-clinical-note-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
