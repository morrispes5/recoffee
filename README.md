# RE:coffee

Sistem pemesanan kopi berbasis meja (open bill) — proyek UAS Manajemen Proyek Perangkat Lunak.

- PRD (sumber kebenaran): [`docs/REcoffeePrd.md`](docs/REcoffeePrd.md)
- Progres per milestone: [`docs/PROGRESS.md`](docs/PROGRESS.md)
- Design system: [`docs/design-system.md`](docs/design-system.md)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173  (katalog komponen: /dev/ui)
npm run build
npm run lint
npm run test
```

## Mencoba alur pesanan di localhost

Isi `.env.local` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key project `recoffee`), lalu `npm run dev`.

- **Pelanggan:** buka `http://localhost:5173`, ketik nomor meja (1–28) di kotak "Duduk di meja berapa?", atau langsung `http://localhost:5173/meja/5`. Hasilnya sama dengan scan QR di meja.
- **Kasir:** buka `http://localhost:5173/admin` di tab/browser lain dan masuk dengan Google memakai email yang terdaftar di tabel `admin`.
- Selama aplikasi Google OAuth berstatus _Testing_, hanya akun yang terdaftar sebagai test user (Google Cloud → Google Auth Platform → Audience) yang bisa login.

Stack: Vite, React, TypeScript (strict), React Router, TanStack Query, Tailwind CSS v4, Phosphor Icons, Zod, Supabase (mulai M4), Vitest.
