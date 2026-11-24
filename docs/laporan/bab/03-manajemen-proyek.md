# BAB III MANAJEMEN PROYEK

## 3.1 Gambaran Umum Proyek

RE:coffee adalah sistem pemesanan kafe berbasis web. Setiap meja di kafe diberi QR code yang membuka halaman menu untuk meja tersebut. Pelanggan memilih menu, masuk dengan akun Google, lalu mengirim pesanan dari meja. Semua pesanan dari satu meja selama satu kunjungan dikumpulkan dalam satu sesi meja sehingga tagihannya menjadi satu. Kasir memantau 28 meja dari dasbor, memproses antrean pesanan, dan mengonfirmasi pembayaran. Manajer kafe mengelola daftar menu dan melihat ringkasan penjualan hari berjalan.

Tabel: Identitas proyek
| Item | Keterangan |
| --- | --- |
| Nama proyek | RE:coffee, sistem pemesanan kafe berbasis meja dengan QR code |
| Jenis sistem | Aplikasi web (single page application) untuk HP pelanggan dan laptop kasir |
| Klien | Pemilik kafe RE:coffee (28 meja, layanan makan di tempat) |
| Sponsor dan penilai | Dosen pengampu mata kuliah Manajemen Proyek Perangkat Lunak |
| Project manager | Khairunisa Yulia Cahyani (NIM 241011701074) |
| Durasi | 5 minggu, 19 Oktober sampai 21 November 2026 |
| Hari kerja | Senin sampai Sabtu, 6 jam per hari (30 hari kerja) |
| Teknologi | React, TypeScript, Vite, Tailwind CSS, Supabase (PostgreSQL dan Auth), Vercel |
| Alamat aplikasi | https://recoffee-ten.vercel.app |
| Versi dokumen | 1.0, November 2026 |

## 3.2 Skenario Proyek Akademik

Proyek ini adalah tugas mata kuliah yang dikerjakan secara individu. Agar seluruh praktik manajemen proyek dapat diterapkan, laporan ini memakai skenario berikut: penulis berperan sebagai project manager yang diberi waktu lima minggu oleh pemilik kafe untuk membangun sistem pemesanan. Semua peran dalam tim (project manager, system analyst, UI/UX designer, programmer, dan tester) dijalankan oleh penulis sendiri. Karena itu biaya sumber daya manusia dihitung per peran dengan tarif yang berbeda, walaupun pelaksananya satu orang.

Jadwal lima minggu, estimasi PERT, dan anggaran pada bab ini adalah rencana dalam skenario tersebut. Tarif per jam dan biaya operasional adalah asumsi untuk keperluan simulasi, bukan biaya yang benar-benar dibayarkan. Aplikasi, database, hasil pengujian, dan tangkapan layar yang dibahas pada BAB IV dan BAB V adalah hasil nyata yang dapat diperiksa di alamat aplikasi. Implementasi dibantu AI coding assistant, sehingga fase pemrograman di lapangan berlangsung lebih cepat daripada estimasi.

## 3.3 Project Charter

### 3.3.1 Latar Belakang dan Tujuan

Kafe RE:coffee masih memproses pesanan secara manual. Pelanggan antre ke kasir setiap kali memesan, pesanan tambahan dicatat di kertas, dan tagihan meja dihitung ulang di akhir kunjungan. Saat ramai, terjadi antrean panjang, salah catat, dan salah hitung. Pemilik kafe menginginkan sistem yang membuat pelanggan dapat memesan dari meja, menyatukan tagihan per meja secara otomatis, dan memberi kasir gambaran status seluruh meja.

Tujuan terukur proyek adalah:

1. Pelanggan dapat memesan dari meja dengan paling banyak empat langkah setelah login pertama.
2. Semua pesanan satu kunjungan tercatat dalam satu sesi meja dengan total yang dihitung database.
3. Kasir melihat status 28 meja dalam satu layar yang diperbarui paling lama setiap 5 detik.
4. Sistem selesai, lulus pengujian black box prioritas tinggi, dan ter-deploy sebelum akhir minggu ke-5.

### 3.3.2 Deliverable dan Milestone

Tabel: Deliverable utama proyek
| No | Deliverable | Paket kerja WBS | Penerima |
| --- | --- | --- | --- |
| 1 | Project charter dan rencana proyek (WBS, jadwal, anggaran, risiko) | 1.1 sampai 1.4 | Klien, dosen |
| 2 | Dokumen analisis dan perancangan (kebutuhan, use case, activity, sequence, user flow, ERD, LRS, mockup) | 2.1 sampai 2.4 | Klien |
| 3 | Aplikasi web yang berjalan di Vercel beserta kode sumber | 3.1 sampai 3.4 | Klien |
| 4 | Laporan pengujian (unit, black box, UAT) | 4.1 sampai 4.2 | Klien, dosen |
| 5 | 28 QR code meja siap cetak | 4.3 | Klien |
| 6 | Laporan akhir, demo, dan berita acara serah terima | 4.4 | Klien, dosen |

Tabel: Milestone proyek
| Kode | Milestone | Target | Kriteria tercapai |
| --- | --- | --- | --- |
| MS-1 | Charter dan rencana proyek disetujui | Jumat, 23 Oktober 2026 (akhir minggu 1) | Klien menyetujui ruang lingkup, jadwal, dan anggaran |
| MS-2 | Rancangan sistem disetujui | Senin, 2 November 2026 (awal minggu 3) | ERD, LRS, use case, dan mockup ditinjau klien tanpa perubahan struktur |
| MS-3 | Aplikasi ter-deploy di Vercel | Jumat, 13 November 2026 (minggu 4) | Alur pesan sampai konfirmasi bayar berjalan di alamat produksi |
| MS-4 | Pengujian dan UAT selesai | Selasa, 17 November 2026 (minggu 5) | Kasus uji prioritas tinggi lulus, hasil UAT tercatat |
| MS-5 | Serah terima | Sabtu, 21 November 2026 (akhir minggu 5) | Laporan akhir diserahkan dan BAST ditandatangani |

