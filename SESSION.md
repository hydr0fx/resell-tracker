# Sitzung 23.05.2026 – v3.1

## Änderungen seit v3.0

### Photo Viewer
- Vollbild-Overlay mit Zoom (rein/raus/reset), Rotation, Download
- Navigation mit Prev/Next-Pfeilen
- Indikator "X / Y"
- Bild aus Detailansicht, Inventarliste und Formular öffnbar

### PayPal Gebührenrechner
- Modal-Overlay mit Eingabe des Verkaufspreises
- Berechnung: 2,49% + 0,35€ Gebühr, Anzeige Netto-Betrag
- "Gebühr übernehmen"-Button: übernimmt berechnete Gebühr ins Formular

### Versandkosten-Auswahl
- Dropdown für Versandmethode (DHL, Hermes, Deutsche Post)
- Dynamische Paketoptionen mit Kosten pro Methode
- Auswahl wird im Item gespeichert

### Sales Monatsraster
- Skyscanner-ähnliches 3×4 Grid mit Monatskacheln
- Jede Kachel: Monatsname, Gewinn (€), Anzahl Verkäufe
- Jahr-Navigation mit ‹ › « »
- Klick auf Kachel: Popup mit detaillierter Verkaufsliste, Gesamtgewinn, Ø Marge

### Select-Modus für Verkäufe
- Langdruck auf Sales-Header → Checkboxen erscheinen
- Mehrere Items auswählen, als verkauft markieren
- Auswahl-Leiste mit Counter und "Als verkauft markieren"-Button

### UI/UX
- Gold (#FACC15) Akzente für Buttons, aktive Filter, Nav-Add-Button
- Dark Mode mit warmem Gold-Schema beibehalten
- Live-Gewinnrechner im Formular (Gewinn, Marge %, ROI %)
- Status-Buttons in Detailansicht (Bereit/Inseriert/Verkauft)
- Automatische PayPal-Gebührenberechnung beim Eintragen des Verkaufspreises

### Datenmodell-Erweiterungen
- `paypalFee`, `shippingMethod`, `shippingCost` pro Item
- `fSalePrice` statt `fSelling` (Formularfeld)
- `sellDate` für Verkaufsdatum

## Status
- **Live:** https://hydr0fx.github.io/flippy-bird/ (GitHub Pages)
- **SW Cache:** v3.1.0
- **Kein Backend mehr** – reine Client-PWA
- **Keine automatische Kleinanzeigen-Postings** – nur Export + Copy

## Letzter Commit
```
de96e35 Add .gitignore
8111f2b v3.1: Photo viewer, PayPal calculator, shipping cost selector, sales month grid, select mode
```
