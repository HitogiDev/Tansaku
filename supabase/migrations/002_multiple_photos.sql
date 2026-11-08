-- Si ya ejecutaste schema.sql antes, corre solo esto en el SQL Editor
-- para permitir varias fotos por publicación.
alter table public.products
  add column if not exists image_paths text[] not null default '{}';

update public.products
  set image_paths = array[image_path]
  where image_path is not null and cardinality(image_paths) = 0;
