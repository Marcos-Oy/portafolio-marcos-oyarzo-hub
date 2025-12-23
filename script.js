(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

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