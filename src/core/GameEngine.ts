// src/core/GameEngine.ts
import { Player, PlayerCreationData } from './Player';
import { EconomySystem } from './Economy';
import { EventSystem } from './Events';
import { TitleSystem } from '../data/Titles';
import { PolicySystem } from './PolicySystem';
import { OllamaService } from './OllamaService';
import { MultiplayerSystem } from './MultiplayerSystem';
import { WikiIntegration } from './WikiIntegration';
import { CitizenSystem } from './CitizenSystem';
import { DemographicSystem } from './DemographicSystem';
import { SocialNetworkSystem } from './SocialNetworkSystem';
import { ClimateSystem } from './ClimateSystem';
import { LandscapeSystem } from './LandscapeSystem';
import { AnimalPopulationSystem } from './AnimalPopulationSystem';
import localforage from 'localforage';

export enum GameState {
  LOBBY = 'LOBBY',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export interface GameConfig {
  maxPlayers: number;
  difficulty: number;
  gameSpeed: number; // months per second speed modifier (higher = faster)
  enableMultiplayer: boolean;
  randomEvents: boolean;
  startingYear: number;
  enableOllama?: boolean;
  ollamaUrl?: string;
  enableWiki?: boolean;
}

export interface SaveMeta {
  slot: string;
  savedAt: string;
  playersCount: number;
  year: number;
}

export class GameEngine {
  private players: Map<string, Player> = new Map();
  private currentYear: number;
  private gameState: GameState;
  // TODO: Reserved for future economy features
  // @ts-expect-error - Unused until economy features are implemented
  private _economy: EconomySystem;
  private events: EventSystem;
  private policySystem: PolicySystem;
  private ollamaService?: OllamaService;
  private multiplayerSystem?: MultiplayerSystem;
  private wikiIntegration?: WikiIntegration;
  private citizenSystem: CitizenSystem;
  private demographicSystem: DemographicSystem;
  private socialNetworkSystem: SocialNetworkSystem;
  private climateSystem: ClimateSystem;
  private landscapeSystem: LandscapeSystem;
  private animalPopulationSystem: AnimalPopulationSystem;
  private config: GameConfig;
  private eventTarget: EventTarget;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = {
      maxPlayers: 6,
      difficulty: 2,
      gameSpeed: 1,
      enableMultiplayer: false,
      randomEvents: true,
      startingYear: 1200,
      enableOllama: false,
      enableWiki: true,
      ...config
    };

    this.currentYear = this.config.startingYear;
    this.gameState = GameState.LOBBY;
    this._economy = new EconomySystem(this.config);
    this.events = new EventSystem();
    this.policySystem = new PolicySystem();
    this.eventTarget = new EventTarget();
    this.currentMonth = 1;
    this._tickHandle = null as any;
    
    // Initialize new population dynamics systems
    this.citizenSystem = new CitizenSystem();
    this.demographicSystem = new DemographicSystem();
    this.socialNetworkSystem = new SocialNetworkSystem();
    
    // Initialize ecological systems (v2.2.3)
    this.climateSystem = new ClimateSystem();
    this.landscapeSystem = new LandscapeSystem();
    this.animalPopulationSystem = new AnimalPopulationSystem();

    // Initialize optional systems
    if (this.config.enableOllama) {
      this.ollamaService = new OllamaService({
        baseUrl: this.config.ollamaUrl
      });
    }

    if (this.config.enableMultiplayer) {
      this.multiplayerSystem = new MultiplayerSystem();
    }

    if (this.config.enableWiki) {
      this.wikiIntegration = new WikiIntegration();
    }
  }

  private currentMonth: number;
  private _tickHandle: any;

  // Öffentliche Methoden
  public getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  public getPlayerById(id: string): Player | undefined {
    return this.players.get(id);
  }

