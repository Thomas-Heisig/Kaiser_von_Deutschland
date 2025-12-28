# ⚜️ Kaiser von Deutschland ⚜️

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Eine umfassende historische Königreichssimulation von Jahr 0 bis in die Zukunft - Ein modernes Remake des Klassikers "Kaiser" mit massiven Erweiterungen.

## 🎮 Spielkonzept

Kaiser von Deutschland ist eine komplexe Strategie- und Rollenspielsimulation, die es Spielern ermöglicht, verschiedene historische und moderne Rollen zu übernehmen - vom einfachen Arbeiter bis zum mächtigen Kaiser. Das Spiel deckt eine Zeitspanne von über 2000 Jahren ab und kombiniert historische Genauigkeit mit strategischer Tiefe.

> **Aktuelle Version:** v2.5.0  
> **Neu in 2.5.0:** 🎮 **Lebensphasen-basiertes Gameplay-System** + **20 Roadmap Features**  
> **MASSIV ERWEITERT in v2.4.0:** 🚀 **17 neue Kernsysteme** für Population, Krieg, Spionage, Städte, Kultur & Recht!  
> Siehe [ROADMAP](docs/00-meta/roadmap.md) für geplante Features und [STATUS](docs/00-meta/status.md) für Details.

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

### 🏛️ Politik-System (NEU)
**33 politische Maßnahmen** in 8 Kategorien:
- Asyl und Zuwanderung
- Wirtschaft (Inland & Außenhandel)
- Gesundheitswesen
- Soziale Förderung & Restriktion
- Soziale Spannungen
- Ballungsräume

### 🤖 KI-Integration (NEU)
- **Ollama AI**: 6 verschiedene KI-Modelle als Spieler oder Berater
- Intelligente Entscheidungshilfe
- Event-Analyse und Empfehlungen
- Chat-Funktion

### 🌐 Multiplayer-System (NEU)
- Bis zu 6 Spieler (Menschen + KI)
- Echtzeit- oder Rundenbasiert
- In-Game Chat (öffentlich & privat)
- Session-Management mit Lobby

### 📚 Wikipedia-Integration (NEU)
- Historische Ereignisse mit echten Wikipedia-Artikeln anreichern
- Kontextwissen und verwandte Themen
- Intelligentes Caching

### 🧬 Bevölkerungsdynamik (v2.1.5 - NEU!)
- **Individuelle Bürger-Simulation**: Jeder Bürger hat Name, Alter, Beruf, Bedürfnisse
- **Familienbildung und Dynastien**: Verwandtschaftsbeziehungen über Generationen
- **Demografische Simulation**: Realistische Geburten- und Sterberaten, Alterspyramiden
- **Epidemien & Hungersnöte**: Mit individueller Krankheitsverbreitung
- **Soziale Netzwerke**: Freundschaften, Feindschaften, Informationsverbreitung
- **Soziale Bewegungen**: Revolutionen, Reformen, Proteste
- **Multiplayer**: Jeder Spieler kann jeden Bürger übernehmen!
- **PixiJS Visualisierung**: Interaktive Bevölkerungskarten und Alterspyramiden

### 🌍 Ökologische Simulation (v2.2.3)
- **Dynamisches Klima-System**: Jahreszeiten, Klimawandel über Jahrhunderte, Wettervorhersage-Technologien
- **Naturkatastrophen**: Überschwemmungen, Dürren, Stürme, Erdbeben, Waldbrände, Heuschrecken
- **Ressourcen-Management**: Erschöpfung und Regeneration von Holz, Stein, Eisen, Wildtieren
- **Landschafts-Veränderung**: Entwaldung, Wiederaufforstung, Flussläufe, Bodenerosion
- **Terraforming**: Sumpftrockenlegung, Landgewinnung, Bewässerung, Bodenverbesserung
- **Tierpopulationen**: Wildtiere (Hirsche, Wildschweine, Wölfe, Bären), Viehzucht, Fischerei
- **Artenschutz**: Jagdbeschränkungen, Schutzgebiete, Zuchtprogramme, Aussterbe-Events
- **Multiplayer**: Gemeinsame Umweltkrisen, Jagdkonflikte, Grenzstreitigkeiten

### 🤝 Diplomatie-System (v2.3.0 - NEU!)
- **Diplomatische Beziehungen**: Verwaltung von Beziehungen zu anderen Königreichen mit Vertrauens- und Beziehungswerten
- **Verträge & Allianzen**: Vollständiges Vertragssystem (Frieden, Bündnis, Handel, Nicht-Angriff, Vasallentum)
- **Handelsabkommen**: Umfassendes Handelssystem mit Ressourcenaustausch und Goldzufluss
- **Kriegserklärungen**: Kriegssystem mit Causus Belli, Verbündeten und Kriegspunkten
- **Friedensverhandlungen**: Friedensangebote mit Bedingungen für Gold, Territorium und Handel
- **Multiplayer**: Verhandlungen zwischen echten Spielern, Mehrspieler-Verträge

