/* ==========================================================================
   CyberCívica — main.js
   - Theme toggle (localStorage + prefers-color-scheme)
   - Mobile nav
   - Hero slider (autoplay + dots)
   - Templates filter + modal
   - Projects stage (mini list)
   - Reveal on scroll
   ========================================================================== */

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
  if (themeToggle) {
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

if (navToggle && siteNav){
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close on link click
  $$('#siteNav a').forEach(a => a.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 680px)').matches){
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));

  // close on outside click
  document.addEventListener('click', (e) => {
    const isMobile = window.matchMedia('(max-width: 680px)').matches;
    if (!isMobile) return;
    if (!siteNav.classList.contains('is-open')) return;
    const within = siteNav.contains(e.target) || navToggle.contains(e.target);
    if (!within){
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ------------------------------
// Hero Slider
// ------------------------------
const AUTOPLAY_MS = 6500;
const slidesWrap = document.getElementById('heroSlides');
const prevBtn = document.getElementById('heroPrev');
const nextBtn = document.getElementById('heroNext');
const dotsWrap = document.getElementById('heroDots');

let slideIndex = 0;
let timer = null;

function getSlides(){
  return slidesWrap ? $$('.slide', slidesWrap) : [];
}
function setActiveSlide(i){
  const slides = getSlides();
  if (!slides.length) return;
  slideIndex = (i + slides.length) % slides.length;

  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === slideIndex));

  if (dotsWrap){
    $$('.dot', dotsWrap).forEach((d, idx) => {
      const active = idx === slideIndex;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
      d.tabIndex = active ? 0 : -1;
    });
  }
}
function buildDots(){
  if (!dotsWrap) return;
  const slides = getSlides();
  dotsWrap.innerHTML = '';
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot' + (idx === 0 ? ' is-active' : '');
    b.setAttribute('role','tab');
    b.setAttribute('aria-label', `Ir a la diapositiva ${idx+1}`);
    b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    b.tabIndex = idx === 0 ? 0 : -1;
    b.addEventListener('click', () => { stopAutoplay(); setActiveSlide(idx); startAutoplay(); });
    dotsWrap.appendChild(b);
  });
}
function startAutoplay(){
  stopAutoplay();
  const slides = getSlides();
  if (slides.length <= 1) return;
  timer = setInterval(() => setActiveSlide(slideIndex + 1), AUTOPLAY_MS);
}
function stopAutoplay(){
  if (timer) clearInterval(timer);
  timer = null;
}

if (slidesWrap){
  buildDots();
  setActiveSlide(0);
  startAutoplay();

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); setActiveSlide(slideIndex - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); setActiveSlide(slideIndex + 1); startAutoplay(); });

  slidesWrap.addEventListener('mouseenter', stopAutoplay);
  slidesWrap.addEventListener('mouseleave', startAutoplay);
}

