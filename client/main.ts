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
  parent: document.body,
  backgroundColor: "#111",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
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

      // Masque le canvas tant que la partie n'a pas commencé
      const canvas = this.game.canvas as HTMLCanvasElement;
      canvas.style.display = "none";

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
      const lobbyEl = document.getElementById("lobby") as HTMLDivElement;
      const lobbyRoom = document.getElementById("lobbyRoom") as HTMLDivElement;
      const playersList = document.getElementById("players") as HTMLUListElement;
      const startBtn = document.getElementById("startBtn") as HTMLButtonElement;

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
        lobbyEl.style.display = "flex";
        lobbyRoom.textContent = `Room: ${room}`;
        appendChatLine(`Vous avez rejoint: ${room}`);
      };

      net.onPlayersChanged = (players) => {
        playersList.innerHTML = "";
        for (const p of players) {
          const li = document.createElement("li");
          li.textContent = p || "(sans nom)";
          playersList.appendChild(li);
        }
      };

      const begin = () => {
        canvas.style.display = "block";
        lobbyEl.style.display = "none";
        // au début, on affiche le premier paragraphe
        renderInk(currentInkText);
        appendChatLine("Départ de la partie !");
      };

      startBtn.onclick = () => {
        net.startGame();
        begin();
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

      // On supprime le bouton PING de la démo pour l'écran d'attente

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

      // Prépare le premier affichage du texte Ink (affiché au démarrage de partie)
      let firstText = "";
      while (story.canContinue) firstText += story.Continue();
      let currentInkText = firstText;

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
        } else if (code === EVENT_CODES.START) {
          begin();
          appendChatLine(`La partie démarre (par ${data.by || "?"}) !`);
        }
      };

    },
  },
};

// -------------------------
// Lancement du jeu
// -------------------------
new Phaser.Game(config);
