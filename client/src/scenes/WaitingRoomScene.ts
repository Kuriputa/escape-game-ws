import Phaser from "phaser";
import { Net } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";
import { EVENT_CODES } from "../net/photonClient";

export class WaitingRoomScene extends Phaser.Scene {
  private net!: Net;
  private story!: Story;
  private originalOnEvent?: (code: number, data: any) => void;

  private playerRole: string = "A"; // A ou B
  private sequenceA: string[] = ["red", "blue", "green"];
  private sequenceB: string[] = ["blue", "green", "red"];
  private correctSequence: string[] = ["red", "blue", "green", "red"];
  
  private currentSequence: string[] = [];
  private puzzleSolved: boolean = false;

  private redButton?: Phaser.GameObjects.Rectangle;
  private blueButton?: Phaser.GameObjects.Rectangle;
  private greenButton?: Phaser.GameObjects.Rectangle;
  private statusText?: Phaser.GameObjects.Text;
  private sequenceDisplay?: Phaser.GameObjects.Text;
  private doorText?: Phaser.GameObjects.Text;

  constructor() {
    super("WaitingRoomScene");
  }

  create(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;

    // Déterminer le rôle du joueur
    const state = GameState.getInstance();
    this.playerRole = state.playerRole || "A";

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Sauvegarder l'event handler original
    this.originalOnEvent = this.net.onEvent;
    this.net.onEvent = (code, data) => {
      if (code === EVENT_CODES.PUZZLE_UPDATE) {
        // Recevoir les clics de boutons de l'autre joueur
        if (data.type === "BUTTON_PRESS") {
          this.handleRemoteButtonPress(data.color, data.step);
        }
      }
      // Appeler l'handler original pour les autres événements (CHAT, etc.)
      if (this.originalOnEvent) {
        this.originalOnEvent(code, data);
      }
    };

    // Créer la salle
    this.createRoom();
    this.createChairs();
    this.createButtonPanel();
    this.createSequenceDisplay();
    this.createDoor();
    this.createBackButton();

    // Message d'info
    const infoText = this.add.text(400, 570, 
      "Coordonnez-vous avec votre partenaire pour appuyer sur les boutons dans le bon ordre", 
      {
        fontSize: "14px",
        color: "#aaaaaa",
        align: "center",
        wordWrap: { width: 700 }
      }
    ).setOrigin(0.5);
  }

