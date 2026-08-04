/* Werkstoff-Bestellung — Validierung und Versand über Web3Forms */
(function () {
  'use strict';
  var form = document.getElementById('werkstoff-form');
  if (!form) { return; }

  var note = form.querySelector('.form__result');
  function say(msg, color) { note.hidden = false; note.style.color = color; note.textContent = msg; }

  var PFLICHT = ['w_gruppe', 'w_werkstoff', 'w_menge', 'w_masse', 'w_firma', 'w_name', 'w_email'];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    PFLICHT.forEach(function (id) {
      var el = document.getElementById(id), field = el.closest('.field');
      var bad = !el.value.trim();
      if (id === 'w_email' && !bad) { bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value); }
      field.classList.toggle('is-error', bad);
      if (bad) { ok = false; }
    });
    if (!ok) { say('Bitte prüfen Sie die markierten Felder.', '#b91c1c'); return; }

    say('Wird gesendet …', 'var(--accent-dark)');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.success) {
          form.reset();
          say('Vielen Dank! Ihre Material-Anfrage ist eingegangen – wir melden uns mit einem Angebot.', 'var(--accent-dark)');
        } else {
          say('Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.', '#b91c1c');
        }
      })
      .catch(function () { say('Netzwerkfehler – bitte erneut versuchen oder anrufen.', '#b91c1c'); });
  });
})();