### 🎮 Lebensphasen-basiertes Gameplay (v2.5.0 - NEU!)
- **🎬 Intro-Sequenz**: Historisches Cinematic + Philosophische Fragen für Persönlichkeitsprofil
- **⏳ 9 Zeitperioden**: Von Antike (500) bis Zukunft (2100) - Wähle deine Ära!
- **👶 3 Lebensphasen**: Starte als Kind (5-10J), Schüler (10-14J) oder Erwachsener (18-25J)
- **📅 Monatliche Zyklen**: 24h-Zeitmanagement (Arbeit, Familie, Bildung, Freizeit, Schlaf)
- **🎯 5 Karrierepfade**: Handwerk, Politik, Militär, Klerus, Gelehrte (je 5 Aufstiegsstufen)
- **⚡ 3 Geschwindigkeitsmodi**: Detailreich (Tag), Ausgewogen (Monat), Strategisch (Jahr)
- **💼 Berufsspezifische Aktionen**: Jede Rolle hat einzigartige monatliche Entscheidungen
- **📈 Aufstiegssystem**: Vom Lehrling zum Meister - realistische Karriereentwicklung
- **🧠 Persönlichkeitssystem**: Charisma, Intellekt, Pragmatismus, Spiritualität beeinflussen Gameplay
- **📜 Historische Szenarien**: Vordefinierte Startpunkte in verschiedenen Epochen

**Siehe [GAMEPLAY_SYSTEM.md](docs/GAMEPLAY_SYSTEM.md) für Details**

### ⛪ Religions- & Kultursystem (v2.3.0 - NEU!)
- **7 Religionen**: Katholizismus, Protestantismus, Orthodoxie, Islam, Judentum, Heidentum, Atheismus
- **Kulturelle Identität**: 8 verschiedene Kulturen (Germanisch, Lateinisch, Slawisch, etc.)
- **Religiöse Gebäude**: 4 Gebäudetypen (Kapelle, Kirche, Kathedrale, Kloster)
- **Kulturelle Ereignisse**: 5 Festivals (Ostern, Weihnachten, Erntedank, etc.)
- **Bekehrung & Spannungen**: Vollständiges Konversionssystem mit religiösen Konflikten
- **Multiplayer**: Glaubenskriege, Bekehrungskampagnen

### 📜 Erweiterte Historische Inhalte (v2.3.0 - NEU!)
- **70 Historische Ereignisse**: Von Wikingerüberfällen bis Klimastabilisierung (Jahr 793-2080)
- **Event-Ketten**: Kreuzzüge, Hanse, 30-jähriger Krieg, Weltkriege, Digitale Revolution
- **Regionale Ereignisse**: Deutschland, Europa, globale Events
- **Alternative Geschichte**: Was-Wäre-Wenn-Szenarien mit Spieler-Entscheidungen
- **Dynamische Events**: 8 Event-Vorlagen mit Wahrscheinlichkeiten

### 👥 Neue Rollen & Gebäude (v2.3.0 - NEU!)
- **35 Spielbare Rollen**: +10 neue Rollen (Bankier, Architekt, Spion, Admiral, General, Journalist, Erfinder, Diplomat, Fabrikbesitzer, Philosoph)
- **68 Gebäudetypen**: +30 neue Gebäude (Banken, Museen, Parlamente, Raumhäfen, etc.)
- **3 Weltwunder**: Kolosseum, Eiffelturm, Brandenburger Tor
- **Spezialgebäude**: Mit einzigartigen Boni und Effekten

### 🏛️ Erweiterte Politik (v2.3.0 - NEU!)
- **53 Politik-Maßnahmen**: +20 neue Maßnahmen in 4 neuen Kategorien
- **Umweltpolitik**: CO2-Steuer, Erneuerbare Energien, Emissionsgrenzwerte, Naturschutz, Plastikverbot
- **Digitalpolitik**: Datenschutz, Internet-Zensur, Digitale Infrastruktur, Cybersicherheit
- **Wissenschaftspolitik**: Forschungsförderung, Universitätsausbau, Nobelpreis, Weltraumprogramm
- **Sicherheitspolitik**: Polizeireform, Unabhängige Justiz, Strafrechtsreform, Grenzsicherung

