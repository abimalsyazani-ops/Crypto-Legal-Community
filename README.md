# Crypto Legal Community

Prototype media berita dan edukasi Crypto Legal Community (CLC) berbasis Vite React SPA.

## Menjalankan Lokal

```bash
pnpm install
pnpm run dev
```

Development server default:

```text
http://127.0.0.1:5173
```

## Build

```bash
pnpm run build
```

Output produksi berada di:

```text
dist
```

## Deploy ke Netlify

Pengaturan Netlify sudah ada di `netlify.toml`.

- Build command: `pnpm run build`
- Publish directory: `dist`

Redirect SPA juga sudah diatur agar route seperti `/admin`, `/berita`, dan `/berita/:slug` tetap bisa dibuka langsung.

## Supabase

Migration database tersedia di:

```text
supabase/migrations/20260723114811_create_clc_cms_schema.sql
```

Prototype frontend saat ini masih memakai data dummy dan `localStorage`. Integrasi runtime ke Supabase bisa ditambahkan setelah environment variables dan autentikasi production disiapkan.
