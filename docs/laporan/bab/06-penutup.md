# BAB VI PENUTUP

## 6.1 Kesimpulan

Berdasarkan perencanaan, perancangan, implementasi, dan pengujian yang telah dilakukan, dapat disimpulkan hal-hal berikut:

1. Sistem RE:coffee memungkinkan pelanggan memesan langsung dari meja dengan memindai QR code dan membuka halaman menu di browser HP, tanpa memasang aplikasi dan tanpa antre ke kasir. Alur pemesanan terdiri atas empat langkah setelah login pertama: scan, pilih menu, tinjau keranjang, dan kirim.
2. Seluruh pesanan dalam satu kunjungan tercatat dalam satu sesi meja. Total tagihan dihitung oleh database dari harga di tabel menu, sehingga tidak dapat dimanipulasi dari browser. Aturan satu sesi terbuka per meja dijaga oleh partial unique index, dan riwayat transaksi tidak pernah dihapus.
3. Kasir memantau status 28 meja dalam satu layar yang diperbarui setiap 5 detik, memproses antrean pesanan, dan mengonfirmasi pembayaran. Manajer kafe mengelola menu dan melihat ringkasan penjualan hari ini. Kedua aktor memakai hak admin yang sama dan diperiksa di database melalui Row Level Security.
4. Proyek direncanakan dengan WBS empat fase dan enam belas paket kerja. Estimasi PERT menghasilkan durasi harapan 28,83 hari kerja dari batas 30 hari, dengan peluang selesai tepat waktu 79,9 persen. Anggaran proyek sebesar Rp10.095.250 didominasi biaya SDM, sedangkan biaya infrastruktur nol karena memakai paket gratis Vercel dan Supabase.
5. Pengujian menunjukkan 94 unit test lulus, 48 pemeriksaan database lulus, dan 22 dari 23 kasus black box berprioritas tinggi lulus. Satu kasus (TC-11) lulus sebagian karena gambar QRIS kafe belum dipasang.

## 6.2 Evaluasi Pelaksanaan Proyek

Tabel: Evaluasi kriteria keberhasilan proyek
| Kriteria | Target | Hasil | Status |
| --- | --- | --- | --- |
| Kasus black box prioritas tinggi | 100% lulus | 22 dari 23 lulus, 1 sebagian (TC-11) | Hampir tercapai |
| Alur pesan sampai meja kosong di produksi | Berjalan tanpa galat | Berjalan di https://recoffee-ten.vercel.app | Tercapai |
| Ruang lingkup | Seluruh kebutuhan fungsional | FR-01 sampai FR-25 terimplementasi | Tercapai |
| Struktur data | Tidak berubah setelah MS-2 | ERD dan LRS tetap sama walau ada 8 permintaan perubahan | Tercapai |
| Keamanan data | RLS di semua tabel | 9 pemeriksaan RLS dan 39 pemeriksaan aturan bisnis lulus | Tercapai |
| Biaya infrastruktur | Rp0 | Rp0 | Tercapai |
| UAT | Rata-rata skor di atas 4 | Instrumen siap, sesi UAT belum dijalankan | Belum |
| QR meja | 28 QR siap cetak | 28 QR dibuat, pencetakan menunggu | Sebagian |

Pekerjaan yang masih tersisa sebelum serah terima penuh adalah memasang gambar QRIS kafe untuk menutup bug B-03, menjalankan sesi UAT dengan calon pengguna, dan mencetak QR meja.

## 6.3 Pelajaran yang Didapat

1. **Mengunci struktur data lebih awal membuat perubahan menjadi murah.** Delapan permintaan perubahan dari klien dapat diterima tanpa mengubah ERD dan LRS, karena struktur data sudah dikunci pada milestone rancangan. Revisi cukup dikerjakan di sisi tampilan dan isi data.
2. **Aturan bisnis lebih aman ditempatkan di database.** Karena browser berbicara langsung dengan database, validasi di tampilan saja tidak cukup. Menaruh perhitungan harga, aturan sesi, dan pemeriksaan admin di function dan RLS membuat aplikasi tetap aman walaupun tampilannya dibobol.
3. **Satu orang dengan banyak peran membutuhkan resource leveling.** Jalur kritis secara logika hanya 21,75 hari, tetapi karena seluruh peran dijalankan satu orang, aktivitas paralel harus dikerjakan bergantian dan durasi menjadi 28,83 hari. Cadangan waktu yang tersisa kecil, sehingga pengendalian perubahan harus disiplin.
4. **Risiko layanan pihak ketiga perlu diuji sejak awal.** Mode Testing pada Google OAuth menolak akun yang belum didaftarkan. Hal ini baru terlihat ketika pengujian memakai akun kedua, sehingga pendaftaran Test user dijadikan langkah wajib sebelum UAT dan demo.
5. **Bukti pengujian perlu dicatat saat itu juga.** Menyimpan tangkapan layar dan hasil skrip uji per kasus memudahkan penyusunan laporan dan menjawab pertanyaan saat presentasi.

