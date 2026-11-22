# BAB IV ANALISIS DAN PERANCANGAN SISTEM

## 4.1 Analisis Sistem Berjalan

Sebelum sistem dibangun, pemesanan di kafe berjalan sebagai berikut. Pelanggan datang ke kasir, memilih menu dari papan menu, membayar atau meminta pesanan dicatat sebagai tagihan meja, lalu menunggu pesanan diantar. Untuk pesanan tambahan, pelanggan kembali ke kasir. Kasir menyerahkan catatan pesanan kepada barista. Ketika pelanggan hendak pulang, kasir mengumpulkan seluruh catatan meja tersebut dan menghitung total tagihan.

Kelemahan alur tersebut sudah diidentifikasi pada subbab 1.2. Sistem usulan memindahkan pencatatan pesanan ke HP pelanggan, menyimpan semua pesanan satu kunjungan dalam satu sesi meja, menghitung total di database, dan menampilkan status semua meja kepada kasir.

## 4.2 Kebutuhan Fungsional

Tabel: Kebutuhan fungsional sistem
| ID | Aktor | Kebutuhan | Prioritas |
| --- | --- | --- | --- |
| FR-01 | Pelanggan | Membuka halaman meja lewat alamat /meja/nomor; nomor di luar 1 sampai 28 menampilkan pesan meja tidak ditemukan | Tinggi |
| FR-02 | Pelanggan | Melihat menu yang dikelompokkan per kategori: kopi, non-kopi, makanan, camilan | Tinggi |
| FR-03 | Pelanggan | Menu habis tetap tampil dengan label "Habis" dan tidak bisa ditambahkan | Sedang |
| FR-04 | Pelanggan | Menambah, mengurangi, dan menghapus item di keranjang; keranjang tersimpan di perangkat per meja | Tinggi |
| FR-05 | Pelanggan | Menambahkan catatan pesanan paling banyak 140 karakter | Rendah |
| FR-06 | Pelanggan | Mengirim pesanan; sistem membuat atau memakai sesi meja yang aktif | Tinggi |
| FR-07 | Pelanggan | Melihat tagihan meja: semua pesanan dalam sesi, status, subtotal, dan total | Tinggi |
| FR-08 | Pelanggan | Meminta bill dengan memilih QRIS atau bayar di kasir | Tinggi |
| FR-09 | Pelanggan | Melihat gambar QRIS dan nominal yang harus dibayar bila memilih QRIS | Tinggi |
| FR-10 | Pelanggan | Setelah pembayaran dikonfirmasi, halaman tagihan menampilkan ucapan terima kasih | Sedang |
| FR-23 | Pelanggan | Masuk dengan Google sebelum mengirim pesanan; keranjang tidak hilang setelah kembali dari halaman login | Tinggi |
| FR-24 | Pelanggan | Mengisi data diri saat login pertama: nama 2 sampai 50 karakter dan nomor HP format Indonesia | Tinggi |
| FR-25 | Pelanggan | Keluar (logout) dari perangkat | Sedang |
| FR-11 | Kasir, manajer | Login dengan Google; email yang tidak terdaftar sebagai admin ditolak dan otomatis dikeluarkan | Tinggi |
| FR-12 | Kasir | Melihat denah 28 meja dengan status kosong, terisi, atau minta bill, beserta total berjalan | Tinggi |
| FR-13 | Kasir | Membuka detail meja: pesanan, item, total, metode bayar, nama dan nomor HP pemesan | Tinggi |
| FR-14 | Kasir | Mengonfirmasi pembayaran (boleh mengganti metode bayar); sesi selesai dan meja kosong | Tinggi |
| FR-15 | Kasir | Membatalkan sesi dengan dialog konfirmasi | Sedang |
| FR-16 | Kasir | Melihat antrean pesanan berstatus baru dan diproses, urut dari yang terlama | Tinggi |
| FR-17 | Kasir | Memajukan status pesanan satu langkah | Tinggi |
| FR-18 | Manajer | Menambah dan mengubah menu: nama, deskripsi, kategori, harga, urutan | Tinggi |
| FR-19 | Manajer | Menandai menu habis atau tersedia | Tinggi |
| FR-20 | Manajer | Mengarsipkan menu | Sedang |
| FR-21 | Manajer | Melihat ringkasan penjualan hari ini di dasbor | Rendah |
| FR-22 | Sistem | Denah meja, antrean, dan tagihan diperbarui otomatis dengan polling | Tinggi |

