import Phaser from "phaser";
import { Net, EVENT_CODES } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";

export class CorridorSceneA extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private gameState!: GameState;
  private doorPowered: boolean = false;
  private doorLight: Phaser.GameObjects.Arc | null = null;

  constructor() {
    super({ key: "CorridorSceneA" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
    this.gameState = GameState.getInstance();
    
    // Setup network event listener
    if (this.net) {
      const originalOnEvent = this.net.onEvent;
      
      this.net.onEvent = (code: number, data: any) => {
        console.log("CorridorSceneA received event:", code, data);
        
        // Gérer l'activation du générateur par le Joueur B
        if (code === EVENT_CODES.PUZZLE_UPDATE && data.type === "power_restored") {
          console.log("Power restored by Player B!");
          this.onPowerRestored();
        }
        
        // Appeler le gestionnaire original pour les autres événements
        if (originalOnEvent) {
          originalOnEvent(code, data);
        }
      };
    }
  }

  create() {
    const { width, height } = this.scale;

    // ===== FONDU D'ENTRÉE =====
    this.createFadeIn();

    // ===== COULOIR =====
    this.createCorridor(width, height);

    // ===== PORTE VERROUILLÉE =====
    this.createLockedDoor(width, height);

    // ===== CÂBLE COUPÉ =====
    this.createCutCable(width, height);

    // ===== BOUTON RETOUR =====
    this.createBackButton(width, height);

    // ===== MESSAGE D'INFORMATION =====
    this.showInfoMessage();
  }

  private createFadeIn() {
    const fadeRect = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000
    );
    fadeRect.setDepth(3000);
    this.tweens.add({
      targets: fadeRect,
      alpha: { from: 1, to: 0 },
      duration: 800,
      onComplete: () => fadeRect.destroy(),
    });
  }

  private createCorridor(width: number, height: number) {
    // Sol du couloir
    const floor = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.6, 0xd3d3d3);
    floor.setStrokeStyle(4, 0x999999);

    // Murs latéraux
    const leftWall = this.add.rectangle(width * 0.1, height / 2, 20, height * 0.6, 0xcccccc);
    leftWall.setStrokeStyle(2, 0x888888);

    const rightWall = this.add.rectangle(width * 0.9, height / 2, 20, height * 0.6, 0xcccccc);
    rightWall.setStrokeStyle(2, 0x888888);

    // Titre
    this.add.text(width / 2, 50, "Couloir - Parcours A", {
      fontSize: "28px",
      color: "#333333",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Éclairage tamisé
    const lights = [
      { x: width * 0.3, y: height * 0.25 },
      { x: width * 0.5, y: height * 0.25 },
      { x: width * 0.7, y: height * 0.25 },
    ];

    lights.forEach(pos => {
      this.add.circle(pos.x, pos.y, 15, 0xffffcc, 0.6);
    });
  }

  private createLockedDoor(width: number, height: number) {
    // Porte au fond du couloir
    const doorX = width / 2;
    const doorY = height * 0.7;

    const door = this.add.rectangle(doorX, doorY, 120, 180, 0x8b4513);
    door.setStrokeStyle(4, 0x654321);

    // Poignée
    this.add.circle(doorX + 40, doorY, 8, 0xffd700);

    // Panneau électronique (éteint au départ)
    this.doorLight = this.add.circle(doorX - 80, doorY - 60, 20, 0xff0000);
    this.doorLight.setStrokeStyle(2, 0x000000);

    // Label de la porte
    const doorLabel = this.add.text(doorX, doorY - 120, "🚪 Salle du Patient", {
      fontSize: "20px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    // Interaction avec la porte
    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.doorPowered) {
        this.openDoor();
      } else {
        this.showDoorLockedMessage();
      }
    });

    doorLabel.setInteractive({ useHandCursor: true });
    doorLabel.on("pointerdown", () => {
      if (this.doorPowered) {
        this.openDoor();
      } else {
        this.showDoorLockedMessage();
      }
    });
  }

  private createCutCable(width: number, height: number) {
    // Câble coupé sur le mur
    const cableX = width * 0.25;
    const cableY = height * 0.5;

    // Partie gauche du câble
    const leftCable = this.add.line(0, 0, 0, 0, 0, 80, 0x000000, 1);
    leftCable.setLineWidth(6);
    leftCable.setPosition(cableX - 30, cableY);

    // Partie droite du câble
    const rightCable = this.add.line(0, 0, 0, 0, 0, 80, 0x000000, 1);
    rightCable.setLineWidth(6);
    rightCable.setPosition(cableX + 30, cableY);

    // Étincelles (animation simple avec des cercles)
    const createSpark = () => {
      const spark = this.add.circle(cableX, cableY, 3, 0xffff00);
      const angle = Phaser.Math.Between(0, 360);
      const speed = Phaser.Math.Between(20, 50);
      
      this.tweens.add({
        targets: spark,
        x: cableX + Math.cos(angle) * speed,
        y: cableY + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => spark.destroy(),
      });
    };
    
    // Créer des étincelles périodiquement
    this.time.addEvent({
      delay: 200,
      callback: createSpark,
      loop: true,
    });

    // Label explicatif
    const cableLabel = this.add.text(cableX, cableY + 80, "⚡ Câble d'alimentation coupé", {
      fontSize: "16px",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction avec le câble
    cableLabel.setInteractive({ useHandCursor: true });
    cableLabel.on("pointerdown", () => {
      this.showCableMessage();
    });
  }

  private createBackButton(width: number, height: number) {
    const backBtn = this.add.text(50, height - 50, "← Retour Salle Hôpital", {
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#555555",
      padding: { x: 15, y: 10 },
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(1000);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("HospitalRoomScene", { net: this.net, story: this.story });
      });
    });

    backBtn.on("pointerover", () => {
      backBtn.setStyle({ backgroundColor: "#777777" });
    });

    backBtn.on("pointerout", () => {
      backBtn.setStyle({ backgroundColor: "#555555" });
    });
  }

  private showInfoMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height - 100,
      "🎯 Objectif : Ouvrir la porte menant à la salle du patient\n💡 Le Joueur B doit rétablir le courant depuis la salle informatique",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(1000);

    // Faire disparaître le message après 8 secondes
    this.time.delayedCall(8000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1000,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showDoorLockedMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "🔒 PORTE VERROUILLÉE\n\nLe système électronique est hors tension.\nVotre coéquipier doit rétablir le courant.",
      {
        fontSize: "20px",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showCableMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "⚡ CÂBLE COUPÉ\n\nLe câble d'alimentation principal est sectionné.\nImpossible de le réparer d'ici.\n\nLe générateur de secours doit être activé\ndepuis la salle informatique.",
      {
        fontSize: "18px",
        color: "#ffff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private onPowerRestored() {
    this.doorPowered = true;

    // Changer la lumière de rouge à vert
    if (this.doorLight) {
      this.tweens.add({
        targets: this.doorLight,
        fillColor: { from: 0xff0000, to: 0x00ff00 },
        duration: 500,
        yoyo: true,
        repeat: 2,
      });
    }

    // Message de succès
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      "✓ COURANT RÉTABLI !\n\nLa porte est maintenant alimentée.\nVous pouvez l'ouvrir.",
      {
        fontSize: "24px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private openDoor() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start("PatientRoomScene", { net: this.net, story: this.story });
    });
  }
}