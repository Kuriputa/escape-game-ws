# 📝 CHANGELOG

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.0.0] - 2024-01-XX

### 🎉 Version initiale - Jeu complet et fonctionnel

#### ✨ Ajouté

##### Scènes du jeu
- **HospitalRoomScene** : Salle de départ commune avec attribution des rôles
- **CorridorSceneA** : Couloir sombre pour Joueur A avec porte verrouillée
- **ComputerRoomSceneB** : Terminal Linux et générateur électrique pour Joueur B
- **PatientRoomScene** : Puzzle de dosage médical pour Joueur A
- **MedicineStorageScene** : Stockage avec formule et clé de chiffrement pour Joueur B
- **ServerRoomScene** : Déchiffrement de fichiers pour Joueur A
- **WaitingRoomScene** : Puzzle de synchronisation des boutons (commune)
- **ExitRoomScene** : Dilemme moral final avec 4 fins possibles (commune)

##### Puzzles coopératifs
- **Power Grid** : Joueur B active le générateur → Joueur A peut progresser
- **Dosage médical** : Joueur B transmet la formule → Joueur A calcule le dosage
- **Déchiffrement** : Joueur B transmet la clé → Joueur A déchiffre les fichiers
- **Synchronisation** : Les deux joueurs coordonnent les boutons
- **Dilemme moral** : Les deux joueurs font un choix éthique

##### Système réseau
- Intégration de Photon Realtime pour le multijoueur
- Système de chat en temps réel
- Synchronisation des puzzles entre joueurs
- Événements personnalisés (`PUZZLE_UPDATE` avec types)
- Gestion des rôles (Joueur A / B)

##### Interface utilisateur
- Menu principal stylisé avec animations CSS
- Lobby avec liste des joueurs et badges de rôle
- Chat coopératif avec messages différenciés
- Effets visuels (fadeIn, pulse, glow, hover)
- Design responsive et moderne
- Palette de couleurs cohérente

##### Documentation
- `README.md` : Présentation générale du projet
- `GAME_IMPLEMENTATION.md` : Documentation technique complète
- `GAME_FLOW.md` : Diagramme de flux du jeu
- `TESTING_GUIDE.md` : Guide de test avec 20 scénarios
- `GUIDE_JOUEURS.md` : Guide complet pour les joueurs
- `DEPLOYMENT_GUIDE.md` : Guide de déploiement en production
- `IMPLEMENTATION_COMPLETE.md` : Récapitulatif de l'implémentation

##### Technique
- Configuration TypeScript strict
- Build Vite optimisé
- Gestion d'état centralisée (GameState)
- Pattern de préservation des event handlers
- Animations Phaser (tweens, fade, glow)
- Système de navigation entre scènes

#### 🎨 Design

##### Palette de couleurs
- Bleu clair (`#00d9ff`) : UI, titres, éléments interactifs
- Vert (`#00ff00`) : Succès, validation, Joueur A
- Rouge (`#ff0000`) : Erreur, danger, Joueur B
- Jaune (`#ffff00`) : Avertissement, information
- Orange (`#ffaa00`) : Attention, urgence
- Gris foncé (`#1a1a1a`) : Murs, arrière-plans
- Gris moyen (`#2c2c2c`) : Sol, surfaces
- Noir (`#000000`) : Overlay, fond

##### Animations
- FadeIn pour l'apparition des scènes
- Pulse pour les boutons importants
- Glow pour les titres et éléments clés
- Hover effects sur tous les éléments interactifs
- Tweens pour les LEDs, étincelles, brillances

#### 🎓 Objectifs pédagogiques

##### Cybersécurité
- Sensibilisation aux mots de passe sur post-its
- Importance du chiffrement des données
- Protection des données de santé (RGPD)

##### Éthique médicale
- Importance du dosage précis des médicaments
- Le patient comme être humain
- Coordination d'équipe médicale

##### Morale et éthique
- Dilemme entre intérêt personnel et bien commun
- Conséquences de nos choix
- Importance de la confiance dans une équipe

#### 📊 Statistiques

