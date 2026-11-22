# PROGRESS RE:coffee

Log per milestone (PRD aturan 9). Centang DoD hanya bila sudah diverifikasi.

## Status singkat

| Milestone                            | Status                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------- |
| M0 Perencanaan dan dokumen MPPL      | Belum (dokumen `docs/mppl/*` dan diagram draw.io belum dibuat)         |
| M1 Setup project dan design system   | **Selesai (21 Nov 2026)**, kecuali tugas 10 (GitHub + Vercel)          |
| M2 Frontend pelanggan (mock)         | **Selesai (21 Nov 2026)**                                              |
| M3 Frontend admin (mock)             | **Selesai (21 Nov 2026)**                                              |
| M4 Backend Supabase                  | **Database selesai (21 Nov 2026)**; Google login menunggu setup manual |
| Revisi tampilan (permintaan pemilik) | **Selesai (21 Nov 2026)**                                              |
| M5 Integrasi frontend ↔ Supabase     | **Kode terintegrasi (21 Nov 2026)**. Uji penuh menunggu Google OAuth   |
| M6–M8                                | Belum                                                                  |

---

## M5 — Integrasi frontend ↔ Supabase (21 Nov 2026)

### Yang selesai

- Lapisan API pelanggan dan kasir memakai Supabase. Menu, profil, pesanan, tagihan, denah, antrian, dan kelola menu terhubung ke tabel, view, dan RPC dari M4. Payload pesanan berisi ID menu, jumlah, dan catatan. Database menentukan harga.
- Login Google memakai PKCE. Route kasir menunggu hasil `is_admin()` sebelum menampilkan data. Akun yang ditolak diarahkan ke halaman masuk dan diminta keluar. Setelah pindah akun, cache data yang terkait sesi dibersihkan.
- Tagihan dan menu pelanggan diperbarui setiap 10 detik. Denah, detail meja, dan antrian diperbarui setiap 5 detik. Tombol status antrian memeriksa status terakhir di database sebelum memperbaruinya.
- Keranjang tetap tersimpan per meja selama proses login. Item mock lama atau item yang sudah diarsipkan ditandai tidak tersedia agar bisa dihapus dari keranjang. ID sesi terakhir tetap disimpan untuk tampilan setelah pembayaran dikonfirmasi.
- Panel dan sumber data mock dilepas. Bundle JS awal sekitar 204 KB gzip (batas PRD 250 KB).

### Pemeriksaan

- Build, lint, dan format lolos. Semua 67 tes lulus, termasuk tiga tes akses admin untuk tamu, pelanggan, dan kasir.
- API Supabase mengembalikan 12 menu publik dan 28 meja. Panggilan `is_admin()` dengan peran publik mengembalikan `false`, dan kueri detail kasir serta antrian tidak mengembalikan data sesi/pesanan.
- Browser localhost menampilkan menu asli. Tagihan meminta login, dan tautan langsung ke `/admin/antrian` dialihkan ke halaman masuk admin saat belum ada sesi.
- Review kode M5 (22 Nov 2026): integrasi sesuai PRD M5. Harga tetap dari database, hasil RPC `get_tagihan_meja` divalidasi Zod, query admin tetap dilindungi RLS, tidak ada sisa import `src/mocks`.
- Simulasi aturan bisnis langsung di database (22 Nov 2026), tiga akun pelanggan uji + email admin, dalam satu transaksi yang dibatalkan otomatis (tidak ada data tersisa: 0 user, 0 sesi, 0 pesanan):
  - TC-27 pesan tanpa data diri → `PROFIL_BELUM_LENGKAP`; TC-28/29 profil tidak valid → `PROFIL_TIDAK_VALID`; qty 21 → `QTY_TIDAK_VALID`.
  - TC-10: dua akun di meja 5 masuk ke satu tagihan (2 pesanan, total Rp46.000, nama Rina dan Dimas, `milik_saya` benar, nomor HP tidak ikut terkirim).
  - TC-31: akun yang belum memesan minta bill → `BUKAN_PEMESAN_MEJA`. Pelanggan memanggil `konfirmasi_bayar` → `BUKAN_ADMIN`. Pelanggan ubah status pesanan langsung → 0 baris (RLS).
  - TC-12: pesan saat bill diminta → `TAGIHAN_SEDANG_DIPROSES`.
  - Admin: lompat status baru→diantar → `TRANSISI_STATUS_TIDAK_VALID`; TC-16 baru→diproses→diantar berhasil; TC-17 konfirmasi bayar menutup sesi (`selesai`, QRIS, total_bayar 46000, dikonfirmasi `morrispes5@gmail.com`), meja 5 kembali kosong, pelanggan melihat status terakhir `selesai` dan tagihan aktif `null`.
- Endpoint pengaturan Auth mengembalikan `external.google: false`. Aktifkan provider Google sesuai langkah M4, termasuk redirect localhost. Setelah aktif, uji pesanan sampai pembayaran dengan akun admin dan akun pelanggan di dua browser.

### DoD

- [ ] Alur end-to-end dengan data asli berjalan di HP dan laptop.
- [ ] Waktu pembaruan pelanggan ≤ 10 detik dan admin ≤ 5 detik terukur.
- [ ] Akun Google non-admin ditolak di admin dan bisa memesan dari halaman pelanggan.
- [ ] Pesanan dua akun Google pada satu meja bergabung dan masing-masing nama tampil.
- [ ] Alur end-to-end berjalan tanpa error di konsol.