## 4.3 Kebutuhan Non-Fungsional

Tabel: Kebutuhan non-fungsional sistem
| ID | Kategori | Kebutuhan |
| --- | --- | --- |
| NFR-01 | Performa | Bundle JavaScript awal kurang dari 250 KB gzip agar halaman cepat dimuat di jaringan seluler |
| NFR-02 | Responsif | Halaman pelanggan optimal di lebar 360 sampai 480 px; halaman admin optimal di 1024 px ke atas |
| NFR-03 | Keamanan | Row Level Security aktif di semua tabel; tulis data pelanggan hanya lewat database function; tidak ada kunci rahasia di frontend |
| NFR-04 | Keamanan | Hak admin diperiksa di database dengan function is_admin(), bukan hanya di tampilan |
| NFR-05 | Integritas data | Harga berupa bilangan bulat, total dihitung di server, satu sesi aktif per meja dijamin unique index |
| NFR-06 | Aksesibilitas | Kontras teks WCAG AA, target sentuh minimal 44 px, fokus keyboard terlihat, status tidak hanya dibedakan dengan warna |
| NFR-07 | Usability | Alur pesan paling banyak empat langkah, seluruh teks dalam Bahasa Indonesia yang jelas |
| NFR-08 | Ketersediaan | Ter-deploy di Vercel dengan HTTPS |
| NFR-09 | Maintainability | TypeScript strict, struktur kode per fitur, migrasi SQL berurutan |
| NFR-10 | Privasi | Nomor HP hanya terlihat oleh pemiliknya dan admin; pelanggan lain di meja yang sama hanya melihat nama |

## 4.4 Analisis Data

### 4.4.1 Identifikasi Data

Tabel: Identifikasi data sistem
| Data | Sumber | Pemakai | Sifat | Contoh |
| --- | --- | --- | --- | --- |
| Meja | Data awal (28 baris) | Sistem, kasir | Master | Meja 18, kapasitas 4 |
| Menu | Manajer | Pelanggan, kasir | Master | Es Kopi Susu Aren, Rp24.000 |
| Sesi meja | Sistem, ditutup kasir | Pelanggan, kasir | Transaksi | Sesi meja 18, aktif, dibuka 14.05 |
| Pesanan | Pelanggan | Kasir dan barista | Transaksi | Pesanan meja 18 oleh Rina, diproses |
| Item pesanan | Pelanggan (menu dan jumlah), harga dari sistem | Kasir, perhitungan total | Transaksi | 2 × Es Kopi Susu Aren @ Rp24.000 |
| Pelanggan | Pelanggan sendiri saat login pertama | Kasir, sistem | Master | Rina, 081234567890 |
| Admin | Pengelola sistem | Sistem (otorisasi) | Master | Email Google kasir |

Beberapa nilai sengaja tidak disimpan melainkan dihitung saat dibutuhkan, yaitu status meja (kosong, terisi, minta bill), total berjalan sesi (jumlah dari jumlah dikali harga satuan), dan jumlah pesanan yang belum diantar. Hanya total_bayar yang disimpan, sebagai rekaman akhir pada saat sesi ditutup.

### 4.4.2 Data Flow Diagram

![DFD level 0 (diagram konteks) sistem RE:coffee](dfd0.png){16}

![DFD level 1 sistem RE:coffee](dfd1.png){16}

DFD level 1 memecah sistem menjadi empat proses: kelola pesanan, kelola tagihan dan pembayaran, kelola menu, serta autentikasi dan profil. Keenam penyimpanan data (D1 sampai D6) menjadi dasar perancangan basis data pada subbab 4.9.

### 4.4.3 Matriks CRUD

Tabel: Matriks CRUD use case terhadap tabel
| Use case | MEJA | MENU | PELANGGAN | SESI_MEJA | PESANAN | ITEM_PESANAN | ADMIN |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UC-01 Melihat menu | R | R | | | | | |
| UC-03 Mengirim pesanan | | R | R | C, R | C | C | |
| UC-04 Melihat tagihan meja | | | R | R | R | R | |
| UC-05 Minta bill | | | | U | R | | |
| UC-12 Masuk Google dan data diri | | | C, R, U | | | | |
| UC-06 Login admin | | | | | | | R |
| UC-07 Memantau denah meja | R | | | R | | R | |
| UC-08 Mengonfirmasi pembayaran | | | | U | | | R |
| UC-09 Membatalkan sesi | | | | U | | | |
| UC-10 Mengelola antrean | | | R | R | R, U | R | |
| UC-11 Mengelola menu | | C, R, U | | | | | |
| UC-13 Ringkasan penjualan | | | | R | R | R | |

