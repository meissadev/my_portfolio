import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import projectRoutes from './routes/projectRoutes.js';

/**
 * Point d'entrée de l'application
 * Configuration et démarrage du serveur Express
 */

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); // Parser le JSON
app.use(express.urlencoded({ extended: true })); // Parser les données URL-encoded

// Logger HTTP (uniquement en développement)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route de santé (health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Portfolio fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Routes de l'API
app.use('/api/projects', projectRoutes);

// Route 404 - Non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, _next) => {
  console.error('Erreur:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
