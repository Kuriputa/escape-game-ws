# Escape Game - Point and Click

## Description

Jeu d'escape game point-and-click dans un hôpital avec système de dialogue et d'inventaire.

## Fonctionnalités actuelles

✅ Salle d'hôpital avec perspective
✅ Talkie-walkie interactif qui déclenche un dialogue avec un PNJ
✅ Boîte cliquable contenant 3 objets :
  - Carte 🗺️
  - Badge "Salle Info" 🔖
  - Post-it "Mot de passe" 📝
✅ Barre d'inventaire de 5 cases en bas de l'écran
✅ Système de collecte d'objets par clic
✅ Effets de survol sur les objets interactifs

## Comment tester

### Option 1 : Serveur local simple
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si http-server est installé)
npx http-server -p 8000
```

Puis ouvrir : http://localhost:8000/index.html

### Option 2 : Extension VS Code
Installer "Live Server" et faire clic droit sur `index.html` → "Open with Live Server"

## Contrôles

- **Clic sur le talkie-walkie** : Affiche le dialogue de mission du PNJ
- **Clic sur la boîte** : Ouvre l'inventaire de la boîte
- **Clic sur un objet dans la boîte** : Ajoute l'objet à votre inventaire
- **Bouton Fermer** : Ferme les overlays

## Structure du code

```
escape-game-front/
├── index.html              # Point d'entrée HTML
├── phaser.js              # Bibliothèque Phaser
├── src/
│   ├── main.js            # Configuration Phaser
│   └── scenes/
│       ├── Start.js       # Scène de démo (non utilisée)
│       └── GameScene.js   # Scène principale du jeu
└── assets/                # Assets graphiques (à ajouter)
```

## Prochaines étapes

1. **Ajouter de vrais assets graphiques** (images de fond, sprites)
2. **Intégrer avec le système Ink** pour les dialogues dynamiques
3. **Connecter avec Photon** pour le multijoueur
4. **Ajouter plus de salles** et d'énigmes
5. **Système de portes** et de navigation entre salles
6. **Utilisation des objets** de l'inventaire

## Intégration avec le projet principal

Voir le fichier `INTEGRATION.md` pour les instructions détaillées sur comment intégrer ce jeu avec le système de multijoueur et de dialogue du dossier `client`.