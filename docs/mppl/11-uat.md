# 11. UAT: uji penerimaan dengan teman (M6)

Dokumen ini adalah **persiapan** UAT (PRD 19.5 dan M6 tugas 4). Hasilnya diisi setelah sesi UAT berjalan;
sampai itu terjadi, bagian 6 dan 7 sengaja kosong dan target DoD "hasil UAT terdokumentasi" belum tercapai.

Tujuan: memastikan orang yang tidak ikut membuat aplikasi bisa memakai RE:coffee tanpa dibimbing.
Dua peran diuji: **pelanggan** (3 sampai 4 orang) dan **kasir** (1 sampai 2 orang).

## 1. Sebelum sesi (checklist pemilik)

- [ ] Tambahkan akun Google tiap teman sebagai **Test user**: Google Cloud console, Google Auth Platform,
      Audience, Test users. Aplikasi masih mode Testing, jadi akun yang tidak terdaftar akan ditolak Google.
- [ ] Siapkan alamat aplikasi. Dua pilihan: (a) situs hasil deploy M7, atau (b) laptop pemilik di jaringan
      Wi-Fi yang sama dengan alamat `http://<IP-laptop>:5173` (jalankan `npm run dev -- --host`). Pilihan (b)
      membutuhkan alamat itu ditambahkan ke Redirect URLs di Supabase, jadi pilihan (a) lebih mudah.
- [x] Pasang `public/qris.png` agar langkah bayar QRIS tidak menampilkan penanda kosong (26 Nov 2026).
- [ ] Bersihkan data uji lama (urutan hapus: `item_pesanan`, `pesanan`, `sesi_meja`) supaya denah mulai kosong.
- [ ] Untuk peran kasir: daftarkan email teman di tabel `admin` selama sesi, lalu hapus setelahnya.

```sql
-- Sebelum sesi: daftarkan teman sebagai kasir (email huruf kecil)
insert into admin (email, nama) values ('teman@gmail.com', 'Kasir UAT');

-- Setelah sesi: cabut akses
delete from admin where email = 'teman@gmail.com';
```

- [ ] Siapkan satu HP dan satu laptop (atau dua HP) agar pelanggan dan kasir bisa dicoba bersamaan.

## 2. Aturan sesi

- Pemilik **mengamati dan mencatat, tidak membantu**. Kalau peserta bingung, tulis di kolom kendala, lalu beri tahu
  jawabannya setelah tugas selesai.
- Ceritakan konteksnya saja: "Kamu duduk di meja nomor 7 sebuah kafe. Kamu ingin memesan."
- Satu sesi sekitar 10 sampai 15 menit per orang.
- Jangan minta peserta memakai data pribadi sungguhan. Nama dan nomor HP boleh data uji.

## 3. Skenario pelanggan

Mulai dari beranda aplikasi (atau pindai QR meja yang diberi nomor).

| No  | Tugas untuk peserta                                                    | Yang diamati                                                                    |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| P1  | Buka aplikasi, masuk ke meja nomor 7                                   | Apakah paham harus memasukkan nomor meja? Apakah pesan error nomor salah jelas? |
| P2  | Cari "Matcha Latte" dan satu makanan, masukkan ke pesanan              | Apakah menu mudah ditemukan? Apakah paham tombol + dan jumlah?                  |
| P3  | Kirim pesanan                                                          | Apakah paham harus masuk Google dan mengisi data diri? Apakah keranjang aman?   |
| P4  | Tambah satu pesanan lagi (misalnya kentang goreng) dari meja yang sama | Apakah paham pesanan kedua masuk tagihan yang sama?                             |
| P5  | Lihat tagihan, lalu minta bill dan pilih bayar pakai QRIS              | Apakah paham cara minta bill? Apakah QRIS dan nominal jelas?                    |
| P6  | Cek status pesananmu (apakah sudah diproses atau diantar)              | Apakah status mudah ditemukan dan dimengerti?                                   |

## 4. Skenario kasir

Masuk lewat `/admin/masuk` dengan akun Google yang sudah didaftarkan.

