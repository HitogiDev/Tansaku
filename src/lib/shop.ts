// Shared between the public site (tansaku.site) and the admin panel
// (admin.tansaku.site). Both read the same Supabase project.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const IMAGES_BUCKET = 'product-images';
export const WHATSAPP_NUMBER = '8098795559';

/** Suggested categories. The admin can also type a new one. */
export const DEFAULT_CATEGORIES = [
  'Manga',
  'Posters',
  'Llaveros',
  'Pines',
  'Stickers',
  'Figuras',
  'Ropa',
  'Otros',
];

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  /** Cover photo (same as image_paths[0]); kept for older rows. */
  image_path: string | null;
  /** All photos, in display order. The first one is the cover. */
  image_paths?: string[] | null;
  in_stock: boolean;
  published: boolean;
  created_at: string;
};

/** Max photos per product (enforced in the admin UI). */
export const MAX_PHOTOS = 10;

export function productImages(p: Pick<Product, 'image_path' | 'image_paths'>) {
  if (p.image_paths?.length) return p.image_paths;
  return p.image_path ? [p.image_path] : [];
}

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

export function getClient(): SupabaseClient | null {
  if (!isConfigured) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export function imageUrl(path: string | null): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

const priceFormatter = new Intl.NumberFormat('es-DO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(price: number): string {
  return `RD$${priceFormatter.format(price)}`;
}

export function whatsappLink(product: Pick<Product, 'title' | 'price'>) {
  const text = `Hola Tansaku! Me interesa: ${product.title} (${formatPrice(
    product.price,
  )}). ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
