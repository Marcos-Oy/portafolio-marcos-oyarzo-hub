/* Estudio Web — main.js
   - Theme toggle (Light/Dark)
   - Mobile nav
   - Hero slider (autoplay + dots + swipe)
   - Projects switcher
   - Templates filter + modal
   - Reveal on scroll
*/

const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));
const $ = (sel, parent=document) => parent.querySelector(sel);

// ------------------------------
// Theme (Light/Dark) — 1 clic
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
  if (themeToggle){
    themeToggle.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    const themeText = themeToggle.querySelector('.theme-text');
    if (themeText) themeText.textContent = (t === 'dark' ? 'Dark' : 'Light');
  }
}
applyTheme(getInitialTheme());
if (themeToggle){
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

// ------------------------------
// Mobile nav
// ------------------------------
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

function closeNav(){
  siteNav?.classList.remove('is-open');
  navToggle?.setAttribute('aria-label', 'Abrir menú');
}
if (navToggle && siteNav){
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-label', siteNav.classList.contains('is-open') ? 'Cerrar menú' : 'Abrir menú');
  });

  $$('#siteNav a').forEach(a => a.addEventListener('click', () => closeNav()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
  document.addEventListener('click', (e) => {
    if (!siteNav.classList.contains('is-open')) return;
    const within = siteNav.contains(e.target) || navToggle.contains(e.target);
    if (!within) closeNav();
  });
}

// ------------------------------
// Hero slider (custom)
// ------------------------------
const heroSlidesEl = document.getElementById('heroSlides');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
const heroDots = document.getElementById('heroDots');

const AUTOPLAY_MS = 6500;
let heroIndex = 0;
let heroTimer = null;

function getSlides(){
  return heroSlidesEl ? $$('.slide', heroSlidesEl) : [];
}
function setHero(i){
  const slides = getSlides();
  if (!slides.length) return;
  heroIndex = (i + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === heroIndex));

  // dots
  if (heroDots){
    const dots = $$('.dot', heroDots);
    dots.forEach((d, idx) => {
      const active = idx === heroIndex;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
      d.tabIndex = active ? 0 : -1;
    });
  }
}
function buildDots(){
  const slides = getSlides();
  if (!heroDots || !slides.length) return;
  heroDots.innerHTML = '';
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot' + (idx === 0 ? ' is-active' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Ir a la diapositiva ' + (idx + 1));
    b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    b.tabIndex = idx === 0 ? 0 : -1;
    b.addEventListener('click', () => { stopHeroAutoplay(); setHero(idx); startHeroAutoplay(); });
    heroDots.appendChild(b);
  });
}
function startHeroAutoplay(){
  stopHeroAutoplay();
  const slides = getSlides();
  if (slides.length <= 1) return;
  heroTimer = setInterval(() => setHero(heroIndex + 1), AUTOPLAY_MS);
}
function stopHeroAutoplay(){
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = null;
}
if (heroSlidesEl){
  buildDots();
  setHero(0);
  startHeroAutoplay();
  heroPrev?.addEventListener('click', () => { stopHeroAutoplay(); setHero(heroIndex - 1); startHeroAutoplay(); });
  heroNext?.addEventListener('click', () => { stopHeroAutoplay(); setHero(heroIndex + 1); startHeroAutoplay(); });

  // Pause on hover
  heroSlidesEl.addEventListener('mouseenter', stopHeroAutoplay);
  heroSlidesEl.addEventListener('mouseleave', startHeroAutoplay);

  // Swipe support
  let x0 = null;
  heroSlidesEl.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, {passive:true});
  heroSlidesEl.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    stopHeroAutoplay();
    setHero(dx > 0 ? heroIndex - 1 : heroIndex + 1);
    startHeroAutoplay();
  }, {passive:true});
}

// ------------------------------
// Projects switcher
// ------------------------------
const projectBtns = $$('.mini-item[data-project]');
const projects = $$('.project');

function activateProject(id){
  projects.forEach(p => p.classList.toggle('is-active', p.id === id));
  projectBtns.forEach(b => b.classList.toggle('is-active', b.dataset.project === id));
}
projectBtns.forEach(b => b.addEventListener('click', () => activateProject(b.dataset.project)));

const prevs = $$('[data-project-prev]');
const nexts = $$('[data-project-next]');
function projectOrder(){
  return projects.map(p => p.id);
}
function currentProjectIndex(){
  const order = projectOrder();
  const active = projects.find(p => p.classList.contains('is-active'))?.id || order[0];
  return order.indexOf(active);
}
function goProject(delta){
  const order = projectOrder();
  const idx = currentProjectIndex();
  const next = (idx + delta + order.length) % order.length;
  activateProject(order[next]);
}
prevs.forEach(b => b.addEventListener('click', () => goProject(-1)));
nexts.forEach(b => b.addEventListener('click', () => goProject(1)));

