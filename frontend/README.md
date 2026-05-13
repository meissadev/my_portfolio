# Portfolio Frontend

Application React pour le portfolio avec intégration API.

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🔧 Configuration

Le fichier `.env` contient :

**Pour Docker (conteneurs):**
```env
VITE_API_URL=http://portfolio-backend:5000/api
```

**Pour développement local:**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Technologies

- React 19
- Vite
- TailwindCSS
- React Icons

## 🌐 API Integration

Le composant `Projects` charge automatiquement les projets depuis l'API backend. Si l'API n'est pas disponible, des projets par défaut sont affichés.

### Service API

Le fichier `src/services/api.js` contient toutes les fonctions pour communiquer avec le backend :

```javascript
import { projectsAPI } from './services/api';

// Récupérer tous les projets
const projects = await projectsAPI.getAll();

// Récupérer un projet par ID
const project = await projectsAPI.getById(id);

// Créer un projet
const newProject = await projectsAPI.create(data);

// Modifier un projet
const updated = await projectsAPI.update(id, data);

// Supprimer un projet
await projectsAPI.delete(id);
```

## 📁 Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx    # Intégration API
│   ├── Contact.jsx
│   └── Footer.jsx
├── services/
│   └── api.js          # Service API
├── assets/
├── App.jsx
├── main.jsx
└── index.css
```

## 🎨 Personnalisation

Modifier les couleurs dans `index.css` et les composants utilisent TailwindCSS pour le styling.

## 👤 Auteur

**Meissa Babou**
- Email: meissababou66@gmail.com
- GitHub: [github.com/meissadev](https://github.com/meissadev)
- GitLab: [gitlab.com/meissababou66](https://gitlab.com/meissababou66)

## 📄 Licence

ISC
