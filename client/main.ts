// -------------------------
// Imports
// -------------------------
import Phaser from "phaser";
import { Net, EVENT_CODES } from "./src/net/photonClient";
import { Story } from "inkjs";
import storyJSON from "./src/ink/story.json"; // JSON exporté depuis Inky/Inklecate
import { GameState } from "./src/GameState";
import { HospitalRoomScene } from "./src/scenes/HospitalRoomScene";
import { CorridorScene } from "./src/scenes/CorridorScene";
import { ComputerRoomScene } from "./src/scenes/ComputerRoomScene";
import { CorridorSceneA } from "./src/scenes/CorridorSceneA";
import { ComputerRoomSceneB } from "./src/scenes/ComputerRoomSceneB";
import { PatientRoomScene } from "./src/scenes/PatientRoomScene";
import { MedicineStorageScene } from "./src/scenes/MedicineStorageScene";
import { ServerRoomScene } from "./src/scenes/ServerRoomScene";
import { WaitingRoomScene } from "./src/scenes/WaitingRoomScene";
import { ExitRoomScene } from "./src/scenes/ExitRoomScene";

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
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
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
        for (let i = 0; i < players.length; i++) {
          const p = players[i];
          const li = document.createElement("li");
          li.style.cssText = "padding:10px 12px;margin-bottom:8px;background:#0d0d0d;border-radius:8px;border:2px solid #333;display:flex;align-items:center;gap:10px;font-size:14px;transition:all 0.3s;";
          
          // Icône du joueur
          const icon = document.createElement("span");
          icon.style.cssText = "font-size:20px;";
          icon.textContent = i === 0 ? "🎮" : "🎯";
          
          // Nom du joueur
          const name = document.createElement("span");
          name.style.cssText = "flex:1;font-weight:600;color:#fff;";
          name.textContent = p || "(sans nom)";
          
          // Badge de rôle
          const badge = document.createElement("span");
          badge.style.cssText = "padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.5px;";
          if (i === 0) {
            badge.style.background = "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)";
            badge.style.color = "#fff";
            badge.textContent = "JOUEUR A";
          } else {
            badge.style.background = "linear-gradient(135deg, #3498db 0%, #2980b9 100%)";
            badge.style.color = "#fff";
            badge.textContent = "JOUEUR B";
          }
          
          li.appendChild(icon);
          li.appendChild(name);
          li.appendChild(badge);
          
          // Effet hover
          li.onmouseenter = () => {
            li.style.borderColor = "#00d9ff";
            li.style.transform = "translateX(4px)";
          };
          li.onmouseleave = () => {
            li.style.borderColor = "#333";
            li.style.transform = "translateX(0)";
          };
          
          playersList.appendChild(li);
        }
      };

      const begin = () => {
        canvas.style.display = "block";
        lobbyEl.style.display = "none";
        // Garder le chat visible pendant la partie
        chatBox.style.display = "block";
        appendChatLine("Départ de la partie !");
        
        // Déterminer et stocker le rôle du joueur
        const gameState = GameState.getInstance();
        gameState.playerRole = net.getPlayerRole();
        console.log("Rôle du joueur:", gameState.playerRole);
        
        // Ajouter toutes les scènes
        this.scene.add("HospitalRoomScene", HospitalRoomScene, false);
        this.scene.add("CorridorScene", CorridorScene, false);
        this.scene.add("ComputerRoomScene", ComputerRoomScene, false);
        this.scene.add("CorridorSceneA", CorridorSceneA, false);
        this.scene.add("ComputerRoomSceneB", ComputerRoomSceneB, false);
        this.scene.add("PatientRoomScene", PatientRoomScene, false);
        this.scene.add("MedicineStorageScene", MedicineStorageScene, false);
        this.scene.add("ServerRoomScene", ServerRoomScene, false);
        this.scene.add("WaitingRoomScene", WaitingRoomScene, false);
        this.scene.add("ExitRoomScene", ExitRoomScene, false);
        
        // Lancer la scène HospitalRoomScene
        this.scene.start("HospitalRoomScene", { net, story });
      };

      startBtn.onclick = () => {
        net.startGame();
        begin();
      };

      // Chat
      function appendChatLine(text: string, type: "system" | "self" | "other" = "system") {
        const line = document.createElement("div");
        line.style.cssText = "padding:8px 10px;margin-bottom:6px;border-radius:8px;font-size:13px;line-height:1.4;animation:fadeIn 0.3s ease-out;";
        
        if (type === "system") {
          line.style.background = "#1a1a2e";
          line.style.borderLeft = "3px solid #00d9ff";
          line.style.color = "#aaa";
          line.innerHTML = `<span style="color:#00d9ff;font-weight:700;">ℹ️ Système:</span> ${text}`;
        } else if (type === "self") {
          line.style.background = "#0d2818";
          line.style.borderLeft = "3px solid #27ae60";
          line.style.color = "#fff";
          line.style.textAlign = "right";
          line.innerHTML = `<span style="color:#27ae60;font-weight:700;">Vous:</span> ${text}`;
        } else if (type === "other") {
          line.style.background = "#2a1a1a";
          line.style.borderLeft = "3px solid #e74c3c";
          line.style.color = "#fff";
          const parts = text.split(":", 2);
          if (parts.length === 2) {
            line.innerHTML = `<span style="color:#e74c3c;font-weight:700;">${parts[0]}:</span> ${parts[1]}`;
          } else {
            line.textContent = text;
          }
        }
        
        chatLog.appendChild(line);
        chatLog.scrollTop = chatLog.scrollHeight;
      }
      
      const sendChatMessage = () => {
        const msg = (chatInput.value || "").trim();
        if (!msg) return;
        appendChatLine(msg, "self");
        net.sendChat(msg);
        chatInput.value = "";
      };
      
      chatSend.onclick = sendChatMessage;
      
      chatInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          sendChatMessage();
        }
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
          appendChatLine(`${data.from || "Inconnu"}: ${data.text}`, "other");
        } else if (code === EVENT_CODES.START) {
          begin();
          appendChatLine(`La partie démarre (par ${data.by || "?"}) !`, "system");
        }
      };

    },
  },
};

// -------------------------
// Lancement du jeu
// -------------------------
new Phaser.Game(config);
