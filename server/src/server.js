import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import surveyRoutes from './routes/surveyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { runSeeds } from './db/seed.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS setup
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://feedback.papido.online',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, or allow custom domain
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Papido Booking Opinion Survey API',
  });
});

// Mount Routes
app.use('/api/survey', surveyRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  const status = err.status || 500;
  const message =
    config.nodeEnv === 'production'
      ? 'An unexpected internal error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
});

// Start Server after verifying database
async function startServer() {
  try {
    await runSeeds();
    
    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚕 Papido Booking Opinion Survey API Server`);
      console.log(`📡 Running on: http://localhost:${config.port}`);
      console.log(`🌐 Allowed Client: ${config.clientUrl}`);
      console.log(`🔒 Environment: ${config.nodeEnv}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[ServerStart] Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