### 3.3.3 Ringkasan Anggaran, Risiko, Asumsi, dan Kendala

Perkiraan total biaya proyek adalah **Rp10.095.250**, terdiri atas biaya SDM Rp8.777.500, biaya infrastruktur Rp0 karena memakai paket gratis, biaya operasional Rp400.000, dan cadangan tak terduga 10 persen. Rinciannya ada pada subbab 3.10. Risiko utama proyek adalah database Supabase ter-pause karena tidak aktif, login Google gagal di alamat produksi, perubahan ruang lingkup dari klien, dan kebocoran data pelanggan. Daftar lengkapnya ada pada subbab 3.11.

Asumsi yang dipakai:

1. Satu meja satu tagihan. Siapa pun yang memindai QR meja itu masuk ke tagihan yang sama.
2. Pelanggan memiliki HP berkamera, koneksi internet, dan akun Google.
3. Pembayaran memakai QRIS statis berupa gambar atau tunai di kasir, dan kasir memverifikasinya secara manual.
4. Kasir dan manajer memiliki akun Google yang email-nya didaftarkan sebagai admin.

Kendala proyek:

1. Waktu tetap lima minggu.
2. Satu orang menjalankan seluruh peran.
3. Infrastruktur memakai paket gratis Vercel dan Supabase dengan batas kuota.
4. Aplikasi Google OAuth berstatus Testing, sehingga hanya akun yang didaftarkan sebagai Test user yang bisa login.

### 3.3.4 Kriteria Keberhasilan dan Persetujuan

Tabel: Kriteria keberhasilan proyek
| No | Kriteria | Cara mengukur |
| --- | --- | --- |
| 1 | Seluruh kasus uji black box berprioritas tinggi lulus | Tabel hasil pengujian pada BAB V |
| 2 | Alur pesan, minta bill, konfirmasi bayar, dan meja kembali kosong berjalan tanpa galat di alamat produksi | Demo di https://recoffee-ten.vercel.app |
| 3 | Proyek selesai dalam 30 hari kerja | Perbandingan jadwal rencana dan realisasi |
| 4 | Biaya tidak melebihi anggaran termasuk cadangan | Perbandingan anggaran dan realisasi |
| 5 | Dokumen manajemen proyek lengkap | Laporan akhir ini |

Tabel: Lembar persetujuan project charter
| Peran | Nama | Tanda tangan | Tanggal |
| --- | --- | --- | --- |
| Project manager | Khairunisa Yulia Cahyani | | 23 Oktober 2026 |
| Klien | Pemilik kafe RE:coffee | | 23 Oktober 2026 |
| Mengetahui, dosen pengampu | Gusmayeni, S.Kom., M.Kom. | | |

## 3.4 Stakeholder dan Organisasi Proyek

### 3.4.1 Identifikasi Stakeholder

Tabel: Daftar stakeholder proyek
| Stakeholder | Peran dalam proyek | Kepentingan | Kekuasaan | Strategi |
| --- | --- | --- | --- | --- |
| Pemilik kafe | Klien, pemberi kebutuhan, penyetuju hasil | Tinggi | Tinggi | Kelola erat: rapat mingguan dan persetujuan tiap milestone |
| Dosen pengampu | Sponsor akademik dan penilai | Tinggi | Tinggi | Kelola erat: laporan progres dan laporan akhir |
| Kasir dan barista | Pengguna halaman admin setiap hari | Tinggi | Rendah | Beri informasi: dilibatkan dalam UAT |
| Pelanggan kafe | Pengguna halaman meja | Tinggi | Rendah | Beri informasi: dilibatkan dalam UAT |
| Penyedia layanan (Vercel, Supabase, Google) | Penyedia infrastruktur | Rendah | Sedang | Pantau: perubahan kuota dan kebijakan |

![Pemetaan stakeholder dengan grid kekuasaan dan kepentingan](stakeholder.png){12}

### 3.4.2 Struktur Organisasi Proyek

Proyek dijalankan oleh satu orang yang memegang lima peran. Project manager bertanggung jawab langsung kepada klien dan dilaporkan kepada dosen pengampu sebagai sponsor akademik.

![Struktur organisasi proyek RE:coffee](org.png){13}

Tabel: Tanggung jawab setiap peran
| Peran | Tanggung jawab |
| --- | --- |
| Project manager | Menyusun charter dan rencana proyek, memantau jadwal dan biaya, mengelola risiko dan perubahan, berkomunikasi dengan klien, menyusun laporan akhir dan serah terima |
| System analyst | Menganalisis kebutuhan dan data, membuat use case, activity, sequence, user flow, ERD, LRS, dan kamus data |
| UI/UX designer | Menyusun design system dan mockup halaman pelanggan, kasir, dan manajer |
| Programmer | Membangun database, RLS, dan function di Supabase, frontend pelanggan dan admin, integrasi, dan deployment |
| Tester | Menyusun kasus uji, menjalankan unit test, black box, dan UAT, serta mencatat bug |

### 3.4.3 Matriks RACI

Tabel: Matriks RACI per fase WBS
| Fase | PM | System analyst | UI/UX | Programmer | Tester | Klien |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Inisiasi dan perencanaan | A, R | C | I | C | I | C |
| 2 Analisis dan perancangan | A | R | R | C | C | C |
| 3 Implementasi | A | C | C | R | I | I |
| 4 Pengujian dan penutupan | A, R | I | I | R | R | C |

Keterangan: R = Responsible, A = Accountable, C = Consulted, I = Informed.

## 3.5 Kebutuhan Klien dan Analisis SWOT

### 3.5.1 Kebutuhan Klien

Hasil kick-off dengan pemilik kafe pada minggu pertama dirangkum menjadi kebutuhan berikut:

