# Portfolio Backend API

API REST pour la gestion de portfolio développée avec Express.js et MongoDB.

## 🚀 Fonctionnalités

- ✅ Créer un nouveau projet
- ✅ Récupérer tous les projets (avec filtres optionnels)
- ✅ Récupérer les informations d'un projet spécifique
- ✅ Modifier les informations d'un projet
- ✅ Supprimer un projet

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (via Docker ou local)
- npm ou yarn

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

3. Modifier le fichier `.env` :
```env
PORT=5000
MONGO_URI=mongodb://portfolio-mongo:27017/portfolio
NODE_ENV=development
CORS_ORIGIN=http://portfolio-frontend:80
```

## 🚀 Démarrage

### Mode développement (avec rechargement automatique)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

### Ajouter des données de test
```bash
npm run seed
```

Le serveur démarre sur `http://localhost:5000`

## 📚 Documentation API

### Base URL

**Depuis l'hôte (localhost):**
```
http://localhost:5000/api
```

**Depuis un conteneur Docker:**
```
http://portfolio-backend:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Réponse:**
```json
{
  "success": true,
  "message": "API Portfolio fonctionne correctement",
  "timestamp": "2026-05-08T..."
}
```

#### 2. Récupérer tous les projets
```http
GET /api/projects
```

**Query Parameters (optionnels):**
- `category` : Filtrer par catégorie (web, mobile, desktop, autre)
- `featured` : Filtrer les projets mis en avant (true/false)
- `status` : Filtrer par statut (en cours, terminé, archivé)

**Exemple:**
```http
GET /api/projects?category=web&featured=true
```

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

#### 3. Récupérer un projet par ID
```http
GET /api/projects/:id
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Mon Projet",
    "description": "Description du projet",
    "technologies": ["React", "Node.js"],
    ...
  }
}
```

#### 4. Créer un nouveau projet
```http
POST /api/projects
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Nouveau Projet",
  "description": "Description détaillée du projet",
  "technologies": ["React", "Express", "MongoDB"],
  "imageUrl": "https://example.com/image.jpg",
  "githubUrl": "https://github.com/meissadev/projet",
  "liveUrl": "https://projet.com",
  "category": "web",
  "featured": true,
  "status": "terminé"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Projet créé avec succès",
  "data": {...}
}
```

#### 5. Modifier un projet
```http
PUT /api/projects/:id
Content-Type: application/json
```

**Body:** (tous les champs sont optionnels)
```json
{
  "title": "Titre modifié",
  "description": "Nouvelle description",
  "featured": false
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Projet modifié avec succès",
  "data": {...}
}
```

#### 6. Supprimer un projet
```http
DELETE /api/projects/:id
```

**Réponse:**
```json
{
  "success": true,
  "message": "Projet supprimé avec succès",
  "data": {}
}
```

## 📦 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── connectdb.js      # Configuration MongoDB
│   ├── models/
│   │   └── Project.js         # Modèle de données
│   ├── controllers/
│   │   └── projectController.js  # Logique métier
│   ├── routes/
│   │   └── projectRoutes.js   # Définition des routes
│   ├── app.js                 # Point d'entrée
│   └── seed.js                # Script de données de test
├── .env                       # Variables d'environnement
├── .env.example              # Exemple de configuration
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## 📝 Modèle de données

### Project Schema

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| title | String | Oui | Titre du projet (max 100 caractères) |
| description | String | Oui | Description (max 1000 caractères) |
| technologies | Array[String] | Oui | Liste des technologies utilisées |
| imageUrl | String | Non | URL de l'image du projet |
| githubUrl | String | Non | URL du dépôt GitHub |
| liveUrl | String | Non | URL du projet en ligne |
| category | String | Non | Catégorie (web/mobile/desktop/autre) |
| featured | Boolean | Non | Projet mis en avant (défaut: false) |
| status | String | Non | Statut (en cours/terminé/archivé) |
| startDate | Date | Non | Date de début |
| endDate | Date | Non | Date de fin |
| createdAt | Date | Auto | Date de création |
| updatedAt | Date | Auto | Date de modification |

## 🐳 Docker

Le backend est conteneurisé avec Docker. Voir `docker-compose.yml` à la racine du projet.

**Conteneur:** `portfolio-backend`
**Port:** 5000

## 👤 Auteur

**Meissa Babou**
- Email: meissababou66@gmail.com
- GitHub: [github.com/meissadev](https://github.com/meissadev)
- GitLab: [gitlab.com/meissababou66](https://gitlab.com/meissababou66)

## 📄 Licence

ISC
