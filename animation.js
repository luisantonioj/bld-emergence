/* ============================================================
   BLD Lipa Youth Ministry — Emergence Digital Invitation
   Animation orchestrator
   ============================================================ */

(() => {
  // ── Reduced-motion shortcut ──────────────────────────────────
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Helpers ──────────────────────────────────────────────────
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const rand  = (min, max) => Math.random() * (max - min) + min;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Config guard ─────────────────────────────────────────────
  if (typeof CONFIG === 'undefined' || typeof ANCHOR_PHOTOS === 'undefined') {
    console.error('config.js must be loaded before animation.js');
    return;
  }

  const ambientOpacity = CONFIG.ambientOpacity ?? 0.15;
  document.documentElement.style.setProperty('--ambient-opacity', ambientOpacity);

  // ── Preload anchor photos before the sequence starts ─────────
  function preloadImages(photos) {
    return Promise.all(
      photos.map(p => new Promise(res => {
        const img = new Image();
        img.src = `public/${p.file}`;
        img.onload = img.onerror = res;
      }))
    );
  }

  // ── Ambient slideshow ─────────────────────────────────────────
  let ambientStarted = false;

  function startAmbientSlideshow() {
    if (ambientStarted || AMBIENT_PHOTOS.length === 0) return;
    ambientStarted = true;

    const container = document.getElementById('ambient-bg');
    const pool = shuffle([...AMBIENT_PHOTOS]);
    let idx = 0;
    let current = null;

    function nextSlide() {
      const photo = pool[idx % pool.length];
      idx++;
      if (idx >= pool.length) {
        // reshuffle after full cycle
        pool.splice(0, pool.length, ...shuffle([...AMBIENT_PHOTOS]));
        idx = 0;
      }

      const slide = document.createElement('div');
      slide.className = 'ambient-slide';
      slide.style.backgroundImage = `url('public/${photo.file}')`;
      container.appendChild(slide);

      // Lazy-load: only fetch next 2 ahead
      [1, 2].forEach(offset => {
        const ahead = AMBIENT_PHOTOS[(idx + offset) % AMBIENT_PHOTOS.length];
        if (ahead) {
          const preImg = new Image();
          preImg.src = `public/${ahead.file}`;
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slide.classList.add('active');
        });
      });

      if (current) {
        const old = current;
        setTimeout(() => {
          old.classList.remove('active');
          old.classList.add('leaving');
          setTimeout(() => old.remove(), 1600);
        }, 7000);
      }

      current = slide;
      setTimeout(nextSlide, 7000);
    }

    nextSlide();
  }

  // ── Build DOM ─────────────────────────────────────────────────
  function buildPolaroids() {
    const area = document.getElementById('polaroid-area');
    ANCHOR_PHOTOS.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'polaroid';
      card.dataset.index = i;

      const img = document.createElement('img');
      img.src = `public/${photo.file}`;
      img.alt = photo.alt;
      card.appendChild(img);

      const cap = document.createElement('div');
      cap.className = 'caption';
      cap.textContent = CONFIG.polaroidCaptions[i] ?? '';
      card.appendChild(cap);

      area.appendChild(card);
    });
  }

  function buildInvitation() {
    const wrap = document.getElementById('invitation');

    const greeting = document.createElement('p');
    greeting.className = 'invite-line greeting';
    greeting.textContent = CONFIG.greetingLine;
    wrap.appendChild(greeting);

    CONFIG.invitationBody.forEach(line => {
      const p = document.createElement('p');
      p.className = 'invite-line body-line';
      p.textContent = line;
      wrap.appendChild(p);
    });

    const details = document.createElement('div');
    details.className = 'invite-line event-details';
    details.innerHTML = `
      <p><strong>Event:</strong> ${CONFIG.eventName}</p>
      <p><strong>Date:</strong>  ${CONFIG.eventDate}</p>
      <p><strong>Time:</strong>  ${CONFIG.eventTime}</p>
      <p><strong>Venue:</strong> ${CONFIG.eventVenue}</p>
    `;
    wrap.appendChild(details);

    const cta = document.createElement('p');
    cta.className = 'invite-line cta';
    cta.textContent = CONFIG.closingCTA;
    wrap.appendChild(cta);
  }

  function buildGrid() {
    const grid = document.getElementById('photo-grid');
    ANCHOR_PHOTOS.forEach((photo, i) => {
      const item = document.createElement('div');
      item.className = 'grid-item';

      const img = document.createElement('img');
      img.src = `public/${photo.file}`;
      img.alt = photo.alt;
      item.appendChild(img);

      if (CONFIG.polaroidCaptions[i]) {
        const cap = document.createElement('div');
        cap.className = 'caption';
        cap.textContent = CONFIG.polaroidCaptions[i];
        item.appendChild(cap);
      }

      grid.appendChild(item);
    });
  }

  // ── Reduced-motion: instant full display ─────────────────────
  function instantReveal() {
    document.getElementById('polaroid-area').style.display = 'none';

    const grid = document.getElementById('photo-grid');
    grid.classList.add('visible');
    grid.querySelectorAll('.grid-item').forEach(el => {
      el.classList.add('visible', 'resting');
    });

    const inv = document.getElementById('invitation');
    inv.classList.add('visible');
    inv.querySelectorAll('.invite-line').forEach(el => el.classList.add('revealed'));

    const logo = document.getElementById('logo-wrap');
    logo.classList.add('visible');

    startAmbientSlideshow();
  }

  // ── Full animation sequence ───────────────────────────────────
  async function runSequence() {
    const cards = Array.from(document.querySelectorAll('.polaroid'));

    // Stage 0 — blank opening (1.5 s)
    await delay(1500);

    // Stage 1 — first polaroid drop
    const first = cards[0];
    const rot0 = rand(-3, 3).toFixed(1);
    first.style.setProperty('--rot', `${rot0}deg`);
    first.classList.add('dropped');

    await delay(800);
    first.classList.add('colorized');
    await delay(600);
    first.classList.add('captioned');
    await delay(700);

    // Stage 2 — cascade (cards 1–4)
    for (let i = 1; i < cards.length; i++) {
      const card = cards[i];
      const rot = rand(-6, 6).toFixed(1);
      card.style.setProperty('--rot', `${rot}deg`);
      card.classList.add('dropped');

      await delay(rand(600, 900));
      card.classList.add('colorized');
      await delay(400);
      card.classList.add('captioned');
      await delay(rand(200, 400));
    }

    // Stage 3 — hold (1.5 s)
    await delay(1500);

    // Stage 4 — transition to grid
    // Hide polaroid area, show grid
    const polaroidArea = document.getElementById('polaroid-area');
    polaroidArea.style.transition = 'opacity 0.8s ease';
    polaroidArea.style.opacity = '0';

    const grid = document.getElementById('photo-grid');
    grid.classList.add('visible');

    await delay(800);
    polaroidArea.style.display = 'none';

    // Stagger grid items in
    const items = grid.querySelectorAll('.grid-item');
    for (const item of items) {
      item.classList.add('visible');
      await delay(120);
    }

    await delay(400);

    // Stage 5 — ambient + message reveal
    startAmbientSlideshow();

    const inv = document.getElementById('invitation');
    inv.classList.add('visible');

    const lines = inv.querySelectorAll('.invite-line');
    for (const line of lines) {
      line.classList.add('revealed');
      await delay(400);
    }

    await delay(300);

    const logo = document.getElementById('logo-wrap');
    logo.classList.add('visible');

    // Stage 6 — resting state
    await delay(600);
    items.forEach(el => el.classList.add('resting'));
    inv.querySelector('.cta')?.classList.add('resting');
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    buildPolaroids();
    buildInvitation();
    buildGrid();

    if (reducedMotion) {
      instantReveal();
      return;
    }

    // Preload anchor photos before starting
    await preloadImages(ANCHOR_PHOTOS);
    runSequence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Service Worker registration ───────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }
})();
