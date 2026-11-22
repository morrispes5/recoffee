# PROGRESS RE:coffee

Log per milestone (PRD aturan 9). Centang DoD hanya bila sudah diverifikasi.

## Status singkat

| Milestone                            | Status                                                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| M0 Perencanaan dan dokumen MPPL      | **Sebagian**: ERD + LRS selesai (`docs/mppl/05-erd-lrs.md`); dokumen lain belum                                                           |
| M1 Setup project dan design system   | **Selesai (21 Nov 2026)**, kecuali tugas 10 (GitHub + Vercel)                                                                             |
| M2 Frontend pelanggan (mock)         | **Selesai (21 Nov 2026)**                                                                                                                 |
| M3 Frontend admin (mock)             | **Selesai (21 Nov 2026)**                                                                                                                 |
| M4 Backend Supabase                  | **Selesai (22 Nov 2026)**: database, RLS, dan login Google (mode Testing)                                                                 |
| Revisi tampilan (permintaan pemilik) | **Selesai (21 Nov 2026)**                                                                                                                 |
| M5 Integrasi frontend ↔ Supabase     | **Kode terintegrasi; login Google admin berhasil (22 Nov 2026)**. Uji dua akun belum                                                      |
| Dasbor admin + animasi (pemilik)     | **Selesai (22 Nov 2026)**                                                                                                                 |
| Landing page nomor meja (pemilik)    | **Selesai (22 Nov 2026)**                                                                                                                 |
| Menu kafe, alert, animasi (pemilik)  | **Selesai (22 Nov 2026)**                                                                                                                 |
| M6 Testing                           | **Sebagian (22 Nov 2026)**: uji otomatis dan black box selesai; UAT dan 2 kasus lagi menunggu pemilik                                     |
| M7 Deployment                        | **Sebagian (22 Nov 2026)**: produksi aktif di https://recoffee-ten.vercel.app; uji login Google di produksi dan cetak QR menunggu pemilik |
| M8                                   | Belum                                                                                                                                     |

---

## M7 — Deployment (22 Nov 2026)

Panduan operasional dan pasang ulang dari nol: `docs/serah-terima.md`.

### Yang selesai

- **Repo GitHub privat** `morrispes5/recoffee` (riwayat commit ikut apa adanya). Sebelum push, file yang dilacak dan seluruh riwayat dipindai: tidak ada kunci rahasia (hanya pengecekan awalan `sb_publishable_` di `env.ts`).
- **Vercel:** project `recoffee` tersambung ke repo, jadi tiap push ke `main` otomatis deploy. Preset Vite, rewrite SPA dari `vercel.json`, dua ENV (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) di Production dan Preview. **URL produksi: https://recoffee-ten.vercel.app** (`recoffee.vercel.app` sudah dipakai orang lain).
- **Supabase Auth:** Site URL diubah ke URL produksi; Redirect URLs berisi `http://localhost:5173/**` dan `https://recoffee-ten.vercel.app/**`. Google Cloud tidak perlu diubah karena callback menuju Supabase.
- **Skrip QR** `scripts/generate-qr.mjs <alamat>`: 28 QR SVG di `public/qr-meja/` plus halaman cetak `/qr-meja/cetak.html` (paket `qrcode`, devDependency). Menolak alamat tanpa https kecuali localhost. Sudah dijalankan untuk URL produksi.
- **Keep-alive:** `.github/workflows/keep-alive.yml` membaca satu baris tabel `meja` tiap 3 hari agar project Supabase gratis tidak di-pause. `SUPABASE_URL` dan `SUPABASE_ANON_KEY` ada di GitHub Secrets.
- **Panduan serah terima** (`docs/serah-terima.md`): peta akun, checklist H-1 sebelum demo, SQL pembersih data uji, mengganti alamat, dan setup dari nol.

### Pemeriksaan di produksi

