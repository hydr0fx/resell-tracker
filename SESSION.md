# Sitzung 23.05.2026

## Änderungen

### UI Cleanup
- Alle Dekorationen entfernt (◆, ▶, goldene Balken, Muster, border-pattern)
- Saubere Karten mit weichen Schatten, ruhige Übergänge
- Header, Stats, Item-Cards, Form-Cards, Modal, Bottom-Nav vereinfacht
- Dark Mode auf warmes Dunkelgold (`#1C1814`, `#2A241E`, `#E8DCC8`, `#D4A843`)

### Kategorien & Plattformen sortierbar
- Drag & Drop per Maus und Touch (gedrückt halten & ziehen)
- `dragCatStart/Over/End`, `touchCatStart/Move/End` + Plattform-Äquivalente

### Photo Viewer
- Fotos in Liste, Detailansicht und Bearbeitungsformular anklickbar
- Modal-Viewer mit Pfeilen zum Blättern (Prev/Next)
- `openPhotoViewer()`, `openTrackingViewer()`, `showPhotoModal()`

### Sendungsnummer in Item-Cards
- Tracking-Nummer mit 📦-Icon in Karten-Details

### Service Worker Network-First
- `sw.js` immer neueste Version (kein Cache-Problem mehr)
- `cacheFirst` → `networkFirst` (fetch, fallback zu cache)
- Alle alten Caches werden bei Aktivierung gelöscht
- Version `v2.3.0`

### Auto-Update + Desktop-Notification
- `APP_VERSION = 'v2.3.0'` – bei Versionswechsel: SW unregister, Caches leeren, Reload
- Desktop-Notification bei neuem Update
- SW-Check alle 10s

### Splash-Animation
- Flappy Bird fliegt rein, hüpft, fällt in Geldgrube
- Sound: Jump-Boop + Money-Explosion (Cha-Ching + Münzen)
- Explosive Particle-Explosion mit €/$/₿-Symbolen
- Bild via `splash-bird.png` (ersetzt durch `dtfjhdrj.png`)
- Dauer ca. 2 Sekunden

## Offene Punkte
- [ ] Node.js auf PC installieren für lokalen Backend-Test
- [ ] Backend auf Render deployen (`backend/render.yaml`)
- [ ] API-URL in der PWA konfigurieren (Einstellungen)

## Repo
- `https://github.com/hydr0fx/flippy-bird`
- Live: `https://hydr0fx.github.io/flippy-bird/`

---

### Neu: Backend v1.0.0

**Architektur:** PWA + Node.js Backend (Puppeteer)

**Backend (`backend/`):**
- `server.js` – Express-Server mit REST-API
- `bot.js` – Puppeteer-Bot für Kleinanzeigen-Automation
- `package.json` – Dependencies (Express, Puppeteer, CORS)
- `render.yaml` – Deployment-Konfiguration für Render

**API-Endpunkte:**
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/login` | Kleinanzeigen-Login |
| GET | `/api/session` | Session-Status prüfen |
| POST | `/api/logout` | Ausloggen |
| GET | `/api/listings` | Eigene Anzeigen abrufen |
| POST | `/api/listings` | Neue Anzeige erstellen |
| POST | `/api/listings/:id/duplicate` | Anzeige duplizieren |
| POST | `/api/listings/:id/republish` | Anzeige neu einstellen |
| GET | `/api/chats` | Chats abrufen |
| GET | `/api/chats/:id` | Chat-Nachrichten abrufen |
| POST | `/api/chats/:id/messages` | Nachricht senden |
| GET | `/api/health` | Health-Check |

**PWA-Änderungen:**
- Neuer Nav-Punkt "Kleinanzeigen"
- Login-Formular für Kleinanzeigen-Zugangsdaten
- Anzeigen-Liste mit Duplizieren & Neu einstellen
- Chat-Ansicht mit Nachrichten schreiben
- API-Client (`kaFetch`) mit Session-Management

**ToDo für Deployment:**
1. `hydr0fx/flippy-bird` auf GitHub
2. Render.com Konto erstellen
3. Backend via `render.yaml` deployen
4. API-URL in der PWA Settings hinterlegen