// ------------------------------
// Template filters + jump from Services
// ------------------------------
const filterButtons = $$('.chip[data-filter]');
const templateCards = $$('.template-card');
const templatesGrid = document.getElementById('templatesGrid');

function setFilter(filter){
  filterButtons.forEach(btn => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  templateCards.forEach(card => {
    const cat = card.dataset.category;
    const show = (filter === 'all') || (cat === filter);
    card.style.display = show ? '' : 'none';
  });
}

filterButtons.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

// Jump links from services
$$('[data-filter-jump]').forEach(a => {
  a.addEventListener('click', () => {
    const f = a.dataset.filterJump;
    // set after scroll to templates
    setTimeout(() => setFilter(f), 50);
  });
});

// ------------------------------
// Template pick -> prefill form
// ------------------------------
const templateInput = document.getElementById('templateInput');
$$('[data-template-pick]').forEach(a => {
  a.addEventListener('click', () => {
    const pick = a.dataset.templatePick;
    if (templateInput) templateInput.value = pick;
  });
});

// ------------------------------
// Template modal (Ver demo)
// ------------------------------
const modal = document.getElementById('templateModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalKicker = document.getElementById('modalKicker');
const modalList = document.getElementById('modalList');
const modalPick = document.getElementById('modalPick');

const templateMeta = {
  "Aura": {
    cat: "Profesional",
    img: "img/template-1.svg",
    desc: "Portafolio elegante con agenda y CTA fuerte. Ideal para servicios profesionales.",
    items: ["Hero + propuesta de valor", "Servicios + FAQ", "Testimonios + CTA", "Contacto directo"]
  },
  "Nova": {
    cat: "Profesional",
    img: "img/template-2.svg",
    desc: "Minimalista y rápida, enfocada en conversión y claridad.",
    items: ["Secciones compactas", "Resumen de servicios", "CTA persistente", "Formulario y WhatsApp"]
  },
  "Mercado": {
    cat: "PyME",
    img: "img/template-3.svg",
    desc: "Corporativo con catálogo/galería y ubicación. Pensado para negocios locales.",
    items: ["Servicios por categoría", "Galería/catálogo", "Maps + horarios", "WhatsApp con mensaje"]
  },
  "Taller": {
    cat: "PyME",
    img: "img/template-4.svg",
    desc: "Servicios + galería + cotización rápida para aumentar leads.",
    items: ["Bloques de servicios", "Galería de trabajos", "Formulario de cotización", "CTA directo"]
  },
  "Corporate": {
    cat: "Empresa",
    img: "img/template-5.svg",
    desc: "Diseño institucional con módulos, consistencia y escalabilidad.",
    items: ["Componentes reutilizables", "Accesibilidad", "Performance", "Secciones corporativas"]
  },
  "Launch": {
    cat: "Empresa",
    img: "img/template-6.svg",
    desc: "Landing para campañas: beneficios, casos y CTA fuerte.",
    items: ["Beneficios y features", "Casos y prueba social", "CTA múltiple", "Formulario orientado a ventas"]
  }
};

function openModal(name){
  if (!modal) return;
  const meta = templateMeta[name] || { cat: "Plantilla", img: "img/template-1.svg", desc: "", items: [] };
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (modalImg) modalImg.src = meta.img;
  if (modalTitle) modalTitle.textContent = name;
  if (modalKicker) modalKicker.textContent = "Plantilla • " + meta.cat;
  if (modalDesc) modalDesc.textContent = meta.desc;
  if (modalList){
    modalList.innerHTML = '';
    meta.items.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      modalList.appendChild(li);
    });
  }
  if (modalPick){
    modalPick.addEventListener('click', () => {
      if (templateInput) templateInput.value = name;
    }, {once:true});
  }
}
function closeModal(){
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$$('[data-template]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.template)));

$$('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ------------------------------
// Contact form (demo)
// ------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    // Demo: abre mailto con campos
    const subj = encodeURIComponent('Cotización sitio web (' + (fd.get('segment') || '') + ')');
    const body = encodeURIComponent(
      'Nombre: ' + (fd.get('name')||'') + '\n' +
      'Email: ' + (fd.get('email')||'') + '\n' +
      'Segmento: ' + (fd.get('segment')||'') + '\n' +
      'Plantilla: ' + (fd.get('template')||'') + '\n\n' +
      'Mensaje:\n' + (fd.get('message')||'')
    );
    window.location.href = 'mailto:hola@tusitio.cl?subject=' + subj + '&body=' + body;
  });
}

// ------------------------------
// Year
// ------------------------------
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// ------------------------------
// Reveal on scroll
// ------------------------------
const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting){
      ent.target.classList.add('is-in');
      io.unobserve(ent.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => io.observe(el));
