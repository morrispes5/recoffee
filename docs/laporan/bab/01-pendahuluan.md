# BAB I PENDAHULUAN

## 1.1 Latar Belakang

Kafe dan coffee shop skala kecil sampai menengah kini menjadi tempat berkumpul, belajar, dan bekerja, terutama bagi mahasiswa dan pekerja muda. Pelanggan biasanya datang berkelompok, duduk cukup lama, dan memesan lebih dari sekali dalam satu kunjungan. Pola kunjungan seperti ini membuat proses pemesanan menjadi pekerjaan yang berulang sepanjang hari bagi kasir.

Di banyak kafe, pemesanan masih dilakukan secara manual. Pelanggan antre ke kasir setiap kali ingin memesan, termasuk untuk pesanan tambahan. Kasir mencatat pesanan di kertas atau di mesin kasir, lalu menyerahkan catatan itu ke barista. Saat pelanggan hendak pulang, tagihan satu meja dihitung ulang dari beberapa catatan yang terpisah. Ketika kafe sedang ramai, cara ini menimbulkan antrean panjang, pesanan yang terlewat atau tertukar meja, salah hitung tagihan, dan meja yang ditinggalkan sebelum dibayar karena kasir tidak tahu meja mana yang masih terisi.

Teknologi web dan QR code memberi jalan keluar yang murah. Setiap meja diberi QR code. Pelanggan cukup memindai QR dengan kamera HP, melihat menu di browser, lalu mengirim pesanan dari meja tanpa memasang aplikasi. Semua pesanan dari satu meja tercatat dalam satu tagihan yang dihitung otomatis oleh sistem, sedangkan kasir melihat status seluruh meja dari satu layar.

Membangun sistem seperti ini bukan hanya pekerjaan teknis. Kafe sebagai klien punya keterbatasan waktu dan biaya, kebutuhan yang bisa berubah di tengah jalan, dan harapan bahwa sistem siap dipakai pada tanggal tertentu. Karena itu proyek perlu dikelola dengan kaidah manajemen proyek perangkat lunak: ruang lingkup yang jelas, pembagian pekerjaan dalam Work Breakdown Structure (WBS), estimasi waktu dan biaya, jadwal, pengelolaan risiko, pengendalian perubahan, pengujian, dan serah terima.

Laporan ini mendokumentasikan proyek RE:coffee, yaitu sistem pemesanan kafe berbasis meja, dari sudut pandang seorang project manager yang diberi waktu lima minggu oleh pemilik kafe. Proyek dikerjakan secara individu, sehingga satu orang menjalankan beberapa peran sekaligus: project manager, system analyst, UI/UX designer, programmer, dan tester. Hasil akhirnya berupa aplikasi web yang sudah berjalan di https://recoffee-ten.vercel.app beserta seluruh dokumen pengelolaan proyeknya.

## 1.2 Identifikasi Masalah

Berdasarkan pengamatan terhadap proses pemesanan manual di kafe, masalah yang ditemukan adalah sebagai berikut.

Tabel: Identifikasi masalah pada proses pemesanan manual
| Kode | Masalah | Dampak |
| --- | --- | --- |
| P1 | Pelanggan harus antre ke kasir setiap kali menambah pesanan | Waktu tunggu lama dan antrean menumpuk saat ramai |
| P2 | Pesanan tambahan dicatat manual dan diteruskan ke barista secara lisan atau kertas | Pesanan terlewat atau diantar ke meja yang salah |
| P3 | Tagihan satu meja dihitung ulang secara manual di akhir kunjungan | Salah hitung dan selisih kas |
| P4 | Kasir tidak punya gambaran meja mana yang kosong, terisi, atau sudah minta bill | Meja tidak terkelola dan pelanggan bisa pergi sebelum membayar |
| P5 | Perubahan menu dan menu yang habis tidak langsung diketahui pelanggan | Pelanggan memesan menu yang ternyata tidak tersedia |

## 1.3 Rumusan Masalah

Dari identifikasi masalah di atas, rumusan masalah dalam proyek ini adalah:

