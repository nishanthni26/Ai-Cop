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
- **AI Services**: HuggingFace, Custom ML Models

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

## License

MIT
