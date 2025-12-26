// src/core/HistoricalEventSystem.ts
import eventsData from '../data/json/historical-events.json';

export interface HistoricalEvent {
  id: string;
  year: number;
  name: string;
  description: string;
  category: string;
  impact: Record<string, number>;
  globalEvent?: boolean;
  region?: string;
  duration?: number;
  future?: boolean;
}

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  probability: number;
  impact: Record<string, number>;
}

export class HistoricalEventSystem {
  private static historicalEvents: Map<number, HistoricalEvent[]> = new Map();
  private static eventTemplates: EventTemplate[] = [];
  private static triggeredEvents: Set<string> = new Set();
  
  static {
    // Initialize historical events grouped by year
    eventsData.historicalEvents.forEach((event: any) => {
      const year = event.year;
      if (!this.historicalEvents.has(year)) {
        this.historicalEvents.set(year, []);
      }
      this.historicalEvents.get(year)!.push(event as HistoricalEvent);
    });
    
    // Initialize event templates
    this.eventTemplates = eventsData.eventTemplates as EventTemplate[];
  }
  
  /**
   * Holt Ereignisse für ein bestimmtes Jahr
   */
  public static getEventsForYear(year: number): HistoricalEvent[] {
    return this.historicalEvents.get(year) || [];
  }
  
  /**
   * Holt alle Ereignisse in einem Zeitraum
   */
  public static getEventsInRange(startYear: number, endYear: number): HistoricalEvent[] {
    const events: HistoricalEvent[] = [];
    for (let year = startYear; year <= endYear; year++) {
      const yearEvents = this.getEventsForYear(year);
      events.push(...yearEvents);
    }
    return events;
  }
  
  /**
   * Holt alle globalen Ereignisse
   */
  public static getGlobalEvents(): HistoricalEvent[] {
    const allEvents: HistoricalEvent[] = [];
    this.historicalEvents.forEach(events => {
      allEvents.push(...events.filter(e => e.globalEvent));
    });
    return allEvents;
  }
  
  /**
   * Holt Ereignisse nach Kategorie
   */
  public static getEventsByCategory(category: string): HistoricalEvent[] {
    const allEvents: HistoricalEvent[] = [];
    this.historicalEvents.forEach(events => {
      allEvents.push(...events.filter(e => e.category === category));
    });
    return allEvents;
  }
  
  /**
   * Holt zukünftige Ereignisse
   */
  public static getFutureEvents(): HistoricalEvent[] {
    const allEvents: HistoricalEvent[] = [];
    this.historicalEvents.forEach(events => {
      allEvents.push(...events.filter(e => e.future));
    });
    return allEvents;
  }
  
  /**
   * Prüft ob ein Ereignis bereits ausgelöst wurde
   */
  public static hasEventTriggered(eventId: string): boolean {
    return this.triggeredEvents.has(eventId);
  }
  
  /**
   * Markiert ein Ereignis als ausgelöst
   */
  public static markEventTriggered(eventId: string): void {
    this.triggeredEvents.add(eventId);
  }
  
  /**
   * Wendet ein historisches Ereignis an
   */
  public static applyHistoricalEvent(
    event: HistoricalEvent,
    playerStats: any,
    kingdomStats: any
  ): {
    messages: string[];
    impacts: Record<string, number>;
  } {
    const messages: string[] = [];
    const impacts: Record<string, number> = {};
    
    messages.push(`📜 ${event.name} (${event.year})`);
    messages.push(event.description);
    
    // Apply impacts
    Object.entries(event.impact).forEach(([stat, value]) => {
      impacts[stat] = value;
      
      // Apply to player stats if applicable
      if (stat in playerStats) {
        const oldValue = playerStats[stat];
        playerStats[stat] += value;
        messages.push(`${stat}: ${oldValue} → ${playerStats[stat]} (${value > 0 ? '+' : ''}${value})`);
      }
      
      // Apply to kingdom stats if applicable
      if (stat in kingdomStats) {
        const oldValue = kingdomStats[stat];
        kingdomStats[stat] += value;
        messages.push(`${stat}: ${oldValue} → ${kingdomStats[stat]} (${value > 0 ? '+' : ''}${value})`);
      }
    });
    
    this.markEventTriggered(event.id);
    
    return { messages, impacts };
  }
  
