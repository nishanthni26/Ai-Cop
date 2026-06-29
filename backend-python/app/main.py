from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
import base64

app = FastAPI(title="AI Police OCR Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class OCRResult(BaseModel):
    status: str
    case_id: str
    detected_text: str
    confidence: float
    language: str
    processing_time: str
    pages: int
    line_count: int

class OCRLine(BaseModel):
    text: str
    confidence: float
    box: list[int]

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ocr"}

@app.post("/api/ocr/analyze", response_model=OCRResult)
async def analyze_document(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    case_id = f"OCR-{uuid.uuid4().hex[:8].upper()}"
    
    # Simulated OCR result
    return OCRResult(
        status="completed",
        case_id=case_id,
        detected_text="Sample extracted text from document. This is a simulated OCR response.",
        confidence=87.5,
        language=language,
        processing_time="1.23s",
        pages=1,
        line_count=5
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
