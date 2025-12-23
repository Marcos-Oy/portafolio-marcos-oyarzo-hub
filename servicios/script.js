(() => {
  const root = document.documentElement;
  const menuBtn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  menuBtn?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  else root.dataset.theme = 'dark';

  const updateThemeLabel = () => {
    const t = root.dataset.theme;
    if (themeToggle) themeToggle.textContent = t === 'light' ? 'Oscuro' : 'Claro';
  };
  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', root.dataset.theme);
    updateThemeLabel();
  });
})();