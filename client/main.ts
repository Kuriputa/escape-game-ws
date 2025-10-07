// -------------------------
// Imports
// -------------------------
import Phaser from "phaser";
import { Net, EVENT_CODES } from "./src/net/photonClient";
import { Story } from "inkjs";
import storyJSON from "./src/ink/story.json"; // JSON exporté depuis Inky/Inklecate

// Codes d'événements importés depuis Net

// Réseau Photon importé depuis src/net/photonClient

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
      // Helper: afficher une erreur à l'écran pour éviter la page blanche
      const showError = (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        this.add.text(20, 20, `Erreur: ${message}` as string, {
          font: "16px Arial",
          color: "#ff5555",
          wordWrap: { width: 760 },
        });
        console.error(err);
      };

      // Titre de la scène
      this.add.text(20, 20, "Escape Game - Démo réseau + narration", {
        font: "20px Arial",
        color: "#ffffff",
      });

      // UI elements from DOM
      const menuEl = document.getElementById("menu") as HTMLDivElement;
      const nickInput = document.getElementById("nickname") as HTMLInputElement;
      const roomInput = document.getElementById("room") as HTMLInputElement;
      const joinBtn = document.getElementById("joinBtn") as HTMLButtonElement;
      const menuError = document.getElementById("menuError") as HTMLDivElement;
      const chatBox = document.getElementById("chat") as HTMLDivElement;
      const chatLog = document.getElementById("chatLog") as HTMLDivElement;
      const chatInput = document.getElementById("chatInput") as HTMLInputElement;
      const chatSend = document.getElementById("chatSend") as HTMLButtonElement;

      // Join flow
      joinBtn.onclick = async () => {
        const nick = (nickInput.value || "").trim();
        const room = (roomInput.value || "").trim();
        if (!nick || !room) {
          menuError.style.display = "block";
          menuError.innerText = "Pseudo et salle sont requis.";
          return;
        }
        menuError.style.display = "none";
        net.setNickname(nick);
        try {
          await net.joinOrCreateRoom(room);
        } catch (e) {
          menuError.style.display = "block";
          menuError.innerText = (e instanceof Error ? e.message : String(e));
        }
      };

      net.onJoined = (room) => {
        menuEl.style.display = "none";
        chatBox.style.display = "block";
        appendChatLine(`Vous avez rejoint: ${room}`);
      };

      // Chat
      function appendChatLine(text: string) {
        const line = document.createElement("div");
        line.textContent = text;
        chatLog.appendChild(line);
        chatLog.scrollTop = chatLog.scrollHeight;
      }
      chatSend.onclick = () => {
        const msg = (chatInput.value || "").trim();
        if (!msg) return;
        appendChatLine(`Moi: ${msg}`);
        net.sendChat(msg);
        chatInput.value = "";
      };

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
        .setDepth(1000);

      // Hit area explicite + curseur
      btn.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, btn.width + 12, btn.height + 8),
        Phaser.Geom.Rectangle.Contains
      );
      btn.input!.cursor = "pointer";

      btn.on("pointerdown", () => {
        console.log("CLICK PING");
        net.send(EVENT_CODES.PING, { t: Date.now() });
      });

      // 3️⃣ Chargement de l’histoire Ink
      let story: Story | null = null;
      try {
        story = new Story(storyJSON as any);
      } catch (e) {
        showError(e);
        return; // sans histoire on s'arrête ici
      }

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
      let currentInkText = firstText;
      renderInk(currentInkText);

      // 4️⃣ Réception d’un événement réseau
      net.onEvent = (code, data) => {
        if (code === EVENT_CODES.PING) {
          console.log("PING reçu :", data);
          // Simule : le puzzle est résolu
          story!.variablesState.$("terminalUnlocked", true);
          let newText = "";
          while (story!.canContinue) newText += story!.Continue();
          if (newText.trim().length > 0) {
            currentInkText = newText;
            renderInk(currentInkText);
          } else {
            // Pas de nouveau texte: conserver l'affichage courant
            renderInk(currentInkText);
          }
        } else if (code === EVENT_CODES.CHAT) {
          appendChatLine(`${data.from || "Inconnu"}: ${data.text}`);
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
