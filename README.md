# AI Police - Deepfake Detection Platform

A comprehensive AI-powered platform for detecting deepfakes, analyzing images, videos, and documents for law enforcement and security applications.

## Features

- **Image Deepfake Detection**: Analyze images for AI-generated content
- **Video Analysis**: Detect manipulated videos and deepfakes
- **Voice Clone Detection**: Identify synthetic voice recordings
- **Document Analysis**: Authenticity verification for documents
- **OCR Scanning**: Extract and analyze text from images
- **Scam Detection**: AI-powered scam and fraud detection

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js/Express, Python/FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI Services**: Hugging Face Transformers, MediaPipe, OpenCV, Custom ML Models

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (optional)

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install Python backend
cd ../backend-python && pip install -r requirements.txt
```

### Running the Application

```bash
# Start frontend
npm run dev

# Start Node.js backend
cd backend && npm run dev

# Start Python backend
cd backend-python && python -m app.main
```

### Open-source ML detector

The Python backend uses a real Hugging Face image-classification model for image scans:

- Default model: `capcheck/ai-image-detection`
- License: Apache-2.0
- Task: AI-generated image detection

The first scan downloads the model into the Hugging Face cache, then reuses it locally. You can swap in another compatible image-classification detector without changing code:

```bash
export HF_DEEPFAKE_MODEL_ID="capcheck/ai-image-detection"
export HF_DEEPFAKE_MODEL_WEIGHT="0.65"
export HF_IMAGE_CAPTION_MODEL_ID="Salesforce/blip-image-captioning-base"
export ENABLE_IMAGE_INSIGHTS="true"
cd backend-python && python -m app.main
```

`HF_DEEPFAKE_MODEL_WEIGHT` controls how much the ML model influences the final score. The remaining signal comes from the existing MediaPipe/OpenCV forensic checks.

`ENABLE_IMAGE_INSIGHTS` adds a short AI-generated image description to scan results. It is helpful for explaining what the scanner sees, but it is not used as proof that an image is real or AI-generated.

MediaPipe face-landmark checks are optional because some environments ship MediaPipe builds without `mp.solutions`. Enable them only when your installed MediaPipe build supports it:

```bash
export ENABLE_MEDIAPIPE=true
```

## License

MIT

---

**Created by**: Nishanth  
**Property**: NP Property  
All rights reserved.
