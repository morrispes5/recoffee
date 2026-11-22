# BAB V IMPLEMENTASI DAN PENGUJIAN

## 5.1 Lingkungan Implementasi

Tabel: Lingkungan perangkat keras dan perangkat lunak
| Komponen | Spesifikasi |
| --- | --- |
| Perangkat pengembangan | Laptop dengan sistem operasi Windows 11 |
| Perangkat uji pelanggan | HP Android dengan browser Chrome, serta mode tampilan seluler pada Chrome desktop (lebar 360 dan 480 px) |
| Editor dan alat bantu | Visual Studio Code, Git, Node.js, Claude Code sebagai AI coding assistant |
| Bahasa dan pustaka | TypeScript, React, Vite, Tailwind CSS v4, React Router, TanStack Query, Zod |
| Backend | Supabase: PostgreSQL, Supabase Auth dengan Google OAuth |
| Pengujian | Vitest, React Testing Library, axe-core, skrip SQL |
| Hosting dan repositori | Vercel (paket Hobby), GitHub (repositori privat) |

## 5.2 Struktur Proyek

Kode sumber disusun per fitur agar setiap bagian mudah ditemukan dan diuji.

Tabel: Struktur folder kode sumber
| Folder | Isi |
| --- | --- |
| src/app | Router dan penyedia (provider) aplikasi |
| src/pages | Halaman: beranda, menu meja, tagihan, login admin, denah, detail meja, antrean, kelola menu |
| src/features | Logika per fitur: auth, cart, menu, meja, tagihan, profil, admin-dashboard, admin-meja, admin-antrian, admin-menu |
| src/components | Komponen antarmuka dasar (tombol, dialog, sheet, form) dan komponen tata letak |
| src/lib | Fungsi bantu: koneksi Supabase, format Rupiah, waktu WIB, penanganan galat |
| supabase/migrations | Lima berkas migrasi SQL berurutan |
| supabase/tests | Skrip uji aturan bisnis dan RLS |
| public/qr-meja | 28 QR code meja dalam format SVG dan halaman cetak |
| docs | Dokumen proyek, design system, dan catatan progres |

## 5.3 Implementasi Basis Data

### 5.3.1 Migrasi

Database dibangun dengan migrasi SQL berurutan sehingga struktur dapat dibuat ulang dengan hasil yang sama.

Tabel: Daftar migrasi database
| Berkas | Isi |
| --- | --- |
| 0001_schema.sql | Tipe enum, tabel meja, menu, sesi_meja, pelanggan, pesanan, item_pesanan, admin, constraint, indeks, dan view v_status_meja |
| 0002_auth_rls.sql | Function is_admin() dan kebijakan Row Level Security untuk setiap tabel |
| 0003_functions.sql | Function buat_pesanan, get_tagihan_meja, minta_bill, konfirmasi_bayar, batalkan_sesi, simpan_profil, serta trigger transisi status pesanan |
| 0004_trigger_search_path.sql | Pengamanan search_path pada function trigger |
| 0005_menu_kafe_gen_z.sql | Penggantian isi menu menjadi 22 menu kafe kekinian; menu lama diarsipkan |

### 5.3.2 Struktur Database di Supabase

Gambar berikut menunjukkan skema database yang berjalan di Supabase. Struktur tabel, kolom, dan relasinya sama dengan LRS pada subbab 4.9.5: tujuh tabel dengan kunci tamu yang sama, ditambah relasi pelanggan.id ke tabel akun auth.users milik Supabase Auth.

![Schema Visualizer database RE:coffee di Supabase](supabase-skema.jpg){16}

![Daftar tabel dan view pada skema public](supabase-tabel.jpg){16}

Tabel meja berisi 28 baris sesuai jumlah meja. Tabel menu berisi 34 baris, yaitu 22 menu aktif dan 12 menu lama yang diarsipkan. View v_status_meja menghitung status setiap meja dari sesi yang masih terbuka.

![Isi tabel menu pada Table Editor Supabase](supabase-data-menu.jpg){16}

### 5.3.3 Row Level Security dan Function

Setiap tabel mengaktifkan Row Level Security. Contohnya, tabel meja dan menu boleh dibaca publik, tabel pelanggan hanya boleh dibaca pemiliknya dan admin, sedangkan tabel item_pesanan dan admin hanya boleh dibaca admin.

![Kebijakan Row Level Security di Supabase](supabase-rls.jpg){16}

