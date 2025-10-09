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
  
  // Nouvelle mécanique : Joueur A voit une séquence de 6 symboles, Joueur B doit les cliquer dans l'ordre
  private correctSequence: string[] = ["circle", "triangle", "circle", "star", "square", "triangle"];
  private currentSequence: string[] = [];
  private puzzleSolved: boolean = false;

  private circleButton?: Phaser.GameObjects.Rectangle;
  private triangleButton?: Phaser.GameObjects.Rectangle;
  private squareButton?: Phaser.GameObjects.Rectangle;
  private starButton?: Phaser.GameObjects.Rectangle;
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
        if (data.type === "BUTTON_PRESS_WAITING") {
          this.handleRemoteButtonPress(data.color, data.step);
        }
        // Recevoir la notification de puzzle résolu
        if (data.type === "PUZZLE_SOLVED_WAITING") {
          this.solvePuzzle();
        }
        // Recevoir la réinitialisation de séquence
        if (data.type === "SEQUENCE_RESET") {
          this.resetSequence();
        }
      }
      // Appeler l'handler original pour les autres événements (CHAT, etc.)
      if (this.originalOnEvent) {
        this.originalOnEvent(code, data);
      }
    };

    const width = this.scale.width;
    const height = this.scale.height;

    // Créer la salle
    this.createRoom();
    this.createChairs();
    
    // Interface différente selon le rôle
    if (this.playerRole === "A") {
      this.createSymbolPanel(); // Joueur A voit les symboles
    } else {
      this.createButtonPanel(); // Joueur B entre la séquence
    }
    
    this.createSequenceDisplay();
    this.createDoor();
    this.createBackButton();

    // Message d'info adapté au rôle
    const infoMessage = this.playerRole === "A" 
      ? "Vous voyez la SÉQUENCE de 6 symboles. Dictez-la au Joueur B dans l'ordre !"
      : "Écoutez le Joueur A et cliquez sur les symboles dans l'ordre qu'il vous dicte !";
    
    const infoText = this.add.text(width / 2, height * 0.95, infoMessage, {
      fontSize: "14px",
      color: "#ffff00",
      backgroundColor: "#000000aa",
      padding: { x: 15, y: 10 },
      align: "center",
      wordWrap: { width: width * 0.85 }
    }).setOrigin(0.5).setDepth(1000);
  }

  private createRoom() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Sol
    const floor = this.add.rectangle(width / 2, height * 0.83, width, height * 0.33, 0x2c3e50);
    floor.setStrokeStyle(2, 0x34495e);

    // Murs
    const wallLeft = this.add.rectangle(width * 0.06, height / 2, width * 0.12, height, 0x1a252f);
    wallLeft.setStrokeStyle(2, 0x34495e);

    const wallRight = this.add.rectangle(width * 0.94, height / 2, width * 0.12, height, 0x1a252f);
    wallRight.setStrokeStyle(2, 0x34495e);

    // Plafond
    const ceiling = this.add.rectangle(width / 2, height * 0.08, width, height * 0.17, 0x16202b);
    ceiling.setStrokeStyle(2, 0x34495e);

    // Titre de la salle
    this.add.text(width / 2, height * 0.06, "SALLE D'ATTENTE", {
      fontSize: "28px",
      color: "#ecf0f1",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private createChairs() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Rangées de chaises - repositionnées de manière responsive
    const chairSize = Math.min(width, height) * 0.05;
    const chairSpacing = chairSize * 1.75;
    
    const leftGroupX = width * 0.25;
    const rightGroupX = width * 0.75;
    const row1Y = height * 0.22;
    const row2Y = height * 0.32;

    const chairPositions = [
      { x: leftGroupX - chairSpacing, y: row1Y }, { x: leftGroupX, y: row1Y }, { x: leftGroupX + chairSpacing, y: row1Y },
      { x: rightGroupX - chairSpacing, y: row1Y }, { x: rightGroupX, y: row1Y }, { x: rightGroupX + chairSpacing, y: row1Y },
      { x: leftGroupX - chairSpacing, y: row2Y }, { x: leftGroupX, y: row2Y }, { x: leftGroupX + chairSpacing, y: row2Y },
      { x: rightGroupX - chairSpacing, y: row2Y }, { x: rightGroupX, y: row2Y }, { x: rightGroupX + chairSpacing, y: row2Y },
    ];

    chairPositions.forEach(pos => {
      // Dossier
      const backrest = this.add.rectangle(pos.x, pos.y - chairSize * 0.375, chairSize, chairSize * 0.25, 0x7f8c8d);
      backrest.setStrokeStyle(1, 0x95a5a6);

      // Assise
      const seat = this.add.rectangle(pos.x, pos.y, chairSize, chairSize * 0.75, 0x95a5a6);
      seat.setStrokeStyle(1, 0xbdc3c7);

      // Pieds
      this.add.rectangle(pos.x - chairSize * 0.3, pos.y + chairSize * 0.5, chairSize * 0.075, chairSize * 0.25, 0x7f8c8d);
      this.add.rectangle(pos.x + chairSize * 0.3, pos.y + chairSize * 0.5, chairSize * 0.075, chairSize * 0.25, 0x7f8c8d);
    });

    // Table basse au centre (sans texte)
    const table = this.add.rectangle(width / 2, height * 0.275, width * 0.15, height * 0.12, 0x8b4513);
    table.setStrokeStyle(2, 0x654321);
  }

  private createSymbolPanel() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Panneau pour Joueur A - affiche la séquence de 6 symboles
    const panel = this.add.rectangle(width / 2, height * 0.63, width * 0.69, height * 0.47, 0x1a1a2e);
    panel.setStrokeStyle(4, 0xffd700);

    this.add.text(width / 2, height * 0.44, "SÉQUENCE À COMMUNIQUER - JOUEUR A", {
      fontSize: "22px",
      color: "#ffd700",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.49, "Communiquez cette séquence au Joueur B dans l'ordre :", {
      fontSize: "15px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Afficher la séquence de 6 symboles
    const symbolSize = Math.min(width, height) * 0.09;
    const symbolSpacing = width * 0.12;
    const startX = width / 2 - symbolSpacing * 2.5;

    const symbolMap: { [key: string]: { symbol: string, name: string, color: number } } = {
      "circle": { symbol: "●", name: "CERCLE", color: 0xff6b6b },
      "triangle": { symbol: "▲", name: "TRIANGLE", color: 0x6b6bff },
      "square": { symbol: "■", name: "CARRÉ", color: 0x6bff6b },
      "star": { symbol: "★", name: "ÉTOILE", color: 0xffff6b }
    };

    this.correctSequence.forEach((symbolKey, index) => {
      const data = symbolMap[symbolKey];
      const x = startX + index * symbolSpacing;

      // Numéro
      this.add.text(x, height * 0.56, `${index + 1}.`, {
        fontSize: "18px",
        color: "#ffffff",
        fontStyle: "bold"
      }).setOrigin(0.5);

      // Fond du symbole avec couleur
      const symbolBg = this.add.rectangle(x, height * 0.65, symbolSize, symbolSize, data.color);
      symbolBg.setStrokeStyle(3, 0xffffff);

      // Symbole
      this.add.text(x, height * 0.65, data.symbol, {
        fontSize: "40px",
        color: "#000000",
        fontStyle: "bold"
      }).setOrigin(0.5);

      // Nom
      this.add.text(x, height * 0.74, data.name, {
        fontSize: "11px",
        color: "#ffffff",
        fontStyle: "bold"
      }).setOrigin(0.5);
    });

    // Instructions
    this.add.text(width / 2, height * 0.82, "Dictez cette séquence au Joueur B. Il doit cliquer sur les symboles dans cet ordre !", {
      fontSize: "13px",
      color: "#ffaa00",
      fontStyle: "italic",
      align: "center",
      wordWrap: { width: width * 0.6 }
    }).setOrigin(0.5);
  }

  private createButtonPanel() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Panneau pour Joueur B - 4 boutons de symboles
    const panel = this.add.rectangle(width / 2, height * 0.65, width * 0.69, height * 0.5, 0x1a1a2e);
    panel.setStrokeStyle(4, 0x00d9ff);

    this.add.text(width / 2, height * 0.44, "PANNEAU DE CONTRÔLE - JOUEUR B", {
      fontSize: "22px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.49, "Écoutez le Joueur A et cliquez sur les symboles dans l'ordre !", {
      fontSize: "15px",
      color: "#ffffff"
    }).setOrigin(0.5);

    const buttonSize = Math.min(width, height) * 0.11;
    const buttonSpacing = width * 0.15;
    const startX = width / 2 - buttonSpacing * 1.5;

    // Bouton CERCLE
    this.circleButton = this.add.rectangle(startX, height * 0.67, buttonSize, buttonSize, 0xff6b6b);
    this.circleButton.setStrokeStyle(4, 0xff0000);
    this.circleButton.setInteractive({ useHandCursor: true });

    this.add.text(startX, height * 0.67, "●", {
      fontSize: "50px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(startX, height * 0.76, "CERCLE", {
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.circleButton.on("pointerdown", () => {
      this.pressButton("circle");
    });

    this.circleButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.circleButton?.setFillStyle(0xcc5555);
      }
    });

    this.circleButton.on("pointerout", () => {
      this.circleButton?.setFillStyle(0xff6b6b);
    });

    // Bouton TRIANGLE
    this.triangleButton = this.add.rectangle(startX + buttonSpacing, height * 0.67, buttonSize, buttonSize, 0x6b6bff);
    this.triangleButton.setStrokeStyle(4, 0x0000ff);
    this.triangleButton.setInteractive({ useHandCursor: true });

    this.add.text(startX + buttonSpacing, height * 0.67, "▲", {
      fontSize: "50px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(startX + buttonSpacing, height * 0.76, "TRIANGLE", {
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.triangleButton.on("pointerdown", () => {
      this.pressButton("triangle");
    });

    this.triangleButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.triangleButton?.setFillStyle(0x5555cc);
      }
    });

    this.triangleButton.on("pointerout", () => {
      this.triangleButton?.setFillStyle(0x6b6bff);
    });

    // Bouton CARRÉ
    this.squareButton = this.add.rectangle(startX + buttonSpacing * 2, height * 0.67, buttonSize, buttonSize, 0x6bff6b);
    this.squareButton.setStrokeStyle(4, 0x00ff00);
    this.squareButton.setInteractive({ useHandCursor: true });

    this.add.text(startX + buttonSpacing * 2, height * 0.67, "■", {
      fontSize: "50px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(startX + buttonSpacing * 2, height * 0.76, "CARRÉ", {
      fontSize: "14px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.squareButton.on("pointerdown", () => {
      this.pressButton("square");
    });

    this.squareButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.squareButton?.setFillStyle(0x55cc55);
      }
    });

    this.squareButton.on("pointerout", () => {
      this.squareButton?.setFillStyle(0x6bff6b);
    });

    // Bouton ÉTOILE
    this.starButton = this.add.rectangle(startX + buttonSpacing * 3, height * 0.67, buttonSize, buttonSize, 0xffff6b);
    this.starButton.setStrokeStyle(4, 0xffff00);
    this.starButton.setInteractive({ useHandCursor: true });

    this.add.text(startX + buttonSpacing * 3, height * 0.67, "★", {
      fontSize: "50px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(startX + buttonSpacing * 3, height * 0.76, "ÉTOILE", {
      fontSize: "14px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.starButton.on("pointerdown", () => {
      this.pressButton("star");
    });

    this.starButton.on("pointerover", () => {
      if (!this.puzzleSolved) {
        this.starButton?.setFillStyle(0xcccc55);
      }
    });

    this.starButton.on("pointerout", () => {
      this.starButton?.setFillStyle(0xffff6b);
    });

    // Bouton Reset
    const resetBtn = this.add.rectangle(width / 2, height * 0.85, width * 0.175, height * 0.075, 0xff6b6b);
    resetBtn.setStrokeStyle(3, 0xff0000);
    resetBtn.setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height * 0.85, "RÉINITIALISER", {
      fontSize: "15px",
      color: "#ffffff",
      fontStyle: "bold"
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
    const width = this.scale.width;
    const height = this.scale.height;

    // Affichage de la séquence en cours
    this.add.text(width / 2, height * 0.9, "Séquence en cours :", {
      fontSize: "16px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.sequenceDisplay = this.add.text(width / 2, height * 0.94, "Aucun bouton pressé", {
      fontSize: "18px",
      color: "#aaaaaa",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, height * 0.99, "", {
      fontSize: "15px",
      color: "#ffaa00"
    }).setOrigin(0.5);
  }

  private pressButton(symbol: string) {
    if (this.puzzleSolved) return;
    if (this.playerRole === "A") return; // Joueur A ne peut pas appuyer sur les boutons

    // Ajouter à la séquence
    this.currentSequence.push(symbol);

    // Envoyer l'événement réseau
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "BUTTON_PRESS_WAITING",
      color: symbol,
      step: this.currentSequence.length,
      player: this.playerRole
    });

    // Mettre à jour l'affichage
    this.updateSequenceDisplay();

    // Vérifier la séquence
    this.checkSequence();
  }

  private handleRemoteButtonPress(symbol: string, step: number) {
    // Joueur A reçoit les clics du Joueur B
    if (this.playerRole === "A") {
      this.currentSequence.push(symbol);
      this.updateSequenceDisplay();
      this.checkSequence();
    }
  }

  private updateSequenceDisplay() {
    const displayText = this.currentSequence.map(s => {
      if (s === "circle") return "●";
      if (s === "triangle") return "▲";
      if (s === "square") return "■";
      if (s === "star") return "★";
      return s;
    }).join(" ");

    this.sequenceDisplay?.setText(displayText || "Aucun symbole cliqué");
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

    const width = this.scale.width;
    const height = this.scale.height;

    // Animation d'alarme
    const alarm = this.add.rectangle(width / 2, height / 2, width, height, 0xff0000, 0.3);
    this.tweens.add({
      targets: alarm,
      alpha: 0,
      duration: 500,
      repeat: 3,
      onComplete: () => alarm.destroy()
    });

    // Envoyer la réinitialisation à l'autre joueur
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "SEQUENCE_RESET",
      player: this.playerRole
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
    // Éviter de résoudre plusieurs fois
    if (this.puzzleSolved) return;
    
    this.puzzleSolved = true;

    // Envoyer l'événement de résolution à l'autre joueur
    this.net.send(EVENT_CODES.PUZZLE_UPDATE, {
      type: "PUZZLE_SOLVED_WAITING",
      player: this.playerRole
    });

    this.statusText?.setText("✓ SÉQUENCE COMPLÈTE ! Porte déverrouillée.");
    this.statusText?.setColor("#00ff00");

    this.doorText?.setText("DÉVERROUILLÉE");
    this.doorText?.setColor("#00ff00");

    // Désactiver les boutons (seulement pour Joueur B)
    this.circleButton?.disableInteractive();
    this.triangleButton?.disableInteractive();
    this.squareButton?.disableInteractive();
    this.starButton?.disableInteractive();

    const width = this.scale.width;
    const height = this.scale.height;

    // Message de succès
    const successMsg = this.add.text(width / 2, height * 0.3, 
      "✓ PUZZLE RÉSOLU !\n\nExcellente coordination entre les joueurs.\nVous pouvez maintenant accéder à la sortie.", 
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
      scale: { from: 0.8, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 500
    });
  }

  private createDoor() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Porte vers ExitRoomScene
    const doorWidth = width * 0.11;
    const doorHeight = height * 0.23;
    const doorX = width * 0.875;
    const doorY = height * 0.2;

    const door = this.add.rectangle(doorX, doorY, doorWidth, doorHeight, 0x8b4513);
    door.setStrokeStyle(4, 0xff0000);

    const doorHandle = this.add.circle(doorX - doorWidth * 0.22, doorY, doorWidth * 0.11, 0xffd700);

    this.doorText = this.add.text(doorX, doorY, "VERROUILLÉE", {
      fontSize: "13px",
      color: "#ff0000",
      align: "center",
      wordWrap: { width: doorWidth * 0.9 }
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.puzzleSolved) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("ExitRoomScene", { net: this.net, story: this.story });
        });
      } else {
        const msg = this.add.text(doorX, doorY + doorHeight, "Porte verrouillée !\nRésolvez le puzzle.", {
          fontSize: "14px",
          color: "#ff6b6b",
          align: "center",
          backgroundColor: "#000000",
          padding: { x: 8, y: 5 }
        }).setOrigin(0.5).setDepth(2000);

        this.tweens.add({
          targets: msg,
          alpha: 0,
          duration: 2000,
          onComplete: () => msg.destroy()
        });
      }
    });
  }

  private createBackButton() {
    const width = this.scale.width;
    const height = this.scale.height;

    const backBtn = this.add.text(width * 0.06, height * 0.97, "← Retour Salle Serveur", {
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#555555",
      padding: { x: 12, y: 8 },
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(1000);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("ServerRoomScene", { net: this.net, story: this.story });
      });
    });

    backBtn.on("pointerover", () => {
      backBtn.setStyle({ backgroundColor: "#777777" });
    });

    backBtn.on("pointerout", () => {
      backBtn.setStyle({ backgroundColor: "#555555" });
    });
  }
}