Keterangan: C = create, R = read, U = update. Tidak ada kolom berisi D (delete) karena sesi, pesanan, dan menu tidak pernah dihapus agar riwayat transaksi tetap utuh. Keranjang (UC-02) disimpan di penyimpanan browser sehingga tidak menyentuh database.

## 4.5 Use Case

### 4.5.1 Aktor

Sistem memiliki tiga aktor. Kasir dan manajer kafe memakai hak akses admin yang sama di database, sehingga di diagram keduanya digambarkan sebagai spesialisasi dari aktor Admin (generalisasi). Dengan generalisasi ini, use case Login yang dimiliki Admin otomatis berlaku bagi Kasir dan Manajer.

Tabel: Daftar aktor sistem
| Aktor | Deskripsi | Autentikasi |
| --- | --- | --- |
| Pelanggan | Pengunjung kafe yang memesan dari meja | Melihat menu tanpa login; memesan, melihat tagihan, dan minta bill wajib login Google dan mengisi data diri |
| Kasir | Petugas yang memantau meja, memproses antrean, dan menerima pembayaran; barista memakai akun yang sama | Login Google dengan email terdaftar di tabel admin |
| Manajer kafe | Pengelola yang mengatur menu dan memantau penjualan harian | Login Google dengan email terdaftar di tabel admin |
| Admin (abstrak) | Induk dari Kasir dan Manajer, memiliki use case login | Login Google |

### 4.5.2 Use Case Diagram

![Use case diagram sistem RE:coffee dengan tiga aktor](use-case-3-aktor.png){16}

Tabel: Daftar use case
| ID | Use case | Aktor | Halaman |
| --- | --- | --- | --- |
| UC-01 | Melihat menu | Pelanggan | /meja/nomor |
| UC-02 | Mengelola keranjang | Pelanggan | /meja/nomor |
| UC-03 | Mengirim pesanan | Pelanggan | /meja/nomor |
| UC-04 | Melihat tagihan meja | Pelanggan | /meja/nomor/tagihan |
| UC-05 | Minta bill dan memilih metode bayar | Pelanggan | /meja/nomor/tagihan |
| UC-12 | Masuk dengan Google dan melengkapi data diri | Pelanggan | Dialog di halaman meja |
| UC-06 | Login dengan Google | Admin (Kasir, Manajer) | /admin/masuk |
| UC-07 | Memantau denah meja | Kasir | /admin |
| UC-08 | Mengonfirmasi pembayaran | Kasir | /admin/meja/nomor |
| UC-09 | Membatalkan sesi meja | Kasir | /admin/meja/nomor |
| UC-10 | Mengelola antrean pesanan | Kasir | /admin/antrian |
| UC-11 | Mengelola menu | Manajer | /admin/menu |
| UC-13 | Melihat ringkasan penjualan hari ini | Manajer | /admin |

Tabel: Relasi antar use case
| Relasi | Dari | Ke | Arti |
| --- | --- | --- | --- |
| include | UC-03 Mengirim pesanan | Membuat atau memakai sesi meja | Setiap pesanan selalu terikat ke satu sesi meja |
| include | UC-03, UC-04, UC-05 | UC-12 Masuk Google dan data diri | Ketiganya hanya dapat dijalankan pelanggan yang sudah login dan punya data diri |
| extend | Mengganti metode bayar | UC-08 Mengonfirmasi pembayaran | Opsional: kasir boleh mengganti metode yang dipilih pelanggan |
| generalisasi | Kasir, Manajer | Admin | Kasir dan manajer mewarisi use case login milik Admin |

### 4.5.3 Skenario Use Case

Skenario berikut ditulis untuk use case yang paling menentukan alur bisnis.

