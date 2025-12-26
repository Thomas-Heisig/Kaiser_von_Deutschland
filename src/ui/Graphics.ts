// src/ui/Graphics.ts
import { Kingdom, ClimateType, Season } from '../core/Kingdom';

export type RenderLayer = 'terrain' | 'infrastructure' | 'military' | 'population' | 'resources' | 'overlay';
export type AnimationType = 'movement' | 'construction' | 'destruction' | 'highlight' | 'particle';

export interface RenderOptions {
  showGrid?: boolean;
  showLabels?: boolean;
  showFogOfWar?: boolean;
  zoomLevel?: number;
  panX?: number;
  panY?: number;
  highlightBuilding?: string;
  activeLayer?: RenderLayer;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  season?: Season;
}

export interface AnimationConfig {
  type: AnimationType;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  duration: number;
  color?: string;
  size?: number;
  onComplete?: () => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class Graphics {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderOptions: RenderOptions;
  private animations: AnimationConfig[] = [];
  private particles: Particle[] = [];
  private lastRenderTime: number = 0;
  private isRendering: boolean = false;
  // TODO: Will be used for terrain caching optimization in future
  // @ts-expect-error - Unused until caching is implemented
  private _terrainCache: Map<string, ImageData> = new Map();
  // TODO: Will be used for building sprite rendering in future
  // @ts-expect-error - Unused until sprite rendering is implemented
  private _buildingSprites: Map<string, HTMLImageElement> = new Map();
  // TODO: Will be used to track sprite loading status in future
  // @ts-expect-error - Unused until sprite loading is implemented
  private _spriteSheetLoaded: boolean = false;

  constructor(canvasId: string = 'kingdom-map') {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }
    
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    
    this.ctx = ctx;
    this.renderOptions = {
      showGrid: true,
      showLabels: true,
      showFogOfWar: false,
      zoomLevel: 1,
      panX: 0,
      panY: 0,
      activeLayer: 'terrain',
      timeOfDay: 'day',
      season: 'spring'
    };

    this.loadSprites();
    this.setupCanvas();
    this.startRenderLoop();
  }

  private setupCanvas(): void {
    // Responsive Canvas
    const resizeCanvas = () => {
      const container = this.canvas.parentElement;
      if (container) {
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Interaktivität
    this.setupInteractivity();
  }

  private setupInteractivity(): void {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        this.renderOptions.panX! += deltaX;
        this.renderOptions.panY! += deltaY;
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.renderOptions.zoomLevel! *= zoomFactor;
      this.renderOptions.zoomLevel! = Math.max(0.1, Math.min(5, this.renderOptions.zoomLevel!));
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Gebäudeauswahl oder andere Interaktionen
      this.handleCanvasClick(x, y);
    });
  }

  private handleCanvasClick(x: number, y: number): void {
    // Koordinaten in Weltkoordinaten umwandeln
    const worldX = (x - this.renderOptions.panX!) / this.renderOptions.zoomLevel!;
    const worldY = (y - this.renderOptions.panY!) / this.renderOptions.zoomLevel!;

    // Hier könnte Gebäudeauswahl oder andere Interaktionen implementiert werden
    console.log(`Clicked at world coordinates: (${worldX}, ${worldY})`);
  }

  private async loadSprites(): Promise<void> {
    // Platzhalter für echte Sprites - in einem echten Projekt würden hier Bilder geladen
    // Sprite definitions would be loaded here in a real implementation

    // Für dieses Beispiel verwenden wir Canvas-gezeichnete Platzhalter
    this._spriteSheetLoaded = true;
  }

