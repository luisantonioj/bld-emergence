/* ============================================================
   BLD Lipa Youth Ministry — Emergence Digital Invitation
   Animation orchestrator
   ============================================================ */

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  if (typeof CONFIG === 'undefined' || typeof ANCHOR_PHOTOS === 'undefined') {
    console.error('config.js must be loaded before animation.js');
    return;
  }

  // ── All photos: anchor + ambient combined ────────────────────
  const ALL_PHOTOS = [...ANCHOR_PHOTOS, ...AMBIENT_PHOTOS];

  document.documentElement.style.setProperty('--ambient-opacity', CONFIG.ambientOpacity ?? 0.15);

  // ── 5 slot positions (% of container, card center point) ─────
  const SLOT_CONFIGS = [
    { leftPct: 50, topPct: 50, rotMin: -4,  rotMax:  4  },  // center
    { leftPct: 24, topPct: 24, rotMin: -12, rotMax: -5  },  // top-left
    { leftPct: 75, topPct: 20, rotMin:  5,  rotMax: 12  },  // top-right
    { leftPct: 20, topPct: 74, rotMin:  3,  rotMax: 10  },  // bottom-left
    { leftPct: 77, topPct: 71, rotMin: -10, rotMax: -3  },  // bottom-right
  ];

  // ── Preload ──────────────────────────────────────────────────
  function preloadImages(photos) {
    return Promise.all(
      photos.map(p => new Promise(res => {
        const img = new Image();
        img.src = `public/${p.file}`;
        img.onload = img.onerror = res;
      }))
    );
  }

  // ── Ambient background slideshow ─────────────────────────────
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
        pool.splice(0, pool.length, ...shuffle([...AMBIENT_PHOTOS]));
        idx = 0;
      }

      const slide = document.createElement('div');
      slide.className = 'ambient-slide';
      slide.style.backgroundImage = `url('public/${photo.file}')`;
      container.appendChild(slide);

      [1, 2].forEach(offset => {
        const ahead = AMBIENT_PHOTOS[(idx + offset) % AMBIENT_PHOTOS.length];
        if (ahead) { const pi = new Image(); pi.src = `public/${ahead.file}`; }
      });

      requestAnimationFrame(() => requestAnimationFrame(() => slide.classList.add('active')));

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

  // ── Build 5 polaroid slots ───────────────────────────────────
  function buildPolaroids() {
    const area = document.getElementById('polaroid-area');
    SLOT_CONFIGS.forEach((slot, i) => {
      const photo = ALL_PHOTOS[i % ALL_PHOTOS.length];

      const card = document.createElement('div');
      card.className = 'polaroid';
      card.dataset.slotIndex = i;
      card.style.left = `${slot.leftPct}%`;
      card.style.top  = `${slot.topPct}%`;
      card.style.zIndex = i + 1;

      const rot = rand(slot.rotMin, slot.rotMax).toFixed(1);
      card.style.setProperty('--rot', `${rot}deg`);

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

  // ── Build invitation text ────────────────────────────────────
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

  // ── Replace one polaroid slot with a new photo ───────────────
  let zCounter = 10;

  async function replacePolaroid(card, slotCfg, photo) {
    // Exit: fly up and fade
    card.classList.remove('settled');
    card.classList.add('exiting');
    await delay(360);

    // Swap content while off-screen
    card.querySelector('img').src = `public/${photo.file}`;
    card.querySelector('img').alt = photo.alt;
    card.querySelector('.caption').textContent = '';
    card.classList.remove('colorized');

    // New rotation for variety
    const newRot = rand(slotCfg.rotMin, slotCfg.rotMax).toFixed(1);
    card.style.setProperty('--rot', `${newRot}deg`);

    // Snap to "above" position instantly (no transition)
    card.classList.remove('exiting');
    card.classList.add('no-transition');
    void card.offsetWidth;
    card.classList.remove('no-transition');

    // Bring this card to front
    card.style.zIndex = ++zCounter;

    // Drop in
    void card.offsetWidth;
    card.classList.add('settled');

    // Quick colorize after landing
    await delay(420);
    card.classList.add('colorized');
  }

  // ── Continuous cycling through ALL photos ────────────────────
  function startCycling(cards) {
    // Build a shuffled queue of photos starting from photo index 5
    // so the first cycle shows photos not yet displayed
    const queue = shuffle([...ALL_PHOTOS.slice(5), ...ALL_PHOTOS.slice(0, 5)]);
    let queueIdx = 0;
    let slotIdx  = 0;

    function step() {
      if (queueIdx >= queue.length) {
        // Reshuffle for the next loop
        queue.splice(0, queue.length, ...shuffle([...ALL_PHOTOS]));
        queueIdx = 0;
      }

      const photo = queue[queueIdx++];
      const card  = cards[slotIdx];
      slotIdx = (slotIdx + 1) % 5;

      replacePolaroid(card, SLOT_CONFIGS[card.dataset.slotIndex], photo);
      setTimeout(step, 1800);
    }

    setTimeout(step, 1800);
  }

  // ── Reduced-motion: instant reveal ──────────────────────────
  function instantReveal() {
    const cards = document.querySelectorAll('.polaroid');
    cards.forEach(card => card.classList.add('settled', 'colorized'));

    const inv = document.getElementById('invitation');
    inv.classList.add('visible');
    inv.querySelectorAll('.invite-line').forEach(el => el.classList.add('revealed'));

    document.getElementById('logo-wrap').classList.add('visible');
    startAmbientSlideshow();
  }

  // ── Main animation sequence ──────────────────────────────────
  async function runSequence() {
    const cards = Array.from(document.querySelectorAll('.polaroid'));

    // Stage 0 — blank (1.5s)
    await delay(1500);

    // Stage 1-2 — cascade 5 polaroids into their slots
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.classList.add('settled');

      await delay(750);
      card.classList.add('colorized');
      await delay(350);
      if (i === 0) card.classList.add('captioned');
      await delay(i === 0 ? 700 : 450);
    }

    // Stage 3 — brief hold
    await delay(1500);

    // Start ambient slideshow
    startAmbientSlideshow();

    // Start cycling all photos through the 5 slots
    startCycling(cards);

    // Stage 5 — reveal invitation after a couple of replacements
    await delay(3200);

    const inv = document.getElementById('invitation');
    inv.classList.add('visible');

    for (const line of inv.querySelectorAll('.invite-line')) {
      line.classList.add('revealed');
      await delay(900);
    }

    const logo = document.getElementById('logo-wrap');
    logo.classList.add('visible');

    // Resting: pulse CTA
    await delay(600);
    inv.querySelector('.cta')?.classList.add('resting');
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    buildPolaroids();
    buildInvitation();

    if (reducedMotion) {
      instantReveal();
      return;
    }

    await preloadImages(ANCHOR_PHOTOS);
    runSequence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Service Worker ────────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }
})();
