# Promotion — Documentation

## Überblick

Diese Dokumentation beschreibt das TypeScript/Vite-Scaffold für "Promotion" — ein leichtgewichtiges Remake-inspiriertes Projekt basierend auf Ideen aus dem Original "Kaiser"-Quellcode (siehe `docs/sourcecode Kaiser 2`).

## Setup

1. Abhängigkeiten installieren:

```powershell
npm install
```

2. Entwicklung starten (Standard-Port `4100`):

Windows PowerShell Beispiel:
```powershell
$env:PORT = 4200
npm run dev
```

Linux/macOS Beispiel:
```bash
PORT=4200 npm run dev
```

3. Type-Check ausführen:

```powershell
npm run check
```

4. Tests ausführen:

```powershell
npm test
```

## Architektur

- `src/core` — Kernspiel-Logik (Engine, Modelle, Economy, Events)
- `src/ui` — UI-Komponenten und Canvas-Renderer (`Graphics.ts`)
- `src/data` — Statische Spieldaten (Titelsystem)
- `src/utils` — Hilfsfunktionen

## Hinweise

- Der Dev-Server ist in `vite.config.ts` auf Port `4100` voreingestellt. Legen Sie `PORT` fest, um einen anderen Port zu verwenden.
- Die `docs/sourcecode Kaiser 2`-Ordner enthält die beigefügten BASIC-Quelltexte als Referenz und Inspirationsquelle; sie sind nicht Bestandteil des TypeScript-Laufcodes.
