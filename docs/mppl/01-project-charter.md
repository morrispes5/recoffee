# 01. Project charter RE:coffee

> Dokumen MPPL (M0). Sumber: PRD bagian 2, 3, 18, 21, 22, 23, dan template 24.1. Disusun 22 Nov 2026.
> Isian dalam tanda kurung siku `[...]` adalah data yang hanya diketahui pelaksana dan harus dilengkapi sebelum dikumpulkan.

## Identitas proyek

| Hal               | Isi                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Judul proyek      | RE:coffee, sistem pemesanan kopi berbasis meja                                                |
| Mata kuliah       | Manajemen Proyek Perangkat Lunak (MPPL), proyek UAS dengan tema bebas                         |
| Sponsor / dosen   | Gusmayeni, S.Kom., M.Kom.                                                                           |
| Pelaksana         | Khairunisa Yulia Cahyani (241011701074): Project Manager, Developer, dan QA (proyek individu) |
| Tanggal mulai     | 21 November 2026 (commit pertama repositori)                                                  |
| Target selesai    | Pekan 14, akhir Desember 2026 (`[tanggal pasti menurut kalender kampus]`)                     |
| Aplikasi berjalan | https://recoffee-ten.vercel.app                                                               |
| Kode sumber       | Repositori GitHub privat `morrispes5/recoffee`                                                |

## 1. Latar belakang

Di coffee shop skala kecil sampai menengah, pemesanan umumnya masih manual. Pelanggan antre ke kasir, pesanan tambahan
dicatat di kertas, dan tagihan per meja dihitung ulang saat pelanggan hendak pulang. Saat ramai, cara ini rawan salah catat,
salah hitung, dan membuat pelanggan menunggu lama.

Masalah yang diselesaikan:

| #   | Masalah                                                 | Dampak                                                    |
| --- | ------------------------------------------------------- | --------------------------------------------------------- |
| P1  | Pelanggan harus antre ke kasir setiap menambah pesanan  | Waktu tunggu lama, antrean menumpuk                       |
| P2  | Pesanan tambahan dicatat manual                         | Pesanan terlewat atau salah meja                          |
| P3  | Tagihan per meja dihitung manual di akhir               | Salah hitung, selisih kas                                 |
| P4  | Kasir tidak tahu meja mana yang kosong atau belum bayar | Meja tidak terkelola, pelanggan bisa pergi tanpa membayar |

## 2. Tujuan

1. Pelanggan memesan dari meja lewat browser HP dengan alur paling banyak 4 langkah setelah login pertama (scan, pilih menu,
   tinjau, kirim). Login Google dan pengisian data diri hanya dilakukan sekali per perangkat.
2. Semua pesanan dalam satu kunjungan tercatat dalam satu sesi meja, dengan total tagihan dihitung otomatis oleh database.
3. Admin melihat status 28 meja dalam satu layar yang diperbarui otomatis paling lama setiap 5 detik.
4. Sistem selesai, teruji (black box), dan ter-deploy di Vercel sebelum Pekan 14.

## 3. Ruang lingkup

Ringkasan. Rincian lengkap, termasuk perubahan selama pengerjaan, ada di `02-ruang-lingkup-wbs.md`.

**Dikerjakan:** pemesanan dari meja lewat QR dengan login Google dan data diri, keranjang, tagihan satu meja (open bill),
minta bill dengan metode QRIS atau kasir, denah 28 meja untuk kasir, antrian pesanan untuk barista, konfirmasi bayar dan
pembatalan sesi, kelola menu, dan deploy ke Vercel dengan 28 QR meja.

**Tidak dikerjakan:** payment gateway QRIS dinamis, login selain Google, verifikasi OTP nomor HP, takeaway dan delivery, split
bill, laporan omzet berkala dan export, stok bahan baku, promo dan loyalti, multi-cabang dan multi-role, notifikasi push,
realtime websocket, serta pencegahan pesanan dari luar kafe.

## 4. Deliverable

| Deliverable                                 | Lokasi                                   | Status per 22 Nov 2026                          |
| ------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Aplikasi ter-deploy dan kode sumber         | https://recoffee-ten.vercel.app, `src/`  | Selesai                                         |
| Database, RLS, dan function                 | `supabase/migrations/`                   | Selesai                                         |
| QR code 28 meja                             | `public/qr-meja/`                        | Selesai dibuat, cetak menunggu pelaksana        |
| Dokumen MPPL (charter sampai biaya, risiko) | `docs/mppl/01` sampai `09`               | Selesai (dokumen ini bagian dari rangkaian itu) |
| Laporan pengujian dan panduan UAT           | `docs/mppl/10-pengujian.md`, `11-uat.md` | Laporan selesai, sesi UAT belum dijalankan      |
| Laporan akhir dan skenario demo             | Disusun dari `docs/mppl/*` pada M8       | Belum                                           |

## 5. Stakeholder

| Pihak                         | Peran                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| Dosen MPPL                    | Sponsor dan penilai proyek                                                                 |
| Pelaksana                     | Merencanakan, membangun, menguji, dan mendokumentasikan                                    |
| Klien (pemegang akun layanan) | Menyediakan akun infrastruktur (GitHub, Vercel, Supabase, Google Cloud) dan meminta revisi |
| Pelanggan kafe                | Pengguna halaman `/meja/:nomor`                                                            |
| Kasir dan barista             | Pengguna halaman `/admin`                                                                  |

