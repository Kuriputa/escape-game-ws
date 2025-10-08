# 🛠️ Astuces de Développement - Hospital Escape Game

## 🐛 Débogage

### Console du Navigateur (F12)

#### Vérifier l'État du Jeu
```javascript
// Dans la console, accédez à la scène active
const scene = game.scene.scenes[0];

// Vérifier si la boîte est déverrouillée
console.log("Boîte déverrouillée:", scene.boxUnlocked);

// Voir les objets disponibles
console.log("Objets dans la boîte:", scene.boxItems);

// Voir l'inventaire
console.log("Inventaire:", scene.inventory);
```

#### Forcer le Déverrouillage
```javascript
// Déverrouiller la boîte sans code
const scene = game.scene.scenes[0];
scene.boxUnlocked = true;
scene.updateBoxAppearance();
console.log("Boîte forcée déverrouillée !");
```

#### Ajouter des Objets Directement
```javascript
// Ajouter un objet à l'inventaire
const scene = game.scene.scenes[0];
scene.addToInventory({
  id: "map",
  icon: "🗺️",
  name: "Carte",
  description: "Plan de l'hôpital"
});
```

#### Réinitialiser les Objets
```javascript
// Remettre tous les objets dans la boîte
const scene = game.scene.scenes[0];
scene.boxItems.set("map", true);
scene.boxItems.set("badge", true);
scene.boxItems.set("postit", true);
console.log("Objets réinitialisés !");
```

---

## 🔧 Modifications Rapides

### Changer le Code de la Boîte

**Fichier** : `client/src/scenes/HospitalRoomScene.ts`  
**Ligne** : ~588

```typescript
// Ancien code
if (currentCode === "120455") {

// Nouveau code (exemple: 999999)
if (currentCode === "999999") {
```

**N'oubliez pas** : Changez aussi les indices (panneau et horloge) !

---

### Ajouter un Nouvel Objet

#### Étape 1 : Définir l'Objet
```typescript
// Dans showBoxInventory(), ligne ~692
const itemDefinitions = [
  { id: "map", icon: "🗺️", name: "Carte", description: "Plan de l'hôpital" },
  { id: "badge", icon: "🔖", name: "Badge", description: "Accès Salle Info" },
  { id: "postit", icon: "📝", name: "Post-it", description: "Mot de passe" },
  { id: "key", icon: "🔑", name: "Clé", description: "Clé mystérieuse" }, // NOUVEAU
];
```

#### Étape 2 : Initialiser l'Objet
```typescript
// Dans init(), ligne ~22
this.boxItems.set("map", true);
this.boxItems.set("badge", true);
this.boxItems.set("postit", true);
this.boxItems.set("key", true); // NOUVEAU
```

---

### Changer la Durée du Fondu

**Fichier** : `client/src/scenes/HospitalRoomScene.ts`  
**Ligne** : ~120

```typescript
// Ancien (2 secondes)
duration: 2000,

// Nouveau (5 secondes)
duration: 5000,
```

---

### Modifier le Nombre de Slots d'Inventaire

**Fichier** : `client/src/scenes/HospitalRoomScene.ts`  
**Ligne** : ~835

```typescript
// Ancien (5 slots)
for (let i = 0; i < 5; i++) {

// Nouveau (10 slots)
for (let i = 0; i < 10; i++) {
```

**Attention** : Ajustez aussi la largeur de la barre !

---

## 🎨 Personnalisation Visuelle

### Changer les Couleurs

#### Couleur de la Serrure
```typescript
// Verrouillée (ligne ~467)
const lock = this.add.circle(0, 0, 8, 0xff0000); // Rouge
// Changez en : 0x0000ff pour bleu

// Déverrouillée (ligne ~659)
lock.setFillStyle(0x00ff00); // Vert
// Changez en : 0xffff00 pour jaune
```

#### Couleur de Fond de la Salle
```typescript
// Sol (ligne ~68)
const floor = this.add.rectangle(width / 2, height / 2, 800, 600, 0xe8f4f8);
// Changez en : 0xffffff pour blanc pur
```

#### Couleur de l'Inventaire
```typescript
// Fond de la barre (ligne ~825)
const bg = this.add.rectangle(0, 0, barWidth, barHeight, 0x2c3e50, 0.9);
// Changez en : 0x1a1a1a pour noir
```

---

### Changer les Tailles

#### Taille de la Boîte
```typescript
// Ligne ~457
const box = this.add.rectangle(0, 0, 80, 80, 0x8b4513);
// Changez en : (120, 120) pour une boîte plus grande
```

#### Taille des Icônes d'Inventaire
```typescript
// Ligne ~861
const icon = this.add.text(0, -5, item.icon, {
  fontSize: "32px", // Changez en "48px" pour plus grand
}).setOrigin(0.5);
```

---

## 🌐 Réseau et Multiplayer

