# PROGRESS RE:coffee

Log per milestone (PRD aturan 9). Centang DoD hanya bila sudah diverifikasi.

## Status singkat

| Milestone                          | Status                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| M0 Perencanaan dan dokumen MPPL    | Belum (dokumen `docs/mppl/*` dan diagram draw.io belum dibuat) |
| M1 Setup project dan design system | **Selesai (21 Nov 2026)**, kecuali tugas 10 (GitHub + Vercel)  |
| M2 Frontend pelanggan (mock)       | **Selesai (21 Nov 2026)**                                      |
| M3 Frontend admin (mock)           | **Selesai (21 Nov 2026)**                                      |
| M4 Backend Supabase                | Berikutnya (butuh slot project Supabase dari pemilik akun)     |
| M5–M8                              | Belum                                                          |

---

## M3 — Frontend admin dengan data mock (21 Nov 2026)

### Yang selesai

1. `AdminLayout`: navigasi Denah / Antrian / Menu (tab aktif ditandai garis blirik + `aria-current`; Denah tetap aktif di detail meja), email admin, tombol Keluar.
2. `AdminLoginPage`: tombol Masuk dengan Google. Mock: langsung masuk sebagai `kasir.demo@gmail.com` lalu ke `/admin`. Cek `is_admin()` dan penolakan akun di M5.
3. `features/admin-meja`: `DenahMeja` + `MejaBulat` (28 meja, grid 7 kolom desktop / 4 kolom tablet dan HP, 3 status dengan teks di bawah lingkaran: "Kosong", total berjalan, "Minta bill, QRIS"), ringkasan teks (meja terisi, minta bill, pesanan belum diantar), keterangan, empty state `KursiPlastik`, polling 5 detik.
4. `DetailMeja`: pesanan dengan nama + nomor HP (`tel:`), harga satuan, catatan, peringatan non-blocking bila ada pesanan belum diantar, total, metode pilihan pelanggan + `Select` untuk mengganti, dialog **Konfirmasi bayar** dan **Batalkan sesi** (danger, terpisah). Setelah sukses kembali ke denah dengan pesan.
5. `features/admin-antrian`: `AntrianList` berupa baris (bukan kartu), urut terlama, filter Semua / Baru / Diproses dengan jumlah, tombol hanya langkah berikutnya (Proses → Antar), pesanan diantar hilang dari daftar. Tata letak baris menyesuaikan ke HP.
6. `features/admin-menu`: `MenuTable` per kategori (switch Tersedia/Habis, Ubah, Arsipkan, toggle tampilkan arsip + Pulihkan), `MenuForm` dalam dialog dengan validasi Zod sama dengan constraint database.
7. Data mock diperluas: menu sekarang disimpan di "database" mock (bisa ditambah/diubah/diarsipkan admin), seed awal meja 3 (minta bill QRIS), 7, 12 (terisi), 21 (minta bill kasir). Perubahan admin langsung terlihat di halaman pelanggan.
8. Halaman admin dimuat terpisah (lazy) agar HP pelanggan tidak mengunduh kode admin.

### DoD

- [x] Semua halaman admin bisa dinavigasi dengan data mock.
- [x] Status meja terbaca tanpa warna (ada teks di bawah lingkaran dan `aria-label` "Meja 12, terisi, total Rp106.000").
- [x] Form menu menampilkan error validasi yang jelas (diuji nama 1 huruf + harga 0).

Diuji di browser (desktop 1280 px, tablet 768 px, HP 360 px): login mock, denah, konfirmasi bayar meja 12 (meja kosong lagi + pesan), batalkan sesi meja 7, antrian Proses → Antar (TC-16), tambah menu valid/tidak valid (TC-20, TC-21), arsipkan Kopi Jahe (hilang di halaman pelanggan, TC-22), tandai Kopi Tubruk habis (TC-06). 64 unit test lulus (+ `menuSchema`).

### Keputusan dan catatan

- "Meja terisi" di ringkasan = sesi `aktif` + `minta_bill` (sesuai PRD 5.3); "minta bill" dihitung terpisah.
- Antrian mengikuti query PRD (semua pesanan `baru`/`diproses`), jadi pesanan dari sesi yang sudah dibayar/dibatalkan tetap muncul sampai ditandai diantar. Bila dirasa membingungkan, bisa ditambah filter sesi terbuka di M5 (dicatat di Usulan).
- Mock admin belum mengecek hak admin; halaman `/admin/*` bisa dibuka tanpa login sampai `RequireAdmin` dipasang di M5.
- Bundle awal pelanggan 151 KB gzip; kode admin 1–4 KB gzip per halaman.

---

