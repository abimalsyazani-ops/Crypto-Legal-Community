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

## PWA Admin

Dashboard admin di `/admin` sudah mendukung PWA. Setelah website dibuka dari domain HTTPS Netlify, admin bisa memasang dashboard melalui tombol **Install Dashboard** yang muncul di halaman admin atau melalui menu browser **Install app**.

PWA memakai:

- `public/manifest.webmanifest` dengan `start_url` ke `/admin`,
- `public/sw.js` untuk cache app shell dasar,
- metadata install di `index.html`.

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

## Admin Auth dan Storage

Dashboard `/admin` memakai Supabase Auth jika environment variables aktif. Login hanya menggunakan email dan password Supabase, bukan Magic Link.

Alurnya:

1. Buat user admin di Supabase Auth.
2. Tambahkan row di tabel `profiles` dengan `id` sama seperti user Auth tersebut.
3. Set `role` menjadi `admin`, `editor`, atau `author`.
4. Login di `/admin` memakai email/password Supabase.

Pastikan URL berikut masuk ke daftar redirect Supabase Auth:

```text
http://localhost:5173/admin
https://domain-netlify-kamu/admin
```

Di Supabase Dashboard: **Authentication > URL Configuration > Redirect URLs**.

Upload gambar admin memakai bucket Storage `media`. Bucket ini dibuat lewat migration:

```text
supabase/migrations/20260723133000_create_media_storage.sql
```

Bucket dibatasi untuk file gambar dan ukuran maksimal 5 MB. Public read aktif, sedangkan upload/update/delete hanya untuk user dengan role staff.

Form artikel di dashboard sudah dapat:

- mengambil kategori dari tabel `categories`,
- upload gambar ke Storage `media`,
- menyimpan draft ke tabel `articles`,
- mempublikasikan artikel ke tabel `articles`.
- mengedit artikel yang sudah ada,
- menghapus artikel.

Dashboard juga sudah mendukung:

- membuat dan menghapus event,
- membuat dan menghapus materi edukasi/course,
- statistik real dari tabel artikel, event, dan lessons.

Fitur penulis detail, rich text editor, dan grafik statistik lanjutan masih bisa dikembangkan sebagai tahap berikutnya.