  /**
   * Generiert ein zufälliges Ereignis basierend auf Templates
   */
  public static generateRandomEvent(): EventTemplate | null {
    const roll = Math.random();
    let cumulativeProbability = 0;
    
    for (const template of this.eventTemplates) {
      cumulativeProbability += template.probability;
      if (roll <= cumulativeProbability) {
        return template;
      }
    }
    
    return null;
  }
  
  /**
   * Wendet ein Template-Ereignis an
   */
  public static applyTemplateEvent(
    template: EventTemplate,
    playerStats: any,
    kingdomStats: any
  ): {
    messages: string[];
    impacts: Record<string, number>;
  } {
    const messages: string[] = [];
    const impacts: Record<string, number> = {};
    
    messages.push(`⚡ ${template.name}`);
    messages.push(template.description);
    
    // Apply impacts
    Object.entries(template.impact).forEach(([stat, value]) => {
      impacts[stat] = value;
      
      // Apply to player stats if applicable
      if (stat in playerStats) {
        const oldValue = playerStats[stat];
        playerStats[stat] += value;
        messages.push(`${stat}: ${oldValue} → ${playerStats[stat]} (${value > 0 ? '+' : ''}${value})`);
      }
      
      // Apply to kingdom stats if applicable
      if (stat in kingdomStats) {
        const oldValue = kingdomStats[stat];
        kingdomStats[stat] += value;
        messages.push(`${stat}: ${oldValue} → ${kingdomStats[stat]} (${value > 0 ? '+' : ''}${value})`);
      }
    });
    
    return { messages, impacts };
  }
  
  /**
   * Holt alle Ereignisse, sortiert nach Jahr
   */
  public static getAllEventsSorted(): HistoricalEvent[] {
    const allEvents: HistoricalEvent[] = [];
    const sortedYears = Array.from(this.historicalEvents.keys()).sort((a, b) => a - b);
    
    sortedYears.forEach(year => {
      const events = this.historicalEvents.get(year)!;
      allEvents.push(...events);
    });
    
    return allEvents;
  }
  
  /**
   * Gibt Statistiken über Ereignisse zurück
   */
  public static getStatistics(): {
    totalEvents: number;
    globalEvents: number;
    regionalEvents: number;
    futureEvents: number;
    categoryCounts: Record<string, number>;
  } {
    const allEvents = this.getAllEventsSorted();
    const categoryCounts: Record<string, number> = {};
    
    allEvents.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });
    
    return {
      totalEvents: allEvents.length,
      globalEvents: allEvents.filter(e => e.globalEvent).length,
      regionalEvents: allEvents.filter(e => e.region).length,
      futureEvents: allEvents.filter(e => e.future).length,
      categoryCounts
    };
  }
  
  /**
   * Bestimmt die aktuelle Ära basierend auf dem Jahr
   */
  public static getEraForYear(year: number): string {
    if (year < 500) return 'ancient';
    if (year < 1500) return 'medieval';
    if (year < 1760) return 'renaissance';
    if (year < 1920) return 'industrial';
    if (year < 2000) return 'modern';
    return 'digital';
  }
  
  /**
   * Gibt eine Zeitleiste der Ereignisse zurück
   */
  public static getTimeline(): Array<{
    year: number;
    events: HistoricalEvent[];
    era: string;
  }> {
    const timeline: Array<{ year: number; events: HistoricalEvent[]; era: string }> = [];
    const sortedYears = Array.from(this.historicalEvents.keys()).sort((a, b) => a - b);
    
    sortedYears.forEach(year => {
      const events = this.historicalEvents.get(year)!;
      timeline.push({
        year,
        events,
        era: this.getEraForYear(year)
      });
    });
    
    return timeline;
  }
}
