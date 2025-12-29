(() => {
  const WA_NUMBER = "56928362758";
  const WA_TEXT = encodeURIComponent("Hola Marcos, quiero cotizar un servicio.");
  const MAIL_TO = "grupo.ti@outlook.cl";

  const body = document.body;
  if (!body) return;

  const base = body.dataset.base || "./";
  const rootEl = document.documentElement;

  // ---------------- Theme -------------------------------------------------
  function getInitialTheme(){
    try{
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }catch(_e){}
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(t){
    rootEl.setAttribute('data-theme', t);
    try{ localStorage.setItem('theme', t); }catch(_e){}
    const label = document.querySelector('.g-theme-label');
    if (label) label.textContent = (t === 'dark' ? 'Dark' : 'Light');
  }

  applyTheme(getInitialTheme());

  // ---------------- Navigation targets (always to HUB) --------------------
  const hubLinks = {
    home: base + 'index.html#top',
    about: base + 'index.html#about',
    services: base + 'index.html#services',
    projects: base + 'index.html#featured',
    contact: base + 'index.html#contact',
  };

  const SERVICES = [
    { key: 'data',  href: base + 'servicios/data-engineering/',          title: 'Data Engineering',          desc: 'Pipelines, calidad, lakehouse, cloud' },
    { key: 'cyber', href: base + 'servicios/ciberseguridad-ciudadana/',  title: 'Ciberseguridad Ciudadana',  desc: 'Prevención, talleres, buenas prácticas' },
    { key: 'web',   href: base + 'servicios/desarrollo-web/',            title: 'Desarrollo Web',            desc: 'Landing, SEO, performance, conversión' },
    { key: 'it',    href: base + 'servicios/arquitectura-ti/',           title: 'Arquitectura TI',           desc: 'Infra, redes, compras, soporte' },
    { key: 'ai',    href: base + 'servicios/ia-generativa/',             title: 'IA Generativa',             desc: 'Prompting, automatización, copilots' },
  ];

  function headerHtml(){
    const servicesItems = SERVICES.map(s => (
      `<a href="${s.href}"><strong>${s.title}</strong><span>${s.desc}</span></a>`
    )).join('');

    return `
      <header class="g-header" role="banner">
        <div class="g-container g-header-inner">
          <a class="g-brand" href="${hubLinks.home}" aria-label="Ir al Hub">
            <span class="g-brand-dot" aria-hidden="true"></span>
            <span class="g-brand-text">
              <strong>Marcos Oyarzo</strong>
              <small>Data • Ciberseguridad • Web • Arquitectura TI • IA</small>
            </span>
          </a>

          <nav class="g-nav" aria-label="Navegación principal">
            <button class="g-nav-toggle" type="button" aria-controls="g-nav-panel" aria-expanded="false" aria-label="Abrir menú">
              <span class="g-nav-icon" aria-hidden="true"><span></span></span>
            </button>

            <div class="g-nav-panel" id="g-nav-panel">
              <a class="g-link" href="${hubLinks.about}">Sobre mí</a>
              <a class="g-link" href="${hubLinks.services}">Servicios</a>
              <a class="g-link" href="${hubLinks.projects}">Proyectos</a>
              <a class="g-link" href="${hubLinks.contact}">Contacto</a>

              <details class="g-dropdown">
                <summary class="g-btn g-ghost" aria-label="Abrir lista de servicios">Ver todos</summary>
                <div class="g-dropdown-menu">${servicesItems}</div>
              </details>

              <a class="g-btn g-primary" href="${hubLinks.contact}">Agendar</a>
              <button class="g-btn g-ghost g-theme-toggle" type="button" aria-label="Cambiar tema">
                <span class="g-theme-label">${rootEl.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
    `;
  }

  function footerHtml(){
    const servicesLinks = SERVICES.map(s => `<li><a href="${s.href}">${s.title}</a></li>`).join('');
    return `
      <footer class="g-footer" role="contentinfo">
        <div class="g-container">
          <div class="g-footer-grid">
            <div>
              <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
                <span class="g-brand-dot" aria-hidden="true"></span>
                <div>
                  <div style="font-weight:900;">Marcos Oyarzo</div>
                  <div class="g-muted" style="font-size:13px;">Hub + páginas detalladas por servicio</div>
                </div>
              </div>
              <p class="g-muted" style="margin:0;">El HUB resume y destaca. Cada servicio contiene el detalle completo.</p>
            </div>

            <div>
              <h4>Servicios</h4>
              <ul class="g-footer-list">${servicesLinks}</ul>
            </div>

            <div>
              <h4>Contacto</h4>
              <ul class="g-footer-list">
                <li><a href="https://wa.me/${WA_NUMBER}?text=${WA_TEXT}" target="_blank" rel="noopener">WhatsApp: +56 9 2836 2758</a></li>
                <li><a href="mailto:${MAIL_TO}">${MAIL_TO}</a></li>
                <li><a href="${hubLinks.contact}">Formulario</a></li>
              </ul>
            </div>
          </div>

          <div class="g-footer-bottom">
            <span>© <span id="g-year"></span> Marcos Oyarzo. Todos los derechos reservados.</span>
            <a class="g-link" href="${hubLinks.home}">Volver arriba</a>
          </div>
        </div>
      </footer>
    `;
  }

  function waHtml(){
    return `
      <a class="g-wa-float" href="https://wa.me/${WA_NUMBER}?text=${WA_TEXT}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
        <img class="g-wa-icon" src="${base}img/whatsapp.png" alt="WhatsApp" loading="lazy" decoding="async" />
      </a>
    `;
  }

  const headerMount = document.getElementById('siteHeader');
  if (headerMount) headerMount.innerHTML = headerHtml();

  const footerMount = document.getElementById('siteFooter');
  if (footerMount) footerMount.innerHTML = footerHtml();

  const waMount = document.getElementById('waFloat');
  if (waMount) waMount.innerHTML = waHtml();

  const year = document.getElementById('g-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------------- Mobile menu ------------------------------------------
  const toggle = document.querySelector('.g-nav-toggle');
  const panel = document.getElementById('g-nav-panel');
  if (toggle && panel){
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (panel.classList.contains('is-open')){
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }));

    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('is-open')) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!panel.contains(t) && !toggle.contains(t)){
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------------- Theme toggle -----------------------------------------
  const themeBtn = document.querySelector('.g-theme-toggle');
  if (themeBtn){
    themeBtn.addEventListener('click', () => {
      const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---------------- Normalize wa.me links --------------------------------
  const waRe = /wa\.me\/(\d+)/i;
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const m = href.match(waRe);
    if (!m) return;
    a.setAttribute('href', href.replace(waRe, `wa.me/${WA_NUMBER}`));
  });

  // ---------------- Resolve HUB outlinks ---------------------------------
  const map = {
    data: SERVICES.find(s => s.key === 'data')?.href,
    cyber: SERVICES.find(s => s.key === 'cyber')?.href,
    web: SERVICES.find(s => s.key === 'web')?.href,
    it: SERVICES.find(s => s.key === 'it')?.href,
    ai: SERVICES.find(s => s.key === 'ai')?.href,
  };

  document.querySelectorAll('[data-outlink]').forEach(el => {
    if (!(el instanceof HTMLAnchorElement)) return;
    const k = el.dataset.outlink;
    if (!k) return;
    const href = map[k];
    if (href) el.href = href;
  });

  // ---------------- Contact form (HUB only) -------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    const statusEl = document.getElementById('contactStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const setStatus = (msg, ok) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.opacity = '1';
      statusEl.style.marginTop = '10px';
      statusEl.style.fontWeight = '650';
      statusEl.style.color = ok ? 'inherit' : 'crimson';
    };

    // Static hosting friendly: compose a mailto using native browser behavior.
    // (No npm, no server dependencies required.)
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(contactForm);
      const payload = {
        name: String(fd.get('name') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        subject: String(fd.get('subject') || '').trim(),
        message: String(fd.get('message') || '').trim(),
        website: String(fd.get('website') || '').trim(),
      };

      if (!payload.name || !payload.email || !payload.subject || !payload.message){
        setStatus('Por favor completa todos los campos requeridos.', false);
        return;
      }

      // Honeypot anti-bot
      if (payload.website){
        setStatus('Enviado.', true);
        contactForm.reset();
        return;
      }

      const subject = `[Contacto Web] ${payload.subject}`;
      const bodyLines = [
        `Nombre: ${payload.name}`,
        `Email: ${payload.email}`,
        '',
        payload.message,
      ];
      const mailto = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      // UI feedback: the actual sending is handled by the user's email client.
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Abriendo tu cliente de correo…', true);

      // Use location.href to trigger mail client on all browsers.
      window.location.href = mailto;

      // Reset after handoff to client.
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) submitBtn.disabled = false;
        setStatus('Listo. Si tu correo no se abrió, revisa bloqueadores o intenta nuevamente.', true);
      }, 600);
    });
  }

})();