## M2 — Frontend pelanggan dengan data mock (21 Nov 2026)

### Yang selesai

1. `src/mocks/`: `menu.ts` (isi sama dengan seed), `tagihan.ts` (kondisi awal: meja 7 sudah ada pesanan Dimas), `db.ts` ("database" pura-pura di localStorage yang meniru aturan function SQL bagian 13: sesi dibuat saat pesanan pertama, harga dari menu, qty 1–20, maks 30 baris, menu habis ditolak, pesanan baru ditolak saat `minta_bill`, minta bill hanya oleh pemesan).
2. Lapisan `api.ts` per fitur (menu, tagihan, auth, profil) dengan delay buatan 300 ms. Signature sudah disiapkan untuk diganti Supabase di M5 (komentar `M5:` di tiap fungsi).
3. `lib/errors.ts` → `toUserMessage()` memetakan kode error tabel 13.5.
4. `features/menu`: `MenuBoard` + `MenuRow` (papan menu warung dengan leader titik, label "Habis" + harga dicoret, tombol + nonaktif di qty 20 atau saat bill diminta).
5. `features/cart`: reducer (`tambah/kurangi/hapus/setCatatan/kosongkan`, batas qty 20 dan 30 baris), context, localStorage per meja dengan validasi data rusak, `CartBar`, `CartSheet`, `KirimSukses` (animasi uap).
6. `features/auth` (mock): `AuthProvider`, `useAuth`, `MasukGoogleButton`, `RequireLogin`, aksi tertunda di sessionStorage (sheet keranjang terbuka lagi setelah kembali dari login).
7. `features/profil`: skema Zod (aturan sama dengan database), `ProfilDialog` mode "lengkapi" (muncul sekali setelah login pertama, lalu kirim pesanan dilanjutkan otomatis) dan mode "ubah".
8. `features/tagihan`: `TagihanView` (nama pemesan tanpa nomor HP, label "(kamu)"), `MintaBillDialog` (QRIS / kasir, bisa ganti metode), `QrisPanel`, layar terima kasih (lewat `sesi_id` terakhir di sessionStorage), empty state, polling 10 detik.
9. Panel **Mock (dev)** di pojok kanan bawah (hanya mode dev): pura-pura login sebagai pelanggan demo / teman semeja, Dimas pesan di meja ini, barista majukan status, kasir konfirmasi bayar, Kopi Tubruk habis/tersedia, jaringan putus/normal, reset data.

### DoD

- [x] Alur pesan → (login mock) → isi data diri → tagihan → minta bill dapat diklik penuh dengan data mock (diuji di browser sampai layar terima kasih).
- [x] Validasi nama dan nomor HP menampilkan pesan error yang jelas.
- [x] Tampilan rapi di 360 px dan 480 px.
- [x] Keranjang bertahan setelah refresh, terpisah per meja.
- [x] Unit test `cartReducer` dan `format.ts` lulus (total 52 tes: + `errors`, `profilSchema`, `meja`, komponen UI).

Skenario black box yang sudah dicoba manual dengan mock: TC-01, 02, 03, 04, 06, 07, 08 (sisi pelanggan), 10 (via panel mock), 11, 12, 17 (sisi pelanggan), 25, 26, 27, 28, 29. Uji ulang dengan data asli di M5–M6.

### Keputusan dan catatan

- **Leader titik papan menu** memakai `ampas` 50% alih-alih `garis` (#E4E2DE). Titik 1 px warna `garis` di latar putih nyaris tidak terlihat; dengan `ampas/50` leader tetap halus tapi terbaca. Perubahan kecil dari PRD 15.5, bisa dikembalikan bila dosen/PRD mewajibkan.
- **`public/qris.png` belum ada.** File QRIS yang dipotong (tanpa nama, alamat, NMID) perlu ditaruh pelaksana. Sampai itu, panel QRIS menampilkan kotak penanda, bukan QR palsu.
- Login mock: "Masuk dengan Google" langsung login sebagai `pelanggan.demo@gmail.com` (tanpa redirect). Alur redirect asli + aksi tertunda sudah disiapkan untuk M5.
- Dialog data diri muncul untuk semua user login yang belum punya profil saat berada di halaman meja; "Nanti saja" menunda sampai tombol Kirim ditekan lagi.
- Bundle JS awal 150,8 KB gzip (batas 250 KB). Data mock masih ikut build sampai M5 menggantinya; panel Mock dan `/dev/ui` tidak ikut build produksi.

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

- Antrian admin hanya menampilkan pesanan dari sesi yang masih terbuka (`aktif`/`minta_bill`), agar pesanan dari sesi yang dibatalkan tidak menggantung. Perlu keputusan pelaksana sebelum M5.
