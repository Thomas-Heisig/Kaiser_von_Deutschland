# ⚜️ Kaiser von Deutschland ⚜️

Eine umfassende historische Königreichssimulation von Jahr 0 bis in die Zukunft - Ein modernes Remake des Klassikers "Kaiser" mit massiven Erweiterungen.

## 🎮 Spielkonzept

Kaiser von Deutschland ist eine komplexe Strategie- und Rollenspielsimulation, die es Spielern ermöglicht, verschiedene historische und moderne Rollen zu übernehmen - vom einfachen Arbeiter bis zum mächtigen Kaiser. Das Spiel deckt eine Zeitspanne von über 2000 Jahren ab und kombiniert historische Genauigkeit mit strategischer Tiefe.

## ✨ Hauptmerkmale

### 🎭 15 Verschiedene Spielerrollen
- **Imperial**: Kaiser, Kaiserin
- **Royal**: König, Königin
- **Religious**: Papst, Bischof, Mönch, Nonne
- **Noble**: Herzog, Herzogin
- **Administrative**: Minister, Bürgermeister
- **Economic**: Händler, Gildenmeister, Handwerker
- **Labor**: Bauer, Arbeiter
- **Academic**: Gelehrter

Jede Rolle hat einzigartige Fähigkeiten, spezifische Anforderungen und verschiedene Startressourcen.

### 📅 Historische Zeitlinie (Jahr 0 - 2050)
- **27 historische Ereignisse** von der Geburt Christi bis zur Weltraumkolonisierung
- Automatische Ereignisse basierend auf dem Jahr
- Zufällige Ereignisse für dynamisches Gameplay
- Zukunfts-Szenarien (KI-Revolution, Fusionsenergie, etc.)

### 🏗️ 23 Gebäudetypen
Von antiken Bauernhöfen bis zu futuristischen Rechenzentren.

### 🔬 24 Technologien
Vollständiger Technologie-Baum von der Antike bis zur digitalen Zukunft.

### 📊 Umfangreiches Statistik-System
Wirtschaft, Militär, Soziales, Kultur und Politik - alles detailliert simuliert.

## 🚀 Technologie-Stack

- **TypeScript** - Type-safe Entwicklung
- **Vite** - Schnelles Build-Tool
- **LocalForage** - Persistente Datenspeicherung (IndexedDB)
- **JSON-basierte Datenarchitektur** - Vollständig modular und erweiterbar
- **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile

## 🛠️ Installation & Ausführung

### Voraussetzungen
- Node.js 18+ LTS
- npm, yarn oder pnpm

### Setup
```bash
# Dependencies installieren
npm install

# Development Server starten (Port 4100)
npm run dev

# Build für Produktion
npm run build

# TypeScript Type-Check
npm run check

# Tests ausführen
npm test
```

### Port ändern
```bash
# Windows PowerShell
$env:PORT = 4200
npm run dev

# Linux/macOS
PORT=4200 npm run dev
```

## 📁 Projektstruktur

```
src/
├── core/                    # Kern-Spiellogik
│   ├── GameEngine.ts        # Haupt-Spiel-Engine
│   ├── Player.ts            # Spieler-System
│   ├── Kingdom.ts           # Königreich-Management
│   ├── RoleSystem.ts        # Rollen-Management
│   ├── BuildingSystem.ts    # Gebäude-Management
│   ├── TechnologySystem.ts  # Technologie-Baum
│   └── HistoricalEventSystem.ts  # Historische Ereignisse
├── ui/                      # UI-Komponenten
├── data/json/               # JSON-Datenbanken
│   ├── roles.json           # 15 Rollen-Definitionen
│   ├── buildings.json       # 23 Gebäude
│   ├── technologies.json    # 24 Technologien
│   └── historical-events.json  # 27 Ereignisse
└── main.ts
```

## 🎯 Design-Philosophie

- **Modularität**: Alle Systeme sind voneinander getrennt
- **Datengetrieben**: JSON-Dateien für einfache Erweiterung
- **Historische Genauigkeit**: Basierend auf echten Ereignissen
- **Moderne Technologie**: Beste Performance durch moderne Web-Tech
- **Responsive**: Funktioniert auf allen Geräten

## 📖 Ursprung & Inspiration

Inspiriert vom klassischen **Kaiser** (1984) und **Kaiser II** - legendäre Strategiespiele für Commodore 64. Dieses Projekt erweitert die ursprüngliche Spielidee massiv mit modernen Technologien und umfassendem Content.

## 🤝 Beitragen

Beiträge sind willkommen! Besonders:
- Neue historische Ereignisse
- Zusätzliche Rollen und Gebäude
- Verbesserte Grafiken
- Lokalisierung in andere Sprachen

## 📜 Lizenz

MIT License

---

**Entwickelt mit ❤️ für Geschichts- und Strategiespiel-Fans**

_Erlebe Geschichte. Erschaffe Deine Dynastie. Herrsche über Deutschland._
