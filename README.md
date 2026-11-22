# RE:coffee

Sistem pemesanan kopi berbasis meja (open bill) — proyek UAS Manajemen Proyek Perangkat Lunak.

- PRD (sumber kebenaran): [`docs/REcoffeePrd.md`](docs/REcoffeePrd.md)
- Progres per milestone: [`docs/PROGRESS.md`](docs/PROGRESS.md)
- Operasional dan serah terima: [`docs/serah-terima.md`](docs/serah-terima.md)
- Design system: [`docs/design-system.md`](docs/design-system.md)
- Dokumen MPPL (`docs/mppl/`): [project charter](docs/mppl/01-project-charter.md), [ruang lingkup dan WBS](docs/mppl/02-ruang-lingkup-wbs.md),
  [kebutuhan dan analisis data](docs/mppl/03-kebutuhan-dan-analisis-data.md), [use case](docs/mppl/04-use-case.md),
  [ERD, LRS, dan kamus data](docs/mppl/05-erd-lrs.md), [desain sistem dan antarmuka](docs/mppl/06-desain.md),
  [estimasi dan jadwal](docs/mppl/07-estimasi-jadwal.md), [biaya](docs/mppl/08-biaya.md), [risiko](docs/mppl/09-risiko.md),
  [pengujian](docs/mppl/10-pengujian.md), dan [UAT](docs/mppl/11-uat.md)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173  (katalog komponen: /dev/ui)
npm run build
npm run lint
npm run test
node scripts/generate-diagrams.mjs   # membuat ulang ERD dan LRS di docs/mppl/diagram
node scripts/generate-use-case.mjs   # membuat ulang diagram use case di docs/mppl/diagram
```

## Mencoba alur pesanan di localhost

Isi `.env.local` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key project `recoffee`), lalu `npm run dev`.

- **Pelanggan:** buka `http://localhost:5173`, ketik nomor meja (1–28) di kotak "Duduk di meja berapa?", atau langsung `http://localhost:5173/meja/5`. Hasilnya sama dengan scan QR di meja.
- **Kasir:** buka `http://localhost:5173/admin` di tab/browser lain dan masuk dengan Google memakai email yang terdaftar di tabel `admin`.
- Selama aplikasi Google OAuth berstatus _Testing_, hanya akun yang terdaftar sebagai test user (Google Cloud → Google Auth Platform → Audience) yang bisa login.

## Database

Jalankan migrasi `supabase/migrations/0001` sampai `0005` berurutan, lalu `supabase/seed.sql` (28 meja dan admin). Menu kafe dimasukkan oleh migrasi `0005`. Uji akses anon: `supabase/tests/rls_check.sql`. Uji aturan bisnis dengan akun simulasi: `supabase/tests/aturan_bisnis.sql` (keduanya dijalankan di SQL Editor dan membatalkan perubahannya sendiri).

## Deploy

Produksi: https://recoffee-ten.vercel.app (Vercel, tersambung ke repo GitHub; push ke `main` otomatis deploy). ENV di Vercel: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. QR meja dibuat dengan `node scripts/generate-qr.mjs https://alamat-produksi` lalu cetak `/qr-meja/cetak.html`. Checklist sebelum demo, mengganti alamat, dan pasang ulang dari nol ada di [`docs/serah-terima.md`](docs/serah-terima.md).

## Pengujian

`npm run test` menjalankan 94 tes (unit, komponen, dan aksesibilitas axe-core). Laporan black box lengkap dengan bukti gambar ada di `docs/mppl/10-pengujian.md`; panduan UAT dengan teman di `docs/mppl/11-uat.md`.

Stack: Vite, React, TypeScript (strict), React Router, TanStack Query, Tailwind CSS v4, Phosphor Icons, Zod, Supabase, Vitest. Tambahan atas permintaan pemilik: `motion` (animasi), `sonner` (toast), `canvas-confetti` (konfeti).
