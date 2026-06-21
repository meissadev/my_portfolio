import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import projectRoutes from './routes/projectRoutes.js';
import client from 'prom-client'; // [METRICS]

dotenv.config();
const app = express();

// [METRICS] Registry et métriques par défaut
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// [METRICS] Middleware de tracking
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequests.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    end();
  });
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Portfolio fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// [METRICS] Endpoint Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/projects', projectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

app.use((err, req, res, _next) => {
  console.error('Erreur:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Metrics: http://localhost:${PORT}/metrics`); // [METRICS]
});

export default app;