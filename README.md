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

## Environment Variables Netlify

Tambahkan variable berikut di Netlify agar website membaca konten dari Supabase:

```text
VITE_SUPABASE_URL=https://ojczixuymitcuojlelpe.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=isi_dengan_publishable_key_atau_anon_key
```

Jangan masukkan `service_role` atau secret key ke frontend. Jika variable belum diisi, website tetap berjalan memakai data demo.

## Supabase

Migration database tersedia di:

```text
supabase/migrations/20260723114811_create_clc_cms_schema.sql
```

Frontend otomatis membaca artikel published dan event dari Supabase jika environment variables sudah diisi. Jika database belum berisi konten published, website tetap memakai data demo supaya tampilan tidak kosong.
