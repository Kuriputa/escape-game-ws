import Phaser from "phaser";
import { Net, EVENT_CODES } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";

export class PatientRoomScene extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private gameState!: GameState;
  private hasFormula: boolean = false;
  private patientHealed: boolean = false;

  constructor() {
    super({ key: "PatientRoomScene" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
    this.gameState = GameState.getInstance();
    
    // Setup network event listener
    if (this.net) {
      const originalOnEvent = this.net.onEvent;
      
      this.net.onEvent = (code: number, data: any) => {
        console.log("PatientRoomScene received event:", code, data);
        
        // Recevoir la formule du Joueur B
        if (code === EVENT_CODES.PUZZLE_UPDATE && data.type === "formula_sent") {
          console.log("Formula received from Player B!");
          this.onFormulaReceived(data.formula);
        }
        
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

    // ===== SALLE DU PATIENT =====
    this.createRoom(width, height);

    // ===== PATIENT INCONSCIENT =====
    this.createPatient(width, height);

    // ===== MONITEUR MÉDICAL =====
    this.createMonitor(width, height);

    // ===== SERINGUE =====
    this.createSyringe(width, height);

    // ===== PORTE VERS SALLE SERVEUR =====
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
    const floor = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.7, 0xe8f4f8);
    floor.setStrokeStyle(4, 0xb0c4de);

    // Titre
    this.add.text(width / 2, 50, "Salle du Patient - Parcours A", {
      fontSize: "28px",
      color: "#2c3e50",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Lit médical
    const bed = this.add.rectangle(width / 2 - 100, height / 2, 200, 120, 0xffffff);
    bed.setStrokeStyle(3, 0x95a5a6);

    // Oreiller
    const pillow = this.add.rectangle(width / 2 - 100, height / 2 - 40, 80, 40, 0xecf0f1);
    pillow.setStrokeStyle(2, 0xbdc3c7);
  }

  private createPatient(width: number, height: number) {
    // Corps du patient (simplifié)
    const body = this.add.rectangle(width / 2 - 100, height / 2 + 20, 150, 80, 0xffd7a8);
    body.setStrokeStyle(2, 0xd4a574);

    // Tête
    const head = this.add.circle(width / 2 - 100, height / 2 - 30, 25, 0xffd7a8);
    head.setStrokeStyle(2, 0xd4a574);

    // Label
    const patientLabel = this.add.text(width / 2 - 100, height / 2 + 80, "🤒 Patient inconscient", {
      fontSize: "16px",
      color: "#e74c3c",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction
    body.setInteractive({ useHandCursor: true });
    body.on("pointerdown", () => {
      this.showPatientInfo();
    });

    patientLabel.setInteractive({ useHandCursor: true });
    patientLabel.on("pointerdown", () => {
      this.showPatientInfo();
    });
  }

  private createMonitor(width: number, height: number) {
    // Moniteur médical
    const monitorX = width / 2 + 150;
    const monitorY = height / 2 - 50;

    const monitor = this.add.rectangle(monitorX, monitorY, 180, 140, 0x2c3e50);
    monitor.setStrokeStyle(3, 0x34495e);

    // Écran
    const screen = this.add.rectangle(monitorX, monitorY - 10, 160, 100, 0x1a252f);

    // Données vitales
    const vitalsText = this.add.text(monitorX, monitorY - 10, "MONITEUR VITAL\n\nTension: 7.5 / 4.0\nPoids: 70 kg\nÂge: 50 ans", {
      fontSize: "14px",
      color: "#00ff00",
      fontFamily: "Courier New",
      align: "center",
    }).setOrigin(0.5);

    // LED clignotante
    const led = this.add.circle(monitorX - 70, monitorY - 60, 5, 0xff0000);
    this.tweens.add({
      targets: led,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Label
    const monitorLabel = this.add.text(monitorX, monitorY + 90, "📊 Moniteur", {
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#34495e",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction
    monitor.setInteractive({ useHandCursor: true });
    monitor.on("pointerdown", () => {
      this.showMonitorDetails();
    });

    monitorLabel.setInteractive({ useHandCursor: true });
    monitorLabel.on("pointerdown", () => {
      this.showMonitorDetails();
    });
  }

  private createSyringe(width: number, height: number) {
    // Seringue sur une table
    const tableX = width / 2 + 150;
    const tableY = height / 2 + 100;

    const table = this.add.rectangle(tableX, tableY, 120, 80, 0xffffff);
    table.setStrokeStyle(2, 0xbdc3c7);

    // Seringue (simplifiée)
    const syringe = this.add.rectangle(tableX, tableY, 60, 10, 0xecf0f1);
    syringe.setStrokeStyle(2, 0x95a5a6);

    const needle = this.add.rectangle(tableX + 35, tableY, 15, 3, 0x7f8c8d);

    // Label
    const syringeLabel = this.add.text(tableX, tableY + 50, "💉 Seringue", {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Interaction
    table.setInteractive({ useHandCursor: true });
    table.on("pointerdown", () => {
      this.useSyringe();
    });

    syringeLabel.setInteractive({ useHandCursor: true });
    syringeLabel.on("pointerdown", () => {
      this.useSyringe();
    });
  }

  private createNextDoor(width: number, height: number) {
    const doorX = width * 0.85;
    const doorY = height / 2;

    const door = this.add.rectangle(doorX, doorY, 100, 160, 0x8b4513);
    door.setStrokeStyle(4, 0x654321);

    const doorLabel = this.add.text(doorX, doorY + 100, "🚪 Salle\nServeur", {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 5 },
      align: "center",
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.patientHealed) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });

    doorLabel.setInteractive({ useHandCursor: true });
    doorLabel.on("pointerdown", () => {
      if (this.patientHealed) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });
  }

  private createBackButton(width: number, height: number) {
    const backBtn = this.add.text(50, height - 50, "← Retour Couloir", {
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#555555",
      padding: { x: 15, y: 10 },
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(1000);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("CorridorSceneA", { net: this.net, story: this.story });
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
      "🎯 Objectif : Stabiliser le patient pour débloquer la porte\n💡 Le Joueur B doit vous transmettre la formule de dosage",
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

  private showPatientInfo() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "🤒 PATIENT INCONSCIENT\n\nLe patient bloque le passage.\nSa tension artérielle est dangereusement basse.\n\nVous devez lui administrer le bon dosage\nde médicament pour le stabiliser.",
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

  private showMonitorDetails() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "📊 DONNÉES VITALES DU PATIENT\n\nTension artérielle: 7.5 / 4.0 (CRITIQUE)\nPoids: 70 kg\nÂge: 50 ans\n\n⚠️ Le patient nécessite un traitement d'urgence.\nVous avez besoin de la formule de dosage.",
      {
        fontSize: "18px",
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

  private useSyringe() {
    if (!this.hasFormula) {
      const message = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        "⚠️ ATTENTION\n\nVous ne connaissez pas la formule de dosage !\nAdministrer un médicament sans connaître\nla dose exacte pourrait être fatal.\n\nAttendez que votre coéquipier vous\ntransmette la formule.",
        {
          fontSize: "18px",
          color: "#ff0000",
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
    } else {
      this.showDosageCalculation();
    }
  }

  private onFormulaReceived(formula: string) {
    this.hasFormula = true;

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      `📋 FORMULE REÇUE\n\nVotre coéquipier vous a transmis la formule :\n\n${formula}\n\nVous pouvez maintenant calculer la dose\net utiliser la seringue.`,
      {
        fontSize: "20px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(6000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showDosageCalculation() {
    // Créer un dialogue de calcul
    const dialogBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      600,
      400,
      0x000000,
      0.95
    ).setDepth(2500).setStrokeStyle(4, 0x3498db);

    const title = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 160,
      "💉 CALCUL DE DOSAGE",
      {
        fontSize: "24px",
        color: "#3498db",
        fontStyle: "bold",
      }
    ).setOrigin(0.5).setDepth(2501);

    const formula = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 110,
      "Formule : Dose = (Poids / 10) - (Âge / 100)\n\nDonnées patient :\nPoids: 70 kg | Âge: 50 ans\n\nQuelle dose administrer ?",
      {
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2501);

    // Boutons de choix
    const correctBtn = this.createDoseButton("6.5 mL", this.scale.height / 2 + 20, "#27ae60");
    const wrongBtn1 = this.createDoseButton("7.0 mL", this.scale.height / 2 + 70, "#c0392b");
    const wrongBtn2 = this.createDoseButton("5.5 mL", this.scale.height / 2 + 120, "#c0392b");
    const closeBtn = this.createDoseButton("Annuler", this.scale.height / 2 + 170, "#555555");

    correctBtn.on("pointerdown", () => {
      this.healPatient();
      [dialogBg, title, formula, correctBtn, wrongBtn1, wrongBtn2, closeBtn].forEach(obj => obj.destroy());
    });

    wrongBtn1.on("pointerdown", () => {
      this.showWrongDoseMessage();
    });

    wrongBtn2.on("pointerdown", () => {
      this.showWrongDoseMessage();
    });

    closeBtn.on("pointerdown", () => {
      [dialogBg, title, formula, correctBtn, wrongBtn1, wrongBtn2, closeBtn].forEach(obj => obj.destroy());
    });
  }

  private createDoseButton(text: string, y: number, bgColor: string): Phaser.GameObjects.Text {
    return this.add.text(
      this.scale.width / 2,
      y,
      text,
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: bgColor,
        padding: { x: 20, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });
  }

  private showWrongDoseMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 220,
      "✗ Dose incorrecte ! Recalculez.",
      {
        fontSize: "16px",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 15, y: 8 },
      }
    ).setOrigin(0.5).setDepth(2502);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private healPatient() {
    this.patientHealed = true;

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "✓ PATIENT STABILISÉ !\n\nLa tension artérielle se normalise.\nLe patient reprend conscience.\n\n💚 Vous avez sauvé une vie.\n\nLa porte vers la salle serveur est déverrouillée.",
      {
        fontSize: "22px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    // Envoyer l'événement réseau
    if (this.net) {
      this.net.send(EVENT_CODES.PUZZLE_UPDATE, { type: "patient_healed", by: "PlayerA" });
    }

    this.time.delayedCall(6000, () => {
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
      this.patientHealed 
        ? "Vous pouvez maintenant passer à la salle suivante."
        : "🔒 PORTE VERROUILLÉE\n\nLe patient bloque le passage.\nStabilisez-le d'abord.",
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
      this.scene.start("ServerRoomScene", { net: this.net, story: this.story });
    });
  }
}