- HTTPS aktif (HSTS), `/`, `/meja/18`, `/meja/18/tagihan`, `/admin/antrian`, dan `/admin/masuk` semuanya 200 dan tidak ada 404.
- Browser tanpa sesi login: `/meja/18/tagihan` dibuka langsung menampilkan halaman tagihan (TC-24 lulus); `/meja/18` memuat 22 menu dari Supabase; `/admin/antrian` dialihkan ke `/admin/masuk`; konsol tanpa error.
- Ke-28 QR didekode ulang dengan pembaca QR (`jsqr`, dijalankan di luar repo): semuanya berisi `https://recoffee-ten.vercel.app/meja/N` yang sesuai nomor mejanya. Halaman `/qr-meja/cetak.html` di produksi memuat 28 kartu berlabel "RE:coffee — Meja N".
- Push ke `main` memicu deploy produksi otomatis (status Ready). Workflow `keep-alive` dijalankan manual sekali dan hijau, jadi rahasia GitHub dan kunci Supabase benar.
- Alur login Google dari domain produksi sampai ke pemilih akun Google dengan `redirect_to` ke URL produksi dan callback ke Supabase. Memilih akun adalah langkah pemilik.

### Keputusan dan catatan

- Atas keputusan pemilik, semua infrastruktur tetap di akun pemilik dan Nisa memakai akun Google pemilik untuk masuk saat demo. Verifikasi 2 langkah Google bisa meminta HP pemilik pada login dari perangkat baru; uji dari perangkat presentasi jauh sebelum hari H.
- `vercel link` menulis `VERCEL_OIDC_TOKEN` ke `.env.local`; baris itu langsung dihapus lagi. `.vercel` ditambahkan ke `.gitignore`.
- `supabase/seed.sql` masih berisi email admin pemilik; diganti saat setup di akun lain (lihat panduan serah terima).

### Belum selesai

- Login Google di domain produksi dibuktikan sampai selesai (butuh pemilik memilih akun di pemilih Google).
- `public/qris.png` belum ada (menutup TC-11 dan B-03).
- Cetak minimal 3 QR (meja 1, 18, 27) dan pindai satu dengan kamera HP.

### DoD

- [x] URL produksi bisa diakses via HTTPS.
- [x] Refresh di `/meja/18` dan `/admin/antrian` tidak 404. (Dibuka langsung: halaman tampil; `/admin/antrian` dialihkan ke login karena belum masuk.)
- [ ] Login Google berjalan di domain produksi. (Sampai pemilih akun; menunggu pemilik memilih akun.)
- [ ] 28 QR tergenerate mengarah ke domain produksi; minimal 3 dicetak untuk demo. (28 QR sudah dibuat; pencetakan menunggu pemilik.)

---

## M6 — Testing (22 Nov 2026)

Laporan lengkap: `docs/mppl/10-pengujian.md` (hasil per kasus, BVA, bukti gambar di `docs/mppl/bukti/`). Persiapan UAT: `docs/mppl/11-uat.md`.

### Yang selesai

- **Uji otomatis:** 93 tes lulus (88 sebelumnya + 5 aksesibilitas). Paket baru `axe-core` (devDependency) dipakai di `src/test/a11y.test.tsx` untuk memeriksa WCAG 2.1 A/AA pada form beranda, komponen form, dialog data diri, dan form menu admin, termasuk satu kontrol negatif agar jelas axe benar-benar mendeteksi pelanggaran.
- **Uji database:** `supabase/tests/aturan_bisnis.sql` (baru) menyimulasikan tiga akun pelanggan dan admin dengan klaim JWT: 39 pemeriksaan `[OK]`, 0 `[GAGAL]`, termasuk batas qty 0/1/20/21. `rls_check.sql` (4 kelompok, 9 pemeriksaan) lulus. Kedua skrip membatalkan perubahannya sendiri.
- **Black box (32 kasus PRD 19.3):** 26 lulus lewat UI (TC-24 lulus di produksi pada M7), 4 lulus lewat SQL (TC-10, 14, 30, 31: butuh akun Google kedua untuk versi UI), 2 sebagian (TC-11: gambar QRIS belum ada; TC-26: bagian setelah login belum diuji).
- **Aksesibilitas dasar:** kontras semua pasangan teks lulus AA; label form lengkap (42 elemen di halaman pelanggan, 80 di menu admin); keyboard di dialog admin logis (Tab, Esc, fokus kembali ke pemicu); axe 0 pelanggaran.

