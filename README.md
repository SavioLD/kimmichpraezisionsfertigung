# Armin Kimmich Präzisionsfertigung – Website

Statische Website (HTML/CSS/JS, **kein Build-Schritt nötig**) für die
Armin Kimmich Präzisionsfertigung – CNC-Fertigung mit Schwerpunkt Fräsen.

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` | Startseite (Hero, Leistungen, Fräsen im Fokus, Automation, CTA) |
| `leistungen.html` | Leistungsspektrum (CNC-Fräsen, Erodieren, Folgeprozesse) |
| `maschinenpark.html` | 5-Achs-Fräsmaschine, Fräswege (X 1.400 / Y 800 / Z 650), Automation |
| `qualitaet-prozesse.html` | Fertigungsschritte: Fräsen → Erodieren → Oberflächen → Wärmebehandlung; Kooperationspartner |
| `branchen.html` | Branchen / Anwendungen |
| `galerie.html` | Bildergalerie mit Lightbox |
| `karriere.html` | Karriere & offene Stellen |
| `kontakt.html` | Kontaktdaten + Anfrageformular |

## Struktur
```
├─ *.html            – die einzelnen Seiten
├─ css/style.css     – Design-System (Inter, Akzent #1c9ce5)
├─ js/main.js        – Mobile-Navigation, Scroll-Reveal, Galerie-Lightbox, Kontaktformular
└─ assets/           – Medien (Favicon vorhanden; Fotos/Logo offen)
```

## Design
- **Schrift:** Inter
- **Akzentfarbe:** `#1c9ce5`

## Lokale Vorschau
Einfach `index.html` im Browser öffnen – oder:
```bash
python3 -m http.server 8000   # dann http://localhost:8000
```

## Bilder
Echte Fotos sind eingebunden (Dateien `001.jpg`–`041.jpg` im Repo-Root):
Hero + Split-Blöcke der Startseite, Maschinenpark (5-Achs, Automation),
Leistungen, Qualität, Branchen und Karriere. Weitere ungenutzte Motive
(Gebäude, Rohmaterial, Team, Sägen, INDEX-Drehen …) stehen für Erweiterungen bereit.

## Noch offen (Platzhalter)
- Echte **Kontaktdaten** (Adresse/Telefon/E-Mail sind Platzhalter)
- **Impressum** & **Datenschutz** – aktuell nur Platzhalter-Links (`#`)

## Kontaktformular (Web3Forms)
Das Formular auf `kontakt.html` sendet per AJAX an **Web3Forms**
(`api.web3forms.com`). Der Access Key steht im `access_key`-Hidden-Feld
(öffentlich, das ist so vorgesehen). Anfragen gehen an die bei Web3Forms
hinterlegte Empfänger-Mail – **diese muss dort einmalig bestätigt werden**,
sonst werden keine Mails zugestellt. Spam-Schutz via Honeypot-Feld `botcheck`.

## Veröffentlichung via GitHub Pages (optional)
Settings → Pages → Branch `main` / `root`. Eine `.nojekyll`-Datei ist enthalten.