  public getCurrentYear(): number {
    return this.currentYear;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public async startGame(): Promise<void> {
    if (this.players.size === 0) {
      throw new Error('Mindestens ein Spieler benötigt');
    }

    this.gameState = GameState.RUNNING;
    this.emit('gameStateChanged', { state: this.gameState });

    // start auto tick (monthly)
    this.startAutoTick();
  }

  private startAutoTick(): void {
    // Clear existing
    if (this._tickHandle) clearInterval(this._tickHandle);

    const msPerMonth = Math.max(200, Math.floor(1000 / (this.config.gameSpeed || 1))); // default 1s per month
    this._tickHandle = setInterval(() => this.monthlyTick(), msPerMonth);
  }

  public pauseGame(): void {
    if (this.gameState === GameState.RUNNING) {
      this.gameState = GameState.PAUSED;
      if (this._tickHandle) { clearInterval(this._tickHandle); this._tickHandle = null; }
      this.emit('gameStateChanged', { state: this.gameState });
    }
  }

  public resumeGame(): void {
    if (this.gameState === GameState.PAUSED) {
      this.gameState = GameState.RUNNING;
      this.emit('gameStateChanged', { state: this.gameState });
      this.startAutoTick();
    }
  }

  private async monthlyTick(): Promise<void> {
    if (this.gameState !== GameState.RUNNING) return;

    // Update ecological systems
    const avgIndustrialization = this.getAverageIndustrialization();
    this.climateSystem.updateMonth(this.currentYear, this.currentMonth, avgIndustrialization);

    // process each player's month
    for (const player of this.players.values()) {
      await this.processPlayerMonth(player);
    }
    
    // Process population dynamics systems
    this.citizenSystem.processMonth(this.currentYear, this.currentMonth);
    this.demographicSystem.processMonth(this.citizenSystem, this.currentYear, this.currentMonth);
    this.socialNetworkSystem.processInformationSpread(this.citizenSystem, this.currentYear, this.currentMonth);
    this.socialNetworkSystem.processMovements(this.citizenSystem, this.currentYear, this.currentMonth);

    // advance month/year
    this.currentMonth++;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
      this.checkForPromotions();
      
      // Yearly processes for population
      this.socialNetworkSystem.generateSocialRelations(this.citizenSystem, this.currentYear);
      
      // Yearly processes for ecological systems
      this.processEcologicalYear();
      
      this.emit('yearAdvanced', { year: this.currentYear });
    }

    this.emit('monthAdvanced', { month: this.currentMonth, year: this.currentYear });
  }

  private async processPlayerMonth(player: Player): Promise<void> {
    try {
      player.kingdom.processMonth();
    } catch (err) {
      console.warn('kingdom.processMonth failed for', player.id, err);
    }

    // Apply monthly policy effects
    this.policySystem.applyMonthlyEffects(player);

    // small monthly stat adjustments
    this.updatePlayerStats(player);

    // monthly random events
    if (this.config.randomEvents && Math.random() < 0.05) {
      const event = await this.events.getRandomEvent(player, this.currentYear);
      if (event) await this.events.applyEvent(event, player, `${this.currentYear}-${this.currentMonth}`);
    }
  }

  public async nextYear(): Promise<void> {
    if (this.gameState !== GameState.RUNNING) {
      throw new Error('Spiel ist nicht aktiv');
    }

    for (const player of this.players.values()) {
      await this.processPlayerYear(player);
    }

    this.currentYear++;
    this.checkForPromotions();
    this.emit('yearAdvanced', { year: this.currentYear });
  }

  public addPlayer(data: PlayerCreationData): Player {
    if (this.players.size >= this.config.maxPlayers) {
      throw new Error(`Maximale Spieleranzahl (${this.config.maxPlayers}) erreicht`);
    }

    const player = new Player(data);
    this.players.set(player.id, player);
    this.emit('playerAdded', { player: player.serialize() });

    return player;
  }

  public removePlayer(playerId: string): boolean {
    const existed = this.players.delete(playerId);
    if (existed) {
      this.emit('playerRemoved', { playerId });
    }
    return existed;
  }

  public setTaxRate(playerId: string, rate: number): void {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Spieler nicht gefunden');

    const clampedRate = Math.max(0, Math.min(0.5, rate));
    player.kingdom.taxRate = clampedRate;
    
    this.emit('taxRateChanged', { playerId, taxRate: clampedRate });
  }

  public async buildForPlayer(playerId: string, type: string): Promise<boolean> {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Spieler nicht gefunden');

    let success = false;
    
    // Map UI building keys to Kingdom.infrastructure keys
    switch (type) {
      case 'market':
        success = player.kingdom.buildMarket();
        break;
      case 'farm':
        success = player.kingdom.buildFarm();
        break;
      case 'mill':
        success = player.kingdom.buildMill();
        break;
      case 'mine':
        success = player.kingdom.buildStructure('mines');
        break;
      case 'barracks':
        success = player.kingdom.buildStructure('barracks');
        break;
      case 'walls':
        success = player.kingdom.buildStructure('walls');
        break;
      case 'workshop':
      case 'workshops':
        success = player.kingdom.buildStructure('workshops');
        break;
      default:
        success = false;
        break;
    }

    if (success) {
      this.emit('buildingConstructed', { playerId, building: type });
    }

    return success;
  }