Logika yang menentukan kebenaran data ditempatkan di database function dengan mode SECURITY DEFINER, sehingga browser tidak pernah menulis langsung ke tabel transaksi.

![Daftar database function](supabase-function.jpg){16}

Tabel: Fungsi database dan perannya
| Function | Dipanggil oleh | Peran |
| --- | --- | --- |
| buat_pesanan | Pelanggan | Memvalidasi meja, item, jumlah, ketersediaan menu; memakai atau membuat sesi; menyimpan pesanan dengan harga dari tabel menu |
| get_tagihan_meja | Pelanggan | Mengembalikan pesanan satu sesi beserta nama pemesan, tanpa nomor HP pelanggan lain |
| minta_bill | Pelanggan | Mengubah sesi menjadi minta bill bila pelanggan sudah memesan di sesi itu |
| simpan_profil | Pelanggan | Memvalidasi dan menyimpan nama serta nomor HP |
| konfirmasi_bayar | Kasir | Memastikan pemanggil admin, menyimpan total_bayar, waktu tutup, dan email kasir |
| batalkan_sesi | Kasir | Mengubah sesi menjadi batal dan mencatat pelakunya |
| is_admin | Sistem | Memeriksa apakah email pada token login terdaftar di tabel admin |
| get_status_terakhir_meja | Pelanggan | Mengetahui apakah sesi terakhir sudah dibayar untuk menampilkan ucapan terima kasih |
| cek_transisi_pesanan | Trigger | Menolak perubahan status pesanan yang melompat |

## 5.4 Tampilan Aplikasi

### 5.4.1 Halaman Pelanggan

![Beranda dengan kotak input nomor meja](ui-beranda.jpg){7}

![Halaman menu meja dengan daftar harga per kategori](ui-menu-meja.png){7}

![Sheet keranjang sebelum pesanan dikirim](ui-keranjang.png){7}

![Permintaan masuk dengan Google saat mengirim pesanan tanpa login](tc26-kirim-tanpa-login.jpg){9}

![Form lengkapi data diri pada login pertama](tc27-lengkapi-data-diri.jpg){15}

![Validasi nama dan nomor HP pada form data diri](tc28-tc29-validasi-data-diri.jpg){15}

![Pesanan pertama berhasil terkirim](tc08-kirim-pesanan-pertama.jpg){15}

![Pesanan kedua masuk ke sesi dan tagihan yang sama](tc09-pesanan-kedua-satu-sesi.jpg){15}

![Halaman tagihan setelah bill diminta, tombol tambah pesanan nonaktif](tc12-bill-sudah-diminta.jpg){15}

![Panel QRIS dengan nominal yang harus dibayar](tc11-panel-qris.jpg){15}

### 5.4.2 Halaman Kasir dan Manajer

![Halaman login kasir dan manajer](ui-admin-masuk.png){14}

![Penolakan akun Google yang tidak terdaftar sebagai admin](tc14-akun-bukan-admin.png){8}

![Dasbor dengan ringkasan hari ini dan denah 28 meja; meja kuning berstatus minta bill](tc11-dasbor-meja-minta-bill.jpg){15}

![Detail meja dengan nama dan nomor HP pemesan serta dialog konfirmasi bayar](tc17-detail-meja-konfirmasi.jpg){15}

Dasbor menampilkan empat kartu ringkasan (pendapatan hari ini, tagihan berjalan, pesanan menunggu, dan minta bill), denah 28 meja, panel meja yang perlu ditagih, dan lima menu terlaris hari ini. Setiap meja menampilkan teks status dan total berjalan, bukan hanya warna.

## 5.5 Deployment

Aplikasi di-deploy ke Vercel dan terhubung dengan repositori GitHub, sehingga setiap perubahan pada cabang utama otomatis di-deploy ulang. Langkah deployment yang dilakukan adalah:

1. Menghubungkan repositori GitHub ke proyek Vercel dan mengisi variabel lingkungan alamat Supabase serta kunci publik (anon key).
2. Menambahkan aturan rewrite agar alamat dalam aplikasi seperti /meja/18/tagihan tetap terbuka saat halaman dimuat ulang.
3. Mendaftarkan alamat produksi https://recoffee-ten.vercel.app sebagai redirect URL pada Supabase Auth dan Google Cloud, lalu menguji login Google di alamat produksi.
4. Menjalankan workflow GitHub Actions keep-alive setiap tiga hari agar database Supabase paket gratis tidak di-pause karena tidak aktif.
5. Membuat 28 QR code meja yang mengarah ke https://recoffee-ten.vercel.app/meja/nomor beserta halaman siap cetak.