- **Lignes de code** : ~3,700 lignes TypeScript
- **Scènes** : 8 scènes interconnectées
- **Puzzles** : 5 puzzles coopératifs
- **Fins** : 4 épilogues différents
- **Durée de jeu** : 20-30 minutes
- **Taille du build** : 1.7 MB (392 KB gzippé)

---

## [Unreleased] - Fonctionnalités prévues

### 🚀 Version 1.1 (Prochaine)

#### À ajouter
- [ ] Système de sons et musiques d'ambiance
- [ ] Animations de personnages (sprites)
- [ ] Effets de particules avancés
- [ ] Système d'achievements
- [ ] Statistiques de fin de partie (temps, erreurs, etc.)
- [ ] Mode tutoriel pour nouveaux joueurs
- [ ] Système de hints (indices) optionnels

#### À améliorer
- [ ] Optimisation de la taille du bundle (code splitting)
- [ ] Compression Brotli
- [ ] Tests automatisés (unitaires et E2E)
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring avec Sentry et Analytics

#### À corriger
- [ ] Warning de taille de chunk (>500 KB)
- [ ] Gestion des déconnexions réseau
- [ ] Validation des entrées utilisateur

---

### 🎮 Version 1.2 (Future)

#### À ajouter
- [ ] Mode histoire étendu avec Ink
- [ ] Nouvelles salles et puzzles
- [ ] Mode compétitif (course contre la montre)
- [ ] Classement en ligne
- [ ] Système de replay
- [ ] Personnalisation des avatars

#### À améliorer
- [ ] Graphismes améliorés
- [ ] Animations plus fluides
- [ ] Effets sonores contextuels
- [ ] Meilleure gestion des erreurs réseau

---

### 🌍 Version 2.0 (Vision long terme)

#### À ajouter
- [ ] Support 4 joueurs
- [ ] Éditeur de niveaux
- [ ] Mode campagne avec plusieurs chapitres
- [ ] Localisation (FR, EN, ES, DE)
- [ ] Mode solo avec IA
- [ ] Système de progression et niveaux
- [ ] Boutique de cosmétiques

#### À améliorer
- [ ] Refonte graphique complète
- [ ] Moteur physique avancé
- [ ] Système de dialogue amélioré
- [ ] Backend dédié pour le matchmaking

---

## 📋 Types de changements

- **✨ Ajouté** : Nouvelles fonctionnalités
- **🔄 Modifié** : Changements dans les fonctionnalités existantes
- **❌ Déprécié** : Fonctionnalités bientôt supprimées
- **🗑️ Supprimé** : Fonctionnalités supprimées
- **🐛 Corrigé** : Corrections de bugs
- **🔒 Sécurité** : Corrections de vulnérabilités
- **📚 Documentation** : Changements dans la documentation
- **🎨 Style** : Changements de style/design
- **⚡ Performance** : Améliorations de performance
- **🧪 Tests** : Ajout ou modification de tests

---

## 🔗 Liens

- [Repository GitHub](https://github.com/votre-username/escape-game)
- [Documentation](https://github.com/votre-username/escape-game/blob/main/README.md)
- [Issues](https://github.com/votre-username/escape-game/issues)
- [Pull Requests](https://github.com/votre-username/escape-game/pulls)

---

## 📝 Notes de version

### Comment lire ce changelog

- **[X.Y.Z]** : Numéro de version (Semantic Versioning)
  - **X** : Version majeure (changements incompatibles)
  - **Y** : Version mineure (nouvelles fonctionnalités compatibles)
  - **Z** : Version patch (corrections de bugs)

- **Date** : Date de publication de la version

### Contribuer au changelog

Lors de l'ajout de nouvelles fonctionnalités :

1. Ajoutez une entrée dans la section `[Unreleased]`
2. Utilisez le bon type de changement (✨, 🔄, 🐛, etc.)
3. Décrivez clairement le changement
4. Mentionnez les issues/PRs liées si applicable

Exemple :
```markdown
### ✨ Ajouté
- Nouveau puzzle de labyrinthe dans la salle 9 (#42)
- Support du mode sombre (#38)
```

---

<div align="center">

**Merci de contribuer à l'amélioration du jeu ! 🎮**

[🏠 Retour au README](README.md)

</div>