# Catálogo y panel de administración

El sitio ahora tiene dos partes:

| Dirección | Qué es | Código |
| --- | --- | --- |
| `tansaku.site/catalogo/` | Catálogo público con filtros por categoría, precio, búsqueda, orden y "solo disponibles". Cada producto tiene botón para pedir por WhatsApp. | `src/pages/catalogo.astro` |
| `admin.tansaku.site` | Panel privado: iniciar sesión, subir publicaciones con fotos (hasta 10, varias a la vez), precio, categoría y descripción; editar, marcar agotado, ocultar o borrar. | `admin/src/pages/index.astro` |

Como el sitio es estático (GitHub Pages, sin servidor), los datos, las fotos y el
login viven en **Supabase** (plan gratis). Las dos partes leen el mismo proyecto.

---

## 1. Crear el proyecto en Supabase (una sola vez)

1. Entra a <https://supabase.com>, crea una cuenta y un proyecto nuevo
   (región: la más cercana, p. ej. `East US`).
2. Ve a **SQL Editor → New query**, pega todo el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y dale **Run**.
   Esto crea la tabla de publicaciones, la carpeta de fotos y las reglas de
   seguridad.
3. **Desactiva los registros públicos**: *Authentication → Sign In / Providers →
   Email* → apaga **"Allow new users to sign up"**. Así nadie más puede crearse
   una cuenta.
4. **Crea tu usuario**: *Authentication → Users → Add user → Create new user*,
   con tu correo y una contraseña (marca *Auto Confirm User*).
5. **Hazte admin**: en el SQL Editor ejecuta (con tu correo):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'TU-CORREO@ejemplo.com'
   on conflict do nothing;
   ```

6. Copia los datos de conexión en *Project Settings → API*:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `PUBLIC_SUPABASE_ANON_KEY`

   Esta clave es pública a propósito (va dentro de la página). La seguridad la
   ponen las reglas del paso 2: sin estar en la tabla `admins` nadie puede
   crear, editar ni borrar. **Nunca** uses la `service_role` key aquí.

### ¿Ya habías corrido `schema.sql` antes de que existieran las fotos múltiples?

Corre también [`supabase/migrations/002_multiple_photos.sql`](supabase/migrations/002_multiple_photos.sql)
en el SQL Editor (o vuelve a correr `schema.sql` completo: se puede repetir sin
problema). Sin eso, el panel muestra un error al guardar.

## 2. Conectar el sitio público (tansaku.site)

En GitHub: *Settings → Secrets and variables → Actions → pestaña **Variables** →
New repository variable*, crea:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

El próximo push a `master` (o *Actions → Deploy to GitHub Pages → Run workflow*)
publica `/catalogo/` ya conectado. Mientras no estén configuradas, el catálogo
muestra "El catálogo se está preparando" con un botón de WhatsApp.

## 3. Publicar el panel en admin.tansaku.site

GitHub Pages solo permite **un** dominio por repositorio, así que el panel se
publica aparte en **Cloudflare Pages** (gratis) desde este mismo repositorio:

1. <https://dash.cloudflare.com> → *Workers & Pages → Create → Pages → Connect to
   Git* → elige `HitogiDev/Tansaku`.
2. Configuración de build:
   - **Production branch:** `master`
   - **Framework preset:** None
   - **Build command:** `npm run build:admin`
   - **Build output directory:** `dist-admin`
   - **Environment variables:** `PUBLIC_SUPABASE_URL`,
     `PUBLIC_SUPABASE_ANON_KEY` (los mismos valores) y `NODE_VERSION` = `22.12.0`
3. Cuando termine, en el proyecto → *Custom domains → Set up a custom domain* →
   `admin.tansaku.site`.
   - Si tu dominio ya está en Cloudflare, se configura solo.
   - Si no, en tu proveedor de DNS crea un registro **CNAME** `admin` →
     `<tu-proyecto>.pages.dev`.
4. En Supabase → *Authentication → URL Configuration*, agrega
   `https://admin.tansaku.site` a **Redirect URLs** (y ponlo como Site URL si
   quieres).

Cada push a `master` vuelve a publicar ambos: GitHub Pages el sitio, Cloudflare el
panel.

> ¿Prefieres Netlify o Vercel? Funciona igual: build `npm run build:admin`,
> carpeta `dist-admin`, las mismas variables y el dominio `admin.tansaku.site`.

## Uso diario

1. Abre `admin.tansaku.site` e inicia sesión.
2. Toca **+ Agregar fotos** y elige una o varias a la vez (hasta 10). Se reducen
   y comprimen automáticamente. La primera es la portada: usa ★ para cambiarla,
   ◀ ▶ para ordenarlas y ✕ para quitar una.
3. Escribe título, precio, categoría (elige una o escribe una nueva) y,
   si quieres, descripción → **Publicar**. Aparece al instante en
   `tansaku.site/catalogo/`. Al tocar un producto se abre con todas sus fotos.
4. En la lista puedes **Editar**, **Marcar agotado** (sigue visible con la
   etiqueta "Agotado" y el botón "Avísame"), **Ocultar** (deja de verse en el
   catálogo) o **Borrar**.

Las categorías del catálogo se generan solas a partir de lo que publiques.
Las sugeridas en el panel están en `DEFAULT_CATEGORIES` dentro de
`src/lib/shop.ts`.

## Desarrollo local

```sh
cp .env.example .env        # rellena con tus datos de Supabase
npm run dev                 # sitio público  → http://localhost:4321/catalogo/
npm run dev:admin           # panel admin    → http://localhost:4322
```
