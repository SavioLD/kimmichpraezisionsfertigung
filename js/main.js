/* Armin Kimmich Präzisionsfertigung – Interaktionen */
(function () {
  'use strict';

  /* --- JS-Flag setzen (steuert Reveal-Animation via CSS) ---------------- */
  document.documentElement.classList.add('js');

  /* --- Mobiles Menü ----------------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Reveal beim Scrollen -------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Kontaktformular (Platzhalter, kein Backend) --------------------- */
  var form = document.querySelector('form[data-demo]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form__result');
      if (note) {
        note.hidden = false;
        note.textContent = 'Vielen Dank! Dies ist eine Demo-Ansicht – bitte hinterlegen Sie ein Formular-Backend, damit Anfragen versendet werden.';
      }
      form.reset();
    });
  }

  /* --- Jahr im Footer -------------------------------------------------- */
  var yr = document.querySelector('[data-year]');
  if (yr) { yr.textContent = new Date().getFullYear(); }
})();
