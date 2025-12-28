
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

(function initTheme(){
  const saved = localStorage.getItem("theme");
  const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (preferredDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  const btn = $("#themeToggle");
  if(!btn) return;

  const syncLabel = () => {
    const t = document.documentElement.getAttribute("data-theme");
    btn.dataset.theme = t;
    btn.innerHTML = t === "dark"
      ? '☀︎&nbsp;&nbsp;Light'
      : '☾&nbsp;&nbsp;Dark';
  };

  syncLabel();

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncLabel();
  });
})();

(function initMobileNav(){
  const toggle = $("#navToggle");
  const nav = $("#siteNav");
  if(!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("is-open") ? "true" : "false");
  });

  $$("#siteNav a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if(!nav.classList.contains("is-open")) return;
    const inside = nav.contains(e.target) || toggle.contains(e.target);
    if(!inside){
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

function createSlider(rootSel, opts={}){
  const root = $(rootSel);
  if(!root) return null;

  const slidesWrap = $(".slides", root);
  const slides = $$(".slide", root);
  const prev = $(".slider-btn--prev", root);
  const next = $(".slider-btn--next", root);
  const dotsWrap = $(".slider-dots", root);

  let index = 0;
  let timer = null;
  const autoplay = opts.autoplay ?? true;
  const delay = opts.delay ?? 6500;

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    slidesWrap.style.transform = `translateX(-${index * 100}%)`;
    if(dotsWrap){
      $$(".dot", dotsWrap).forEach((d, di) => {
        d.classList.toggle("is-active", di === index);
        d.setAttribute("aria-selected", di === index ? "true" : "false");
        d.tabIndex = di === index ? 0 : -1;
      });
    }
  };

  if(dotsWrap){
    dotsWrap.innerHTML = slides.map((_, i) => `
      <button type="button" class="dot ${i===0?'is-active':''}" role="tab"
        aria-label="Ir a la diapositiva ${i+1}" aria-selected="${i===0?'true':'false'}" tabindex="${i===0?0:-1}"
        data-index="${i}"></button>
    `).join("");
    dotsWrap.addEventListener("click", (e) => {
      const b = e.target.closest(".dot");
      if(!b) return;
      go(parseInt(b.dataset.index,10));
      restart();
    });
  }

  prev?.addEventListener("click", () => { go(index-1); restart(); });
  next?.addEventListener("click", () => { go(index+1); restart(); });

  const start = () => {
    if(!autoplay) return;
    timer = window.setInterval(() => go(index+1), delay);
  };
  const stop = () => {
    if(timer) window.clearInterval(timer);
    timer = null;
  };
  const restart = () => { stop(); start(); };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  let x0 = null;
  root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, {passive:true});
  root.addEventListener("touchend", (e) => {
    if(x0 === null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    if(Math.abs(dx) > 40){
      go(dx > 0 ? index-1 : index+1);
      restart();
    }
    x0 = null;
  }, {passive:true});

  go(0);
  start();

  return { go, start, stop };
}
createSlider("#heroSlider", { autoplay:true, delay: 7200 });

(function initCatalog(){
  const filters = $$(".filter-btn");
  const cards = $$(".template");
  const modal = $("#templateModal");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalList = $("#modalList");
  const modalClose = $("#modalClose");
  const modalPreview = $("#modalPreview");
  if(filters.length === 0 || cards.length === 0) return;

  const templateMeta = {
    "startup-kit": {
      title: "Kit Oficina Inicial",
      desc: "Levantamiento básico para 3–8 puestos: PCs, impresora, red, correo y control de accesos.",
      bullets: ["Diagnóstico + cotización", "Armado/compra por volumen", "Instalación + documentación", "Checklist de seguridad básica"]
    },
    "pyme-10": {
      title: "PyME 10–25 Puestos",
      desc: "Estandarización, licencias, onboarding de equipos y soporte para operar sin fricción.",
      bullets: ["Imaging / configuración por perfil", "Políticas de software", "Backup básico + inventario", "Soporte mensual (opcional)"]
    },
    "empresa-50": {
      title: "Empresa 30–80 Puestos",
      desc: "Infraestructura escalable: redes segmentadas, control de privilegios, hardening y procesos.",
      bullets: ["Arquitectura + plan de crecimiento", "Control de acceso admin", "Gestión de parches", "Procedimientos y continuidad"]
    },
    "notebook-care": {
      title: "Cuidado Notebooks",
      desc: "Diagnóstico, reparación y optimización: rendimiento, SSD/RAM, limpieza y software.",
      bullets: ["Cambio SSD/RAM (si aplica)", "Respaldo y migración", "Reinstalación + drivers", "Revisión térmica / limpieza"]
    },
    "red-office": {
      title: "Red de Oficina",
      desc: "Instalación de router/switch, cableado estructurado básico y Wi‑Fi estable por áreas.",
      bullets: ["Plano y puntos de red", "Configuración Wi‑Fi", "Impresoras en red", "Documentación y credenciales"]
    },
    "security-basic": {
      title: "Seguridad Básica",
      desc: "Capa mínima para reducir riesgos: contraseñas admin, permisos, actualizaciones y buenas prácticas.",
      bullets: ["Usuario estándar + admin controlado", "Política de instalación", "Actualizaciones y antivirus", "Guía para usuarios"]
    }
  };

  const apply = (type) => {
    cards.forEach(c => {
      const show = type === "all" || c.dataset.type.includes(type);
      c.style.display = show ? "" : "none";
    });
  };

  filters.forEach(b => {
    b.addEventListener("click", () => {
      filters.forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active");
      apply(b.dataset.filter);
    });
  });

  const openModal = (key) => {
    if(!modal) return;
    const data = templateMeta[key];
    if(!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalList.innerHTML = data.bullets.map(x => `<li>${x}</li>`).join("");
    modalPreview.innerHTML = `<span>Vista previa / demo (placeholder)</span>`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  $$(".template [data-open]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.open;
      openModal(key);
    });
  });

  const close = () => {
    if(!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };
  modalClose?.addEventListener("click", close);
  modal?.addEventListener("click", (e) => {
    if(e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal?.classList.contains("is-open")) close();
  });

  apply("all");
})();

(function initProjects(){
  const items = $$(".project-item");
  const title = $("#projTitle");
  const desc = $("#projDesc");
  const tagsWrap = $("#projTags");
  const pager = $("#projPager");
  const prev = $("#projPrev");
  const next = $("#projNext");
  if(items.length === 0) return;

  const projects = items.map(i => ({
    title: i.dataset.title,
    desc: i.dataset.desc,
    tags: (i.dataset.tags || "").split("|").filter(Boolean)
  }));

  let idx = 0;

  const render = (i) => {
    idx = (i + projects.length) % projects.length;
    items.forEach((el, ei) => el.classList.toggle("is-active", ei === idx));
    const p = projects[idx];
    title.textContent = p.title;
    desc.textContent = p.desc;
    tagsWrap.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    pager.textContent = `${idx+1} / ${projects.length}`;
  };

  items.forEach((el, i) => el.addEventListener("click", () => render(i)));
  prev?.addEventListener("click", () => render(idx-1));
  next?.addEventListener("click", () => render(idx+1));

  render(0);
})();

(function initReveal(){
  const els = $$(".fade-up");
  if(els.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

(function initForm(){
  const form = $("#contactForm");
  if(!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensaje enviado (demo). Conecta este formulario a Formspree/Netlify Forms o a tu backend.");
    form.reset();
  });
})();
