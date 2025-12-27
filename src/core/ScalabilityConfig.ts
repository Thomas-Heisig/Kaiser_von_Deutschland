/**
 * Scalability Configuration System
 * 
 * Manages performance and scalability settings for the game.
 * Automatically adjusts simulation detail based on population size
 * and system performance.
 */

export interface ScalabilityThresholds {
  /** Population threshold for full individual simulation */
  fullSimulationThreshold: number;
  /** Population threshold for hybrid simulation */
  hybridSimulationThreshold: number;
  /** Maximum number of individual citizens to track in detail */
  maxDetailedCitizens: number;
  /** Maximum number of social relationships to track per citizen */
  maxRelationshipsPerCitizen: number;
  /** Sample size for social interaction calculations (percentage) */
  socialInteractionSampleRate: number;
  /** Maximum events to process per game tick */
  maxEventsPerTick: number;
  /** Maximum battles to simulate simultaneously */
  maxConcurrentBattles: number;
  /** Maximum units per battle before aggregation */
  maxUnitsPerBattleDetail: number;
  /** Grid size for spatial partitioning */
  spatialGridSize: number;
  /** Maximum migration calculations per tick */
  maxMigrationsPerTick: number;
  /** Cache timeout for expensive calculations (ms) */
  cacheTimeout: number;
}

