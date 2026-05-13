FROM node:24-alpine

# Créer le répertoire de l'application
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["node", "src/app.js"]