### 🎯 Roadmap Features (v2.3.1 - NEU!)
- **🎭 10 Historische Persönlichkeiten**: Karl der Große, Bismarck, Luther, Einstein, Goethe, Beethoven
- **⚔️ 10 Historische Schlachten**: Von Teutoburger Wald (9 n.Chr.) bis Kursk (1943)
- **🦠 8 Krankheiten & Epidemien**: Pest, Cholera, Spanische Grippe mit vollständiger Simulation
- **🌪️ 8 Naturkatastrophen**: Erdbeben, Überschwemmungen, Dürren mit historischen Beispielen
- **🚂 15 Transportsysteme**: Von Pferd bis Hochgeschwindigkeitszug
- **🛤️ 10 Handelsrouten**: Bernsteinstraße, Hanserouten, EU-Binnenmarkt
- **🎨 11 Kunststile**: Von Romanik bis Postmoderne
- **🎭 12 Kulturelle Events**: Oktoberfest, Weihnachtsmarkt, Karneval, Berlinale
- **🔬 15 Wissenschaftliche Entdeckungen**: Buchdruck, Relativitätstheorie, Internet
- **⚖️ 10 Rechtssysteme**: Von Stammesrecht bis EU-Recht
- **💰 12 Steuersysteme**: Von Zehnt bis CO2-Steuer
- **⚔️ 15 Militäreinheiten**: Von Miliz bis Mechanisierte Infanterie

### 🎮 Integrierte Gameplay-Systeme (v2.4.0 - NEU!)
- **⛪ Religionssystem**: 10 Religionen, religiöse Gebäude, Konversion, religiöse Spannungen
- **🚶 Migrationssystem**: Bevölkerungsbewegungen zwischen Regionen basierend auf Wirtschaft, Sicherheit, Lebensqualität
- **📈 Soziale Mobilitätssystem**: Klassenwechsel, Berufsaufstieg, soziale Bewegungen
- **🌾 Hungersnot-System**: Regionale Hungersnöte mit Ursachen und Auswirkungen
- **💰 Ökonomische Kohorten**: Skalierbare Wirtschaft für bis zu 80 Millionen Bürger
- **⚔️ Gelände & Wetter im Kampf**: Terraineffekte (Höhen, Wälder, Flüsse) und Wettereinflüsse in Schlachten
- **🎖️ Militärformationen**: Keil, Phalanx, Linie und weitere taktische Formationen
- **📦 Versorgungslogistik**: Versorgungslinien, Winterquartiere, Lager für Armeen
- **🏰 Belagerungs-System**: Stadtbelagerungen mit Werkzeugen (Katapulte, Kanonen), Mauern, Versorgung
- **🛡️ Befestigungssystem**: Stadtmauern von Holzpalisaden bis Bunkern
- **🕵️ Spionage-System**: Agentennetzwerke, Missionen, Sabotage, Attentate, Doppelagenten
- **🏙️ Stadtbezirks-System**: Slums, Nobelviertel, Gentrifizierung, Kriminalität
- **🌙 Tag/Nacht-Zyklus**: Tagesrhythmus mit unterschiedlichen Aktivitäten (Märkte morgens, Theater abends)
- **🎨 Kunst & Kultur**: Künstler, Kunstwerke, Aufführungen, kulturelle Kreise, Konzerte
- **📰 Informationsverbreitung**: Nachrichten, Gerüchte, Propaganda, Medien von Flugblättern bis Internet
- **⚖️ Rechtssystem & Gerichte**: Gerichtsverfahren, Richter, Gefängnisse, Bürokratie, Korruption
- **📚 Bibliothekssystem**: Büchersammlungen, Zensur, digitale Bibliotheken, Open Access
- **🎓 Universitätssystem**: Historische deutsche Universitäten, Nobelpreise, Forschung
- **📜 Historische Events**: Erweiterte Event-Datenbank mit Event-Ketten

## 🚀 Technologie-Stack

