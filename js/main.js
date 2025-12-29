(() => {
  const root = document.documentElement;

  // --- Config: cambia estos enlaces a tus URLs reales ---
  const LINKS = {
    data: "./servicios/data-engineering/",
    cyber: "./servicios/ciberseguridad-ciudadana/",
    web: "./servicios/desarrollo-web/",
    it: "./servicios/arquitectura-ti/",
    ai: "./servicios/ia-generativa/"
  };

  // Apply outlinks
  document.querySelectorAll("[data-outlink]").forEach(a => {
    const key = a.getAttribute("data-outlink");
    if (LINKS[key]) a.setAttribute("href", LINKS[key]);
  });

  // --- Theme toggle ---
  const themeBtn = document.querySelector(".theme-toggle");
  const themeLabel = document.querySelector(".theme-label");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
  }

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") setTheme(saved);
  else setTheme(root.getAttribute("data-theme") || "dark");

  themeBtn?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current === "dark" ? "light" : "dark");
  });

  // --- Mobile nav ---
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("nav-panel");
  toggle?.addEventListener("click", () => {
    const isOpen = panel?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(!!isOpen));
  });

  // Close menu on link click (mobile)
  panel?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (panel.classList.contains("is-open")) {
        panel.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!panel || !toggle) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (panel.classList.contains("is-open") && !panel.contains(t) && !toggle.contains(t)) {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // --- Hero slider (full) ---
  const track = document.querySelector("[data-slider-track]");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll("[data-slider-dot]"));
  const prev = document.querySelector("[data-slider-prev]");
  const next = document.querySelector("[data-slider-next]");

  let index = 0;
  let timer = null;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === index));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === index));
  }

  function start() {
    stop();
    timer = setInterval(() => show(index + 1), 6500);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach(d => d.addEventListener("click", () => {
    const i = Number(d.getAttribute("data-slider-dot") || "0");
    show(i);
    start();
  }));

  prev?.addEventListener("click", () => { show(index - 1); start(); });
  next?.addEventListener("click", () => { show(index + 1); start(); });

  // Pause on hover (desktop)
  const hero = document.querySelector(".hero-slider");
  hero?.addEventListener("mouseenter", stop);
  hero?.addEventListener("mouseleave", start);

  // Swipe (mobile)
  let startX = null;
  hero?.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0]?.clientX ?? null;
  }, { passive: true });

  hero?.addEventListener("touchend", (e) => {
    if (startX == null) return;
    const endX = e.changedTouches[0]?.clientX ?? startX;
    const dx = endX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    start();
    startX = null;
  }, { passive: true });

  show(0);
  start();

  // --- Cases switcher ---
  const CASES = [
    {
      hero: "img/hero-data.svg",
      title: "Lakehouse para analítica",
      desc: "Arquitectura con almacenamiento escalable, versionado y costos controlados.",
      tags: ["Spark", "Delta/Iceberg", "S3/ADLS/GCS", "Terraform"],
      bullets: ["Ingesta y estandarización de fuentes", "Capas Bronze/Silver/Gold", "Monitoreo y alertas"],
      linkKey: "data"
    },
    {
      hero: "img/hero-cyber.svg",
      title: "Taller anti‑estafas",
      desc: "Sesión práctica con ejemplos reales: phishing, SIM swap, malware e IA.",
      tags: ["Phishing", "SIM swap", "Deepfakes", "Buenas prácticas"],
      bullets: ["Actividades con casos reales", "Checklist de prevención", "Guía para familia y equipos"],
      linkKey: "cyber"
    },
    {
      hero: "img/hero-web.svg",
      title: "Sitio PyME",
      desc: "Landing moderna con catálogo simple, WhatsApp y SEO básico.",
      tags: ["Responsive", "Performance", "Formulario", "Plantillas"],
      bullets: ["Diseño por rubro", "CTA claros y medibles", "Entrega lista para publicar"],
      linkKey: "web"
    },
    {
      hero: "img/hero-it.svg",
      title: "Oficina inicial",
      desc: "Compra inteligente, armado y puesta en marcha de infraestructura de oficina.",
      tags: ["PCs por volumen", "Red & Wi‑Fi", "Licencias", "Soporte"],
      bullets: ["Cotización y comparativa", "Instalación y configuración", "Controles básicos de administrador"],
      linkKey: "it"
    }
  ];

  const caseButtons = Array.from(document.querySelectorAll(".case-item"));
  const caseHero = document.querySelector("[data-case-hero]");
  const caseTitle = document.querySelector("[data-case-title]");
  const caseDesc = document.querySelector("[data-case-desc]");
  const caseTags = document.querySelector("[data-case-tags]");
  const caseBullets = document.querySelector("[data-case-bullets]");

  function renderCase(i) {
    const c = CASES[i];
    if (!c) return;
    caseButtons.forEach((b, idx) => b.classList.toggle("is-active", idx === i));
    if (caseHero) caseHero.setAttribute("src", c.hero);
    if (caseTitle) caseTitle.textContent = c.title;
    if (caseDesc) caseDesc.textContent = c.desc;

    if (caseTags) {
      caseTags.innerHTML = "";
      c.tags.forEach(t => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = t;
        caseTags.appendChild(span);
      });
    }

    if (caseBullets) {
      caseBullets.innerHTML = "";
      c.bullets.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        caseBullets.appendChild(li);
      });
    }

    // Update first outlink in case section
    const link = document.querySelector("#cases .links a[data-outlink]");
    if (link) link.setAttribute("href", LINKS[c.linkKey] || "#");
  }

  caseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-case") || "0");
      renderCase(i);
    });
  });

  renderCase(0);


  // =========================
  // Carouseles (solo Hub)
  // =========================
  function initCarousels(){
    const carousels = document.querySelectorAll(".carousel[data-carousel]");
    carousels.forEach((car) => {
      const track = car.querySelector(".carousel-track");
      const prev = car.querySelector(".carousel-btn.prev");
      const next = car.querySelector(".carousel-btn.next");
      if (!track || !prev || !next) return;

      const step = () => {
        const first = track.querySelector(":scope > *");
        if (!first) return Math.max(320, track.clientWidth * 0.9);
        const cs = getComputedStyle(track);
        const gap = parseFloat(cs.gap || cs.columnGap || "0") || 0;
        const w = first.getBoundingClientRect().width || 0;
        return Math.max(240, w + gap);
      };

      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const x = track.scrollLeft;
        prev.disabled = x <= 2;
        next.disabled = x >= (max - 2);
      };

      prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
      next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

      let raf = 0;
      track.addEventListener("scroll", () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(update);
      });
      window.addEventListener("resize", update);
      update();
    });
  }

  initCarousels();
})();