Ukuran bundle JavaScript awal hasil build adalah sekitar 161 KB gzip, di bawah batas 250 KB pada NFR-01.

## 5.6 Pengujian

### 5.6.1 Ringkasan Pengujian

Tabel: Ringkasan hasil pengujian
| Lapisan | Alat | Hasil |
| --- | --- | --- |
| Unit dan komponen | Vitest, Testing Library, axe-core | 94 tes lulus dari 13 berkas |
| Keamanan database tanpa login | Skrip rls_check.sql | 9 pemeriksaan lulus |
| Aturan bisnis database | Skrip aturan_bisnis.sql | 39 pemeriksaan lulus, 0 gagal |
| Black box lewat aplikasi | Browser Chrome | 29 kasus lulus lewat antarmuka, 2 lulus lewat uji database, 1 lulus sebagian dari 32 kasus |
| Aksesibilitas dasar | Hitungan kontras, audit label, keyboard, axe-core | 2 temuan, keduanya diperbaiki |
| Build dan lint | npm run build, npm run lint | Lolos |

### 5.6.2 Unit Test dan Uji Database

Unit test memeriksa fungsi bantu (format Rupiah, waktu WIB, validasi nomor meja, penerjemahan kode galat) dan komponen antarmuka (keranjang, form data diri, dialog, form menu admin, penjaga halaman admin). Uji database dijalankan sebagai skrip SQL yang berperan sebagai pelanggan A, B, dan C serta admin dengan klaim token login. Skrip diakhiri dengan pembatalan transaksi sehingga data uji tidak tertinggal di database.

### 5.6.3 Black Box Testing

Pengujian black box memakai teknik equivalence partitioning dan boundary value analysis. Kolom hasil menunjukkan cara pembuktiannya: lulus lewat antarmuka aplikasi, atau lulus lewat uji database untuk kasus yang membutuhkan dua sampai tiga akun Google sekaligus.