Tabel: Skenario UC-03 Mengirim pesanan
| Bagian | Isi |
| --- | --- |
| Aktor | Pelanggan |
| Prasyarat | Keranjang berisi minimal satu item, pelanggan sudah login dan punya data diri, sesi meja tidak berstatus minta bill |
| Alur utama | 1. Pelanggan membuka ringkasan keranjang. 2. Pelanggan menekan Kirim pesanan. 3. Sistem memvalidasi meja, item, jumlah, dan ketersediaan menu. 4. Sistem membuat sesi bila belum ada, lalu menyimpan pesanan dan item dengan harga dari database. 5. Sistem mengosongkan keranjang dan menampilkan "Pesanan terkirim!" |
| Alur alternatif | 3a. Menu habis saat dikirim: tampil pesan agar menu dihapus dari keranjang. 3b. Sesi berstatus minta bill: tampil "Bill sudah diminta. Tambah pesanan lewat kasir." 3c. Jaringan gagal: keranjang tidak dihapus dan pelanggan diminta mencoba lagi |
| Pascakondisi | Pesanan berstatus baru muncul di antrean kasir |

Tabel: Skenario UC-12 Masuk dengan Google dan melengkapi data diri
| Bagian | Isi |
| --- | --- |
| Aktor | Pelanggan |
| Pemicu | Pelanggan menekan Kirim pesanan, membuka tagihan, atau Minta bill dalam keadaan belum login |
| Alur utama | 1. Sistem menampilkan tombol Masuk dengan Google. 2. Pelanggan memilih akun Google dan kembali ke halaman meja yang sama. 3. Bila data diri belum ada, sistem menampilkan form nama dan nomor HP. 4. Pelanggan menekan Simpan dan aksi semula dilanjutkan |
| Alur alternatif | Nomor HP tidak valid: tampil "Nomor HP belum benar. Contoh: 081234567890." Pelanggan batal login: keranjang tetap ada |
| Pascakondisi | Data diri tersimpan; login berikutnya tidak meminta data lagi |

Tabel: Skenario UC-05 Minta bill dan memilih metode bayar
| Bagian | Isi |
| --- | --- |
| Aktor | Pelanggan |
| Prasyarat | Sesi meja aktif; pelanggan login dan sudah memesan minimal satu kali di sesi ini |
| Alur utama | 1. Pelanggan membuka tagihan dan menekan Minta bill. 2. Pelanggan memilih QRIS atau Bayar di kasir. 3. Sistem mengubah status sesi menjadi minta bill. 4. Bila QRIS, sistem menampilkan gambar QRIS dan nominal |
| Alur alternatif | Pelanggan yang belum memesan di sesi tersebut ditolak |
| Pascakondisi | Meja tampil kuning "Minta bill" di denah kasir dan pesanan baru diblokir |

Tabel: Skenario UC-06 Login dengan Google (admin)
| Bagian | Isi |
| --- | --- |
| Aktor | Kasir atau manajer (melalui aktor Admin) |
| Alur utama | 1. Aktor membuka /admin/masuk dan menekan Masuk dengan Google. 2. Aktor memilih akun Google dan kembali ke /admin. 3. Sistem memeriksa is_admin() di database. Bila benar, dasbor tampil |
| Alur alternatif | Email bukan admin: akun dikeluarkan otomatis dan tampil "Akun ini bukan admin". Membuka /admin tanpa login: dialihkan ke /admin/masuk |
| Pascakondisi | Sesi admin aktif; pemeriksaan juga dilakukan database sehingga tampilan yang dibobol tidak memberi akses |

Tabel: Skenario UC-08 Mengonfirmasi pembayaran
| Bagian | Isi |
| --- | --- |
| Aktor | Kasir |
| Prasyarat | Kasir login; sesi berstatus aktif atau minta bill |
| Alur utama | 1. Kasir membuka detail meja. 2. Kasir memeriksa total dan metode bayar, boleh mengganti metode. 3. Kasir menekan Konfirmasi bayar dan menyetujui dialog. 4. Sistem menyimpan total_bayar, waktu tutup, email kasir, dan status selesai |
| Alur alternatif | Kasir menutup dialog tanpa konfirmasi: tidak ada perubahan |
| Pascakondisi | Meja kembali kosong dan halaman tagihan pelanggan menampilkan ucapan terima kasih |

Tabel: Skenario UC-10 Mengelola antrean pesanan
| Bagian | Isi |
| --- | --- |
| Aktor | Kasir (termasuk barista) |
| Alur utama | 1. Kasir membuka /admin/antrian. 2. Sistem menampilkan pesanan baru dan diproses, urut dari yang terlama, lengkap dengan meja, nama pemesan, item, dan catatan. 3. Kasir menekan langkah berikutnya: baru menjadi diproses, lalu diproses menjadi diantar. 4. Pesanan yang diantar hilang dari antrean |
| Alur alternatif | Lompatan status langsung dari baru ke diantar ditolak database |
| Pascakondisi | Pelanggan melihat status terbaru di halaman tagihannya |

