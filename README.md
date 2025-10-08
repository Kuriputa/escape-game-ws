# 🎮 ESCAPE GAME COOPÉRATIF MULTIJOUEUR

Un jeu d'évasion coopératif en temps réel où deux joueurs doivent s'échapper d'un hôpital en résolvant des énigmes interconnectées. Chaque joueur suit un parcours différent mais doit constamment communiquer et coordonner ses actions avec son partenaire.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Phaser](https://img.shields.io/badge/Phaser-3.x-green)
![Photon](https://img.shields.io/badge/Photon-Realtime-orange)

---

## 🌟 CARACTÉRISTIQUES

- 🤝 **Coopération obligatoire** : Les deux joueurs doivent travailler ensemble pour progresser
- 🗣️ **Chat en temps réel** : Communication intégrée pendant toute la partie
- 🔀 **Parcours divergents** : Chaque joueur explore des salles différentes
- 🧩 **Puzzles asymétriques** : Les informations sont réparties entre les joueurs
- 🎭 **Dilemme moral** : Finale avec 4 épilogues différents selon les choix
- 🎨 **Design cohérent** : Interface minimaliste et immersive
- 💡 **Sensibilisation** : Thèmes de cybersécurité, éthique médicale et protection des données

---

## 📋 TABLE DES MATIÈRES

- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Architecture](#-architecture)
- [Gameplay](#-gameplay)
- [Documentation](#-documentation)
- [Technologies](#-technologies)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🚀 INSTALLATION

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Un compte Photon (pour le multijoueur)

### Étapes d'installation

```bash
# Cloner le repository
git clone https://github.com/votre-repo/escape-game-ws.git
cd escape-game-ws

# Installer les dépendances du client
cd client
npm install

# Compiler le projet
npm run build
```

### Configuration Photon

1. Créer un compte sur [Photon Engine](https://www.photonengine.com/)
2. Créer une nouvelle application Photon Realtime
3. Copier l'App ID
4. Configurer l'App ID dans `client/src/net/photonClient.ts`

```typescript
// Dans photonClient.ts
const PHOTON_APP_ID = "VOTRE_APP_ID_ICI";
```

---

## 🎯 DÉMARRAGE

### Mode développement

```bash
cd client
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173`

### Mode production

```bash
cd client
npm run build
npm run preview
```

### Tester en multijoueur

1. Ouvrir deux navigateurs (ou deux onglets en navigation privée)
2. Naviguer vers `http://localhost:5173` dans les deux
3. Entrer des noms différents pour chaque joueur
4. Cliquer sur "Rejoindre" dans les deux fenêtres
5. Cliquer sur "Démarrer" dans l'une des fenêtres
6. Jouer ! 🎮

---

## 🏗️ ARCHITECTURE

### Structure du projet

```
escape-game-ws/
├── client/
│   ├── src/
│   │   ├── scenes/           # Toutes les scènes du jeu
│   │   │   ├── HospitalRoomScene.ts
│   │   │   ├── CorridorSceneA.ts
│   │   │   ├── ComputerRoomSceneB.ts
│   │   │   ├── PatientRoomScene.ts
│   │   │   ├── MedicineStorageScene.ts
│   │   │   ├── ServerRoomScene.ts
│   │   │   ├── WaitingRoomScene.ts
│   │   │   └── ExitRoomScene.ts
│   │   ├── net/              # Gestion réseau Photon
│   │   │   └── photonClient.ts
│   │   ├── GameState.ts      # État global du jeu
│   │   └── main.ts           # Point d'entrée
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── GAME_IMPLEMENTATION.md    # Documentation complète
├── GAME_FLOW.md              # Schéma du flux du jeu
├── TESTING_GUIDE.md          # Guide de test
└── README.md                 # Ce fichier
```

### Scènes du jeu

| Scène | Joueur | Description |
|-------|--------|-------------|
| `HospitalRoomScene` | A + B | Salle de départ commune |
| `CorridorSceneA` | A | Couloir avec porte verrouillée |
| `ComputerRoomSceneB` | B | Terminal Linux + power grid |
| `PatientRoomScene` | A | Patient malade + calcul dosage |
| `MedicineStorageScene` | B | Formule + clé de chiffrement |
| `ServerRoomScene` | A | Déchiffrement de fichiers |
| `WaitingRoomScene` | A + B | Puzzle de synchronisation |
| `ExitRoomScene` | A + B | Dilemme moral final |

---

## 🎮 GAMEPLAY

### Parcours Joueur A

1. **Couloir** : Attendre que le Joueur B rétablisse le courant
2. **Salle du Patient** : Recevoir la formule du Joueur B et soigner le patient
3. **Salle Serveur** : Recevoir la clé de chiffrement et déchiffrer les fichiers
4. **Salle d'Attente** : Synchroniser les boutons avec le Joueur B
5. **Sortie** : Faire un choix moral

### Parcours Joueur B

1. **Salle Informatique** : Pirater le terminal et rétablir le courant
2. **Stockage Médicaments** : Trouver et transmettre la formule et la clé
3. **Salle d'Attente** : Synchroniser les boutons avec le Joueur A
4. **Sortie** : Faire un choix moral

### Puzzles coopératifs

#### 1. Power Grid (B → A)
- **Joueur B** trouve le mot de passe sur un post-it
- **Joueur B** active le générateur via le terminal Linux
- **Joueur A** peut avancer quand le courant est rétabli

#### 2. Dosage Médicament (B → A)
- **Joueur B** trouve la formule : `Dose = (Poids / 10) - (Âge / 100)`
- **Joueur A** reçoit la formule et calcule : `(70 / 10) - (50 / 100) = 6.5 mL`
- **Joueur A** soigne le patient

#### 3. Déchiffrement (B → A)
- **Joueur B** trouve la clé de chiffrement : `V1T4L`
- **Joueur A** déchiffre le fichier et obtient le code : `8417`
- **Joueur A** déverrouille la porte

#### 4. Synchronisation Boutons (A ↔ B)
- **Joueur A** voit : Rouge → Bleu → Vert
- **Joueur B** voit : Bleu → Vert → Rouge
- **Ensemble** : Rouge → Bleu → Vert → Rouge

#### 5. Dilemme Moral (A ↔ B)
- **Les deux** choisissent : Voler ou Restituer les médicaments
- **4 fins possibles** selon les choix

---

## 📚 DOCUMENTATION

### Documents disponibles

- **[GAME_IMPLEMENTATION.md](GAME_IMPLEMENTATION.md)** : Documentation technique complète
  - Architecture des scènes
  - Système réseau
  - Design patterns
  - Statistiques du projet

- **[GAME_FLOW.md](GAME_FLOW.md)** : Schéma du flux du jeu
  - Diagramme visuel
  - Dépendances entre joueurs
  - Timeline typique
  - Stratégies de communication

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** : Guide de test
  - 20 scénarios de test
  - Checklist de déploiement
  - Tests de performance
  - Tests d'expérience utilisateur

---

## 🛠️ TECHNOLOGIES

### Frontend
- **[Phaser 3](https://phaser.io/)** : Moteur de jeu 2D
- **[TypeScript](https://www.typescriptlang.org/)** : Langage de programmation
- **[Vite](https://vitejs.dev/)** : Build tool et dev server

### Réseau
- **[Photon Realtime](https://www.photonengine.com/)** : Synchronisation multijoueur en temps réel

### Narrative
- **[Ink](https://www.inklestudios.com/ink/)** : Système de narration (prévu pour extension)

---

## 🎨 DESIGN

### Palette de couleurs

```css
/* Couleurs principales */
--blue-light: #00d9ff;    /* UI, titres */
--green: #00ff00;         /* Succès, validation */
--red: #ff0000;           /* Erreur, danger */
--yellow: #ffff00;        /* Avertissement, info */
--orange: #ffaa00;        /* Attention */

/* Couleurs de fond */
--black: #000000;         /* Overlay, fond */
--gray-dark: #1a1a1a;     /* Murs */
--gray-medium: #2c2c2c;   /* Sol */
--gray-light: #444444;    /* Boutons */

/* Couleurs spéciales */
--gold: #ffd700;          /* Poignées de porte */
--brown: #8b4513;         /* Portes en bois */
--turquoise: #4ecdc4;     /* Boutons d'action */
```

### Principes de design

- **Minimalisme** : Formes géométriques simples (rectangles, cercles)
- **Cohérence** : Même structure dans toutes les scènes
- **Feedback visuel** : Changement de couleur au survol
- **Animations** : Tweens pour les LEDs, étincelles, brillances
- **Accessibilité** : Couleurs contrastées, textes lisibles

---

## 🧪 TESTS

### Lancer les tests

```bash
# Tests unitaires (à implémenter)
npm run test

# Tests E2E (à implémenter)
npm run test:e2e
```

### Tests manuels

Suivre le guide dans [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🐛 BUGS CONNUS

Aucun bug critique connu pour le moment. Voir [TESTING_GUIDE.md](TESTING_GUIDE.md) pour la liste complète.

---

## 🚧 ROADMAP

### Version 1.1 (Prochaine)
- [ ] Système de sons et musique
- [ ] Animations de personnages
- [ ] Effets de particules avancés
- [ ] Système d'achievements
- [ ] Statistiques de fin de partie

### Version 1.2
- [ ] Mode histoire étendu avec Ink
- [ ] Nouvelles salles et puzzles
- [ ] Mode compétitif
- [ ] Classement en ligne

### Version 2.0
- [ ] Support 4 joueurs
- [ ] Éditeur de niveaux
- [ ] Mode campagne
- [ ] Localisation (FR, EN, ES)

---

## 🤝 CONTRIBUTION

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines

- Suivre le style de code existant
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Respecter le design pattern des scènes

---

## 📝 LICENCE

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👥 AUTEURS

- **Développeur principal** : [Votre nom]
- **Design** : [Votre nom]
- **Game Design** : [Votre nom]

---

## 🙏 REMERCIEMENTS

- [Phaser](https://phaser.io/) pour le moteur de jeu
- [Photon](https://www.photonengine.com/) pour le système multijoueur
- [Ink](https://www.inklestudios.com/ink/) pour le système narratif
- La communauté open source

---

## 📞 CONTACT

- **Email** : votre.email@example.com
- **Discord** : VotreDiscord#1234
- **Twitter** : [@VotreTwitter](https://twitter.com/VotreTwitter)

---

## 📊 STATISTIQUES DU PROJET

- **Lignes de code** : ~3 700 lignes TypeScript
- **Nombre de scènes** : 8 scènes
- **Puzzles coopératifs** : 5 puzzles
- **Fins possibles** : 4 épilogues
- **Durée de jeu** : 20-30 minutes

---

## 🎓 OBJECTIFS PÉDAGOGIQUES

Ce jeu a été conçu avec des objectifs de sensibilisation :

### Cybersécurité
- ❌ Ne jamais noter de mot de passe sur un post-it
- 🔐 Importance du chiffrement des données
- 🛡️ Protection des données de santé

### Éthique médicale
- 💉 Importance du dosage précis
- 🏥 Le patient comme être humain
- 🤝 Coordination d'équipe médicale

### Morale et éthique
- ⚖️ Dilemme entre intérêt personnel et bien commun
- 🤔 Conséquences de nos choix
- 💚 Importance de la confiance

---

## 🎮 CAPTURES D'ÉCRAN

*(À ajouter : captures d'écran des différentes scènes)*

---

## 🌐 LIENS UTILES

- [Documentation Phaser 3](https://photonstorm.github.io/phaser3-docs/)
- [Documentation Photon](https://doc.photonengine.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

<div align="center">

**Fait avec ❤️ et beaucoup de ☕**

[⬆ Retour en haut](#-escape-game-coopératif-multijoueur)

</div>