### Bug yang ditemukan dan diperbaiki

| ID   | Temuan                                                                                                                                    | Perbaikan                                                                                                                                                                          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B-01 | Pesanan dari sesi yang **dibatalkan** tetap tampil di antrian barista dan ikut terhitung di "Pesanan hari ini" dan "Menu terlaris" dasbor | `fetchAntrian` dan `fetchRingkasanHariIni` mengabaikan sesi berstatus `batal` (`admin-antrian/api.ts`, `admin-dashboard/api.ts`). Dicek di admin: antrian 3 menjadi 2 pesanan baru |
| B-02 | Batas kolom input/select/textarea dan sakelar mati memakai `garis` (1,29:1), di bawah 3:1 (WCAG 1.4.11). Placeholder 2,9:1                | Token baru `batas` `#8F8379` (3,69:1) di `index.css`, dipakai `fieldStyles.ts` dan `Switch.tsx`. Placeholder memakai `ampas` penuh (5,31:1)                                        |

### Belum selesai (butuh pemilik)

- `public/qris.png` (foto QRIS toko dipotong tanpa NMID dan alamat) untuk menutup TC-11 dan B-03.
- Akun Google kedua dan ketiga sebagai Test user untuk versi UI TC-10, 14, 30, 31.
- Mencoba TC-26 sekali: isi keranjang saat keluar, masuk Google, cek keranjang masih utuh.
- Sesi UAT dengan 3 sampai 5 teman memakai `docs/mppl/11-uat.md`; hasilnya diisi di bagian 6 dan 7 dokumen itu.

### DoD

- [x] `npm run test` lulus (93 tes). Lint dan build bersih.
- [ ] 100% kasus black box prioritas tinggi lulus. (21 dari 23 lulus; TC-11 dan TC-26 sebagian.)
- [ ] Hasil UAT terdokumentasi. (Panduan dan formulir siap; sesi belum dijalankan.)

### Data uji

Pengujian sempat meninggalkan data uji di Supabase (4 sesi meja 18 sampai 21, 5 pesanan, 6 item, dan menu uji "Menu Uji Valid"). **Dibersihkan 22 Nov 2026** atas persetujuan pemilik, urutan hapus `item_pesanan`, `pesanan`, `sesi_meja`, lalu menu uji yang tidak dipakai pesanan mana pun. Hasil pemeriksaan: 0 item, 0 pesanan, 0 sesi; 22 menu aktif (semua tersedia) dan 12 menu arsip; harga Es Kopi Susu Aren Rp24.000; 28 meja, 1 admin, dan 1 profil ("Uji Kasir") tetap ada. Bersihkan lagi dengan cara yang sama setelah UAT atau uji coba berikutnya, sebelum demo.

---

## Konteks proyek dan revisi klien kedua (22 Nov 2026)

**Konteks yang ditegaskan pemilik:** ini tugas kuliah (PPL/MPPL) yang hanya dipresentasikan ke dosen. Tidak ada pengguna sungguhan, dan kalaupun di-hosting tidak ada yang memakainya. Prioritasnya tampilan, interaksi, dan dokumentasi, bukan hardening produksi. Implikasi:

- Aplikasi Google OAuth cukup tetap berstatus **Testing**. Daftarkan akun dosen/penguji dan teman UAT sebagai _test user_ (batas 100). Publish ke _In production_ (yang mewajibkan halaman beranda dan privacy policy di domain sendiri) tidak wajib untuk demo.
- Data uji di database (dua sesi selesai atas nama "Uji Kasir" di meja 5 dan 12, total Rp162.000) **sudah dibersihkan 22 Nov 2026** atas persetujuan pemilik: 6 item, 2 pesanan, dan 2 sesi dihapus. Yang dipertahankan: akun Google, profil pelanggan (nama uji "Uji Kasir", bisa diganti lewat "Ubah data diri"), 22 menu aktif + 12 menu arsip, 28 meja, dan admin. Dasbor kembali Rp0, 28 meja kosong. Bersihkan lagi dengan cara yang sama bila nanti ada uji coba baru sebelum demo.

Aturan PRD yang dilonggarkan atas permintaan eksplisit pemilik: daftar library (bagian 11, ditambah tiga paket di bawah), "visual hanya SVG tulis tangan atau Phosphor" tetap dipatuhi (lihat butir 4), animasi minimal (15.9), dan beranda minimal (16.2).

### Yang dikerjakan

1. **Menu kafe kekinian.** Tiga sub agent Haiku meriset menu kafe anak muda Indonesia. Cakupan yang jujur: dari 15 merek target, **9 punya data menu yang jelas** (Kopi Kenangan, Fore, Kopi Nako, Starbucks, Maxx, Point Coffee, Cotti, Tanamera, Djournal), ditambah Kopikina sebagai pengganti pilihan agen. Luckin Indonesia dan Common Grounds tidak ketemu; Janji Jiwa, Tomoro, Anomali, dan Kopi Tuku hanya parsial (beberapa item atau satu harga). Pola yang konsisten di semua sumber: americano dan latte (aren, vanila, karamel, pandan) Rp18–30 ribu, matcha/cokelat/boba/teh susu Rp18–30 ribu, serta croissant, sandwich, croffle, cookies, muffin, dan brownies. Hasilnya **22 menu**: kopi 8, non-kopi 6, makanan 4, camilan 4 (Rp15.000–35.000). Nama dibuat generik, tidak meniru nama produk merek tertentu. Kopi tubruk, pisang goreng, dan kerupuk kaleng sudah tidak ada.
   - Migrasi data `supabase/migrations/0005_menu_kafe_gen_z.sql` diterapkan ke project `recoffee`: 12 menu lama **diarsipkan** (bukan dihapus, BR-09), 22 menu baru dimasukkan. `supabase/seed.sql` tidak lagi memuat menu (jalankan migrasi 0001–0005 lebih dulu, lalu seed).
   - Struktur tabel tidak berubah, jadi ERD dan LRS tidak ikut berubah.
2. **Alert dan notifikasi di semua aksi.** Dua lapis: _toast_ tak-menghalangi (`lib/notify.ts`, library `sonner`) untuk kabar kecil, dan _alert modal_ global (`lib/alertStore.ts` + `components/feedback/AlertHost.tsx`) untuk kabar besar. Alert memakai `<dialog>` native selebar layar, jadi selalu tampil di atas sheet atau dialog lain dan konfeti di dalamnya ikut berada di lapisan atas.
   - Alert modal: nomor meja salah atau kosong (contoh "Meja 50 tidak ada"), pesanan terkirim (cangkir beruap + konfeti), pesanan gagal (dengan tombol "Coba lagi" atau "Cek keranjang" bila menu habis), bill gagal diminta, data diri gagal, login Google gagal atau akun bukan admin, pembayaran gagal, menu gagal disimpan.
   - Toast: data diri tersimpan, bill diminta, berhasil masuk, keluar, status pesanan berubah (diproses atau diantar), menu ditambah, disimpan, ditandai habis, diarsipkan, pembayaran dikonfirmasi (plus konfeti), sesi dibatalkan.
   - Validasi field tetap berupa teks inline di bawah kolom (kebutuhan aksesibilitas), alert menjadi tambahan.
