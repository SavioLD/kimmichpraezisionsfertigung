/* ============================================================================
   PREIS-KONFIGURATION — Armin Kimmich Präzisionsfertigung
   ----------------------------------------------------------------------------
   HIER WERDEN ALLE PREISE GEPFLEGT. Nur diese Datei anpassen –
   der Rechner auf der Website übernimmt die Werte automatisch.

   >>> ALLE ZAHLEN UNTEN SIND PLATZHALTER FÜR DEN PROTOTYP. <<<
   Bitte durch die echten Werte ersetzen. Fragezeichen? Einfach melden.
   ============================================================================ */

window.KIMMICH_PREISE = {

  /* --------------------------------------------------------------------------
     1) GRUNDEINSTELLUNGEN
     -------------------------------------------------------------------------- */
  einstellungen: {
    waehrung: '€',
    // Spanne, mit der das Erstangebot ausgewiesen wird (± Prozent)
    spanneProzent: 20,
    // Aufschlag auf das Rohteil-Volumen (Verschnitt / Aufmaß)
    verschnittFaktor: 1.30,
    // Mindestauftragswert – darunter wird auf diesen Betrag aufgerundet
    mindestauftragswert: 150,
    // Anzeige erst ab dieser Anzahl gefüllter Angaben (0 = immer)
    preisAnzeigen: true
  },

  /* --------------------------------------------------------------------------
     2) LEISTUNGEN / MASCHINEN
        stundensatz  = Maschinenstundensatz in €/h
        ruestzeitMin = einmalige Rüstzeit je Position in Minuten
        grundzeitMin = Grundbearbeitungszeit je Teil in Minuten
        minProCm3    = zusätzliche Minuten je cm³ Zerspanvolumen
     -------------------------------------------------------------------------- */
  leistungen: {
    fraesen:    { name: 'Fräsen (5-Achs)',   stundensatz:  95, ruestzeitMin: 45, grundzeitMin: 8,  minProCm3: 0.035 },
    drehen:     { name: 'Drehen',            stundensatz:  75, ruestzeitMin: 30, grundzeitMin: 5,  minProCm3: 0.025 },
    schleifen:  { name: 'Schleifen',         stundensatz:  80, ruestzeitMin: 25, grundzeitMin: 6,  minProCm3: 0.015 },
    erodieren:  { name: 'Erodieren',         stundensatz: 110, ruestzeitMin: 40, grundzeitMin: 12, minProCm3: 0.090 }
  },

  /* --------------------------------------------------------------------------
     3) WERKSTOFFE
        preisProKg    = Materialpreis in €/kg
        dichte        = g/cm³ (für die Gewichtsberechnung)
        zerspanFaktor = Zeitfaktor (1.0 = normal, höher = schwerer zerspanbar)
     -------------------------------------------------------------------------- */
  werkstoffe: {
    baustahl:     { name: 'Baustahl (S235JRC, S355J2)',        preisProKg:  1.90, dichte: 7.85, zerspanFaktor: 1.00 },
    automatenst:  { name: 'Automatenstahl (11SMn30, 9SMnPb28)',preisProKg:  2.40, dichte: 7.85, zerspanFaktor: 0.85 },
    verguetungst: { name: 'Vergütungsstahl (42CrMo4V, 16MnCr5)',preisProKg: 3.20, dichte: 7.85, zerspanFaktor: 1.25 },
    werkzeugst:   { name: 'Werkzeugstahl (1.2210, 1.2379, 1.2842)', preisProKg: 8.90, dichte: 7.85, zerspanFaktor: 1.80 },
    edelstahl:    { name: 'Edelstahl (1.4301, 1.4305, 1.4112)',preisProKg:  6.50, dichte: 7.90, zerspanFaktor: 1.60 },
    aluminium:    { name: 'Aluminium (AlMgSi1, 7075, AlCuMgPb)',preisProKg: 6.80, dichte: 2.75, zerspanFaktor: 0.60 },
    messing:      { name: 'Messing (CuZn39Pb3 / MS 58)',       preisProKg:  9.50, dichte: 8.45, zerspanFaktor: 0.55 },
    rotguss:      { name: 'Rotguss (Rg-7, CuSn7ZnPb)',         preisProKg: 13.50, dichte: 8.80, zerspanFaktor: 0.90 },
    albronze:     { name: 'Aluminiumbronze (CuAl10Ni5Fe4)',    preisProKg: 15.00, dichte: 7.60, zerspanFaktor: 1.45 },
    kupfer:       { name: 'Kupfer (E-Cu57, Cu-HCP, CuTeP)',    preisProKg: 12.50, dichte: 8.93, zerspanFaktor: 1.10 },
    beistellung:  { name: 'Material wird beigestellt',         preisProKg:  0.00, dichte: 7.85, zerspanFaktor: 1.00 }
  },

  /* --------------------------------------------------------------------------
     4) KOMPLEXITÄT — Zeitfaktor auf die Bearbeitung
     -------------------------------------------------------------------------- */
  komplexitaet: {
    einfach: { name: 'Einfach – wenige Flächen, weite Toleranzen', faktor: 0.75 },
    mittel:  { name: 'Mittel – mehrere Seiten, ISO 2768-m',        faktor: 1.00 },
    komplex: { name: 'Komplex – Freiformen, enge Toleranzen',      faktor: 1.55 }
  },

  /* --------------------------------------------------------------------------
     5) MENGENSTAFFEL — Rabatt auf die Stückkosten ab Stückzahl
        (Rüstkosten verteilen sich zusätzlich automatisch auf die Menge)
     -------------------------------------------------------------------------- */
  mengenstaffel: [
    { abStueck:   1, rabatt: 0.00 },
    { abStueck:  10, rabatt: 0.05 },
    { abStueck:  25, rabatt: 0.10 },
    { abStueck:  50, rabatt: 0.15 },
    { abStueck: 100, rabatt: 0.20 }
  ],

  /* --------------------------------------------------------------------------
     6) ZUSATZLEISTUNGEN
        art: 'proTeil'   = Betrag je Stück
             'pauschal'  = Betrag je Position
             'prozent'   = Aufschlag auf die Positionssumme
     -------------------------------------------------------------------------- */
  zusatz: {
    haerten:       { name: 'Härten / Vakuum- oder Einsatzhärten', art: 'proTeil',  wert:  4.50 },
    nitrieren:     { name: 'Plasmanitrieren / Tenifer',           art: 'proTeil',  wert:  5.50 },
    bruenieren:    { name: 'Brünieren',                           art: 'proTeil',  wert:  3.20 },
    eloxieren:     { name: 'Eloxieren / Harteloxieren',           art: 'proTeil',  wert:  6.00 },
    vernickeln:    { name: 'Chem. Vernickeln (DURNI-COAT)',       art: 'proTeil',  wert:  8.50 },
    verzinken:     { name: 'Verzinken + Blau-Passivieren',        art: 'proTeil',  wert:  4.00 },
    lackieren:     { name: 'Lackieren in RAL',                    art: 'proTeil',  wert:  7.50 },
    messprotokoll: { name: 'Messprotokoll / Erstmusterprüfbericht', art: 'pauschal', wert: 95.00 },
    montage:       { name: 'Montage zur Baugruppe',               art: 'proTeil',  wert: 12.00 }
  },

  /* --------------------------------------------------------------------------
     7) TERMIN-ZUSCHLÄGE (Aufschlag auf die Gesamtsumme)
     -------------------------------------------------------------------------- */
  termine: {
    express:  { name: 'Express – bis 10 Arbeitstage', zuschlag: 0.25 },
    standard: { name: 'Standard – 3 bis 4 Wochen',    zuschlag: 0.00 },
    flexibel: { name: 'Terminlich flexibel',          zuschlag: -0.05 }
  },

  /* --------------------------------------------------------------------------
     8) ARBEITSRAUM-GRENZEN (für den Machbarkeits-Check)
     -------------------------------------------------------------------------- */
  grenzen: {
    fraesenX: 1400, fraesenY: 800, fraesenZ: 650,
    drehenD:   800, drehenL: 4000, drehenCncD: 400,
    schleifenX: 550, schleifenY: 800,
    losIdealVon: 10, losIdealBis: 50
  }
};
