# 02. Ruang lingkup dan WBS

> Dokumen MPPL (M0). Sumber: PRD bagian 3 dan 21.1. Disusun 22 Nov 2026, setelah implementasi, jadi bagian 5 mencatat
> perubahan ruang lingkup yang benar-benar terjadi selama pengerjaan.

## 1. Ruang lingkup yang dikerjakan (in-scope)

Nomor FR mengacu ke `03-kebutuhan-dan-analisis-data.md`.

**Pelanggan** (login Google untuk memesan, melihat menu tanpa login)

| Kemampuan                                                                                  | FR                  |
| ------------------------------------------------------------------------------------------ | ------------------- |
| Membuka halaman meja lewat QR atau mengetik nomor meja (`/meja/:nomor`, nomor 1 sampai 28) | FR-01               |
| Melihat menu per kategori, dengan penanda menu habis                                       | FR-02, FR-03        |
| Masuk dengan Google, mengisi nama dan nomor HP sekali, mengubahnya, dan keluar             | FR-23, FR-24, FR-25 |
| Keranjang: tambah, kurangi, hapus, catatan opsional (maksimal 140 karakter)                | FR-04, FR-05        |
| Mengirim pesanan, berkali-kali selama sesi aktif                                           | FR-06               |
| Melihat tagihan meja: pesanan, status, total                                               | FR-07               |
| Minta bill dengan memilih QRIS atau bayar di kasir, dan melihat gambar QRIS                | FR-08, FR-09, FR-10 |

**Admin dan kasir** (login Google, email terdaftar)

| Kemampuan                                                            | FR                  |
| -------------------------------------------------------------------- | ------------------- |
| Login dan logout dengan Google, akun non-admin ditolak               | FR-11               |
| Denah 28 meja dengan status kosong, terisi, minta bill               | FR-12               |
| Detail meja: pesanan, total, metode bayar, nama dan nomor HP pemesan | FR-13               |
| Konfirmasi bayar dan batalkan sesi                                   | FR-14, FR-15        |
| Antrian pesanan: baru, diproses, diantar                             | FR-16, FR-17        |
| Kelola menu: tambah, ubah, tandai habis, arsipkan                    | FR-18, FR-19, FR-20 |
| Ringkasan dasbor                                                     | FR-21               |

**Teknis:** PostgreSQL di Supabase dengan Row Level Security, logika kritis di database function, deploy ke Vercel, dan
28 file QR siap cetak.

## 2. Di luar ruang lingkup (out-of-scope)

Ditulis di laporan sebagai batasan.

| Fitur                                                          | Alasan                                                                                                          |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Payment gateway QRIS dinamis dan webhook                       | Butuh akun merchant, biaya, dan risiko keamanan. QRIS statis dengan konfirmasi manual cukup untuk validasi alur |
| Login selain Google (email, password, nomor HP)                | Satu penyedia mengurangi pekerjaan dan risiko                                                                   |
| Verifikasi nomor HP (OTP SMS atau WhatsApp)                    | Butuh layanan berbayar. Nomor HP cukup divalidasi formatnya                                                     |
| Takeaway dan delivery                                          | Fokus dine-in berbasis meja                                                                                     |
| Split bill per orang                                           | Satu meja satu tagihan                                                                                          |
| Laporan omzet berkala, grafik penjualan, export PDF atau Excel | Di luar kebutuhan inti. Yang ada hanya ringkasan hari ini di dasbor (lihat bagian 5)                            |
| Manajemen stok bahan baku                                      | Kompleksitas tinggi                                                                                             |
| Voucher, promo, loyalti, member                                | Di luar kebutuhan inti                                                                                          |
| Multi-cabang dan multi-role                                    | Satu peran admin cukup                                                                                          |
| Notifikasi push atau WhatsApp                                  | Polling cukup                                                                                                   |
| Realtime websocket                                             | Polling 5 detik cukup. Supabase Realtime menjadi opsi lanjutan                                                  |
| Pencegahan pesanan dari luar kafe (geofencing, PIN meja)       | Login Google dan data diri sudah menekan pesanan iseng. Sisanya mitigasi operasional                            |

## 3. Asumsi

- Satu meja satu tagihan. Siapa pun yang memindai QR meja itu masuk ke tagihan yang sama.
- Pelanggan punya HP berkamera, koneksi internet, dan akun Google.
- QRIS yang dipakai adalah QRIS statis berupa gambar, milik pelaksana, sebagai simulasi QRIS kafe. Verifikasi pembayaran
  dilakukan kasir lewat aplikasi bank atau e-wallet.
- Admin punya akun Google yang email-nya terdaftar di tabel `admin`.

## 4. Batasan

