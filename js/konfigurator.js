/* ============================================================================
   Armin Kimmich Präzisionsfertigung — Fertigungsanfrage
   Teile + Menge, Zeichnung/Modell hochladen, Bemerkungen, Versand (Web3Forms).
   Bewusst ohne Preisanzeige.
   ============================================================================ */
(function () {
  'use strict';

  var form = document.getElementById('calc-form');
  if (!form) { return; }

  var wrap = document.getElementById('positions');
  var fileInput = document.getElementById('f_files');
  var fileList = document.getElementById('filelist');
  var dropzone = document.getElementById('dropzone');
  var counter = 0;

  /* ---- Position anlegen --------------------------------------------------- */
  function addPosition() {
    counter++;
    var el = document.createElement('div');
    el.className = 'pos';
    el.innerHTML =
      '<div class="pos__head">' +
        '<div class="pos__badge"></div>' +
        '<div class="pos__title">Teil</div>' +
        '<button type="button" class="pos__del" title="Teil entfernen" aria-label="Teil entfernen">&times;</button>' +
      '</div>' +
      '<div class="pos__body">' +
        '<div class="frow frow--2">' +
          '<div><label>Bezeichnung <span style="font-weight:500;color:var(--muted)">(optional)</span></label>' +
            '<input type="text" data-f="bez" placeholder="z. B. Lagerbock oder Zeichnungs-Nr."></div>' +
          '<div><label>Stückzahl *</label>' +
            '<input type="number" data-f="stk" min="1" step="1" value="10"></div>' +
        '</div>' +
      '</div>';

    el.querySelector('.pos__del').addEventListener('click', function () {
      if (wrap.children.length <= 1) { return; }
      el.remove();
      render();
    });
    wrap.appendChild(el);
    render();
  }

  /* ---- Dateiliste --------------------------------------------------------- */
  var chosen = [];

  function fmtSize(b) {
    return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  }

  function syncInput() {
    // Auswahl zurück in das File-Input schreiben (für den Versand)
    var dt = new DataTransfer();
    chosen.forEach(function (f) { dt.items.add(f); });
    fileInput.files = dt.files;
  }

  function renderFiles() {
    fileList.innerHTML = '';
    chosen.forEach(function (f, i) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="filelist__name">' + f.name + '</span>' +
                     '<span class="filelist__size">' + fmtSize(f.size) + '</span>' +
                     '<button type="button" class="pos__del" aria-label="Datei entfernen">&times;</button>';
      li.querySelector('button').addEventListener('click', function () {
        chosen.splice(i, 1); syncInput(); renderFiles(); render();
      });
      fileList.appendChild(li);
    });
  }

  function addFiles(files) {
    Array.prototype.forEach.call(files, function (f) {
      var dup = chosen.some(function (c) { return c.name === f.name && c.size === f.size; });
      if (!dup) { chosen.push(f); }
    });
    syncInput(); renderFiles(); render();
  }

  fileInput.addEventListener('change', function () { addFiles(fileInput.files); });

  ['dragenter', 'dragover'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('is-over'); });
  });
  dropzone.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) { addFiles(e.dataTransfer.files); }
  });

  /* ---- Übersicht ---------------------------------------------------------- */
  function rows() {
    return Array.prototype.map.call(wrap.children, function (el) {
      var bez = el.querySelector('[data-f="bez"]').value.trim();
      var stk = parseInt(el.querySelector('[data-f="stk"]').value, 10) || 0;
      return { bez: bez, stk: stk };
    });
  }

  function render() {
    var list = rows(), gesamt = 0, html = '';

    Array.prototype.forEach.call(wrap.children, function (el, i) {
      el.querySelector('.pos__badge').textContent = i + 1;
      el.querySelector('.pos__title').textContent = list[i].bez || 'Teil ' + (i + 1);
    });

    list.forEach(function (r, i) {
      gesamt += r.stk;
      html += '<div class="quote__line"><span>' + (i + 1) + '. ' + (r.bez || 'Teil ' + (i + 1)) +
              '</span><b>' + (r.stk ? r.stk + ' Stk' : '–') + '</b></div>';
    });

    html += '<div class="quote__line quote__line--sum"><span>Teile gesamt</span><b>' + gesamt + ' Stk</b></div>';
    html += '<div class="quote__line"><span>Unterlagen</span><b>' +
            (chosen.length ? chosen.length + ' Datei' + (chosen.length > 1 ? 'en' : '') : 'noch keine') + '</b></div>';

    document.getElementById('q_lines').innerHTML = html;
  }

  /* ---- Zusammenfassung für die E-Mail ------------------------------------- */
  function summary() {
    var out = rows().map(function (r, i) {
      return (i + 1) + '. ' + (r.bez || 'Teil ' + (i + 1)) + ' — ' + r.stk + ' Stück';
    });
    if (chosen.length) {
      out.push('', 'HOCHGELADENE DATEIEN:');
      chosen.forEach(function (f) { out.push('  - ' + f.name + ' (' + fmtSize(f.size) + ')'); });
    } else {
      out.push('', 'HINWEIS: Es wurden keine Unterlagen hochgeladen.');
    }
    return out.join('\n');
  }

  /* ---- Start -------------------------------------------------------------- */
  document.getElementById('add-pos').addEventListener('click', addPosition);
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  addPosition();

  /* ---- Absenden ----------------------------------------------------------- */
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
    if (!rows().some(function (r) { return r.stk > 0; })) {
      say('Bitte geben Sie bei mindestens einem Teil eine Stückzahl an.', '#b91c1c');
      return;
    }
    if (!ok) { say('Bitte prüfen Sie die markierten Felder.', '#b91c1c'); return; }

    document.getElementById('f_positionen').value = summary();
    say('Wird gesendet …', 'var(--accent-dark)');

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.success) {
          say('Vielen Dank! Ihre Anfrage ist eingegangen – wir melden uns mit Ihrem Angebot.', 'var(--accent-dark)');
        } else {
          say('Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.', '#b91c1c');
        }
      })
      .catch(function () { say('Netzwerkfehler – bitte erneut versuchen oder anrufen.', '#b91c1c'); });
  });
})();
