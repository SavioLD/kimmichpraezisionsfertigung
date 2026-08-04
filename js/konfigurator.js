/* ============================================================================
   Armin Kimmich Präzisionsfertigung — Angebots-Rechner
   Positionen verwalten, Erstangebot berechnen, Anfrage senden (Web3Forms).
   Alle Preise kommen aus js/preise.js — hier steht nur die Logik.
   ============================================================================ */
(function () {
  'use strict';

  var P = window.KIMMICH_PREISE;
  var form = document.getElementById('calc-form');
  if (!form || !P) { return; }

  var wrap = document.getElementById('positions');
  var counter = 0;

  var eur = function (n) {
    return Math.round(n).toLocaleString('de-DE') + ' ' + P.einstellungen.waehrung;
  };
  var opts = function (obj) {
    return Object.keys(obj).map(function (k) {
      return '<option value="' + k + '">' + obj[k].name + '</option>';
    }).join('');
  };

  /* ---- Terminauswahl aus der Preisdatei füllen --------------------------- */
  var tsel = document.getElementById('f_termin');
  tsel.innerHTML = Object.keys(P.termine).map(function (k) {
    var z = P.termine[k].zuschlag;
    var tag = z > 0 ? ' (+' + Math.round(z * 100) + ' %)' : (z < 0 ? ' (' + Math.round(z * 100) + ' %)' : '');
    return '<option value="' + k + '"' + (k === 'standard' ? ' selected' : '') + '>' + P.termine[k].name + tag + '</option>';
  }).join('');

  /* ---- Eine Position anlegen --------------------------------------------- */
  function addPosition() {
    counter++;
    var id = 'p' + counter;
    var el = document.createElement('div');
    el.className = 'pos';
    el.dataset.id = id;
    el.innerHTML =
      '<div class="pos__head">' +
        '<div class="pos__badge"></div>' +
        '<div class="pos__title">Position</div>' +
        '<div class="pos__price">–</div>' +
        '<button type="button" class="pos__del" title="Position entfernen" aria-label="Position entfernen">&times;</button>' +
      '</div>' +
      '<div class="pos__body">' +
        '<div class="frow frow--3">' +
          '<div><label>Bezeichnung</label><input type="text" data-f="bez" placeholder="z. B. Lagerbock"></div>' +
          '<div><label>Leistung</label><select data-f="leistung">' + opts(P.leistungen) + '</select></div>' +
          '<div><label>Werkstoff</label><select data-f="werkstoff">' + opts(P.werkstoffe) + '</select></div>' +
        '</div>' +
        '<div class="frow">' +
          '<div><label>Länge (mm)</label><input type="number" data-f="l" min="0" step="1" placeholder="120"></div>' +
          '<div><label>Breite / Ø (mm)</label><input type="number" data-f="b" min="0" step="1" placeholder="80"></div>' +
          '<div><label>Höhe (mm)</label><input type="number" data-f="h" min="0" step="1" placeholder="40"></div>' +
          '<div><label>Stückzahl</label><input type="number" data-f="stk" min="1" step="1" value="25"></div>' +
        '</div>' +
        '<div class="frow frow--3">' +
          '<div><label>Komplexität</label><select data-f="komplex">' + opts(P.komplexitaet) + '</select></div>' +
          '<div style="grid-column:span 2"><label>Zusatzleistungen</label>' +
            '<div class="addons">' +
              Object.keys(P.zusatz).map(function (k) {
                return '<label class="addon"><input type="checkbox" data-z="' + k + '">' +
                       '<span>' + P.zusatz[k].name + '</span></label>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    el.querySelector('.pos__del').addEventListener('click', function () {
      if (wrap.children.length <= 1) { return; }
      el.remove();
      render();
    });
    el.querySelector('[data-f="komplex"]').value = 'mittel';
    wrap.appendChild(el);
    render();
  }

  /* ---- Preis einer Position ---------------------------------------------- */
  function calcPosition(el) {
    var get = function (f) { var e = el.querySelector('[data-f="' + f + '"]'); return e ? e.value : ''; };
    var n = function (f) { var v = parseFloat(get(f)); return isNaN(v) ? 0 : v; };

    var L = P.leistungen[get('leistung')];
    var W = P.werkstoffe[get('werkstoff')];
    var K = P.komplexitaet[get('komplex')] || P.komplexitaet.mittel;
    var stk = Math.max(1, n('stk'));
    var l = n('l'), b = n('b'), h = n('h');

    // Rohteilvolumen (cm³) inkl. Verschnitt
    var volCm3 = (l * b * (h || b)) / 1000 * P.einstellungen.verschnittFaktor;
    var gewichtKg = volCm3 * W.dichte / 1000;

    // Bearbeitungszeit je Teil
    var minProTeil = (L.grundzeitMin + volCm3 * L.minProCm3) * W.zerspanFaktor * K.faktor;
    var bearbeitung = minProTeil / 60 * L.stundensatz;
    var material = gewichtKg * W.preisProKg;

    // Mengenstaffel
    var rabatt = 0;
    P.mengenstaffel.forEach(function (s) { if (stk >= s.abStueck) { rabatt = s.rabatt; } });

    var stueckkosten = (bearbeitung + material) * (1 - rabatt);

    // Zusatzleistungen
    var zusatzSumme = 0, zusatzNamen = [];
    Array.prototype.forEach.call(el.querySelectorAll('[data-z]:checked'), function (c) {
      var z = P.zusatz[c.dataset.z];
      zusatzNamen.push(z.name);
      if (z.art === 'proTeil') { zusatzSumme += z.wert * stk; }
      else if (z.art === 'pauschal') { zusatzSumme += z.wert; }
      else if (z.art === 'prozent') { zusatzSumme += stueckkosten * stk * z.wert; }
    });

    var ruestkosten = L.ruestzeitMin / 60 * L.stundensatz;
    var summe = ruestkosten + stueckkosten * stk + zusatzSumme;

    return {
      bez: get('bez') || 'Position', leistung: L.name, werkstoff: W.name,
      stk: stk, l: l, b: b, h: h, komplex: K.name,
      minProTeil: minProTeil, gewichtKg: gewichtKg, rabatt: rabatt,
      zusatz: zusatzNamen, summe: summe, hatMasse: (l > 0 && b > 0)
    };
  }

  /* ---- Machbarkeits-Hinweise --------------------------------------------- */
  function statusBox(type, title, text) {
    return '<div class="status status--' + type + '"><div><b>' + title + '</b>' + text + '</div></div>';
  }
  function checks(rows) {
    var g = P.grenzen, html = '', tooBig = false, gesamtStk = 0;
    rows.forEach(function (r) {
      gesamtStk += r.stk;
      var d = [r.l, r.b, r.h].filter(function (v) { return v > 0; }).sort(function (a, c) { return c - a; });
      if (d.length && (d[0] > g.fraesenX || (d[1] && d[1] > g.fraesenY) || (d[2] && d[2] > g.fraesenZ))) { tooBig = true; }
    });
    if (tooBig) {
      html += statusBox('warn', 'Bauteil über Standard-Arbeitsraum',
        'Fräsen bis ' + g.fraesenX + ' × ' + g.fraesenY + ' × ' + g.fraesenZ + ' mm. Fragen Sie trotzdem an – oft findet sich eine Lösung.');
    }
    if (gesamtStk > 0) {
      if (gesamtStk >= g.losIdealVon && gesamtStk <= g.losIdealBis) {
        html += statusBox('ok', 'Ideale Losgröße', 'Bei ' + g.losIdealVon + '–' + g.losIdealBis + ' Stück fertigen wir besonders wirtschaftlich.');
      } else if (gesamtStk > g.losIdealBis) {
        html += statusBox('info', 'Größere Serie', 'Ab ' + (g.losIdealBis + 1) + ' Stück stimmen wir Takt und Automatisierung individuell ab.');
      }
    }
    return html;
  }

  /* ---- Gesamtberechnung + Anzeige ---------------------------------------- */
  var last = { rows: [], gesamt: 0 };

  function render() {
    var rows = [], zwischen = 0;

    Array.prototype.forEach.call(wrap.children, function (el, i) {
      var r = calcPosition(el);
      rows.push(r);
      zwischen += r.summe;
      el.querySelector('.pos__badge').textContent = i + 1;
      el.querySelector('.pos__title').textContent = r.bez + ' · ' + r.leistung;
      el.querySelector('.pos__price').textContent = r.hatMasse ? eur(r.summe) : 'Maße fehlen';
    });

    var termin = P.termine[document.getElementById('f_termin').value] || P.termine.standard;
    var zuschlag = zwischen * termin.zuschlag;
    var gesamt = Math.max(zwischen + zuschlag, zwischen > 0 ? P.einstellungen.mindestauftragswert : 0);

    var anyMasse = rows.some(function (r) { return r.hatMasse; });
    var spanne = P.einstellungen.spanneProzent / 100;
    var stkGesamt = rows.reduce(function (a, r) { return a + r.stk; }, 0);

    var amount = document.getElementById('q_amount');
    var per = document.getElementById('q_per');
    var lines = document.getElementById('q_lines');

    if (!anyMasse) {
      amount.textContent = '–';
      per.textContent = 'Bitte Maße eingeben';
      lines.innerHTML = '<div class="quote__empty">Sobald Länge und Breite eingetragen sind, berechnen wir Ihr Erstangebot.</div>';
    } else {
      amount.textContent = eur(gesamt * (1 - spanne)) + ' – ' + eur(gesamt * (1 + spanne));
      per.textContent = stkGesamt + ' Teile gesamt · ca. ' + eur(gesamt / Math.max(1, stkGesamt)) + ' je Teil';

      var html = '';
      rows.forEach(function (r, i) {
        html += '<div class="quote__line"><span>' + (i + 1) + '. ' + r.bez + ' (' + r.stk + ' Stk)</span><b>' + eur(r.summe) + '</b></div>';
      });
      if (termin.zuschlag !== 0) {
        html += '<div class="quote__line"><span>' + termin.name + '</span><b>' + (zuschlag > 0 ? '+' : '') + eur(zuschlag) + '</b></div>';
      }
      html += '<div class="quote__line quote__line--sum"><span>Kalkulierte Summe</span><b>' + eur(gesamt) + '</b></div>';
      lines.innerHTML = html;
    }

    document.getElementById('q_status').innerHTML = anyMasse ? checks(rows) : '';
    last = { rows: rows, gesamt: gesamt, spanne: spanne, termin: termin, anyMasse: anyMasse };
  }

  /* ---- Zusammenfassung für die E-Mail ------------------------------------ */
  function summary() {
    var out = [];
    last.rows.forEach(function (r, i) {
      out.push(
        'POSITION ' + (i + 1) + ': ' + r.bez +
        '\n  Leistung:   ' + r.leistung +
        '\n  Werkstoff:  ' + r.werkstoff +
        '\n  Maße:       ' + r.l + ' x ' + r.b + (r.h ? ' x ' + r.h : '') + ' mm' +
        '\n  Stückzahl:  ' + r.stk + ' Stk' +
        '\n  Komplexität:' + r.komplex +
        (r.zusatz.length ? '\n  Zusatz:     ' + r.zusatz.join(', ') : '') +
        '\n  Kalkuliert: ' + eur(r.summe)
      );
    });
    return out.join('\n\n');
  }

  /* ---- Events ------------------------------------------------------------ */
  document.getElementById('add-pos').addEventListener('click', addPosition);
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  addPosition();

  /* ---- Absenden ---------------------------------------------------------- */
  var note = form.querySelector('.form__result');
  function say(msg, color) { note.hidden = false; note.style.color = color; note.textContent = msg; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    [['f_name', false], ['f_email', true]].forEach(function (pair) {
      var el = document.getElementById(pair[0]), field = el.closest('.field');
      var bad = !el.value.trim() || (pair[1] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      if (field) { field.classList.toggle('is-error', bad); }
      if (bad) { ok = false; }
    });
    if (!last.anyMasse) { say('Bitte tragen Sie mindestens bei einer Position die Maße ein.', '#b91c1c'); return; }
    if (!ok) { say('Bitte prüfen Sie die markierten Felder.', '#b91c1c'); return; }

    document.getElementById('f_positionen').value = summary();
    document.getElementById('f_summe').value =
      eur(last.gesamt * (1 - last.spanne)) + ' bis ' + eur(last.gesamt * (1 + last.spanne)) +
      ' (kalkuliert: ' + eur(last.gesamt) + ', ' + last.termin.name + ')';

    say('Wird gesendet …', 'var(--accent-dark)');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.success) {
          say('Vielen Dank! Ihre Anfrage ist eingegangen – wir melden uns mit einem verbindlichen Angebot.', 'var(--accent-dark)');
        } else {
          say('Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.', '#b91c1c');
        }
      })
      .catch(function () { say('Netzwerkfehler – bitte erneut versuchen oder anrufen.', '#b91c1c'); });
  });
})();
