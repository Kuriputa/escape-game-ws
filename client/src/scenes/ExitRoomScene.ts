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
    // Sol
    const floor = this.add.rectangle(400, 500, 800, 200, 0x2c2c2c);
    floor.setStrokeStyle(2, 0x1a1a1a);

    // Murs
    const wallLeft = this.add.rectangle(50, 300, 100, 600, 0x1a1a1a);
    wallLeft.setStrokeStyle(2, 0x0f0f0f);

    const wallRight = this.add.rectangle(750, 300, 100, 600, 0x1a1a1a);
    wallRight.setStrokeStyle(2, 0x0f0f0f);

    // Plafond
    const ceiling = this.add.rectangle(400, 50, 800, 100, 0x0f0f0f);
    ceiling.setStrokeStyle(2, 0x1a1a1a);

    // Titre de la salle
    this.add.text(400, 30, "SALLE DE SORTIE", {
      fontSize: "28px",
      color: "#ff6b6b",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Ambiance sombre
    const shadow = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.3);
  }

  private createExitDoor() {
    // Grande porte de sortie (verrouillée pour l'instant)
    const door = this.add.rectangle(400, 120, 150, 140, 0x654321);
    door.setStrokeStyle(4, 0x8b4513);

    // Poignées
    this.add.circle(370, 120, 10, 0xffd700);
    this.add.circle(430, 120, 10, 0xffd700);

    // Panneau "SORTIE"
    const exitSign = this.add.rectangle(400, 50, 120, 30, 0xff0000);
    exitSign.setStrokeStyle(2, 0xffffff);

    this.add.text(400, 50, "SORTIE", {
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Lumière clignotante
    const light = this.add.circle(400, 80, 8, 0xff0000);
    this.tweens.add({
      targets: light,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  private createMedicineCrate() {
    // Caisse de médicaments au centre
    const crate = this.add.rectangle(400, 250, 120, 100, 0x8b4513);
    crate.setStrokeStyle(3, 0x654321);

    // Croix rouge
    this.add.rectangle(400, 250, 60, 15, 0xff0000);
    this.add.rectangle(400, 250, 15, 60, 0xff0000);

    // Label
    this.add.text(400, 300, "MÉDICAMENTS", {
      fontSize: "14px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);

    // Effet de brillance
    const glow = this.add.circle(400, 250, 70, 0xffff00, 0.1);
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
    // Radio avec message
    const radio = this.add.rectangle(150, 200, 100, 60, 0x2c2c2c);
    radio.setStrokeStyle(2, 0x00ff00);

    // Antenne
    this.add.line(0, 0, 150, 170, 150, 140, 0x00ff00, 1).setLineWidth(2);

    // LED clignotante
    const led = this.add.circle(130, 190, 5, 0x00ff00);
    this.tweens.add({
      targets: led,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    this.add.text(150, 200, "📻", {
      fontSize: "30px"
    }).setOrigin(0.5);

    // Message radio
    const radioMessage = this.add.text(400, 360, 
      "📻 TRANSMISSION RADIO 📻\n\n" +
      "\"Mission accomplie. Prenez les médicaments et sortez.\n" +
      "Ou… rendez-les. Faites le bon choix.\"\n\n" +
      "⚠️ Votre décision aura des conséquences.",
      {
        fontSize: "16px",
        color: "#ffff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
        wordWrap: { width: 600 }
      }
    ).setOrigin(0.5);
  }

  private createChoiceButtons() {
    // Bouton "Voler les médicaments"
    const stealBtn = this.add.rectangle(250, 480, 200, 60, 0xff0000);
    stealBtn.setStrokeStyle(3, 0xff6b6b);
    stealBtn.setInteractive({ useHandCursor: true });

    this.add.text(250, 470, "💊 VOLER", {
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(250, 490, "les médicaments", {
      fontSize: "12px",
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

    // Bouton "Restituer les médicaments"
    const returnBtn = this.add.rectangle(550, 480, 200, 60, 0x00ff00);
    returnBtn.setStrokeStyle(3, 0x6bff6b);
    returnBtn.setInteractive({ useHandCursor: true });

    this.add.text(550, 470, "✋ RESTITUER", {
      fontSize: "20px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(550, 490, "les médicaments", {
      fontSize: "12px",
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
    // Timer de 30 secondes
    this.add.text(400, 540, "⏱️ TEMPS RESTANT :", {
      fontSize: "16px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.timerText = this.add.text(400, 565, "30", {
      fontSize: "32px",
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

    // Message de confirmation
    const confirmMsg = this.add.text(400, 430, 
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

    const timeoutMsg = this.add.text(400, 300, 
      "⏱️ TEMPS ÉCOULÉ !\n\nVous n'avez pas pris de décision à temps.\nL'alarme se déclenche...",
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
    // Overlay noir
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
    overlay.setDepth(4000);

    let epilogueText = "";
    let epilogueColor = "#ffffff";

    switch (outcome) {
      case "steal_both":
        epilogueText = 
          "🌙 ÉPILOGUE : LA FUITE 🌙\n\n" +
          "Vous fuyez tous les deux dans la nuit.\n" +
          "L'alarme retentit derrière vous.\n\n" +
          "Les médicaments sont en votre possession,\n" +
          "mais votre conscience est lourde.\n\n" +
          "Avez-vous fait le bon choix ?\n\n" +
          "💔 FIN - Conscience troublée";
        epilogueColor = "#ff6b6b";
        break;

      case "return_both":
        epilogueText = 
          "🌟 ÉPILOGUE : LA CONSCIENCE CLAIRE 🌟\n\n" +
          "Vous restituez les médicaments ensemble.\n" +
          "La mission est avortée, mais vous partez la tête haute.\n\n" +
          "Ces médicaments sauveront des vies.\n" +
          "L'humanité avant tout.\n\n" +
          "Vous avez fait le bon choix.\n\n" +
          "💚 FIN - Conscience claire";
        epilogueColor = "#00ff00";
        break;

      case "divergence":
        epilogueText = 
          "⚠️ ÉPILOGUE : LA DIVERGENCE ⚠️\n\n" +
          "Vos choix divergent !\n" +
          "L'un veut voler, l'autre restituer.\n\n" +
          "L'alarme se déclenche immédiatement.\n" +
          "Vous fuyez précipitamment, séparés.\n\n" +
          "La confiance est brisée.\n\n" +
          "💔 FIN - Trahison mutuelle";
        epilogueColor = "#ffaa00";
        break;

      case "timeout":
        epilogueText = 
          "⏱️ ÉPILOGUE : L'INDÉCISION ⏱️\n\n" +
          "Vous n'avez pas su prendre de décision.\n" +
          "L'alarme se déclenche automatiquement.\n\n" +
          "Les gardes arrivent.\n" +
          "Vous êtes capturés.\n\n" +
          "L'indécision a un prix.\n\n" +
          "❌ FIN - Échec";
        epilogueColor = "#ff0000";
        break;
    }

    const epilogue = this.add.text(400, 300, epilogueText, {
      fontSize: "18px",
      color: epilogueColor,
      backgroundColor: "#000000",
      padding: { x: 30, y: 20 },
      align: "center",
      wordWrap: { width: 600 }
    }).setOrigin(0.5).setDepth(5000);

    // Bouton pour recommencer
    const restartBtn = this.add.rectangle(400, 520, 200, 50, 0x4ecdc4);
    restartBtn.setStrokeStyle(3, 0x00d9ff);
    restartBtn.setInteractive({ useHandCursor: true });
    restartBtn.setDepth(5000);

    const restartText = this.add.text(400, 520, "🔄 RECOMMENCER", {
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