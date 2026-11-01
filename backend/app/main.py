from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import router

app = FastAPI(title="AarogyaNote API", version="1.0.0", description="Clinical conversation processing API")
origins = [value.strip() for value in settings.frontend_origins.split(",") if value.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"])
app.include_router(router, prefix="/api")

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "aarogyanote-api"}
