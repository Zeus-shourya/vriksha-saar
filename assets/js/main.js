/* =====================================================================
   VRIKSHĀ SAĀR — interaction & motion
   Zero dependencies. Everything degrades gracefully.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     ⚠️  CONFIG — SET THE STUDIO WHATSAPP NUMBER HERE
     Country code + number, digits only, no "+", no spaces.
     India example: 919812345678  (91 = country code)
     Until this is replaced, both WhatsApp links fall back to email.
     =================================================================== */
  var WHATSAPP_NUMBER = '918447396030';   // +91 84473 96030
  var WHATSAPP_MESSAGE = 'Hello Vrikshā Saār — I saw your website and would like to talk about a project.';
  var FALLBACK_EMAIL = 'vrikshasaar@gmail.com';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Checked live rather than once at boot: capability can differ at load time
  // (and a mouse can be plugged into a touch device mid-session).
  function isFine() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ================================================================
     1. WHATSAPP LINKS
     ================================================================ */
  function wireWhatsApp() {
    var configured = /^\d{8,15}$/.test(WHATSAPP_NUMBER);
    var href = configured
      ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE)
      : 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent('Project enquiry');

    $$('#wa, [data-wa]').forEach(function (el) {
      el.setAttribute('href', href);
      if (!configured) {
        el.setAttribute('target', '_self');
        el.setAttribute('title', 'WhatsApp number not set yet — opens email instead');
      }
    });
    if (!configured) {
      console.warn('[Vrikshā Saār] WhatsApp number not set. Edit WHATSAPP_NUMBER at the top of assets/js/main.js');
    }
  }

  /* ================================================================
     2. SPLIT TEXT — wrap each word for staggered reveals
     ================================================================ */
  function splitText() {
    $$('[data-split]').forEach(function (el) {
      if (el.dataset.done) return;
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'w';
        var inner = document.createElement('i');
        inner.textContent = w;
        inner.style.setProperty('--d', (i * 55) + 'ms');
        span.appendChild(inner);
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
      el.dataset.done = '1';
    });
  }

  /* ================================================================
     3. SCROLL REVEALS
     ================================================================ */
  function reveals() {
    var targets = $$('[data-split], .reveal, .card, .step, .media-mask, .tree');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var d = parseInt(el.dataset.delay || '0', 10);
        if (d) el.style.transitionDelay = d + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ================================================================
     4. TREE SVG — measure paths so stroke-dash draws correctly
     ================================================================ */
  function prepTree() {
    $$('.tree .dash').forEach(function (p) {
      try {
        var len = Math.ceil(p.getTotalLength()) + 2;
        p.style.setProperty('--len', len);
      } catch (err) { /* getTotalLength unsupported */ }
    });
  }

  /* ================================================================
     5. PRELOADER
     ================================================================ */
  function preloader() {
    var loader = $('#loader');
    if (!loader) return;
    var fill = $('#loaderFill');
    var count = $('#loaderCount');
    var pct = 0;
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      loader.classList.add('is-out');
      document.body.classList.remove('is-locked');
      setTimeout(function () {
        loader.classList.add('is-gone');
        document.body.classList.add('is-ready');
        $$('.hero [data-split], .hero .reveal').forEach(function (el) {
          var d = parseInt(el.dataset.delay || '0', 10);
          if (d) el.style.transitionDelay = d + 'ms';
          el.classList.add('is-in');
        });
        var wa = $('#wa');
        if (wa) setTimeout(function () { wa.classList.add('is-ready'); }, 500);
      }, 780);
    }

    if (reduced) {
      loader.style.display = 'none';
      document.body.classList.add('is-ready');
      $$('.hero [data-split], .hero .reveal').forEach(function (el) { el.classList.add('is-in'); });
      var waR = $('#wa'); if (waR) waR.classList.add('is-ready');
      return;
    }

    document.body.classList.add('is-locked');
    var tick = setInterval(function () {
      pct += Math.random() * 9 + 3;
      if (pct >= 100) { pct = 100; clearInterval(tick); setTimeout(finish, 320); }
      if (fill) fill.style.width = pct + '%';
      if (count) count.textContent = pct < 10 ? '0' + Math.floor(pct) : Math.floor(pct);
    }, 90);

    // hard safety net
    setTimeout(function () { clearInterval(tick); finish(); }, 5200);
  }

  /* ================================================================
     6. CUSTOM CURSOR
     ================================================================ */
  function cursor() {
    if (reduced) return;
    var c = $('.cursor');
    var dot = $('.cursor__dot');
    var ring = $('.cursor__ring');
    var label = $('.cursor__label');
    if (!c) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var armed = false, touched = false;

    window.addEventListener('touchstart', function () {
      touched = true;
      armed = false;
      document.body.classList.remove('cursor-on');
    }, { passive: true });

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!armed && !touched && isFine()) {
        armed = true;
        document.body.classList.add('cursor-on');
        (function loop() {
          if (!armed) return;
          rx = lerp(rx, mx, 0.18);
          ry = lerp(ry, my, 0.18);
          ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
          requestAnimationFrame(loop);
        })();
      }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      var labelled = e.target.closest('[data-cursor]');
      var hoverable = e.target.closest('a, button, .alist__item, input, textarea');
      if (labelled) {
        label.textContent = labelled.dataset.cursor;
        c.classList.add('is-label');
        c.classList.remove('is-hover');
      } else if (hoverable) {
        c.classList.add('is-hover');
        c.classList.remove('is-label');
      } else {
        c.classList.remove('is-label', 'is-hover');
      }
    });

    document.addEventListener('mouseleave', function () { c.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { c.style.opacity = '1'; });
  }

  /* ================================================================
     7. NAV — condense, hide on scroll down, active section
     ================================================================ */
  function nav() {
    var el = $('#nav');
    if (!el) return;
    var last = 0;
    // Only same-page anchors take part in scroll-spy; cross-page links
    // (founders.html#x) are not valid selectors and must be skipped.
    var links = $$('.nav__links a').filter(function (a) {
      return (a.getAttribute('href') || '').charAt(0) === '#';
    });
    var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

    function onScroll() {
      var y = window.scrollY;
      el.classList.toggle('is-stuck', y > 40);
      if (y > 520 && y > last && !document.body.classList.contains('menu-open')) {
        el.classList.add('is-hidden');
      } else {
        el.classList.remove('is-hidden');
      }
      last = y;

      var mid = y + window.innerHeight * 0.35;
      var active = -1;
      sections.forEach(function (s, i) { if (s.offsetTop <= mid) active = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ================================================================
     8. SCROLL PROGRESS
     ================================================================ */
  function progress() {
    var bar = $('.progress__bar');
    if (!bar) return;
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ================================================================
     9. PARALLAX + HERO DRIFT  (single rAF loop)
     ================================================================ */
  function parallax() {
    if (reduced) return;
    var items = $$('[data-parallax]').map(function (el) {
      return { el: el, rate: parseFloat(el.dataset.parallax) || 0.1, cur: 0, tgt: 0 };
    });
    var heroContent = $('.hero__content');
    var heroBase = $('.hero__base');
    var running = false;

    function measure() {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        var centre = r.top + r.height / 2;
        it.tgt = ((centre - vh / 2) / vh) * (r.height * it.rate);
      });
    }

    function frame() {
      var moving = false;
      items.forEach(function (it) {
        it.cur = lerp(it.cur, it.tgt, 0.12);
        if (Math.abs(it.cur - it.tgt) > 0.05) moving = true;
        it.el.style.transform = 'translate3d(0,' + it.cur.toFixed(2) + 'px,0)';
      });
      if (heroContent) {
        var p = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
        heroContent.style.transform = 'translate3d(0,' + (p * -70).toFixed(1) + 'px,0)';
        heroContent.style.opacity = String(1 - p * 0.85);
        if (heroBase) heroBase.style.opacity = String(1 - clamp(p * 1.6, 0, 1));
      }
      if (moving || running) requestAnimationFrame(frame);
    }

    function kick() { measure(); running = true; requestAnimationFrame(frame); }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
  }

  /* ================================================================
     10. COUNTERS
     ================================================================ */
  function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      nums.forEach(function (n) { n.textContent = n.dataset.count; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var end = parseInt(el.dataset.count, 10);
        var plain = el.dataset.plain === '1';
        var start = plain ? Math.max(0, end - 60) : 0;
        var t0 = performance.now();
        var dur = 1500;
        (function step(now) {
          var p = clamp((now - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(start + (end - start) * eased));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ================================================================
     11. TICKER — duplicate content for a seamless loop
     ================================================================ */
  function ticker() {
    var row = $('#tickerRow');
    if (!row) return;
    row.innerHTML = row.innerHTML + row.innerHTML;
  }

  /* ================================================================
     12. MENU OVERLAY
     ================================================================ */
  function menu() {
    var burger = $('#burger');
    var panel = $('#menu');
    if (!burger || !panel) return;

    function set(open) {
      panel.classList.toggle('is-open', open);
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    burger.addEventListener('click', function () { set(!panel.classList.contains('is-open')); });
    $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) set(false);
    });
  }

  /* ================================================================
     13. APPROACH LIST — image preview that follows the cursor
     ================================================================ */
  function approachPreview() {
    if (reduced) return;
    var list = $('#alist');
    var prev = $('#alistPreview');
    if (!list || !prev) return;
    var img = $('img', prev);
    var mx = 0, my = 0, cx = 0, cy = 0, on = false;

    $$('.alist__item', list).forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        if (!isFine()) return;
        var src = item.dataset.img;
        if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
        prev.classList.add('is-on');
        on = true;
      });
    });
    list.addEventListener('mouseleave', function () {
      prev.classList.remove('is-on');
      on = false;
    });
    window.addEventListener('mousemove', function (e) { mx = e.clientX + 170; my = e.clientY; }, { passive: true });

    (function loop() {
      cx = lerp(cx, mx, 0.1);
      cy = lerp(cy, my, 0.1);
      if (on) prev.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%) scale(1)';
      else prev.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%) scale(.9)';
      requestAnimationFrame(loop);
    })();
  }

  /* ================================================================
     14. WORKS FILTER
     ================================================================ */
  function filters() {
    var btns = $$('.filters__btn');
    var cards = $$('#grid .card');
    var cta = $('#gridCta');
    if (!btns.length) return;

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) {
          o.classList.toggle('is-on', o === b);
          o.setAttribute('aria-selected', String(o === b));
        });
        var f = b.dataset.filter;
        cards.forEach(function (c, i) {
          var show = f === 'all' || (c.dataset.cat || '').indexOf(f) > -1;
          if (show) {
            c.classList.remove('is-hidden');
            c.style.transitionDelay = (i * 45) + 'ms';
            c.classList.add('is-in');
          } else {
            c.style.transitionDelay = '0ms';
            c.classList.add('is-hidden');
          }
        });
        // the Instagram tile only squares off the full grid
        if (cta) cta.classList.toggle('is-hidden', f !== 'all');
      });
    });
  }

  /* ================================================================
     15. PROJECT PANEL
     ================================================================ */
  var PROJECTS = {
    p1: {
      kicker: 'Residence · Rajkot',
      title: 'House on Water',
      img: 'assets/img/house-on-water-01.jpg',
      text: 'A house organised around a six-inch-deep pool at its heart. Water does the climatic work — as it evaporates it tempers the surrounding air, so the home sits noticeably cooler than a conventional one. Around it, teak veneer, stone and a chequered marble floor hold a contemporary pause.',
      facts: [['Typology', 'Private Residence'], ['Location', 'Rajkot, Gujarat'], ['Scope', 'Architecture & Interiors'], ['Status', 'Completed']]
    },
    p2: {
      kicker: 'Housing · Collective Living',
      title: 'The VOID',
      img: 'assets/img/the-void.jpg',
      text: 'Housing today swings between repetition and isolation. The VOID reimagines it as a living system where community, privacy and nature coexist — not a stack of units, but a network of relationships. Green courts, shaded spill-outs and verandah-like terraces extend life beyond the walls. Spaces are not leftover; they are intentional.',
      facts: [['Typology', 'Multi-family Housing'], ['Scope', 'Architecture & Urban Design'], ['Team', 'Aakash Khurana, Jill Gajera, Hetvi Patel, Bhavi Mandavia + collective'], ['Status', 'In development']]
    },
    p3: {
      kicker: 'Residence & Court',
      title: 'Aurabella',
      img: 'assets/img/aurabella.jpg',
      text: 'Prayerful and playful. The notion of space is made physically manifest through the elements that constitute the basic identifiable parts of the built environment — a planted pergola, stone underfoot, terracotta edges, and light that moves across all of it through the day.',
      facts: [['Typology', 'Residence & Landscape'], ['Scope', 'Architecture, Court & Planting'], ['Idea', 'Dappled light as a building material'], ['Status', 'Design']]
    },
    p4: {
      kicker: 'Facade Study · Housing',
      title: 'Grit & Canopy',
      img: 'assets/img/feature-work.jpg',
      text: 'A grit-finished facade read from below, through the jacaranda. Deep reveals and ribbed piers give every opening its own shade, so the elevation changes character hour by hour rather than staying a flat picture of itself.',
      facts: [['Typology', 'Housing'], ['Scope', 'Facade & Envelope'], ['Material', 'Grit-finish concrete, ribbed piers'], ['Status', 'Built']]
    },
    p5: {
      kicker: 'Housing · Rajkot',
      title: 'The Terrace Commons',
      img: 'assets/img/terrace-commons.jpg',
      text: 'Usually, terraces in apartment buildings are left to services. We wanted this one to feel alive — a place for evening walks, for children to run, for families to sit and talk after a long day. Sometimes the best space in a home is the one that brings people together.',
      facts: [['Typology', 'Residential Terrace & Commons'], ['Location', 'Rajkot, Gujarat'], ['Scope', 'Roofscape, Landscape, Services'], ['Status', 'In making']]
    },
    p6: {
      kicker: 'Water & Landscape',
      title: 'The Moon Court',
      img: 'assets/img/house-on-water-moon.jpg',
      text: 'The moon of the House on Water is not hanging in the night sky — it quietly rises from a six-inch-deep pool at the centre of the house. A simple spherical fountain becomes the home’s moon, while the shallow water around it works silently to shape a cooler microclimate.',
      facts: [['Typology', 'Water Court'], ['Part of', 'House on Water'], ['Function', 'Evaporative cooling + ritual'], ['Status', 'Completed']]
    },
    p7: {
      kicker: 'Interiors · Delhi',
      title: 'In Making',
      img: 'assets/img/interior-light.jpg',
      text: 'A drawing is a proposal; site is the argument. Cove lighting being set out, stone being dry-laid, services being chased — the part of the work nobody photographs, and the part where most of the decisions actually get made.',
      facts: [['Typology', 'Interior Architecture'], ['Location', 'Delhi'], ['Scope', 'Detailing & Site Supervision'], ['Status', 'On site']]
    }
  };

  function panel() {
    var p = $('#panel');
    if (!p) return;
    var imgEl = $('#panelImg'), titleEl = $('#panelTitle'), textEl = $('#panelText'),
        kickEl = $('#panelKicker'), factsEl = $('#panelFacts');
    var lastFocus = null;

    function open(key) {
      var d = PROJECTS[key];
      if (!d) return;
      lastFocus = document.activeElement;
      imgEl.setAttribute('src', d.img);
      imgEl.setAttribute('alt', d.title);
      titleEl.textContent = d.title;
      textEl.textContent = d.text;
      kickEl.textContent = d.kicker;
      factsEl.innerHTML = '';
      d.facts.forEach(function (f) {
        var row = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = f[0];
        var dd = document.createElement('dd'); dd.textContent = f[1];
        row.appendChild(dt); row.appendChild(dd); factsEl.appendChild(row);
      });
      p.classList.add('is-open');
      p.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      $('.panel__x', p).focus();
    }

    function close() {
      p.classList.remove('is-open');
      p.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    $$('[data-project]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.dataset.project); });
    });
    $$('[data-close]', p).forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && p.classList.contains('is-open')) close();
    });
  }

  /* ================================================================
     16. MAGNETIC BUTTONS
     ================================================================ */
  function magnetic() {
    if (reduced) return;
    $$('.magnetic').forEach(function (el) {
      var cx = 0, cy = 0, tx = 0, ty = 0, raf = null;

      function run() {
        cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
        el.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
        if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) raf = requestAnimationFrame(run);
        else { el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)'; raf = null; }
      }
      function start() { if (!raf) raf = requestAnimationFrame(run); }

      el.addEventListener('mousemove', function (e) {
        if (!isFine()) return;
        var r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        ty = (e.clientY - (r.top + r.height / 2)) * 0.34;
        start();
      });
      el.addEventListener('mouseleave', function () { tx = 0; ty = 0; start(); });
    });
  }

  /* ================================================================
     17. MISC
     ================================================================ */
  function misc() {
    var yr = $('#yr');
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  /* ================================================================
     BOOT
     ================================================================ */
  function boot() {
    wireWhatsApp();
    splitText();
    prepTree();
    ticker();
    misc();
    preloader();
    cursor();
    nav();
    progress();
    parallax();
    reveals();
    counters();
    menu();
    approachPreview();
    filters();
    panel();
    magnetic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