Tabel: Hasil black box testing
| ID | Skenario | Masukan atau langkah | Hasil yang diharapkan | Hasil |
| --- | --- | --- | --- | --- |
| TC-01 | Buka meja valid | /meja/18 | Menu tampil dengan judul Meja 18 | Lulus |
| TC-02 | Buka meja tidak valid (batas bawah) | /meja/0 | Pesan meja tidak ditemukan | Lulus |
| TC-03 | Buka meja tidak valid (batas atas) | /meja/29 | Pesan meja tidak ditemukan | Lulus |
| TC-04 | Tambah menu ke keranjang | Tekan tambah pada satu menu | Bar keranjang menampilkan 1 item dan harganya | Lulus |
| TC-05 | Jumlah batas atas | Tambah sampai 20, tekan tambah lagi | Jumlah tetap 20, tombol tambah nonaktif | Lulus |
| TC-06 | Menu habis | Manajer menandai menu habis, pelanggan memuat ulang | Label Habis, menu tidak bisa ditambah | Lulus |
| TC-07 | Menu habis saat dikirim | Item di keranjang, menu ditandai habis, pelanggan mengirim | Pesan menu baru saja habis, keranjang tetap | Lulus |
| TC-08 | Kirim pesanan pertama | Login dan data diri lengkap, keranjang berisi, kirim | Berhasil, meja terisi di denah, nama pemesan tampil di antrean | Lulus |
| TC-09 | Kirim pesanan kedua | Kirim lagi di meja yang sama | Masuk sesi yang sama, total bertambah | Lulus |
| TC-10 | Dua perangkat satu meja | Akun A dan B mengirim di meja 18 | Satu sesi, kedua pesanan tercatat dengan nama masing-masing | Lulus (uji database) |
| TC-11 | Minta bill dengan QRIS | Tagihan, Minta bill, QRIS | Gambar QRIS dan total tampil; meja kuning di denah | Sebagian |
| TC-12 | Pesan setelah minta bill | Coba tambah pesanan | Tombol nonaktif dan pesan bill sudah diminta | Lulus |
| TC-13 | Login admin terdaftar | Login Google dengan email terdaftar | Masuk ke dasbor dan denah | Lulus |
| TC-14 | Login admin tidak terdaftar | Login Google dengan email lain | Ditolak, keluar otomatis, pesan bukan admin | Lulus |
| TC-15 | Akses admin tanpa login | Buka /admin langsung | Dialihkan ke /admin/masuk | Lulus |
| TC-16 | Proses antrean | Baru, diproses, diantar | Status berubah, hilang dari antrean, pelanggan melihat status baru | Lulus |
| TC-17 | Konfirmasi bayar | Detail meja 18, konfirmasi | Meja kosong, pelanggan melihat ucapan terima kasih | Lulus |
| TC-18 | Konfirmasi tanpa minta bill | Sesi aktif dikonfirmasi dengan metode kasir | Berhasil, metode tersimpan kasir | Lulus |
| TC-19 | Batalkan sesi | Detail meja, batalkan, konfirmasi | Meja kosong, sesi berstatus batal | Lulus |
| TC-20 | Tambah menu valid | Nama, kategori, harga 18000 | Menu muncul di halaman pelanggan | Lulus |
| TC-21 | Tambah menu harga tidak valid | Harga 0 | Pesan validasi, data tidak tersimpan | Lulus |
| TC-22 | Arsipkan menu | Arsipkan satu menu | Hilang dari halaman pelanggan, tagihan lama tetap menampilkan namanya | Lulus |
| TC-23 | Ubah harga tidak mengubah tagihan lama | Ubah harga menu setelah dipesan | Tagihan sesi tersebut tetap memakai harga lama | Lulus |
| TC-24 | Muat ulang di alamat dalam | Muat ulang /meja/18/tagihan di produksi | Halaman tampil, bukan 404 | Lulus |
| TC-25 | Koneksi terputus | Matikan internet, kirim pesanan | Pesan gagal terhubung, keranjang tetap | Lulus |
| TC-26 | Kirim pesanan tanpa login | Isi keranjang tanpa login, tekan kirim | Diminta masuk Google; setelah login keranjang masih utuh | Lulus |
| TC-27 | Login pertama tanpa data diri | Login dengan akun Google baru | Dialog lengkapi data diri muncul sebelum pesanan dikirim | Lulus |
| TC-28 | Nomor HP tidak valid | 0712345678 | Pesan nomor HP belum benar, data tidak tersimpan | Lulus |
| TC-29 | Batas panjang nama | Nama 1 dan 51 karakter | Ditolak; 2 dan 50 karakter diterima | Lulus |
| TC-30 | Minta bill oleh yang belum memesan | Akun C di meja 18 tanpa pesanan menekan minta bill | Ditolak, hanya pemesan yang bisa minta bill | Lulus (uji database) |
| TC-31 | Privasi nomor HP | Akun B membuka tagihan meja 18 | Nama pemesan lain tampil, nomor HP tidak | Lulus |
| TC-32 | Ubah data diri | Ubah nama dari menu ubah data diri | Nama baru tampil di pesanan berikutnya dan di antrean | Lulus |

Dari 23 kasus berprioritas tinggi, 22 kasus lulus dan 1 kasus lulus sebagian. TC-11 lulus sebagian karena alur minta bill, status meja kuning, dan nominal sudah benar, tetapi gambar QRIS kafe belum dipasang sehingga panel menampilkan penanda "Gambar QRIS belum dipasang" (bug B-03).

### 5.6.4 Boundary Value Analysis

Tabel: Hasil pengujian nilai batas
| Masukan | Nilai uji | Hasil yang diharapkan | Hasil |
| --- | --- | --- | --- |
| Jumlah per menu | 0, 1, 20, 21 | 0 dan 21 ditolak | Sesuai; antarmuka berhenti di 20 dan database menolak 0 dan 21 |
| Nomor meja | 0, 1, 28, 29 | 0 dan 29 tidak ditemukan | Sesuai |
| Panjang nama | 1, 2, 50, 51 | 1 dan 51 ditolak | Sesuai; 2 dan 50 tersimpan |
| Nomor HP valid | 081234567890, 6281234567890, +6281234567890, 0812-3456-7890 | Diterima | Sesuai |
| Nomor HP tidak valid | 0712345678, 08123, abc | Ditolak | Sesuai, dengan pesan "Nomor HP belum benar" |
| Harga menu | 0 dan 1.000.001 | Ditolak | Sesuai; antarmuka dan check constraint menolak |
| Harga menu | 18.000 | Diterima | Sesuai, menu muncul di halaman pelanggan |

### 5.6.5 Temuan dan Perbaikan Bug

