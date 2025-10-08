# Guide de démarrage rapide - Escape Game

## 🎮 Tester le jeu point-and-click (escape-game-front)

### Option 1 : Avec PowerShell (Recommandé)
```powershell
cd "C:\Users\lebro\Documents\Escape Game\escape-game-ws\escape-game-front"
.\start-server.ps1
```

### Option 2 : Avec Python
```bash
cd escape-game-front
python -m http.server 8000
```
Puis ouvrir : http://localhost:8000/index.html

### Option 3 : Avec VS Code Live Server
1. Installer l'extension "Live Server"
2. Clic droit sur `escape-game-front/index.html`
3. Sélectionner "Open with Live Server"

## 🌐 Tester le jeu complet avec multijoueur (client)

### 1. Démarrer le backend (si nécessaire)
```bash
cd backend
# Suivre les instructions du backend
```

### 2. Configurer les variables d'environnement
Créer/vérifier le fichier `client/.env` :
```env
VITE_PHOTON_APP_ID=votre_app_id
VITE_PHOTON_APP_VERSION=1.0
VITE_PHOTON_REGION=eu
```

### 3. Installer les dépendances
```bash
cd client
npm install
```

### 4. Lancer le client
```bash
npm run dev
```

### 5. Tester le multijoueur
1. Ouvrir plusieurs onglets : http://localhost:5173
2. Dans chaque onglet :
   - Entrer un pseudo différent
   - Entrer le même nom de salle
   - Cliquer sur "Rejoindre"
3. Dans un des onglets, cliquer sur "Commencer"
4. Le jeu démarre pour tous les joueurs !

## 🎯 Fonctionnalités actuelles

### Dans escape-game-front (standalone)
- ✅ Salle d'hôpital avec décor
- ✅ Talkie-walkie interactif
- ✅ Boîte avec 3 objets
- ✅ Inventaire de 5 cases
- ✅ Système de collecte d'objets

### Dans client (avec multijoueur)
- ✅ Menu de connexion
- ✅ Lobby avec liste des joueurs
- ✅ Chat en temps réel
- ✅ Synchronisation du démarrage
- ✅ Système de dialogue Ink
- ✅ GameScene TypeScript (à intégrer)

## 🔧 Intégration de GameScene dans le client

Pour intégrer le jeu point-and-click dans le système multijoueur :

1. La scène TypeScript est déjà créée : `client/src/scenes/GameScene.ts`
2. Suivre les instructions dans : `client/INTEGRATION_EXAMPLE.md`
3. Compiler le fichier Ink : `client/src/ink/mission.ink` → `mission.json`

## 📝 Prochaines étapes

1. **Intégrer GameScene dans main.ts**
   - Remplacer la scène inline par GameScene
   - Passer les objets `net` et `story` à la scène

2. **Créer plus de salles**
   - Couloir
   - Salle informatique
   - Bureau du Dr. Morrison

3. **Ajouter des énigmes**
   - Utiliser les objets de l'inventaire
   - Puzzles collaboratifs

4. **Améliorer les graphismes**
   - Remplacer les formes géométriques par des sprites
   - Ajouter des animations

5. **Synchroniser la progression**
   - État du jeu partagé entre joueurs
   - Énigmes résolues en équipe

## 🐛 Dépannage

### Le serveur Python ne démarre pas
- Vérifier que Python est installé : `python --version`
- Essayer avec Node.js : `npx http-server -p 8000`

### Le client ne se connecte pas à Photon
- Vérifier le fichier `.env`
- Vérifier que l'APP_ID Photon est valide
- Vérifier la console du navigateur pour les erreurs

### Le jeu ne s'affiche pas
- Ouvrir la console du navigateur (F12)
- Vérifier les erreurs JavaScript
- Vérifier que Phaser est bien chargé

## 📚 Documentation

- **Phaser 3** : https://photonstorm.github.io/phaser3-docs/
- **Ink** : https://github.com/inkle/ink
- **Photon** : https://doc.photonengine.com/

## 🎨 Assets à créer

Pour améliorer le visuel, créez ces images :

### escape-game-front/assets/
- `hospital-room.png` (1280x720) - Fond de la salle
- `walkie-talkie.png` (100x150) - Sprite du talkie
- `box.png` (150x150) - Sprite de la boîte
- `items/card.png` (80x80) - Carte
- `items/badge.png` (80x80) - Badge
- `items/postit.png` (80x80) - Post-it

### Outils recommandés
- **Aseprite** - Pour le pixel art
- **GIMP** - Pour l'édition d'images
- **Inkscape** - Pour les graphiques vectoriels
- **Photopea** - Alternative en ligne à Photoshop

## 💡 Conseils

1. **Testez d'abord en standalone** (escape-game-front) avant d'intégrer
2. **Utilisez le chat** pour communiquer entre joueurs pendant les tests
3. **Sauvegardez régulièrement** votre progression
4. **Documentez vos énigmes** pour ne pas les oublier

Bon développement ! 🚀