1. Bagaimana merancang sistem yang memungkinkan pelanggan memesan langsung dari meja melalui QR code tanpa harus antre ke kasir?
2. Bagaimana mencatat semua pesanan dalam satu kunjungan sebagai satu tagihan meja yang totalnya dihitung otomatis dan tidak bisa dimanipulasi dari browser?
3. Bagaimana menyediakan tampilan bagi kasir untuk memantau status 28 meja, memproses antrean pesanan, dan mengonfirmasi pembayaran, serta tampilan bagi manajer kafe untuk mengelola menu dan melihat ringkasan penjualan harian?
4. Bagaimana mengelola proyek pembangunan sistem tersebut agar selesai dalam lima minggu dengan anggaran yang terkendali, risiko yang teridentifikasi, dan mutu yang terukur melalui pengujian?

## 1.4 Batasan Masalah

Agar proyek dapat diselesaikan dalam lima minggu, ruang lingkupnya dibatasi sebagai berikut:

1. Sistem ditujukan untuk satu kafe dengan 28 meja dan layanan makan di tempat (dine-in). Takeaway, delivery, dan multi-cabang tidak dibahas.
2. Pengguna sistem terdiri atas tiga aktor: pelanggan, kasir, dan manajer kafe. Kasir dan manajer memakai hak akses admin yang sama di sistem.
3. Pelanggan dan admin masuk menggunakan akun Google. Metode login lain dan verifikasi nomor HP melalui OTP tidak disediakan.
4. Pembayaran memakai QRIS statis berupa gambar atau bayar langsung di kasir. Pembayaran dikonfirmasi kasir secara manual; payment gateway tidak diintegrasikan.
5. Satu meja memiliki satu tagihan bersama (open bill). Pemisahan tagihan per orang (split bill) tidak disediakan.
6. Data diperbarui dengan polling setiap 5 sampai 10 detik, bukan websocket.
7. Laporan penjualan hanya berupa ringkasan hari berjalan di dasbor, tanpa riwayat, grafik berkala, atau ekspor.
8. Infrastruktur memakai paket gratis Vercel (hosting) dan Supabase (database dan autentikasi).

## 1.5 Tujuan

Tujuan proyek ini adalah:

1. Menghasilkan aplikasi web pemesanan kafe berbasis meja yang dapat dipakai pelanggan dari browser HP dengan alur paling banyak empat langkah setelah login pertama: scan, pilih menu, tinjau, kirim.
2. Mencatat seluruh pesanan satu kunjungan dalam satu sesi meja dengan total tagihan yang dihitung oleh database.
3. Menyediakan dasbor kasir yang menampilkan status 28 meja dan diperbarui otomatis paling lama setiap lima detik, serta halaman kelola menu dan ringkasan penjualan harian bagi manajer kafe.
4. Menerapkan manajemen proyek perangkat lunak secara utuh, meliputi project charter, WBS, estimasi PERT, jadwal, anggaran, manajemen risiko, pengendalian perubahan, pengujian, dan serah terima, sehingga proyek selesai dalam lima minggu.

## 1.6 Manfaat

Manfaat yang diharapkan dari proyek ini dibagi menurut pihak yang menerimanya.

Tabel: Manfaat proyek bagi setiap pihak
| Pihak | Manfaat |
| --- | --- |
| Pelanggan kafe | Memesan dari meja tanpa antre, melihat tagihan meja kapan saja, dan memilih cara bayar sendiri |
| Kasir dan barista | Menerima pesanan dalam antrean yang urut dari yang terlama, melihat status semua meja dalam satu layar, dan tidak perlu menghitung tagihan manual |
| Manajer kafe | Mengubah menu dan menandai menu habis secara langsung, serta melihat pendapatan dan menu terlaris hari ini |
| Penulis | Menerapkan teori manajemen proyek perangkat lunak pada proyek nyata, dari perencanaan sampai serah terima |
| Pembaca | Mendapat contoh dokumentasi proyek perangkat lunak skala kecil yang lengkap dan dapat ditiru |

