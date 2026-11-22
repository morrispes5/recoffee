# 08. Estimasi biaya

> Dokumen MPPL (M0). Sumber: PRD bagian 22, diperbarui dengan infrastruktur yang sebenarnya dipakai per 22 Nov 2026.
> Semua tarif adalah **asumsi untuk simulasi laporan**. Sesuaikan dengan acuan yang diminta dosen.

## 1. Biaya SDM (simulasi)

Proyek individu, tetapi tiga peran dijalankan oleh orang yang sama. Biaya tetap dihitung **per peran** karena tarif tiap peran
berbeda. Itu cara yang umum dipakai pada estimasi biaya proyek perangkat lunak. Jam diambil dari `07-estimasi-jadwal.md`.

| Peran                            | Jam    | Tarif asumsi per jam | Subtotal        |
| -------------------------------- | ------ | -------------------- | --------------- |
| Project Manager                  | 8      | Rp50.000             | Rp400.000       |
| Developer (frontend dan backend) | 16     | Rp60.000             | Rp960.000       |
| QA dan Dokumentasi               | 10     | Rp40.000             | Rp400.000       |
| **Total SDM**                    | **34** |                      | **Rp1.760.000** |

## 2. Biaya infrastruktur

Semua layanan memakai paket gratis, dan semuanya dipegang oleh akun klien (pemegang akun layanan).

| Item                     | Dipakai untuk                           | Paket                      | Biaya                                       |
| ------------------------ | --------------------------------------- | -------------------------- | ------------------------------------------- |
| Hosting frontend         | https://recoffee-ten.vercel.app         | Vercel Hobby               | Rp0                                         |
| Database dan Auth        | PostgreSQL, RLS, login Google           | Supabase Free              | Rp0                                         |
| Repositori dan CI        | Kode (privat) dan workflow `keep-alive` | GitHub Free                | Rp0                                         |
| Login Google             | OAuth client                            | Google Cloud, mode Testing | Rp0                                         |
| Domain                   | Memakai subdomain `vercel.app`          | -                          | Rp0                                         |
| Alat bantu pengembangan  | Langganan AI coding assistant           | `[isi bila ada]`           | `[isi bila ada]`                            |
| Cetak QR meja untuk demo | 3 lembar (meja 1, 18, 27)               | Cetak biasa                | `[isi sesuai biaya cetak]`                  |
| **Total infrastruktur**  |                                         |                            | **Rp0 ditambah biaya cetak dan alat bantu** |

## 3. Biaya tak terduga

Contingency 10% dari total SDM: **Rp176.000**.

Ini berbeda dengan buffer 20% pada waktu di `07-estimasi-jadwal.md`. Buffer waktu hanya cadangan jadwal dan tidak ditagihkan.
Contingency biaya adalah cadangan anggaran.

## 4. Total estimasi proyek (simulasi)

| Komponen                      | Jumlah                                                      |
| ----------------------------- | ----------------------------------------------------------- |
| SDM                           | Rp1.760.000                                                 |
| Infrastruktur                 | Rp0                                                         |
| Contingency 10%               | Rp176.000                                                   |
| **Subtotal**                  | **Rp1.936.000**                                             |
| Biaya cetak QR dan alat bantu | `[diisi pelaksana]`                                         |
| **Perkiraan total**           | **sekitar Rp1.940.000 ditambah biaya cetak dan alat bantu** |

## 5. Catatan bila dioperasikan nyata (bahan KP)

Aplikasi ini hanya didemokan ke dosen. Bila suatu hari dipakai kafe sungguhan, biaya bulanan akan muncul dari hal berikut.
Angka pastinya harus dicek ke penyedia pada saat itu, karena paket dan kuota bisa berubah.

| Pemicu                             | Keterangan                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Penggunaan komersial di Vercel     | Paket Hobby ditujukan untuk penggunaan non-komersial, jadi kafe sungguhan perlu paket berbayar                                                      |
| Kuota Supabase Free terlampaui     | Ada batas ukuran database dan transfer. Project gratis juga di-pause bila lama tidak ada aktivitas, sehingga perlu `keep-alive` atau paket berbayar |
| Domain sendiri                     | Biaya tahunan, dan QR harus dicetak ulang bila alamat berubah                                                                                       |
| Payment gateway QRIS dinamis       | Biasanya dikenai biaya per transaksi (MDR) dan butuh akun merchant                                                                                  |
| Verifikasi nomor HP dan notifikasi | Layanan SMS atau WhatsApp berbayar                                                                                                                  |
| Pemeliharaan                       | Waktu untuk memperbarui dependensi, memantau error, dan mencadangkan data                                                                           |