3. **Animasi dan interaksi** (library `motion`, dimuat lazy lewat `LazyMotion` dan komponen `m`, mati otomatis saat `prefers-reduced-motion`): bar keranjang meluncur masuk dan keluar dengan pegas, item keranjang bergeser saat dihapus dan angkanya "pop", baris menu muncul saat digulir ke layar, chip kategori mengikuti scroll (penanda bergeser dengan `layoutId`) dan menggulir halus, pill navigasi admin bergeser antar tab, pesanan antrian masuk dari kiri dan keluar ke kanan sementara yang lain bergeser mulus, meja di denah membal saat disentuh, kartu dasbor terangkat saat hover, halaman memudar saat berpindah, rak kafe di beranda melayang bergantian.
4. **Latar bertema kopi.** Pola tipis berupa biji kopi, cangkir beruap, gelas es, daun matcha, dan croissant, ditulis tangan sebagai SVG (`public/pola-kopi.svg`) dan dipasang lewat utilitas `latar-kopi` di halaman pelanggan, admin, dan login kasir. Pemilik menyarankan "generate di Figma"; saya memilih SVG tulis tangan karena PRD melarang gambar hasil generator AI, hasilnya vektor yang ringan (±2 KB), dan kekuatannya bisa diatur lewat variabel `--opasitas-pola`. Bila dosen atau pemilik tetap menginginkan versi di Figma, pola ini bisa diimpor ke sana.
5. **Ikon kategori baru** (tulis tangan, gaya garis 24 px): `GelasEs` (kopi), `Daun` (non-kopi), `Croissant` (makanan), `Kue` (camilan). `RakWarung` menjadi `RakKafe`. Ikon warung lama (`GelasBlirik`, `KalengKerupuk`, `PiringRoti`, `Teko`) tetap ada di katalog `/dev/ui`.
6. **ERD dan LRS** (bagian dari M0): `docs/mppl/05-erd-lrs.md` memuat ERD notasi Chen, transformasi, LRS, kamus data, aturan constraint, dan pertanyaan presentasi. Diagram dibuat otomatis oleh `scripts/generate-diagrams.mjs` menjadi `erd-chen.drawio`, `erd-chen.svg`, `lrs.drawio`, `lrs.svg` di `docs/mppl/diagram/`. Nama field di LRS sudah dicocokkan dengan `information_schema.columns`: 7 dari 7 record sama persis dengan database.

### Library baru (di luar daftar PRD bagian 11, atas permintaan pemilik)

| Paket             | Versi               | Fungsi                                                    |
| ----------------- | ------------------- | --------------------------------------------------------- |
| `motion`          | ^14.14              | Animasi (komponen `m`, `AnimatePresence`, layout, gestur) |
| `sonner`          | ^2.0.8              | Toast                                                     |
| `canvas-confetti` | ^1.9.4 (+ `@types`) | Konfeti, dimuat hanya saat dibutuhkan                     |

### Pemeriksaan

- 88 tes lulus (tambahan: `alertStore`, alert pada `MasukMejaForm`). Lint, format, tipe, dan build bersih.
- Bundle awal 161 KB gzip (batas 250 KB). Fitur `motion` 34 KB gzip dimuat belakangan; konfeti dimuat saat dipakai.
- Di browser: alert nomor meja 50 muncul dengan ikon bergetar; pesanan nyata (2 Es Kopi Susu Aren, Caramel Macchiato, Butter Croissant, Rp98.000) memunculkan alert "Pesanan terkirim!" dengan cangkir beruap dan konfeti; toast "Pesanan meja 5 diantar" muncul di antrian; konfirmasi bayar meja 12 menaikkan pendapatan hari uji menjadi Rp162.000 (2 transaksi).
- Catatan uji: panel browser bawaan alat uji yang sedang tersembunyi menahan animasi CSS, jadi verifikasi visual memakai Chrome yang terlihat.

### Belum dikerjakan

- M0: dokumen MPPL lain (project charter, use case, dan seterusnya).
- M5: uji dua akun Google berbeda di satu meja dan penolakan akun non-admin (butuh akun kedua sebagai test user).
- M6: tabel black box, UAT, cek aksesibilitas. M7: deploy Vercel dan QR. M8: laporan dan demo.