1. Pelanggan dapat memesan dari meja dengan memindai QR code, tanpa memasang aplikasi.
2. Pelanggan boleh memesan berkali-kali selama duduk, dan semua pesanan masuk ke satu tagihan meja.
3. Setiap pesanan harus jelas siapa pemesannya untuk mencegah pesanan iseng, sehingga pelanggan masuk dengan akun Google dan mengisi nama serta nomor HP sekali.
4. Pelanggan dapat meminta bill dan memilih bayar dengan QRIS atau di kasir.
5. Kasir melihat semua meja dalam satu layar beserta status kosong, terisi, atau minta bill.
6. Barista memproses pesanan urut dari yang terlama dengan status baru, diproses, dan diantar.
7. Manajer dapat menambah dan mengubah menu, menandai menu habis, dan mengarsipkan menu tanpa merusak riwayat tagihan.
8. Harga tidak boleh bisa diubah dari HP pelanggan.

### 3.5.2 Analisis SWOT

Tabel: Analisis SWOT sistem RE:coffee
| Aspek | Analisis |
| --- | --- |
| Strength (kekuatan) | Tidak perlu memasang aplikasi; satu tagihan per meja dihitung otomatis; harga dan aturan bisnis dijaga di database; biaya infrastruktur nol |
| Weakness (kelemahan) | Butuh koneksi internet dan akun Google; pembayaran masih dikonfirmasi manual; data diperbarui dengan polling sehingga ada jeda beberapa detik |
| Opportunity (peluang) | Integrasi payment gateway, laporan penjualan berkala, program loyalti, dan dukungan multi-cabang |
| Threat (ancaman) | Pesanan iseng dari luar kafe memakai foto QR; kuota paket gratis terlampaui; perubahan kebijakan layanan pihak ketiga |

## 3.6 Ruang Lingkup Proyek

### 3.6.1 Ruang Lingkup yang Dikerjakan

Tabel: Ruang lingkup yang dikerjakan per aktor
| Aktor | Kemampuan yang dibangun |
| --- | --- |
| Pelanggan | Membuka halaman meja lewat QR atau nomor meja 1 sampai 28; melihat menu per kategori dengan penanda habis; mengelola keranjang dan catatan; masuk dengan Google dan mengisi data diri; mengirim pesanan berkali-kali; melihat tagihan meja; minta bill dengan QRIS atau bayar di kasir |
| Kasir | Login Google; memantau denah 28 meja; membuka detail meja beserta pemesannya; mengonfirmasi pembayaran; membatalkan sesi; memproses antrean pesanan |
| Manajer kafe | Login Google; menambah, mengubah, menandai habis, dan mengarsipkan menu; melihat ringkasan penjualan hari ini |
| Teknis | Database PostgreSQL dengan Row Level Security dan function, deploy ke Vercel, 28 QR code siap cetak |

### 3.6.2 Di Luar Ruang Lingkup

Tabel: Fitur di luar ruang lingkup dan alasannya
| Fitur | Alasan |
| --- | --- |
| Payment gateway QRIS dinamis | Butuh akun merchant, biaya per transaksi, dan pengamanan tambahan |
| Login selain Google dan verifikasi OTP | Satu penyedia login mengurangi pekerjaan dan risiko; OTP butuh layanan berbayar |
| Takeaway, delivery, dan split bill | Proyek fokus pada makan di tempat dengan satu tagihan per meja |
| Laporan omzet berkala, grafik, dan ekspor | Di luar kebutuhan inti; yang disediakan hanya ringkasan hari ini |
| Stok bahan baku, promo, dan loyalti | Kompleksitas tinggi untuk waktu lima minggu |
| Multi-cabang dan notifikasi push | Satu kafe dan polling sudah mencukupi |

## 3.7 Work Breakdown Structure

### 3.7.1 Struktur WBS

Ruang lingkup proyek dipecah menjadi empat fase dan enam belas paket kerja. Setiap fase memiliki empat paket kerja dengan penomoran 1.1 sampai 4.4. Gambar berikut menunjukkan WBS dalam bentuk diagram pohon.

![Work Breakdown Structure proyek RE:coffee](wbs.png){15}

Dalam bentuk daftar berindentasi, WBS proyek adalah sebagai berikut.

Tabel: WBS dalam bentuk daftar
| Kode | Elemen WBS |
| --- | --- |
| 1 | **Inisiasi dan perencanaan** |
| 1.1 | Kick-off dan identifikasi kebutuhan klien |
| 1.2 | Project charter dan analisis stakeholder |
| 1.3 | Ruang lingkup, WBS, dan estimasi pekerjaan |
| 1.4 | Jadwal, anggaran, dan manajemen risiko |
| 2 | **Analisis dan perancangan** |
| 2.1 | Analisis kebutuhan dan analisis data |
| 2.2 | Pemodelan proses: use case, activity diagram, sequence diagram, user flow |
| 2.3 | Perancangan basis data: ERD, LRS, kamus data |
| 2.4 | Design system dan mockup antarmuka |
| 3 | **Implementasi** |
| 3.1 | Setup proyek dan database Supabase (tabel, RLS, function) |
| 3.2 | Frontend pelanggan |
| 3.3 | Frontend kasir dan manajer |
| 3.4 | Integrasi frontend dengan Supabase dan deployment ke Vercel |
| 4 | **Pengujian dan penutupan** |
| 4.1 | Unit test dan black box testing |
| 4.2 | User acceptance test (UAT) |
| 4.3 | Perbaikan bug, pembuatan QR meja, dan rilis |
| 4.4 | Laporan akhir, demo, dan serah terima |

### 3.7.2 Kamus WBS