### Tester en Local avec 2 Navigateurs

#### Méthode 1 : Deux Onglets
1. Ouvrez http://localhost:5174/
2. Connectez-vous avec "Joueur1"
3. Ouvrez un nouvel onglet
4. Connectez-vous avec "Joueur2"
5. Rejoignez la même salle

#### Méthode 2 : Deux Navigateurs Différents
1. Chrome : http://localhost:5174/ → "Joueur1"
2. Firefox : http://localhost:5174/ → "Joueur2"
3. Rejoignez la même salle

---

### Déboguer les Événements Réseau

#### Écouter Tous les Événements
```typescript
// Dans init(), ajoutez :
if (this.net) {
  this.net.onEvent = (code: number, data: any) => {
    console.log("Événement reçu:", code, data);
    
    // Vos gestionnaires existants
    if (code === EVENT_CODES.ITEM_PICKED) {
      this.onItemPickedByOther(data);
    }
    // ...
  };
}
```

#### Envoyer un Événement de Test
```javascript
// Dans la console
const scene = game.scene.scenes[0];
scene.net.send(EVENT_CODES.PUZZLE_UPDATE, { 
  type: "test", 
  message: "Hello from console!" 
});
```

---

### Simuler un Autre Joueur

```javascript
// Dans la console du Joueur 1
const scene = game.scene.scenes[0];

// Simuler que Joueur 2 prend la carte
scene.onItemPickedByOther({ 
  itemId: "map", 
  action: "pick" 
});

// Simuler que Joueur 2 repose la carte
scene.onItemPickedByOther({ 
  itemId: "map", 
  action: "return" 
});
```

---

## 🚀 Performance

### Mesurer les FPS

```javascript
// Dans la console
setInterval(() => {
  console.log("FPS:", game.loop.actualFps.toFixed(2));
}, 1000);
```

### Compter les Objets dans la Scène

```javascript
// Dans la console
const scene = game.scene.scenes[0];
console.log("Nombre d'objets:", scene.children.list.length);
```

### Voir les Objets par Depth

```javascript
// Dans la console
const scene = game.scene.scenes[0];
const byDepth = {};
scene.children.list.forEach(obj => {
  const depth = obj.depth || 0;
  byDepth[depth] = (byDepth[depth] || 0) + 1;
});
console.table(byDepth);
```

---

## 🎯 Raccourcis de Développement

### Créer un Menu de Triche

Ajoutez dans `create()` :

```typescript
// Menu de triche (DEV ONLY)
if (import.meta.env.DEV) {
  const cheatBtn = this.add.text(width - 150, 20, "🔧 Triche", {
    fontSize: "14px",
    color: "#ff0000",
    backgroundColor: "#000000",
    padding: { x: 5, y: 3 },
  }).setInteractive({ useHandCursor: true });

  cheatBtn.on("pointerdown", () => {
    this.boxUnlocked = true;
    this.updateBoxAppearance();
    console.log("Boîte déverrouillée via triche !");
  });
}
```

---

### Afficher les Coordonnées de la Souris

```typescript
// Dans create()
const coordsText = this.add.text(10, height - 30, "", {
  fontSize: "12px",
  color: "#ffffff",
  backgroundColor: "#000000",
  padding: { x: 5, y: 3 },
}).setDepth(10000);

this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
  coordsText.setText(`X: ${pointer.x.toFixed(0)}, Y: ${pointer.y.toFixed(0)}`);
});
```

---

### Mode Debug Phaser

```typescript
// Dans main.ts, config Phaser
physics: {
  default: "arcade",
  arcade: {
    gravity: { x: 0, y: 0 },
    debug: true, // Active le mode debug
  },
},
```

---

## 📝 Snippets Utiles

### Créer une Popup Générique

```typescript
private showPopup(title: string, message: string, onClose?: () => void) {
  const { width, height } = this.scale;
  
  const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
  overlay.setDepth(1000);
  overlay.setInteractive();
  
  const box = this.add.rectangle(width / 2, height / 2, 500, 300, 0x1a1a2e);
  box.setStrokeStyle(4, 0x16213e);
  box.setDepth(1001);
  
  const titleText = this.add.text(width / 2, height / 2 - 100, title, {
    fontSize: "24px",
    color: "#00ff00",
    fontStyle: "bold",
  }).setOrigin(0.5).setDepth(1002);
  
  const messageText = this.add.text(width / 2, height / 2, message, {
    fontSize: "16px",
    color: "#ffffff",
    wordWrap: { width: 450 },
    align: "center",
  }).setOrigin(0.5).setDepth(1002);
  
  const closeBtn = this.add.rectangle(width / 2, height / 2 + 100, 150, 50, 0x0f3460);
  closeBtn.setStrokeStyle(2, 0x16213e);
  closeBtn.setDepth(1002);
  closeBtn.setInteractive({ useHandCursor: true });
  
  const closeBtnText = this.add.text(width / 2, height / 2 + 100, "Fermer", {
    fontSize: "18px",
    color: "#ffffff",
  }).setOrigin(0.5).setDepth(1003);
  
  closeBtn.on("pointerdown", () => {
    overlay.destroy();
    box.destroy();
    titleText.destroy();
    messageText.destroy();
    closeBtn.destroy();
    closeBtnText.destroy();
    onClose?.();
  });
}
```

