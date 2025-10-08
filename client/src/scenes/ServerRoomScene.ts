import Phaser from "phaser";
import { Net } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";
import { EVENT_CODES } from "../net/photonClient";

export class ServerRoomScene extends Phaser.Scene {
  private net!: Net;
  private story!: Story;
  private originalOnEvent?: (code: number, data: any) => void;

  private encryptionKey: string = "";
  private hasReceivedKey: boolean = false;
  private isDecrypted: boolean = false;
  private doorUnlocked: boolean = false;

  private encryptedText: string = "8gF#2@kL9$4vT!xZ";
  private decryptedCode: string = "8417";

  private keyInputText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private codeInputText?: Phaser.GameObjects.Text;
  private doorText?: Phaser.GameObjects.Text;

  constructor() {
    super("ServerRoomScene");
  }

  create(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Sauvegarder l'event handler original
    this.originalOnEvent = this.net.onEvent;
    this.net.onEvent = (code, data) => {
      if (code === EVENT_CODES.PUZZLE_UPDATE) {
        // Recevoir la clé de chiffrement de Player B
        if (data.type === "ENCRYPTION_KEY") {
          this.encryptionKey = data.key;
          this.hasReceivedKey = true;
          this.statusText?.setText(`Clé reçue de votre partenaire : ${this.encryptionKey}`);
          this.statusText?.setColor("#00ff00");
        }
      }
      // Appeler l'handler original pour les autres événements (CHAT, etc.)
      if (this.originalOnEvent) {
        this.originalOnEvent(code, data);
      }
    };

    // Créer la salle
    this.createRoom();
    this.createServerRacks();
    this.createMainScreen();
    this.createKeyInput();
    this.createCodeInput();
    this.createDoor();
    this.createBackButton();

    // Message d'info
    const infoText = this.add.text(400, 550, 
      "Déchiffrez les données du serveur pour obtenir le code de la porte", 
      {
        fontSize: "16px",
        color: "#aaaaaa",
        align: "center",
        wordWrap: { width: 700 }
      }
    ).setOrigin(0.5);
  }

