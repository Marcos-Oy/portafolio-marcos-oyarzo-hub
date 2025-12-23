# Portafolio — Marcos Oyarzo (HTML/CSS/JS)

Este proyecto es un portafolio estático, responsive y con tema claro/oscuro.

## 1) Ejecutar localmente
Opción simple (sin instalar nada):
- Abre `index.html` con tu navegador.

Opción recomendada (servidor local):
- Si tienes VS Code: instala la extensión **Live Server** y ejecuta "Go Live".

## 2) Personalización rápida
Edita `index.html`:
- Sección **Proyectos**: reemplaza los 3 cards por tus repos/demos reales.
- Ajusta el texto de **Sobre mí** (propuesta de valor).
- Cambia email, LinkedIn y GitHub si corresponde.

Edita `styles.css`:
- Cambia `--accent` y `--accent2` si quieres otra identidad visual.

## 3) Contacto (formulario real)
Actualmente el formulario abre un `mailto:` (sin backend).
Si quieres envíos reales:
- **Formspree**: crea un formulario y reemplaza el `submit` en `script.js` por `fetch(...)`.
- **EmailJS**: alternativa similar sin servidor.

## 4) Publicar gratis (GitHub Pages)
1. Crea un repo en GitHub, por ejemplo `portfolio`.
2. Sube estos archivos a la rama `main`.
3. En GitHub: Settings → Pages → Build and deployment:
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
4. Espera a que quede publicado.

## 5) Seguridad / privacidad
El CV incluido puede contener datos sensibles. Si publicarás el sitio, revisa y elimina:
- RUT
- Teléfono
- Dirección exacta