**Usage** :
```typescript
this.showPopup("Succès !", "Vous avez trouvé le code !", () => {
  console.log("Popup fermée");
});
```

---

### Créer un Timer

```typescript
private startTimer(duration: number, onComplete: () => void) {
  let timeLeft = duration;
  
  const timerText = this.add.text(this.scale.width / 2, 80, `⏱️ ${timeLeft}s`, {
    fontSize: "24px",
    color: "#ffffff",
    fontStyle: "bold",
  }).setOrigin(0.5).setDepth(1000);
  
  const timerEvent = this.time.addEvent({
    delay: 1000,
    callback: () => {
      timeLeft--;
      timerText.setText(`⏱️ ${timeLeft}s`);
      
      if (timeLeft <= 10) {
        timerText.setColor("#ff0000"); // Rouge pour les 10 dernières secondes
      }
      
      if (timeLeft <= 0) {
        timerEvent.remove();
        timerText.destroy();
        onComplete();
      }
    },
    loop: true,
  });
}
```

**Usage** :
```typescript
this.startTimer(60, () => {
  console.log("Temps écoulé !");
  this.showPopup("Temps écoulé !", "Vous avez perdu...");
});
```

---

### Créer un Effet de Particules

```typescript
private createParticleEffect(x: number, y: number) {
  const particles = this.add.particles(x, y, "particle", {
    speed: { min: -100, max: 100 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
    lifespan: 600,
    gravityY: 0,
  });
  
  this.time.delayedCall(600, () => {
    particles.destroy();
  });
}
```

---

## 🔍 Outils de Développement

### Extensions Chrome Recommandées
- **Phaser Inspector** : Inspecter les objets Phaser
- **Redux DevTools** : Si vous ajoutez Redux
- **React Developer Tools** : Si vous ajoutez React

### Outils en Ligne
- **Phaser Sandbox** : https://phaser.io/sandbox
- **Tiled Map Editor** : Pour créer des maps
- **Aseprite** : Pour créer des sprites

---

## 📚 Ressources Utiles

### Documentation
- **Phaser 3** : https://photonstorm.github.io/phaser3-docs/
- **Photon** : https://doc.photonengine.com/
- **TypeScript** : https://www.typescriptlang.org/docs/

### Tutoriels
- **Phaser 3 Examples** : https://phaser.io/examples
- **Phaser 3 Labs** : https://labs.phaser.io/

### Communauté
- **Phaser Discord** : https://discord.gg/phaser
- **Phaser Forum** : https://phaser.discourse.group/

---

## 🎓 Bonnes Pratiques

### Organisation du Code
```typescript
// ✅ BON : Méthodes organisées par catégorie
class HospitalRoomScene extends Phaser.Scene {
  // === LIFECYCLE ===
  init() { }
  create() { }
  update() { }
  
  // === CREATION ===
  private createRoom() { }
  private createDoors() { }
  private createObjects() { }
  
  // === INTERACTIONS ===
  private onObjectClick() { }
  private onDoorClick() { }
  
  // === NETWORK ===
  private sendEvent() { }
  private onEventReceived() { }
  
  // === UTILS ===
  private showPopup() { }
  private playSound() { }
}
```

### Gestion de la Mémoire
```typescript
// ✅ BON : Détruire les objets inutilisés
private closeOverlay() {
  this.children.getAll().forEach((obj: any) => {
    if (obj.depth >= 1000 && obj.depth < 2000) {
      obj.destroy(); // Libère la mémoire
    }
  });
}

// ❌ MAUVAIS : Laisser les objets en mémoire
private closeOverlay() {
  this.children.getAll().forEach((obj: any) => {
    if (obj.depth >= 1000 && obj.depth < 2000) {
      obj.setVisible(false); // Reste en mémoire !
    }
  });
}
```

### Constantes
```typescript
// ✅ BON : Utiliser des constantes
const DEPTHS = {
  BACKGROUND: 0,
  OBJECTS: 100,
  PLAYER: 200,
  UI: 900,
  OVERLAY: 1000,
  TRANSITION: 10000,
};

const COLORS = {
  LOCKED: 0xff0000,
  UNLOCKED: 0x00ff00,
  BACKGROUND: 0xe8f4f8,
};

// Usage
const lock = this.add.circle(0, 0, 8, COLORS.LOCKED);
lock.setDepth(DEPTHS.OBJECTS);
```

---

**Bon développement ! 🚀**