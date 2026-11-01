from fastapi import APIRouter, File, UploadFile
from app.schemas import ExtractRequest, ProcessResponse, SummaryRequest, SummaryResponse
from app.services.gnani import extract, generate_summary, transcribe

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)) -> dict[str, str]:
    return {"transcription": await transcribe(file)}

@router.post("/extract")
async def extract_clinical_data(request: ExtractRequest):
    return await extract(request.transcription)

@router.post("/generate-summary", response_model=SummaryResponse)
async def summary(request: SummaryRequest) -> SummaryResponse:
    audio_base64, mime_type = await generate_summary(request.clinical_data)
    return SummaryResponse(audio_base64=audio_base64, mime_type=mime_type)

@router.post("/process", response_model=ProcessResponse)
async def process(file: UploadFile = File(...)) -> ProcessResponse:
    transcription = await transcribe(file)
    return ProcessResponse(transcription=transcription, clinical_data=await extract(transcription))