Tabel: Skenario UC-11 Mengelola menu
| Bagian | Isi |
| --- | --- |
| Aktor | Manajer kafe |
| Alur utama | 1. Manajer membuka /admin/menu. 2. Manajer menambah atau mengubah menu (nama, deskripsi, kategori, harga, urutan). 3. Manajer menandai menu habis atau tersedia, atau mengarsipkannya. 4. Perubahan langsung terlihat di halaman pelanggan |
| Alur alternatif | Harga di luar 1 sampai 1.000.000 ditolak dengan pesan validasi |
| Pascakondisi | Menu yang pernah dipesan hanya bisa diarsipkan, sehingga tagihan lama tetap utuh |

Tabel: Skenario UC-13 Melihat ringkasan penjualan hari ini
| Bagian | Isi |
| --- | --- |
| Aktor | Manajer kafe |
| Alur utama | 1. Manajer membuka /admin. 2. Sistem menampilkan pendapatan hari ini (jumlah total_bayar sesi selesai sejak 00.00 WIB), tagihan berjalan, pesanan menunggu, jumlah meja minta bill, dan lima menu terlaris hari ini |
| Alur alternatif | Belum ada transaksi: angka tampil nol |
| Pascakondisi | Tidak ada perubahan data; sesi yang dibatalkan tidak dihitung |

## 4.6 Activity Diagram

Activity diagram berikut menggambarkan alur proses utama. Setiap diagram dibagi menjadi swimlane aktor dan sistem.

![Activity diagram mengirim pesanan](act-pesan.png){13}

Alur mengirim pesanan dimulai saat pelanggan memindai QR. Pemeriksaan login dilakukan tepat sebelum pesanan dikirim, bukan di awal, sehingga pelanggan dapat melihat menu dan mengisi keranjang tanpa login. Validasi akhir dilakukan oleh database; bila gagal, keranjang tetap tersimpan.

![Activity diagram minta bill](act-minta-bill.png){11}

![Activity diagram mengonfirmasi pembayaran](act-konfirmasi.png){11}

![Activity diagram mengelola antrean pesanan](act-antrian.png){11}

![Activity diagram mengelola menu](act-kelola-menu.png){15}

## 4.7 Sequence Diagram

Sequence diagram menggambarkan urutan pesan antara aktor, halaman di browser, layanan autentikasi, dan database untuk skenario utama.

![Sequence diagram mengirim pesanan](seq-pesan.png){16}

Pada skenario mengirim pesanan, browser hanya mengirim nomor meja, daftar menu_id beserta jumlahnya, dan catatan ke function buat_pesanan. Harga diambil database dari tabel menu, sehingga harga tidak dapat dimanipulasi dari browser.

![Sequence diagram minta bill](seq-minta-bill.png){15}

![Sequence diagram mengonfirmasi pembayaran](seq-konfirmasi.png){16}

![Sequence diagram login admin](seq-login-admin.png){16}

## 4.8 User Flow

User flow menunjukkan perpindahan halaman yang dialami setiap aktor.

![User flow pelanggan](uf-pelanggan.png){8}

![User flow kasir](uf-kasir.png){16}

![User flow manajer kafe](uf-manajer.png){15}

## 4.9 Perancangan Basis Data

### 4.9.1 Entitas dan Atribut

Tabel: Entitas dan alasan keberadaannya
| Entitas | Mewakili | Alasan diperlukan |
| --- | --- | --- |
| PELANGGAN | Orang yang memesan (akun Google dan data diri) | Setiap pesanan punya pemesan yang jelas sehingga pesanan iseng dapat ditekan |
| MEJA | 28 meja fisik di kafe | Titik identitas tagihan; QR dan nomor meja menunjuk ke sini |
| SESI_MEJA | Satu kunjungan di satu meja, dari pesanan pertama sampai dibayar | Mengikat banyak pesanan menjadi satu tagihan dan membedakan kunjungan pada jam berbeda di meja yang sama |
| PESANAN | Satu kali pengiriman keranjang | Pelanggan dapat memesan berkali-kali dan barista memproses per pesanan |
| MENU | Daftar minuman dan makanan | Data master yang dipesan |
| ADMIN | Kasir dan manajer yang boleh mengelola sistem | Otorisasi dan jejak siapa yang mengonfirmasi pembayaran |

