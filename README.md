# Hub — Marca personal (Data + Ciber + Web + Arquitectura TI + IA)

Este proyecto es un **Hub** (página principal) que enlaza a tus 5 servicios principales.

## Cómo usar
1. Abre `index.html` en tu navegador, o publícalo en tu hosting.
2. Edita `js/main.js` y actualiza los enlaces:
```js
const LINKS = {
  data: "https://tu-dominio.cl/data-engineering/",
  cyber: "https://tu-dominio.cl/ciberseguridad-ciudadana/",
  web: "https://tu-dominio.cl/desarrollo-web/",
  it: "https://tu-dominio.cl/arquitectura-ti/"
};
```

## Personalización rápida
- Nombre / subtítulo: `index.html` (header y footer).
- Foto: reemplaza `img/perfil.jpeg`.
- WhatsApp: actualiza el número en el enlace `wa.me/...` (header flotante y contacto).
- Logos / testimonios: secciones `Clientes` y `Testimonios` en `index.html`.
- Colores: variables CSS en `css/styles.css`.

## Estructura
- `index.html` — contenido y secciones
- `css/styles.css` — estilos + light/dark (variables)
- `js/main.js` — menú móvil, carrusel full, links a sitios, casos
- `img/` — hero y recursos gráficos