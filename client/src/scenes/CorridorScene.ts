import Phaser from "phaser";
import { Net } from "../net/photonClient";
import { Story } from "inkjs";

export class CorridorScene extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private player: Phaser.GameObjects.Rectangle | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor() {
    super({ key: "CorridorScene" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
  }

  create() {
    const { width, height } = this.scale;

    // Fond du couloir
    const floor = this.add.rectangle(width / 2, height / 2, 1200, 400, 0xd3d3d3);
    floor.setStrokeStyle(4, 0x999999);

    // Murs
    const topWall = this.add.rectangle(width / 2, height / 2 - 200, 1200, 20, 0xcccccc);
    topWall.setStrokeStyle(2, 0x888888);

    const bottomWall = this.add.rectangle(width / 2, height / 2 + 200, 1200, 20, 0xcccccc);
    bottomWall.setStrokeStyle(2, 0x888888);

    // Titre
    this.add.text(width / 2, 50, "Couloir de l'hôpital", {
      fontSize: "24px",
      color: "#333333",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Portes
    this.createDoors(width, height);

    // Joueur
    this.createPlayer(width, height);

    // Contrôles
    this.setupControls();

    // Message temporaire
    const msg = this.add.text(width / 2, height / 2, "🚧 Couloir - En construction 🚧", {
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

  private createDoors(width: number, height: number) {
    // Porte retour vers la salle d'hôpital
    const southDoor = this.add.rectangle(width / 2 - 300, height / 2 + 200, 80, 20, 0x8b4513);
    southDoor.setStrokeStyle(2, 0x654321);
    southDoor.setInteractive({ useHandCursor: true });

    const label = this.add.text(width / 2 - 300, height / 2 + 230, "🚪 Retour Salle", {
      fontSize: "14px",
      color: "#333333",
      backgroundColor: "#ffffff",
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5);

    southDoor.on("pointerover", () => {
      southDoor.setFillStyle(0xa0522d);
    });

    southDoor.on("pointerout", () => {
      southDoor.setFillStyle(0x8b4513);
    });

    southDoor.on("pointerdown", () => {
      this.scene.start("HospitalRoomScene", { net: this.net, story: this.story });
    });
  }

  private createPlayer(width: number, height: number) {
    this.player = this.add.rectangle(width / 2, height / 2, 30, 30, 0xff6b6b);
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