---

## Landing page dengan input nomor meja atas permintaan pemilik proyek (22 Nov 2026)

Masalah: beranda `/` hanya bertuliskan "Scan QR di meja kamu". Saat aplikasi dibuka lewat alamat utama (misalnya saat presentasi), halaman itu buntu. PRD 16.2 memang meminta beranda sependek itu, karena pelanggan seharusnya datang dari QR yang langsung membuka `/meja/:nomor`.

Perubahan:

1. **Beranda jadi landing page pemesanan**: judul "Kopi enak, pesan langsung dari meja.", kotak **"Duduk di meja berapa?"** dengan input nomor meja, rak warung, **Sekilas menu** (satu menu tersedia per kategori dari database, ditambah harga termurah), langkah **Cara pesan** (langkah 1 jadi "Masukkan nomor meja"), dan link Kasir di pojok atas.
2. `features/meja/MasukMejaForm.tsx`: input angka (keypad numerik di HP, maksimal 2 digit, karakter non-angka dibuang). Validasinya memakai `parseNomorMeja` yang sama dengan route. Nomor di luar 1–28 ditolak dengan pesan "Nomor meja harus angka 1 sampai 28. Lihat angka di mejamu."; yang valid langsung ke `/meja/:nomor`.
3. `lib/mejaTerakhir.ts`: halaman meja menyimpan nomor meja terakhir di `localStorage` (`recoffee:meja-terakhir`), lalu beranda menampilkan tombol **"Lanjut ke meja X"**.
4. QR tidak berubah: tetap berisi `/meja/:nomor` (PRD 20.2), jadi pelanggan yang scan langsung ke menu tanpa melihat landing page.
5. Keputusan: **input manual, bukan dropdown**. Di HP keypad angka langsung muncul, nomor tertulis di meja, dan 28 pilihan dropdown lambat digulir.

Pemeriksaan: 5 tes baru untuk `MasukMejaForm` (nomor valid membuka menu; 0, 29, dan kosong ditolak; hanya angka yang diterima), sehingga total 83 tes lulus. Lint dan tipe bersih. Di browser 375 px, nomor 35 dan 0 ditolak dengan pesan, nomor 7 membuka Meja 7, dan tombol "Lanjut ke meja 5" tampil setelah meja 5 pernah dibuka.

Dokumen ikut diperbarui: `docs/design-system.md` (tabel revisi atas permintaan pemilik) dan `README.md` (cara mencoba alur pesanan di localhost).

---

## Dasbor admin dan animasi atas permintaan pemilik proyek (22 Nov 2026)

Pemilik menilai admin "terlalu minimalis dan hambar". PRD 16.6 dan 15.9 sengaja meminta ringkasan berupa teks biasa, tanpa kartu statistik, tanpa animasi selain uap, dan tanpa efek hover. Atas permintaan pemilik, aturan itu dilonggarkan. Palet, font, larangan gradien, foto, dan gambar AI tetap berlaku.

1. **Dasbor kasir di `/admin`**:
   - Empat kartu dengan angka berjalan: pendapatan hari ini (WIB, dari sesi `selesai` hari ini, dipecah QRIS/kasir), tagihan berjalan, pesanan menunggu (link ke antrian), dan minta bill (garis lampu bila ada).
   - Panel "Perlu ditagih": meja yang minta bill, yang paling lama menunggu di atas, dengan lama tunggu.
   - Panel "Terlaris hari ini": lima menu teratas berupa batang.
   - Denah 28 meja di dalam panel. Meja minta bill berdenyut.
   - Data diambil dari tabel yang sudah bisa dibaca admin lewat RLS M4, jadi tidak ada function atau migrasi baru. Ringkasan diperbarui tiap 15 detik dan ikut diinvalidasi setelah konfirmasi bayar.
