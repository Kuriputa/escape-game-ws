# 🚀 GUIDE DE DÉPLOIEMENT

Ce guide vous explique comment déployer l'Escape Game Coopératif en production.

---

## 📋 TABLE DES MATIÈRES

- [Prérequis](#-prérequis)
- [Configuration Photon](#-configuration-photon)
- [Build de Production](#-build-de-production)
- [Déploiement sur Netlify](#-déploiement-sur-netlify)
- [Déploiement sur Vercel](#-déploiement-sur-vercel)
- [Déploiement sur GitHub Pages](#-déploiement-sur-github-pages)
- [Déploiement sur serveur personnalisé](#-déploiement-sur-serveur-personnalisé)
- [Variables d'environnement](#-variables-denvironnement)
- [Optimisations](#-optimisations)
- [Monitoring](#-monitoring)
- [Troubleshooting](#-troubleshooting)

---

## ✅ PRÉREQUIS

Avant de déployer, assurez-vous d'avoir :

- ✅ Node.js v16+ installé
- ✅ npm ou yarn installé
- ✅ Un compte Photon Engine (gratuit)
- ✅ Git installé
- ✅ Un compte sur la plateforme de déploiement choisie

---

## 🔧 CONFIGURATION PHOTON

### 1. Créer un compte Photon

1. Allez sur [Photon Engine](https://www.photonengine.com/)
2. Créez un compte gratuit
3. Connectez-vous au dashboard

### 2. Créer une application

1. Dans le dashboard, cliquez sur **"Create a New App"**
2. Choisissez **"Photon Realtime"**
3. Donnez un nom à votre application (ex: "EscapeGameCoop")
4. Sélectionnez la région la plus proche de vos joueurs
5. Cliquez sur **"Create"**

### 3. Récupérer l'App ID

1. Dans la liste de vos applications, cliquez sur votre app
2. Copiez l'**App ID** (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 4. Configurer l'App ID dans le projet

Ouvrez le fichier `client/src/net/photonClient.ts` et remplacez l'App ID :

```typescript
// Avant
const PHOTON_APP_ID = "YOUR_APP_ID_HERE";

// Après
const PHOTON_APP_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
```

**⚠️ IMPORTANT :** Ne commitez JAMAIS votre App ID dans un repository public !

### 5. Utiliser les variables d'environnement (recommandé)

Créez un fichier `.env` dans le dossier `client/` :

```env
VITE_PHOTON_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Modifiez `photonClient.ts` pour utiliser la variable :

```typescript
const PHOTON_APP_ID = import.meta.env.VITE_PHOTON_APP_ID || "YOUR_APP_ID_HERE";
```

Ajoutez `.env` au `.gitignore` :

```gitignore
# Environment variables
.env
.env.local
.env.production
```

---

## 🏗️ BUILD DE PRODUCTION

### 1. Nettoyer le projet

```bash
cd client
rm -rf dist node_modules
npm install
```

### 2. Lancer le build

```bash
npm run build
```

### 3. Vérifier le build

```bash
npm run preview
```

Ouvrez `http://localhost:4173` pour tester le build de production.

### 4. Vérifier la taille du bundle

Le build devrait afficher :

```
dist/index.html                    9.45 kB │ gzip:   2.68 kB
dist/assets/index-[hash].js    1,701.57 kB │ gzip: 392.84 kB
```

⚠️ **Note :** Le bundle est volumineux à cause de Phaser et Photon. Voir [Optimisations](#-optimisations) pour réduire la taille.

---

## 🌐 DÉPLOIEMENT SUR NETLIFY

### Méthode 1 : Déploiement via Git (recommandé)

#### 1. Préparer le repository

```bash
# Créer un repository Git si ce n'est pas déjà fait
git init
git add .
git commit -m "Initial commit"

# Pousser sur GitHub
git remote add origin https://github.com/votre-username/escape-game.git
git push -u origin main
```

#### 2. Connecter à Netlify

1. Allez sur [Netlify](https://www.netlify.com/)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **GitHub** et autorisez l'accès
4. Sélectionnez votre repository

#### 3. Configurer le build

```yaml
# Build settings
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

#### 4. Ajouter les variables d'environnement

Dans **Site settings** → **Environment variables** :

```
VITE_PHOTON_APP_ID = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 5. Déployer

Cliquez sur **"Deploy site"**. Netlify va :
- Installer les dépendances
- Lancer le build
- Déployer sur un domaine `*.netlify.app`

### Méthode 2 : Déploiement manuel

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
cd client
npm run build
netlify deploy --prod --dir=dist
```

### Configuration netlify.toml

Créez un fichier `netlify.toml` à la racine du projet :

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## ▲ DÉPLOIEMENT SUR VERCEL

### Méthode 1 : Déploiement via Git

#### 1. Connecter à Vercel

1. Allez sur [Vercel](https://vercel.com/)
2. Cliquez sur **"Add New"** → **"Project"**
3. Importez votre repository GitHub

#### 2. Configurer le projet

```yaml
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Ajouter les variables d'environnement

Dans **Settings** → **Environment Variables** :

```
VITE_PHOTON_APP_ID = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 4. Déployer

Cliquez sur **"Deploy"**. Vercel va déployer automatiquement.

### Méthode 2 : Déploiement via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd client
vercel --prod
```

### Configuration vercel.json

Créez un fichier `vercel.json` dans le dossier `client/` :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📄 DÉPLOIEMENT SUR GITHUB PAGES

### 1. Configurer vite.config.ts

Modifiez `client/vite.config.ts` :

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/escape-game/', // Remplacez par le nom de votre repo
  build: {
    outDir: 'dist',
  },
});
```

### 2. Créer un script de déploiement

Créez `client/deploy.sh` :

```bash
#!/usr/bin/env sh

# Arrêter en cas d'erreur
set -e

# Build
npm run build

# Naviguer dans le dossier de build
cd dist

# Créer un repository Git
git init
git add -A
git commit -m 'Deploy'

# Pousser sur la branche gh-pages
git push -f git@github.com:votre-username/escape-game.git main:gh-pages

cd -
```

### 3. Rendre le script exécutable

```bash
chmod +x deploy.sh
```

### 4. Déployer

```bash
./deploy.sh
```

### 5. Activer GitHub Pages

1. Allez dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **gh-pages** / **root**
4. Cliquez sur **Save**

Votre site sera disponible sur `https://votre-username.github.io/escape-game/`

---

## 🖥️ DÉPLOIEMENT SUR SERVEUR PERSONNALISÉ

### Option 1 : Serveur statique (Nginx)

#### 1. Build le projet

```bash
cd client
npm run build
```

#### 2. Copier les fichiers sur le serveur

```bash
scp -r dist/* user@votre-serveur.com:/var/www/escape-game/
```

#### 3. Configurer Nginx

Créez `/etc/nginx/sites-available/escape-game` :

```nginx
server {
    listen 80;
    server_name escape-game.votre-domaine.com;
    root /var/www/escape-game;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compression gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 4. Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/escape-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Configurer HTTPS avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d escape-game.votre-domaine.com
```

### Option 2 : Serveur Node.js (Express)

#### 1. Créer un serveur Express

Créez `server.js` à la racine :

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'client/dist')));

// Toutes les routes renvoient index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 2. Installer les dépendances

```bash
npm install express
```

#### 3. Créer un script de démarrage

Dans `package.json` :

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "cd client && npm run build"
  }
}
```

#### 4. Déployer avec PM2

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server.js --name escape-game

# Sauvegarder la configuration
pm2 save

# Démarrage automatique au boot
pm2 startup
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT

### Variables disponibles

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_PHOTON_APP_ID` | App ID Photon | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_PHOTON_REGION` | Région Photon | `eu`, `us`, `asia` |
| `VITE_API_URL` | URL de l'API (si backend) | `https://api.example.com` |

### Configuration par environnement

#### Développement (`.env.development`)

```env
VITE_PHOTON_APP_ID=dev-app-id
VITE_PHOTON_REGION=eu
```

#### Production (`.env.production`)

```env
VITE_PHOTON_APP_ID=prod-app-id
VITE_PHOTON_REGION=eu
```

### Utilisation dans le code

```typescript
const config = {
  photonAppId: import.meta.env.VITE_PHOTON_APP_ID,
  photonRegion: import.meta.env.VITE_PHOTON_REGION || 'eu',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};
```

---

## ⚡ OPTIMISATIONS

### 1. Réduire la taille du bundle

#### Code Splitting

Modifiez `vite.config.ts` :

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser': ['phaser'],
          'photon': ['photon'],
          'ink': ['inkjs'],
        },
      },
    },
  },
});
```

#### Lazy Loading des scènes

```typescript
// Au lieu de
import { ServerRoomScene } from './scenes/ServerRoomScene';

// Utilisez
const ServerRoomScene = () => import('./scenes/ServerRoomScene');
```

### 2. Compression

#### Activer la compression Brotli

Dans `vite.config.ts` :

```typescript
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
});
```

### 3. Cache des assets

Configurez les headers de cache :

```nginx
# Nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 4. CDN