Tabel: Atribut setiap entitas
| Pemilik | Atribut kunci | Atribut lain | Atribut turunan |
| --- | --- | --- | --- |
| PELANGGAN | id | email, nama, no_hp, created_at, updated_at | - |
| MEJA | nomor | kapasitas | status_meja |
| SESI_MEJA | id | status, metode_bayar, total_bayar, dibuka_at, minta_bill_at, ditutup_at | total_tagihan |
| PESANAN | id | status, catatan, created_at, updated_at | subtotal_pesanan |
| MENU | id | nama, deskripsi, kategori, harga, tersedia, diarsipkan, urutan, created_at, updated_at | - |
| ADMIN | email | nama, created_at | - |
| Relasi Berisi | - | qty, harga_satuan, nama_menu | subtotal_item |

### 4.9.2 Relasi dan Kardinalitas

Tabel: Relasi, kardinalitas, dan partisipasi
| Relasi | Entitas | Kardinalitas | Partisipasi | Cara membaca |
| --- | --- | --- | --- | --- |
| Membuat | PELANGGAN, PESANAN | 1 : M | Pelanggan parsial, pesanan total | Satu pelanggan membuat nol atau banyak pesanan; setiap pesanan dibuat tepat satu pelanggan |
| Memiliki | MEJA, SESI_MEJA | 1 : M | Meja parsial, sesi total | Satu meja memiliki nol atau banyak sesi sepanjang waktu; setiap sesi milik satu meja |
| Mencakup | SESI_MEJA, PESANAN | 1 : M | Keduanya total | Satu sesi mencakup minimal satu pesanan; setiap pesanan berada di satu sesi |
| Berisi | PESANAN, MENU | M : N | Pesanan total, menu parsial | Satu pesanan berisi satu atau lebih menu; satu menu ada di nol atau banyak pesanan |
| Mengonfirmasi | ADMIN, SESI_MEJA | 1 : M | Keduanya parsial | Satu admin mengonfirmasi nol atau banyak sesi; sesi yang berjalan belum dikonfirmasi |

Aturan bahwa satu meja hanya boleh memiliki satu sesi terbuka pada satu waktu tidak dapat digambarkan dengan kardinalitas, karena sepanjang waktu satu meja tetap memiliki banyak sesi. Aturan tersebut dijaga di tingkat fisik dengan partial unique index sesi_meja_satu_terbuka_idx.

### 4.9.3 Entity Relationship Diagram

![ERD sistem RE:coffee dalam notasi Chen](erd-chen.png){16}

Dua keputusan rancangan pada ERD perlu dijelaskan. Pertama, PELANGGAN berelasi ke PESANAN, bukan ke SESI_MEJA, karena tagihan adalah milik meja (open bill) sedangkan yang dicatat per pelanggan adalah siapa memesan apa. Kedua, hubungan PESANAN dan MENU adalah M:N yang memiliki atribut sendiri (qty, harga_satuan, nama_menu), sehingga digambar sebagai relasi Berisi yang beratribut.

### 4.9.4 Transformasi ERD ke LRS

Tabel: Transformasi relasi ERD ke LRS
| Relasi | Aturan | Hasil di LRS |
| --- | --- | --- |
| Membuat (1:M) | Kunci sisi satu menjadi kunci tamu di sisi banyak | pelanggan_id di PESANAN, wajib diisi |
| Memiliki (1:M) | Kunci sisi satu menjadi kunci tamu di sisi banyak | nomor_meja di SESI_MEJA, wajib diisi |
| Mencakup (1:M) | Kunci sisi satu menjadi kunci tamu di sisi banyak | sesi_id di PESANAN, wajib diisi |
| Mengonfirmasi (1:M) | Kunci sisi satu menjadi kunci tamu di sisi banyak | dikonfirmasi_oleh di SESI_MEJA, boleh kosong karena partisipasi parsial |
| Berisi (M:N) | Dibuat record baru | ITEM_PESANAN berisi pesanan_id, menu_id, qty, harga_satuan, nama_menu |
| Atribut turunan | Tidak dijadikan field | Dihitung oleh view v_status_meja dan query |

