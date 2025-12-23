(() => {
  const root = document.documentElement;
  const menuBtn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  // Mobile menu
  menuBtn?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after click (mobile)
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else {
    // Default: dark
    root.dataset.theme = 'dark';
  }

  const updateThemeLabel = () => {
    const t = root.dataset.theme;
    themeToggle.textContent = t === 'light' ? 'Oscuro' : 'Claro';
  };
  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', root.dataset.theme);
    updateThemeLabel();
  });

  // Active section highlight
  const links = Array.from(menu?.querySelectorAll('a') || []);
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id;

    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    }

    links.forEach(l => {
      const href = l.getAttribute('href')?.replace('#', '');
      l.classList.toggle('active', href === current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Simple contact form validation (no backend)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const setError = (field, msg) => {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (el) el.textContent = msg || '';
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let ok = true;
    setError('name', '');
    setError('email', '');
    setError('message', '');

    if (name.length < 2) { setError('name', 'Ingresa tu nombre.'); ok = false; }
    if (!isEmail(email)) { setError('email', 'Ingresa un email válido.'); ok = false; }
    if (message.length < 10) { setError('message', 'Cuéntame un poco más (mín. 10 caracteres).'); ok = false; }

    if (!ok) return;

    // Without backend: open mailto
    const subject = encodeURIComponent('Contacto desde portafolio');
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:oyarzo.marcos97@outlook.com?subject=${subject}&body=${body}`;
    status.textContent = 'Abriendo tu cliente de correo…';
    form.reset();
  });
})();
