# 🏥 Hospital Escape Game - Multiplayer Edition

> Un jeu d'évasion coopératif en temps réel où vous devez résoudre des énigmes pour sortir d'un hôpital mystérieux.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-stable-green.svg)]()
[![Phaser](https://img.shields.io/badge/Phaser-3.80-orange.svg)](https://phaser.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## 🎮 Démarrage Rapide

### Le serveur est déjà lancé !
**URL** : http://localhost:5174/

### Comment jouer ?
1. Ouvrez votre navigateur
2. Allez sur http://localhost:5174/
3. Entrez un pseudo et un nom de salle
4. Cliquez sur "Rejoindre" puis "Commencer"
5. **Résolvez l'énigme !** 🧩

---

## ✨ Fonctionnalités

### 🎯 Gameplay
- 🔒 **Énigme à résoudre** : Trouvez le code à 6 chiffres
- 🗺️ **Objets à collecter** : Carte, Badge, Post-it
- 🔄 **Système d'inventaire** : Ramassez et reposez les objets
- 🚪 **Navigation** : Explorez plusieurs salles

### 👥 Multiplayer
- 🌐 **Temps réel** : Synchronisation instantanée
- 🤝 **Coopératif** : Travaillez ensemble
- 💬 **Chat intégré** : Communiquez avec votre équipe
- 🔗 **Photon Network** : Infrastructure réseau robuste

### 🎨 Interface
- 🌑 **Transition fluide** : Fondu noir au démarrage
- 🖱️ **Point-and-click** : Interface intuitive
- 📱 **Responsive** : Fonctionne sur tous les écrans
- ✨ **Effets visuels** : Animations et feedbacks

---

## 📚 Documentation

### 🚀 Pour Commencer
👉 **[README_FINAL.md](./README_FINAL.md)** - Guide de démarrage complet

### 📖 Documentation Complète
👉 **[INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md)** - Index de toute la documentation

### Fichiers Principaux
- **[NOUVELLES_FONCTIONNALITES.md](./NOUVELLES_FONCTIONNALITES.md)** - Fonctionnalités détaillées
- **[GUIDE_VISUEL.md](./GUIDE_VISUEL.md)** - Schémas et visuels
- **[TEST_NOUVELLES_FONCTIONNALITES.md](./TEST_NOUVELLES_FONCTIONNALITES.md)** - Guide de test
- **[ASTUCES_DEVELOPPEMENT.md](./ASTUCES_DEVELOPPEMENT.md)** - Pour les développeurs
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions

---

## 🎯 L'Énigme

### Indices
1. 📋 **Panneau "Salle 12"** → Indice : **12**
2. 🕐 **Horloge "04:55"** → Indice : **04:55**

### Solution
**Code** : `120455` (12 + 04 + 55)

### Objets à Collecter
- 🗺️ **Carte** : Plan de l'hôpital
- 🔖 **Badge** : Accès Salle Info
- 📝 **Post-it** : Mot de passe

---

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Commandes
```bash
# Installer les dépendances
cd client
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
```

---

## 🎮 Contrôles

### Souris 🖱️
- **Clic gauche** : Interagir avec les objets
- **Survol** : Voir les effets de surbrillance

### Clavier ⌨️
- **F12** : Ouvrir la console de débogage

---

## 🏗️ Architecture

### Technologies
- **Phaser 3** : Moteur de jeu
- **TypeScript** : Langage de programmation
- **Photon** : Réseau multiplayer
- **Vite** : Build tool
- **Ink** : Système de narration

### Structure
```
escape-game-ws/
├── client/                    # Application client
│   ├── src/
│   │   ├── scenes/           # Scènes Phaser
│   │   │   ├── HospitalRoomScene.ts  ⭐ Scène principale
│   │   │   ├── CorridorScene.ts
│   │   │   └── ComputerRoomScene.ts
│   │   ├── net/              # Réseau Photon
│   │   └── ink/              # Dialogues Ink
│   ├── public/               # Assets
│   └── main.ts               # Point d'entrée
└── docs/                     # Documentation
```

---

## 🧪 Tests

### Test Rapide
```bash
# Le serveur doit être lancé
# Ouvrez http://localhost:5174/
# Suivez le guide dans README_FINAL.md
```

### Test Multiplayer
1. Ouvrez 2 navigateurs/onglets
2. Connectez-vous avec des pseudos différents
3. Rejoignez la même salle
4. Testez la synchronisation

### Checklist Complète
👉 Voir **[TEST_NOUVELLES_FONCTIONNALITES.md](./TEST_NOUVELLES_FONCTIONNALITES.md)**

---

## 🐛 Problèmes Connus

### Le fondu noir ne s'affiche pas
**Solution** : Rechargez la page (Ctrl+R)

### Les objets ne se synchronisent pas
**Solution** : Vérifiez que les 2 joueurs sont dans la même salle

### Le pavé numérique ne répond pas
**Solution** : Cliquez sur les boutons (pas le clavier)

👉 Plus de solutions dans **[TEST_NOUVELLES_FONCTIONNALITES.md](./TEST_NOUVELLES_FONCTIONNALITES.md#-problèmes-connus)**

---

## 🚀 Prochaines Étapes

### Version 2.1.0 (À Venir)
- [ ] Sons et musique
- [ ] Sprites personnalisés
- [ ] Animations avancées
- [ ] Système de timer

### Version 2.2.0 (À Venir)
- [ ] Plus d'énigmes
- [ ] Système de hints
- [ ] Mode histoire
- [ ] Achievements

### Version 3.0.0 (À Venir)
- [ ] Plusieurs niveaux
- [ ] Support de 3+ joueurs
- [ ] Optimisation mobile
- [ ] Mode solo avec IA

👉 Voir **[CHANGELOG.md](./CHANGELOG.md)** pour plus de détails

---

## 📊 Statistiques

### Code
- **Lignes de code** : ~1500
- **Fichiers** : ~15
- **Scènes** : 3

### Fonctionnalités
- **Objets interactifs** : 5
- **Énigmes** : 1
- **Salles** : 3

### Documentation
- **Fichiers** : 12
- **Pages** : ~72
- **Temps de lecture** : ~2h

---

## 🤝 Contribution

### Comment Contribuer ?
1. Lisez **[ASTUCES_DEVELOPPEMENT.md](./ASTUCES_DEVELOPPEMENT.md)**
2. Créez une branche
3. Faites vos modifications
4. Testez avec **[TEST_NOUVELLES_FONCTIONNALITES.md](./TEST_NOUVELLES_FONCTIONNALITES.md)**
5. Créez une pull request

### Bonnes Pratiques
- Commentez votre code
- Suivez le style TypeScript
- Testez en multiplayer
- Mettez à jour la documentation

---

## 📝 Licence

Ce projet est sous licence MIT.

---

## 👥 Équipe

- **Développement** : Votre équipe
- **Game Design** : Votre équipe
- **Documentation** : Votre équipe

---

## 🔗 Liens Utiles

### Documentation
- **[Index Complet](./INDEX_DOCUMENTATION.md)** - Toute la documentation
- **[Guide de Démarrage](./README_FINAL.md)** - Pour commencer
- **[Guide Visuel](./GUIDE_VISUEL.md)** - Schémas et visuels

### Ressources Externes
- **[Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)** - Documentation Phaser
- **[Photon Docs](https://doc.photonengine.com/)** - Documentation Photon
- **[TypeScript Docs](https://www.typescriptlang.org/docs/)** - Documentation TypeScript

### Communauté
- **[Phaser Discord](https://discord.gg/phaser)** - Communauté Phaser
- **[Phaser Forum](https://phaser.discourse.group/)** - Forum Phaser

---

## 🎉 Remerciements

Merci d'avoir choisi Hospital Escape Game !

### Technologies Utilisées
- **Phaser 3** - Moteur de jeu incroyable
- **Photon** - Réseau multiplayer fiable
- **TypeScript** - Langage robuste
- **Vite** - Build tool rapide

### Inspirations
- Escape rooms classiques
- Jeux d'aventure point-and-click
- Jeux coopératifs en ligne

---

## 📞 Support

### Besoin d'Aide ?
1. Consultez **[INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md)**
2. Lisez **[README_FINAL.md](./README_FINAL.md)**
3. Ouvrez la console (F12) pour voir les erreurs

### Commandes Utiles
```bash
# Relancer le serveur
cd client && npm run dev

# Installer les dépendances
npm install

# Build de production
npm run build

# Nettoyer le cache
rm -rf node_modules && npm install
```

---

## 🎮 Bon Jeu !

**Version** : 2.0.0  
**Dernière mise à jour** : 2024  
**Status** : Stable ✅

**Amusez-vous bien ! 🎉**

---

<div align="center">

Made with ❤️ by Your Team

[Documentation](./INDEX_DOCUMENTATION.md) • [Guide](./README_FINAL.md) • [Tests](./TEST_NOUVELLES_FONCTIONNALITES.md) • [Changelog](./CHANGELOG.md)

</div>