Utilisez un CDN pour Phaser et Photon :

```html
<!-- Dans index.html -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
<script src="https://cdn.photonengine.com/photon.min.js"></script>
```

---

## 📊 MONITORING

### 1. Google Analytics

Ajoutez dans `index.html` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/browser
```

Dans `main.ts` :

```typescript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://xxxxx@sentry.io/xxxxx",
  environment: import.meta.env.MODE,
});
```

### 3. Photon Dashboard

Surveillez les métriques dans le dashboard Photon :
- Nombre de joueurs connectés
- Nombre de salles actives
- Latence moyenne
- Erreurs de connexion

---

## 🐛 TROUBLESHOOTING

### Problème : Le jeu ne se charge pas

**Solution :**
1. Vérifiez la console (F12)
2. Vérifiez que l'App ID Photon est correct
3. Vérifiez que les fichiers sont bien servis (Network tab)

### Problème : Erreur CORS

**Solution :**
Configurez les headers CORS sur votre serveur :

```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
```

### Problème : Les assets ne se chargent pas

**Solution :**
Vérifiez le `base` dans `vite.config.ts` :

```typescript
export default defineConfig({
  base: '/', // Pour domaine racine
  // OU
  base: '/escape-game/', // Pour sous-dossier
});
```

### Problème : Photon ne se connecte pas

**Solution :**
1. Vérifiez l'App ID
2. Vérifiez la région Photon
3. Vérifiez les quotas (plan gratuit limité)
4. Vérifiez le firewall (port 443 ouvert)

### Problème : Build trop volumineux

**Solution :**
1. Activez le code splitting
2. Utilisez des CDN pour les librairies
3. Activez la compression Brotli
4. Supprimez les dépendances inutilisées

---

## 📝 CHECKLIST DE DÉPLOIEMENT

Avant de déployer en production :

- [ ] ✅ App ID Photon configuré
- [ ] ✅ Variables d'environnement définies
- [ ] ✅ Build de production testé localement
- [ ] ✅ Tous les tests passent
- [ ] ✅ Compression activée
- [ ] ✅ HTTPS configuré
- [ ] ✅ Cache des assets configuré
- [ ] ✅ Monitoring configuré (Analytics, Sentry)
- [ ] ✅ Documentation à jour
- [ ] ✅ README avec instructions de déploiement
- [ ] ✅ `.env` dans `.gitignore`
- [ ] ✅ Domaine personnalisé configuré (optionnel)

---

## 🔄 MISE À JOUR

### Déploiement continu (CI/CD)

#### GitHub Actions

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd client
        npm ci
    
    - name: Build
      env:
        VITE_PHOTON_APP_ID: ${{ secrets.PHOTON_APP_ID }}
      run: |
        cd client
        npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=client/dist
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes de déploiement :

- **Documentation Netlify** : https://docs.netlify.com/
- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Photon** : https://doc.photonengine.com/
- **GitHub Issues** : [Lien vers votre repo]

---

## 🎉 FÉLICITATIONS !

Votre Escape Game Coopératif est maintenant déployé en production ! 🚀

N'oubliez pas de :
- 📊 Surveiller les métriques
- 🐛 Corriger les bugs rapidement
- 💬 Écouter les retours des joueurs
- 🔄 Mettre à jour régulièrement

---

<div align="center">

**Bon déploiement ! 🎮**

[🏠 Retour au README](README.md) | [📚 Documentation](GAME_IMPLEMENTATION.md) | [🎮 Guide Joueurs](GUIDE_JOUEURS.md)

</div>