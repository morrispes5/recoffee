# PROGRESS RE:coffee

Log per milestone (PRD aturan 9). Centang DoD hanya bila sudah diverifikasi.

## Status singkat

| Milestone                          | Status                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| M0 Perencanaan dan dokumen MPPL    | Belum (dokumen `docs/mppl/*` dan diagram draw.io belum dibuat) |
| M1 Setup project dan design system | **Selesai (21 Nov 2026)**, kecuali tugas 10 (GitHub + Vercel)  |
| M2 Frontend pelanggan (mock)       | Berikutnya                                                     |
| M3–M8                              | Belum                                                          |

---

## M1 — Setup project dan design system (21 Nov 2026)

### Yang selesai

1. Project Vite + React + TypeScript di root repo (PRD dipindah ke `docs/REcoffeePrd.md` sesuai struktur bagian 17).
2. Dependensi bagian 11 terpasang; TypeScript `strict` + `noUncheckedIndexedAccess`, ESLint (typescript-eslint `strict`, react-hooks, react-refresh), Prettier.
3. Tailwind v4 dengan token di `src/styles/index.css` (`@theme`): 8 warna, 2 font, 6 ukuran teks, radius `ui`/`full`, shadow dimatikan, lebar konten, animasi `uap`. Palet/radius/shadow bawaan Tailwind sengaja di-_reset_ agar desain tidak keluar dari token.
4. Font self-host via `@fontsource/gloock` dan `@fontsource-variable/plus-jakarta-sans`.
5. `Logo` (wordmark, titik dua = dua biji kopi blirik), 8 ikon SVG tulis tangan di `src/components/brand/icons/` (+ `IkonKategori` pemetaan kategori → ikon), `public/favicon.svg`.
6. Komponen `src/components/ui/`: `Button` (primary/secondary/ghost/danger, disabled, loading), `IconButton` 44 px, `Badge`, `Dialog` dan `Sheet` (elemen `<dialog>` native), `TextField`, `TextArea` (penghitung karakter), `Select`, `Switch` (role switch + teks status), `InlineMessage`, `Spinner`, `Skeleton`.
7. Router (`src/app/router.tsx`) dengan semua route PRD 16.1; halaman berisi judul. Beranda `/` sudah sesuai 16.2, `/meja/:nomor` sudah memvalidasi nomor 1–28 (FR-01).
8. `/dev/ui` (hanya mode dev, lewat `import.meta.env.DEV` + lazy import; sudah dicek tidak ada di `dist/`).
9. `docs/design-system.md` (salinan bagian 15 + tabel pemetaan token ke kelas Tailwind).
10. Util awal: `lib/format.ts` (`formatRupiah`, `formatJam`), `lib/meja.ts` (`parseNomorMeja`, `TOTAL_MEJA`), `lib/cn.ts`, `types/domain.ts` (bagian 14.1), `lib/queryClient.ts`. File pendukung: `.env.example`, `vercel.json`, `.gitignore` (+ `.env`).

### DoD

- [x] `npm run dev`, `npm run build`, `npm run lint` lolos tanpa error.
- [x] Semua komponen UI tampil di `/dev/ui` dengan state hover, focus, disabled (dicek di browser; dialog, sheet, Escape, kunci scroll berjalan).
- [x] Ikon dan logo tampil tajam di 16 px dan 48 px (favicon juga dicek di 16/32/48 px).
- [x] Tidak ada library di luar daftar (lihat catatan `jsdom` di bawah).

Tambahan: `npm run test` lulus (19 tes: `format`, `meja`, `Button`, `Switch`, `TextField`). Bundle JS awal 109,5 KB gzip (batas NFR-01: 250 KB).

### Belum dikerjakan dari M1

- Tugas 10: buat repo GitHub, push, dan hubungkan ke Vercel. Butuh akun pemilik; menunggu persetujuan.

### Keputusan dan catatan

- **TypeScript 6.0.3, bukan 7.x.** Template Vite terbaru memakai TS 7, tetapi `typescript-eslint` 8.73 baru mendukung `< 6.1`. Diturunkan ke 6.0 agar ESLint (wajib di bagian 11) bisa jalan.
- **ESLint menggantikan oxlint** bawaan template Vite terbaru, karena PRD bagian 11 menyebut ESLint + Prettier.
- **`jsdom`** dipasang sebagai environment Vitest; dibutuhkan oleh React Testing Library (bagian dari paket testing yang sudah disetujui, bukan library runtime).
- Helper kelas (`buttonClass`, `controlClass`) dipisah ke `buttonStyles.ts` / `fieldStyles.ts` agar aturan react-refresh lolos.
- Radius hanya `rounded-ui` (6 px) dan `rounded-full`; `Sheet` memakai sudut atas 6 px.
- `AdminLayout` baru berisi logo; navigasi Denah/Antrian/Menu + email + Keluar dikerjakan di M3. Guard `RequireAdmin` di M5.

### Versi terpasang

| Paket                           | Versi   |
| ------------------------------- | ------- |
| Node.js                         | 22.23.2 |
| vite                            | 8.3.x   |
| react / react-dom               | 19.3.x  |
| react-router                    | 8.5.x   |
| @tanstack/react-query           | 5.108.x |
| tailwindcss / @tailwindcss/vite | 4.3.x   |
| @phosphor-icons/react           | 2.1.x   |
| zod                             | 4.6.x   |
| typescript                      | 6.0.3   |
| eslint                          | 10.15.x |
| vitest                          | 5.1.x   |

---

## Usulan (di luar scope, belum dikerjakan)

_Belum ada._
