import Phaser from "phaser";
import { Net, EVENT_CODES } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";

export class HospitalRoomScene extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private inventory: Phaser.GameObjects.Container[] = [];
  private inventoryBar: Phaser.GameObjects.Container | null = null;
  private gameState: GameState = GameState.getInstance();

  constructor() {
    super({ key: "HospitalRoomScene" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
    
    // Setup network event listener
    if (this.net) {
      // Sauvegarder le gestionnaire d'événements original (défini dans main.ts)
      const originalOnEvent = this.net.onEvent;
      
      this.net.onEvent = (code: number, data: any) => {
        console.log("Scene received event:", code, data);
        
        // Gérer les événements spécifiques à cette scène
        if (code === EVENT_CODES.ITEM_PICKED) {
          console.log("ITEM_PICKED event received:", data);
          this.onItemPickedByOther(data);
        } else if (code === EVENT_CODES.PUZZLE_UPDATE && data.type === "box_unlock") {
          console.log("Box unlock event received");
          this.gameState.boxUnlocked = true;
        }
        
        // Appeler le gestionnaire original pour les autres événements (CHAT, START, etc.)
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

    // ===== SALLE D'HÔPITAL (VUE DE DESSUS) =====
    this.createRoom(width, height);

    // ===== PORTES =====
    this.createDoors(width, height);

    // ===== PANNEAUX INTERACTIFS =====
    this.createRoomNumberSign(width, height);
    this.createClock(width, height);

    // ===== OBJETS INTERACTIFS =====
    this.createWalkieTalkie(width, height);
    this.createBox(width, height);

    // ===== INVENTAIRE =====
    this.createInventoryBar(width, height);
    
    // Restaurer l'inventaire depuis le GameState
    this.restoreInventory();

    // ===== CONTRÔLES =====
    this.setupControls();
  }

  update() {
    // Pas de joueur à déplacer
  }

  private createRoom(width: number, height: number) {
    // Sol de la salle
    const floor = this.add.rectangle(width / 2, height / 2, 800, 600, 0xe8f4f8);
    floor.setStrokeStyle(4, 0x999999);

    // Murs
    const wallThickness = 20;
    
    // Mur haut
    const topWall = this.add.rectangle(width / 2, height / 2 - 300, 800, wallThickness, 0xcccccc);
    topWall.setStrokeStyle(2, 0x888888);

    // Mur bas
    const bottomWall = this.add.rectangle(width / 2, height / 2 + 300, 800, wallThickness, 0xcccccc);
    bottomWall.setStrokeStyle(2, 0x888888);

    // Mur gauche
    const leftWall = this.add.rectangle(width / 2 - 400, height / 2, wallThickness, 600, 0xcccccc);
    leftWall.setStrokeStyle(2, 0x888888);

    // Mur droit
    const rightWall = this.add.rectangle(width / 2 + 400, height / 2, wallThickness, 600, 0xcccccc);
    rightWall.setStrokeStyle(2, 0x888888);

    // Détails de la salle
    // Lit d'hôpital
    const bed = this.add.rectangle(width / 2 - 200, height / 2 - 150, 120, 200, 0xffffff);
    bed.setStrokeStyle(3, 0x666666);
    const pillow = this.add.rectangle(width / 2 - 200, height / 2 - 220, 100, 60, 0xdddddd);
    pillow.setStrokeStyle(2, 0x999999);

    // Table médicale
    const table = this.add.rectangle(width / 2 + 200, height / 2 - 100, 100, 80, 0xaaaaaa);
    table.setStrokeStyle(2, 0x666666);

    // Texte de la salle
    this.add.text(width / 2, 50, "Salle d'hôpital - Cliquez sur les objets pour interagir", {
      fontSize: "20px",
      color: "#333333",
      fontStyle: "bold",
    }).setOrigin(0.5);
  }

  private createFadeIn() {
    const { width, height } = this.scale;
    const fadeOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
    fadeOverlay.setDepth(10000);
    
    this.tweens.add({
      targets: fadeOverlay,
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        fadeOverlay.destroy();
      }
    });
  }

  private createRoomNumberSign(width: number, height: number) {
    // Panneau avec numéro de salle sur le mur gauche
    const signX = width / 2 - 350;
    const signY = height / 2 - 200;

    const container = this.add.container(signX, signY);

    // Fond du panneau
    const bg = this.add.rectangle(0, 0, 60, 40, 0xffffff);
    bg.setStrokeStyle(2, 0x333333);

    // Texte "Salle"
    const labelText = this.add.text(0, -10, "Salle", {
      fontSize: "10px",
      color: "#666666",
    }).setOrigin(0.5);

    // Numéro
    const numberText = this.add.text(0, 8, "12", {
      fontSize: "20px",
      color: "#000000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    container.add([bg, labelText, numberText]);
    container.setSize(60, 40);
    container.setInteractive({ useHandCursor: true });

    container.on("pointerover", () => {
      container.setScale(1.1);
      bg.setFillStyle(0xf0f0f0);
    });

    container.on("pointerout", () => {
      container.setScale(1);
      bg.setFillStyle(0xffffff);
    });

    container.on("pointerdown", () => {
      this.showInfoOverlay("Numéro de salle", "Cette salle porte le numéro 12.");
    });
  }

  private createClock(width: number, height: number) {
    // Horloge sur le mur droit
    const clockX = width / 2 + 350;
    const clockY = height / 2 - 200;

    const container = this.add.container(clockX, clockY);

    // Cadre de l'horloge
    const frame = this.add.circle(0, 0, 35, 0xffffff);
    frame.setStrokeStyle(3, 0x333333);

    // Cadran
    const face = this.add.circle(0, 0, 30, 0xf5f5f5);

    // Aiguille des heures (pointant vers 4)
    const hourHand = this.add.rectangle(5, -2, 15, 3, 0x333333);
    hourHand.setOrigin(0, 0.5);
    hourHand.setAngle(120); // 4 heures = 120 degrés

    // Aiguille des minutes (pointant vers 11, soit 55 minutes)
    const minuteHand = this.add.rectangle(8, -1, 20, 2, 0x666666);
    minuteHand.setOrigin(0, 0.5);
    minuteHand.setAngle(330); // 55 minutes = 330 degrés

    // Centre
    const center = this.add.circle(0, 0, 3, 0x000000);

    // Label
    const label = this.add.text(0, 55, "Horloge", {
      fontSize: "10px",
      color: "#333333",
    }).setOrigin(0.5);

    container.add([frame, face, hourHand, minuteHand, center, label]);
    container.setSize(80, 80);
    container.setInteractive({ useHandCursor: true });

    container.on("pointerover", () => {
      container.setScale(1.1);
      frame.setFillStyle(0xf0f0f0);
    });

    container.on("pointerout", () => {
      container.setScale(1);
      frame.setFillStyle(0xffffff);
    });

    container.on("pointerdown", () => {
      this.showInfoOverlay("Horloge murale", "L'horloge indique 04:55.");
    });
  }

  private showInfoOverlay(title: string, message: string) {
    const { width, height } = this.scale;

    // Fond semi-transparent
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setDepth(1000);
    overlay.setInteractive();

    // Boîte d'info
    const infoBox = this.add.rectangle(width / 2, height / 2, 500, 300, 0x1a1a2e);
    infoBox.setStrokeStyle(4, 0x16213e);
    infoBox.setDepth(1001);

    // Titre
    const titleText = this.add.text(width / 2, height / 2 - 100, title, {
      fontSize: "24px",
      color: "#00ff00",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(1002);

    // Message
    const messageText = this.add.text(width / 2, height / 2, message, {
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: 450 },
      align: "center",
    }).setOrigin(0.5).setDepth(1002);

    // Bouton Fermer
    const closeBtn = this.add.rectangle(width / 2, height / 2 + 100, 150, 50, 0x0f3460);
    closeBtn.setStrokeStyle(2, 0x16213e);
    closeBtn.setDepth(1002);
    closeBtn.setInteractive({ useHandCursor: true });

    const closeBtnText = this.add.text(width / 2, height / 2 + 100, "Fermer", {
      fontSize: "18px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1003);

    closeBtn.on("pointerover", () => {
      closeBtn.setFillStyle(0x16213e);
    });

    closeBtn.on("pointerout", () => {
      closeBtn.setFillStyle(0x0f3460);
    });

    closeBtn.on("pointerdown", () => {
      overlay.destroy();
      infoBox.destroy();
      titleText.destroy();
      messageText.destroy();
      closeBtn.destroy();
      closeBtnText.destroy();
    });
  }

  private createDoors(width: number, height: number) {
    // Porte Nord (vers le couloir)
    const northDoor = this.add.rectangle(width / 2, height / 2 - 300, 80, 20, 0x8b4513);
    northDoor.setStrokeStyle(2, 0x654321);
    northDoor.setInteractive({ useHandCursor: true });
    
    const northDoorLabel = this.add.text(width / 2, height / 2 - 330, "Couloir", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5);

    northDoor.on("pointerover", () => {
      northDoor.setFillStyle(0xa0522d);
    });

    northDoor.on("pointerout", () => {
      northDoor.setFillStyle(0x8b4513);
    });

    northDoor.on("pointerdown", () => {
      this.changeRoom("CorridorSceneA");
    });

    // Porte Est (vers la salle informatique)
    const eastDoor = this.add.rectangle(width / 2 + 400, height / 2, 20, 80, 0x8b4513);
    eastDoor.setStrokeStyle(2, 0x654321);
    eastDoor.setInteractive({ useHandCursor: true });
    
    const eastDoorLabel = this.add.text(width / 2 + 450, height / 2, "Salle Info", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5);

    eastDoor.on("pointerover", () => {
      eastDoor.setFillStyle(0xa0522d);
    });

    eastDoor.on("pointerout", () => {
      eastDoor.setFillStyle(0x8b4513);
    });

    eastDoor.on("pointerdown", () => {
      // Vérifier si le joueur a le badge dans son inventaire
      const hasBadge = this.gameState.hasItem("badge");

      if (hasBadge) {
        this.changeRoom("ComputerRoomSceneB");
      } else {
        // Afficher un message d'erreur
        const errorText = this.add.text(width / 2, height / 2, "Accès refusé !\nVous avez besoin d'un badge.", {
          fontSize: "20px",
          color: "#ff0000",
          backgroundColor: "#000000",
          padding: { x: 15, y: 10 },
          align: "center",
        }).setOrigin(0.5).setDepth(2000);

        this.time.delayedCall(2000, () => {
          errorText.destroy();
        });
      }
    });
  }

  private changeRoom(sceneName: string) {
    // Lancer la nouvelle scène
    this.scene.start(sceneName, { net: this.net, story: this.story });
  }

  private createWalkieTalkie(width: number, height: number) {
    // Talkie-walkie posé sur une table
    const walkieTalkieX = width / 2 - 250;
    const walkieTalkieY = height / 2 + 200;

    const container = this.add.container(walkieTalkieX, walkieTalkieY);

    // Corps du talkie
    const body = this.add.rectangle(0, 0, 40, 80, 0x333333);
    body.setStrokeStyle(2, 0x000000);

    // Antenne
    const antenna = this.add.rectangle(0, -50, 4, 30, 0x666666);

    // Écran LCD
    const screen = this.add.rectangle(0, -15, 30, 20, 0x00ff00);

    // Boutons
    const button1 = this.add.circle(0, 15, 5, 0xff0000);
    const button2 = this.add.circle(0, 30, 5, 0x0000ff);

    // Label
    const label = this.add.text(0, 60, "Talkie", {
      fontSize: "12px",
      color: "#333333",
    }).setOrigin(0.5);

    container.add([body, antenna, screen, button1, button2, label]);
    container.setSize(60, 100);
    container.setInteractive({ useHandCursor: true });

    // Interactions
    container.on("pointerover", () => {
      container.setScale(1.1);
      body.setFillStyle(0x444444);
    });

    container.on("pointerout", () => {
      container.setScale(1);
      body.setFillStyle(0x333333);
    });

    container.on("pointerdown", () => {
      this.showWalkieTalkieDialogue();
    });
  }

  private showWalkieTalkieDialogue() {
    // Message du talkie-walkie avec les consignes
    const dialogueText = "📻 *Grésillements*\n\n" +
                         "\"Écoute-moi bien... Tu dois sortir de cette salle.\n" +
                         "Il y a une boîte verrouillée quelque part.\n" +
                         "Cherche des indices dans la pièce pour trouver le code.\n" +
                         "Le code est composé de 6 chiffres.\n" +
                         "Regarde autour de toi... tout a un sens.\"\n\n" +
                         "*La communication se coupe*";

    this.showDialogueOverlay(dialogueText);
  }

  private showDialogueOverlay(text: string) {
    const { width, height } = this.scale;

    // Fond semi-transparent
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setDepth(1000);
    overlay.setInteractive();

    // Boîte de dialogue
    const dialogBox = this.add.rectangle(width / 2, height / 2, 700, 400, 0x1a1a2e);
    dialogBox.setStrokeStyle(4, 0x16213e);
    dialogBox.setDepth(1001);

    // Titre
    const title = this.add.text(width / 2, height / 2 - 170, "📻 Talkie-walkie", {
      fontSize: "24px",
      color: "#00ff00",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(1002);

    // Texte du dialogue
    const dialogText = this.add.text(width / 2, height / 2 - 50, text, {
      fontSize: "16px",
      color: "#ffffff",
      wordWrap: { width: 650 },
      align: "left",
    }).setOrigin(0.5).setDepth(1002);

    // Bouton Fermer
    const closeBtn = this.add.rectangle(width / 2, height / 2 + 150, 150, 50, 0x0f3460);
    closeBtn.setStrokeStyle(2, 0x16213e);
    closeBtn.setDepth(1002);
    closeBtn.setInteractive({ useHandCursor: true });

    const closeBtnText = this.add.text(width / 2, height / 2 + 150, "Fermer", {
      fontSize: "18px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1003);

    closeBtn.on("pointerover", () => {
      closeBtn.setFillStyle(0x16213e);
    });

    closeBtn.on("pointerout", () => {
      closeBtn.setFillStyle(0x0f3460);
    });

    closeBtn.on("pointerdown", () => {
      overlay.destroy();
      dialogBox.destroy();
      title.destroy();
      dialogText.destroy();
      closeBtn.destroy();
      closeBtnText.destroy();
    });
  }

  private createBox(width: number, height: number) {
    const boxX = width / 2 + 250;
    const boxY = height / 2 + 200;

    const container = this.add.container(boxX, boxY);

    // Boîte
    const box = this.add.rectangle(0, 0, 80, 80, 0x8b4513);
    box.setStrokeStyle(3, 0x654321);

    // Couvercle
    const lid = this.add.rectangle(0, -5, 75, 10, 0xa0522d);
    lid.setStrokeStyle(2, 0x654321);

    // Serrure (rouge si verrouillée, verte si déverrouillée)
    const lock = this.add.circle(0, 0, 8, 0xff0000);
    lock.setStrokeStyle(2, 0x000000);

    // Label
    const label = this.add.text(0, 60, "🔒 Boîte verrouillée", {
      fontSize: "12px",
      color: "#333333",
    }).setOrigin(0.5);

    container.add([box, lid, lock, label]);
    container.setSize(100, 100);
    container.setInteractive({ useHandCursor: true });
    container.setData("lock", lock);
    container.setData("label", label);

    // Interactions
    container.on("pointerover", () => {
      container.setScale(1.1);
      box.setFillStyle(0xa0522d);
    });

    container.on("pointerout", () => {
      container.setScale(1);
      box.setFillStyle(0x8b4513);
    });

    container.on("pointerdown", () => {
      if (this.gameState.boxUnlocked) {
        this.showBoxInventory();
      } else {
        this.showCodeInput();
      }
    });
    
    // Mettre à jour l'apparence si déjà déverrouillée
    if (this.gameState.boxUnlocked) {
      lock.setFillStyle(0x00ff00);
      label.setText("🔓 Boîte déverrouillée");
    }
  }

  private showCodeInput() {
    const { width, height } = this.scale;

    // Fond semi-transparent
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setDepth(1000);
    overlay.setInteractive();

    // Boîte de saisie - plus grande et mieux centrée
    const boxWidth = 350;
    const boxHeight = 480;
    const inputBox = this.add.rectangle(width / 2, height / 2, boxWidth, boxHeight, 0x1a1a2e);
    inputBox.setStrokeStyle(4, 0x16213e);
    inputBox.setDepth(1001);

    // Titre
    const title = this.add.text(width / 2, height / 2 - 210, "🔒 Boîte verrouillée", {
      fontSize: "22px",
      color: "#ff6b6b",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(1002);

    // Instructions
    const instructions = this.add.text(width / 2, height / 2 - 165, "Entrez le code à 6 chiffres :", {
      fontSize: "15px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1002);

    // Affichage du code
    let currentCode = "";
    const codeDisplay = this.add.text(width / 2, height / 2 - 120, "_ _ _ _ _ _", {
      fontSize: "30px",
      color: "#00ff00",
      fontFamily: "monospace",
    }).setOrigin(0.5).setDepth(1002);

    // Message d'erreur
    const errorMsg = this.add.text(width / 2, height / 2 - 75, "", {
      fontSize: "13px",
      color: "#ff0000",
    }).setOrigin(0.5).setDepth(1002);

    // Pavé numérique - mieux centré et remonté
    const buttonSize = 55;
    const gap = 12;
    const numpadWidth = 3 * buttonSize + 2 * gap;
    const numpadStartX = width / 2 - numpadWidth / 2 + buttonSize / 2;
    const numpadStartY = height / 2 - 60;

    const numbers = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ["C", 0, "✓"]
    ];

    numbers.forEach((row, rowIndex) => {
      row.forEach((num, colIndex) => {
        const x = numpadStartX + colIndex * (buttonSize + gap);
        const y = numpadStartY + rowIndex * (buttonSize + gap);

        const btn = this.add.rectangle(x, y, buttonSize, buttonSize, 0x0f3460);
        btn.setStrokeStyle(2, 0x16213e);
        btn.setDepth(1002);
        btn.setInteractive({ useHandCursor: true });

        const btnText = this.add.text(x, y, num.toString(), {
          fontSize: "24px",
          color: "#ffffff",
          fontStyle: "bold",
        }).setOrigin(0.5).setDepth(1003);

        btn.on("pointerover", () => {
          btn.setFillStyle(0x16213e);
        });

        btn.on("pointerout", () => {
          btn.setFillStyle(0x0f3460);
        });

        btn.on("pointerdown", () => {
          if (num === "C") {
            // Clear
            currentCode = "";
            codeDisplay.setText("_ _ _ _ _ _");
            errorMsg.setText("");
          } else if (num === "✓") {
            // Validate
            if (currentCode === "120455") {
              this.gameState.boxUnlocked = true;
              
              // Afficher un message de succès bien visible
              const successMsg = this.add.text(width / 2, height / 2 - 180, "✓ CODE CORRECT !", {
                fontSize: "28px",
                color: "#00ff00",
                fontStyle: "bold",
                backgroundColor: "#000000",
                padding: { x: 20, y: 10 },
              }).setOrigin(0.5).setDepth(2500);
              
              // Notify other players
              if (this.net) {
                this.net.send(EVENT_CODES.PUZZLE_UPDATE, { type: "box_unlock" });
              }

              // Update box appearance
              this.updateBoxAppearance();

              // Close after delay
              this.time.delayedCall(1500, () => {
                this.children.getAll().forEach((obj: any) => {
                  if (obj.depth >= 1000 && obj.depth < 2000) {
                    obj.destroy();
                  }
                });
                successMsg.destroy();
                this.showBoxInventory();
              });
            } else {
              // Afficher un message d'erreur bien visible
              const errorMsgBig = this.add.text(width / 2, height / 2 - 180, "✗ CODE INCORRECT !", {
                fontSize: "28px",
                color: "#ff0000",
                fontStyle: "bold",
                backgroundColor: "#000000",
                padding: { x: 20, y: 10 },
              }).setOrigin(0.5).setDepth(2500);
              
              // Effacer après 1.5 secondes
              this.time.delayedCall(1500, () => {
                errorMsgBig.destroy();
              });
              
              errorMsg.setText("✗ Code incorrect !");
              errorMsg.setColor("#ff0000");
            }
          } else if (typeof num === "number" && currentCode.length < 6) {
            // Add digit
            currentCode += num.toString();
            // Display each digit with spaces for better visibility
            let displayText = "";
            for (let i = 0; i < 6; i++) {
              if (i < currentCode.length) {
                displayText += currentCode[i];
              } else {
                displayText += "_";
              }
              if (i < 5) displayText += " "; // Add space between characters
            }
            codeDisplay.setText(displayText);
            errorMsg.setText("");
          }
        });
      });
    });

    // Bouton Annuler
    const cancelBtn = this.add.rectangle(width / 2, height / 2 + 200, 140, 40, 0x8b0000);
    cancelBtn.setStrokeStyle(2, 0x660000);
    cancelBtn.setDepth(1002);
    cancelBtn.setInteractive({ useHandCursor: true });

    const cancelBtnText = this.add.text(width / 2, height / 2 + 200, "Annuler", {
      fontSize: "15px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1003);

    cancelBtn.on("pointerover", () => {
      cancelBtn.setFillStyle(0xaa0000);
    });

    cancelBtn.on("pointerout", () => {
      cancelBtn.setFillStyle(0x8b0000);
    });

    cancelBtn.on("pointerdown", () => {
      this.children.getAll().forEach((obj: any) => {
        if (obj.depth >= 1000 && obj.depth < 2000) {
          obj.destroy();
        }
      });
    });
  }

  private updateBoxAppearance() {
    // Find the box container and update its appearance
    this.children.getAll().forEach((obj: any) => {
      if (obj instanceof Phaser.GameObjects.Container && obj.getData("lock")) {
        const lock = obj.getData("lock");
        const label = obj.getData("label");
        lock.setFillStyle(0x00ff00); // Green lock
        label.setText("🔓 Boîte déverrouillée");
      }
    });
  }

  private showBoxInventory() {
    const { width, height } = this.scale;

    // Fond semi-transparent
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setDepth(1000);
    overlay.setInteractive();

    // Boîte d'inventaire
    const invBox = this.add.rectangle(width / 2, height / 2, 600, 500, 0x2c3e50);
    invBox.setStrokeStyle(4, 0x34495e);
    invBox.setDepth(1001);

    // Titre
    const title = this.add.text(width / 2, height / 2 - 220, "📦 Contenu de la boîte", {
      fontSize: "24px",
      color: "#ecf0f1",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(1002);

    // Instructions
    const instructions = this.add.text(width / 2, height / 2 - 190, "Cliquez pour prendre ou reposer un objet", {
      fontSize: "12px",
      color: "#bdc3c7",
    }).setOrigin(0.5).setDepth(1002);

    // Grille 3x2 (6 cases)
    const itemDefinitions = [
      { id: "carte", icon: "🗺️", name: "Carte", description: "Plan de l'hôpital" },
      { id: "badge", icon: "🔖", name: "Badge", description: "Accès Salle Info" },
      { id: "postit", icon: "📝", name: "Post-it", description: "Mot de passe" },
    ];

    const slotSize = 120;
    const gap = 20;
    const gridWidth = 3 * slotSize + 2 * gap;
    const gridHeight = 2 * slotSize + gap;
    const startX = width / 2 - gridWidth / 2 + slotSize / 2;
    const startY = height / 2 - gridHeight / 2 + slotSize / 2 - 20;

    // Create 6 slots (3 items + 3 empty)
    for (let index = 0; index < 6; index++) {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = startX + col * (slotSize + gap);
      const y = startY + row * (slotSize + gap);

      // Case
      const slot = this.add.rectangle(x, y, slotSize, slotSize, 0x34495e);
      slot.setStrokeStyle(2, 0x7f8c8d);
      slot.setDepth(1001);

      // Check if this slot should have an item
      const itemDef = itemDefinitions[index];
      if (itemDef) {
        const isAvailable = this.gameState.boxItems.get(itemDef.id) || false;

        if (isAvailable) {
          // Item is in the box
          const icon = this.add.text(x, y - 20, itemDef.icon, {
            fontSize: "40px",
          }).setOrigin(0.5).setDepth(1002);

          const name = this.add.text(x, y + 30, itemDef.name, {
            fontSize: "14px",
            color: "#ecf0f1",
            fontStyle: "bold",
          }).setOrigin(0.5).setDepth(1002);

          const desc = this.add.text(x, y + 48, itemDef.description, {
            fontSize: "10px",
            color: "#bdc3c7",
          }).setOrigin(0.5).setDepth(1002);

          // Make clickable to pick up
          const itemContainer = this.add.container(x, y);
          itemContainer.setSize(slotSize, slotSize);
          itemContainer.setInteractive({ useHandCursor: true });
          itemContainer.setDepth(1002);

          itemContainer.on("pointerover", () => {
            icon.setScale(1.2);
            slot.setFillStyle(0x3d566e);
          });

          itemContainer.on("pointerout", () => {
            icon.setScale(1);
            slot.setFillStyle(0x34495e);
          });

          itemContainer.on("pointerdown", () => {
            // Try to pick up
            if (this.gameState.addToInventory(itemDef)) {
              // Success - remove from box
              this.gameState.boxItems.set(itemDef.id, false);
              
              // Notify other players
              if (this.net) {
                console.log("Sending ITEM_PICKED event:", itemDef.id);
                this.net.send(EVENT_CODES.ITEM_PICKED, { 
                  itemId: itemDef.id, 
                  action: "pick" 
                });
              }

              // Close and reopen to refresh
              this.children.getAll().forEach((obj: any) => {
                if (obj.depth >= 1000 && obj.depth < 2000) {
                  obj.destroy();
                }
              });
              this.showBoxInventory();
              
              // Refresh inventory display
              this.refreshInventoryDisplay();
            }
          });
        } else {
          // Item was taken - show empty slot with hint
          const emptyText = this.add.text(x, y, "Vide", {
            fontSize: "12px",
            color: "#7f8c8d",
          }).setOrigin(0.5).setDepth(1002);
        }
      }
    }

    // Bouton Fermer
    const closeBtn = this.add.rectangle(width / 2, height / 2 + 200, 150, 50, 0x27ae60);
    closeBtn.setStrokeStyle(2, 0x229954);
    closeBtn.setDepth(1002);
    closeBtn.setInteractive({ useHandCursor: true });

    const closeBtnText = this.add.text(width / 2, height / 2 + 200, "Fermer", {
      fontSize: "18px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1003);

    closeBtn.on("pointerover", () => {
      closeBtn.setFillStyle(0x229954);
    });

    closeBtn.on("pointerout", () => {
      closeBtn.setFillStyle(0x27ae60);
    });

    closeBtn.on("pointerdown", () => {
      // Détruire tous les éléments de l'overlay
      this.children.getAll().forEach((obj: any) => {
        if (obj.depth >= 1000 && obj.depth < 2000) {
          obj.destroy();
        }
      });
    });
  }

  private createInventoryBar(width: number, height: number) {
    const barWidth = 500;
    const barHeight = 80;
    const barX = width / 2;
    const barY = height - 60;

    const container = this.add.container(barX, barY);
    container.setDepth(900);

    // Fond de la barre
    const bg = this.add.rectangle(0, 0, barWidth, barHeight, 0x2c3e50, 0.9);
    bg.setStrokeStyle(3, 0x34495e);
    container.add(bg);

    // 5 slots
    const slotSize = 70;
    const gap = 10;
    const totalWidth = 5 * slotSize + 4 * gap;
    const startX = -totalWidth / 2 + slotSize / 2;

    for (let i = 0; i < 5; i++) {
      const x = startX + i * (slotSize + gap);
      const slot = this.add.rectangle(x, 0, slotSize, slotSize, 0x34495e);
      slot.setStrokeStyle(2, 0x7f8c8d);
      container.add(slot);

      // Conteneur pour l'objet (vide au départ)
      const itemContainer = this.add.container(x, 0);
      itemContainer.setData("slotIndex", i);
      itemContainer.setData("isEmpty", true);
      container.add(itemContainer);
      this.inventory.push(itemContainer);
    }

    this.inventoryBar = container;
  }

  private addToInventory(item: { id?: string; icon: string; name: string; description: string }): boolean {
    // Trouve le premier slot vide
    const emptySlot = this.inventory.find((slot) => slot.getData("isEmpty"));
    if (!emptySlot) {
      console.log("Inventaire plein !");
      return false;
    }

    // Ajoute l'objet au slot
    const icon = this.add.text(0, -5, item.icon, {
      fontSize: "32px",
    }).setOrigin(0.5);

    const name = this.add.text(0, 25, item.name, {
      fontSize: "10px",
      color: "#ecf0f1",
    }).setOrigin(0.5);

    emptySlot.add([icon, name]);
    emptySlot.setData("isEmpty", false);
    emptySlot.setData("item", item);

    // Make slot clickable to return item to box
    emptySlot.setSize(70, 70);
    emptySlot.setInteractive({ useHandCursor: true });

    emptySlot.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!emptySlot.getData("isEmpty")) {
        const storedItem = emptySlot.getData("item");
        if (storedItem && storedItem.id) {
          // Left click: show item details
          if (pointer.leftButtonDown()) {
            this.showItemDetails(storedItem);
          }
        }
      }
    });

    // Right click to return item to box
    emptySlot.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!emptySlot.getData("isEmpty") && pointer.rightButtonReleased()) {
        const storedItem = emptySlot.getData("item");
        if (storedItem && storedItem.id) {
          // Return item to box
          this.gameState.boxItems.set(storedItem.id, true);
          this.gameState.removeFromInventory(storedItem.id);
          
          // Notify other players
          if (this.net) {
            this.net.send(EVENT_CODES.ITEM_PICKED, { 
              itemId: storedItem.id, 
              action: "return" 
            });
          }

          // Clear slot
          emptySlot.removeAll(true);
          emptySlot.setData("isEmpty", true);
          emptySlot.setData("item", null);
          emptySlot.removeInteractive();

          console.log(`${storedItem.name} reposé dans la boîte !`);
        }
      }
    });

    console.log(`${item.name} ajouté à l'inventaire !`);
    return true;
  }

  private showItemDetails(item: { id?: string; icon: string; name: string; description: string }) {
    const width = this.scale.width;
    const height = this.scale.height;

    // Overlay semi-transparent
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    overlay.setDepth(2000);
    overlay.setInteractive();

    // Conteneur pour les détails
    let detailsContainer: Phaser.GameObjects.Container;

    if (item.id === "carte") {
      // Afficher l'image de la carte
      // TODO: Remplacer par l'image réelle une fois le chemin fourni
      const mapImage = this.add.rectangle(width / 2, height / 2, 600, 400, 0x333333);
      mapImage.setDepth(2001);
      
      const mapText = this.add.text(width / 2, height / 2, "🗺️ CARTE DE L'HÔPITAL\n\n(Image à venir)", {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      }).setOrigin(0.5).setDepth(2002);

      detailsContainer = this.add.container(0, 0, [mapImage, mapText]);
    } else if (item.id === "postit") {
      // Afficher le mot de passe
      const postItBg = this.add.rectangle(width / 2, height / 2, 400, 300, 0xffff99);
      postItBg.setDepth(2001);
      postItBg.setStrokeStyle(3, 0xcccc66);

      const postItTitle = this.add.text(width / 2, height / 2 - 100, "📝 Post-it", {
        fontSize: "20px",
        color: "#333333",
        fontStyle: "bold",
      }).setOrigin(0.5).setDepth(2002);

      const postItText = this.add.text(width / 2, height / 2 - 40, "Mot de passe :", {
        fontSize: "16px",
        color: "#666666",
      }).setOrigin(0.5).setDepth(2002);

      const password = this.add.text(width / 2, height / 2 + 20, "Hopital2025", {
        fontSize: "28px",
        color: "#ff0000",
        fontStyle: "bold",
        fontFamily: "monospace",
      }).setOrigin(0.5).setDepth(2002);

      detailsContainer = this.add.container(0, 0, [postItBg, postItTitle, postItText, password]);
    } else {
      // Affichage par défaut pour les autres objets
      const defaultBg = this.add.rectangle(width / 2, height / 2, 400, 300, 0x2c3e50);
      defaultBg.setDepth(2001);
      defaultBg.setStrokeStyle(3, 0x34495e);

      const defaultIcon = this.add.text(width / 2, height / 2 - 60, item.icon, {
        fontSize: "64px",
      }).setOrigin(0.5).setDepth(2002);

      const defaultName = this.add.text(width / 2, height / 2 + 20, item.name, {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      }).setOrigin(0.5).setDepth(2002);

      const defaultDesc = this.add.text(width / 2, height / 2 + 60, item.description, {
        fontSize: "16px",
        color: "#ecf0f1",
        align: "center",
        wordWrap: { width: 350 },
      }).setOrigin(0.5).setDepth(2002);

      detailsContainer = this.add.container(0, 0, [defaultBg, defaultIcon, defaultName, defaultDesc]);
    }

    detailsContainer.setDepth(2001);

    // Bouton fermer
    const closeBtn = this.add.text(width / 2, height / 2 + 180, "Fermer", {
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#e74c3c",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setDepth(2003);
    closeBtn.setInteractive({ useHandCursor: true });

    closeBtn.on("pointerover", () => {
      closeBtn.setBackgroundColor("#c0392b");
    });

    closeBtn.on("pointerout", () => {
      closeBtn.setBackgroundColor("#e74c3c");
    });

    closeBtn.on("pointerdown", () => {
      overlay.destroy();
      detailsContainer.destroy();
      closeBtn.destroy();
    });

    // Cliquer sur l'overlay ferme aussi
    overlay.on("pointerdown", () => {
      overlay.destroy();
      detailsContainer.destroy();
      closeBtn.destroy();
    });
  }

  private onItemPickedByOther(data: { itemId: string; action: string }) {
    // Another player picked or returned an item
    if (data.action === "pick") {
      this.gameState.boxItems.set(data.itemId, false);
      console.log(`Un autre joueur a pris l'objet ${data.itemId}`);
    } else if (data.action === "return") {
      this.gameState.boxItems.set(data.itemId, true);
      console.log(`Un autre joueur a reposé l'objet ${data.itemId}`);
    }
  }
  
  private restoreInventory() {
    // Restaurer les items depuis le GameState
    this.gameState.playerInventory.forEach(item => {
      this.addToInventory(item);
    });
  }
  
  private refreshInventoryDisplay() {
    // Vider l'affichage actuel
    this.inventory.forEach(slot => {
      slot.removeAll(true);
      slot.setData("isEmpty", true);
      slot.setData("item", null);
      slot.removeInteractive();
    });
    
    // Restaurer depuis le GameState
    this.restoreInventory();
  }

  private setupControls() {
    // Instructions
    this.add.text(20, 20, "Cliquez sur les objets pour interagir", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    });
  }
}