# 🏗️ Architecture du jeu Escape Game

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    ESCAPE GAME SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  escape-game-    │         │     client/      │          │
│  │     front        │         │   (Multiplayer)  │          │
│  │  (Standalone)    │         │                  │          │
│  └──────────────────┘         └──────────────────┘          │
│         │                              │                     │
│         │                              │                     │
│         ▼                              ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   Phaser Game    │         │  Phaser + Photon │          │
│  │   GameScene.js   │         │   GameScene.ts   │          │
│  └──────────────────┘         └──────────────────┘          │
│         │                              │                     │
│         │                              │                     │
│         ▼                              ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Local Testing   │         │  Network Sync    │          │
│  │  No Network      │         │  + Ink Stories   │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Flux de jeu

### Mode Standalone (escape-game-front)

```
┌─────────────┐
│   Joueur    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         index.html / test.html          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│            main.js                      │
│  - Configuration Phaser                 │
│  - Chargement de GameScene              │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         GameScene.js                    │
│  ┌───────────────────────────────────┐  │
│  │  create()                         │  │
│  │  - Créer la salle                 │  │
│  │  - Créer le talkie-walkie         │  │
│  │  - Créer la boîte                 │  │
│  │  - Créer l'inventaire             │  │
│  │  - Créer les overlays             │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Interactions                     │  │
│  │  - Clic talkie → showDialogue()  │  │
│  │  - Clic boîte → showBoxInventory()│ │
│  │  - Clic objet → addToInventory() │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Mode Multijoueur (client)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Joueur 1   │     │  Joueur 2   │     │  Joueur N   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│                  index.html                          │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                   main.ts                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  1. Initialisation                             │  │
│  │     - Photon Client (Net)                      │  │
│  │     - Ink Story                                │  │
│  │     - Phaser Game                              │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  2. Menu & Lobby                               │  │
│  │     - Rejoindre une salle                      │  │
│  │     - Voir les joueurs connectés               │  │
│  │     - Chat                                     │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  3. Démarrage (begin())                        │  │
│  │     - Lancer GameScene                         │  │
│  │     - Passer net & story                       │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│              GameScene.ts                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  init(data)                                    │  │
│  │  - Récupérer net & story                       │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  create()                                      │  │
│  │  - Créer la scène (comme standalone)          │  │
│  │  - setupNetworkListeners()                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  Interactions + Réseau                         │  │
│  │  - Clic objet → addToInventory()              │  │
│  │    └─> net.send(ITEM_PICKED)                  │  │
│  │  - Recevoir ITEM_PICKED                        │  │
│  │    └─> markItemAsTaken()                      │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│              Photon Network                          │
│  - Synchronisation des événements                    │
│  - Chat entre joueurs                                │
│  - État du jeu partagé                               │
└──────────────────────────────────────────────────────┘
```

## Structure des données

### Inventaire

```javascript
// Structure d'un objet dans l'inventaire
{
    name: string,        // "Carte", "Badge", "Post-it"
    color: number,       // 0xffffff, 0x3498db, 0xf1c40f
    icon: string,        // "🗺️", "🔖", "📝"
    slotIndex: number    // 0-4 (position dans l'inventaire)
}
```

### Événements réseau

```typescript
EVENT_CODES = {
    CHAT: 98,           // Message de chat
    START: 97,          // Démarrage de partie
    PING: 0,            // Test de connexion
    PUZZLE_UPDATE: 1,   // Mise à jour d'énigme
    INK_SET: 2,         // Changement d'état Ink
    CHOICE_MADE: 3,     // Choix dans le dialogue
    ITEM_PICKED: 10,    // Objet ramassé (NOUVEAU)
}
```

### Événement ITEM_PICKED

```javascript
// Envoi
net.send(EVENT_CODES.ITEM_PICKED, {
    itemName: "Carte",
    playerId: "Joueur1",
    timestamp: 1234567890
});

// Réception
net.onEvent = (code, data) => {
    if (code === EVENT_CODES.ITEM_PICKED) {
        console.log(`${data.playerId} a pris: ${data.itemName}`);
        markItemAsTaken(data.itemName);
    }
};
```

## Hiérarchie des objets Phaser

