# RE:coffee

Sistem pemesanan kopi berbasis meja (open bill): pelanggan scan QR di meja, pesan dari HP, kasir memproses
pesanan dan pembayaran dari dasbor. Proyek UAS Manajemen Proyek Perangkat Lunak (MPPL). Hanya didemokan ke
dosen; tidak ada pengguna sungguhan. Utamakan tampilan yang rapi dan dokumentasi, bukan hardening produksi.

## Sedang berlangsung: pindah ke akun client

Project sedang dipindahkan dari akun pemilik lama (`morrispes5`) ke akun client. Ikuti
`docs/pindah-ke-client.md` langkah demi langkah. Tanyakan ke pengguna langkah mana yang sudah selesai sebelum
mulai. Langkah yang hanya bisa di dashboard (GitHub, Supabase, Google Cloud, Vercel) dijelaskan ke pengguna
dengan bahasa sederhana; jangan menebak nilai kunci, dan jangan minta pengguna menempel kunci rahasia ke chat.
Setelah pindah selesai, perbarui bagian ini dan `docs/serah-terima.md` bagian 1 (siapa memegang apa).

## Stack

- Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, TanStack Query, Zod, Motion, Sonner.
- Supabase: Postgres, Auth (login Google untuk kasir), RLS. Tidak ada backend sendiri; semua lewat
  `@supabase/supabase-js` dengan publishable/anon key. Jangan pernah memakai kunci `service_role`.
- Hosting Vercel (`vercel.json` me-rewrite semua route ke `index.html`). Push ke `main` = deploy produksi.
- GitHub Actions `keep-alive` menjaga project Supabase gratis tidak di-pause.

## Perintah

```bash
npm install
npm run dev      # http://localhost:5173  (katalog komponen: /dev/ui)
npm run build
npm run lint
npm run test
node scripts/generate-qr.mjs https://alamat-aplikasi   # buat ulang QR meja di public/qr-meja
node scripts/generate-diagrams.mjs                      # ERD dan LRS di docs/mppl/diagram
```

ENV ada di `.env.local` (tidak di-commit): `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Contoh di `.env.example`.

## Struktur

- `src/` kode aplikasi. Halaman pelanggan `/meja/:nomor` (meja 1 sampai 28), kasir `/admin/masuk` lalu `/admin`.
- `supabase/migrations/0001`..`0005` skema, RLS, fungsi, dan menu; `supabase/seed.sql` meja dan admin;
  `supabase/tests/` uji RLS dan aturan bisnis (dijalankan di SQL Editor, membatalkan perubahannya sendiri).
- Kasir yang boleh masuk ditentukan oleh tabel `admin` (email Google huruf kecil).
- `docs/REcoffeePrd.md` PRD, sumber kebenaran. `docs/PROGRESS.md` progres per milestone.
  `docs/serah-terima.md` operasional dan checklist demo. `docs/design-system.md` design system.
  `docs/mppl/` dokumen MPPL. `docs/laporan/` laporan akhir (dibangun dengan `scripts/build-laporan.py`).

## Aturan kerja

- Pengguna menulis bahasa Indonesia santai. Jawab dengan bahasa Indonesia yang jelas dan sederhana; jelaskan
  alasan bila ditanya "kenapa", karena pengguna sedang belajar stack ini untuk presentasi.
- Setiap perubahan perilaku, desain, atau library: perbarui `docs/PROGRESS.md`, `docs/design-system.md`, dan
  `README.md` bila relevan.
- Aturan PRD: tidak ada gambar buatan AI; ilustrasi hanya SVG yang ditulis tangan.
- Jangan commit `.env`, `.env.local`, atau kunci apa pun. Jangan taruh QRIS versi lengkap (berisi NMID dan alamat)
  di `public/`.
- Menghapus data di database produksi (misal membersihkan pesanan uji) hanya setelah pengguna setuju. Urutan hapus:
  `item_pesanan`, `pesanan`, `sesi_meja`.