Catatan: aplikasi hanya didemokan ke dosen dan belum dipakai pengguna sungguhan. Peran pelanggan dan kasir dalam uji
diperankan oleh pelaksana dan teman (lihat `11-uat.md`).

## 6. Milestone dan jadwal

| Milestone | Isi                                     | Rencana (jam) | Status per 22 Nov 2026                                   |
| --------- | --------------------------------------- | ------------- | -------------------------------------------------------- |
| M0        | Dokumen perencanaan, use case, ERD, LRS | 6             | Selesai (dokumen disusun setelah implementasi)           |
| M1        | Setup project dan design system         | 2             | Selesai 21 Nov                                           |
| M2        | Frontend pelanggan (data mock)          | 4             | Selesai 21 Nov                                           |
| M3        | Frontend admin (data mock)              | 3             | Selesai 21 Nov                                           |
| M4        | Backend Supabase                        | 2             | Selesai 22 Nov                                           |
| M5        | Integrasi frontend dan Supabase         | 4             | Kode terintegrasi, uji dua akun lewat UI sebagian        |
| M6        | Testing (unit, RLS, black box, UAT)     | 4             | Ditutup dari sisi kode, UAT menunggu pelaksana           |
| M7        | Deployment dan QR meja                  | 1             | Ditutup dari sisi kode, cetak QR dan `qris.png` menunggu |
| M8        | Laporan akhir dan latihan demo          | 8             | Belum                                                    |

Rincian estimasi, jadwal rencana (Gantt), dan realisasi ada di `07-estimasi-jadwal.md`.

## 7. Estimasi biaya

Simulasi total sekitar **Rp1.940.000**: SDM Rp1.760.000 (34 jam menurut tiga peran), contingency 10% Rp176.000, ditambah
biaya cetak QR. Biaya infrastruktur Rp0 karena memakai paket gratis. Rincian di `08-biaya.md`.

## 8. Risiko utama

| ID  | Risiko                                                          | Mitigasi singkat                                                                   |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| R1  | Database Supabase ter-pause sebelum demo                        | Workflow keep-alive tiap 3 hari dan checklist H-1                                  |
| R2  | Login Google gagal di domain produksi                           | Sudah terbukti berhasil di produksi (22 Nov), daftar redirect URL tercatat         |
| R7  | Scope creep                                                     | Aturan kerja PRD, perubahan dicatat sebagai keputusan di `02-ruang-lingkup-wbs.md` |
| R8  | Pelaksana tidak bisa menjelaskan sistem saat ditanya dosen      | Latihan demo dan bahan jawaban di `05-erd-lrs.md` dan PRD bagian 25.3              |
| R9  | Koneksi internet saat demo buruk                                | Hotspot cadangan dan video demo                                                    |
| R11 | Login pengguna ditolak karena aplikasi Google berstatus Testing | Daftarkan penguji sebagai Test user, uji login jauh sebelum demo                   |

Daftar lengkap R1 sampai R16 beserta status ada di `09-risiko.md`.

## 9. Asumsi dan batasan

**Asumsi**

- Satu meja satu tagihan: siapa pun yang memindai QR meja itu masuk ke tagihan yang sama.
- Pelanggan punya HP berkamera, koneksi internet, dan akun Google.
- QRIS yang dipakai adalah QRIS statis berupa gambar. Untuk keperluan tugas dipakai QRIS milik pelaksana sebagai simulasi
  QRIS kafe, dan pembayaran diverifikasi kasir lewat aplikasi bank atau e-wallet.
- Admin memiliki akun Google yang email-nya terdaftar di tabel `admin`.

**Batasan**

- Paket gratis Vercel (Hobby) dan Supabase (Free) dengan kuota masing-masing.
- Waktu pengerjaan sampai Pekan 14.
- Dikerjakan individu: satu orang merangkap Project Manager, Developer, dan QA.
- Implementasi dibantu AI coding assistant (Claude Code), sehingga fase coding dipadatkan; waktu selebihnya untuk dokumen,
  pengujian, dan laporan.

## 10. Kriteria sukses

| Kriteria                                                                                 | Status per 22 Nov 2026                                             |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 100% skenario black box prioritas tinggi lulus                                           | 22 dari 23 lulus; satu sebagian (TC-11) menunggu gambar `qris.png` |
| Demo end-to-end (pesan, minta bill, konfirmasi, meja kosong) tanpa error di URL produksi | Alur sudah dijalankan di produksi; latihan demo penuh menunggu M8  |
| Dokumen MPPL lengkap sesuai checklist                                                    | Dokumen 01 sampai 11 tersedia; laporan akhir menunggu M8           |

## 11. Persetujuan

| Peran             | Nama                     | Tanda tangan | Tanggal |
| ----------------- | ------------------------ | ------------ | ------- |
| Pelaksana         | Khairunisa Yulia Cahyani |              |         |
| Mengetahui, dosen | Gusmayeni, S.Kom., M.Kom.      |              |         |