## 6.4 Saran

Saran untuk pengembangan sistem selanjutnya adalah:

1. Mengintegrasikan payment gateway dengan QRIS dinamis agar pembayaran terkonfirmasi otomatis tanpa pemeriksaan manual oleh kasir.
2. Mengganti polling dengan pembaruan waktu nyata (Supabase Realtime) agar antrean dan denah berubah seketika.
3. Menambahkan laporan penjualan berkala dengan grafik dan ekspor untuk manajer kafe.
4. Memisahkan peran kasir dan manajer di database sehingga hak akses keduanya berbeda, misalnya kasir tidak dapat mengubah harga menu.
5. Menambahkan fitur split bill, takeaway, dan pencegahan pesanan dari luar kafe seperti PIN meja.
6. Bila dipakai secara komersial, memindahkan aplikasi ke paket berbayar Vercel dan Supabase serta memakai domain sendiri.

#! DAFTAR PUSTAKA

Chen, P. P. (1976). The Entity-Relationship Model: Toward a Unified View of Data. *ACM Transactions on Database Systems*, 1(1), 9–36.

Connolly, T., & Begg, C. (2015). *Database Systems: A Practical Approach to Design, Implementation, and Management* (6th ed.). Pearson.

Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.

Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3rd ed.). Addison-Wesley.

Mendelow, A. (1991). Stakeholder Mapping. *Proceedings of the 2nd International Conference on Information Systems*. Cambridge, MA.

Myers, G. J., Sandler, C., & Badgett, T. (2011). *The Art of Software Testing* (3rd ed.). John Wiley & Sons.

Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education.

Project Management Institute. (2021). *A Guide to the Project Management Body of Knowledge (PMBOK Guide)* (7th ed.). Project Management Institute.

Rosa, A. S., & Shalahuddin, M. (2018). *Rekayasa Perangkat Lunak Terstruktur dan Berorientasi Objek* (Edisi revisi). Informatika.

Schwalbe, K. (2019). *Information Technology Project Management* (9th ed.). Cengage Learning.

Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.

Supabase. (2026). *Row Level Security*. Diakses dari https://supabase.com/docs/guides/database/postgres/row-level-security

W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. Diakses dari https://www.w3.org/TR/WCAG21/

#! LAMPIRAN

## Lampiran 1. Berita Acara Serah Terima (BAST)

<<<
<p style="font-family:'Times New Roman',serif;font-size:12pt;font-weight:bold;text-align:center;line-height:1.5;margin:6pt 0 12pt 0">BERITA ACARA SERAH TERIMA PEKERJAAN<br>Nomor: 01/BAST/RECOFFEE/XI/2026</p>
>>>

Pada hari ini, Sabtu, tanggal 21 November 2026, yang bertanda tangan di bawah ini:

Tabel: Para pihak dalam serah terima
| Pihak | Nama | Jabatan |
| --- | --- | --- |
| Pihak pertama (yang menyerahkan) | Khairunisa Yulia Cahyani | Project manager proyek RE:coffee |
| Pihak kedua (yang menerima) | .................................... | Pemilik kafe RE:coffee |

Pihak pertama menyerahkan hasil pekerjaan kepada pihak kedua, dan pihak kedua menerima hasil pekerjaan tersebut, dengan rincian sebagai berikut:

Tabel: Daftar hasil pekerjaan yang diserahkan
| No | Hasil pekerjaan | Keterangan |
| --- | --- | --- |
| 1 | Aplikasi web RE:coffee | Dapat diakses di https://recoffee-ten.vercel.app |
| 2 | Kode sumber dan migrasi database | Repositori GitHub |
| 3 | 28 QR code meja | Berkas SVG dan halaman siap cetak |
| 4 | Dokumen proyek | Project charter, WBS, jadwal, anggaran, risiko, analisis, perancangan, dan laporan pengujian |
| 5 | Laporan akhir proyek | Dokumen ini |

Catatan: gambar QRIS kafe dipasang setelah diserahkan oleh pihak kedua (bug B-03).

Demikian berita acara ini dibuat untuk dipergunakan sebagaimana mestinya.

Tabel: Tanda tangan serah terima
| Pihak pertama | Pihak kedua |
| --- | --- |
| (Khairunisa Yulia Cahyani) | (....................................) |

## Lampiran 2. Formulir Lembar Jawaban UAT

Tabel: Lembar jawaban UAT per peserta
| Peserta | Peran | Perangkat | P1 sampai P6 atau K1 sampai K4 | Skor kuesioner 1 sampai 5 | Kendala yang terlihat |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

Isi kolom tugas dengan S (selesai sendiri), B (selesai setelah ragu), atau G (gagal atau perlu dibantu).