  private startRenderLoop(): void {
    const render = (timestamp: number) => {
      if (!this.isRendering) {
        this.isRendering = true;
        
        // Berechne Delta Time für flüssige Animationen
        const deltaTime = timestamp - this.lastRenderTime || 0;
        this.lastRenderTime = timestamp;

        // Update Animationen
        this.updateAnimations(deltaTime);
        this.updateParticles(deltaTime);

        // Rendere den Frame
        this.clearCanvas();
        this.renderFrame();

        this.isRendering = false;
      }
      
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public renderKingdom(kingdom: Kingdom, options?: Partial<RenderOptions>): void {
    this.renderOptions = { ...this.renderOptions, ...options };
    
    // Speichere das Königreich für die Renderloop
    (this as any).currentKingdom = kingdom;
  }

  private renderFrame(): void {
    const kingdom = (this as any).currentKingdom as Kingdom;
    if (!kingdom) return;

    // Speichere den aktuellen Zustand
    this.ctx.save();

    // Transformationsmatrix für Zoom und Pan anwenden
    this.ctx.translate(this.renderOptions.panX!, this.renderOptions.panY!);
    this.ctx.scale(this.renderOptions.zoomLevel!, this.renderOptions.zoomLevel!);

    // Terrain rendern
    this.renderTerrain(kingdom);

    // Infrastruktur rendern
    this.renderInfrastructure(kingdom);

    // Militär rendern
    this.renderMilitary(kingdom);

    // Bevölkerung rendern (optional)
    if (this.renderOptions.activeLayer === 'population') {
      this.renderPopulation(kingdom);
    }

    // Ressourcen anzeigen (optional)
    if (this.renderOptions.activeLayer === 'resources') {
      this.renderResources(kingdom);
    }

    // Overlay (Grid, Labels, etc.)
    this.renderOverlay();

    // Animationen rendern
    this.renderAnimations();

    // Partikel rendern
    this.renderParticles();

    // Zustand wiederherstellen
    this.ctx.restore();
  }

  private renderTerrain(kingdom: Kingdom): void {
    const { ctx } = this;
    const width = this.canvas.width / this.renderOptions.zoomLevel!;
    const height = this.canvas.height / this.renderOptions.zoomLevel!;

    // Klima-basierter Hintergrund
    const terrainColors = this.getTerrainColors(kingdom.climate, this.renderOptions.season);
    
    // Gelände-Höhenkarte zeichnen
    ctx.fillStyle = terrainColors.base;
    ctx.fillRect(0, 0, width, height);

    // Geländemerkmale basierend auf Terrain-Daten
    const terrain = kingdom.terrain;
    
    // Wälder
    if (terrain.forests > 0) {
      ctx.fillStyle = terrainColors.forest;
      const forestArea = width * height * (terrain.forests / 100) * 0.3;
      this.drawRandomPatches(ctx, forestArea, 20, 40, 30, 60);
    }

    // Berge
    if (terrain.mountains > 0) {
      ctx.fillStyle = terrainColors.mountain;
      const mountainArea = width * height * (terrain.mountains / 100) * 0.2;
      this.drawMountains(ctx, mountainArea, 50, 80);
    }

    // Hügel
    if (terrain.hills > 0) {
      ctx.fillStyle = terrainColors.hill;
      const hillArea = width * height * (terrain.hills / 100) * 0.4;
      this.drawHills(ctx, hillArea, 20, 40);
    }

    // Flüsse (wenn vorhanden)
    this.drawRivers(ctx, width, height);

    // Straßen
    this.drawRoads(ctx, kingdom.infrastructure.roads, width, height);
  }

  private getTerrainColors(climate: ClimateType, _season?: Season): Record<string, string> {
    // Seasonal modifiers could be applied in the future
    // const seasonalModifiers: Record<Season, Record<string, number>> = {
    //   spring: { saturation: 1.2, brightness: 1.1 },
    //   summer: { saturation: 1.3, brightness: 1.2 },
    //   autumn: { saturation: 1.1, brightness: 0.9 },
    //   winter: { saturation: 0.8, brightness: 1.3 }
    // };

    const baseColors: Record<ClimateType, Record<string, string>> = {
      temperate: {
        base: '#cfe8a9',
        forest: '#5a7d4a',
        mountain: '#8a7f8d',
        hill: '#9cb68c',
        water: '#4a90e2'
      },
      arid: {
        base: '#e8d7b2',
        forest: '#8b7355',
        mountain: '#a0522d',
        hill: '#d2b48c',
        water: '#87ceeb'
      },
      cold: {
        base: '#e8f4f8',
        forest: '#2f4f4f',
        mountain: '#708090',
        hill: '#a9a9a9',
        water: '#4682b4'
      },
      tropical: {
        base: '#b8e0d2',
        forest: '#228b22',
        mountain: '#556b2f',
        hill: '#90ee90',
        water: '#00bfff'
      },
      mountainous: {
        base: '#d3d3d3',
        forest: '#6b8e23',
        mountain: '#696969',
        hill: '#bc8f8f',
        water: '#1e90ff'
      },
      coastal: {
        base: '#f0e68c',
        forest: '#32cd32',
        mountain: '#b8860b',
        hill: '#daa520',
        water: '#4169e1'
      }
    };

    return baseColors[climate] || baseColors.temperate;
  }

  private drawRandomPatches(
    ctx: CanvasRenderingContext2D,
    _totalArea: number,
    minSize: number,
    maxSize: number,
    count: number,
    spread: number
  ): void {
    // Calculate patches based on area distribution
    // const patchArea = totalArea / count;
    // const patchSize = Math.sqrt(patchArea);
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (this.canvas.width / this.renderOptions.zoomLevel! - spread);
      const y = Math.random() * (this.canvas.height / this.renderOptions.zoomLevel! - spread);
      const size = minSize + Math.random() * (maxSize - minSize);
      
      this.drawTreePatch(ctx, x, y, size);
    }
  }

  private drawTreePatch(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Zeichne mehrere Bäume im Patch
    const treeCount = Math.floor(size / 5);
    for (let i = 0; i < treeCount; i++) {
      const tx = Math.random() * size - size / 2;
      const ty = Math.random() * size - size / 2;
      
      // Baumkrone
      ctx.fillStyle = '#228b22';
      ctx.beginPath();
      ctx.arc(tx, ty, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Baumstamm
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(tx - 1, ty + 3, 2, 6);
    }
    
    ctx.restore();
  }

  private drawMountains(ctx: CanvasRenderingContext2D, totalArea: number, minHeight: number, maxHeight: number): void {
    const mountainCount = Math.floor(totalArea / 1000);
    
    for (let i = 0; i < mountainCount; i++) {
      const x = Math.random() * (this.canvas.width / this.renderOptions.zoomLevel!);
      const y = Math.random() * (this.canvas.height / this.renderOptions.zoomLevel!);
      const height = minHeight + Math.random() * (maxHeight - minHeight);
      const width = height * (0.5 + Math.random() * 0.5);
      
      this.drawMountain(ctx, x, y, width, height);
    }
  }

  private drawMountain(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Berg zeichnen
    ctx.fillStyle = '#8a7f8d';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-width / 2, height);
    ctx.lineTo(width / 2, height);
    ctx.closePath();
    ctx.fill();
    
    // Schnee auf Spitze (wenn hoch genug)
    if (height > 60) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-width / 4, height * 0.3);
      ctx.lineTo(width / 4, height * 0.3);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  private drawHills(ctx: CanvasRenderingContext2D, totalArea: number, minHeight: number, maxHeight: number): void {
    const hillCount = Math.floor(totalArea / 500);
    
    for (let i = 0; i < hillCount; i++) {
      const x = Math.random() * (this.canvas.width / this.renderOptions.zoomLevel!);
      const y = Math.random() * (this.canvas.height / this.renderOptions.zoomLevel!);
      const height = minHeight + Math.random() * (maxHeight - minHeight);
      const width = height * (1 + Math.random());
      
      this.drawHill(ctx, x, y, width, height);
    }
  }

  private drawHill(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Hügel zeichnen
    ctx.fillStyle = '#9cb68c';
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  private drawRivers(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Einfache Flussdarstellung
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Zufälliger Flussverlauf
    ctx.beginPath();
    let x = 0;
    let y = height * 0.3 + Math.random() * height * 0.4;
    
    ctx.moveTo(x, y);
    
    for (let i = 0; i < 20; i++) {
      x += width / 20;
      y += (Math.random() - 0.5) * 30;
      y = Math.max(height * 0.1, Math.min(height * 0.9, y));
      
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }

  private drawRoads(ctx: CanvasRenderingContext2D, roadCount: number, width: number, height: number): void {
    if (roadCount === 0) return;
    
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // Hauptstraße vom Schloss
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.5);
    ctx.lineTo(width * 0.9, height * 0.5);
    ctx.stroke();
    
    // Seitenstraßen
    for (let i = 1; i < roadCount; i++) {
      const angle = (i / roadCount) * Math.PI;
      const roadLength = width * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.5);
      ctx.lineTo(
        width * 0.5 + Math.cos(angle) * roadLength,
        height * 0.5 + Math.sin(angle) * roadLength
      );
      ctx.stroke();
    }
  }

  private renderInfrastructure(kingdom: Kingdom): void {
    const { ctx } = this;
    const centerX = (this.canvas.width / this.renderOptions.zoomLevel!) / 2;
    const centerY = (this.canvas.height / this.renderOptions.zoomLevel!) / 2;

    // Schloss (Zentrum)
    this.drawCastle(ctx, centerX - 60, centerY - 40);

    // Gebäude in kreisförmiger Anordnung um das Schloss
    const buildings = [
      { type: 'market', count: kingdom.infrastructure.markets, color: '#ffd166', size: 24 },
      { type: 'farm', count: kingdom.infrastructure.farms, color: '#7fb069', size: 22 },
      { type: 'barracks', count: kingdom.infrastructure.barracks, color: '#8b0000', size: 26 },
      { type: 'church', count: kingdom.infrastructure.churches, color: '#f0e68c', size: 28 },
      { type: 'mine', count: kingdom.infrastructure.mines, color: '#696969', size: 20 },
      { type: 'school', count: kingdom.infrastructure.schools, color: '#4682b4', size: 24 },
      { type: 'hospital', count: kingdom.infrastructure.hospitals, color: '#ff6b6b', size: 26 },
      { type: 'port', count: kingdom.infrastructure.ports, color: '#1e90ff', size: 30 },
      { type: 'workshop', count: kingdom.infrastructure.workshops, color: '#d2691e', size: 22 }
    ];

    let angleOffset = 0;
    buildings.forEach((building, index) => {
      if (building.count > 0) {
        const radius = 120 + index * 20;
        const angleStep = (Math.PI * 2) / Math.max(1, building.count);
        
        for (let i = 0; i < building.count; i++) {
          const angle = angleOffset + i * angleStep;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          this.drawBuilding(ctx, building.type, x, y, building.size, building.color);
        }
        
        angleOffset += building.count * angleStep * 0.1;
      }
    });

    // Mauern (wenn vorhanden)
    if (kingdom.infrastructure.walls > 0) {
      this.drawWalls(ctx, centerX, centerY, 150 + kingdom.infrastructure.walls * 10);
    }
  }

  private drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Hauptgebäude
    ctx.fillStyle = '#7f5539';
    ctx.fillRect(0, 0, 120, 80);
    
    // Türme
    ctx.fillStyle = '#5b3d2a';
    ctx.fillRect(-10, 10, 20, 60); // Linker Turm
    ctx.fillRect(110, 10, 20, 60); // Rechter Turm
    
    // Turmspitzen
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(10, 0);
    ctx.lineTo(20, 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(120, 10);
    ctx.lineTo(130, 0);
    ctx.lineTo(140, 10);
    ctx.closePath();
    ctx.fill();
    
    // Tor
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(50, 60, 20, 20);
    
    // Fenster
    ctx.fillStyle = '#f0e68c';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillRect(20 + i * 30, 20 + j * 20, 8, 12);
      }
    }
    
