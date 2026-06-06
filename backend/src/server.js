import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import storiesRouter from './routes/stories.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server (no origin) and whitelisted origins.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

// Rate limiting: 120 requests/minute per IP on the API.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', apiLimiter, storiesRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.message === 'Not allowed by CORS' ? 403 : 500;
  res.status(status).json({ error: status === 403 ? 'Forbidden' : 'Internal server error' });
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API running on http://localhost:${config.port}`);
});

export default app;
