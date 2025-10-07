// -------------------------
// Imports
// -------------------------
import Phaser from "phaser";
import { LoadBalancingClient, ClientState } from "photon-realtime";
import { Story } from "inkjs";
import storyJSON from "./src/ink/story.json"; // JSON exporté depuis Inky/Inklecate

// -------------------------
// Codes d'événements
// -------------------------
const EVENT_CODES = {
  PING: 0,
  PUZZLE_UPDATE: 1,
  INK_SET: 2,
  CHOICE_MADE: 3,
} as const;

// -------------------------
// Classe réseau Photon
// -------------------------
class Net {
  client = new LoadBalancingClient("wss://", "1.0");
  onEvent?: (code: number, data: any) => void;

  constructor() {
    this.client.onEvent = (code, content) => this.onEvent?.(code, content);
    this.client.onStateChange = (s) => console.log("Photon state:", s);
  }

  async connect(region = "eu") {
    await this.client.connectToRegionMaster(region);
  }

  async joinOrCreateRoom(roomName: string) {
    if (this.client.state !== ClientState.JoinedLobby) {
      await this.client.connectToRegionMaster("eu");
    }
    this.client.joinOrCreateRoom(roomName);
  }

  send(code: number, payload: any) {
    this.client.raiseEvent(code, payload);
  }
}

// -------------------------
// Jeu Phaser
// -------------------------
const net = new Net();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: document.body,
  backgroundColor: "#111",
  scene: {
    async create() {
      // Titre de la scène
      this.add.text(20, 20, "Escape Game - Démo réseau + narration", {
        font: "20px Arial",
        color: "#ffffff",
      });

      // 1️⃣ Connexion à Photon
      await net.connect("eu");
      await net.joinOrCreateRoom("ROOM-TEST");

      this.add.text(20, 60, "Connecté à Photon (ROOM-TEST)", {
        font: "14px Arial",
        color: "#aaaaaa",
      });

      // 2️⃣ Bouton test "Envoyer PING"
      const btn = this.add
        .text(20, 100, "[ Envoyer PING ]", {
          font: "16px Arial",
          color: "#00ff00",
        })
        .setInteractive();

      btn.on("pointerdown", () => {
        net.send(EVENT_CODES.PING, { t: Date.now() });
      });

      // 3️⃣ Chargement de l’histoire Ink
      const story = new Story(storyJSON as any);

      const renderInk = (text: string) => {
        // Efface le texte précédent
        this.children.getAll().forEach((obj: any) => {
          if (obj.name === "ink") obj.destroy();
        });
        // Affiche le nouveau paragraphe
        this.add
          .text(400, 430, text, {
            font: "14px Arial",
            color: "#ffffff",
            wordWrap: { width: 760 },
          })
          .setOrigin(0.5, 1)
          .setName("ink");
      };

      // Premier affichage du texte Ink
      let firstText = "";
      while (story.canContinue) firstText += story.Continue();
      renderInk(firstText);

      // 4️⃣ Réception d’un événement réseau
      net.onEvent = (code, data) => {
        if (code === EVENT_CODES.PING) {
          console.log("PING reçu :", data);
          // Simule : le puzzle est résolu
          story.variablesState.$("terminalUnlocked", true);
          let newText = "";
          while (story.canContinue) newText += story.Continue();
          renderInk(newText);
        }
      };

      this.add.text(
        20,
        440,
        "Ouvre un 2e onglet → clique sur [Envoyer PING] pour tester la synchro.",
        { font: "12px Arial", color: "#999999" }
      );
    },
  },
};

// -------------------------
// Lancement du jeu
// -------------------------
new Phaser.Game(config);
