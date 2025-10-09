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
        if (data.type === "encryption_key_sent") {
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

    // Obtenir les dimensions de l'écran
    const width = this.scale.width;
    const height = this.scale.height;

    // Créer la salle
    this.createRoom(width, height);
    this.createServerRacks(width, height);
    this.createMainScreen(width, height);
    this.createKeyInput(width, height);
    this.createCodeInput(width, height);
    this.createDoor(width, height);
    this.createBackButton(width, height);

    // Message d'info - adapté à la taille
    const infoText = this.add.text(width / 2, height - 35, 
      "Déchiffrez les données du serveur pour obtenir le code de la porte", 
      {
        fontSize: "16px",
        color: "#ffff00",
        backgroundColor: "#000000aa",
        padding: { x: 15, y: 8 },
        align: "center",
        wordWrap: { width: width * 0.8 }
      }
    ).setOrigin(0.5);
  }

  private createRoom(width: number, height: number) {
    // Sol
    const floor = this.add.rectangle(width / 2, height * 0.85, width, height * 0.3, 0x1a1a2e);
    floor.setStrokeStyle(2, 0x16213e);

    // Murs
    const wallLeft = this.add.rectangle(width * 0.05, height / 2, width * 0.1, height, 0x0f3460);
    wallLeft.setStrokeStyle(2, 0x16213e);

    const wallRight = this.add.rectangle(width * 0.95, height / 2, width * 0.1, height, 0x0f3460);
    wallRight.setStrokeStyle(2, 0x16213e);

    // Plafond
    const ceiling = this.add.rectangle(width / 2, height * 0.08, width, height * 0.16, 0x0a2647);
    ceiling.setStrokeStyle(2, 0x16213e);

    // Titre de la salle
    this.add.text(width / 2, 30, "SALLE SERVEUR", {
      fontSize: "28px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private createServerRacks(width: number, height: number) {
    // Rack de serveurs à gauche
    const leftX = width * 0.15;
    const startY = height * 0.2;
    const spacing = height * 0.12;
    
    for (let i = 0; i < 4; i++) {
      const rack = this.add.rectangle(leftX, startY + i * spacing, width * 0.15, height * 0.1, 0x1e1e1e);
      rack.setStrokeStyle(2, 0x00ff00);

      // LEDs clignotantes
      for (let j = 0; j < 3; j++) {
        const led = this.add.circle(leftX - width * 0.04 + j * 20, startY + i * spacing, 4, 0x00ff00);
        this.tweens.add({
          targets: led,
          alpha: 0.2,
          duration: 500 + Math.random() * 500,
          yoyo: true,
          repeat: -1
        });
      }

      // Label
      this.add.text(leftX, startY + i * spacing, `SERVER-${i + 1}`, {
        fontSize: "12px",
        color: "#00ff00"
      }).setOrigin(0.5);
    }

    // Rack de serveurs à droite
    const rightX = width * 0.85;
    
    for (let i = 0; i < 4; i++) {
      const rack = this.add.rectangle(rightX, startY + i * spacing, width * 0.15, height * 0.1, 0x1e1e1e);
      rack.setStrokeStyle(2, 0x00ff00);

      // LEDs clignotantes
      for (let j = 0; j < 3; j++) {
        const led = this.add.circle(rightX - width * 0.04 + j * 20, startY + i * spacing, 4, 0x00ff00);
        this.tweens.add({
          targets: led,
          alpha: 0.2,
          duration: 500 + Math.random() * 500,
          yoyo: true,
          repeat: -1
        });
      }

      // Label
      this.add.text(rightX, startY + i * spacing, `SERVER-${i + 5}`, {
        fontSize: "12px",
        color: "#00ff00"
      }).setOrigin(0.5);
    }
  }

  private createMainScreen(width: number, height: number) {
    // Écran principal au centre
    const centerX = width / 2;
    const screenY = height * 0.18;
    
    const screen = this.add.rectangle(centerX, screenY, width * 0.4, height * 0.25, 0x000000);
    screen.setStrokeStyle(4, 0x00d9ff);

    // Titre de l'écran
    this.add.text(centerX, height * 0.08, "TERMINAL PRINCIPAL", {
      fontSize: "20px",
      color: "#00d9ff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Chemin du fichier
    this.add.text(centerX - width * 0.18, height * 0.12, "/data/keys/door.enc", {
      fontSize: "15px",
      color: "#00ff00"
    });

    // Texte chiffré
    const encryptedDisplay = this.add.text(centerX, screenY - height * 0.02, this.encryptedText, {
      fontSize: "22px",
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
    this.statusText = this.add.text(centerX, screenY + height * 0.05, "En attente de la clé de déchiffrement...", {
      fontSize: "15px",
      color: "#ffaa00",
      align: "center",
      wordWrap: { width: width * 0.35 }
    }).setOrigin(0.5);

    // Note explicative
    this.add.text(centerX, screenY + height * 0.11, "Fichier chiffré détecté", {
      fontSize: "13px",
      color: "#888888",
      fontStyle: "italic"
    }).setOrigin(0.5);
  }

  private createKeyInput(width: number, height: number) {
    // Zone de saisie de la clé
    const centerX = width / 2;
    const inputY = height * 0.38;
    
    const inputBox = this.add.rectangle(centerX, inputY, width * 0.4, height * 0.08, 0x1a1a2e);
    inputBox.setStrokeStyle(3, 0x00d9ff);
    inputBox.setInteractive({ useHandCursor: true });

    this.add.text(centerX, inputY - height * 0.05, "Entrez la clé de déchiffrement :", {
      fontSize: "15px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.keyInputText = this.add.text(centerX, inputY, "", {
      fontSize: "20px",
      color: "#00ff00",
      fontFamily: "monospace"
    }).setOrigin(0.5);

    // Clavier virtuel simplifié
    const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const keySize = Math.min(width * 0.04, 34);
    const keySpacing = keySize + 8;
    const keysPerRow = 13;
    const startX = centerX - (keysPerRow * keySpacing) / 2 + keySpacing / 2;
    let keyX = startX;
    let keyY = height * 0.48;
    
    for (let i = 0; i < keyboard.length; i++) {
      const char = keyboard[i];
      const keyBtn = this.add.rectangle(keyX, keyY, keySize, keySize, 0x0f3460);
      keyBtn.setStrokeStyle(2, 0x00d9ff);
      keyBtn.setInteractive({ useHandCursor: true });

      const keyText = this.add.text(keyX, keyY, char, {
        fontSize: "15px",
        color: "#ffffff",
        fontStyle: "bold"
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

      keyX += keySpacing;
      if ((i + 1) % keysPerRow === 0) {
        keyX = startX;
        keyY += keySpacing;
      }
    }

    // Bouton Effacer
    const btnY = height * 0.62;
    const clearBtn = this.add.rectangle(centerX - width * 0.15, btnY, width * 0.12, height * 0.06, 0xff6b6b);
    clearBtn.setStrokeStyle(3, 0xff0000);
    clearBtn.setInteractive({ useHandCursor: true });

    this.add.text(centerX - width * 0.15, btnY, "EFFACER", {
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
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
    const validateBtn = this.add.rectangle(centerX + width * 0.15, btnY, width * 0.12, height * 0.06, 0x4ecdc4);
    validateBtn.setStrokeStyle(3, 0x00d9ff);
    validateBtn.setInteractive({ useHandCursor: true });

    this.add.text(centerX + width * 0.15, btnY, "VALIDER", {
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
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
    const width = this.scale.width;
    const height = this.scale.height;

    if (enteredKey === this.encryptionKey && this.hasReceivedKey) {
      // Clé correcte !
      this.isDecrypted = true;
      this.statusText?.setText("✓ Déchiffrement réussi !");
      this.statusText?.setColor("#00ff00");

      // Afficher le code déchiffré sous le texte chiffré (dans l'écran principal)
      const screenY = height * 0.18;
      const decryptedDisplay = this.add.text(width / 2, screenY + height * 0.05, this.decryptedCode, {
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

      // Message sous le code déchiffré
      this.add.text(width / 2, screenY + height * 0.1, "Code d'accès obtenu : entrez-le ci-dessous", {
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

  private createCodeInput(width: number, height: number) {
    // Zone de saisie du code (visible après déchiffrement)
    const centerX = width / 2;
    const codeY = height * 0.72;
    
    const codeBox = this.add.rectangle(centerX, codeY, width * 0.28, height * 0.08, 0x1a1a2e);
    codeBox.setStrokeStyle(3, 0x00d9ff);
    codeBox.setInteractive({ useHandCursor: true });

    this.add.text(centerX, codeY - height * 0.04, "Code de la porte :", {
      fontSize: "15px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.codeInputText = this.add.text(centerX, codeY, "", {
      fontSize: "24px",
      color: "#00ff00",
      fontFamily: "monospace",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Pavé numérique
    const numpad = "123456789C0V";
    const numSize = Math.min(width * 0.05, 42);
    const numSpacing = numSize + 8;
    const startX = centerX - numSpacing * 1.5 + numSpacing / 2;
    let numX = startX;
    let numY = height * 0.81;

    for (let i = 0; i < numpad.length; i++) {
      const char = numpad[i];
      const numBtn = this.add.rectangle(numX, numY, numSize, numSize, 0x0f3460);
      numBtn.setStrokeStyle(2, 0x00d9ff);
      numBtn.setInteractive({ useHandCursor: true });

      let displayChar = char;
      if (char === "C") displayChar = "←";
      if (char === "V") displayChar = "✓";

      const numText = this.add.text(numX, numY, displayChar, {
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold"
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

      numX += numSpacing;
      if ((i + 1) % 3 === 0) {
        numX = startX;
        numY += numSpacing;
      }
    }
  }

  private validateCode() {
    if (!this.codeInputText || this.doorUnlocked || !this.isDecrypted) return;

    const enteredCode = this.codeInputText.text;
    const width = this.scale.width;
    const height = this.scale.height;

    if (enteredCode === this.decryptedCode) {
      // Code correct !
      this.doorUnlocked = true;
      this.codeInputText.setColor("#00ff00");
      
      this.doorText?.setText("PORTE DÉVERROUILLÉE");
      this.doorText?.setColor("#00ff00");

      // Son de succès (visuel)
      const successMsg = this.add.text(width / 2, height * 0.5, "✓ ACCÈS AUTORISÉ", {
        fontSize: "24px",
        color: "#00ff00",
        fontStyle: "bold"
      }).setOrigin(0.5);

      this.tweens.add({
        targets: successMsg,
        alpha: 0,
        y: height * 0.42,
        duration: 2000,
        onComplete: () => successMsg.destroy()
      });

    } else {
      // Code incorrect
      this.codeInputText.setColor("#ff0000");
      this.codeInputText.setText("");

      const errorMsg = this.add.text(width / 2, height * 0.5, "❌ CODE INCORRECT", {
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

  private createDoor(width: number, height: number) {
    // Porte vers WaitingRoomScene (en haut à droite)
    const doorX = width * 0.88;
    const doorY = height * 0.25;
    const doorWidth = Math.min(width * 0.1, 80);
    const doorHeight = Math.min(height * 0.2, 120);
    
    const door = this.add.rectangle(doorX, doorY, doorWidth, doorHeight, 0x8b4513);
    door.setStrokeStyle(3, 0xff0000);

    const doorHandle = this.add.circle(doorX - doorWidth * 0.25, doorY, 8, 0xffd700);

    this.doorText = this.add.text(doorX, doorY, "VERROUILLÉE", {
      fontSize: "12px",
      color: "#ff0000",
      align: "center",
      wordWrap: { width: doorWidth - 10 }
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.doorUnlocked) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("WaitingRoomScene", { net: this.net, story: this.story });
        });
      } else {
        const msg = this.add.text(doorX, doorY + doorHeight * 0.6, "Porte verrouillée !\nEntrez le code.", {
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

  private createBackButton(width: number, height: number) {
    const btnX = width * 0.08;
    const btnY = height * 0.92;
    const btnWidth = Math.min(width * 0.1, 80);
    const btnHeight = Math.min(height * 0.07, 40);
    
    const backBtn = this.add.rectangle(btnX, btnY, btnWidth, btnHeight, 0x444444);
    backBtn.setStrokeStyle(2, 0x888888);
    backBtn.setInteractive({ useHandCursor: true });

    this.add.text(btnX, btnY, "← RETOUR", {
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