Kunci primer ITEM_PESANAN secara teori adalah gabungan pesanan_id dan menu_id karena satu menu hanya muncul sekali per pesanan. Pada implementasi dipakai kunci pengganti (surrogate key) id bertipe UUID agar seragam dengan tabel lain, sedangkan pasangan pesanan_id dan menu_id tetap dijaga sebagai UNIQUE.

### 4.9.5 Logical Record Structure

![Logical Record Structure sistem RE:coffee](lrs.png){15}

LRS terdiri atas tujuh record, yaitu enam entitas ditambah ITEM_PESANAN hasil transformasi relasi M:N. Setiap garis 1:M memiliki kunci tamu yang jelas di sisi banyak dan tidak ada atribut turunan yang menjadi field.

### 4.9.6 Kamus Data

Tabel: Kamus data tabel pelanggan
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| id | uuid | PK | Sama dengan id akun Supabase Auth |
| email | text | - | Email akun Google |
| nama | text (2 sampai 50) | - | Nama yang diisi pelanggan |
| no_hp | text | - | Nomor HP Indonesia (08, 628, atau +628) |
| created_at, updated_at | timestamptz | - | Waktu daftar dan diubah |

Tabel: Kamus data tabel meja
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| nomor | smallint | PK | Nomor meja 1 sampai 28 |
| kapasitas | smallint | - | Jumlah kursi, bawaan 4 |

Tabel: Kamus data tabel sesi_meja
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| id | uuid | PK | Pengenal sesi |
| nomor_meja | smallint | FK ke meja | Meja tempat sesi berlangsung |
| dikonfirmasi_oleh | text | FK ke admin | Email admin yang menutup sesi; kosong selama berjalan |
| status | enum | - | aktif, minta_bill, selesai, batal |
| metode_bayar | enum | - | qris atau kasir |
| total_bayar | integer | - | Total saat sesi ditutup (Rupiah) |
| dibuka_at, minta_bill_at, ditutup_at | timestamptz | - | Waktu pesanan pertama, minta bill, dan selesai |

Tabel: Kamus data tabel pesanan
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| id | uuid | PK | Pengenal pesanan |
| sesi_id | uuid | FK ke sesi_meja | Sesi pemilik pesanan |
| pelanggan_id | uuid | FK ke pelanggan | Pembuat pesanan |
| status | enum | - | baru, diproses, diantar |
| catatan | text (maks. 140) | - | Catatan pelanggan, opsional |
| created_at, updated_at | timestamptz | - | Waktu dibuat dan diubah |

Tabel: Kamus data tabel item_pesanan
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| id | uuid | PK | Pengenal item |
| pesanan_id | uuid | FK ke pesanan, UNIQUE bersama menu_id | Pesanan pemilik item |
| menu_id | uuid | FK ke menu | Menu yang dipesan |
| nama_menu | text | - | Nama menu saat dipesan |
| qty | smallint | - | Jumlah 1 sampai 20 |
| harga_satuan | integer | - | Harga saat dipesan (Rupiah) |

Tabel: Kamus data tabel menu
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| id | uuid | PK | Pengenal menu |
| nama | text (2 sampai 60) | - | Nama menu |
| deskripsi | text (maks. 160) | - | Keterangan singkat |
| kategori | enum | - | kopi, non_kopi, makanan, camilan |
| harga | integer | - | Harga saat ini, 1 sampai 1.000.000 |
| tersedia | boolean | - | false berarti habis |
| diarsipkan | boolean | - | true berarti disembunyikan permanen |
| urutan | smallint | - | Urutan tampil dalam kategori |
| created_at, updated_at | timestamptz | - | Waktu dibuat dan diubah |

Tabel: Kamus data tabel admin
| Field | Tipe | Kunci | Keterangan |
| --- | --- | --- | --- |
| email | text | PK | Email Google admin (huruf kecil) |
| nama | text | - | Nama tampilan |
| created_at | timestamptz | - | Waktu didaftarkan |

### 4.9.7 Aturan yang Dijaga Database

Tabel: Aturan bisnis dan penjaganya di database
| Aturan | Penjaga |
| --- | --- |
| Satu meja hanya punya satu sesi terbuka | Partial unique index sesi_meja_satu_terbuka_idx |
| Satu menu hanya sekali per pesanan | UNIQUE (pesanan_id, menu_id) di item_pesanan |
| Nomor meja 1 sampai 28, qty 1 sampai 20, harga 1 sampai 1.000.000 | Check constraint |
| Status pesanan hanya maju satu langkah | Trigger pesanan_transisi |
| Pelanggan hanya membaca data sendiri, admin membaca semua | Row Level Security |
| Harga tidak dapat dimanipulasi dari browser | Function buat_pesanan mengambil harga dari tabel menu |
| Riwayat transaksi tidak hilang | Foreign key RESTRICT, tanpa ON DELETE CASCADE |