  private createRoom() {
    // Sol
    const floor = this.add.rectangle(400, 500, 800, 200, 0x1a1a2e);
    floor.setStrokeStyle(2, 0x16213e);

    // Murs
    const wallLeft = this.add.rectangle(50, 300, 100, 600, 0x0f3460);
    wallLeft.setStrokeStyle(2, 0x16213e);

    const wallRight = this.add.rectangle(750, 300, 100, 600, 0x0f3460);
    wallRight.setStrokeStyle(2, 0x16213e);

    // Plafond
    const ceiling = this.add.rectangle(400, 50, 800, 100, 0x0a2647);
    ceiling.setStrokeStyle(2, 0x16213e);

    // Titre de la salle
    this.add.text(400, 30, "SALLE SERVEUR", {
      fontSize: "28px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private createServerRacks() {
    // Rack de serveurs à gauche
    for (let i = 0; i < 4; i++) {
      const rack = this.add.rectangle(150, 150 + i * 80, 120, 70, 0x1e1e1e);
      rack.setStrokeStyle(2, 0x00ff00);

      // LEDs clignotantes
      for (let j = 0; j < 3; j++) {
        const led = this.add.circle(120 + j * 20, 150 + i * 80, 4, 0x00ff00);
        this.tweens.add({
          targets: led,
          alpha: 0.2,
          duration: 500 + Math.random() * 500,
          yoyo: true,
          repeat: -1
        });
      }

      // Label
      this.add.text(150, 150 + i * 80, `SERVER-${i + 1}`, {
        fontSize: "12px",
        color: "#00ff00"
      }).setOrigin(0.5);
    }

    // Rack de serveurs à droite
    for (let i = 0; i < 4; i++) {
      const rack = this.add.rectangle(650, 150 + i * 80, 120, 70, 0x1e1e1e);
      rack.setStrokeStyle(2, 0x00ff00);

      // LEDs clignotantes
      for (let j = 0; j < 3; j++) {
        const led = this.add.circle(620 + j * 20, 150 + i * 80, 4, 0x00ff00);
        this.tweens.add({
          targets: led,
          alpha: 0.2,
          duration: 500 + Math.random() * 500,
          yoyo: true,
          repeat: -1
        });
      }

      // Label
      this.add.text(650, 150 + i * 80, `SERVER-${i + 5}`, {
        fontSize: "12px",
        color: "#00ff00"
      }).setOrigin(0.5);
    }
  }

  private createMainScreen() {
    // Écran principal au centre
    const screen = this.add.rectangle(400, 200, 300, 200, 0x000000);
    screen.setStrokeStyle(3, 0x00d9ff);

    // Titre de l'écran
    this.add.text(400, 120, "TERMINAL PRINCIPAL", {
      fontSize: "18px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Chemin du fichier
    this.add.text(260, 140, "/data/keys/door.enc", {
      fontSize: "14px",
      color: "#00ff00"
    });

    // Texte chiffré
    const encryptedDisplay = this.add.text(400, 180, this.encryptedText, {
      fontSize: "20px",
      color: "#ff0000",
      fontStyle: "bold",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    // Animation de scintillement
    this.tweens.add({
      targets: encryptedDisplay,
      alpha: 0.5,
      duration: 300,
      yoyo: true,
      repeat: -1
    });

    // Texte d'état
    this.statusText = this.add.text(400, 220, "En attente de la clé de déchiffrement...", {
      fontSize: "14px",
      color: "#ffaa00",
      align: "center",
      wordWrap: { width: 280 }
    }).setOrigin(0.5);

    // Note explicative
    this.add.text(400, 260, "Fichier chiffré détecté", {
      fontSize: "12px",
      color: "#888888",
      fontStyle: "italic"
    }).setOrigin(0.5);
  }

  private createKeyInput() {
    // Zone de saisie de la clé
    const inputBox = this.add.rectangle(400, 340, 300, 50, 0x1a1a2e);
    inputBox.setStrokeStyle(2, 0x00d9ff);
    inputBox.setInteractive({ useHandCursor: true });

    this.add.text(400, 310, "Entrez la clé de déchiffrement :", {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.keyInputText = this.add.text(400, 340, "", {
      fontSize: "18px",
      color: "#00ff00",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    // Clavier virtuel simplifié
    const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let keyX = 150;
    let keyY = 390;
    
    for (let i = 0; i < keyboard.length; i++) {
      const char = keyboard[i];
      const keyBtn = this.add.rectangle(keyX, keyY, 30, 30, 0x0f3460);
      keyBtn.setStrokeStyle(1, 0x00d9ff);
      keyBtn.setInteractive({ useHandCursor: true });

      const keyText = this.add.text(keyX, keyY, char, {
        fontSize: "14px",
        color: "#ffffff"
      }).setOrigin(0.5);

      keyBtn.on("pointerdown", () => {
        if (!this.isDecrypted && this.keyInputText) {
          const currentText = this.keyInputText.text;
          if (currentText.length < 10) {
            this.keyInputText.setText(currentText + char);
          }
        }
      });

      keyBtn.on("pointerover", () => {
        keyBtn.setFillStyle(0x16213e);
      });

      keyBtn.on("pointerout", () => {
        keyBtn.setFillStyle(0x0f3460);
      });

      keyX += 35;
      if ((i + 1) % 13 === 0) {
        keyX = 150;
        keyY += 35;
      }
    }

    // Bouton Effacer
    const clearBtn = this.add.rectangle(250, 470, 80, 30, 0xff6b6b);
    clearBtn.setStrokeStyle(2, 0xff0000);
    clearBtn.setInteractive({ useHandCursor: true });

    this.add.text(250, 470, "EFFACER", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    clearBtn.on("pointerdown", () => {
      if (this.keyInputText && !this.isDecrypted) {
        this.keyInputText.setText("");
      }
    });

    clearBtn.on("pointerover", () => {
      clearBtn.setFillStyle(0xff5252);
    });

    clearBtn.on("pointerout", () => {
      clearBtn.setFillStyle(0xff6b6b);
    });

    // Bouton Valider
    const validateBtn = this.add.rectangle(550, 470, 80, 30, 0x4ecdc4);
    validateBtn.setStrokeStyle(2, 0x00d9ff);
    validateBtn.setInteractive({ useHandCursor: true });

    this.add.text(550, 470, "VALIDER", {
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5);

    validateBtn.on("pointerdown", () => {
      this.validateKey();
    });

    validateBtn.on("pointerover", () => {
      validateBtn.setFillStyle(0x3db8af);
    });

    validateBtn.on("pointerout", () => {
      validateBtn.setFillStyle(0x4ecdc4);
    });
  }

  private validateKey() {
    if (!this.keyInputText || this.isDecrypted) return;

    const enteredKey = this.keyInputText.text;

    if (enteredKey === this.encryptionKey && this.hasReceivedKey) {
      // Clé correcte !
      this.isDecrypted = true;
      this.statusText?.setText("✓ Déchiffrement réussi !");
      this.statusText?.setColor("#00ff00");

      // Afficher le code déchiffré
      const decryptedDisplay = this.add.text(400, 180, this.decryptedCode, {
        fontSize: "32px",
        color: "#00ff00",
        fontStyle: "bold",
        fontFamily: "monospace"
      }).setOrigin(0.5);

      // Animation d'apparition
      decryptedDisplay.setAlpha(0);
      this.tweens.add({
        targets: decryptedDisplay,
        alpha: 1,
        duration: 500
      });

      // Message
      this.add.text(400, 220, "Code d'accès obtenu : entrez-le ci-dessous", {
        fontSize: "14px",
        color: "#00ff00"
      }).setOrigin(0.5);

    } else if (!this.hasReceivedKey) {
      this.statusText?.setText("❌ Vous n'avez pas encore reçu la clé !");
      this.statusText?.setColor("#ff0000");
    } else {
      this.statusText?.setText("❌ Clé incorrecte !");
      this.statusText?.setColor("#ff0000");
      this.keyInputText.setText("");
    }
  }

  private createCodeInput() {
    // Zone de saisie du code (visible après déchiffrement)
    const codeBox = this.add.rectangle(400, 520, 200, 40, 0x1a1a2e);
    codeBox.setStrokeStyle(2, 0x00d9ff);
    codeBox.setInteractive({ useHandCursor: true });

    this.add.text(400, 495, "Code de la porte :", {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.codeInputText = this.add.text(400, 520, "", {
      fontSize: "20px",
      color: "#00ff00",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    // Pavé numérique
    const numpad = "123456789C0V";
    let numX = 320;
    let numY = 560;

    for (let i = 0; i < numpad.length; i++) {
      const char = numpad[i];
      const numBtn = this.add.rectangle(numX, numY, 35, 35, 0x0f3460);
      numBtn.setStrokeStyle(1, 0x00d9ff);
      numBtn.setInteractive({ useHandCursor: true });

      let displayChar = char;
      if (char === "C") displayChar = "←";
      if (char === "V") displayChar = "✓";

      const numText = this.add.text(numX, numY, displayChar, {
        fontSize: "16px",
        color: "#ffffff"
      }).setOrigin(0.5);

      numBtn.on("pointerdown", () => {
        if (!this.doorUnlocked && this.codeInputText) {
          if (char === "C") {
            // Effacer
            this.codeInputText.setText("");
          } else if (char === "V") {
            // Valider
            this.validateCode();
          } else {
            // Ajouter chiffre
            const currentCode = this.codeInputText.text;
            if (currentCode.length < 4) {
              this.codeInputText.setText(currentCode + char);
            }
          }
        }
      });

      numBtn.on("pointerover", () => {
        numBtn.setFillStyle(0x16213e);
      });

      numBtn.on("pointerout", () => {
        numBtn.setFillStyle(0x0f3460);
      });

      numX += 40;
      if ((i + 1) % 3 === 0) {
        numX = 320;
        numY += 40;
      }
    }
  }

  private validateCode() {
    if (!this.codeInputText || this.doorUnlocked || !this.isDecrypted) return;

    const enteredCode = this.codeInputText.text;

    if (enteredCode === this.decryptedCode) {
      // Code correct !
      this.doorUnlocked = true;
      this.codeInputText.setColor("#00ff00");
      
      this.doorText?.setText("PORTE DÉVERROUILLÉE");
      this.doorText?.setColor("#00ff00");

      // Son de succès (visuel)
      const successMsg = this.add.text(400, 300, "✓ ACCÈS AUTORISÉ", {
        fontSize: "24px",
        color: "#00ff00",
        fontStyle: "bold"
      }).setOrigin(0.5);

      this.tweens.add({
        targets: successMsg,
        alpha: 0,
        y: 250,
        duration: 2000,
        onComplete: () => successMsg.destroy()
      });

    } else {
      // Code incorrect
      this.codeInputText.setColor("#ff0000");
      this.codeInputText.setText("");

      const errorMsg = this.add.text(400, 300, "❌ CODE INCORRECT", {
        fontSize: "20px",
        color: "#ff0000",
        fontStyle: "bold"
      }).setOrigin(0.5);

      this.tweens.add({
        targets: errorMsg,
        alpha: 0,
        duration: 1500,
        onComplete: () => errorMsg.destroy()
      });
    }
  }

  private createDoor() {
    // Porte vers WaitingRoomScene (en haut à droite)
    const door = this.add.rectangle(700, 150, 80, 120, 0x8b4513);
    door.setStrokeStyle(3, 0xff0000);

    const doorHandle = this.add.circle(680, 150, 8, 0xffd700);

    this.doorText = this.add.text(700, 150, "VERROUILLÉE", {
      fontSize: "12px",
      color: "#ff0000",
      align: "center",
      wordWrap: { width: 70 }
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.doorUnlocked) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("WaitingRoomScene", { net: this.net, story: this.story });
        });
      } else {
        const msg = this.add.text(700, 200, "Porte verrouillée !\nEntrez le code.", {
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
      if (this.doorUnlocked) {
        door.setStrokeStyle(3, 0x00ff00);
      }
    });

    door.on("pointerout", () => {
      if (this.doorUnlocked) {
        door.setStrokeStyle(3, 0x00ff00);
      } else {
        door.setStrokeStyle(3, 0xff0000);
      }
    });
  }

  private createBackButton() {
    const backBtn = this.add.rectangle(50, 550, 80, 40, 0x444444);
    backBtn.setStrokeStyle(2, 0x888888);
    backBtn.setInteractive({ useHandCursor: true });

    this.add.text(50, 550, "← RETOUR", {
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("PatientRoomScene", { net: this.net, story: this.story });
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