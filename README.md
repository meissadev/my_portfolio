# 🎨 Portfolio Full Stack

Portfolio professionnel avec frontend React et backend Express/MongoDB.

## 📁 Structure du projet

```
portfolio/
├── frontend/          # Application React (Vite + TailwindCSS)
├── backend/           # API REST Express + MongoDB
├── docker-compose.yml # Configuration Docker
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (v16 ou supérieur)
- Docker et Docker Compose
- npm ou yarn

### 1. Installation du Backend

```bash
cd backend
npm install
cp .env.example .env
```

Modifier le fichier `.env` si nécessaire :
```env
PORT=5000
MONGO_URI=mongodb://portfolio-mongo:27017/portfolio
NODE_ENV=development
CORS_ORIGIN=http://portfolio-frontend:80
```

### 2. Installation du Frontend

```bash
cd frontend
npm install
```

Le fichier `.env` contient :
```env
VITE_API_URL=http://portfolio-backend:5000/api
```

### 3. Démarrage avec Docker

```bash
# Démarrer tous les conteneurs (MongoDB, Backend, Frontend)
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

Le frontend sera accessible sur `http://localhost` (port 80)

### 4. Ajouter des données de test (optionnel)

```bash
cd backend
npm run seed
```

## 📚 API Documentation

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | Liste des projets |
| GET | `/api/projects/:id` | Détails d'un projet |
| POST | `/api/projects` | Créer un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |

### Exemple de création de projet

```bash
# Depuis l'hôte (localhost)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Nouveau Projet",
    "description": "Description du projet",
    "technologies": ["React", "Node.js", "MongoDB"],
    "category": "web",
    "featured": true,
    "githubUrl": "https://github.com/meissadev/projet",
    "liveUrl": "https://projet.com"
  }'

# Depuis un conteneur Docker
curl -X POST http://portfolio-backend:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 🛠️ Technologies utilisées

### Frontend
- ⚛️ React 19
- ⚡ Vite
- 🎨 TailwindCSS
- 🎯 React Icons

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB + Mongoose
- 🔐 CORS
- 📝 Morgan (logging)

### DevOps
- 🐳 Docker & Docker Compose

## 📦 Scripts disponibles

### Backend
```bash
npm start       # Démarrer en production
npm run dev     # Démarrer en développement (nodemon)
npm run seed    # Ajouter des données de test
```

### Frontend
```bash
npm run dev     # Serveur de développement
npm run build   # Build de production
npm run preview # Prévisualiser le build
npm run lint    # Linter le code
```

## 🐳 Docker

### Conteneurs

- **portfolio-mongo** : Base de données MongoDB (port 27017)
- **portfolio-backend** : API Express (port 5000)
- **portfolio-frontend** : Application React (port 80)

### Commandes Docker

```bash
# Démarrer les conteneurs
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🌐 Déploiement

### Frontend (Vercel, Netlify)
1. Connecter votre dépôt Git
2. Configurer `VITE_API_URL` avec l'URL du backend déployé
3. Déployer

### Backend (Render, Railway, Heroku)
1. Connecter votre dépôt Git
2. Configurer les variables d'environnement
3. Déployer

### Base de données (MongoDB Atlas)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Obtenir la chaîne de connexion
4. Mettre à jour `MONGO_URI` dans les variables d'environnement

## 📝 Modèle de données

### Project Schema
```javascript
{
  title: String (requis, max 100 caractères)
  description: String (requis, max 1000 caractères)
  technologies: Array[String] (requis)
  imageUrl: String
  githubUrl: String
  liveUrl: String
  category: String (web/mobile/desktop/autre)
  featured: Boolean (défaut: false)
  status: String (en cours/terminé/archivé)
  startDate: Date
  endDate: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 👤 Auteur

**Meissa Babou**
- Email: meissababou66@gmail.com
- GitHub: [github.com/meissadev](https://github.com/meissadev)
- GitLab: [gitlab.com/meissababou66](https://gitlab.com/meissababou66)

## 📄 Licence

ISC