## 1.7 Metodologi

Proyek dikelola mengikuti lima kelompok proses manajemen proyek menurut PMBOK, yaitu inisiasi, perencanaan, pelaksanaan, pemantauan dan pengendalian, serta penutupan. Untuk pengembangan perangkat lunaknya dipakai model **Waterfall dengan umpan balik**: tahap analisis, perancangan, implementasi, dan pengujian dikerjakan berurutan, tetapi hasil setiap tahap ditinjau bersama klien dan revisi kecil dari klien boleh masuk selama tidak mengubah struktur data yang sudah dikunci.

Model Waterfall dipilih karena tiga alasan. Pertama, kebutuhan kafe cukup jelas sejak awal dan ruang lingkupnya kecil. Kedua, waktu proyek tetap, yaitu lima minggu, sehingga urutan tahap yang tegas memudahkan pemantauan jadwal. Ketiga, struktur database (ERD dan LRS) perlu dikunci sebelum coding agar perubahan tampilan di kemudian hari tidak merembet ke data.

Tahapan proyek dan keluarannya diringkas pada tabel berikut.

Tabel: Tahapan proyek dan keluarannya
| Tahap | Minggu | Kegiatan utama | Keluaran |
| --- | --- | --- | --- |
| Inisiasi dan perencanaan | 1 | Kick-off, identifikasi kebutuhan klien, charter, WBS, estimasi, jadwal, anggaran, risiko | Project charter dan rencana proyek |
| Analisis dan perancangan | 1 sampai 2 | Kebutuhan fungsional dan non-fungsional, analisis data, use case, activity, sequence, user flow, ERD, LRS, desain antarmuka | Dokumen analisis dan rancangan yang disetujui klien |
| Implementasi | 3 sampai 4 | Database Supabase, frontend pelanggan, frontend kasir dan manajer, integrasi, deployment | Aplikasi web berjalan di Vercel |
| Pengujian dan penutupan | 4 sampai 5 | Unit test, black box, UAT, perbaikan bug, QR meja, laporan, serah terima | Laporan pengujian, aplikasi final, laporan akhir, BAST |

Data kebutuhan dikumpulkan melalui diskusi dengan pemilik kafe sebagai klien, pengamatan alur pemesanan manual, dan studi pustaka mengenai manajemen proyek dan sistem pemesanan berbasis QR code.

## 1.8 Sistematika Penulisan

Laporan ini terdiri atas enam bab dengan susunan sebagai berikut.

**BAB I Pendahuluan.** Berisi latar belakang, identifikasi masalah, rumusan dan batasan masalah, tujuan, manfaat, metodologi, dan sistematika penulisan.

**BAB II Landasan Teori.** Berisi teori yang mendasari proyek: manajemen proyek perangkat lunak, project charter, WBS, teknik estimasi PERT, penjadwalan, anggaran, manajemen risiko, pemodelan sistem dengan UML, ERD dan LRS, metode pengujian, serta teknologi yang dipakai.

**BAB III Manajemen Proyek.** Berisi gambaran umum proyek, project charter, stakeholder dan struktur organisasi proyek, analisis kebutuhan klien, ruang lingkup, WBS beserta kamusnya, estimasi pekerjaan dengan PERT, jadwal lima minggu, anggaran biaya, manajemen risiko, rencana komunikasi, dan pengendalian perubahan.

**BAB IV Analisis dan Perancangan Sistem.** Berisi kebutuhan fungsional dan non-fungsional, analisis data, use case diagram dan skenarionya, activity diagram, sequence diagram, user flow, perancangan database (ERD, transformasi ke LRS, kamus data), arsitektur sistem, dan rancangan antarmuka.

**BAB V Implementasi dan Pengujian.** Berisi lingkungan implementasi, struktur database di Supabase, tampilan aplikasi, deployment, serta hasil pengujian unit, black box, keamanan database, aksesibilitas, dan UAT.

**BAB VI Penutup.** Berisi kesimpulan, evaluasi pelaksanaan proyek, pelajaran yang didapat, dan saran pengembangan.
