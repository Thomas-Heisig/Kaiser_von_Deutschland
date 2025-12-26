// src/main.ts
import { GameEngine } from './core/GameEngine';
import { GameUI } from './ui/GameUI';
import '/styles/main.css';

class KaiserIIGame {
  private engine: GameEngine;
  private ui: GameUI;

  constructor() {
    this.engine = new GameEngine({
      maxPlayers: 4,
      difficulty: 2,
      gameSpeed: 1,
      randomEvents: true
    });

    this.ui = new GameUI(this.engine, 'app');
    
    this.initializeDemoGame();
  }

  private async initializeDemoGame(): Promise<void> {
    // Demo-Spieler für schnellen Start
    try {
      const player = this.engine.addPlayer({
        name: 'Heinrich',
        gender: 'male',
        kingdomName: 'Mittelreich',
        difficulty: 2
      });
      
      // Start game automatically for demo so Next Year works
      await this.engine.startGame();
      this.ui.showKingdomView(player);
    } catch (error) {
      console.error('Demo-Spieler konnte nicht erstellt werden:', error);
    }
  }
}

// Spiel starten, wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  new KaiserIIGame();
});

// Globale Exporte für Entwicklertools
(window as any).KaiserII = {
  GameEngine,
  GameUI
};