import Phaser from 'phaser';
import { Net, EVENT_CODES } from '../net/photonClient';
import { Story } from 'inkjs';

interface InventoryItem {
    name: string;
    color: number;
    icon: string;
    slotIndex: number;
}

export class GameScene extends Phaser.Scene {
    private inventory: InventoryItem[] = [];
    private maxInventorySlots = 5;
    private inventorySlots: Phaser.GameObjects.Rectangle[] = [];
    private dialogueActive = false;
    private dialogueContainer!: Phaser.GameObjects.Container;
    private dialogueText!: Phaser.GameObjects.Text;
    private boxInventoryContainer!: Phaser.GameObjects.Container;
    private boxItems: Phaser.GameObjects.Container[] = [];
    private net?: Net;
    private story?: Story;

    constructor() {
        super('GameScene');
    }

    init(data: { net?: Net; story?: Story }) {
        this.net = data.net;
        this.story = data.story;
    }

    create() {
        // Fond de la salle (couleur beige/gris hôpital)
        this.add.rectangle(640, 360, 1280, 720, 0xd4d4d4);
        
        // Murs et sol pour donner une perspective
        this.add.rectangle(640, 600, 1280, 240, 0x8b8b8b); // Sol
        this.add.rectangle(640, 200, 1280, 400, 0xe8e8e8); // Mur du fond
        
        // Ajouter des détails à la salle
        const line = this.add.line(640, 480, 0, 0, 1280, 0, 0x666666);
        line.setLineWidth(3);
        
        // Porte
        this.add.rectangle(200, 350, 100, 200, 0x5a5a5a);
        this.add.rectangle(200, 350, 90, 190, 0x4a4a4a);
        this.add.circle(230, 350, 8, 0x888888);
        
        // Fenêtre
        this.add.rectangle(900, 250, 150, 120, 0x87ceeb, 0.6);
        this.add.rectangle(900, 250, 150, 120).setStrokeStyle(4, 0x666666);
        this.add.line(900, 250, 0, -60, 0, 60, 0x666666).setLineWidth(4);
        this.add.line(900, 250, -75, 0, 75, 0, 0x666666).setLineWidth(4);
        
        // Titre
        this.add.text(640, 30, 'Salle d\'hôpital - Mission d\'infiltration', {
            fontSize: '28px',
            color: '#2c3e50',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.createWalkieTalkie();
        this.createBox();
        this.createInventoryBar();
        this.createDialogueOverlay();
        this.createBoxInventoryOverlay();

        // Écouter les événements réseau
        if (this.net) {
            this.setupNetworkListeners();
        }
    }

    private setupNetworkListeners() {
        // Synchroniser la prise d'objets entre joueurs
        const originalOnEvent = this.net!.onEvent;
        this.net!.onEvent = (code: number, data: any) => {
            if (code === EVENT_CODES.ITEM_PICKED) {
                console.log(`${data.playerId} a pris: ${data.itemName}`);
                // Marquer l'objet comme pris pour tous les joueurs
                this.markItemAsTaken(data.itemName);
            }
            // Appeler le handler original
            originalOnEvent?.(code, data);
        };
    }

    private markItemAsTaken(itemName: string) {
        const item = this.boxItems.find(i => i.getData('itemName') === itemName);
        if (item && !item.getData('taken')) {
            item.setData('taken', true);
            item.setAlpha(0.3);
        }
    }

    private createWalkieTalkie() {
        const walkieTalkieContainer = this.add.container(400, 520);
        
        const body = this.add.rectangle(0, 0, 60, 100, 0x2c3e50);
        body.setInteractive({ useHandCursor: true });
        
        const antenna = this.add.rectangle(0, -60, 5, 30, 0x95a5a6);
        const screen = this.add.rectangle(0, -15, 40, 25, 0x1a472a);
        const button1 = this.add.circle(-10, 20, 6, 0xe74c3c);
        const button2 = this.add.circle(10, 20, 6, 0x3498db);
        
        for (let i = 0; i < 5; i++) {
            const line = this.add.line(0, 40 + i * 5, -15, 0, 15, 0, 0x7f8c8d);
            line.setLineWidth(2);
            walkieTalkieContainer.add(line);
        }
        
        walkieTalkieContainer.add([body, antenna, screen, button1, button2]);
        
        const label = this.add.text(400, 590, '📻 Talkie-walkie\n(Cliquez pour écouter)', {
            fontSize: '14px',
            color: '#2c3e50',
            fontFamily: 'Arial',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        body.on('pointerover', () => {
            body.setFillStyle(0x34495e);
            walkieTalkieContainer.setScale(1.1);
            label.setColor('#e74c3c');
        });

        body.on('pointerout', () => {
            body.setFillStyle(0x2c3e50);
            walkieTalkieContainer.setScale(1);
            label.setColor('#2c3e50');
        });

        body.on('pointerdown', () => {
            this.showDialogue();
            this.tweens.add({
                targets: walkieTalkieContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
            });
        });
    }

    private createBox() {
        const boxContainer = this.add.container(1050, 550);
        
        const boxFront = this.add.rectangle(0, 0, 120, 120, 0x8b4513);
        boxFront.setInteractive({ useHandCursor: true });
        
        const lid = this.add.rectangle(0, -60, 120, 10, 0x654321);
        const shadow = this.add.rectangle(5, 5, 120, 120, 0x000000, 0.2);
        const lock = this.add.rectangle(0, 0, 20, 30, 0xffd700);
        const keyhole = this.add.circle(0, 0, 4, 0x000000);
        
        boxContainer.add([shadow, boxFront, lid, lock, keyhole]);
        
        const label = this.add.text(1050, 630, '📦 Boîte mystérieuse\n(Cliquez pour ouvrir)', {
            fontSize: '14px',
            color: '#2c3e50',
            fontFamily: 'Arial',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        boxFront.on('pointerover', () => {
            boxFront.setFillStyle(0xa0522d);
            boxContainer.setScale(1.05);
            label.setColor('#e74c3c');
        });

        boxFront.on('pointerout', () => {
            boxFront.setFillStyle(0x8b4513);
            boxContainer.setScale(1);
            label.setColor('#2c3e50');
        });

        boxFront.on('pointerdown', () => {
            this.showBoxInventory();
            this.tweens.add({
                targets: lid,
                y: -70,
                angle: -10,
                duration: 300,
                ease: 'Back.easeOut'
            });
        });
    }

    private createInventoryBar() {
        const barY = 670;
        const startX = 640 - (this.maxInventorySlots * 70) / 2 + 35;

        this.add.rectangle(640, barY, this.maxInventorySlots * 70 + 20, 80, 0x000000, 0.7);

        for (let i = 0; i < this.maxInventorySlots; i++) {
            const x = startX + i * 70;
            const slot = this.add.rectangle(x, barY, 60, 60, 0x444444);
            slot.setStrokeStyle(2, 0x888888);
            slot.setInteractive();
            slot.setData('slotIndex', i);
            slot.setData('isEmpty', true);
            this.inventorySlots.push(slot);
        }
    }

    private createDialogueOverlay() {
        this.dialogueContainer = this.add.container(640, 600);
        this.dialogueContainer.setVisible(false);
        this.dialogueContainer.setDepth(1000);

        const dialogueBg = this.add.rectangle(0, 0, 1000, 180, 0x000000, 0.85);
        dialogueBg.setStrokeStyle(3, 0x2c3e50);

        this.dialogueText = this.add.text(0, -50, '', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 950 }
        }).setOrigin(0.5);

        const closeButton = this.add.rectangle(0, 60, 150, 40, 0x2c3e50);
        closeButton.setInteractive({ useHandCursor: true });
        const closeText = this.add.text(0, 60, 'Fermer', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        closeButton.on('pointerover', () => closeButton.setFillStyle(0x34495e));
        closeButton.on('pointerout', () => closeButton.setFillStyle(0x2c3e50));
        closeButton.on('pointerdown', () => this.hideDialogue());

        this.dialogueContainer.add([dialogueBg, this.dialogueText, closeButton, closeText]);
    }

    private createBoxInventoryOverlay() {
        this.boxInventoryContainer = this.add.container(640, 360);
        this.boxInventoryContainer.setVisible(false);
        this.boxInventoryContainer.setDepth(1000);

        const bg = this.add.rectangle(0, 0, 600, 400, 0x1a1a1a, 0.95);
        bg.setStrokeStyle(3, 0x2c3e50);

        const title = this.add.text(0, -170, 'Contenu de la boîte', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const items = [
            { name: 'Carte', color: 0xffffff, icon: '🗺️' },
            { name: 'Badge "Salle Info"', color: 0x3498db, icon: '🔖' },
            { name: 'Post-it "Mot de passe"', color: 0xf1c40f, icon: '📝' }
        ];

        const startX = -200;
        const startY = -50;

        items.forEach((item, index) => {
            const x = startX + (index % 3) * 200;
            const y = startY + Math.floor(index / 3) * 120;

            const itemContainer = this.add.container(x, y);
            const itemRect = this.add.rectangle(0, 0, 80, 80, item.color);
            itemRect.setStrokeStyle(2, 0x888888);
            itemRect.setInteractive({ useHandCursor: true });

            const itemIcon = this.add.text(0, 0, item.icon, {
                fontSize: '40px'
            }).setOrigin(0.5);

            const itemName = this.add.text(0, 60, item.name, {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 150 }
            }).setOrigin(0.5);

            itemContainer.add([itemRect, itemIcon, itemName]);
            itemContainer.setData('itemName', item.name);
            itemContainer.setData('itemColor', item.color);
            itemContainer.setData('itemIcon', item.icon);
            itemContainer.setData('taken', false);

            itemRect.on('pointerdown', () => {
                if (!itemContainer.getData('taken')) {
                    this.addToInventory(itemContainer);
                }
            });

            this.boxItems.push(itemContainer);
        });

        const closeButton = this.add.rectangle(0, 160, 150, 40, 0x2c3e50);
        closeButton.setInteractive({ useHandCursor: true });
        const closeText = this.add.text(0, 160, 'Fermer', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        closeButton.on('pointerover', () => closeButton.setFillStyle(0x34495e));
        closeButton.on('pointerout', () => closeButton.setFillStyle(0x2c3e50));
        closeButton.on('pointerdown', () => this.hideBoxInventory());

        this.boxInventoryContainer.add([bg, title, closeButton, closeText]);
        this.boxItems.forEach(item => this.boxInventoryContainer.add(item));
    }

    private showDialogue() {
        if (this.dialogueActive) return;
        
        this.dialogueActive = true;
        
        // Utiliser Ink si disponible, sinon texte par défaut
        let dialogue = '';
        if (this.story) {
            while (this.story.canContinue) {
                dialogue += this.story.Continue();
            }
        } else {
            dialogue = `Collaborateur PNJ : "Bonjour agent ! Votre mission est cruciale.\n\n` +
                `Vous devez récupérer des informations sensibles dans cet hôpital.\n` +
                `J'ai repéré une boîte dans le coin de la pièce qui contient des éléments importants.\n\n` +
                `Récupérez son contenu et préparez-vous pour la suite de la mission. Bonne chance !"`;
        }
        
        this.dialogueText.setText(dialogue);
        this.dialogueContainer.setVisible(true);
    }

    private hideDialogue() {
        this.dialogueActive = false;
        this.dialogueContainer.setVisible(false);
    }

    private showBoxInventory() {
        this.boxInventoryContainer.setVisible(true);
    }

    private hideBoxInventory() {
        this.boxInventoryContainer.setVisible(false);
    }

    private addToInventory(itemContainer: Phaser.GameObjects.Container) {
        if (this.inventory.length >= this.maxInventorySlots) {
            console.log('Inventaire plein !');
            return;
        }

        itemContainer.setData('taken', true);
        itemContainer.setAlpha(0.3);

        const emptySlotIndex = this.inventorySlots.findIndex(slot => slot.getData('isEmpty'));
        if (emptySlotIndex === -1) return;

        const slot = this.inventorySlots[emptySlotIndex];
        
        const itemData: InventoryItem = {
            name: itemContainer.getData('itemName'),
            color: itemContainer.getData('itemColor'),
            icon: itemContainer.getData('itemIcon'),
            slotIndex: emptySlotIndex
        };

        this.inventory.push(itemData);

        const slotX = slot.x;
        const slotY = slot.y;

        const inventoryItem = this.add.rectangle(slotX, slotY, 50, 50, itemData.color);
        const inventoryIcon = this.add.text(slotX, slotY, itemData.icon, {
            fontSize: '30px'
        }).setOrigin(0.5);

        inventoryItem.setDepth(100);
        inventoryIcon.setDepth(101);

        slot.setData('isEmpty', false);
        slot.setData('item', inventoryItem);
        slot.setData('icon', inventoryIcon);

        console.log(`${itemData.name} ajouté à l'inventaire !`);

        // Envoyer l'événement réseau si connecté
        if (this.net) {
            this.net.send(EVENT_CODES.ITEM_PICKED, {
                itemName: itemData.name,
                playerId: (this.net as any).nickname,
                timestamp: Date.now()
            });
        }
    }
}