// ------------------------------
// Templates filter + modal
// ------------------------------
const templateMeta = [
  {
    id: 't1',
    category: 'personas',
    title: 'Protege tus cuentas en 60 minutos',
    subtitle: 'Contraseñas, 2FA y señales de alerta',
    tags: ['Personas', 'Práctico', 'Checklist'],
    duration: '60–90 min',
    format: 'Charla + actividad guiada',
    activities: [
      'Actividad “Detecta el phishing” con ejemplos controlados (sin enlaces reales).',
      'Checklist de seguridad de celular y correo (Android/iOS).',
      'Ejercicio de contraseñas seguras y gestor de claves.'
    ],
    outcomes: [
      'Identificar mensajes sospechosos (phishing, smishing).',
      'Configurar medidas básicas: 2FA, recuperación, bloqueo de SIM.',
      'Reducir riesgos en redes sociales y mensajería.'
    ]
  },
  {
    id: 't2',
    category: 'mayores',
    title: 'Estafas digitales: cómo reconocerlas',
    subtitle: 'Llamadas, mensajes y suplantaciones',
    tags: ['Adultos mayores', 'Lenguaje simple', 'Prevención'],
    duration: '60 min',
    format: 'Seminario con ejemplos',
    activities: [
      'Simulación de “urgencias” comunes (premios, deudas, familiares) y cómo responder.',
      'Guía de verificación en 3 pasos: pausa, confirma, reporta.',
      'Buenas prácticas para WhatsApp y llamadas.'
    ],
    outcomes: [
      'Detectar engaños por presión y urgencia.',
      'Saber qué datos nunca compartir.',
      'Conocer canales de ayuda y denuncia.'
    ]
  },
  {
    id: 't3',
    category: 'infantil',
    title: 'Protección infantil y controles parentales',
    subtitle: 'Roblox, redes sociales y contenidos',
    tags: ['Protección infantil', 'Controles parentales', 'Familias'],
    duration: '90 min',
    format: 'Taller con guía paso a paso (seguro)',
    activities: [
      'Configuración recomendada de controles parentales y privacidad (demostración en vivo).',
      'Conversación segura: reglas familiares y señales de grooming (sin detalles operativos).',
      'Buenas prácticas para fotos, geolocalización y permisos.'
    ],
    outcomes: [
      'Reducir exposición a riesgos en apps/juegos.',
      'Establecer acuerdos familiares y monitoreo responsable.',
      'Saber cuándo y cómo pedir ayuda.'
    ]
  },
  {
    id: 't4',
    category: 'pymes',
    title: 'Ciberseguridad para funcionarios',
    subtitle: 'Cultura, políticas y riesgos cotidianos',
    tags: ['PyMEs', 'Empresas', 'Políticas'],
    duration: '90–120 min',
    format: 'Capacitación + evaluación',
    activities: [
      'Diagnóstico rápido: hábitos y puntos críticos del equipo.',
      'Taller de incidentes: qué hacer ante malware o suplantación.',
      'Plantilla de política simple: contraseñas, dispositivos, correo.'
    ],
    outcomes: [
      'Reducir errores humanos (ingeniería social).',
      'Aplicar medidas de base sin fricción.',
      'Mejorar respuesta ante incidentes.'
    ]
  },
  {
    id: 't5',
    category: 'pymes',
    title: 'Transformación digital con seguridad',
    subtitle: 'Entender tecnologías actuales e IA',
    tags: ['IA', 'Transformación digital', 'Riesgos'],
    duration: '90 min',
    format: 'Charla ejecutiva + caso',
    activities: [
      'Mapa de riesgos: IA generativa, deepfakes, fuga de datos.',
      'Buenas prácticas: clasificación de información y controles.',
      'Guía de uso responsable de herramientas digitales.'
    ],
    outcomes: [
      'Tomar decisiones informadas sobre adopción de tecnología.',
      'Reducir exposición a fraude y suplantación.',
      'Definir controles mínimos viables.'
    ]
  },
  {
    id: 't6',
    category: 'personas',
    title: 'Seguridad del celular y banca',
    subtitle: 'SIM, clonación, malware y estafas',
    tags: ['Celular', 'Banca', 'Prevención'],
    duration: '75 min',
    format: 'Taller práctico',
    activities: [
      'Señales de alerta: pérdida de señal inesperada, cambios de contraseña no solicitados, SMS raros.',
      'Revisión de permisos de apps y “higiene” del dispositivo.',
      'Plan de acción: a quién llamar y qué bloquear.'
    ],
    outcomes: [
      'Reconocer señales tempranas de fraude en dispositivos.',
      'Saber qué hacer ante incidentes (sin improvisar).',
      'Mejorar seguridad de banca y redes.'
    ]
  },

  {
    id: 't7',
    category: 'personas',
    title: 'Ciberseguridad doméstica: hogar inteligente seguro',
    subtitle: 'Domótica, cámaras y control de accesos con privacidad',
    tags: ['Personas', 'Hogar', 'Domótica'],
    duration: '90–120 min',
    format: 'Asesoría + plan por etapas',
    activities: [
      'Mapa de riesgos del hogar (entrada, Wi‑Fi, dispositivos IoT, cuentas).',
      'Diseño de simulación de presencia: luces/escenas, horarios, “rutinas” y buenas prácticas.',
      'Checklist de cámaras/alarma/sensores: configuración segura y privacidad (local vs nube).',
      'Recomendaciones de control de accesos: biometría, llaves digitales, perfiles y permisos.',
      'Plan mensual: priorización y presupuesto para comprar e implementar por fases.'
    ],
    outcomes: [
      'Definir una estrategia de protección del hogar sin depender de servicios monitoreados de terceros.',
      'Aumentar disuasión y detección temprana con domótica y sensores configurados de forma segura.',
      'Mejorar la seguridad de la red del hogar y separar IoT del resto de dispositivos.',
      'Contar con una hoja de ruta (costos + prioridades) para implementar paso a paso.'
    ]
  }
];

const filters = $$('.filter-btn');
const templateGrid = document.getElementById('templateGrid');

function renderTemplates(category){
  if (!templateGrid) return;
  const items = templateMeta.filter(t => category === 'all' ? true : t.category === category);
  templateGrid.innerHTML = items.map(t => `
    <article class="card template-card" data-cat="${t.category}">
      <div class="card-body">
        <p class="kicker">${t.category === 'pymes' ? 'Empresas & PyMEs' : t.category === 'infantil' ? 'Protección Infantil' : t.category === 'mayores' ? 'Adultos Mayores' : 'Personas'}</p>
        <h3>${t.title}</h3>
        <p class="muted">${t.subtitle}</p>
        <div class="template-meta">
          ${t.tags.map(x => `<span class="tag">${x}</span>`).join('')}
          <span class="tag">${t.duration}</span>
        </div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn--solid" data-template="${t.id}">Ver contenido</button>
          <a class="btn btn--ghost" href="#contact">Solicitar</a>
        </div>
      </div>
    </article>
  `).join('');
}

