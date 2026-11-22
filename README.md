# Recetario Interactivo – Paulina Rivero

Recetario para clases de cocina con Thermomix TM6 y TM7. Cada clienta recibe su propio enlace (`/receta/...`) para marcar qué ingredientes tiene en casa; Paulina y la clienta ven las mismas marcas casi al instante.

## Publicar en Netlify

1. Sube todos estos archivos a un repositorio de GitHub.
2. En Netlify: **Add new site › Import an existing project › GitHub** y elige el repositorio.
3. Netlify lee `netlify.toml` solo: comando `npm run build`, carpeta `dist`, funciones en `netlify/functions`.
4. Toca **Deploy**. No necesita clave de API.

Los datos (recetas, enlaces de clientas y marcas) se guardan en Netlify Blobs, el almacenamiento propio de Netlify.

## Estructura

- `src/` – la app (React).
- `netlify/functions/api.mts` – el servidor en Netlify: responde a `/api/*`.
- `netlify/lib/recetario-core.ts` – recetas iniciales y lógica del servidor.
- `server.ts` – servidor original de AI Studio, solo para pruebas en el computador (`npm run dev`).