    // Flagge
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(60, -20, 3, 20);
    ctx.fillRect(60, -20, 15, 10);
    
    ctx.restore();
  }

  private drawBuilding(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number, color: string): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Gebäudegrundform
    ctx.fillStyle = color;
    ctx.fillRect(-size/2, -size/2, size, size);
    
    // Gebäudedetails basierend auf Typ
    switch (type) {
      case 'market':
        ctx.fillStyle = '#b58300';
        ctx.fillRect(-size/4, -size/2 - 5, size/2, 5); // Dach
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-size/4, -size/4, size/2, 2); // Theke
        break;
        
      case 'farm':
        ctx.fillStyle = '#556b2f';
        ctx.beginPath();
        ctx.arc(0, -size/2, size/3, 0, Math.PI);
        ctx.fill(); // Strohdach
        break;
        
      case 'barracks':
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(-size/2, -size/2, size, size/3); // Dach
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-size/4, -size/6, size/2, size/3); // Tor
        break;
        
      case 'church':
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2);
        ctx.lineTo(0, -size);
        ctx.lineTo(size/2, -size/2);
        ctx.closePath();
        ctx.fill(); // Kirchturmspitze
        ctx.fillRect(-size/6, -size/2, size/3, size/2); // Turm
        break;
    }
    
    ctx.restore();
  }

  private drawWalls(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void {
    ctx.save();
    
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 8;
    ctx.lineCap = 'butt';
    
    // Zinnenmuster
    ctx.setLineDash([10, 5]);
    
    // Kreisförmige Mauer
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }

  private renderMilitary(kingdom: Kingdom): void {
    const { ctx } = this;
    const centerX = (this.canvas.width / this.renderOptions.zoomLevel!) / 2;
    const centerY = (this.canvas.height / this.renderOptions.zoomLevel!) / 2;

    // Infanterie
    this.drawTroops(ctx, kingdom.military.infantry, centerX - 200, centerY - 100, '#a80000', 'infantry');
    
    // Kavallerie
    this.drawTroops(ctx, kingdom.military.cavalry, centerX + 200, centerY - 100, '#1e90ff', 'cavalry');
    
    // Bogenschützen
    this.drawTroops(ctx, kingdom.military.archers, centerX, centerY + 150, '#32cd32', 'archer');
    
    // Belagerungsmaschinen
    if (kingdom.military.siege > 0) {
      this.drawSiegeEngines(ctx, kingdom.military.siege, centerX, centerY - 150);
    }
    
    // Marine (wenn an der Küste)
    if (kingdom.climate === 'coastal' && kingdom.military.navy > 0) {
      this.drawNavy(ctx, kingdom.military.navy, centerX, centerY + 200);
    }
  }

  private drawTroops(
    ctx: CanvasRenderingContext2D, 
    count: number, 
    x: number, 
    y: number, 
    color: string,
    type: 'infantry' | 'cavalry' | 'archer'
  ): void {
    if (count === 0) return;
    
    ctx.save();
    ctx.translate(x, y);
    
    // Truppen in Formation darstellen
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const spacing = 15;
    
    for (let i = 0; i < count; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      
      const px = (col - (columns - 1) / 2) * spacing;
      const py = (row - (rows - 1) / 2) * spacing;
      
      this.drawSoldier(ctx, px, py, color, type);
    }
    
    // Truppenzahl anzeigen
    if (count > 50) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(count.toString(), 0, rows * spacing / 2 + 20);
    }
    
    ctx.restore();
  }

  private drawSoldier(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, type: 'infantry' | 'cavalry' | 'archer'): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Körper
    ctx.fillStyle = color;
    ctx.fillRect(-3, -8, 6, 16);
    
    // Kopf
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(0, -12, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Waffe basierend auf Typ
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    
    switch (type) {
      case 'infantry':
        // Schwert
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(3, 0);
            ctx.stroke();
        break;
        
      case 'cavalry':
        // Lanze
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 12);
        ctx.stroke();
        // Pferd
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-6, 4, 12, 6);
        break;
        
      case 'archer':
        // Bogen
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI);
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }

  private drawSiegeEngines(ctx: CanvasRenderingContext2D, count: number, x: number, y: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const offset = (i - 1) * 40;
      
      // Katapult
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(offset - 10, -5, 20, 10); // Basis
      
      ctx.fillStyle = '#a0522d';
      ctx.fillRect(offset - 2, -15, 4, 10); // Arm
      
      // Gegengewicht
      ctx.fillStyle = '#696969';
      ctx.fillRect(offset - 8, 5, 16, 8);
    }
    
    if (count > 3) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${count}×`, 0, 25);
    }
    
    ctx.restore();
  }

  private drawNavy(ctx: CanvasRenderingContext2D, count: number, x: number, y: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Wellen
    ctx.strokeStyle = '#1e90ff';
    ctx.lineWidth = 2;
    
    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const waveX = (i - 10) * 10;
        const waveY = Math.sin(i * 0.5 + wave * 2) * 3;
        if (i === 0) {
          ctx.moveTo(waveX, waveY);
        } else {
          ctx.lineTo(waveX, waveY);
        }
      }
      ctx.stroke();
    }
    
    // Schiffe
    const columns = Math.ceil(Math.sqrt(count));
    const spacing = 25;
    
    for (let i = 0; i < Math.min(count, 9); i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      
      const px = (col - (columns - 1) / 2) * spacing;
      const py = (row - (columns - 1) / 2) * spacing;
      
      this.drawShip(ctx, px, py);
    }
    
    if (count > 9) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${count} Schiffe`, 0, (columns * spacing) / 2 + 20);
    }
    
    ctx.restore();
  }

  private drawShip(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.translate(x, y);
    
    // Rumpf
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(8, 5);
    ctx.lineTo(-8, 5);
    ctx.closePath();
    ctx.fill();
    
    // Mast
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(-1, -15, 2, 15);
    
    // Segel
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(8, -5);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, -10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  private renderPopulation(kingdom: Kingdom): void {
    // Bevölkerung als Punkte auf der Karte darstellen
    const totalPopulation = Object.values(kingdom.population).reduce((a, b) => a + b, 0);
    const density = Math.min(1000, totalPopulation / 100); // Max 1000 Punkte
    
    const { ctx } = this;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    for (let i = 0; i < density; i++) {
      const x = Math.random() * (this.canvas.width / this.renderOptions.zoomLevel!);
      const y = Math.random() * (this.canvas.height / this.renderOptions.zoomLevel!);
      
      // Bevölkerungsdichte um Gebäude herum höher
      const distanceToCenter = Math.sqrt(
        Math.pow(x - this.canvas.width / 2 / this.renderOptions.zoomLevel!, 2) +
        Math.pow(y - this.canvas.height / 2 / this.renderOptions.zoomLevel!, 2)
      );
      
      if (Math.random() > distanceToCenter / 400) {
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private renderResources(kingdom: Kingdom): void {
    // Ressourcen als Overlay anzeigen
    const { ctx } = this;
    const resources = kingdom.resources;
    
    // Goldminen
    if (resources.gold > 5000) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      this.drawResourceNodes(ctx, resources.gold / 10000, '#FFD700');
    }
    
    // Eisenminen
    if (resources.iron > 1000) {
      ctx.fillStyle = 'rgba(112, 128, 144, 0.3)';
      this.drawResourceNodes(ctx, resources.iron / 5000, '#708090');
    }
    
    // Steinbrüche
    if (resources.stone > 2000) {
      ctx.fillStyle = 'rgba(169, 169, 169, 0.3)';
      this.drawResourceNodes(ctx, resources.stone / 10000, '#A9A9A9');
    }
  }

  private drawResourceNodes(ctx: CanvasRenderingContext2D, intensity: number, color: string): void {
    const nodeCount = Math.floor(intensity * 20);
    
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * (this.canvas.width / this.renderOptions.zoomLevel!);
      const y = Math.random() * (this.canvas.height / this.renderOptions.zoomLevel!);
      const size = 3 + intensity * 5;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Glüheffekt
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(x - size/3, y - size/3, size/3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderOverlay(): void {
    const { ctx } = this;
    
    // Grid
    if (this.renderOptions.showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      
      const gridSize = 50;
      const width = this.canvas.width / this.renderOptions.zoomLevel!;
      const height = this.canvas.height / this.renderOptions.zoomLevel!;
      
      // Vertikale Linien
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontale Linien
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    // Labels
    if (this.renderOptions.showLabels) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      const labels = [
        { text: 'Schloss', x: 100, y: 50 },
        { text: 'Marktplatz', x: 200, y: 100 },
        { text: 'Kasernen', x: 350, y: 50 }
      ];
      
      labels.forEach(label => {
        ctx.fillText(label.text, label.x, label.y);
      });
    }
    
    // Fog of War
    if (this.renderOptions.showFogOfWar) {
      this.drawFogOfWar(ctx);
    }
    
    // Zeit- und Wettereffekte
    this.applyTimeOfDayEffects(ctx);
  }

  private drawFogOfWar(ctx: CanvasRenderingContext2D): void {
    // Erstelle einen radialen Gradienten für den Nebel
    const gradient = ctx.createRadialGradient(
      this.canvas.width / 2 / this.renderOptions.zoomLevel!,
      this.canvas.height / 2 / this.renderOptions.zoomLevel!,
      50,
      this.canvas.width / 2 / this.renderOptions.zoomLevel!,
      this.canvas.height / 2 / this.renderOptions.zoomLevel!,
      300
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 
      this.canvas.width / this.renderOptions.zoomLevel!, 
      this.canvas.height / this.renderOptions.zoomLevel!
    );
  }

  private applyTimeOfDayEffects(ctx: CanvasRenderingContext2D): void {
    const time = this.renderOptions.timeOfDay;
    if (!time || time === 'day') return;
    
    const width = this.canvas.width / this.renderOptions.zoomLevel!;
    const height = this.canvas.height / this.renderOptions.zoomLevel!;
    
    switch (time) {
      case 'dawn':
        ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
        break;
      case 'dusk':
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        break;
      case 'night':
        ctx.fillStyle = 'rgba(0, 0, 139, 0.4)';
        // Sterne
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 2;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(0, 0, 139, 0.4)';
        break;
    }
    
    ctx.fillRect(0, 0, width, height);
  }

  // ==================== ANIMATIONSSYSTEM ====================

  public addAnimation(config: AnimationConfig): void {
    this.animations.push(config);
    
    // Automatisches Entfernen nach Ablauf
    setTimeout(() => {
      const index = this.animations.indexOf(config);
      if (index > -1) {
        this.animations.splice(index, 1);
        if (config.onComplete) {
          config.onComplete();
        }
      }
    }, config.duration);
  }

  public animateTroopMove(fromX: number, fromY: number, toX: number, toY: number, duration: number = 1000): void {
    this.addAnimation({
      type: 'movement',
      startX: fromX,
      startY: fromY,
      endX: toX,
      endY: toY,
      duration,
      color: '#ff3333',
      size: 12
    });
  }

  public animateConstruction(x: number, y: number, _buildingType: string): void {
    // Partikeleffekt für Bau
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: 1,
        color: '#FFD700',
        size: 2 + Math.random() * 3
      });
    }
    
    this.addAnimation({
      type: 'construction',
      startX: x,
      startY: y,
      duration: 1500,
      color: '#32CD32',
      size: 30
    });
  }

  private updateAnimations(_deltaTime: number): void {
    // Animationen aktualisieren (falls nötig)
  }

  private renderAnimations(): void {
    this.animations.forEach(animation => {
      switch (animation.type) {
        case 'movement':
          this.renderMovementAnimation(animation);
          break;
        case 'construction':
          this.renderConstructionAnimation(animation);
          break;
      }
    });
  }

  private renderMovementAnimation(animation: AnimationConfig): void {
    const { ctx } = this;
    const progress = Math.min(1, (Date.now() - (animation as any).startTime) / animation.duration);
    
    if (progress >= 1) return;
    
    const x = animation.startX + (animation.endX! - animation.startX) * progress;
    const y = animation.startY + (animation.endY! - animation.startY) * progress;
    
    // Soldat während Bewegung zeichnen
    this.drawSoldier(ctx, x, y, animation.color || '#ff3333', 'infantry');
    
    // Bewegungspfad
    ctx.strokeStyle = 'rgba(255, 51, 51, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(animation.startX, animation.startY);
    ctx.lineTo(animation.endX!, animation.endY!);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private renderConstructionAnimation(animation: AnimationConfig): void {
    const { ctx } = this;
    const progress = Math.min(1, (Date.now() - (animation as any).startTime) / animation.duration);
    
    // Wachsender Kreis um Bauplatz
    const radius = animation.size! * progress;
    
    ctx.strokeStyle = animation.color || '#32CD32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(animation.startX, animation.startY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pulsierender Effekt
    if (progress < 0.8) {
      const pulseRadius = radius * (1 + Math.sin(Date.now() / 200) * 0.2);
      ctx.strokeStyle = 'rgba(50, 205, 50, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(animation.startX, animation.startY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ==================== PARTIKELSYSTEM ====================

  private updateParticles(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update Position
      particle.x += particle.vx * deltaSeconds * 60;
      particle.y += particle.vy * deltaSeconds * 60;
      
      // Update Leben
      particle.life -= deltaSeconds * 2;
      
      // Gravitation
      particle.vy += 0.1 * deltaSeconds * 60;
      
      // Entferne tote Partikel
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private renderParticles(): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  // ==================== HILFSMETHODEN ====================

  public setRenderOptions(options: Partial<RenderOptions>): void {
    this.renderOptions = { ...this.renderOptions, ...options };
  }

  public getRenderOptions(): RenderOptions {
    return { ...this.renderOptions };
  }

  public clearAnimations(): void {
    this.animations = [];
    this.particles = [];
  }

  public takeScreenshot(filename: string = 'kingdom-map'): void {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}