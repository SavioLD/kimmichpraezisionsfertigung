# CLAUDE.md – Armin Kimmich Präzisionsfertigung

Kontext für die Arbeit an dieser Website.

## Was das ist
Statische Unternehmens-Website (reines HTML/CSS/JS, **kein Build, keine Abhängigkeiten**)
für einen CNC-Präzisionsfertiger mit Schwerpunkt **Fräsen**.

## Design-System
- Schrift: **Inter** (via Google Fonts eingebunden)
- Akzentfarbe: **`#1c9ce5`** (Variable `--accent` in `css/style.css`)
- Alle Design-Tokens (Farben, Radien, Schatten, Abstände) stehen in `:root` in `css/style.css`.

## Aufbau
- Jede Seite ist eigenständig; **Header und Footer sind pro Seite dupliziert** (bewusst,
  da kein Templating/Build). Änderungen an Navigation oder Footer müssen in **allen**
  `*.html` gepflegt werden.
- Aktive Navigation: `class="is-active"` auf dem jeweiligen Menüpunkt.
- `js/main.js`: mobile Navigation, Scroll-Reveal (`.reveal` → `.is-visible`),
  Demo-Handler fürs Kontaktformular (`form[data-demo]`), Jahr im Footer (`[data-year]`).

## Wiederkehrende Bausteine (CSS-Klassen)
- `.section`, `.section--soft`, `.section--dark` – Abschnitte
- `.container` – zentrierter Inhalt (max. 1180px)
- `.card`, `.grid--2/3/4` – Kachel-Raster
- `.split` / `.split--reverse` – zweispaltige Text/Bild-Blöcke
- `.ph` – **Bild-Platzhalter** (schraffiert); später durch `<img>` ersetzen
- `.spec` – technische Datentabelle (siehe `maschinenpark.html`)
- `.steps` / `.step` – nummerierte Prozessschritte
- `.cta` – blauer Call-to-Action-Banner
- `.checklist`, `.pill`, `.taglist` – Listen/Badges

## Inhaltliche Eckdaten (aus Kundenangaben)
- **Fräsen im Vordergrund**, 5-Achs-Fräsmaschine
- Fräswege: **X 0–1.400 mm**, **Y bis 800 mm**, **Z bis 650 mm**
- **Teilautomatisiert** – Automationstechnik von Lang Technik (Robo-Trex), extern verlinkt
- Ideale **Losgröße 10–50** Stück
- Fertigungsschritte: Fräsen → **Erodieren** → **Oberflächenbehandlung** → **Wärmebehandlung**
- Folgeprozesse teils **mit Kooperationspartnern**

## Logo
- Eingebunden in Header **und** Footer aller Seiten via
  `<img class="brand__logo" src="logo_kimmich_transparent_web_567x162pixel.png" …>`.
- Weitere Varianten liegen im Repo-Root (Druck 20×6 / 50×14 cm als JPG/PNG).
- Größe/Verhalten über `.brand__logo` in `css/style.css` steuerbar.

## Noch offen / Platzhalter
- Echte Fotos (`.ph`-Blöcke)
- Echte Kontaktdaten (Adresse/Telefon/E-Mail in Footer & `kontakt.html`)
- Formular-Backend (aktuell Demo ohne Versand)
- Impressum/Datenschutz-Seiten (aktuell auf `#` verlinkt)