Tabel: Kamus WBS
| Kode | Deskripsi pekerjaan | Hasil | Peran | Kriteria diterima |
| --- | --- | --- | --- | --- |
| 1.1 | Rapat awal dengan pemilik kafe, pengamatan alur pemesanan manual | Notulen kebutuhan klien | PM | Klien menyetujui daftar kebutuhan |
| 1.2 | Menyusun charter, identifikasi dan pemetaan stakeholder | Project charter, daftar stakeholder, RACI | PM | Charter ditandatangani klien |
| 1.3 | Menetapkan ruang lingkup, menyusun WBS, estimasi PERT | Dokumen ruang lingkup, WBS, kamus WBS, tabel PERT | PM | Seluruh pekerjaan tercakup (aturan 100%) |
| 1.4 | Menyusun jadwal, anggaran, daftar risiko, rencana komunikasi | Gantt chart, network diagram, anggaran, risk register | PM | Disetujui klien pada MS-1 |
| 2.1 | Menyusun kebutuhan fungsional dan non-fungsional, analisis data | Daftar FR dan NFR, DFD, matriks CRUD | System analyst | Setiap kebutuhan klien terpetakan ke FR |
| 2.2 | Memodelkan proses sistem | Use case diagram dan skenario, activity diagram, sequence diagram, user flow | System analyst | Setiap use case punya skenario dan diagram |
| 2.3 | Merancang struktur data | ERD notasi Chen, LRS, kamus data, normalisasi | System analyst | ERD, LRS, dan kamus data konsisten |
| 2.4 | Menyusun design system dan rancangan halaman | Token warna dan tipografi, komponen, mockup | UI/UX | Klien menyetujui tampilan pada MS-2 |
| 3.1 | Membuat proyek, migrasi SQL, RLS, function, seed | Repositori dan database Supabase | Programmer | Migrasi berjalan, uji RLS lulus |
| 3.2 | Membangun halaman beranda, menu, keranjang, data diri, tagihan | Frontend pelanggan | Programmer | Alur pesan berjalan dengan data uji |
| 3.3 | Membangun login admin, denah, detail meja, antrean, kelola menu, dasbor | Frontend kasir dan manajer | Programmer | Seluruh halaman admin berjalan |
| 3.4 | Menghubungkan frontend dengan Supabase, konfigurasi login, deploy | Aplikasi di Vercel | Programmer | Login Google berhasil di alamat produksi (MS-3) |
| 4.1 | Menulis dan menjalankan unit test serta kasus black box | Laporan pengujian | Tester | Kasus prioritas tinggi lulus |
| 4.2 | Menjalankan UAT bersama calon pengguna | Formulir dan rekap UAT | Tester | Hasil UAT tercatat (MS-4) |
| 4.3 | Memperbaiki bug temuan uji, membuat 28 QR meja, rilis final | Aplikasi final, QR siap cetak | Programmer | Bug prioritas tinggi tertutup |
| 4.4 | Menyusun laporan akhir, latihan demo, serah terima | Laporan akhir, BAST | PM | BAST ditandatangani (MS-5) |

## 3.8 Estimasi Pekerjaan

### 3.8.1 Metode dan Asumsi

Estimasi memakai teknik three-point (PERT) secara bottom-up untuk setiap paket kerja. Satuan yang dipakai adalah hari kerja dengan asumsi berikut:

1. Satu hari kerja sama dengan 6 jam efektif, karena pelaksana juga mengikuti perkuliahan.
2. Satu minggu terdiri atas 6 hari kerja (Senin sampai Sabtu), sehingga lima minggu sama dengan 30 hari kerja atau 180 jam.
3. Nilai O, M, dan P ditentukan dengan expert judgment berdasarkan kerumitan setiap paket kerja dan pengalaman mengerjakan tugas serupa.

### 3.8.2 Perhitungan PERT

Tabel: Estimasi durasi paket kerja dengan PERT (hari kerja)
| Kode | Paket kerja | Peran | O | M | P | TE | SD |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.1 | Kick-off dan identifikasi kebutuhan klien | PM | 0,5 | 1,0 | 2,0 | 1,08 | 0,25 |
| 1.2 | Project charter dan analisis stakeholder | PM | 0,5 | 1,0 | 2,0 | 1,08 | 0,25 |
| 1.3 | Ruang lingkup, WBS, dan estimasi pekerjaan | PM | 0,5 | 1,0 | 1,5 | 1,00 | 0,17 |
| 1.4 | Jadwal, anggaran, dan manajemen risiko | PM | 0,5 | 1,0 | 2,0 | 1,08 | 0,25 |
| 2.1 | Analisis kebutuhan dan analisis data | System analyst | 1,0 | 2,0 | 3,0 | 2,00 | 0,33 |
| 2.2 | Use case, activity, sequence, user flow | System analyst | 1,0 | 2,0 | 4,0 | 2,17 | 0,50 |
| 2.3 | ERD, LRS, kamus data | System analyst | 1,0 | 1,5 | 3,0 | 1,67 | 0,33 |
| 2.4 | Design system dan mockup antarmuka | UI/UX | 1,0 | 2,0 | 3,0 | 2,00 | 0,33 |
| 3.1 | Setup proyek dan database Supabase | Programmer | 1,5 | 2,0 | 4,0 | 2,25 | 0,42 |
| 3.2 | Frontend pelanggan | Programmer | 2,0 | 3,0 | 5,0 | 3,17 | 0,50 |
| 3.3 | Frontend kasir dan manajer | Programmer | 2,0 | 3,0 | 5,0 | 3,17 | 0,50 |
| 3.4 | Integrasi dan deployment Vercel | Programmer | 1,0 | 2,0 | 3,0 | 2,00 | 0,33 |
| 4.1 | Unit test dan black box testing | Tester | 1,0 | 2,0 | 3,0 | 2,00 | 0,33 |
| 4.2 | User acceptance test (UAT) | Tester | 0,5 | 1,0 | 2,0 | 1,08 | 0,25 |
| 4.3 | Perbaikan bug, QR meja, dan rilis | Programmer | 0,5 | 1,0 | 2,0 | 1,08 | 0,25 |
| 4.4 | Laporan akhir, demo, dan serah terima | PM | 1,0 | 2,0 | 3,0 | 2,00 | 0,33 |
| | **Total** | | | | | **28,83** | |