  public recruitForPlayer(playerId: string, count: number, type: 'infantry' | 'cavalry' | 'archers' = 'infantry'): boolean {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Spieler nicht gefunden');

    const success = player.kingdom.recruitSoldiers(count, type);
    
    if (success) {
      this.emit('militaryRecruited', { playerId, count });
    }

    return success;
  }

  // Event System
  public on(eventName: string, listener: (detail: any) => void): void {
    this.eventTarget.addEventListener(eventName, (event: Event) => {
      const customEvent = event as CustomEvent;
      listener(customEvent.detail);
    });
  }

  private emit(eventName: string, detail: any): void {
    this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Private Hilfsmethoden
  private async processPlayerYear(player: Player): Promise<void> {
    // Führe das Jahres-Update für das Königreich und den Spieler aus
    try {
      player.kingdom.processYear();
    } catch (err) {
      console.warn('kingdom.processYear failed for', player.id, err);
    }

    try {
      player.processYear();
    } catch (err) {
      console.warn('player.processYear failed for', player.id, err);
    }

    // Apply yearly policy effects
    this.policySystem.applyYearlyEffects(player);

    // Zufallsereignisse
    if (this.config.randomEvents) {
      const event = await this.events.getRandomEvent(player, this.currentYear);
      if (event) {
        await this.events.applyEvent(event, player, this.currentYear.toString());
      }
    }

    // Spielerstatistiken aktualisieren
    this.updatePlayerStats(player);
  }

  private updatePlayerStats(player: Player): void {
    // Beliebtheit basierend auf Steuersatz und Zufriedenheit
    const popularityChange = 
      (player.kingdom.happiness / 100) * 10 - 
      (player.kingdom.taxRate * 20);
    
    // Ruhm basierend auf Infrastruktur und Militär
    const prestigeChange = 
      player.kingdom.infrastructure.markets * 0.5 +
      player.kingdom.infrastructure.farms * 0.3 +
      player.kingdom.military.infantry * 0.1;
    
    player.updateStats({
      popularity: player.stats.popularity + popularityChange,
      prestige: player.stats.prestige + prestigeChange
    });
  }

  private checkForPromotions(): void {
    for (const player of this.players.values()) {
      const score = this.calculatePlayerScore(player);
      const newTitle = TitleSystem.getTitleForScore(score);

      if (newTitle.rank > player.title.rank) {
        // Convert Title (TitleSystem) to PlayerTitle shape expected by Player.promoteTitle
        const playerTitle = {
          name: newTitle.name,
          rank: newTitle.rank,
          requirements: {
            prestige: (newTitle.requirements as any).minPrestige ?? 0,
            authority: (newTitle.requirements as any).minAuthority ?? 0,
            kingdomScore: (newTitle.requirements as any).minKingdomScore
          },
          benefits: {
            goldPerYear: newTitle.benefits.goldPerYear ?? 0,
            authorityBonus: Math.floor((newTitle.benefits.diplomaticWeight || 0) / 10),
            prestigeBonus: Math.floor((newTitle.benefits.goldPerYear || 0) / 1000),
            specialPrivileges: newTitle.benefits.specialPrivileges
          }
        } as any;

        const promotionResult = player.promoteTitle(playerTitle);
        if (promotionResult.success) {
          this.emit('titlePromotion', {
            playerId: player.id,
            playerName: player.name,
            newTitle: playerTitle
          });
        }
      }
    }
  }
  private calculatePlayerScore(player: Player): number {
    const kingdomScore = player.kingdom.calculateTotalScore();
    const playerScore = player.calculateTotalScore();
    const difficultyMultiplier = 1 + (this.config.difficulty - 1) * 0.5;
    
    return (kingdomScore + playerScore) / difficultyMultiplier;
  }

  // Speicherfunktionen
  public async saveGame(slot: string = 'default'): Promise<void> {
    const saveData = {
      players: Array.from(this.players.values()).map(p => p.serialize()),
      currentYear: this.currentYear,
      currentMonth: this.currentMonth,
      gameState: this.gameState,
      config: this.config,
      climateSystem: this.climateSystem.serialize(),
      landscapeSystem: this.landscapeSystem.serialize(),
      animalPopulationSystem: this.animalPopulationSystem.serialize(),
      savedAt: new Date().toISOString()
    };

    await localforage.setItem(`kaiser-ii-save-${slot}`, saveData);
    
    // Save-Index aktualisieren
    const index: SaveMeta[] = (await localforage.getItem('kaiser-ii-saves-index')) || [];
    const existingIndex = index.findIndex(item => item.slot === slot);
    
    const meta: SaveMeta = {
      slot,
      savedAt: new Date().toISOString(),
      playersCount: this.players.size,
      year: this.currentYear
    };
    
    if (existingIndex >= 0) {
      index[existingIndex] = meta;
    } else {
      index.push(meta);
    }
    
    await localforage.setItem('kaiser-ii-saves-index', index);
  }

  public async loadGame(slot: string = 'default'): Promise<void> {
    const saveData = await localforage.getItem<any>(`kaiser-ii-save-${slot}`);
    
    if (!saveData) {
      throw new Error(`Spielstand "${slot}" nicht gefunden`);
    }

    this.players.clear();
    
    for (const playerData of saveData.players) {
      const player = Player.deserialize(playerData);
      this.players.set(player.id, player);
    }
    
    this.currentYear = saveData.currentYear;
    this.currentMonth = saveData.currentMonth || 1;
    this.gameState = saveData.gameState;
    this.config = saveData.config;
    
    // Load ecological systems (v2.2.3)
    if (saveData.climateSystem) {
      this.climateSystem = ClimateSystem.deserialize(saveData.climateSystem);
    }
    if (saveData.landscapeSystem) {
      this.landscapeSystem = LandscapeSystem.deserialize(saveData.landscapeSystem);
    }
    if (saveData.animalPopulationSystem) {
      this.animalPopulationSystem = AnimalPopulationSystem.deserialize(saveData.animalPopulationSystem);
    }
    
    this.emit('gameLoaded', { slot });
  }

  public async listSaves(): Promise<SaveMeta[]> {
    const index: SaveMeta[] = (await localforage.getItem('kaiser-ii-saves-index')) || [];
    return index.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  }

  public async deleteSave(slot: string): Promise<void> {
    await localforage.removeItem(`kaiser-ii-save-${slot}`);
    
    const index: SaveMeta[] = (await localforage.getItem('kaiser-ii-saves-index')) || [];
    const filteredIndex = index.filter(item => item.slot !== slot);
    
    await localforage.setItem('kaiser-ii-saves-index', filteredIndex);
  }

  // === New System Accessors ===

  /**
   * Get the policy system
   */
  public getPolicySystem(): PolicySystem {
    return this.policySystem;
  }

  /**
   * Get the Ollama service (if enabled)
   */
  public getOllamaService(): OllamaService | undefined {
    return this.ollamaService;
  }

  /**
   * Get the multiplayer system (if enabled)
   */
  public getMultiplayerSystem(): MultiplayerSystem | undefined {
    return this.multiplayerSystem;
  }

  /**
   * Get the wiki integration (if enabled)
   */
  public getWikiIntegration(): WikiIntegration | undefined {
    return this.wikiIntegration;
  }

  /**
   * Enable Ollama service at runtime
   */
  public enableOllama(config?: { baseUrl?: string; model?: string }): void {
    if (!this.ollamaService) {
      this.ollamaService = new OllamaService(config);
      this.config.enableOllama = true;
    }
  }

  /**
   * Enable multiplayer at runtime
   */
  public enableMultiplayer(): void {
    if (!this.multiplayerSystem) {
      this.multiplayerSystem = new MultiplayerSystem();
      this.config.enableMultiplayer = true;
    }
  }

  /**
   * Get current month
   */
  public getCurrentMonth(): number {
    return this.currentMonth;
  }
  
  /**
   * Get the citizen system
   */
  public getCitizenSystem(): CitizenSystem {
    return this.citizenSystem;
  }
  
  /**
   * Get the demographic system
   */
  public getDemographicSystem(): DemographicSystem {
    return this.demographicSystem;
  }
  
  /**
   * Get the social network system
   */
  public getSocialNetworkSystem(): SocialNetworkSystem {
    return this.socialNetworkSystem;
  }
  
  /**
   * Get the climate system (v2.2.3)
   */
  public getClimateSystem(): ClimateSystem {
    return this.climateSystem;
  }
  
  /**
   * Get the landscape system (v2.2.3)
   */
  public getLandscapeSystem(): LandscapeSystem {
    return this.landscapeSystem;
  }
  
  /**
   * Get the animal population system (v2.2.3)
   */
  public getAnimalPopulationSystem(): AnimalPopulationSystem {
    return this.animalPopulationSystem;
  }
  
  /**
   * Get population statistics
   */
  public getPopulationStats() {
    return {
      total: this.citizenSystem.getPopulation(),
      demographics: this.demographicSystem.calculateStatistics(this.citizenSystem),
      agePyramid: this.demographicSystem.calculateAgePyramid(this.citizenSystem),
      activeDiseases: this.demographicSystem.getActiveDiseases(),
      activeFamines: this.demographicSystem.getActiveFamines(),
      activeMovements: this.socialNetworkSystem.getActiveMovements()
    };
  }
  
  /**
   * Get ecological statistics (v2.2.3)
   */
  public getEcologicalStats() {
    return {
      climate: {
        currentSeason: this.climateSystem.getCurrentSeason(),
        currentWeather: this.climateSystem.getCurrentWeather(),
        climateChange: this.climateSystem.getClimateChange(),
        activeDisasters: this.climateSystem.getActiveDisasters(),
        resourceStates: this.climateSystem.getAllResourceStates()
      },
      landscape: {
        forests: this.landscapeSystem.getForests(),
        rivers: this.landscapeSystem.getRivers(),
        landUse: this.landscapeSystem.getLandUse(),
        recentChanges: this.landscapeSystem.getRecentChanges(10),
        activeProjects: this.landscapeSystem.getActiveProjects(),
        averageSoilQuality: this.landscapeSystem.getAverageSoilQuality()
      },
      animals: {
        wildlife: this.animalPopulationSystem.getWildlifeSpecies(),
        livestock: this.animalPopulationSystem.getLivestockSpecies(),
        endangered: this.animalPopulationSystem.getEndangeredSpecies(),
        extinct: this.animalPopulationSystem.getExtinctSpecies(),
        activeMigrations: this.animalPopulationSystem.getActiveMigrations(),
        totalWildlife: this.animalPopulationSystem.getTotalWildlifePopulation(),
        totalLivestock: this.animalPopulationSystem.getTotalLivestockPopulation()
      }
    };
  }
  
  /**
   * Process yearly ecological updates
   */
  private processEcologicalYear(): void {
    const totalPopulation = this.citizenSystem.getPopulation();
    const avgIndustrialization = this.getAverageIndustrialization();
    const climateData = this.climateSystem.getClimateChange();
    const totalForestArea = this.landscapeSystem.getTotalForestArea();
    
    // Update landscape
    this.landscapeSystem.updateYear(
      this.currentYear,
      totalPopulation,
      avgIndustrialization,
      climateData.globalTemperature
    );
    
    // Update animal populations
    const avgRiver = this.landscapeSystem.getRivers()[0];
    const waterPollution = avgRiver ? avgRiver.pollution : 20;
    const huntingPressure = this.getHuntingPressure();
    
    this.animalPopulationSystem.updateYear(
      this.currentYear,
      totalForestArea,
      waterPollution,
      huntingPressure,
      climateData.globalTemperature
    );
    
    // Apply ecological effects to players
    this.applyEcologicalEffects();
  }
  
  /**
   * Get average industrialization level across all players
   */
  private getAverageIndustrialization(): number {
    if (this.players.size === 0) return 0;
    
    let total = 0;
    for (const player of this.players.values()) {
      // Estimate industrialization from infrastructure
      const kingdom = player.kingdom;
      const industrial = 
        (kingdom.infrastructure.workshops || 0) * 10 +
        (kingdom.infrastructure.mines || 0) * 5 +
        (kingdom.infrastructure.roads || 0) * 2;
      total += Math.min(100, industrial);
    }
    
    return total / this.players.size;
  }
  
  /**
   * Get hunting pressure across all players
   */
  private getHuntingPressure(): number {
    // Base pressure from population
    const totalPop = this.citizenSystem.getPopulation();
    return Math.min(100, totalPop / 1000);
  }
  
  /**
   * Apply ecological effects to all players
   */
  private applyEcologicalEffects(): void {
    const seasonalEffects = this.climateSystem.getSeasonalEffects();
    const weatherEffects = this.climateSystem.getWeatherEffects();
    const activeDisasters = this.climateSystem.getActiveDisasters();
    
    for (const player of this.players.values()) {
      const kingdom = player.kingdom;
      
      // Apply seasonal effects
      kingdom.happiness = Math.max(0, Math.min(100, 
        kingdom.happiness * seasonalEffects.happinessModifier
      ));
      
      // Apply weather effects
      kingdom.happiness = Math.max(0, Math.min(100,
        kingdom.happiness * weatherEffects.happinessModifier
      ));
      
      // Apply disaster effects
      for (const disaster of activeDisasters) {
        kingdom.resources.gold = Math.max(0, kingdom.resources.gold - disaster.economicDamage);
        kingdom.resources.food = Math.max(0, kingdom.resources.food - disaster.cropDamage);
        kingdom.happiness = Math.max(0, kingdom.happiness - disaster.severity);
        
        // Emit disaster event
        this.emit('naturalDisaster', {
          playerId: player.id,
          disaster: {
            type: disaster.type,
            severity: disaster.severity,
            casualties: disaster.casualties
          }
        });
      }
    }
  }
}