- Paket gratis Vercel (Hobby) dan Supabase (Free) dengan batas kuota masing-masing.
- Waktu pengerjaan sampai Pekan 14.
- Dikerjakan individu: satu orang merangkap Project Manager, Developer, dan QA.
- Implementasi dibantu AI coding assistant, sehingga fase coding dipadatkan dan waktu selebihnya untuk dokumen, pengujian,
  dan laporan.
- Aplikasi Google OAuth berstatus Testing, sehingga hanya akun yang terdaftar sebagai Test user (batas 100) yang bisa login.
  Login juga perlu diulang kira-kira tiap 7 hari.

## 5. Perubahan ruang lingkup selama pengerjaan

Ruang lingkup dikunci pada awal proyek (PRD bagian 3). Tabel ini mencatat apa yang bergeser, siapa yang meminta, dan
alasannya, supaya laporan jujur terhadap rencana awal.

| Tanggal     | Perubahan                                                                                                                                                        | Diminta oleh | Dampak                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 21 Nov 2026 | Tampilan M1 sampai M3 dinilai terlalu polos. Ditambah gerak halus, latar bertema kopi, dan komponen feedback                                                     | Klien        | Aturan "animasi minimal" dilonggarkan. Palet, font, dan larangan gambar AI tetap                                                        |
| 22 Nov 2026 | Beranda yang hanya teks menjadi landing page dengan kotak "Duduk di meja berapa?" (nomor 1 sampai 28 menuju `/meja/:nomor`). QR tetap langsung ke `/meja/:nomor` | Klien        | Satu halaman bertambah fungsi. Tidak ada tabel baru                                                                                     |
| 22 Nov 2026 | Dasbor kasir berisi kartu pendapatan hari ini, tagihan berjalan, pesanan menunggu, minta bill, panel "Perlu ditagih", dan "Terlaris hari ini"                    | Klien        | Melonggarkan out-of-scope "laporan omzet" menjadi **ringkasan hari ini saja**, tanpa riwayat, grafik, atau export. Tidak ada tabel baru |
| 22 Nov 2026 | Isi menu diganti menjadi 22 menu kafe kekinian. 12 menu lama diarsipkan, tidak dihapus                                                                           | Klien        | Hanya isi data. Struktur ERD dan LRS tidak berubah (migrasi `0005`)                                                                     |
| 22 Nov 2026 | Alert modal dan toast untuk semua aksi, animasi tambahan, ikon kategori baru                                                                                     | Klien        | Library tambahan `motion`, `sonner`, dan `canvas-confetti`                                                                              |
| 22 Nov 2026 | Aplikasi Google tetap berstatus Testing, tidak dipublikasikan ke In production                                                                                   | Klien        | Mitigasi R11 di PRD (In production) diganti Test user. Dicatat di `09-risiko.md`                                                        |
| 22 Nov 2026 | Workflow GitHub Actions `keep-alive` (tiap 3 hari) dan `axe-core` sebagai devDependency untuk uji aksesibilitas                                                  | Pelaksana    | Mitigasi R1. Tidak mengubah fitur                                                                                                       |
| 22 Nov 2026 | Alamat produksi menjadi `recoffee-ten.vercel.app` karena `recoffee.vercel.app` sudah dipakai pihak lain                                                          | Pelaksana    | QR 28 meja dibuat untuk alamat ini. Berubah alamat berarti QR dicetak ulang                                                             |

Tidak ada perubahan yang menambah entitas atau relasi baru, jadi ERD dan LRS (`05-erd-lrs.md`) tetap sama.

## 6. WBS (Work Breakdown Structure)

```
1. RE:coffee
   1.1 Inisiasi dan perencanaan
       1.1.1 Project charter                       -> 01-project-charter.md
       1.1.2 Ruang lingkup dan WBS                 -> 02-ruang-lingkup-wbs.md
       1.1.3 Estimasi waktu, biaya, risiko         -> 07, 08, 09
   1.2 Analisis dan desain
       1.2.1 Kebutuhan fungsional dan non-fungsional -> 03-kebutuhan-dan-analisis-data.md
       1.2.2 Analisis data                         -> 03-kebutuhan-dan-analisis-data.md
       1.2.3 Use case                              -> 04-use-case.md
       1.2.4 ERD dan LRS                           -> 05-erd-lrs.md
       1.2.5 Design system dan desain UI           -> 06-desain.md, design-system.md
   1.3 Implementasi
       1.3.1 Setup project dan komponen UI         (M1)
       1.3.2 Frontend pelanggan                    (M2)
       1.3.3 Frontend admin                        (M3)
       1.3.4 Backend: database, RLS, function, auth (M4)
       1.3.5 Integrasi                             (M5)
   1.4 Pengujian
       1.4.1 Unit test
       1.4.2 Uji database dan RLS
       1.4.3 Black box testing
       1.4.4 UAT                                   -> 10-pengujian.md, 11-uat.md
   1.5 Deployment
       1.5.1 Deploy Vercel dan konfigurasi auth    (M7)
       1.5.2 QR code meja                          (M7)
   1.6 Penutupan
       1.6.1 Laporan akhir                         (M8)
       1.6.2 Demo                                  (M8)
       1.6.3 Jurnal (terpisah, ketentuan kelompok 2 sampai 3 orang)
```

