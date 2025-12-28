/* =========================================================
   JS - Consultor IA Generativa & Prompt Engineering
   ---------------------------------------------------------
   NOTAS:
   - Reemplaza links y textos en index.html
   - Slider (hero) y carrusel (testimonios) son vanilla JS
   ========================================================= */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* ---------- Theme toggle ---------- */
(function initTheme(){
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initial);
  updateThemeButton();

  const btn = $("#themeToggle");
  if(btn){
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeButton();
    });
  }

  function updateThemeButton(){
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const label = $("#themeLabel");
    const icon = $("#themeIcon");
    if(label) label.textContent = cur === "dark" ? "Dark" : "Light";
    if(icon){
      icon.innerHTML = cur === "dark"
        ? `<path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a6.6 6.6 0 1 0 9.8 9.8Z" fill="currentColor"></path>`
        : `<path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16v2m0 16v2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path>`;
    }
  }
})();

/* ---------- Mobile menu ---------- */
(function initMobileMenu(){
  const toggle = $("#mobileToggle");
  const panel = $("#mobilePanel");
  if(!toggle || !panel) return;

  const close = () => {
    panel.style.display = "none";
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    panel.style.display = "block";
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = panel.style.display === "block";
    isOpen ? close() : open();
  });

  // close on click link
  $$("#mobilePanel a").forEach(a => a.addEventListener("click", close));

  // close on outside click
  document.addEventListener("click", (e) => {
    if(panel.style.display !== "block") return;
    if(panel.contains(e.target) || toggle.contains(e.target)) return;
    close();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") close();
  });
})();

/* ---------- Hero slider ---------- */
(function initHeroSlider(){
  const root = $("#heroSlider");
  if(!root) return;

  const slidesWrap = $("#heroSlides") || root;
  const slides = $$(".slide", root);
  const dotsWrap = $("#heroDots");
  const prevBtn = $("#heroPrev");
  const nextBtn = $("#heroNext");

  let idx = slides.findIndex(s => s.classList.contains("is-active"));
  if(idx < 0) idx = 0;

  let timer = null;
  const AUTOPLAY_MS = 7500;

  const setActive = (i) => {
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));

    if(dotsWrap){
      const dots = $$(".dot", dotsWrap);
      dots.forEach((d, k) => {
        const active = (k === i);
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-selected", active ? "true" : "false");
        d.tabIndex = active ? 0 : -1;
      });
    }
  };

  const stop = () => { if(timer) { clearInterval(timer); timer = null; } };
  const start = () => { stop(); timer = setInterval(() => go(idx + 1), AUTOPLAY_MS); };
  const restart = () => { start(); };

  const go = (i, user=false) => {
    idx = (i + slides.length) % slides.length;
    setActive(idx);
    if(user) restart();
  };

  const next = () => go(idx + 1, true);
  const prev = () => go(idx - 1, true);

  // Build dots
  if(dotsWrap){
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (i === idx ? " is-active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
      b.setAttribute("aria-selected", i === idx ? "true" : "false");
      b.tabIndex = i === idx ? 0 : -1;
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
  }

  if(prevBtn) prevBtn.addEventListener("click", prev);
  if(nextBtn) nextBtn.addEventListener("click", next);

  // Pause on hover/focus
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  // Swipe (móvil)
  let x0 = null;
  slidesWrap.addEventListener("touchstart", (e) => {
    x0 = e.touches[0].clientX;
  }, {passive:true});

  slidesWrap.addEventListener("touchend", (e) => {
    if(x0 == null) return;
    const x1 = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
    if(x1 == null) { x0 = null; return; }
    const dx = x1 - x0;
    if(Math.abs(dx) > 45){
      dx < 0 ? next() : prev();
    }
    x0 = null;
  }, {passive:true});

  setActive(idx);
  start();
})();

/* ---------- Testimonials carousel ---------- */
(function initTestimonials(){
  const scroller = $("#testiScroller");
  if(!scroller) return;
  const prev = $("#testiPrev");
  const next = $("#testiNext");

  const step = () => Math.min(520, scroller.clientWidth * 0.9);

  if(prev) prev.addEventListener("click", () => {
    scroller.scrollBy({ left: -step(), behavior: "smooth" });
  });
  if(next) next.addEventListener("click", () => {
    scroller.scrollBy({ left: step(), behavior: "smooth" });
  });
})();

/* ---------- Reveal on scroll ---------- */
(function initReveal(){
  const els = $$(".reveal");
  if(!("IntersectionObserver" in window) || els.length === 0){
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.classList.add("is-visible");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ---------- Demo form (no backend) ---------- */
(function initContactForm(){
  const form = $("#contactForm");
  if(!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Aquí puedes integrar un endpoint real (Formspree, Netlify Forms, etc.)
    // Por ahora es demostrativo.
    alert("Formulario enviado (demo). Integra un backend/servicio para envío real.");
    form.reset();
  });
})();
