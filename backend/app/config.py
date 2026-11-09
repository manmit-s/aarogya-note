from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    gnani_api_key: str = ""
    gnani_api_base_url: str = "https://api.vachana.ai"
    prisma_url: str = "https://api.vachana.ai/stt/v3"
    groq_api_key: str = ""
    groq_url: str = "https://api.groq.com/openai/v1/chat/completions"
    timbre_url: str = "https://api.vachana.ai/api/v1/tts/inference"
    prisma_model: str = "prisma-v2.5"
    prisma_language_code: str = "hi-IN"
    extraction_model: str = "openai/gpt-oss-120b"
    timbre_model: str = "timbre-v2.5"
    timbre_voice: str = "Nalini"
    timbre_language: str = "auto"
    frontend_origins: str = "http://localhost:3000"
    max_audio_size_mb: int = 30
    model_config = SettingsConfigDict(
        env_file=[str(ENV_PATH), ".env"],
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()
