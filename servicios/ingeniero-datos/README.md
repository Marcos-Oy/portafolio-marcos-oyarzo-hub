# Portafolio - Ingeniero TI / Datos (Light) + Slider estilo 'slide-overlay'

## Qué incluye
- Slider HERO con estructura similar a tu ejemplo:
  - `#heroSlides` + `.slide.is-active`
  - Botones `#heroPrev` / `#heroNext`
  - Dots en `#heroDots` (se generan automáticamente desde JS)
- Animaciones suaves (reveal on scroll)
- Secciones: Sobre mí, Servicios, Proyectos, Contacto
- Botón flotante de WhatsApp

## Cómo usar
1. Descomprime el .zip
2. Abre `index.html` en el navegador.

## Dónde editar
- Textos y enlaces: `index.html`
- Estilos (colores, tamaños, layout): `css/styles.css`
- Slider/JS (autoplay, navegación): `js/main.js`
- Imágenes:
  - Hero: `img/hero-1.svg`, `img/hero-2.svg`, `img/hero-3.svg`
  - Proyectos: `img/project-*.svg`

## WhatsApp
Reemplaza el número en `index.html` (busca `wa.me/56912345678`).


## Hero XL (full-bleed)
El slider superior ahora ocupa casi todo el alto de pantalla.
Ajustes en `css/styles.css` bajo el bloque “XL HERO (full-bleed)”.


## Tema Dark/Light (toggle)
- Botón en el header para alternar tema.
- Preferencia se guarda en `localStorage` (key: `theme`).
- Si no hay preferencia, respeta `prefers-color-scheme`.


## Imagen real de ejemplo
- Se incluyó `img/hero-real.png` como ejemplo de estética TI (puedes reemplazarlo por tus fotos).


## Perfil (foto)
- Se agregó foto en 'Sobre mí': `img/profile.jpg` (reemplázala por tu imagen).


## Botones (dark)
- Se mejoró el sistema de botones usando variables (`--btn-*`) para que en dark se vean coherentes.