```
Scene (GameScene)
├── Background (Rectangle)
├── Floor (Rectangle)
├── Wall (Rectangle)
├── Decorations
│   ├── Door (Container)
│   └── Window (Container)
│
├── Interactive Objects
│   ├── WalkieTalkie (Container)
│   │   ├── Body (Rectangle, Interactive)
│   │   ├── Antenna (Rectangle)
│   │   ├── Screen (Rectangle)
│   │   ├── Buttons (Circles)
│   │   └── Speaker Lines (Lines)
│   │
│   └── Box (Container)
│       ├── Shadow (Rectangle)
│       ├── Body (Rectangle, Interactive)
│       ├── Lid (Rectangle)
│       ├── Lock (Rectangle)
│       └── Keyhole (Circle)
│
├── UI Elements
│   ├── InventoryBar (Container)
│   │   ├── Background (Rectangle)
│   │   └── Slots (5x Rectangle, Interactive)
│   │
│   ├── DialogueOverlay (Container, Hidden)
│   │   ├── Background (Rectangle)
│   │   ├── Text (Text)
│   │   └── CloseButton (Rectangle + Text)
│   │
│   └── BoxInventoryOverlay (Container, Hidden)
│       ├── Background (Rectangle)
│       ├── Title (Text)
│       ├── Items (3x Container)
│       │   ├── ItemRect (Rectangle, Interactive)
│       │   ├── ItemIcon (Text)
│       │   └── ItemName (Text)
│       └── CloseButton (Rectangle + Text)
│
└── Dynamic Objects
    └── InventoryItems (Created on pickup)
        ├── ItemRect (Rectangle)
        └── ItemIcon (Text)
```

## Cycle de vie d'un objet

```
1. Création
   ├─> createBoxInventoryOverlay()
   └─> Objet créé dans la boîte
       └─> État: taken = false, alpha = 1.0

2. Interaction
   ├─> Joueur clique sur l'objet
   └─> addToInventory(itemContainer)

3. Collecte
   ├─> Vérifier place disponible
   ├─> Marquer comme pris (taken = true, alpha = 0.3)
   ├─> Créer copie dans l'inventaire
   └─> Envoyer événement réseau (si multijoueur)

4. Synchronisation (multijoueur)
   ├─> Autres joueurs reçoivent ITEM_PICKED
   └─> markItemAsTaken(itemName)
       └─> Objet devient transparent pour tous
```

## Flux de dialogue

```
1. Clic sur talkie-walkie
   └─> showDialogue()

2. Génération du texte
   ├─> Mode standalone
   │   └─> Texte statique prédéfini
   │
   └─> Mode multijoueur
       └─> Utiliser Ink Story
           ├─> story.Continue()
           └─> Générer le texte dynamique

3. Affichage
   ├─> dialogueText.setText(text)
   └─> dialogueContainer.setVisible(true)

4. Fermeture
   └─> hideDialogue()
       └─> dialogueContainer.setVisible(false)
```

## Points d'extension

### Ajouter une nouvelle salle

```javascript
// 1. Créer une nouvelle scène
export class CorridorScene extends Phaser.Scene {
    constructor() {
        super('CorridorScene');
    }
    // ...
}

// 2. Ajouter dans main.js
scene: [GameScene, CorridorScene]

// 3. Transition entre scènes
this.scene.start('CorridorScene', { 
    inventory: this.inventory,
    net: this.net,
    story: this.story
});
```

### Ajouter un nouvel objet

```javascript
// 1. Dans createBoxInventoryOverlay()
const items = [
    // ... objets existants
    { name: 'Clé', color: 0xffd700, icon: '🔑' }
];

// 2. L'objet sera automatiquement :
//    - Affiché dans la boîte
//    - Cliquable
//    - Ajouté à l'inventaire
//    - Synchronisé (si multijoueur)
```

### Ajouter une énigme

```javascript
// 1. Créer un objet interactif
const puzzle = this.add.rectangle(x, y, w, h, color);
puzzle.setInteractive();

// 2. Vérifier l'inventaire
puzzle.on('pointerdown', () => {
    const hasKey = this.inventory.find(item => item.name === 'Clé');
    if (hasKey) {
        this.solvePuzzle();
    } else {
        this.showMessage('Vous avez besoin d\'une clé');
    }
});
```

## Performance

### Optimisations actuelles
- ✅ Utilisation de Containers pour grouper les objets
- ✅ Depth layers pour l'ordre d'affichage
- ✅ Overlays cachés par défaut (setVisible(false))
- ✅ Événements réseau uniquement quand nécessaire

### Optimisations futures
- ⏳ Pooling d'objets réutilisables
- ⏳ Chargement asynchrone des assets
- ⏳ Compression des événements réseau
- ⏳ Cache des textures

## Sécurité (Multijoueur)

### Validations côté client
- Vérifier que l'objet n'est pas déjà pris
- Vérifier qu'il y a de la place dans l'inventaire
- Vérifier que le joueur est dans la bonne salle

### Validations côté serveur (à implémenter)
- Valider tous les événements reçus
- Vérifier l'état du jeu côté serveur
- Empêcher la triche (duplication d'objets, etc.)

## Conclusion

Cette architecture permet :
- ✅ Développement et test rapide (standalone)
- ✅ Intégration facile du multijoueur
- ✅ Extension simple (nouvelles salles, objets, énigmes)
- ✅ Maintenance facilitée (code modulaire)
- ✅ Performance optimale (Phaser + Photon)

Bon développement ! 🚀