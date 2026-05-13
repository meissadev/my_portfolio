# 🧪 Guide de Test de l'API

## Méthodes de test

### 1. cURL (Ligne de commande)

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Récupérer tous les projets
```bash
curl http://localhost:5000/api/projects
```

#### Récupérer les projets web
```bash
curl "http://localhost:5000/api/projects?category=web"
```

#### Récupérer les projets mis en avant
```bash
curl "http://localhost:5000/api/projects?featured=true"
```

#### Créer un projet
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Nouveau Projet",
    "description": "Description détaillée du projet",
    "technologies": ["React", "Node.js", "MongoDB"],
    "category": "web",
    "featured": true,
    "status": "en cours",
    "githubUrl": "https://github.com/meissadev/projet",
    "liveUrl": "https://projet.com"
  }'
```

#### Modifier un projet
```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Titre Modifié",
    "status": "terminé"
  }'
```

#### Supprimer un projet
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID
```

### 2. PowerShell (Windows)

#### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```

#### Récupérer tous les projets
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/projects" -Method Get
```

#### Créer un projet
```powershell
$body = @{
    title = "Mon Nouveau Projet"
    description = "Description du projet"
    technologies = @("React", "Node.js")
    category = "web"
    featured = $true
    githubUrl = "https://github.com/meissadev/projet"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/projects" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 3. Postman / Insomnia

1. Importer le fichier `api-tests.json`
2. Exécuter les requêtes
3. Remplacer `PROJECT_ID_HERE` par un ID réel

## Scénarios de test

### Scénario 1 : Workflow complet

```bash
# 1. Vérifier que l'API fonctionne
curl http://localhost:5000/api/health

# 2. Créer un projet
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Project for testing",
    "technologies": ["React", "Express"],
    "category": "web"
  }'

# 3. Noter l'ID retourné (ex: 6745abc123def456789)

# 4. Récupérer le projet créé
curl http://localhost:5000/api/projects/6745abc123def456789

# 5. Modifier le projet
curl -X PUT http://localhost:5000/api/projects/6745abc123def456789 \
  -H "Content-Type: application/json" \
  -d '{"status": "terminé"}'

# 6. Supprimer le projet
curl -X DELETE http://localhost:5000/api/projects/6745abc123def456789
```

### Scénario 2 : Tests de validation

#### Créer un projet sans titre (devrait échouer)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Sans titre",
    "technologies": ["React"]
  }'
```

#### Créer un projet sans technologies (devrait échouer)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sans technologies",
    "description": "Description"
  }'
```

#### Récupérer un projet avec ID invalide (devrait échouer)
```bash
curl http://localhost:5000/api/projects/invalid-id
```

### Scénario 3 : Tests de filtrage

```bash
# Projets web uniquement
curl "http://localhost:5000/api/projects?category=web"

# Projets mis en avant
curl "http://localhost:5000/api/projects?featured=true"

# Projets terminés
curl "http://localhost:5000/api/projects?status=terminé"

# Combinaison de filtres
curl "http://localhost:5000/api/projects?category=web&featured=true"
```

## Réponses attendues

### Succès (200/201)
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

### Erreur de validation (400)
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": ["Le titre est requis", "..."]
}
```

### Non trouvé (404)
```json
{
  "success": false,
  "message": "Projet non trouvé"
}
```

### Erreur serveur (500)
```json
{
  "success": false,
  "message": "Erreur serveur",
  "error": "..."
}
```

## Codes de statut HTTP

- `200 OK` - Succès (GET, PUT, DELETE)
- `201 Created` - Ressource créée (POST)
- `400 Bad Request` - Erreur de validation
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

## 👤 Auteur

**Meissa Babou**
- Email: meissababou66@gmail.com
- GitHub: [github.com/meissadev](https://github.com/meissadev)
- GitLab: [gitlab.com/meissababou66](https://gitlab.com/meissababou66)