2. **Kerangka admin**: latar `tegel` dengan panel putih, header menempel, navigasi berikon (Dasbor, Antrian, Menu), badge jumlah pesanan baru di tab Antrian, indikator Live, dan inisial akun.
3. **Kelola menu**: ringkasan (tampil, habis, diarsipkan), tombol Tambah menu di bar atas, dan setiap kategori di panel sendiri. CRUD-nya sama seperti M3.
4. **Antrian dan detail meja**: dibungkus panel putih. Pesanan baru ditandai garis kiri blirik.
5. **Animasi** (semua mati lewat `prefers-reduced-motion`): `muncul` (fade dan naik, berurutan), `naik` (bar keranjang), `pop` (angka keranjang dan badge), `denyut` (meja minta bill), `tumbuh` (batang terlaris), umpan balik tekan di tombol, dan hover di meja.
6. Kode baru: `lib/waktu.ts` (awal hari WIB, lama tunggu, tanggal panjang), `lib/useCountUp.ts`, `features/admin-dashboard/*`, `components/ui/Panel.tsx`. Ada 11 tes baru (`waktu`, `rangkumTerlaris`), jadi total 78 tes lulus. Lint dan build lolos. Bundle awal 205 KB gzip; dasbor 6,7 KB gzip dimuat terpisah.

Login Google: Client Secret pertama tidak valid (`invalid_client` di log auth Supabase). Setelah secret baru dibuat, admin `morrispes5@gmail.com` berhasil masuk. Aplikasi Google masih berstatus **Testing**, dengan test user `morrispes5@gmail.com`. Publish ke In production menunggu domain Vercel di M7, karena Google mewajibkan halaman beranda dan privacy policy. Akun pelanggan kedua untuk uji harus ditambahkan sebagai test user.

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

### Uji end-to-end dengan data asli (22 Nov 2026, Chrome laptop, satu akun)

Akun `morrispes5@gmail.com` dipakai sebagai pelanggan sekaligus kasir di meja 5:

1. Dialog **Lengkapi data diri** muncul sebelum memesan (TC-27). Diisi data uji "Uji Kasir" / `081234567890`, bisa diganti lewat "Ubah data diri".
2. Keranjang 2 Kopi Tubruk, 1 Es Kopi Susu, 1 Pisang Goreng, dengan catatan "less sugar": 4 item, Rp64.000. **Kirim pesanan** berhasil ("Pesanan terkirim ke barista.").
3. Dasbor: tagihan berjalan Rp64.000, pesanan menunggu 1, badge Antrian 1, meja 5 hijau, Terlaris terisi.
4. Antrian: Proses, lalu status Diproses dan tombol berubah menjadi Antar (TC-16 sebagian).
5. Tagihan pelanggan: Minta bill → QRIS. Muncul "Bill diminta. Kasir akan segera memproses." dan panel QRIS Rp64.000 (gambar masih penanda karena `public/qris.png` belum ada).
6. Dasbor: meja 5 kuning berdenyut, kartu Minta bill 1, "Perlu ditagih" Rp64.000 QRIS.
7. Detail meja: peringatan "1 pesanan belum diantar". Konfirmasi bayar Rp64.000 lewat QRIS kembali ke dasbor dengan pesan sukses. Pendapatan hari ini Rp64.000 (1 transaksi QRIS) dan meja kosong lagi.
8. Pelanggan melihat "Pembayaran sudah dikonfirmasi. Terima kasih sudah mampir." (TC-17). Tidak ada error di konsol.

Temuan: pesanan yang masih "Diproses" tetap ada di antrian setelah sesinya dibayar, sampai ditandai Antar. Ini sesuai query PRD, dan sudah tercatat di bagian Usulan sebagai keputusan pemilik.

Belum diuji: dua akun Google berbeda di satu meja (TC-10 lewat UI) dan penolakan akun non-admin. Keduanya butuh akun Google kedua yang didaftarkan sebagai test user.

### DoD

- [ ] Alur end-to-end dengan data asli berjalan di HP dan laptop. (Laptop lulus 22 Nov; HP belum.)
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
