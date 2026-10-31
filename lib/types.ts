export type Medicine = { name: string; dosage: string; frequency: string; duration: string };
export type ClinicalData = {
  chief_complaint: string;
  history_of_present_illness: string;
  examination_findings: string;
  provisional_diagnosis: string;
  medicines: Medicine[];
  advice: string;
  follow_up: string;
};
export type ProcessResponse = { transcription: string; clinical_data: ClinicalData };
export type SummaryResponse = { audio_base64: string; mime_type: string };