Contoh perhitungan untuk paket kerja 3.2 Frontend pelanggan:

> TE = (2 + 4 × 3 + 5) / 6 = 19 / 6 = 3,17 hari

> SD = (5 − 2) / 6 = 0,50 hari

### 3.8.3 Peluang Selesai Tepat Waktu

Karena seluruh paket kerja dikerjakan satu orang secara berurutan, seluruh paket kerja berada pada jalur yang menentukan durasi proyek. Durasi harapan proyek adalah jumlah seluruh TE, yaitu **28,83 hari kerja** (sekitar 173 jam). Jumlah varian seluruh paket kerja adalah 1,931, sehingga simpangan baku proyek adalah √1,931 = **1,39 hari**.

Peluang proyek selesai dalam batas 30 hari kerja dihitung sebagai berikut:

> Z = (30 − 28,83) / 1,39 = 0,84

Berdasarkan tabel distribusi normal, Z = 0,84 setara dengan peluang **79,9 persen**. Artinya rencana ini cukup realistis, tetapi cadangan waktu hanya 1,17 hari. Karena itu pengendalian perubahan ruang lingkup (subbab 3.14) menjadi penting: satu permintaan perubahan besar dapat menghabiskan cadangan tersebut.

Tabel: Rekap estimasi per fase
| Fase | TE (hari) | Jam | Porsi |
| --- | --- | --- | --- |
| 1 Inisiasi dan perencanaan | 4,25 | 25,5 | 14,7% |
| 2 Analisis dan perancangan | 7,83 | 47,0 | 27,2% |
| 3 Implementasi | 10,58 | 63,5 | 36,7% |
| 4 Pengujian dan penutupan | 6,17 | 37,0 | 21,4% |
| **Total** | **28,83** | **173,0** | **100%** |

## 3.9 Penjadwalan Proyek

### 3.9.1 Ketergantungan Aktivitas dan Network Diagram

Ketergantungan antarpaket kerja ditentukan secara logis, yaitu pekerjaan apa yang harus selesai sebelum pekerjaan lain dapat dimulai. Analisis data (2.1) menjadi dasar bagi pemodelan proses (2.2) dan perancangan basis data (2.3). Database (3.1) dibangun dari LRS (2.3), sedangkan frontend (3.2 dan 3.3) membutuhkan desain antarmuka (2.4) dan database yang sudah siap.

Tabel: Ketergantungan antarpaket kerja
| Kode | Paket kerja | Pendahulu | TE (hari) |
| --- | --- | --- | --- |
| 1.1 | Kick-off dan kebutuhan klien | - | 1,08 |
| 1.2 | Project charter dan stakeholder | 1.1 | 1,08 |
| 1.3 | Ruang lingkup, WBS, estimasi | 1.2 | 1,00 |
| 1.4 | Jadwal, anggaran, risiko | 1.3 | 1,08 |
| 2.1 | Analisis kebutuhan dan data | 1.4 | 2,00 |
| 2.2 | Use case, activity, sequence, user flow | 2.1 | 2,17 |
| 2.3 | ERD, LRS, kamus data | 2.1 | 1,67 |
| 2.4 | Design system dan mockup | 2.2 | 2,00 |
| 3.1 | Setup proyek dan database | 2.3 | 2,25 |
| 3.2 | Frontend pelanggan | 2.4, 3.1 | 3,17 |
| 3.3 | Frontend kasir dan manajer | 2.4, 3.1 | 3,17 |
| 3.4 | Integrasi dan deployment | 3.2, 3.3 | 2,00 |
| 4.1 | Unit test dan black box | 3.4 | 2,00 |
| 4.2 | UAT | 4.1 | 1,08 |
| 4.3 | Perbaikan bug, QR, rilis | 4.2 | 1,08 |
| 4.4 | Laporan, demo, serah terima | 4.3 | 2,00 |

![Network diagram proyek. Kotak berwarna adalah aktivitas pada jalur kritis](network.png){16}

Dari network diagram terdapat dua jalur di fase analisis dan perancangan. Jalur 2.1, 2.2, 2.4 berdurasi 2,00 + 2,17 + 2,00 = 6,17 hari, sedangkan jalur 2.1, 2.3, 3.1 berdurasi 2,00 + 1,67 + 2,25 = 5,92 hari. Jalur pertama lebih panjang, sehingga jalur kritis proyek adalah **1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.4, 3.2 dan 3.3, 3.4, 4.1, 4.2, 4.3, 4.4** dengan durasi 21,75 hari. Paket kerja 2.3 dan 3.1 memiliki slack 0,25 hari.

Durasi 21,75 hari hanya berlaku bila aktivitas paralel dikerjakan orang yang berbeda. Karena seluruh peran dijalankan satu orang, dilakukan resource leveling: paket kerja 2.3 dan 3.1 dikerjakan setelah 2.2, dan 3.3 dikerjakan setelah 3.2. Akibatnya durasi proyek menjadi 21,75 + 3,92 + 3,17 = **28,83 hari kerja**, sama dengan jumlah seluruh TE pada subbab 3.8.

### 3.9.2 Jadwal Pelaksanaan