Seluruh tabel memenuhi bentuk normal ketiga (3NF): setiap kolom bernilai atomik, tidak ada ketergantungan parsial pada kunci gabungan, dan tidak ada kolom yang bergantung pada kolom bukan kunci. Kolom nama_menu dan harga_satuan di item_pesanan bukan pelanggaran normalisasi, melainkan rekaman nilai pada saat transaksi terjadi, karena nama dan harga di tabel menu dapat berubah kemudian.

## 4.10 Arsitektur Sistem

![Arsitektur sistem RE:coffee](arsitektur.png){10}

Frontend berupa aplikasi web statis yang di-hosting di Vercel. Tidak ada server aplikasi terpisah; browser berkomunikasi langsung dengan Supabase. Karena itu keamanan bertumpu pada Row Level Security dan database function. Pelanggan tidak memiliki akses tulis langsung ke tabel mana pun; semua penulisan oleh pelanggan melewati function yang memvalidasi masukan dan memakai identitas dari token login.

Tabel: Pola akses data
| Operasi | Siapa | Cara |
| --- | --- | --- |
| Membaca meja dan menu | Publik | select langsung, RLS mengizinkan baca |
| Menyimpan data diri | Pelanggan login | Function simpan_profil |
| Mengirim pesanan | Pelanggan login dengan data diri | Function buat_pesanan |
| Membaca tagihan meja | Pelanggan login | Function get_tagihan_meja |
| Minta bill | Pelanggan yang sudah memesan di sesi itu | Function minta_bill |
| Denah meja | Kasir, manajer | View v_status_meja |
| Mengubah status pesanan, mengelola menu | Kasir, manajer | update atau insert langsung, dibatasi RLS admin |
| Konfirmasi bayar, batalkan sesi | Kasir | Function konfirmasi_bayar dan batalkan_sesi |

Data diperbarui dengan polling: denah meja, antrean, dan detail meja setiap 5 detik, sedangkan tagihan pelanggan setiap 10 detik. Polling berhenti saat tab browser tidak aktif.

## 4.11 Perancangan Antarmuka

### 4.11.1 Design System

Nama RE:coffee dibaca sebagai "re-" yang berarti kembali, dengan tema kafe kekinian. Tampilan dibuat bersih dengan latar putih, satu warna aksen hijau, dan tipografi tegas.

Tabel: Keputusan design system
| Aspek | Keputusan |
| --- | --- |
| Warna | Teks cokelat tua, aksen hijau, kuning khusus untuk status minta bill, merah untuk galat; tanpa gradien |
| Tipografi | Gloock untuk judul dan nomor meja, Plus Jakarta Sans untuk teks dan harga |
| Bentuk | Sudut membulat 6 px, target sentuh minimal 44 px, lebar halaman pelanggan maksimal 480 px |
| Menu | Ditampilkan sebagai daftar harga ala papan menu, bukan kartu berfoto |
| Ikon | Ikon antarmuka dari Phosphor dan ikon kategori berupa SVG tulis tangan |
| Gerak | Animasi halus untuk keranjang dan denah, dimatikan bila pengguna memilih mengurangi gerak |

### 4.11.2 Peta Halaman

Tabel: Peta halaman aplikasi
| Alamat | Halaman | Akses |
| --- | --- | --- |
| / | Beranda dan input nomor meja | Publik |
| /meja/nomor | Menu dan keranjang | Publik untuk melihat, login untuk mengirim |
| /meja/nomor/tagihan | Tagihan meja, minta bill, QRIS | Pelanggan login |
| /admin/masuk | Login kasir dan manajer | Publik |
| /admin | Dasbor ringkasan dan denah meja | Admin |
| /admin/meja/nomor | Detail tagihan meja | Admin |
| /admin/antrian | Antrean pesanan | Admin |
| /admin/menu | Kelola menu | Admin |

Rancangan antarmuka diwujudkan langsung sebagai komponen pada tahap implementasi. Tampilan akhir setiap halaman disajikan pada BAB V.