function setActiveFilter(btn){
  filters.forEach(b => b.classList.toggle('is-active', b === btn));
}
if (filters.length){
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn);
      renderTemplates(btn.dataset.filter);
    });
  });
  // default
  setActiveFilter(filters[0]);
  renderTemplates(filters[0].dataset.filter);
}

// Modal
const modal = document.getElementById('templateModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(t){
  if (!modal) return;
  modalTitle.textContent = t.title;
  modalBody.innerHTML = `
    <p class="muted"><strong>Formato:</strong> ${t.format} · <strong>Duración:</strong> ${t.duration}</p>
    <hr class="sep" />
    <h4>Actividades</h4>
    <ul class="bullets">
      ${t.activities.map(a => `<li>${a}</li>`).join('')}
    </ul>
    <h4 style="margin-top:14px;">Resultados esperados</h4>
    <ul class="bullets">
      ${t.outcomes.map(o => `<li>${o}</li>`).join('')}
    </ul>
    <p style="margin-top:14px;" class="muted">Nota: el contenido se orienta a <strong>prevención</strong> y buenas prácticas. No se entrega instrucción operativa para cometer delitos.</p>
    <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
      <a class="btn btn--solid" href="#contact">Agendar</a>
      <button class="btn btn--ghost" type="button" id="copyTemplate">Enviar por WhatsApp</button>
    </div>
  `;
  modal.classList.add('is-open');

  // WhatsApp helper (no number hardcoded here; user can change in HTML)
  const copyBtn = document.getElementById('copyTemplate');
  if (copyBtn){
    copyBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(`Hola, me interesa el taller: "${t.title}". ¿Podemos agendar?`);
      const wa = document.querySelector('[data-wa-link]');
      const url = wa ? wa.getAttribute('href') : null;
      if (url && url.includes('wa.me')){
        window.open(url + `?text=${msg}`, '_blank');
      } else {
        navigator.clipboard?.writeText(`Hola, me interesa el taller: "${t.title}". ¿Podemos agendar?`);
        copyBtn.textContent = 'Copiado';
        setTimeout(() => (copyBtn.textContent = 'Enviar por WhatsApp'), 1200);
      }
    }, { once: true });
  }
}
function closeModal(){
  modal?.classList.remove('is-open');
}
if (templateGrid){
  templateGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-template]');
    if (!btn) return;
    const t = templateMeta.find(x => x.id === btn.dataset.template);
    if (t) openModal(t);
  });
}
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ------------------------------
// Projects stage
// ------------------------------
const projectItems = $$('.mini-item[data-project]');
const projectTitle = document.getElementById('projectTitle');
const projectDesc = document.getElementById('projectDesc');
const projectList = document.getElementById('projectList');
const projectChecklist = document.getElementById('projectChecklist');
const projectCount = document.getElementById('projectCount');
const projPrev = document.getElementById('projPrev');
const projNext = document.getElementById('projNext');

const projectData = [
  {
    title: 'Campaña anti-phishing para comunidad',
    desc: 'Materiales breves, ejemplos controlados y guía de verificación “pausa–confirma–reporta”.',
    checklist: [
      'Plantilla de afiche y mensaje interno',
      'Señales típicas: urgencia, premios, enlaces extraños',
      'Canales de reporte y respuesta'
    ]
  },
  {
    title: 'Taller de protección infantil',
    desc: 'Controles parentales, privacidad y conversación familiar. Enfoque preventivo y acompañamiento.',
    checklist: [
      'Configuración recomendada por edad',
      'Buenas prácticas para fotos y geolocalización',
      'Señales de alerta y búsqueda de apoyo'
    ]
  },
  {
    title: 'Capacitación PyME: cultura y políticas base',
    desc: 'Políticas simples y aplicables: contraseñas, dispositivos, correo, respaldos y respuesta a incidentes.',
    checklist: [
      'Política de contraseñas y 2FA',
      'Inventario mínimo de activos',
      'Plan de respuesta (primeras 2 horas)'
    ]
  }
];

let projIndex = 0;
function setProject(i){
  projIndex = (i + projectData.length) % projectData.length;
  const p = projectData[projIndex];
  if (projectTitle) projectTitle.textContent = p.title;
  if (projectDesc) projectDesc.textContent = p.desc;
  if (projectChecklist) projectChecklist.innerHTML = p.checklist.map(x => `<li>${x}</li>`).join('');
  if (projectCount) projectCount.textContent = `${projIndex + 1} / ${projectData.length}`;

  if (projectItems.length){
    projectItems.forEach((b, idx) => b.classList.toggle('is-active', idx === projIndex));
  }
}
if (projectItems.length){
  projectItems.forEach((b, idx) => b.addEventListener('click', () => setProject(idx)));
}
projPrev?.addEventListener('click', () => setProject(projIndex - 1));
projNext?.addEventListener('click', () => setProject(projIndex + 1));
setProject(0);

// ------------------------------
// Reveal on scroll
// ------------------------------
const reveals = $$('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting){
      ent.target.classList.add('is-visible');
      io.unobserve(ent.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));
