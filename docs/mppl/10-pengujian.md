# 10. Pengujian (M6)

Laporan pengujian RE:coffee sesuai PRD bagian 19. Dikerjakan 22 November 2026 terhadap aplikasi
yang berjalan di `localhost:5173` dengan database Supabase sungguhan (proyek `recoffee`).
Semua hasil di bawah adalah hasil yang benar-benar dijalankan; yang belum bisa diuji ditulis
apa adanya di [bagian 7](#7-belum-diuji-dan-alasannya).

## 1. Ringkasan

| Lapisan                  | Alat                                         | Hasil                                                            |
| ------------------------ | -------------------------------------------- | ---------------------------------------------------------------- |
| Unit dan komponen        | Vitest + Testing Library + axe-core          | **93 tes lulus** (13 berkas)                                     |
| Keamanan database (anon) | `supabase/tests/rls_check.sql`               | **9 pemeriksaan lulus**                                          |
| Aturan bisnis database   | `supabase/tests/aturan_bisnis.sql`           | **39 pemeriksaan `[OK]`, 0 `[GAGAL]`**                           |
| Black box lewat aplikasi | Browser (Chrome dan browser bawaan)          | 28 kasus lulus lewat UI, 3 lulus lewat SQL, 1 sebagian (dari 32) |
| Aksesibilitas dasar      | Hitungan kontras, audit label, keyboard, axe | 2 temuan, keduanya sudah diperbaiki                              |
| Build, lint              | `npm run build`, `npm run lint`              | Lolos                                                            |

Kasus prioritas **Tinggi**: 23 kasus. 22 lulus (3 di antaranya hanya lewat SQL karena butuh akun Google
kedua dan ketiga), 1 lulus sebagian (TC-11). Jadi target DoD "100% kasus tinggi lulus"
**belum tercapai penuh**; satu-satunya sisa adalah gambar QRIS dari pemilik (lihat bagian 7).

## 2. Metode

- **Black box** dengan Equivalence Partitioning dan Boundary Value Analysis (PRD 19.1).
- **Simulasi di database**: skrip SQL berperan sebagai akun pelanggan A/B/C dan admin dengan klaim
  JWT (`set local role authenticated` + `set_config('request.jwt.claims', ...)`). Skrip diakhiri
  `raise exception`, sehingga seluruh data uji dibatalkan otomatis dan hasilnya dibaca dari pesan error.
- **Uji lewat aplikasi**: mengikuti langkah di tabel TC pada PRD 19.3, memakai menu kafe yang sekarang
  (nama menu pada PRD seperti "Kopi Tubruk" sudah diganti, lihat `docs/PROGRESS.md`).
- Keterangan status:
  - **Lulus (UI)**: dijalankan di aplikasi sungguhan dan sesuai harapan.
  - **Lulus (SQL)**: terbukti di database dengan akun simulasi, tampilan UI belum dicoba.
  - **Sebagian**: sebagian langkah terbukti, sisanya butuh sesuatu dari luar (tertulis di catatan).

## 3. Uji otomatis

### 3.1 Unit dan komponen (`npm run test`, 93 tes)

| Berkas                                   | Yang diuji                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `lib/format.test.ts`                     | `formatRupiah`                                                                                               |
| `lib/meja.test.ts`                       | `parseNomorMeja` (0, 29, huruf, desimal, kosong)                                                             |
| `lib/errors.test.ts`                     | Kode error database menjadi pesan UI, kode tak dikenal menjadi pesan umum                                    |
| `lib/waktu.test.ts`                      | Awal hari WIB                                                                                                |
| `lib/alertStore.test.tsx`                | Antrian dan penutupan alert global                                                                           |
| `features/cart/cartReducer.test.ts`      | Tambah, qty maksimal 20, kurangi sampai hilang, kosongkan                                                    |
| `features/profil/profilSchema.test.ts`   | Nama 1/2/50/51 huruf, format nomor HP                                                                        |
| `features/admin-menu/menuSchema.test.ts` | Nama, harga, deskripsi, kategori                                                                             |
| `features/admin-dashboard/api.test.ts`   | Peringkat menu terlaris                                                                                      |
| `features/auth/RequireAdmin.test.tsx`    | Tamu, pelanggan, dan kasir pada route admin (mendukung TC-14 dan TC-15)                                      |
| `features/meja/MasukMejaForm.test.tsx`   | Nomor meja 1 sampai 28, alert untuk nomor salah atau kosong                                                  |
| `test/a11y.test.tsx` (baru di M6)        | axe-core WCAG 2.1 A/AA: form beranda, komponen form, dialog data diri, form menu admin, plus kontrol negatif |

### 3.2 Database

`supabase/tests/rls_check.sql`: 4 kelompok, 9 pemeriksaan. Pengunjung tanpa login tidak bisa insert
ke `pesanan`, tidak bisa membaca `sesi_meja` dan `pelanggan`, tidak bisa memanggil 6 fungsi pelanggan
dan admin, tetapi tetap bisa membaca `menu` dan `meja` (hasil lengkap di `docs/PROGRESS.md`, bagian M4).

`supabase/tests/aturan_bisnis.sql` (baru di M6): 39 pemeriksaan `[OK]`, mencakup TC-08 sampai TC-12,
TC-14, TC-16 sampai TC-23, dan TC-27 sampai TC-31. Cara pakai: jalankan seluruh isi berkas di SQL Editor
Supabase; hasilnya muncul sebagai pesan error `HASIL_UJI` (tanda bahwa semua dibatalkan otomatis).

## 4. Analisis nilai batas (BVA)

| Input        | Nilai uji                                                           | Diharapkan                 | Hasil                                                                                          | Bukti         |
| ------------ | ------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| Qty per menu | 0, 1, 20, 21                                                        | 0 dan 21 ditolak           | Sesuai. `QTY_TIDAK_VALID` untuk 0 dan 21; UI berhenti di 20                                    | SQL, UI, unit |
| Nomor meja   | 0, 1, 28, 29                                                        | 0 dan 29 "tidak ditemukan" | Sesuai. 0 dan 29 menampilkan "Meja tidak ditemukan"                                            | UI, unit      |
| Panjang nama | 1, 2, 50, 51                                                        | 1 dan 51 ditolak           | Sesuai. 2 dan 50 tersimpan ("Data diri tersimpan")                                             | SQL, UI, unit |
| Nomor HP     | `081234567890`, `6281234567890`, `+6281234567890`, `0812-3456-7890` | diterima                   | Sesuai (`[OK]` untuk keempatnya)                                                               | SQL, unit     |
| Nomor HP     | `0712345678`, `08123`, `abc`                                        | ditolak                    | Sesuai. UI: "Nomor HP belum benar. Contoh: 081234567890."                                      | SQL, UI, unit |
| Harga menu   | 0, 1.000.001                                                        | ditolak                    | Sesuai. UI menolak dengan pesan validasi, DB menolak lewat check constraint, 0 baris tersimpan | SQL, UI, unit |
| Harga menu   | 18.000                                                              | diterima                   | Sesuai (menu muncul di halaman pelanggan)                                                      | SQL, UI       |

## 5. Hasil black box (PRD 19.3)

Bukti gambar ada di `docs/mppl/bukti/`.

| ID    | Prioritas | Hasil                    | Catatan hasil                                                                                                                                                                                                                                                                                                                                                | Bukti                                                                                              |
| ----- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| TC-01 | Tinggi    | Lulus (UI)               | `/meja/18` menampilkan judul "Meja 18" dan 22 menu.                                                                                                                                                                                                                                                                                                          |                                                                                                    |
| TC-02 | Tinggi    | Lulus (UI)               | `/meja/0`: "Meja tidak ditemukan. Scan ulang QR di meja kamu."                                                                                                                                                                                                                                                                                               |                                                                                                    |
| TC-03 | Tinggi    | Lulus (UI)               | `/meja/29`: pesan yang sama (denah punya 28 meja).                                                                                                                                                                                                                                                                                                           |                                                                                                    |
| TC-04 | Tinggi    | Lulus (UI)               | Es Kopi Susu Aren ditambah: bar keranjang "1 item, Rp24.000".                                                                                                                                                                                                                                                                                                |                                                                                                    |
| TC-05 | Sedang    | Lulus (UI, unit)         | Ditekan sampai qty 20: tombol + nonaktif, "20 item, Rp480.000".                                                                                                                                                                                                                                                                                              |                                                                                                    |
| TC-06 | Tinggi    | Lulus (UI)               | Cappuccino ditandai habis di admin: halaman pelanggan menampilkan "Habis" dan tombol tambah hilang.                                                                                                                                                                                                                                                          |                                                                                                    |
| TC-07 | Sedang    | Lulus (UI, SQL)          | Item sudah di keranjang lalu admin menandai habis: baris berubah "Habis, hapus dulu" dan Kirim nonaktif. Server juga menolak `MENU_TIDAK_TERSEDIA` bila dipaksa kirim.                                                                                                                                                                                       | `tc07-menu-habis-di-keranjang.jpg`                                                                 |
| TC-08 | Tinggi    | Lulus (UI, SQL)          | Pesanan pertama berhasil, meja terisi di denah admin, nama pemesan tampil di antrian.                                                                                                                                                                                                                                                                        | `tc08-kirim-pesanan-pertama.jpg`                                                                   |
| TC-09 | Tinggi    | Lulus (UI, SQL)          | Pesanan kedua masuk sesi yang sama, total bertambah.                                                                                                                                                                                                                                                                                                         | `tc09-pesanan-kedua-satu-sesi.jpg`                                                                 |
| TC-10 | Tinggi    | Lulus (SQL)              | Dua akun di satu meja: satu sesi, nama masing-masing tampil. **UI dua akun belum**: butuh akun Google kedua.                                                                                                                                                                                                                                                 |                                                                                                    |
| TC-11 | Tinggi    | **Sebagian**             | Meja kuning di dasbor dan panel QRIS dengan nominal Rp48.000 tampil. **Gambar QRIS belum ada**: menunggu `public/qris.png` dari pemilik.                                                                                                                                                                                                                     | `tc11-dasbor-meja-minta-bill.jpg`, `tc11-panel-qris.jpg`                                           |
| TC-12 | Tinggi    | Lulus (UI, SQL)          | Setelah bill diminta, halaman menu menampilkan "Bill sudah diminta. Tambah pesanan lewat kasir." dan tombol tambah nonaktif. Server menolak `TAGIHAN_SEDANG_DIPROSES`.                                                                                                                                                                                       | `tc12-bill-sudah-diminta.jpg`                                                                      |
| TC-13 | Tinggi    | Lulus (UI)               | Login Google akun admin terdaftar masuk ke dasbor (dilakukan pemilik, dipakai di seluruh sesi uji).                                                                                                                                                                                                                                                          |                                                                                                    |
| TC-14 | Tinggi    | Lulus (SQL), UI sebagian | Email non-admin: `is_admin()` = false, tidak bisa mengubah menu. UI: akun non-admin yang membuka `/admin` dialihkan ke `/admin/masuk` dan keluar otomatis (header kembali "Masuk"). **Pesan "Akun ini bukan admin" tidak tampil**: temuan B-04, sudah diperbaiki. Pengecekan ulang di produksi menunggu deploy.                                              |                                                                                                    |
| TC-15 | Tinggi    | Lulus (UI, unit)         | Tanpa login, `/admin` dan `/admin/menu` dialihkan ke `/admin/masuk` (dicoba di browser bawaan yang tidak punya sesi).                                                                                                                                                                                                                                        |                                                                                                    |
| TC-16 | Tinggi    | Lulus (UI, SQL)          | Baru, Diproses, Antar. Pelanggan melihat "Diproses" di tagihan, lalu pesanan hilang dari antrian setelah Antar (toast "Pesanan meja 21 diantar").                                                                                                                                                                                                            |                                                                                                    |
| TC-17 | Tinggi    | Lulus (UI, SQL)          | Konfirmasi bayar mengosongkan meja, pelanggan melihat layar terima kasih, total dibekukan.                                                                                                                                                                                                                                                                   | `tc17-detail-meja-konfirmasi.jpg`                                                                  |
| TC-18 | Sedang    | Lulus (UI, SQL)          | Konfirmasi tanpa minta bill: berhasil, metode tersimpan "kasir".                                                                                                                                                                                                                                                                                             |                                                                                                    |
| TC-19 | Sedang    | Lulus (UI, SQL)          | Batalkan sesi: meja kosong, status `batal`, pesanan tetap tercatat. Memunculkan temuan B-01 (sudah diperbaiki).                                                                                                                                                                                                                                              |                                                                                                    |
| TC-20 | Tinggi    | Lulus (UI, SQL)          | Menu baru (harga 18.000) muncul di halaman pelanggan.                                                                                                                                                                                                                                                                                                        |                                                                                                    |
| TC-21 | Sedang    | Lulus (UI, SQL)          | Harga 0: pesan "Harga harus angka 1 sampai 1.000.000, tanpa titik.", dialog tetap terbuka, 0 baris tersimpan.                                                                                                                                                                                                                                                |                                                                                                    |
| TC-22 | Sedang    | Lulus (UI, SQL)          | Menu diarsipkan: hilang dari halaman pelanggan (UI). Nama tetap muncul di tagihan lama karena nama disimpan sebagai snapshot (dibuktikan lewat SQL).                                                                                                                                                                                                         |                                                                                                    |
| TC-23 | Tinggi    | Lulus (UI, SQL)          | Harga naik Rp5.000: tagihan lama tetap harga lama (harga disimpan sebagai snapshot). Harga dikembalikan ke Rp24.000.                                                                                                                                                                                                                                         |                                                                                                    |
| TC-24 | Tinggi    | Lulus (UI)               | Diuji di produksi setelah deploy M7 (22 Nov): `https://recoffee-ten.vercel.app/meja/18/tagihan` dibuka langsung di tab baru (setara refresh) dan tampil benar, bukan 404. `/admin/antrian` dibuka langsung dan dialihkan ke `/admin/masuk`. 22 menu termuat dari Supabase, konsol tanpa error.                                                               |                                                                                                    |
| TC-25 | Sedang    | Lulus (UI)               | Koneksi diputus lewat penggantian `fetch` yang selalu gagal (bukan mematikan Wi-Fi): alert "Pesanan gagal dikirim. Gagal terhubung. Cek koneksi lalu coba lagi." dan keranjang tetap utuh.                                                                                                                                                                   | `tc25-koneksi-terputus.jpg`                                                                        |
| TC-26 | Tinggi    | Lulus (UI)               | Belum login, keranjang 2 item (Rp48.000): tombol Kirim diganti "Masuk dengan Google untuk pesan". Setelah login Google kamu kembali ke `/meja/5` dan keranjang utuh. Kirim pesanan meminta nama dan nomor HP sekali (akun baru); setelah disimpan muncul "Pesanan terkirim!" dan database mencatat 1 pesanan baru (2 item, Rp48.000) pada sesi aktif meja 5. | `tc26-kirim-tanpa-login.jpg`, `tc26-keranjang-utuh-setelah-login.jpg`, `tc26-pesanan-terkirim.jpg` |
| TC-27 | Tinggi    | Lulus (UI, SQL)          | Profil dikosongkan lewat simulasi respons kosong: dialog "Lengkapi data diri" muncul dan tidak ada pesanan terkirim (jumlah pesanan di database tetap). SQL: `PROFIL_BELUM_LENGKAP`.                                                                                                                                                                         | `tc27-lengkapi-data-diri.jpg`                                                                      |
| TC-28 | Tinggi    | Lulus (UI, SQL, unit)    | `0712345678`: "Nomor HP belum benar. Contoh: 081234567890." dialog tetap terbuka.                                                                                                                                                                                                                                                                            | `tc28-tc29-validasi-data-diri.jpg`                                                                 |
| TC-29 | Sedang    | Lulus (UI, SQL, unit)    | Nama 1 dan 51 huruf ditolak ("Nama harus 2 sampai 50 huruf."), 2 dan 50 huruf tersimpan.                                                                                                                                                                                                                                                                     | `tc28-tc29-validasi-data-diri.jpg`                                                                 |
| TC-30 | Tinggi    | Lulus (SQL)              | Akun yang belum memesan minta bill: `BUKAN_PEMESAN_MEJA`. UI belum, butuh akun kedua.                                                                                                                                                                                                                                                                        |                                                                                                    |
| TC-31 | Tinggi    | Lulus (SQL, UI)          | Nama pemesan lain tampil, nomor HP tidak ikut terkirim ke pelanggan lain. UI: akun yang bukan pemesan membuka tagihan meja yang sedang terisi dan melihat nama pemesan lain, daftar item, dan total, tanpa nomor HP di halaman. Isi respons RPC diperiksa lewat SQL.                                                                                         |                                                                                                    |
| TC-32 | Rendah    | Lulus (UI)               | Nama diubah menjadi "Uji Kasir Baru": sapaan di header dan semua baris antrian ikut berubah, database menyimpan.                                                                                                                                                                                                                                             |                                                                                                    |

Rekap: Lulus (UI) 28 kasus, Lulus (SQL) 3 kasus (TC-10, 14, 30), Sebagian 1 kasus (TC-11).

## 6. Temuan dan perbaikan

| ID   | Temuan                                                                                                                                                                                                                                                                                                                                                | Dampak | Perbaikan                                                                                                                                                  | Status                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| B-01 | Pesanan dari sesi yang **dibatalkan** tetap muncul di antrian barista. Dasbor juga menghitungnya pada "Pesanan hari ini" dan "Menu terlaris". Ditemukan saat TC-19: pesanan meja 20 tetap "Baru" setelah sesinya batal.                                                                                                                               | Sedang | `fetchAntrian` dan `fetchRingkasanHariIni` kini mengabaikan sesi berstatus `batal`. Setelah perbaikan, antrian dan lencana turun dari 3 ke 2 pesanan baru. | Selesai                                       |
| B-02 | Batas kolom input, select, textarea, dan sakelar mati memakai warna `garis` (kontras 1,29:1). WCAG 1.4.11 meminta minimal 3:1 agar kolom terlihat. Teks placeholder juga hanya 2,9:1.                                                                                                                                                                 | Rendah | Token baru `batas` (#8F8379, 3,69:1 di putih) untuk batas kolom dan sakelar. Placeholder memakai `ampas` penuh (5,31:1).                                   | Selesai                                       |
| B-03 | Gambar QRIS belum ada (`public/qris.png`). Panel menampilkan penanda "Gambar QRIS belum dipasang".                                                                                                                                                                                                                                                    | Sedang | Menunggu file dari pemilik: foto QRIS toko, dipotong sehingga hanya kotak QR yang terlihat (tanpa NMID dan alamat).                                        | Terbuka                                       |
| B-04 | Akun non-admin yang membuka `/admin` keluar otomatis, tetapi pesan "Akun ini bukan admin" tidak tampil. Ditemukan saat uji UI TC-14: setelah `signOut` selesai, `user` menjadi null dan cache akses terhapus, sehingga pengalihan kedua ke `/admin/masuk` tidak membawa status penolakan. Tes lama memakai `signOut` tiruan, jadi tidak menangkapnya. | Sedang | `RequireAdmin` mengingat penolakan. Tes baru meniru `signOut` asli (gagal sebelum perbaikan, lulus sesudahnya). Total 94 tes.                              | Selesai (pengecekan produksi menunggu deploy) |

Catatan: pesanan "Diproses" yang sesinya sudah **dibayar** tetap di antrian sampai ditandai Antar.
Itu perilaku yang disengaja (barista tetap harus mengantarnya) dan sudah tercatat di `docs/PROGRESS.md`.

## 7. Belum diuji dan alasannya

| Hal                                                         | Alasan                                                                                                                                                  | Yang dibutuhkan                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| TC-10 dan TC-30 lewat UI, pesan penolakan TC-14 di produksi | TC-10 butuh dua akun memesan di satu meja. TC-30 butuh akun yang belum memesan menekan Minta bill. TC-14 butuh satu login non-admin setelah deploy B-04 | Pemilik mengklik pemilih akun Google                      |
| Tampilan di HP sungguhan                                    | Uji dilakukan di Chrome laptop                                                                                                                          | Buka dari HP lewat jaringan yang sama atau setelah deploy |
| Balapan "menu habis tepat saat klik Kirim"                  | Di UI tombol Kirim sudah dinonaktifkan sesudah polling, jadi jendelanya sangat sempit. Lapisan server terbukti menolak                                  | Tidak perlu, dicatat sebagai batas uji                    |

## 8. Aksesibilitas dasar

| Pemeriksaan                          | Cara                                       | Hasil                                                                                                                                                     |
| ------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kontras teks (WCAG 1.4.3, min 4,5:1) | Dihitung dari token warna                  | Semua pasangan teks lulus (terendah `ampas` di `tegel` 4,82:1). Tabel di bawah                                                                            |
| Kontras komponen (1.4.11, min 3:1)   | Dihitung dari token warna                  | Temuan B-02, sudah diperbaiki. Garis pembatas dekoratif tidak termasuk                                                                                    |
| Label form                           | Skrip audit di halaman pelanggan dan admin | 42 elemen interaktif di halaman pelanggan dan 80 di halaman menu admin semuanya punya nama, semua input berlabel                                          |
| Navigasi keyboard di admin           | Tombol Tab, Enter, dan Esc sungguhan       | Urutan Tab di dialog logis (Nama, Deskripsi, Kategori, Harga, Urutan, Batal) dan tidak keluar dari dialog. Esc menutup dan fokus kembali ke "Tambah menu" |
| Fokus terlihat                       | Gaya komputasi elemen yang sedang fokus    | Garis fokus 1,25px berwarna `tubruk`                                                                                                                      |
| Struktur halaman                     | Audit landmark                             | `lang="id"`, satu `main`, satu `h1` per halaman, `th` bertanda `scope`                                                                                    |
| WCAG 2.1 A/AA otomatis               | axe-core di Vitest (jsdom)                 | 0 pelanggaran pada 4 skenario komponen; kontrol negatif terbukti mendeteksi pelanggaran                                                                   |

Batas pemeriksaan: axe di jsdom tidak menilai kontras dan layout, jadi kontras dihitung manual.
Audit keyboard dan label dilakukan pada halaman yang dibuka di Chrome, bukan dengan pembaca layar.

Kontras token (rasio WCAG):

| Pasangan                      | Rasio         | Keterangan                  |
| ----------------------------- | ------------- | --------------------------- |
| `tubruk` di `putih` / `tegel` | 15,85 / 14,39 | AA                          |
| `ampas` di `putih` / `tegel`  | 5,31 / 4,82   | AA                          |
| `putih` di `blirik` (tombol)  | 6,25          | AA                          |
| `blirik` di `putih` / `tegel` | 6,25 / 5,67   | AA                          |
| `kaleng` di `putih` / `tegel` | 5,94 / 5,39   | AA                          |
| `tubruk` di `lampu` (badge)   | 8,78          | AA                          |
| `putih` di `kaleng` (bahaya)  | 5,94          | AA                          |
| `batas` di `putih` / `tegel`  | 3,69 / 3,35   | Lulus 3:1 untuk batas kolom |
| `garis` di `putih`            | 1,29          | Hanya pemisah dekoratif     |

## 9. Cara mengulang pengujian

```powershell
npm run test
npm run lint
npm run build
```

Uji database: salin isi `supabase/tests/rls_check.sql` dan `supabase/tests/aturan_bisnis.sql` ke SQL Editor
Supabase lalu jalankan (keduanya membatalkan perubahan sendiri). Uji UI mengikuti tabel di bagian 5.
UAT dengan teman: lihat `docs/mppl/11-uat.md`.