| No  | Tugas untuk peserta                                          | Yang diamati                                                    |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| K1  | Lihat meja mana yang sedang terisi dan mana yang minta bill  | Apakah dasbor dan warna meja mudah dibaca? (pertanyaan 4)       |
| K2  | Proses lalu antar pesanan yang masuk dari pelanggan          | Apakah urutan Baru, Diproses, Antar jelas?                      |
| K3  | Tandai satu menu sebagai habis, lalu cek dari sisi pelanggan | Apakah mudah menemukan tombolnya?                               |
| K4  | Buka detail meja yang minta bill, konfirmasi pembayaran      | Apakah konfirmasi jelas dan tidak membingungkan? (pertanyaan 5) |

## 5. Kuesioner (skala 1 sampai 5)

1 = sangat tidak setuju, 5 = sangat setuju. Pertanyaan 1 sampai 3 untuk pelanggan, 4 dan 5 untuk kasir (PRD 19.5).

| No  | Pernyataan                                           | Peran     |
| --- | ---------------------------------------------------- | --------- |
| 1   | Saya mudah menemukan menu yang ingin dipesan.        | Pelanggan |
| 2   | Saya paham cara menambah pesanan kedua.              | Pelanggan |
| 3   | Saya paham cara meminta bill.                        | Pelanggan |
| 4   | Saya mudah mengetahui meja mana yang perlu ditagih.  | Kasir     |
| 5   | Konfirmasi pembayaran jelas dan tidak membingungkan. | Kasir     |

Pertanyaan terbuka untuk semua peserta:

- Bagian mana yang paling membingungkan?
- Apa satu hal yang ingin kamu ubah?
- Apakah kamu akan memakai ini kalau ada di kafe langganan? Kenapa?

## 6. Lembar jawaban (diisi saat sesi)

Salin satu baris per peserta.

| Peserta | Peran | Perangkat | P1/K1 | P2/K2 | P3/K3 | P4/K4 | P5  | P6  | Skor 1 | Skor 2 | Skor 3 | Skor 4 | Skor 5 | Kendala yang terlihat |
| ------- | ----- | --------- | ----- | ----- | ----- | ----- | --- | --- | ------ | ------ | ------ | ------ | ------ | --------------------- |
|         |       |           |       |       |       |       |     |     |        |        |        |        |        |                       |
|         |       |           |       |       |       |       |     |     |        |        |        |        |        |                       |
|         |       |           |       |       |       |       |     |     |        |        |        |        |        |                       |
|         |       |           |       |       |       |       |     |     |        |        |        |        |        |                       |

Isi kolom tugas dengan: **S** (selesai sendiri), **B** (selesai setelah bingung atau ragu), **G** (gagal atau perlu dibantu).

## 7. Rekap dan tindak lanjut (diisi setelah sesi)

| Pertanyaan                | Rata-rata | Catatan |
| ------------------------- | --------- | ------- |
| 1 Menemukan menu          |           |         |
| 2 Pesanan kedua           |           |         |
| 3 Minta bill              |           |         |
| 4 Meja yang perlu ditagih |           |         |
| 5 Konfirmasi pembayaran   |           |         |

Kendala yang ditemukan dan keputusan (perbaiki sekarang, catat sebagai usulan, atau abaikan):

| No  | Kendala | Berapa orang mengalami | Keputusan | Status |
| --- | ------- | ---------------------- | --------- | ------ |
|     |         |                        |           |        |

Kriteria wajar: rata-rata di atas 4 dan tidak ada tugas yang gagal dialami lebih dari satu orang.
Kendala yang dialami dua orang atau lebih diperbaiki lebih dulu.

## 8. Setelah sesi

- [ ] Hapus email teman dari tabel `admin` (SQL di bagian 1).
- [ ] Hapus akun teman dari daftar Test users bila tidak diperlukan lagi.
- [ ] Bersihkan data uji (urutan hapus: `item_pesanan`, `pesanan`, `sesi_meja`).
- [ ] Salin rekap ke `docs/PROGRESS.md` (bagian M6) dan ceklis DoD.
