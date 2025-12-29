/* ==========================================================================
   JS - Interacciones
   - Slider HERO (estructura similar a tu ejemplo)
   - Proyectos (panel)
   - Reveal on scroll
   - Menú móvil
   - Form demo (sin backend)
   ========================================================================== */

(function(){
  const $ = (sel, parent=document) => parent.querySelector(sel);
  const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

  // ------------------------------
  // Theme (Light/Dark) — 1 clic
  // - Guarda preferencia en localStorage
  // - Respeta prefers-color-scheme si no hay preferencia
  // ------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function getInitialTheme(){
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(t){
    root.setAttribute('data-theme', t);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      const themeText = themeToggle.querySelector('.theme-text');
      if (themeText) themeText.textContent = (t === 'dark' ? 'Dark' : 'Light');
    }
  }

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }


  // Año actual en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ------------------------------
  // Menú móvil
  // ------------------------------
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cierra el menú al hacer click en un link
    $$('#siteNav a').forEach(a => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------
  // Reveal on scroll (animación suave)
  // ------------------------------
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ------------------------------
  // HERO Slider (como tu ejemplo: #heroSlides + prev/next + dots)
  // ------------------------------
  const slidesWrap = document.getElementById('heroSlides');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const dotsWrap = document.getElementById('heroDots');

  if (slidesWrap && dotsWrap) {
    const slides = $$('.slide', slidesWrap);
    let idx = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));

    // Construye dots en base a cantidad de slides
    dotsWrap.innerHTML = slides.map((_, i) =>
      `<button type="button" class="dot ${i===idx?'is-active':''}" role="tab" aria-label="Ir a la diapositiva ${i+1}" aria-selected="${i===idx?'true':'false'}" data-dot="${i}"></button>`
    ).join('');

    const dots = $$('.dot', dotsWrap);

    function setActive(next){
      idx = (next + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => {
        const on = i === idx;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    // Autoplay (puedes desactivarlo si quieres)
    const AUTOPLAY_MS = 6500;
    let timer = null;
    const start = () => {
      stop();
      timer = window.setInterval(() => setActive(idx + 1), AUTOPLAY_MS);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { setActive(idx - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { setActive(idx + 1); start(); });

    dots.forEach(d => d.addEventListener('click', () => {
      const n = Number(d.getAttribute('data-dot') || '0');
      setActive(n);
      start();
    }));

    // Pausar autoplay al hover para mejor UX
    const sliderRoot = slidesWrap.closest('.hero-slider');
    if (sliderRoot) {
      sliderRoot.addEventListener('mouseenter', stop);
      sliderRoot.addEventListener('mouseleave', start);
    }

    setActive(idx);
    start();
  }

  // ------------------------------
  // Proyectos (selector + navegación)
  // ------------------------------
  const projectList = document.getElementById('projectList');
  const projectPanels = Array.from(document.querySelectorAll('[data-project-panel]'));
  const projPrev = document.getElementById('projPrev');
  const projNext = document.getElementById('projNext');
  const projCount = document.getElementById('projCount');

  let pIdx = 0;

  function setProject(next){
    pIdx = (next + projectPanels.length) % projectPanels.length;
    projectPanels.forEach((p, i) => p.classList.toggle('is-active', i === pIdx));

    const items = projectList ? Array.from(projectList.querySelectorAll('[data-project]')) : [];
    items.forEach((it, i) => it.classList.toggle('is-active', i === pIdx));

    if (projCount) projCount.textContent = `${pIdx + 1} / ${projectPanels.length}`;
  }

  if (projectList) {
    Array.from(projectList.querySelectorAll('[data-project]')).forEach(btn => {
      btn.addEventListener('click', () => {
        const n = Number(btn.getAttribute('data-project') || '0');
        setProject(n);
      });
    });
  }

  if (projPrev) projPrev.addEventListener('click', () => setProject(pIdx - 1));
  if (projNext) projNext.addEventListener('click', () => setProject(pIdx + 1));
  setProject(0);

  // ------------------------------
  // Form demo (sin backend)
  // ------------------------------
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get('name') || '');
      const subject = String(fd.get('subject') || '');
      alert(`Gracias, ${name || '¡'}\nTu mensaje (“${subject || 'sin asunto'}”) fue registrado como demo.\nIntegra un backend para envío real.`);
      form.reset();
    });
  }
})();
