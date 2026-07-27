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

  /* --- Galerie-Lightbox ------------------------------------------------ */
  var gallery = document.querySelector('[data-gallery]');
  var lightbox = document.querySelector('[data-lightbox]');
  if (gallery && lightbox) {
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('button'));
    var lbImg = lightbox.querySelector('img');
    var lbCount = lightbox.querySelector('.lightbox__count');
    var current = 0;

    function show(i) {
      current = (i + thumbs.length) % thumbs.length;
      var src = thumbs[current].getAttribute('data-full');
      var alt = thumbs[current].querySelector('img').getAttribute('alt') || '';
      lbImg.setAttribute('src', src);
      lbImg.setAttribute('alt', alt);
      if (lbCount) { lbCount.textContent = (current + 1) + ' / ' + thumbs.length; }
    }
    function open(i) { show(i); lightbox.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function close() { lightbox.classList.remove('is-open'); document.body.style.overflow = ''; }

    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });
    lightbox.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-lb');
      if (act === 'close' || e.target === lightbox) { close(); }
      else if (act === 'prev') { show(current - 1); }
      else if (act === 'next') { show(current + 1); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { show(current - 1); }
      else if (e.key === 'ArrowRight') { show(current + 1); }
    });
  }
})();
