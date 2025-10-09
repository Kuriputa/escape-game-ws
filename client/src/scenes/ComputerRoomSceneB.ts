import Phaser from "phaser";
import { Net, EVENT_CODES } from "../net/photonClient";
import { Story } from "inkjs";
import { GameState } from "../GameState";

export class ComputerRoomSceneB extends Phaser.Scene {
  private net: Net | null = null;
  private story: Story | null = null;
  private gameState!: GameState;
  private terminalUnlocked: boolean = false;
  private powerRestored: boolean = false;
  private powerCfgRead: boolean = false;
  private terminalText: Phaser.GameObjects.Text | null = null;
  private commandHistory: string[] = [];

  constructor() {
    super({ key: "ComputerRoomSceneB" });
  }

  init(data: { net: Net; story: Story }) {
    this.net = data.net;
    this.story = data.story;
    this.gameState = GameState.getInstance();
    
    // Setup network event listener
    if (this.net) {
      const originalOnEvent = this.net.onEvent;
      
      this.net.onEvent = (code: number, data: any) => {
        console.log("ComputerRoomSceneB received event:", code, data);
        
        // Appeler le gestionnaire original
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

    // ===== SALLE INFORMATIQUE =====
    this.createRoom(width, height);

    // ===== POST-IT AVEC MOT DE PASSE =====
    this.createPostIt(width, height);

    // ===== TERMINAL LINUX =====
    this.createTerminal(width, height);

    // ===== PORTE VERS STOCKAGE MÉDICAMENTS =====
    this.createNextDoor(width, height);

    // ===== BOUTON RETOUR =====
    this.createBackButton(width, height);

    // ===== MESSAGE D'INFORMATION =====
    this.showInfoMessage();
  }

  private createFadeIn() {
    const fadeRect = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000
    );
    fadeRect.setDepth(3000);
    this.tweens.add({
      targets: fadeRect,
      alpha: { from: 1, to: 0 },
      duration: 800,
      onComplete: () => fadeRect.destroy(),
    });
  }

  private createRoom(width: number, height: number) {
    // Sol
    const floor = this.add.rectangle(width / 2, height / 2, width * 0.9, height * 0.8, 0x2c3e50);
    floor.setStrokeStyle(4, 0x1a252f);

    // Titre
    this.add.text(width / 2, 50, "Salle Informatique", {
      fontSize: "28px",
      color: "#ecf0f1",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Serveurs (décoration)
    const servers = [
      { x: width * 0.15, y: height * 0.3 },
      { x: width * 0.15, y: height * 0.5 },
      { x: width * 0.15, y: height * 0.7 },
    ];

    servers.forEach(pos => {
      const server = this.add.rectangle(pos.x, pos.y, 80, 120, 0x34495e);
      server.setStrokeStyle(2, 0x7f8c8d);
      
      // LEDs clignotantes
      const led1 = this.add.circle(pos.x - 20, pos.y - 40, 4, 0x00ff00);
      const led2 = this.add.circle(pos.x, pos.y - 40, 4, 0xff0000);
      const led3 = this.add.circle(pos.x + 20, pos.y - 40, 4, 0x00ff00);

      this.tweens.add({
        targets: [led1, led3],
        alpha: { from: 1, to: 0.3 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    });

    // Bureau
    const desk = this.add.rectangle(width / 2, height * 0.65, 400, 200, 0x8b7355);
    desk.setStrokeStyle(3, 0x654321);
  }

  private createPostIt(width: number, height: number) {
    // Post-it jaune avec le mot de passe
    const postItX = width * 0.35;
    const postItY = height * 0.55;

    const postIt = this.add.rectangle(postItX, postItY, 120, 120, 0xffff99);
    postIt.setStrokeStyle(2, 0xcccc00);
    postIt.setRotation(-0.1);

    const postItText = this.add.text(postItX, postItY - 20, "📝 Post-it", {
      fontSize: "14px",
      color: "#000000",
      fontStyle: "bold",
    }).setOrigin(0.5).setRotation(-0.1);

    const passwordText = this.add.text(postItX, postItY + 10, "Login: root\nPass: root1234", {
      fontSize: "12px",
      color: "#cc0000",
      align: "center",
    }).setOrigin(0.5).setRotation(-0.1);

    // Interaction
    postIt.setInteractive({ useHandCursor: true });
    postIt.on("pointerdown", () => {
      this.showPostItMessage();
    });

    postItText.setInteractive({ useHandCursor: true });
    postItText.on("pointerdown", () => {
      this.showPostItMessage();
    });
  }

  private createTerminal(width: number, height: number) {
    // Écran du terminal
    const terminalX = width / 2 + 50;
    const terminalY = height * 0.5;

    const screen = this.add.rectangle(terminalX, terminalY, 350, 250, 0x000000);
    screen.setStrokeStyle(4, 0x7f8c8d);

    // Texte du terminal
    this.terminalText = this.add.text(terminalX - 165, terminalY - 115, this.getInitialTerminalText(), {
      fontSize: "13px",
      color: "#00ff00",
      fontFamily: "Courier New",
      lineSpacing: 5,
    });

    // Label
    const terminalLabel = this.add.text(terminalX, terminalY - 150, "💻 Terminal Linux", {
      fontSize: "18px",
      color: "#ecf0f1",
      backgroundColor: "#34495e",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    // Interaction
    screen.setInteractive({ useHandCursor: true });
    screen.on("pointerdown", () => {
      if (!this.terminalUnlocked) {
        this.showLoginPrompt();
      } else {
        this.showCommandMenu();
      }
    });

    terminalLabel.setInteractive({ useHandCursor: true });
    terminalLabel.on("pointerdown", () => {
      if (!this.terminalUnlocked) {
        this.showLoginPrompt();
      } else {
        this.showCommandMenu();
      }
    });
  }

  private getInitialTerminalText(): string {
    return "Ubuntu Server 22.04 LTS\n\nHospital Network Terminal\n\n\nlogin: _";
  }

  private createNextDoor(width: number, height: number) {
    const doorX = width * 0.85;
    const doorY = height / 2;

    const door = this.add.rectangle(doorX, doorY, 100, 160, 0x8b4513);
    door.setStrokeStyle(4, 0x654321);

    const doorLabel = this.add.text(doorX, doorY + 100, "🚪 Stockage\nMédicaments", {
      fontSize: "16px",
      color: "#000000",
      backgroundColor: "#ffffff",
      padding: { x: 8, y: 5 },
      align: "center",
    }).setOrigin(0.5);

    door.setInteractive({ useHandCursor: true });
    door.on("pointerdown", () => {
      if (this.powerRestored) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });

    doorLabel.setInteractive({ useHandCursor: true });
    doorLabel.on("pointerdown", () => {
      if (this.powerRestored) {
        this.openNextDoor();
      } else {
        this.showDoorMessage();
      }
    });
  }

  private createBackButton(width: number, height: number) {
    const backBtn = this.add.text(50, height - 50, "← Retour Salle Hôpital", {
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#555555",
      padding: { x: 15, y: 10 },
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(1000);

    backBtn.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("HospitalRoomScene", { net: this.net, story: this.story });
      });
    });

    backBtn.on("pointerover", () => {
      backBtn.setStyle({ backgroundColor: "#777777" });
    });

    backBtn.on("pointerout", () => {
      backBtn.setStyle({ backgroundColor: "#555555" });
    });
  }

  private showInfoMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height - 80,
      "Objectif : Rétablir le courant pour aider le Joueur A\nUtilisez le terminal Linux pour activer le générateur",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(1000);

    this.time.delayedCall(8000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1000,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showPostItMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "POST-IT TROUVÉ\n\nMAUVAISE PRATIQUE DÉTECTÉE !\n\nNe jamais noter de mots de passe\nsur des post-it visibles !\n\nLogin: root\nPassword: root1234",
      {
        fontSize: "18px",
        color: "#ffff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showLoginPrompt() {
    // Créer un dialogue de connexion
    const dialogBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      500,
      300,
      0x000000,
      0.95
    ).setDepth(2500).setStrokeStyle(4, 0x00ff00);

    const title = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "🔐 CONNEXION TERMINAL",
      {
        fontSize: "22px",
        color: "#00ff00",
        fontStyle: "bold",
      }
    ).setOrigin(0.5).setDepth(2501);

    const instruction = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      "Entrez le mot de passe trouvé sur le post-it :",
      {
        fontSize: "16px",
        color: "#ffffff",
      }
    ).setOrigin(0.5).setDepth(2501);

    // Boutons de choix (ordre mélangé, couleur neutre)
    const wrongBtn1 = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 20,
      "admin123",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#34495e",
        padding: { x: 20, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    const correctBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 70,
      "root1234",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#34495e",
        padding: { x: 20, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    const wrongBtn2 = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 120,
      "hospital2024",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#34495e",
        padding: { x: 20, y: 10 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    const closeBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 170,
      "Annuler",
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#555555",
        padding: { x: 15, y: 8 },
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });

    correctBtn.on("pointerdown", () => {
      this.unlockTerminal();
      [dialogBg, title, instruction, correctBtn, wrongBtn1, wrongBtn2, closeBtn].forEach(obj => obj.destroy());
    });

    wrongBtn1.on("pointerdown", () => {
      this.showWrongPasswordMessage();
    });

    wrongBtn2.on("pointerdown", () => {
      this.showWrongPasswordMessage();
    });

    closeBtn.on("pointerdown", () => {
      [dialogBg, title, instruction, correctBtn, wrongBtn1, wrongBtn2, closeBtn].forEach(obj => obj.destroy());
    });
  }

  private unlockTerminal() {
    this.terminalUnlocked = true;

    if (this.terminalText) {
      this.terminalText.setText(
        "Ubuntu Server 22.04 LTS\n\nHospital Network Terminal\n\n\nlogin: root\nPassword: ********\n\nWelcome, root!\n\nroot@hospital:~$ _"
      );
    }

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "✓ CONNEXION RÉUSSIE\n\nVous êtes maintenant connecté au terminal.\nUtilisez les commandes pour explorer le système.",
      {
        fontSize: "20px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showWrongPasswordMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 180,
      "✗ Mot de passe incorrect",
      {
        fontSize: "16px",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 15, y: 8 },
      }
    ).setOrigin(0.5).setDepth(2502);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showCommandMenu() {
    // Menu de commandes disponibles
    const dialogBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      600,
      500,
      0x000000,
      0.95
    ).setDepth(2500).setStrokeStyle(4, 0x00ff00);

    const title = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 210,
      "💻 COMMANDES DISPONIBLES",
      {
        fontSize: "22px",
        color: "#00ff00",
        fontStyle: "bold",
      }
    ).setOrigin(0.5).setDepth(2501);

    const hint = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 170,
      "Explorez le système pour trouver comment rétablir le courant",
      {
        fontSize: "14px",
        color: "#888888",
        fontStyle: "italic",
      }
    ).setOrigin(0.5).setDepth(2501);

    // Boutons de commandes (couleur neutre, ordre mélangé)
    const pwdBtn = this.createCommandButton("pwd", this.scale.height / 2 - 120, "#34495e");
    const lsBtn = this.createCommandButton("ls", this.scale.height / 2 - 70, "#34495e");
    const catNetworkBtn = this.createCommandButton("cat network.conf", this.scale.height / 2 - 20, "#34495e");
    const catBtn = this.createCommandButton("cat power.cfg", this.scale.height / 2 + 30, "#34495e");
    const sudoBtn = this.createCommandButton("sudo systemctl start power-grid", this.scale.height / 2 + 80, "#34495e");
    const closeBtn = this.createCommandButton("Fermer", this.scale.height / 2 + 150, "#555555");

    // Cacher le bouton systemctl au début (visible seulement si power.cfg a été lu)
    sudoBtn.setVisible(this.powerCfgRead);

    pwdBtn.on("pointerdown", () => {
      this.executeCommand("pwd");
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });

    lsBtn.on("pointerdown", () => {
      this.executeCommand("ls");
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });

    catNetworkBtn.on("pointerdown", () => {
      this.executeCommand("cat network.conf");
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });

    catBtn.on("pointerdown", () => {
      this.executeCommand("cat power.cfg");
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });

    sudoBtn.on("pointerdown", () => {
      this.executeCommand("sudo systemctl start power-grid");
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });

    closeBtn.on("pointerdown", () => {
      [dialogBg, title, hint, pwdBtn, lsBtn, catNetworkBtn, catBtn, sudoBtn, closeBtn].forEach(obj => obj.destroy());
    });
  }

  private createCommandButton(command: string, y: number, bgColor: string = "#34495e"): Phaser.GameObjects.Text {
    return this.add.text(
      this.scale.width / 2,
      y,
      command,
      {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: bgColor,
        padding: { x: 20, y: 10 },
        fontFamily: "Courier New",
      }
    ).setOrigin(0.5).setDepth(2501).setInteractive({ useHandCursor: true });
  }

  private executeCommand(command: string) {
    this.commandHistory.push(command);

    if (command === "pwd") {
      this.updateTerminalText("root@hospital:~$ pwd\n\n/root\n\nroot@hospital:~$ _");
      this.showCommandResult("📂 Répertoire actuel\n\nVous êtes dans /root\nUtilisez 'ls' pour lister les fichiers.");
    } else if (command === "ls") {
      this.updateTerminalText("root@hospital:~$ ls\n\npower.cfg\nnetwork.conf\nsystem.log\n\nroot@hospital:~$ _");
      this.showCommandResult("📁 Fichiers listés\n\nVous voyez plusieurs fichiers.\nExplorez-les avec 'cat <nom_fichier>'");
    } else if (command === "cat network.conf") {
      this.updateTerminalText("root@hospital:~$ cat network.conf\n\n# Network Configuration\n# Hospital LAN Settings\n\nIP: 192.168.1.100\nGateway: 192.168.1.1\nDNS: 8.8.8.8\n\nroot@hospital:~$ _");
      this.showCommandResult("📄 Configuration réseau\n\nCe fichier contient les paramètres réseau.\nCe n'est pas ce que vous cherchez.");
    } else if (command === "cat power.cfg") {
      this.powerCfgRead = true;
      this.updateTerminalText("root@hospital:~$ cat power.cfg\n\n# Power Grid Configuration\n# Emergency Generator Control\n\nPour réactiver le circuit :\nsudo systemctl start power-grid\n\nroot@hospital:~$ _");
      this.showCommandResult("📄 Fichier lu\n\nVous avez trouvé la commande pour\nréactiver le générateur !");
    } else if (command === "sudo systemctl start power-grid") {
      this.restorePower();
    }
  }

  private updateTerminalText(text: string) {
    if (this.terminalText) {
      this.terminalText.setText(text);
    }
  }

  private showCommandResult(text: string) {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      text,
      {
        fontSize: "18px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private restorePower() {
    this.powerRestored = true;

    this.updateTerminalText("root@hospital:~$ sudo systemctl start power-grid\n\n[sudo] password for root: ********\n\nStarting power-grid.service...\n✓ Power grid activated successfully!\n\nroot@hospital:~$ _");

    // Envoyer l'événement réseau au Joueur A
    if (this.net) {
      this.net.send(EVENT_CODES.PUZZLE_UPDATE, { type: "power_restored", by: "PlayerB" });
    }

    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 200,
      "✓ GÉNÉRATEUR ACTIVÉ !\n\nLe courant est rétabli dans tout l'hôpital.\nLe Joueur A peut maintenant ouvrir sa porte.\n\nVous pouvez continuer vers le stockage.",
      {
        fontSize: "22px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private showDoorMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      this.powerRestored 
        ? "Vous pouvez maintenant passer à la salle suivante."
        : "Terminez d'abord votre mission :\nRétablissez le courant pour aider votre coéquipier.",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 15 },
        align: "center",
      }
    ).setOrigin(0.5).setDepth(2500);

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 500,
        onComplete: () => message.destroy(),
      });
    });
  }

  private openNextDoor() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start("MedicineStorageScene", { net: this.net, story: this.story });
    });
  }
}