- **TypeScript** - Type-safe Entwicklung
- **Vite** - Schnelles Build-Tool
- **PixiJS** - High-Performance 2D Grafik-Engine
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
├── core/                       # Kern-Spiellogik
│   ├── GameEngine.ts           # Haupt-Spiel-Engine
│   ├── Player.ts               # Spieler-System
│   ├── Kingdom.ts              # Königreich-Management
│   ├── RoleSystem.ts           # Rollen-Management
│   ├── BuildingSystem.ts       # Gebäude-Management
│   ├── TechnologySystem.ts     # Technologie-Baum
│   ├── HistoricalEventSystem.ts # Historische Ereignisse
│   ├── PolicySystem.ts         # 33 Politik-Maßnahmen (NEU)
│   ├── OllamaService.ts        # KI-Integration (NEU)
│   ├── MultiplayerSystem.ts    # Multiplayer-Framework (NEU)
│   ├── WikiIntegration.ts      # Wikipedia-Anbindung (NEU)
│   ├── Economy.ts              # Wirtschafts-Engine
│   ├── Events.ts               # Event-System
│   └── RegionalSystem.ts       # Regional-Verwaltung
├── ui/                         # UI-Komponenten
│   ├── GameUI.ts               # Haupt-UI
│   ├── Graphics.ts             # Canvas-Rendering
│   ├── NewFeaturesPanel.ts     # Panel für neue Features (NEU)
│   ├── NotificationSystem.ts   # Benachrichtigungen
│   └── SaveManager.ts          # Speicher-Verwaltung
├── data/                       # Daten und Definitionen
│   ├── json/                   # JSON-Datenbanken
│   │   ├── roles.json          # 15 Rollen-Definitionen
│   │   ├── buildings.json      # 23 Gebäude
│   │   ├── technologies.json   # 24 Technologien
│   │   ├── historical-events.json # 27 Ereignisse
│   │   ├── policy-categories.json # Politik-Kategorien (NEU)
│   │   ├── regions.json        # Regionen
│   │   └── achievements.json   # Erfolge
│   └── Titles.ts               # Titel-System
├── utils/                      # Hilfsfunktionen
└── main.ts                     # Einstiegspunkt
```

## 🎯 Design-Philosophie

- **Modularität**: Alle Systeme sind voneinander getrennt
- **Datengetrieben**: JSON-Dateien für einfache Erweiterung
- **Historische Genauigkeit**: Basierend auf echten Ereignissen
- **Moderne Technologie**: Beste Performance durch moderne Web-Tech
- **Responsive**: Funktioniert auf allen Geräten

## 📖 Ursprung & Inspiration

Inspiriert vom klassischen **Kaiser** (1984) und **Kaiser II** - legendäre Strategiespiele für Commodore 64. Dieses Projekt erweitert die ursprüngliche Spielidee massiv mit modernen Technologien und umfassendem Content.

## 📖 Dokumentation

### 🚀 Schnelleinstieg

- **[Benutzerhandbuch](docs/USER_GUIDE.md)** - Spielanleitung und Features
- **[Roadmap](docs/00-meta/roadmap.md)** - Geplante Features und Entwicklung
- **[Beitragen](CONTRIBUTING.md)** - Wie Sie zum Projekt beitragen können

### 📚 Vollständige Dokumentation

Wir verwenden eine **strukturierte Dokumentation** nach professionellen Standards:

- **[docs/](docs/README.md)** - Dokumentations-Übersicht und Navigation
- **[Vision & Status](docs/00-meta/)** - Projektziele und aktueller Stand
- **[Überblick](docs/01-overview/)** - Spielidee, Zielgruppen, Grundannahmen
- **[Simulation](docs/02-simulation-model/)** - Ökonomische und soziale Modelle
- **[Game Design](docs/03-game-design/)** - Spielmechaniken und Regeln
- **[Domänen](docs/04-domains/)** - Spezielle Bereiche (Wirtschaft, Arbeit, Ökologie)
- **[Technische Architektur](docs/05-technical-architecture/)** - System-Design und Datenbank
- **[Entwicklung](docs/06-development/)** - Setup, Guidelines, Testing
- **[Operations](docs/07-operations/)** - Build, Deployment, Configuration
- **[Entscheidungen](docs/08-decisions/)** - ADRs (Architecture Decision Records)
- **[Anhang](docs/99-appendix/)** - Referenzen, Quellen, Validierung

### 👨‍💻 Für Entwickler

- **[System-Architektur](docs/ARCHITECTURE.md)** - Technischer Überblick (Legacy)
- **[API-Referenz](docs/API_REFERENCE.md)** - Code-Dokumentation
- **[Datenbank-Implementation](docs/06-development/database-implementation.md)** - SQLite Integration (NEU)
- **[ADR-0001: Database Technology](docs/08-decisions/adr-0001-database-technology.md)** - Datenbank-Entscheidung

## 🤝 Beitragen

Beiträge sind willkommen! Besonders:
- Neue historische Ereignisse
- Zusätzliche Rollen und Gebäude
- Weitere Politik-Maßnahmen
- Verbesserte Grafiken
- Lokalisierung in andere Sprachen
- Bug-Fixes und Performance-Optimierungen

Bitte lesen Sie [CONTRIBUTING.md](CONTRIBUTING.md) für Details zum Entwicklungsprozess.

## 🐛 Probleme melden

Haben Sie einen Bug gefunden oder einen Feature-Wunsch? Bitte [erstellen Sie ein Issue](https://github.com/Thomas-Heisig/Kaiser_von_Deutschland/issues) auf GitHub.

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- Inspiriert vom klassischen **Kaiser** (1984) und **Kaiser II** für Commodore 64
- Basiert auf historischen Ereignissen und Strukturen
- Community-Beiträge und Feedback

---

**Entwickelt mit ❤️ für Geschichts- und Strategiespiel-Fans**

_Erlebe Geschichte. Erschaffe Deine Dynastie. Herrsche über Deutschland._
