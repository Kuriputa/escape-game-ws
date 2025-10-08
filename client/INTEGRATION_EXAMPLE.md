# Exemple d'intégration de GameScene dans main.ts

## Étape 1 : Ajouter l'événement ITEM_PICKED

Dans `src/net/photonClient.ts`, ajoutez :

```typescript
export const EVENT_CODES = {
  CHAT: 98,
  START: 97,
  PING: 0,
  PUZZLE_UPDATE: 1,
  INK_SET: 2,
  CHOICE_MADE: 3,
  ITEM_PICKED: 10,  // NOUVEAU
} as const;
```

## Étape 2 : Modifier main.ts

Remplacez la configuration Phaser actuelle par :

```typescript
import { GameScene } from "./src/scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: document.body,
  backgroundColor: "#111",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [GameScene], // Utiliser GameScene au lieu de la scène inline
};

const game = new Phaser.Game(config);
```

## Étape 3 : Modifier la fonction begin()

Dans la fonction `begin()`, démarrez la scène avec les données nécessaires :

```typescript
const begin = () => {
  canvas.style.display = "block";
  lobbyEl.style.display = "none";
  
  // Démarrer la GameScene avec le réseau et l'histoire
  const gameScene = game.scene.getScene('GameScene') as GameScene;
  if (gameScene) {
    gameScene.scene.start('GameScene', { net, story });
  }
  
  appendChatLine("Départ de la partie !");
};
```

## Étape 4 : Gérer les événements réseau

La GameScene gère automatiquement les événements ITEM_PICKED. Vous pouvez ajouter d'autres handlers dans `net.onEvent` :

```typescript
net.onEvent = (code, data) => {
  if (code === EVENT_CODES.ITEM_PICKED) {
    appendChatLine(`${data.playerId} a ramassé: ${data.itemName}`);
  } else if (code === EVENT_CODES.CHAT) {
    appendChatLine(`${data.from || "Inconnu"}: ${data.text}`);
  } else if (code === EVENT_CODES.START) {
    begin();
    appendChatLine(`La partie démarre (par ${data.by || "?"}) !`);
  }
};
```

## Étape 5 : Créer une histoire Ink pour le talkie-walkie

Créez un nouveau fichier `src/ink/mission.ink` :

```ink
=== mission_start ===
*Collaborateur PNJ via le talkie-walkie*

"Agent, vous m'entendez ? Bien. Votre mission est simple mais cruciale."

"Vous êtes dans une salle d'hôpital abandonnée. Nous avons des raisons de croire que des documents sensibles y sont cachés."

"J'ai repéré une boîte dans le coin de la pièce. Elle devrait contenir ce dont nous avons besoin."

"Récupérez son contenu et préparez-vous. Nous aurons besoin de ces éléments pour accéder à la salle informatique."

"Bonne chance, agent. Je reste en contact."

-> END
```

Compilez avec Inky et remplacez `story.json`.

## Étape 6 : Tester

1. Lancez le serveur backend
2. Lancez le client : `npm run dev`
3. Rejoignez une salle
4. Cliquez sur "Commencer"
5. Le jeu devrait démarrer avec la GameScene

## Fonctionnalités synchronisées

- ✅ Chat entre joueurs
- ✅ Démarrage de partie
- ✅ Ramassage d'objets (visible par tous)
- ⏳ Dialogues Ink (à implémenter selon vos besoins)
- ⏳ Progression de mission (à implémenter)

## Prochaines étapes

1. Créer plus de salles (GameScene2, GameScene3, etc.)
2. Ajouter un système de portes et de navigation
3. Créer des énigmes qui nécessitent les objets de l'inventaire
4. Synchroniser la progression de l'histoire Ink entre joueurs
5. Ajouter des assets graphiques réels