Tabel: Jadwal pelaksanaan setelah resource leveling
| Kode | Paket kerja | Mulai | Selesai | Minggu |
| --- | --- | --- | --- | --- |
| 1.1 | Kick-off dan kebutuhan klien | Sen, 19/10 | Sel, 20/10 | 1 |
| 1.2 | Project charter dan stakeholder | Sel, 20/10 | Rab, 21/10 | 1 |
| 1.3 | Ruang lingkup, WBS, estimasi | Rab, 21/10 | Kam, 22/10 | 1 |
| 1.4 | Jadwal, anggaran, risiko | Kam, 22/10 | Jum, 23/10 | 1 |
| 2.1 | Analisis kebutuhan dan data | Jum, 23/10 | Sen, 26/10 | 1 sampai 2 |
| 2.2 | Use case, activity, sequence, user flow | Sen, 26/10 | Rab, 28/10 | 2 |
| 2.3 | ERD, LRS, kamus data | Rab, 28/10 | Jum, 30/10 | 2 |
| 2.4 | Design system dan mockup | Jum, 30/10 | Sen, 2/11 | 2 sampai 3 |
| 3.1 | Setup proyek dan database | Sen, 2/11 | Rab, 4/11 | 3 |
| 3.2 | Frontend pelanggan | Rab, 4/11 | Sab, 7/11 | 3 |
| 3.3 | Frontend kasir dan manajer | Sab, 7/11 | Rab, 11/11 | 3 sampai 4 |
| 3.4 | Integrasi dan deployment | Rab, 11/11 | Jum, 13/11 | 4 |
| 4.1 | Unit test dan black box | Jum, 13/11 | Sen, 16/11 | 4 sampai 5 |
| 4.2 | UAT | Sen, 16/11 | Sel, 17/11 | 5 |
| 4.3 | Perbaikan bug, QR, rilis | Sel, 17/11 | Rab, 18/11 | 5 |
| 4.4 | Laporan, demo, serah terima | Rab, 18/11 | Jum, 20/11 | 5 |
| | Cadangan waktu | Jum, 20/11 | Sab, 21/11 | 5 |

Tanggal mulai dan selesai pada tabel di atas memakai hari kerja Senin sampai Sabtu. Satu paket kerja dapat dimulai pada hari yang sama dengan selesainya paket kerja sebelumnya karena durasinya berupa pecahan hari.

### 3.9.3 Gantt Chart

![Gantt chart proyek RE:coffee selama lima minggu](gantt.png){16}

Tabel: Rencana kegiatan per minggu
| Minggu | Tanggal | Fokus kegiatan | Milestone |
| --- | --- | --- | --- |
| 1 | 19 sampai 24 Oktober | Kick-off, charter, WBS, estimasi, jadwal, anggaran, risiko, awal analisis kebutuhan | MS-1 charter disetujui |
| 2 | 26 sampai 31 Oktober | Analisis data, use case, activity, sequence, user flow, ERD, LRS, design system | - |
| 3 | 2 sampai 7 November | Mockup final, database Supabase dengan RLS, frontend pelanggan | MS-2 rancangan disetujui |
| 4 | 9 sampai 14 November | Frontend kasir dan manajer, integrasi, deployment, mulai pengujian | MS-3 aplikasi ter-deploy |
| 5 | 16 sampai 21 November | Black box, UAT, perbaikan bug, QR meja, laporan, serah terima | MS-4 dan MS-5 |

## 3.10 Anggaran Biaya

### 3.10.1 Biaya Sumber Daya Manusia

Biaya SDM dihitung dari jam kerja setiap peran hasil estimasi PERT dikalikan tarif per jam. Tarif adalah asumsi untuk simulasi yang disesuaikan dengan tingkat pekerja lepas pemula, karena pelaksana masih mahasiswa.

Tabel: Biaya SDM per peran
| Peran | Paket kerja | Hari (TE) | Jam | Tarif per jam | Subtotal |
| --- | --- | --- | --- | --- | --- |
| Project manager | 1.1, 1.2, 1.3, 1.4, 4.4 | 6,25 | 37,5 | Rp50.000 | Rp1.875.000 |
| System analyst | 2.1, 2.2, 2.3 | 5,83 | 35,0 | Rp45.000 | Rp1.575.000 |
| UI/UX designer | 2.4 | 2,00 | 12,0 | Rp40.000 | Rp480.000 |
| Programmer | 3.1, 3.2, 3.3, 3.4, 4.3 | 11,67 | 70,0 | Rp60.000 | Rp4.200.000 |
| Tester | 4.1, 4.2 | 3,08 | 18,5 | Rp35.000 | Rp647.500 |
| **Total** | | **28,83** | **173,0** | | **Rp8.777.500** |

Tabel: Biaya SDM per paket kerja
| Kode | Paket kerja | Jam | Biaya |
| --- | --- | --- | --- |
| 1.1 | Kick-off dan kebutuhan klien | 6,5 | Rp325.000 |
| 1.2 | Project charter dan stakeholder | 6,5 | Rp325.000 |
| 1.3 | Ruang lingkup, WBS, estimasi | 6,0 | Rp300.000 |
| 1.4 | Jadwal, anggaran, risiko | 6,5 | Rp325.000 |
| 2.1 | Analisis kebutuhan dan data | 12,0 | Rp540.000 |
| 2.2 | Use case, activity, sequence, user flow | 13,0 | Rp585.000 |
| 2.3 | ERD, LRS, kamus data | 10,0 | Rp450.000 |
| 2.4 | Design system dan mockup | 12,0 | Rp480.000 |
| 3.1 | Setup proyek dan database | 13,5 | Rp810.000 |
| 3.2 | Frontend pelanggan | 19,0 | Rp1.140.000 |
| 3.3 | Frontend kasir dan manajer | 19,0 | Rp1.140.000 |
| 3.4 | Integrasi dan deployment | 12,0 | Rp720.000 |
| 4.1 | Unit test dan black box | 12,0 | Rp420.000 |
| 4.2 | UAT | 6,5 | Rp227.500 |
| 4.3 | Perbaikan bug, QR, rilis | 6,5 | Rp390.000 |
| 4.4 | Laporan, demo, serah terima | 12,0 | Rp600.000 |
| | **Total** | **173,0** | **Rp8.777.500** |

