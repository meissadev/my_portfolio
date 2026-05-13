# Premier stage pour buildere l'application
FROM node:24-alpine AS builder

# Repertoire de travail
WORKDIR /app

# Recuperation et installation des dependances
COPY package*.json .
RUN npm install
# Recuperation du code source
COPY . .

# Definition des variables d'environnement
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de l'application
RUN npm run build

# Deuxieme stage production avec nginx
FROM nginx:1.29.8-alpine

# Recuperation du fichier de configuration de nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Recuperation du code builde
COPY --from=builder /app/dist /usr/share/nginx/html

# Port qui ecoute pour l'application
EXPOSE 80

# Demarrer le service nginx
CMD ["nginx", "-g", "daemon off;"]