export interface PerformanceMetrics {
  /** Current population size */
  currentPopulation: number;
  /** Average tick time (ms) */
  averageTickTime: number;
  /** Peak memory usage (MB) */
  peakMemoryUsage: number;
  /** Number of active events */
  activeEvents: number;
  /** Current simulation mode */
  simulationMode: 'full' | 'hybrid' | 'aggregated';
  /** Performance warning level */
  warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export class ScalabilityConfig {
  private static instance: ScalabilityConfig;
  
  /** Default thresholds optimized for modern browsers */
  private thresholds: ScalabilityThresholds = {
    fullSimulationThreshold: 10000,
    hybridSimulationThreshold: 100000,
    maxDetailedCitizens: 50000,
    maxRelationshipsPerCitizen: 20,
    socialInteractionSampleRate: 0.1, // 10% sampling
    maxEventsPerTick: 100,
    maxConcurrentBattles: 5,
    maxUnitsPerBattleDetail: 10000,
    spatialGridSize: 100,
    maxMigrationsPerTick: 1000,
    cacheTimeout: 5000
  };

  /** Current performance metrics */
  private metrics: PerformanceMetrics = {
    currentPopulation: 0,
    averageTickTime: 0,
    peakMemoryUsage: 0,
    activeEvents: 0,
    simulationMode: 'full',
    warningLevel: 'none'
  };

  /** Tick times for averaging */
  private tickTimes: number[] = [];
  private maxTickSamples = 100;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ScalabilityConfig {
    if (!ScalabilityConfig.instance) {
      ScalabilityConfig.instance = new ScalabilityConfig();
    }
    return ScalabilityConfig.instance;
  }

  /**
   * Get current thresholds
   */
  public getThresholds(): ScalabilityThresholds {
    return { ...this.thresholds };
  }

  /**
   * Update thresholds
   */
  public setThresholds(thresholds: Partial<ScalabilityThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    this.updateSimulationMode();
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Update population count
   */
  public updatePopulation(population: number): void {
    this.metrics.currentPopulation = population;
    this.updateSimulationMode();
  }

  /**
   * Record tick time for performance monitoring
   */
  public recordTickTime(timeMs: number): void {
    this.tickTimes.push(timeMs);
    if (this.tickTimes.length > this.maxTickSamples) {
      this.tickTimes.shift();
    }
    
    this.metrics.averageTickTime = 
      this.tickTimes.reduce((a, b) => a + b, 0) / this.tickTimes.length;
    
    this.updateWarningLevel();
  }

  /**
   * Update active events count
   */
  public updateActiveEvents(count: number): void {
    this.metrics.activeEvents = count;
  }

  /**
   * Get recommended simulation mode based on population
   */
  public getSimulationMode(): 'full' | 'hybrid' | 'aggregated' {
    return this.metrics.simulationMode;
  }

  /**
   * Check if population should use full simulation
   */
  public shouldUseFullSimulation(): boolean {
    return this.metrics.currentPopulation < this.thresholds.fullSimulationThreshold;
  }

  /**
   * Check if population should use hybrid simulation
   */
  public shouldUseHybridSimulation(): boolean {
    return this.metrics.currentPopulation >= this.thresholds.fullSimulationThreshold &&
           this.metrics.currentPopulation < this.thresholds.hybridSimulationThreshold;
  }

  /**
   * Check if population should use aggregated simulation
   */
  public shouldUseAggregatedSimulation(): boolean {
    return this.metrics.currentPopulation >= this.thresholds.hybridSimulationThreshold;
  }

  /**
   * Get sample size for social interactions
   */
  public getSocialInteractionSampleSize(totalPopulation: number): number {
    if (this.shouldUseFullSimulation()) {
      return totalPopulation; // Process all
    }
    return Math.max(
      1000, // Minimum sample
      Math.floor(totalPopulation * this.thresholds.socialInteractionSampleRate)
    );
  }

  /**
   * Get maximum relationships to track for a citizen
   */
  public getMaxRelationships(): number {
    if (this.shouldUseAggregatedSimulation()) {
      return Math.floor(this.thresholds.maxRelationshipsPerCitizen * 0.5);
    }
    return this.thresholds.maxRelationshipsPerCitizen;
  }

  /**
   * Check if should batch events
   */
  public shouldBatchEvents(eventCount: number): boolean {
    return eventCount > this.thresholds.maxEventsPerTick;
  }

  /**
   * Get spatial grid size for partitioning
   */
  public getSpatialGridSize(): number {
    return this.thresholds.spatialGridSize;
  }

  /**
   * Check if performance is acceptable
   */
  public isPerformanceAcceptable(): boolean {
    return this.metrics.warningLevel === 'none' || 
           this.metrics.warningLevel === 'low';
  }

  /**
   * Get performance warning message
   */
  public getPerformanceWarning(): string | null {
    switch (this.metrics.warningLevel) {
      case 'none':
      case 'low':
        return null;
      case 'medium':
        return 'Performance degradation detected. Consider reducing population or detail level.';
      case 'high':
        return 'Significant performance issues. Simulation detail automatically reduced.';
      case 'critical':
        return 'Critical performance issues! Game may become unplayable. Reduce population immediately.';
      default:
        return null;
    }
  }

  /**
   * Update simulation mode based on population
   */
  private updateSimulationMode(): void {
    if (this.shouldUseAggregatedSimulation()) {
      this.metrics.simulationMode = 'aggregated';
    } else if (this.shouldUseHybridSimulation()) {
      this.metrics.simulationMode = 'hybrid';
    } else {
      this.metrics.simulationMode = 'full';
    }
  }

  /**
   * Update warning level based on performance
   */
  private updateWarningLevel(): void {
    const tickTime = this.metrics.averageTickTime;
    
    if (tickTime < 16) { // 60 FPS
      this.metrics.warningLevel = 'none';
    } else if (tickTime < 33) { // 30 FPS
      this.metrics.warningLevel = 'low';
    } else if (tickTime < 50) { // 20 FPS
      this.metrics.warningLevel = 'medium';
    } else if (tickTime < 100) { // 10 FPS
      this.metrics.warningLevel = 'high';
    } else {
      this.metrics.warningLevel = 'critical';
    }
  }

  /**
   * Export configuration for saving
   */
  public serialize(): any {
    return {
      thresholds: this.thresholds,
      metrics: this.metrics
    };
  }

  /**
   * Import configuration from save
   */
  public deserialize(data: any): void {
    if (data.thresholds) {
      this.thresholds = { ...this.thresholds, ...data.thresholds };
    }
    if (data.metrics) {
      this.metrics = { ...this.metrics, ...data.metrics };
    }
  }
}
