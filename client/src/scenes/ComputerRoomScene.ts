import Phaser from "phaser";
import { Net } from "../net/photonClient";
import { Story } from "inkjs";

export class ComputerRoomScene extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private player: Phaser.GameObjects.Rectangle | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor() {
    super({ key: "ComputerRoomScene" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
  }

  create() {
    const { width, height } = this.scale;

    // Sol de la salle
    const floor = this.add.rectangle(width / 2, height / 2, 800, 600, 0xe0e0e0);
    floor.setStrokeStyle(4, 0x999999);

    // Murs
    const wallThickness = 20;
    
    const topWall = this.add.rectangle(width / 2, height / 2 - 300, 800, wallThickness, 0xcccccc);
    topWall.setStrokeStyle(2, 0x888888);

    const bottomWall = this.add.rectangle(width / 2, height / 2 + 300, 800, wallThickness, 0xcccccc);
    bottomWall.setStrokeStyle(2, 0x888888);

    const leftWall = this.add.rectangle(width / 2 - 400, height / 2, wallThickness, 600, 0xcccccc);
    leftWall.setStrokeStyle(2, 0x888888);

    const rightWall = this.add.rectangle(width / 2 + 400, height / 2, wallThickness, 600, 0xcccccc);
    rightWall.setStrokeStyle(2, 0x888888);

    // Titre
    this.add.text(width / 2, 50, "Salle Informatique", {
      fontSize: "24px",
      color: "#333333",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Ordinateurs
    this.createComputers(width, height);

    // Porte retour
    this.createDoor(width, height);

    // Joueur
    this.createPlayer(width, height);

    // Contrôles
    this.setupControls();

    // Message temporaire
    const msg = this.add.text(width / 2, height / 2, "🚧 Salle Info - En construction 🚧", {
      fontSize: "20px",
      color: "#ff6b6b",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);
  }

  update() {
    if (!this.player || !this.cursors) return;

    const speed = 200;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    body.setVelocity(0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }
  }

  private createComputers(width: number, height: number) {
    // Bureau avec ordinateur
    const desk = this.add.rectangle(width / 2, height / 2 - 100, 150, 80, 0x8b7355);
    desk.setStrokeStyle(2, 0x654321);

    // Écran d'ordinateur
    const screen = this.add.rectangle(width / 2, height / 2 - 120, 100, 70, 0x1a1a1a);
    screen.setStrokeStyle(2, 0x000000);

    // Écran allumé
    const display = this.add.rectangle(width / 2, height / 2 - 120, 90, 60, 0x0066cc);

    // Clavier
    const keyboard = this.add.rectangle(width / 2, height / 2 - 70, 80, 30, 0x333333);
    keyboard.setStrokeStyle(1, 0x000000);

    // Label
    this.add.text(width / 2, height / 2 - 30, "💻 Terminal", {
      fontSize: "12px",
      color: "#333333",
    }).setOrigin(0.5);
  }

  private createDoor(width: number, height: number) {
    // Porte retour vers la salle d'hôpital
    const westDoor = this.add.rectangle(width / 2 - 400, height / 2, 20, 80, 0x8b4513);
    westDoor.setStrokeStyle(2, 0x654321);
    westDoor.setInteractive({ useHandCursor: true });

    const label = this.add.text(width / 2 - 450, height / 2, "🚪 Retour", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5);

    westDoor.on("pointerover", () => {
      westDoor.setFillStyle(0xa0522d);
    });

    westDoor.on("pointerout", () => {
      westDoor.setFillStyle(0x8b4513);
    });

    westDoor.on("pointerdown", () => {
      this.scene.start("HospitalRoomScene", { net: this.net, story: this.story });
    });
  }

  private createPlayer(width: number, height: number) {
    this.player = this.add.rectangle(width / 2, height / 2 + 100, 30, 30, 0xff6b6b);
    this.player.setStrokeStyle(2, 0xee5a6f);

    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
  }

  private setupControls() {
    this.cursors = this.input.keyboard?.createCursorKeys() || null;

    this.add.text(20, 20, "Flèches: Déplacer | Clic sur porte: Retour", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    });
  }
}