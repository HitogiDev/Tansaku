-- Tansaku — esquema de Supabase para el catálogo y el panel de administración.
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
-- Se puede ejecutar más de una vez sin romper nada.

-- ── Administradores ─────────────────────────────────────────────
-- Solo los usuarios que estén en esta tabla pueden crear, editar o borrar
-- publicaciones y fotos. Iniciar sesión NO basta: hay que estar aquí.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins can read own row" on public.admins;
create policy "admins can read own row" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── Publicaciones (productos) ───────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text check (char_length(description) <= 2000),
  price numeric(10, 2) not null check (price >= 0),
  category text not null check (char_length(category) between 1 and 60),
  image_path text,
  in_stock boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Varias fotos por publicación (la primera es la portada).
alter table public.products
  add column if not exists image_paths text[] not null default '{}';

update public.products
  set image_paths = array[image_path]
  where image_path is not null and cardinality(image_paths) = 0;

create index if not exists products_published_created_idx
  on public.products (published, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

-- Cualquiera puede ver las publicaciones publicadas; los admins ven todas.
drop policy if exists "public can read published products" on public.products;
create policy "public can read published products" on public.products
  for select to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "admins can insert products" on public.products;
create policy "admins can insert products" on public.products
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update products" on public.products;
create policy "admins can update products" on public.products
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete products" on public.products;
create policy "admins can delete products" on public.products
  for delete to authenticated
  using (public.is_admin());

-- ── Fotos ───────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ── Hacerte admin ───────────────────────────────────────────────
-- 1. Crea tu usuario en Authentication → Users → Add user (correo + contraseña).
-- 2. Ejecuta esto cambiando el correo por el tuyo:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'TU-CORREO@ejemplo.com'
-- on conflict do nothing;
