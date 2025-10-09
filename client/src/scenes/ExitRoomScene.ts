import Phaser from "phaser";
import { Net } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";
import { EVENT_CODES } from "../net/photonClient";

export class ExitRoomScene extends Phaser.Scene {
  private net!: Net;
  private story!: Story;
  private originalOnEvent?: (code: number, data: any) => void;

  private playerRole: string = "A";
  private myChoice: string = "";
  private partnerChoice: string = "";
  private timerValue: number = 30;
  private timerText?: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;
  private choiceMade: boolean = false;
  private gameEnded: boolean = false;

  constructor() {
    super("ExitRoomScene");
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
        // Recevoir le choix de l'autre joueur
        if (data.type === "FINAL_CHOICE") {
          this.partnerChoice = data.choice;
          this.checkBothChoices();
        }
      }
      // Appeler l'handler original pour les autres événements (CHAT, etc.)
      if (this.originalOnEvent) {
        this.originalOnEvent(code, data);
      }
    };

    // Créer la salle
    this.createRoom();
    this.createExitDoor();
    this.createMedicineCrate();
    this.createRadio();
    this.createChoiceButtons();
    this.createTimer();
    this.createBackButton();

    // Démarrer le timer
    this.startTimer();
  }

  private createRoom() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Sol
    const floor = this.add.rectangle(width / 2, height * 0.83, width, height * 0.33, 0x2c2c2c);
    floor.setStrokeStyle(2, 0x1a1a1a);

    // Murs
    const wallLeft = this.add.rectangle(width * 0.06, height / 2, width * 0.12, height, 0x1a1a1a);
    wallLeft.setStrokeStyle(2, 0x0f0f0f);

    const wallRight = this.add.rectangle(width * 0.94, height / 2, width * 0.12, height, 0x1a1a1a);
    wallRight.setStrokeStyle(2, 0x0f0f0f);

    // Plafond
    const ceiling = this.add.rectangle(width / 2, height * 0.08, width, height * 0.17, 0x0f0f0f);
    ceiling.setStrokeStyle(2, 0x1a1a1a);

    // Titre de la salle
    this.add.text(width / 2, height * 0.05, "SALLE DE SORTIE", {
      fontSize: "28px",
      color: "#ff6b6b",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Ambiance sombre
    const shadow = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3);
  }

  private createExitDoor() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Grande porte de sortie (verrouillée pour l'instant)
    const door = this.add.rectangle(width / 2, height * 0.2, width * 0.19, height * 0.23, 0x654321);
    door.setStrokeStyle(4, 0x8b4513);

    // Poignées
    this.add.circle(width / 2 - width * 0.0375, height * 0.2, width * 0.0125, 0xffd700);
    this.add.circle(width / 2 + width * 0.0375, height * 0.2, width * 0.0125, 0xffd700);

    // Panneau "SORTIE"
    const exitSign = this.add.rectangle(width / 2, height * 0.08, width * 0.15, height * 0.05, 0xff0000);
    exitSign.setStrokeStyle(2, 0xffffff);

    this.add.text(width / 2, height * 0.08, "SORTIE", {
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Lumière clignotante
    const light = this.add.circle(width / 2, height * 0.13, width * 0.01, 0xff0000);
    this.tweens.add({
      targets: light,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  private createMedicineCrate() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Caisse de médicaments au centre - mieux positionnée
    const crate = this.add.rectangle(width / 2, height * 0.38, width * 0.16, height * 0.18, 0x8b4513);
    crate.setStrokeStyle(3, 0x654321);

    // Croix rouge - plus grande
    this.add.rectangle(width / 2, height * 0.38, width * 0.08, height * 0.03, 0xff0000);
    this.add.rectangle(width / 2, height * 0.38, width * 0.0225, height * 0.11, 0xff0000);

    // Label - mieux espacé
    this.add.text(width / 2, height * 0.48, "MÉDICAMENTS", {
      fontSize: "15px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 8, y: 5 }
    }).setOrigin(0.5);

    // Effet de brillance
    const glow = this.add.circle(width / 2, height * 0.38, width * 0.094, 0xffff00, 0.1);
    this.tweens.add({
      targets: glow,
      scale: 1.2,
      alpha: 0.05,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  }

  private createRadio() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Radio avec message - repositionnée
    const radio = this.add.rectangle(width * 0.19, height * 0.32, width * 0.125, height * 0.1, 0x2c2c2c);
    radio.setStrokeStyle(2, 0x00ff00);

    // Antenne
    this.add.line(0, 0, width * 0.19, height * 0.27, width * 0.19, height * 0.22, 0x00ff00, 1).setLineWidth(2);

    // LED clignotante
    const led = this.add.circle(width * 0.165, height * 0.3, width * 0.006, 0x00ff00);
    this.tweens.add({
      targets: led,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    this.add.text(width * 0.19, height * 0.32, "📻", {
      fontSize: "30px"
    }).setOrigin(0.5);

    // Message radio - mieux espacé
    const radioMessage = this.add.text(width / 2, height * 0.6, 
      "TRANSMISSION RADIO\n\n" +
      "\"Mission accomplie. Prenez les médicaments et sortez.\n" +
      "Ou… rendez-les. Faites le bon choix.\"\n\n" +
      "Votre décision aura des conséquences.",
      {
        fontSize: "17px",
        color: "#ffff00",
        backgroundColor: "#000000",
        padding: { x: 25, y: 18 },
        align: "center",
        wordWrap: { width: width * 0.81 }
      }
    ).setOrigin(0.5);
  }

  private createChoiceButtons() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Bouton "Voler les médicaments" - plus grand et mieux espacé
    const stealBtn = this.add.rectangle(width * 0.3, height * 0.78, width * 0.275, height * 0.12, 0xff0000);
    stealBtn.setStrokeStyle(4, 0xff6b6b);
    stealBtn.setInteractive({ useHandCursor: true });

    this.add.text(width * 0.3, height * 0.76, "VOLER", {
      fontSize: "22px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width * 0.3, height * 0.8, "les médicaments", {
      fontSize: "13px",
      color: "#ffffff"
    }).setOrigin(0.5);

    stealBtn.on("pointerdown", () => {
      this.makeChoice("steal");
    });

    stealBtn.on("pointerover", () => {
      if (!this.choiceMade) {
        stealBtn.setFillStyle(0xcc0000);
      }
    });

    stealBtn.on("pointerout", () => {
      stealBtn.setFillStyle(0xff0000);
    });

    // Bouton "Restituer les médicaments" - plus grand et mieux espacé
    const returnBtn = this.add.rectangle(width * 0.7, height * 0.78, width * 0.275, height * 0.12, 0x00ff00);
    returnBtn.setStrokeStyle(4, 0x6bff6b);
    returnBtn.setInteractive({ useHandCursor: true });

    this.add.text(width * 0.7, height * 0.76, "RESTITUER", {
      fontSize: "22px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width * 0.7, height * 0.8, "les médicaments", {
      fontSize: "13px",
      color: "#000000"
    }).setOrigin(0.5);

    returnBtn.on("pointerdown", () => {
      this.makeChoice("return");
    });

    returnBtn.on("pointerover", () => {
      if (!this.choiceMade) {
        returnBtn.setFillStyle(0x00cc00);
      }
    });

    returnBtn.on("pointerout", () => {
      returnBtn.setFillStyle(0x00ff00);
    });
  }

  private createTimer() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Timer de 30 secondes - mieux espacé
    this.add.text(width / 2, height * 0.92, "TEMPS RESTANT :", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.timerText = this.add.text(width / 2, height * 0.97, "30", {
      fontSize: "36px",
      color: "#ffff00",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timerValue--;
        this.timerText?.setText(this.timerValue.toString());

        // Changer la couleur selon le temps restant
        if (this.timerValue <= 10) {
          this.timerText?.setColor("#ff0000");
        } else if (this.timerValue <= 20) {
          this.timerText?.setColor("#ffaa00");
        }

        // Temps écoulé
        if (this.timerValue <= 0) {
          this.timerEvent?.remove();
          this.timeOut();
        }
      },
      loop: true
    });
  }

  private makeChoice(choice: string) {
    if (this.choiceMade || this.gameEnded) return;

    this.choiceMade = true;
    this.myChoice = choice;

    // Envoyer le choix au partenaire
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "FINAL_CHOICE",
      choice: choice,
      player: this.playerRole
    });

    const width = this.scale.width;
    const height = this.scale.height;

    // Message de confirmation
    const confirmMsg = this.add.text(width / 2, height * 0.72, 
      choice === "steal" 
        ? "Vous avez choisi de VOLER les médicaments."
        : "Vous avez choisi de RESTITUER les médicaments.",
      {
        fontSize: "16px",
        color: choice === "steal" ? "#ff0000" : "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 15, y: 8 }
      }
    ).setOrigin(0.5);

    // Vérifier si les deux joueurs ont choisi
    this.checkBothChoices();
  }

  private checkBothChoices() {
    if (this.myChoice && this.partnerChoice && !this.gameEnded) {
      this.gameEnded = true;
      this.timerEvent?.remove();

      // Déterminer l'épilogue
      if (this.myChoice === this.partnerChoice) {
        if (this.myChoice === "steal") {
          this.showEpilogue("steal_both");
        } else {
          this.showEpilogue("return_both");
        }
      } else {
        this.showEpilogue("divergence");
      }
    }
  }

  private timeOut() {
    if (this.gameEnded) return;

    this.gameEnded = true;

    const width = this.scale.width;
    const height = this.scale.height;

    const timeoutMsg = this.add.text(width / 2, height / 2, 
      "TEMPS ÉCOULÉ !\n\nVous n'avez pas pris de décision à temps.\nL'alarme se déclenche...",
      {
        fontSize: "20px",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center"
      }
    ).setOrigin(0.5).setDepth(5000);

    this.showEpilogue("timeout");
  }

  private showEpilogue(outcome: string) {
    const width = this.scale.width;
    const height = this.scale.height;

    // Overlay noir
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);
    overlay.setDepth(4000);

    let epilogueText = "";
    let epilogueColor = "#ffffff";

    switch (outcome) {
      case "steal_both":
        epilogueText = 
          "ÉPILOGUE : LA FUITE\n\n" +
          "Vous fuyez tous les deux dans la nuit.\n" +
          "L'alarme retentit derrière vous.\n\n" +
          "Les médicaments sont en votre possession,\n" +
          "mais votre conscience est lourde.\n\n" +
          "Avez-vous fait le bon choix ?\n\n" +
          "FIN - Conscience troublée";
        epilogueColor = "#ff6b6b";
        break;

      case "return_both":
        epilogueText = 
          "ÉPILOGUE : LA CONSCIENCE CLAIRE\n\n" +
          "Vous restituez les médicaments ensemble.\n" +
          "La mission est avortée, mais vous partez la tête haute.\n\n" +
          "Ces médicaments sauveront des vies.\n" +
          "L'humanité avant tout.\n\n" +
          "Vous avez fait le bon choix.\n\n" +
          "FIN - Conscience claire";
        epilogueColor = "#00ff00";
        break;

      case "divergence":
        epilogueText = 
          "ÉPILOGUE : LA DIVERGENCE\n\n" +
          "Vos choix divergent !\n" +
          "L'un veut voler, l'autre restituer.\n\n" +
          "L'alarme se déclenche immédiatement.\n" +
          "Vous fuyez précipitamment, séparés.\n\n" +
          "La confiance est brisée.\n\n" +
          "FIN - Trahison mutuelle";
        epilogueColor = "#ffaa00";
        break;

      case "timeout":
        epilogueText = 
          "ÉPILOGUE : L'INDÉCISION\n\n" +
          "Vous n'avez pas su prendre de décision.\n" +
          "L'alarme se déclenche automatiquement.\n\n" +
          "Les gardes arrivent.\n" +
          "Vous êtes capturés.\n\n" +
          "L'indécision a un prix.\n\n" +
          "FIN - Échec";
        epilogueColor = "#ff0000";
        break;
    }

    const epilogue = this.add.text(width / 2, height / 2, epilogueText, {
      fontSize: "18px",
      color: epilogueColor,
      backgroundColor: "#000000",
      padding: { x: 30, y: 20 },
      align: "center",
      wordWrap: { width: width * 0.75 }
    }).setOrigin(0.5).setDepth(5000);

    // Bouton pour recommencer
    const restartBtn = this.add.rectangle(width / 2, height * 0.87, width * 0.25, height * 0.08, 0x4ecdc4);
    restartBtn.setStrokeStyle(3, 0x00d9ff);
    restartBtn.setInteractive({ useHandCursor: true });
    restartBtn.setDepth(5000);

    const restartText = this.add.text(width / 2, height * 0.87, "🔄 RECOMMENCER", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(5001);

    restartBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("HospitalRoomScene", { net: this.net, story: this.story });
      });
    });

    restartBtn.on("pointerover", () => {
      restartBtn.setFillStyle(0x3db8af);
    });

    restartBtn.on("pointerout", () => {
      restartBtn.setFillStyle(0x4ecdc4);
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
      if (!this.gameEnded) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("WaitingRoomScene", { net: this.net, story: this.story });
        });
      }
    });

    backBtn.on("pointerover", () => {
      if (!this.gameEnded) {
        backBtn.setFillStyle(0x666666);
      }
    });

    backBtn.on("pointerout", () => {
      backBtn.setFillStyle(0x444444);
    });
  }
}