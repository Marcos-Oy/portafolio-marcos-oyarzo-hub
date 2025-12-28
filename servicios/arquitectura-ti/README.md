# Arquitectura TI / Infraestructura de Oficina (Portfolio)

Sitio estático (HTML/CSS/JS) para ofrecer servicios de **Arquitectura TI y Soporte** enfocado en **empresas y PyMEs**:
- Compra y armado de computadores por volumen (torres / notebooks).
- Licencias, sistema operativo y ofimática.
- Instalación de red (router/switch/Wi‑Fi), puntos de red básicos, impresoras.
- Soporte técnico (físico y digital).
- Seguridad básica: usuario estándar, admin controlado, políticas simples.

## Cómo usar
1. Descomprime el .zip.
2. Abre `index.html` en tu navegador.

## Personalización rápida
- **Nombre / marca:** en `index.html` (header y footer).
- **WhatsApp:** busca `wa.me/56900000000` y reemplaza el número.
- **Email:** reemplaza `contacto@tu-dominio.cl`.
- **Ubicación/Horario:** sección Contacto.
- **Imágenes:** reemplaza los SVG en `img/` por fotografías (recomendado 1600x900 para el hero).
  - `img/hero-1.svg`, `img/hero-2.svg`, `img/hero-3.svg`
  - `img/profile.svg` por `img/profile.jpg` (y actualiza el `<img>` en la sección “Sobre el servicio”).

## Formulario
El formulario es demo y muestra un `alert`. Puedes conectarlo a:
- Formspree
- Netlify Forms
- Un backend propio

La lógica está en `js/main.js` (función `initForm()`).

## Dark/Light
El botón “Dark/Light”:
- Cambia el atributo `data-theme` en `<html>`.
- Guarda el tema en `localStorage`.

## Licencia
Uso libre para portafolio / proyectos. Cambia textos e imágenes antes de publicar.
