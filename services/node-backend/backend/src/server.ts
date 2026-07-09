import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // allow up to 50MB uploads
  },
});

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.raw({ limit: '50mb' }));

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

const apiRouter = express.Router();
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

function calculateEntropy(buffer: Buffer): number {
  const counts = new Array<number>(256).fill(0);
  for (const byte of buffer) {
    counts[byte] += 1;
  }

  let entropy = 0;
  for (const count of counts) {
    if (count === 0) continue;
    const probability = count / buffer.length;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

function createFallbackScanResult(file: Express.Multer.File, reason: string) {
  const entropy = calculateEntropy(file.buffer);
  const sizeKb = file.buffer.length / 1024;
  const entropyScore = Math.min(100, Math.max(0, (entropy / 8) * 100));
  const aiGeneratedScore = 0;
  const humanAuthenticity = Number((100 - aiGeneratedScore).toFixed(2));

  return {
    id: uuidv4(),
    type: file.mimetype.startsWith('image/') ? 'image' : 'file',
    aiGeneratedScore,
    humanAuthenticity,
    threatLevel: 'low',
    detectionDetails: {
      model: 'Node forensic fallback',
      analysis_status: 'inconclusive',
      python_model_used: false,
      fallback_reason: reason,
      mime_type: file.mimetype,
      file_size_kb: Number(sizeKb.toFixed(2)),
      entropy_bits_per_byte: Number(entropy.toFixed(4)),
      entropy_score: Number(entropyScore.toFixed(2)),
      note: 'Entropy is reported for file diagnostics only; it is not used as an AI-generation score.',
    },
    timestamp: String(Date.now() / 1000),
  };
}

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Forward file upload to Python backend for real analysis
apiRouter.post('/scan', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Create FormData and forward to Python backend
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(`${PYTHON_API_URL}/api/v1/scan`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Python API error:', error);
      return res.json(createFallbackScanResult(req.file, `Python API returned ${response.status}: ${error.slice(0, 300)}`));
    }

    const result = await response.json();
    return res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    return res.json(createFallbackScanResult(req.file, `Python API unavailable at ${PYTHON_API_URL}`));
  }
});

app.use('/api/v1', apiRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'AI Police API', version: '1.0.0' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`AI Police API running on port ${PORT}`);
  console.log(`Python backend at: ${PYTHON_API_URL}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing backend process or start this one with PORT=3002 npm run dev.`);
    process.exit(1);
  }

  throw error;
});

export default app;
