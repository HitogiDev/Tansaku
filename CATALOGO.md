# Cómo agregar un producto al catálogo

El catálogo y las páginas individuales se generan desde un solo archivo:

`src/data/products.ts`

## 1. Añade las fotos

Guarda dos o más fotos en `src/assets/products/`. Usa nombres cortos, sin espacios ni acentos, por ejemplo:

- `taza-gato-frente.webp`
- `taza-gato-detalle.webp`

## 2. Importa las fotos

Al principio de `src/data/products.ts`, agrega una importación por foto:

```ts
import tazaGatoFrente from "../assets/products/taza-gato-frente.webp";
import tazaGatoDetalle from "../assets/products/taza-gato-detalle.webp";
```

## 3. Añade el producto

Dentro de `products`, copia este bloque, cambia los datos y colócalo antes del cierre `];`:

```ts
{
  slug: "taza-gato",
  name: "Taza Gato Anime",
  collection: "Colección Neko",
  price: "RD$350",
  available: true,
  stockLabel: "Disponible",
  shortDescription: "Descripción corta para la tarjeta del catálogo.",
  description: "Descripción completa que aparecerá en la página del producto.",
  details: [
    { label: "Material", value: "Cerámica" },
    { label: "Capacidad", value: "350 ml" },
    { label: "Acabado", value: "Brillante" },
    { label: "Cuidado", value: "Lavado a mano" },
  ],
  images: [
    { src: tazaGatoFrente, alt: "Taza de gato anime vista de frente" },
    { src: tazaGatoDetalle, alt: "Detalle de la impresión de la taza" },
  ],
  whatsappMessage: "Hola Tansaku! Quiero pedir la taza de gato anime",
},
```

Al guardar el archivo, la tarjeta aparecerá automáticamente en el catálogo y se creará la ruta `/productos/taza-gato/` con su carrusel.

## Inventario

- Disponible: usa `available: true` y completa `whatsappMessage`.
- Agotado: usa `available: false`; el botón de compra se reemplazará por el texto de `stockLabel`.

## Publicar los cambios

Desde la carpeta del proyecto, comprueba primero que todo compile:

```powershell
npm run build
```

Después puedes pedirle a Codex: “Publica los cambios del catálogo de Tansaku”. También puedes simplemente adjuntar las fotos y decirme el nombre, precio, descripción, disponibilidad y especificaciones; yo preparo y publico el producto.