## 7. Kamus WBS

| Kode  | Paket kerja                             | Hasil (deliverable)                                                                  | Milestone | Peran     | Status per 22 Nov 2026                       |
| ----- | --------------------------------------- | ------------------------------------------------------------------------------------ | --------- | --------- | -------------------------------------------- |
| 1.1.1 | Project charter                         | `01-project-charter.md`                                                              | M0        | PM        | Selesai                                      |
| 1.1.2 | Ruang lingkup dan WBS                   | `02-ruang-lingkup-wbs.md`                                                            | M0        | PM        | Selesai                                      |
| 1.1.3 | Estimasi waktu, biaya, risiko           | `07-estimasi-jadwal.md`, `08-biaya.md`, `09-risiko.md`                               | M0        | PM        | Selesai                                      |
| 1.2.1 | Kebutuhan fungsional dan non-fungsional | Tabel FR-01 sampai FR-25, NFR-01 sampai NFR-11                                       | M0        | PM, QA    | Selesai                                      |
| 1.2.2 | Analisis data                           | Identifikasi data, data turunan, DFD, matriks CRUD                                   | M0        | PM, QA    | Selesai, tafsiran istilah belum dikonfirmasi |
| 1.2.3 | Use case                                | 12 use case, diagram, skenario                                                       | M0        | PM, QA    | Selesai                                      |
| 1.2.4 | ERD dan LRS                             | Diagram Chen, LRS, kamus data, normalisasi                                           | M0        | PM, QA    | Selesai                                      |
| 1.2.5 | Design system dan desain UI             | `design-system.md`, `06-desain.md`                                                   | M0, M1    | Developer | Selesai                                      |
| 1.3.1 | Setup project dan komponen UI           | Vite, Tailwind v4, komponen `src/components/ui`, katalog `/dev/ui`                   | M1        | Developer | Selesai (21 Nov)                             |
| 1.3.2 | Frontend pelanggan                      | Beranda, menu, keranjang, data diri, tagihan, QRIS                                   | M2        | Developer | Selesai (21 Nov)                             |
| 1.3.3 | Frontend admin                          | Denah, detail meja, antrian, kelola menu, dasbor                                     | M3        | Developer | Selesai (21 Nov)                             |
| 1.3.4 | Backend                                 | 5 migrasi SQL, RLS, function RPC, login Google                                       | M4        | Developer | Selesai (21 sampai 22 Nov)                   |
| 1.3.5 | Integrasi                               | Frontend terhubung ke Supabase, polling, penanganan error                            | M5        | Developer | Kode selesai, uji dua akun sebagian          |
| 1.4.1 | Unit test                               | 94 tes (Vitest, Testing Library, axe-core)                                           | M6        | QA        | Selesai                                      |
| 1.4.2 | Uji database dan RLS                    | `supabase/tests/aturan_bisnis.sql` (39 pemeriksaan), `rls_check.sql` (9 pemeriksaan) | M6        | QA        | Selesai                                      |
| 1.4.3 | Black box                               | 32 kasus, 29 lulus lewat UI, 2 lewat SQL, 1 sebagian                                 | M6        | QA        | Selesai (kecuali TC-11)                      |
| 1.4.4 | UAT                                     | Panduan dan formulir `11-uat.md`                                                     | M6        | QA        | Persiapan selesai, sesi belum dijalankan     |
| 1.5.1 | Deploy dan konfigurasi auth             | https://recoffee-ten.vercel.app, redirect URL Supabase, keep-alive                   | M7        | Developer | Selesai (22 Nov)                             |
| 1.5.2 | QR code meja                            | 28 SVG dan halaman cetak di `public/qr-meja/`                                        | M7        | Developer | Dibuat, cetak menunggu                       |
| 1.6.1 | Laporan akhir                           | Laporan dari `docs/mppl/*` dan tangkapan layar                                       | M8        | PM, QA    | Belum                                        |
| 1.6.2 | Demo                                    | Skenario demo (PRD bagian 25) dan latihan                                            | M8        | PM        | Belum                                        |
| 1.6.3 | Jurnal                                  | Disepakati terpisah                                                                  | -         | -         | Di luar build aplikasi                       |
