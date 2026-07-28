/* ============================================================
   Armin Kimmich Präzisionsfertigung — Anfrage-Konfigurator
   Live-Zusammenfassung + Machbarkeits-Check + Versand (Web3Forms)
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('konf-form');
  if (!form) { return; }

  var $ = function (id) { return document.getElementById(id); };
  var val = function (id) { var e = $(id); return e ? e.value.trim() : ''; };
  var num = function (id) { var v = parseFloat(val(id).replace(',', '.')); return isNaN(v) ? 0 : v; };

  /* Reale Maschinengrenzen (siehe Maschinenpark) */
  var LIMITS = { x: 1400, y: 800, z: 650 };
  var LOS = { min: 10, max: 50 };

  var result = $('r_status');

  function services() {
    var out = [];
    Array.prototype.forEach.call(
      document.querySelectorAll('#k-services input:checked'),
      function (c) { out.push(c.value); }
    );
    return out;
  }

  /* Prozesskette in sinnvoller Reihenfolge sortieren */
  var ORDER = ['Fräsen (5-Achs)', 'Drehen', 'Erodieren', 'Schleifen',
               'Oberflächen / Wärmebehandlung', 'Baugruppen / Montage'];
  function chain(list) {
    return ORDER.filter(function (s) { return list.indexOf(s) !== -1; });
  }

  function statusBox(type, title, text) {
    return '<div class="status status--' + type + '"><div><b>' + title + '</b>' + text + '</div></div>';
  }

  function render() {
    var svc = services();
    var l = num('k_l'), b = num('k_b'), h = num('k_h');
    var qty = num('k_qty');

    /* Zusammenfassung */
    $('r_services').textContent = svc.length ? svc.length + ' ausgewählt' : 'noch keine';
    $('r_material').textContent = ($('k_material').options[$('k_material').selectedIndex].value || '–').split(' (')[0];
    $('r_size').textContent = (l && b) ? (l + ' × ' + b + (h ? ' × ' + h : '') + ' mm') : '–';
    $('r_qty').textContent = qty ? qty + ' Stk' : '–';

    /* Prozesskette */
    var box = $('r_chain');
    box.innerHTML = '';
    chain(svc).forEach(function (s) {
      var el = document.createElement('span');
      el.textContent = s.replace(' (5-Achs)', '').replace(' / Wärmebehandlung', '');
      box.appendChild(el);
    });
    if (!svc.length) { box.innerHTML = '<span style="background:none;color:#8fa0af">Bitte Leistung wählen</span>'; }

    /* Machbarkeits-Check */
    var html = '';
    if (l || b || h) {
      var dims = [l, b, h].filter(function (v) { return v > 0; }).sort(function (a, c) { return c - a; });
      var over = (dims[0] > LIMITS.x) || (dims[1] && dims[1] > LIMITS.y) || (dims[2] && dims[2] > LIMITS.z);
      if (over) {
        html += statusBox('warn', 'Größer als unser Standard-Arbeitsraum',
          'Fräsen bis 1.400 × 800 × 650 mm. Senden Sie uns die Anfrage trotzdem – oft findet sich eine Lösung, ggf. über Drehen oder unsere Partner.');
      } else {
        html += statusBox('ok', 'Passt in unseren Arbeitsraum',
          'Ihre Maße liegen innerhalb von 1.400 × 800 × 650 mm.');
      }
    }

    /* Losgrößen-Hinweis */
    if (qty > 0) {
      if (qty >= LOS.min && qty <= LOS.max) {
        html += statusBox('ok', 'Ideale Losgröße',
          'Bei 10–50 Stück sind wir dank teilautomatisierter Fertigung besonders wirtschaftlich.');
      } else if (qty < LOS.min) {
        html += statusBox('info', 'Kleine Stückzahl',
          'Auch Prototypen und Einzelteile fertigen wir – gerne mit Blick auf eine spätere Serie.');
      } else {
        html += statusBox('info', 'Größere Serie',
          'Für Stückzahlen über 50 stimmen wir Takt und Automatisierung individuell mit Ihnen ab.');
      }
    }

    /* Hinweis Kooperationspartner */
    if (svc.indexOf('Oberflächen / Wärmebehandlung') !== -1) {
      html += statusBox('info', 'Mit Kooperationspartnern',
        'Oberflächen- und Wärmebehandlung führen wir mit ausgewählten Partnerfirmen aus – koordiniert aus einer Hand.');
    }

    result.innerHTML = html;
  }

  /* Zusammenfassung für die E-Mail */
  function summary() {
    var svc = chain(services());
    var l = val('k_l'), b = val('k_b'), h = val('k_h');
    var lines = [
      'LEISTUNGEN: ' + (svc.length ? svc.join(' → ') : 'keine Angabe'),
      'WERKSTOFF: ' + val('k_material') + (val('k_material_text') ? ' (' + val('k_material_text') + ')' : ''),
      'MASSE: ' + (l || '?') + ' × ' + (b || '?') + (h ? ' × ' + h : '') + ' mm',
      'STÜCKZAHL: ' + val('k_qty') + ' Stk · ' + val('k_repeat'),
      'WUNSCHTERMIN: ' + val('k_termin'),
      'TOLERANZ: ' + val('k_toleranz'),
      'UNTERLAGEN: ' + val('k_zeichnung')
    ];
    if (val('k_nachricht')) { lines.push('NACHRICHT: ' + val('k_nachricht')); }
    return lines.join('\n');
  }

  /* Live-Update */
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();

  /* Versand */
  var note = form.querySelector('.form__result');
  function say(msg, color) {
    note.hidden = false;
    note.style.color = color;
    note.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Pflichtfelder */
    var ok = true;
    ['k_name', 'k_email'].forEach(function (id) {
      var el = $(id), field = el.closest('.field');
      var bad = !el.value.trim() || (id === 'k_email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      field.classList.toggle('is-error', bad);
      if (bad) { ok = false; }
    });
    if (!services().length) {
      say('Bitte wählen Sie mindestens eine Leistung aus.', '#b91c1c');
      return;
    }
    if (!ok) { say('Bitte prüfen Sie die markierten Felder.', '#b91c1c'); return; }

    $('k_summary').value = summary();
    say('Wird gesendet …', 'var(--accent-dark)');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          render();
          say('Vielen Dank! Ihre Anfrage ist eingegangen – wir melden uns zeitnah bei Ihnen.', 'var(--accent-dark)');
        } else {
          say('Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.', '#b91c1c');
        }
      })
      .catch(function () {
        say('Netzwerkfehler – bitte versuchen Sie es erneut oder rufen Sie uns an.', '#b91c1c');
      });
  });
})();