---

## Revisi tampilan atas permintaan pemilik proyek (21 Nov 2026)

Pemilik menilai tampilan M1–M3 "masih jelek": terlalu polos, beranda hampir kosong, dan di laptop kolom 480 px melayang di halaman putih yang luas. Perbaikan tetap memakai token dan larangan desain PRD 15 (latar putih, tanpa shadow/gradien/foto/gambar AI, hanya ikon garis tulis tangan).

1. **Bingkai pelanggan** (`CustomerLayout`): di layar ≥ 640 px kolom putih 480 px berdiri di atas latar `tegel` dengan border `garis`; footer "Warung kopi, diseduh ulang."; `BottomBar` selebar kolom.
2. **Header menempel** (`CustomerTopBar`, `CustomerHeader`): logo, Tagihan meja, Masuk/Keluar dengan ikon Phosphor.
3. **Beranda** (menyimpang dari PRD 16.2 yang sangat minimal): judul Gloock besar, `RakWarung` (deretan ikon warung di atas bilah papan), bagian "Cara pesan" 3 langkah. Copy hanya menjelaskan fitur yang memang ada.
4. **Halaman meja**: cangkir tubruk beruap di samping nomor meja, strip `LangkahPesan` (Pilih menu, Kirim pesanan, Minta bill), navigasi kategori menempel di bawah header (link jangkar, bukan fitur baru), garis papan 2 px `tubruk` per kategori, ikon kategori blirik, tombol + bergaris blirik (terisi saat item sudah di keranjang).
5. **Bar keranjang**: satu tombol blirik besar "Lihat pesanan" + "3 item, Rp57.000".
6. **Tagihan**: header menempel dengan "Kembali ke menu", judul `display-l`, total di blok `tegel`.
7. **Masuk admin**: kartu di atas `tegel` + `RakWarung`.
8. Beranda dan halaman tagihan ikut di-lazy load: bundle awal 149,5 KB gzip (sebelumnya 151 KB).

Diuji di browser 375 px dan 1280 px; 64 tes, lint, format, dan build lolos.

---

## M4 — Backend Supabase (21 Nov 2026)

### Yang selesai

1. `final project hactiv8` di-pause oleh pemilik akun lewat dashboard. Project baru **`recoffee`** dibuat di organisasi `morrispes5`, region `ap-southeast-1` (Singapore), biaya $0 (free plan). Ref: `yfzdriwrdbacqzkhzzzj`.
2. Migrasi dijalankan berurutan dan disimpan di `supabase/migrations/`: `0001_schema`, `0002_auth_rls`, `0003_functions` (isi sama persis dengan PRD 13.1–13.3), lalu `supabase/seed.sql` (28 meja, 12 menu, admin `morrispes5@gmail.com`).
3. `0004_trigger_search_path`: tambahan kecil dari Supabase security advisor (lint 0011), mengunci `search_path` di `set_updated_at()` dan `cek_transisi_pesanan()`. Tidak mengubah tabel, relasi, maupun aturan.
4. `src/types/database.types.ts` di-generate dari project (dikecualikan dari Prettier karena file hasil generate).
5. `.env.local` berisi `VITE_SUPABASE_URL` + publishable key (di-ignore git, tidak di-commit). `service_role` tidak dipakai.

### Hasil `supabase/tests/rls_check.sql` (role `anon`)

| Pemeriksaan                                                       | Hasil                                |
| ----------------------------------------------------------------- | ------------------------------------ |
| Insert langsung ke `pesanan`                                      | OK, ditolak                          |
| Baca `sesi_meja` / `pelanggan`                                    | OK, 0 baris                          |
| `buat_pesanan`, `get_tagihan_meja`, `minta_bill`, `simpan_profil` | OK, ditolak (insufficient_privilege) |
| `konfirmasi_bayar`, `batalkan_sesi`                               | OK, ditolak                          |
| Baca `menu` dan `meja`                                            | OK, 12 menu dan 28 meja terbaca      |

Catatan: notice `raise notice` tidak dikembalikan oleh tool SQL, jadi saat dijalankan hasil tiap pemeriksaan ditulis ke tabel sementara lalu dibaca; logika pemeriksaannya sama dengan skrip.

### Security advisor

- Peringatan "SECURITY DEFINER bisa dijalankan `authenticated`" (8 fungsi) dan "`is_admin()` bisa dijalankan `anon`" **disengaja** sesuai desain PRD 13.3: fungsi pelanggan memang untuk user login, `is_admin()` dipakai policy RLS. Setiap fungsi admin mengecek `is_admin()` di dalamnya.

### DoD

- [x] Semua tabel, index, trigger, function, view ada.
- [x] Uji RLS: anon gagal insert langsung ke `pesanan`, gagal panggil `konfirmasi_bayar`, gagal baca `sesi_meja`.
- [x] Anon tidak bisa memanggil `buat_pesanan`, `get_tagihan_meja`, `minta_bill`, `simpan_profil`.
- [ ] Login Google admin dan login Google akun lain (sebagai pelanggan) berhasil di localhost. **Menunggu pemilik akun**: tambah redirect URI `https://yfzdriwrdbacqzkhzzzj.supabase.co/auth/v1/callback` di OAuth Client Google, isi Client ID/Secret di Supabase → Authentication → Providers → Google, consent screen "In production", Redirect URLs `http://localhost:5173/**`. Login baru bisa diuji setelah M5 menyambungkan frontend.

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
