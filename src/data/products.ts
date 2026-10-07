import type { ImageMetadata } from "astro";

import keychainPhoto from "../assets/products/llavero-samurai.webp";
import keychainDetailPhoto from "../assets/products/llavero-samurai-detalle.webp";
import pinsPhoto from "../assets/products/pines-yokai.webp";
import pinsDetailPhoto from "../assets/products/pines-yokai-detalle.webp";
import stickersPhoto from "../assets/products/stickers-matsuri.webp";
import stickersDetailPhoto from "../assets/products/stickers-matsuri-detalle.webp";
import postersPhoto from "../assets/products/posters-sombras.webp";
import postersRoomPhoto from "../assets/products/posters-sombras-ambiente.webp";

export type Product = {
  slug: string;
  name: string;
  collection: string;
  price: string;
  available: boolean;
  stockLabel: string;
  shortDescription: string;
  description: string;
  details: Array<{ label: string; value: string }>;
  images: Array<{ src: ImageMetadata; alt: string }>;
  whatsappMessage?: string;
};

export const products: Product[] = [
  {
    slug: "llaveros-anime",
    name: "Llaveros Anime",
    collection: "Colección Kage",
    price: "Desde RD$150",
    available: false,
    stockLabel: "Agotados por ahora",
    shortDescription:
      "Llaveros acrílicos inspirados en el anime, con impresión a doble cara y aro reforzado.",
    description:
      "Una pieza ligera y resistente para llevar tu estilo anime en las llaves, la mochila o el estuche. El acrílico transparente deja el diseño nítido por ambos lados y el herraje metálico mantiene el llavero bien sujeto durante el uso diario.",
    details: [
      { label: "Material", value: "Acrílico premium" },
      { label: "Tamaño", value: "7–9 cm" },
      { label: "Impresión", value: "Doble cara" },
      { label: "Herraje", value: "Aro metálico" },
    ],
    images: [
      {
        src: keychainPhoto,
        alt: "Llavero acrílico anime con un samurái en negro y rojo",
      },
      {
        src: keychainDetailPhoto,
        alt: "Vista de detalle del llavero samurái y su aro metálico",
      },
    ],
  },
  {
    slug: "pines-metalicos",
    name: "Pines Metálicos",
    collection: "Set Yokai",
    price: "Desde RD$180",
    available: false,
    stockLabel: "Agotados por ahora",
    shortDescription:
      "Pines esmaltados de inspiración japonesa, con bordes pulidos y colores intensos.",
    description:
      "Un set compacto para personalizar chaquetas, bolsos y estuches. Cada pieza combina esmalte brillante con líneas metálicas definidas, y usa un broche posterior para mantener el pin firme mientras lo llevas.",
    details: [
      { label: "Material", value: "Metal + esmalte" },
      { label: "Tamaño", value: "3–5 cm" },
      { label: "Contenido", value: "Set de 3" },
      { label: "Cierre", value: "Broche posterior" },
    ],
    images: [
      {
        src: pinsPhoto,
        alt: "Set de tres pines metálicos con luna, ojo y máscara",
      },
      {
        src: pinsDetailPhoto,
        alt: "Vista cercana del esmalte y los bordes de los pines Yokai",
      },
    ],
  },
  {
    slug: "stickers-anime",
    name: "Stickers Anime",
    collection: "Pack Matsuri",
    price: "RD$80",
    available: true,
    stockLabel: "Disponible",
    shortDescription:
      "Pack de stickers resistentes al agua para decorar libretas, laptops y botellas.",
    description:
      "Cinco diseños con acabado definido y una paleta inspirada en el anime. El vinilo resistente al agua funciona muy bien en superficies lisas y conserva el color para que puedas personalizar tus objetos favoritos por más tiempo.",
    details: [
      { label: "Material", value: "Vinilo adhesivo" },
      { label: "Contenido", value: "5 unidades" },
      { label: "Acabado", value: "Resistente al agua" },
      { label: "Uso", value: "Superficies lisas" },
    ],
    images: [
      {
        src: stickersPhoto,
        alt: "Pack de cinco stickers anime en negro, rojo y dorado",
      },
      {
        src: stickersDetailPhoto,
        alt: "Stickers anime aplicados sobre una libreta negra",
      },
    ],
    whatsappMessage: "Hola Tansaku! Quiero pedir el pack de stickers anime",
  },
  {
    slug: "posters-anime",
    name: "Pósters Anime",
    collection: "Serie Sombras",
    price: "RD$250",
    available: true,
    stockLabel: "Disponible",
    shortDescription:
      "Pósters de estética anime con impresión nítida y papel satinado de buen gramaje.",
    description:
      "Una serie pensada para transformar tu espacio con composiciones oscuras y detalles en rojo. La impresión conserva el contraste del arte y el acabado satinado reduce los reflejos intensos para que cada diseño destaque en la pared.",
    details: [
      { label: "Material", value: "Papel satinado" },
      { label: "Tamaño", value: "30 × 45 cm" },
      { label: "Diseños", value: "3 opciones" },
      { label: "Entrega", value: "Protección incluida" },
    ],
    images: [
      {
        src: postersPhoto,
        alt: "Tres pósters anime de la Serie Sombras",
      },
      {
        src: postersRoomPhoto,
        alt: "Pósters anime colocados en la pared de una habitación",
      },
    ],
    whatsappMessage: "Hola Tansaku! Quiero pedir un póster anime",
  },
];