### 3.10.2 Biaya Infrastruktur dan Operasional

Tabel: Biaya infrastruktur
| Item | Kegunaan | Paket | Biaya |
| --- | --- | --- | --- |
| Hosting frontend | Menjalankan aplikasi di https://recoffee-ten.vercel.app | Vercel Hobby | Rp0 |
| Database dan autentikasi | PostgreSQL, RLS, login Google | Supabase Free | Rp0 |
| Repositori kode | Kode sumber dan workflow keep-alive | GitHub Free | Rp0 |
| Login Google | OAuth client | Google Cloud, mode Testing | Rp0 |
| Domain | Subdomain vercel.app | - | Rp0 |
| Perangkat keras | Laptop dan HP milik pelaksana | Tidak dibebankan | Rp0 |
| **Total** | | | **Rp0** |

Tabel: Biaya operasional (asumsi)
| Item | Rincian | Biaya |
| --- | --- | --- |
| Kuota internet | 5 minggu | Rp150.000 |
| Listrik | Pemakaian laptop selama proyek | Rp100.000 |
| Cetak QR meja | 28 stiker × Rp2.500 | Rp70.000 |
| Cetak dan jilid laporan | 1 eksemplar | Rp80.000 |
| **Total** | | **Rp400.000** |

### 3.10.3 Rekapitulasi Anggaran

Tabel: Rekapitulasi anggaran proyek
| Komponen | Jumlah |
| --- | --- |
| Biaya SDM | Rp8.777.500 |
| Biaya infrastruktur | Rp0 |
| Biaya operasional | Rp400.000 |
| **Subtotal** | **Rp9.177.500** |
| Cadangan tak terduga 10% | Rp917.750 |
| **Total anggaran** | **Rp10.095.250** |

Tabel: Anggaran per fase
| Fase | Biaya SDM | Porsi |
| --- | --- | --- |
| 1 Inisiasi dan perencanaan | Rp1.275.000 | 14,5% |
| 2 Analisis dan perancangan | Rp2.055.000 | 23,4% |
| 3 Implementasi | Rp3.810.000 | 43,4% |
| 4 Pengujian dan penutupan | Rp1.637.500 | 18,7% |
| **Total** | **Rp8.777.500** | **100%** |

Cadangan tak terduga 10 persen disiapkan untuk risiko yang sudah teridentifikasi, misalnya kebutuhan beralih ke paket berbayar bila kuota gratis Supabase atau Vercel terlampaui. Bila sistem dipakai secara komersial, akan muncul biaya bulanan yang tidak dihitung dalam proyek ini: paket berbayar Vercel untuk penggunaan komersial, paket Supabase bila kuota terlampaui, domain sendiri, dan biaya transaksi payment gateway.

## 3.11 Manajemen Risiko

### 3.11.1 Skala Penilaian

Kemungkinan dan dampak dinilai dengan skala 1 sampai 3, yaitu 1 rendah, 2 sedang, dan 3 tinggi. Skor risiko adalah kemungkinan dikali dampak. Skor 6 sampai 9 berprioritas tinggi, skor 3 sampai 4 sedang, dan skor 1 sampai 2 rendah.

Tabel: Matriks kemungkinan dan dampak
| Kemungkinan / Dampak | Rendah (1) | Sedang (2) | Tinggi (3) |
| --- | --- | --- | --- |
| Tinggi (3) | 3 | 6: R7, R12 | 9 |
| Sedang (2) | 2: R5 | 4: R10 | 6: R1, R2, R8, R9, R11, R14 |
| Rendah (1) | 1 | 2: R3, R4 | 3: R6, R13 |

### 3.11.2 Daftar Risiko

Tabel: Risk register proyek
| ID | Risiko | K | D | Skor | Strategi | Respons | Pemilik |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Database Supabase ter-pause karena tidak aktif sebelum demo | 2 | 3 | 6 | Mitigasi | Workflow keep-alive tiap 3 hari, buka aplikasi H-1 demo | Programmer |
| R2 | Login Google gagal di alamat produksi karena redirect URL salah | 2 | 3 | 6 | Mitigasi | Daftarkan redirect URL, uji login segera setelah deploy | Programmer |
| R3 | Pesanan iseng, termasuk dari luar kafe memakai foto QR | 1 | 2 | 2 | Mitigasi | Wajib login Google dan data diri, kasir dapat membatalkan sesi | PM |
| R4 | Pelanggan pergi tanpa membayar | 1 | 2 | 2 | Terima | Denah menandai meja terisi, pembatalan sesi tercatat | Kasir |
| R5 | Pesanan dobel karena tombol ditekan berkali-kali | 2 | 1 | 2 | Mitigasi | Tombol dinonaktifkan selama permintaan diproses | Programmer |
| R6 | Konfigurasi RLS keliru sehingga data dapat diubah dari browser | 1 | 3 | 3 | Mitigasi | Tulis data pelanggan hanya lewat function, uji RLS wajib lulus | Tester |
| R7 | Perubahan ruang lingkup (scope creep) dari klien | 3 | 2 | 6 | Mitigasi | Prosedur permintaan perubahan, struktur data dikunci pada MS-2 | PM |
| R8 | Pelaksana tidak dapat menjelaskan sistem saat presentasi | 2 | 3 | 6 | Mitigasi | Latihan demo dan lembar jawaban pertanyaan umum | PM |
| R9 | Koneksi internet buruk saat demo | 2 | 3 | 6 | Mitigasi | Hotspot cadangan dan video demo | PM |
| R10 | Keterlambatan karena tugas kuliah lain | 2 | 2 | 4 | Mitigasi | Cadangan waktu 1,17 hari, pekerjaan inti didahulukan | PM |
| R11 | Pengguna gagal login karena aplikasi Google berstatus Testing | 2 | 3 | 6 | Mitigasi | Daftarkan penguji sebagai Test user sebelum UAT dan demo | Programmer |
| R12 | Slot proyek Supabase gratis penuh | 3 | 2 | 6 | Mitigasi | Pause proyek lain yang tidak dipakai | Programmer |
| R13 | Data diri pelanggan (nomor HP) bocor | 1 | 3 | 3 | Mitigasi | RLS hanya pemilik dan admin, tagihan bersama hanya menampilkan nama | Programmer |
| R14 | Ketergantungan pada satu akun Google admin | 2 | 3 | 6 | Mitigasi | Login dari perangkat presentasi jauh sebelum hari demo | PM |