Tabel: Daftar bug yang ditemukan
| ID | Temuan | Dampak | Perbaikan | Status |
| --- | --- | --- | --- | --- |
| B-01 | Pesanan dari sesi yang dibatalkan tetap muncul di antrean barista dan ikut dihitung di dasbor | Sedang | Antrean dan ringkasan hari ini mengabaikan sesi berstatus batal | Selesai |
| B-02 | Batas kolom input terlalu pucat (kontras 1,29:1, di bawah syarat 3:1) | Rendah | Token warna baru untuk batas kolom dengan kontras 3,69:1 | Selesai |
| B-03 | Gambar QRIS kafe belum ada sehingga panel QRIS menampilkan penanda | Sedang | Menunggu gambar QRIS dari pemilik kafe | Terbuka |
| B-04 | Akun bukan admin dikeluarkan tanpa pesan penolakan | Rendah | Halaman admin mengingat status penolakan sebelum mengalihkan; ditambah satu tes baru | Selesai |

### 5.6.6 Pengujian Aksesibilitas

Tabel: Hasil pemeriksaan aksesibilitas
| Pemeriksaan | Cara | Hasil |
| --- | --- | --- |
| Kontras teks (WCAG 1.4.3, minimal 4,5:1) | Dihitung dari token warna | Semua pasangan lulus; terendah 4,82:1 |
| Kontras komponen (WCAG 1.4.11, minimal 3:1) | Dihitung dari token warna | Lulus setelah perbaikan B-02 |
| Label form | Audit elemen interaktif | 42 elemen di halaman pelanggan dan 80 di halaman menu admin semuanya punya nama |
| Navigasi keyboard | Tab, Enter, dan Esc | Urutan fokus di dialog logis, Esc menutup dialog dan fokus kembali ke pemicu |
| Pemeriksaan otomatis WCAG 2.1 A dan AA | axe-core | 0 pelanggaran pada 4 skenario komponen |

### 5.6.7 User Acceptance Test

UAT dirancang untuk dijalankan bersama tiga sampai lima calon pengguna yang berperan sebagai pelanggan dan kasir. Akun Google peserta didaftarkan lebih dulu sebagai Test user. Peserta mengerjakan tugas tanpa dibimbing, lalu mengisi kuesioner skala 1 sampai 5 (1 sangat tidak setuju, 5 sangat setuju).

Tabel: Skenario UAT pelanggan
| No | Tugas | Yang diamati |
| --- | --- | --- |
| P1 | Buka aplikasi, masuk ke meja nomor 7 | Apakah peserta paham harus memasukkan nomor meja |
| P2 | Cari Matcha Latte dan satu makanan, masukkan ke pesanan | Apakah menu mudah ditemukan |
| P3 | Kirim pesanan | Apakah peserta paham harus masuk Google dan mengisi data diri |
| P4 | Tambah satu pesanan lagi dari meja yang sama | Apakah peserta paham pesanan kedua masuk tagihan yang sama |
| P5 | Lihat tagihan, minta bill, pilih QRIS | Apakah cara minta bill dan nominal jelas |
| P6 | Cek status pesanan | Apakah status mudah ditemukan dan dimengerti |

Tabel: Skenario UAT kasir dan manajer
| No | Tugas | Yang diamati |
| --- | --- | --- |
| K1 | Lihat meja mana yang terisi dan mana yang minta bill | Apakah denah mudah dibaca |
| K2 | Proses lalu antar pesanan yang masuk | Apakah urutan baru, diproses, diantar jelas |
| K3 | Tandai satu menu sebagai habis, lalu cek dari sisi pelanggan | Apakah tombolnya mudah ditemukan |
| K4 | Buka detail meja yang minta bill, konfirmasi pembayaran | Apakah konfirmasi jelas |

Tabel: Rekap kuesioner UAT
| No | Pernyataan | Responden | Rata-rata skor |
| --- | --- | --- | --- |
| 1 | Saya mudah menemukan menu yang ingin dipesan | Pelanggan | [diisi setelah sesi UAT] |
| 2 | Saya paham cara menambah pesanan kedua | Pelanggan | [diisi setelah sesi UAT] |
| 3 | Saya paham cara meminta bill | Pelanggan | [diisi setelah sesi UAT] |
| 4 | Saya mudah mengetahui meja mana yang perlu ditagih | Kasir | [diisi setelah sesi UAT] |
| 5 | Konfirmasi pembayaran jelas dan tidak membingungkan | Kasir | [diisi setelah sesi UAT] |

Kriteria penerimaan UAT adalah rata-rata skor di atas 4 dan tidak ada tugas yang gagal dialami lebih dari satu peserta. Kendala yang dialami dua peserta atau lebih diperbaiki lebih dulu.
