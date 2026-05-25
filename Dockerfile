# ==========================================
# Étape 1 : Build de l'application TypeScript
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration de package
COPY package*.json tsconfig.json ./

# Installation de toutes les dépendances (y compris les devDependencies pour compiler)
RUN npm ci

# Copie des fichiers sources de l'application
COPY src ./src

# Compilation de TypeScript en JavaScript (génère le dossier /dist)
RUN npm run build

# Nettoyage pour ne garder que ce qui est nécessaire
RUN npm prune --production

# ==========================================
# Étape 2 : Image finale de Production
# ==========================================
FROM node:20-alpine

# Configuration de l'environnement de production
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Création du dossier et configuration des permissions pour l'utilisateur non-root "node"
RUN chown -R node:node /app

# Utilisation de l'utilisateur non-root prédéfini dans l'image Alpine Node officielle
USER node

# Copie des fichiers de configuration package requis pour la production
COPY --chown=node:node package*.json ./

# Installation des dépendances de production uniquement (rapide et sécurisé)
RUN npm ci --only=production

# Copie des fichiers compilés depuis l'étape de construction (builder)
COPY --chown=node:node --from=builder /app/dist ./dist

# L'application écoute sur le port 3000
EXPOSE 3000

# Commande de démarrage (exécute "node dist/server.js")
CMD ["npm", "start"]
