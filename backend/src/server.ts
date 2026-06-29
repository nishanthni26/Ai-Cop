import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

const apiRouter = express.Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.post('/scan', async (req, res) => {
  const { type, data } = req.body;
  const result = {
    id: uuidv4(),
    type,
    aiGeneratedScore: Math.round(Math.random() * 100),
    humanAuthenticity: Math.round(Math.random() * 100),
    threatLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
    timestamp: new Date().toISOString()
  };
  res.json(result);
});

app.use('/api/v1', apiRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'AI Police API', version: '1.0.0' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Police API running on port ${PORT}`);
});

export default app;