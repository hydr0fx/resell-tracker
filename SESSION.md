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
- (keine)

## Repo
- `https://github.com/hydr0fx/resell-tracker`
- Live: `https://hydr0fx.github.io/resell-tracker/`