  private createRoom() {
    // Sol
    const floor = this.add.rectangle(400, 500, 800, 200, 0x2c3e50);
    floor.setStrokeStyle(2, 0x34495e);

    // Murs
    const wallLeft = this.add.rectangle(50, 300, 100, 600, 0x1a252f);
    wallLeft.setStrokeStyle(2, 0x34495e);

    const wallRight = this.add.rectangle(750, 300, 100, 600, 0x1a252f);
    wallRight.setStrokeStyle(2, 0x34495e);

    // Plafond
    const ceiling = this.add.rectangle(400, 50, 800, 100, 0x16202b);
    ceiling.setStrokeStyle(2, 0x34495e);

    // Titre de la salle
    this.add.text(400, 30, "SALLE D'ATTENTE", {
      fontSize: "28px",
      color: "#ecf0f1",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private createChairs() {
    // Rangées de chaises
    const chairPositions = [
      { x: 150, y: 150 }, { x: 220, y: 150 }, { x: 290, y: 150 },
      { x: 510, y: 150 }, { x: 580, y: 150 }, { x: 650, y: 150 },
      { x: 150, y: 220 }, { x: 220, y: 220 }, { x: 290, y: 220 },
      { x: 510, y: 220 }, { x: 580, y: 220 }, { x: 650, y: 220 },
    ];

    chairPositions.forEach(pos => {
      // Dossier
      const backrest = this.add.rectangle(pos.x, pos.y - 15, 40, 10, 0x7f8c8d);
      backrest.setStrokeStyle(1, 0x95a5a6);

      // Assise
      const seat = this.add.rectangle(pos.x, pos.y, 40, 30, 0x95a5a6);
      seat.setStrokeStyle(1, 0xbdc3c7);

      // Pieds
      this.add.rectangle(pos.x - 12, pos.y + 20, 3, 10, 0x7f8c8d);
      this.add.rectangle(pos.x + 12, pos.y + 20, 3, 10, 0x7f8c8d);
    });

    // Table basse au centre
    const table = this.add.rectangle(400, 190, 120, 80, 0x8b4513);
    table.setStrokeStyle(2, 0x654321);

    this.add.text(400, 190, "TABLE", {
      fontSize: "12px",
      color: "#d4a574"
    }).setOrigin(0.5);
  }

  private createButtonPanel() {
    // Panneau de contrôle
    const panel = this.add.rectangle(400, 350, 400, 200, 0x1a1a2e);
    panel.setStrokeStyle(3, 0x00d9ff);

    this.add.text(400, 270, "PANNEAU DE CONTRÔLE", {
      fontSize: "20px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Afficher la séquence du joueur
    const mySequence = this.playerRole === "A" ? this.sequenceA : this.sequenceB;
    const sequenceText = mySequence.map(c => {
      if (c === "red") return "🔴 Rouge";
      if (c === "blue") return "🔵 Bleu";
      if (c === "green") return "🟢 Vert";
      return c;
    }).join(" → ");

    this.add.text(400, 300, `Votre séquence (Joueur ${this.playerRole}) :`, {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(400, 320, sequenceText, {
      fontSize: "16px",
      color: "#ffff00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Bouton Rouge
    this.redButton = this.add.rectangle(250, 380, 80, 80, 0xff0000);
    this.redButton.setStrokeStyle(3, 0xff6b6b);
    this.redButton.setInteractive({ useHandCursor: true });

    this.add.text(250, 380, "🔴", {
      fontSize: "40px"
    }).setOrigin(0.5);

    this.add.text(250, 420, "ROUGE", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.redButton.on("pointerdown", () => {
      this.pressButton("red");
    });

    this.redButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.redButton?.setFillStyle(0xcc0000);
      }
    });

    this.redButton.on("pointerout", () => {
      this.redButton?.setFillStyle(0xff0000);
    });

    // Bouton Bleu
    this.blueButton = this.add.rectangle(400, 380, 80, 80, 0x0000ff);
    this.blueButton.setStrokeStyle(3, 0x6b6bff);
    this.blueButton.setInteractive({ useHandCursor: true });

    this.add.text(400, 380, "🔵", {
      fontSize: "40px"
    }).setOrigin(0.5);

    this.add.text(400, 420, "BLEU", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.blueButton.on("pointerdown", () => {
      this.pressButton("blue");
    });

    this.blueButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.blueButton?.setFillStyle(0x0000cc);
      }
    });

    this.blueButton.on("pointerout", () => {
      this.blueButton?.setFillStyle(0x0000ff);
    });

    // Bouton Vert
    this.greenButton = this.add.rectangle(550, 380, 80, 80, 0x00ff00);
    this.greenButton.setStrokeStyle(3, 0x6bff6b);
    this.greenButton.setInteractive({ useHandCursor: true });

    this.add.text(550, 380, "🟢", {
      fontSize: "40px"
    }).setOrigin(0.5);

    this.add.text(550, 420, "VERT", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.greenButton.on("pointerdown", () => {
      this.pressButton("green");
    });

    this.greenButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.greenButton?.setFillStyle(0x00cc00);
      }
    });

    this.greenButton.on("pointerout", () => {
      this.greenButton?.setFillStyle(0x00ff00);
    });

    // Bouton Reset
    const resetBtn = this.add.rectangle(400, 470, 100, 35, 0xff6b6b);
    resetBtn.setStrokeStyle(2, 0xff0000);
    resetBtn.setInteractive({ useHandCursor: true });

    this.add.text(400, 470, "RÉINITIALISER", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    resetBtn.on("pointerdown", () => {
      this.resetSequence();
    });

    resetBtn.on("pointerover", () => {
      resetBtn.setFillStyle(0xff5252);
    });

    resetBtn.on("pointerout", () => {
      resetBtn.setFillStyle(0xff6b6b);
    });
  }

  private createSequenceDisplay() {
    // Affichage de la séquence en cours
    this.add.text(400, 510, "Séquence en cours :", {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.sequenceDisplay = this.add.text(400, 535, "Aucun bouton pressé", {
      fontSize: "16px",
      color: "#aaaaaa",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    this.statusText = this.add.text(400, 555, "", {
      fontSize: "14px",
      color: "#ffaa00"
    }).setOrigin(0.5);
  }

  private pressButton(color: string) {
    if (this.puzzleSolved) return;

    // Ajouter à la séquence
    this.currentSequence.push(color);

    // Envoyer l'événement réseau
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "BUTTON_PRESS",
      color: color,
      step: this.currentSequence.length,
      player: this.playerRole
    });

    // Mettre à jour l'affichage
    this.updateSequenceDisplay();

    // Vérifier la séquence
    this.checkSequence();
  }

  private handleRemoteButtonPress(color: string, step: number) {
    // Recevoir le clic d'un bouton de l'autre joueur
    // (déjà ajouté à la séquence par l'autre joueur)
    this.statusText?.setText(`Partenaire a appuyé sur ${this.getColorName(color)}`);
  }

  private updateSequenceDisplay() {
    const displayText = this.currentSequence.map(c => {
      if (c === "red") return "🔴";
      if (c === "blue") return "🔵";
      if (c === "green") return "🟢";
      return c;
    }).join(" ");

    this.sequenceDisplay?.setText(displayText || "Aucun bouton pressé");
  }

  private checkSequence() {
    // Vérifier si la séquence actuelle correspond au début de la séquence correcte
    for (let i = 0; i < this.currentSequence.length; i++) {
      if (this.currentSequence[i] !== this.correctSequence[i]) {
        // Erreur !
        this.triggerAlarm();
        return;
      }
    }

    // Si la séquence est complète et correcte
    if (this.currentSequence.length === this.correctSequence.length) {
      this.solvePuzzle();
    } else {
      this.statusText?.setText(`✓ Correct ! (${this.currentSequence.length}/${this.correctSequence.length})`);
      this.statusText?.setColor("#00ff00");
    }
  }

  private triggerAlarm() {
    this.statusText?.setText("❌ ERREUR ! Séquence incorrecte. Réinitialisation...");
    this.statusText?.setColor("#ff0000");

    // Animation d'alarme
    const alarm = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.3);
    this.tweens.add({
      targets: alarm,
      alpha: 0,
      duration: 500,
      repeat: 3,
      onComplete: () => alarm.destroy()
    });

    // Reset après 2 secondes
    this.time.delayedCall(2000, () => {
      this.resetSequence();
    });
  }

  private resetSequence() {
    this.currentSequence = [];
    this.updateSequenceDisplay();
    this.statusText?.setText("Séquence réinitialisée. Recommencez.");
    this.statusText?.setColor("#ffaa00");
  }

  private solvePuzzle() {
    this.puzzleSolved = true;

    this.statusText?.setText("✓ SÉQUENCE COMPLÈTE ! Porte déverrouillée.");
    this.statusText?.setColor("#00ff00");

    this.doorText?.setText("DÉVERROUILLÉE");
    this.doorText?.setColor("#00ff00");

    // Désactiver les boutons
    this.redButton?.disableInteractive();
    this.blueButton?.disableInteractive();
    this.greenButton?.disableInteractive();

    // Message de succès
    const successMsg = this.add.text(400, 200, 
      "✓ PUZZLE RÉSOLU !\n\nCoordination parfaite.\nVous pouvez maintenant accéder à la sortie.", 
      {
        fontSize: "20px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center"
      }
    ).setOrigin(0.5).setDepth(3000);

    this.tweens.add({
      targets: successMsg,
      alpha: 0,
      y: 150,
      duration: 4000,
      delay: 3000,
      onComplete: () => successMsg.destroy()
    });

    // Envoyer l'événement réseau
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "WAITING_ROOM_SOLVED",
      by: this.playerRole
    });
  }

  private getColorName(color: string): string {
    if (color === "red") return "Rouge";
    if (color === "blue") return "Bleu";
    if (color === "green") return "Vert";
    return color;
  }

  private createDoor() {
    // Porte vers ExitRoomScene
    const door = this.add.rectangle(700, 120, 80, 100, 0x8b4513);
    door.setStrokeStyle(3, 0xff0000);

    const doorHandle = this.add.circle(680, 120, 8, 0xffd700);

    this.doorText = this.add.text(700, 120, "VERROUILLÉE", {
      fontSize: "11px",
      color: "#ff0000",
      align: "center",
      wordWrap: { width: 70 }
    }).setOrigin(0.5);

    this.add.text(700, 80, "SORTIE", {
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.puzzleSolved) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("ExitRoomScene", { net: this.net, story: this.story });
        });
      } else {
        const msg = this.add.text(700, 170, "Porte verrouillée !\nRésolvez le puzzle.", {
          fontSize: "14px",
          color: "#ff6b6b",
          align: "center"
        }).setOrigin(0.5);

        this.tweens.add({
          targets: msg,
          alpha: 0,
          duration: 2000,
          onComplete: () => msg.destroy()
        });
      }
    });

    door.on("pointerover", () => {
      if (this.puzzleSolved) {
        door.setStrokeStyle(3, 0x00ff00);
      }
    });

    door.on("pointerout", () => {
      if (this.puzzleSolved) {
        door.setStrokeStyle(3, 0x00ff00);
      } else {
        door.setStrokeStyle(3, 0xff0000);
      }
    });
  }

  private createBackButton() {
    const backBtn = this.add.rectangle(50, 570, 80, 40, 0x444444);
    backBtn.setStrokeStyle(2, 0x888888);
    backBtn.setInteractive({ useHandCursor: true });

    this.add.text(50, 570, "← RETOUR", {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        // Retour vers la salle précédente selon le rôle
        if (this.playerRole === "A") {
          this.scene.start("ServerRoomScene", { net: this.net, story: this.story });
        } else {
          this.scene.start("MedicineStorageScene", { net: this.net, story: this.story });
        }
      });
    });

    backBtn.on("pointerover", () => {
      backBtn.setFillStyle(0x666666);
    });

    backBtn.on("pointerout", () => {
      backBtn.setFillStyle(0x444444);
    });
  }
}