from pydantic import BaseModel, Field

class Medicine(BaseModel):
    name: str = ""
    dosage: str = ""
    frequency: str = ""
    duration: str = ""

class ClinicalData(BaseModel):
    chief_complaint: str = ""
    history_of_present_illness: str = ""
    examination_findings: str = ""
    provisional_diagnosis: str = ""
    medicines: list[Medicine] = Field(default_factory=list)
    advice: str = ""
    follow_up: str = ""

class ExtractRequest(BaseModel):
    transcription: str = Field(min_length=1, max_length=100_000)

class ProcessResponse(BaseModel):
    transcription: str
    clinical_data: ClinicalData

class SummaryRequest(BaseModel):
    clinical_data: ClinicalData

class SummaryResponse(BaseModel):
    audio_base64: str
    mime_type: str = "audio/mpeg"
