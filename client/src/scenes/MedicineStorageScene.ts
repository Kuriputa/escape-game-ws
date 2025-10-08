import Phaser from "phaser";
import { Net, EVENT_CODES } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";

export class MedicineStorageScene extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private gameState!: GameState;
  private formulaFound: boolean = false;
  private formulaSent: boolean = false;
  private encryptionKey: string = "V1T4L";

  constructor() {
    super({ key: "MedicineStorageScene" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
    this.gameState = GameState.getInstance();
    
    // Setup network event listener
    if (this.net) {
      const originalOnEvent = this.net.onEvent;
      
      this.net.onEvent = (code: number, data: any) => {
        console.log("MedicineStorageScene received event:", code, data);
        
        // Appeler le gestionnaire original
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

    // ===== SALLE DE STOCKAGE =====
    this.createRoom(width, height);

    // ===== ÉTAGÈRES DE MÉDICAMENTS =====
    this.createShelves(width, height);

    // ===== CAISSE VERROUILLÉE =====
    this.createLockedCrate(width, height);

    // ===== NOTICE MÉDICAMENT =====
    this.createMedicineNotice(width, height);

    // ===== PORTE VERS SALLE D'ATTENTE =====
    this.createNextDoor(width, height);

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

  private createRoom(width: number, height: number) {
    // Sol
    const floor = this.add.rectangle(width / 2, height / 2, width * 0.85, height * 0.75, 0xf0f0f0);
    floor.setStrokeStyle(4, 0xcccccc);

    // Titre
    this.add.text(width / 2, 50, "Stockage Médicaments - Parcours B", {
      fontSize: "28px",
      color: "#2c3e50",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Symbole médical
    this.add.text(width / 2, 100, "⚕️", {
      fontSize: "40px",
    }).setOrigin(0.5);
  }

  private createShelves(width: number, height: number) {
    // Étagères avec médicaments
    const shelves = [
      { x: width * 0.2, y: height * 0.35 },
      { x: width * 0.2, y: height * 0.55 },
      { x: width * 0.2, y: height * 0.75 },
    ];

    shelves.forEach((pos, index) => {
      const shelf = this.add.rectangle(pos.x, pos.y, 200, 80, 0x8b7355);
      shelf.setStrokeStyle(2, 0x654321);

      // Boîtes de médicaments
      for (let i = 0; i < 4; i++) {
        const box = this.add.rectangle(
          pos.x - 75 + i * 50,
          pos.y,
          40,
          60,
          Phaser.Display.Color.GetColor(
            200 + Math.random() * 55,
            200 + Math.random() * 55,
            200 + Math.random() * 55
          )
        );
        box.setStrokeStyle(1, 0x000000);
      }
    });
  }

  private createLockedCrate(width: number, height: number) {
    // Caisse verrouillée au centre
    const crateX = width / 2;
    const crateY = height / 2;

    const crate = this.add.rectangle(crateX, crateY, 180, 180, 0x8b4513);
    crate.setStrokeStyle(4, 0x654321);

    // Cadenas
    const lock = this.add.circle(crateX, crateY - 40, 20, 0xffd700);
    lock.setStrokeStyle(3, 0x000000);

    // Écran d'accès
    const screen = this.add.rectangle(crateX, crateY + 20, 140, 60, 0x000000);
    screen.setStrokeStyle(2, 0xff0000);

    const screenText = this.add.text(crateX, crateY + 20, "ACCESS DENIED\nMissing key", {
      fontSize: "12px",
      color: "#ff0000",
      fontFamily: "Courier New",
      align: "center",
    }).setOrigin(0.5);

    // Label
    const crateLabel = this.add.text(crateX, crateY + 110, "🔒 Caisse sécurisée", {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction
    crate.setInteractive({ useHandCursor: true });
    crate.on("pointerdown", () => {
      this.showCrateInfo();
    });

    crateLabel.setInteractive({ useHandCursor: true });
    crateLabel.on("pointerdown", () => {
      this.showCrateInfo();
    });
  }

  private createMedicineNotice(width: number, height: number) {
    // Notice sur un bureau
    const deskX = width * 0.7;
    const deskY = height * 0.5;

    const desk = this.add.rectangle(deskX, deskY, 200, 150, 0x8b7355);
    desk.setStrokeStyle(3, 0x654321);

    // Document
    const paper = this.add.rectangle(deskX, deskY - 20, 120, 100, 0xffffff);
    paper.setStrokeStyle(2, 0x000000);

    const paperText = this.add.text(deskX, deskY - 20, "📄\nNotice\nMédicament", {
      fontSize: "14px",
      color: "#000000",
      align: "center",
    }).setOrigin(0.5);

    // Label
    const noticeLabel = this.add.text(deskX, deskY + 90, "📋 Notice médicament", {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction
    paper.setInteractive({ useHandCursor: true });
    paper.on("pointerdown", () => {
      this.showMedicineNotice();
    });

    noticeLabel.setInteractive({ useHandCursor: true });
    noticeLabel.on("pointerdown", () => {
      this.showMedicineNotice();
    });

    // Note sur le serveur
    const note = this.add.text(width * 0.7, height * 0.75, "📝 Note :\n\"Clé transférée sur\nle serveur principal\"", {
      fontSize: "14px",
      color: "#e74c3c",
      backgroundColor: "#ffff99",
      padding: { x: 10, y: 8 },
      align: "center",
    }).setOrigin(0.5);

    note.setInteractive({ useHandCursor: true });
    note.on("pointerdown", () => {
      this.showServerNote();
    });
  }

  private createNextDoor(width: number, height: number) {
    const doorX = width * 0.9;
    const doorY = height / 2;

    const door = this.add.rectangle(doorX, doorY, 80, 140, 0x8b4513);
    door.setStrokeStyle(4, 0x654321);

    const doorLabel = this.add.text(doorX, doorY + 85, "🚪 Salle\nd'Attente", {
      fontSize: "14px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 5 },
      align: "center",
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.formulaSent) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });

    doorLabel.setInteractive({ useHandCursor: true });
    doorLabel.on("pointerdown", () => {
      if (this.formulaSent) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });
  }

  private createBackButton(width: number, height: number) {
    const backBtn = this.add.text(50, height - 50, "← Retour Salle Info", {
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#555555",
      padding: { x: 15, y: 10 },
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(1000);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("ComputerRoomSceneB", { net: this.net, story: this.story });
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
      this.scale.height - 80,
      "🎯 Objectif : Trouver la formule de dosage et la transmettre au Joueur A\n💡 Explorez la salle pour trouver les informations nécessaires",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(1000);

    this.time.delayedCall(8000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1000,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showCrateInfo() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      `🔒 CAISSE SÉCURISÉE\n\nAccès refusé - Clé de chiffrement manquante\n\nCette caisse contient des médicaments vitaux.\nLa clé de chiffrement est : ${this.encryptionKey}\n\n💡 Transmettez cette clé au Joueur A\npour qu'il puisse déchiffrer les fichiers\ndu serveur.`,
      {
        fontSize: "18px",
        color: "#ffff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    // Bouton pour envoyer la clé
    const sendBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      "📤 Envoyer la clé au Joueur A",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#27ae60",
        padding: { x: 15, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    const closeBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 10,
      "Fermer",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#555555",
        padding: { x: 15, y: 8 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    sendBtn.on("pointerdown", () => {
      this.sendEncryptionKey();
      [message, sendBtn, closeBtn].forEach(obj => obj.destroy());
    });

    closeBtn.on("pointerdown", () => {
      [message, sendBtn, closeBtn].forEach(obj => obj.destroy());
    });
  }

  private showMedicineNotice() {
    this.formulaFound = true;

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "📋 NOTICE MÉDICAMENT\n\nFormule de dosage pour stabilisation cardiaque :\n\nDose (mL) = (Poids / 10) - (Âge / 100)\n\n⚠️ IMPORTANT : Cette formule est critique\npour le Joueur A. Transmettez-la lui !",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#3498db",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    // Bouton pour envoyer la formule
    const sendBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      "📤 Transmettre la formule au Joueur A",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#27ae60",
        padding: { x: 15, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    const closeBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 110,
      "Fermer",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#555555",
        padding: { x: 15, y: 8 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    sendBtn.on("pointerdown", () => {
      this.sendFormula();
      [message, sendBtn, closeBtn].forEach(obj => obj.destroy());
    });

    closeBtn.on("pointerdown", () => {
      [message, sendBtn, closeBtn].forEach(obj => obj.destroy());
    });
  }

  private showServerNote() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "📝 NOTE ADMINISTRATIVE\n\n\"Pour des raisons de sécurité,\nla clé de chiffrement a été transférée\nsur le serveur principal.\"\n\n💡 Le Joueur A aura besoin de cette clé\npour accéder aux fichiers du serveur.",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#e74c3c",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private sendFormula() {
    this.formulaSent = true;

    // Envoyer la formule au Joueur A via le réseau
    if (this.net) {
      this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
        type: "formula_sent",
        formula: "Dose = (Poids / 10) - (Âge / 100)",
        by: "PlayerB"
      });
    }

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "✓ FORMULE TRANSMISE !\n\nLe Joueur A a reçu la formule de dosage.\nIl peut maintenant soigner le patient.\n\nVous pouvez continuer vers la salle d'attente.",
      {
        fontSize: "20px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private sendEncryptionKey() {
    // Envoyer la clé au Joueur A via le réseau
    if (this.net) {
      this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
        type: "encryption_key_sent",
        key: this.encryptionKey,
        by: "PlayerB"
      });
    }

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      `✓ CLÉ TRANSMISE !\n\nClé de chiffrement : ${this.encryptionKey}\n\nLe Joueur A peut maintenant déchiffrer\nles fichiers du serveur.`,
      {
        fontSize: "20px",
        color: "#00ff00",
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

  private showDoorMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      this.formulaSent
        ? "Vous pouvez maintenant passer à la salle suivante."
        : "Terminez d'abord votre mission :\nTransmettez la formule au Joueur A.",
      {
        fontSize: "18px",
        color: "#ffffff",
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

  private openNextDoor() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start("WaitingRoomScene", { net: this.net, story: this.story });
    });
  }
}