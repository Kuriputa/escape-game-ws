/**
 * GameState - Gère l'état global du jeu qui persiste entre les scènes
 */

export interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export class GameState {
  private static instance: GameState;
  
  // État de l'inventaire du joueur
  public playerInventory: InventoryItem[] = [];
  
  // État des items dans la boîte (true = disponible, false = pris)
  public boxItems: Map<string, boolean> = new Map();
  
  // État de la boîte
  public boxUnlocked: boolean = false;
  
  // État des puzzles
  public puzzlesSolved: Set<string> = new Set();

  private constructor() {
    // Initialiser les items de la boîte
    this.boxItems.set("carte", true);
    this.boxItems.set("badge", true);
    this.boxItems.set("postit", true);
  }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  // Ajouter un item à l'inventaire
  public addToInventory(item: InventoryItem): boolean {
    if (this.playerInventory.length >= 5) {
      return false; // Inventaire plein
    }
    this.playerInventory.push(item);
    return true;
  }

  // Retirer un item de l'inventaire
  public removeFromInventory(itemId: string): InventoryItem | null {
    const index = this.playerInventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = this.playerInventory[index];
      this.playerInventory.splice(index, 1);
      return item;
    }
    return null;
  }

  // Vérifier si le joueur a un item
  public hasItem(itemId: string): boolean {
    return this.playerInventory.some(item => item.id === itemId);
  }

  // Réinitialiser l'état (pour recommencer le jeu)
  public reset() {
    this.playerInventory = [];
    this.boxItems.clear();
    this.boxItems.set("carte", true);
    this.boxItems.set("badge", true);
    this.boxItems.set("postit", true);
    this.boxUnlocked = false;
    this.puzzlesSolved.clear();
  }
}