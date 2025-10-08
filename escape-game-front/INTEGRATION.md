# Guide d'intégration du jeu Phaser avec le système existant

## Vue d'ensemble

Ce document explique comment intégrer le jeu point-and-click créé dans `escape-game-front` avec le système de dialogue Ink et le multijoueur Photon du dossier `client`.

## Structure actuelle

- **`/client`** : Application principale avec TypeScript, Photon (multijoueur), et Ink (dialogues)
- **`/escape-game-front`** : Jeu Phaser point-and-click avec la scène de l'hôpital

## Options d'intégration

### Option 1 : Intégrer Phaser dans le client TypeScript (Recommandé)

1. **Installer Phaser dans le projet client**
   ```bash
   cd client
   npm install phaser
   ```

2. **Copier la scène GameScene dans le client**
   - Convertir `GameScene.js` en TypeScript
   - L'importer dans `main.ts`

3. **Remplacer la scène Phaser actuelle**
   - Dans `client/main.ts`, remplacer la scène simple par `GameScene`

4. **Connecter les événements**
   - Lier les clics sur le talkie-walkie avec le système Ink
   - Synchroniser l'inventaire via Photon pour le multijoueur

### Option 2 : Utiliser escape-game-front comme base

1. **Ajouter TypeScript à escape-game-front**
2. **Copier les fichiers de networking et Ink**
3. **Intégrer Photon et Ink dans les scènes**

## Prochaines étapes pour l'intégration complète

### 1. Connecter le talkie-walkie avec Ink

Dans `GameScene`, modifier la méthode `showDialogue()` pour utiliser Ink :

```javascript
showDialogue() {
    // Au lieu d'un texte statique, utiliser l'histoire Ink
    const story = new Story(storyJSON);
    let text = '';
    while (story.canContinue) {
        text += story.Continue();
    }
    this.dialogueText.setText(text);
    this.dialogueContainer.setVisible(true);
}
```

### 2. Synchroniser l'inventaire en multijoueur

Ajouter des événements Photon pour synchroniser l'inventaire :

```javascript
// Dans photonClient.ts, ajouter :
export const EVENT_CODES = {
    // ... codes existants
    ITEM_PICKED: 10,
    INVENTORY_UPDATE: 11,
}

// Dans GameScene, lors de l'ajout d'un objet :
addToInventory(itemContainer) {
    // ... code existant
    
    // Envoyer l'événement aux autres joueurs
    net.send(EVENT_CODES.ITEM_PICKED, {
        itemName: itemData.name,
        playerId: net.nickname,
        timestamp: Date.now()
    });
}
```

### 3. Déclencher le jeu depuis le bouton "Commencer"

Dans `client/main.ts`, modifier la fonction `begin()` :

```typescript
const begin = () => {
    canvas.style.display = "block";
    lobbyEl.style.display = "none";
    
    // Démarrer la scène de jeu au lieu de l'histoire Ink
    this.scene.start('GameScene');
    
    appendChatLine("Départ de la partie !");
};
```

## Code à ajouter dans client/main.ts

```typescript
import { GameScene } from './scenes/GameScene';

// Dans la configuration Phaser :
const config: Phaser.Types.Core.GameConfig = {
    // ... config existante
    scene: [GameScene], // Remplacer la scène inline
};
```

## Événements à synchroniser

1. **Clic sur le talkie-walkie** → Déclenche un dialogue Ink partagé
2. **Ouverture de la boîte** → Tous les joueurs voient la boîte ouverte
3. **Prise d'objet** → L'objet disparaît pour tous les joueurs
4. **Inventaire** → Chaque joueur a son propre inventaire

## Assets à créer

Pour améliorer le visuel, créez ces images :
- `assets/hospital-room.png` : Fond de la salle d'hôpital
- `assets/walkie-talkie.png` : Sprite du talkie-walkie
- `assets/box.png` : Sprite de la boîte
- `assets/items/card.png` : Carte
- `assets/items/badge.png` : Badge
- `assets/items/postit.png` : Post-it

## Test du jeu actuel

Pour tester le jeu point-and-click :

1. Ouvrir `escape-game-front/index.html` dans un navigateur
2. Cliquer sur le talkie-walkie pour voir le dialogue
3. Cliquer sur la boîte pour voir les objets
4. Cliquer sur les objets pour les ajouter à l'inventaire

## Questions ?

Si vous avez besoin d'aide pour l'intégration, n'hésitez pas à demander !