Keterangan: K = kemungkinan, D = dampak.

### 3.11.3 Pemantauan Risiko

Daftar risiko ditinjau setiap akhir minggu bersamaan dengan laporan progres. Dua risiko benar-benar terjadi selama proyek. Risiko R7 terjadi pada minggu ke-3 dan ke-4 dalam bentuk beberapa permintaan revisi tampilan dan isi menu dari klien. Karena struktur data sudah dikunci pada MS-2, revisi tersebut cukup diselesaikan di sisi tampilan dan data menu tanpa mengubah ERD. Risiko R11 juga terjadi: mode Testing pada Google OAuth menolak akun yang belum didaftarkan, sehingga pendaftaran Test user dijadikan langkah wajib sebelum UAT.

## 3.12 Rencana Komunikasi

Tabel: Rencana komunikasi proyek
| Kegiatan | Penerima | Isi | Frekuensi | Media |
| --- | --- | --- | --- | --- |
| Kick-off | Klien | Kebutuhan, ruang lingkup, harapan | Sekali, minggu 1 | Tatap muka |
| Laporan progres | Klien | Pekerjaan selesai, rencana minggu depan, risiko | Setiap Sabtu | Pesan WhatsApp dan dokumen |
| Tinjauan milestone | Klien | Persetujuan charter, rancangan, aplikasi | Pada MS-1 sampai MS-5 | Tatap muka atau video call |
| Konsultasi | Dosen pengampu | Kemajuan dan kendala proyek | Sesuai jadwal kuliah | Kelas |
| Catatan progres | Tim (pelaksana) | Status setiap milestone, keputusan, bug | Setiap selesai pekerjaan | Berkas PROGRESS.md di repositori |
| Serah terima | Klien, dosen | Laporan akhir, demo, BAST | Sekali, minggu 5 | Tatap muka |

## 3.13 Manajemen Mutu

Mutu proyek dijaga dengan menetapkan kriteria mutu pada setiap deliverable dan memeriksanya sebelum milestone ditutup.

Tabel: Kriteria mutu per deliverable
| Deliverable | Standar mutu | Cara pemeriksaan |
| --- | --- | --- |
| Rancangan basis data | ERD, LRS, kamus data, dan migrasi SQL saling konsisten; tabel memenuhi 3NF | Pencocokan ERD dengan skema di Supabase |
| Kode program | TypeScript strict, lint lolos, build berhasil | `npm run lint` dan `npm run build` |
| Keamanan data | RLS aktif di semua tabel, tulis data pelanggan hanya lewat function | Skrip uji RLS dan aturan bisnis |
| Fungsi aplikasi | Kasus black box prioritas tinggi lulus | Tabel black box |
| Aksesibilitas | Kontras teks WCAG AA, target sentuh 44 px, fokus keyboard terlihat | Hitungan kontras dan audit axe-core |
| Kinerja | Bundle JavaScript awal di bawah 250 KB gzip | Hasil build |

## 3.14 Pengendalian Perubahan

Setiap permintaan perubahan dicatat, dinilai dampaknya terhadap ruang lingkup, jadwal, dan struktur data, lalu diputuskan bersama klien. Prinsip yang dipakai adalah: perubahan tampilan dan isi data boleh masuk selama cadangan waktu cukup, sedangkan perubahan yang menambah entitas atau relasi baru ditunda ke pengembangan berikutnya.

Tabel: Log permintaan perubahan
| No | Minggu | Permintaan | Diminta oleh | Keputusan | Dampak |
| --- | --- | --- | --- | --- | --- |
| CR-01 | 3 | Tampilan dinilai terlalu polos; ditambah gerak halus, latar bertema kopi, dan komponen umpan balik | Klien | Diterima | Aturan animasi minimal dilonggarkan, palet dan font tetap |
| CR-02 | 4 | Beranda menjadi landing page dengan kotak "Duduk di meja berapa?" | Klien | Diterima | Satu halaman bertambah fungsi, tidak ada tabel baru |
| CR-03 | 4 | Dasbor kasir berisi pendapatan hari ini, tagihan berjalan, pesanan menunggu, dan menu terlaris | Klien | Diterima sebagian | Hanya ringkasan hari ini, tanpa riwayat, grafik, atau ekspor |
| CR-04 | 4 | Isi menu diganti menjadi 22 menu kafe kekinian | Klien | Diterima | Hanya isi data; 12 menu lama diarsipkan, bukan dihapus |
| CR-05 | 4 | Alert dan notifikasi untuk semua aksi, ikon kategori baru | Klien | Diterima | Tambahan pustaka animasi dan notifikasi |
| CR-06 | 4 | Aplikasi Google tetap berstatus Testing | Klien | Diterima | Penguji harus didaftarkan sebagai Test user (R11) |
| CR-07 | 4 | Workflow keep-alive dan uji aksesibilitas otomatis | Project manager | Diterima | Mitigasi R1, tidak mengubah fitur |
| CR-08 | 4 | Alamat produksi menjadi recoffee-ten.vercel.app karena alamat awal sudah dipakai pihak lain | Project manager | Diterima | QR 28 meja dibuat untuk alamat ini |

Tidak ada permintaan perubahan yang menambah entitas atau relasi, sehingga ERD dan LRS tetap sama sejak MS-2. Seluruh perubahan diserap oleh cadangan waktu.
