# BAB II LANDASAN TEORI

## 2.1 Proyek dan Manajemen Proyek Perangkat Lunak

Proyek adalah usaha sementara yang dilakukan untuk menghasilkan produk, layanan, atau hasil yang unik (PMI, 2021). Sementara berarti proyek punya awal dan akhir yang jelas, sedangkan unik berarti hasilnya tidak sama persis dengan hasil pekerjaan rutin. Pembangunan sistem pemesanan untuk sebuah kafe memenuhi kedua ciri itu: dikerjakan dalam lima minggu dan menghasilkan aplikasi yang disesuaikan dengan kebutuhan kafe tersebut.

Manajemen proyek adalah penerapan pengetahuan, keterampilan, alat, dan teknik pada kegiatan proyek agar kebutuhan proyek terpenuhi (PMI, 2021). Schwalbe (2019) menekankan bahwa proyek dibatasi oleh tiga batasan utama yang saling memengaruhi, yaitu ruang lingkup (scope), waktu (time), dan biaya (cost), yang dikenal sebagai triple constraint. Menambah ruang lingkup tanpa menambah waktu atau biaya akan menurunkan mutu. Dalam proyek RE:coffee, waktu bersifat tetap (lima minggu), sehingga ruang lingkup dikunci di awal dan setiap permintaan perubahan dinilai dampaknya terhadap jadwal.

Manajemen proyek perangkat lunak memiliki tantangan khusus dibanding proyek fisik. Produk perangkat lunak tidak terlihat sampai dijalankan, kebutuhan pengguna sering berubah, dan kemajuan pekerjaan sulit diukur tanpa tonggak (milestone) yang jelas (Sommerville, 2016). Karena itu pengelolaannya bertumpu pada perencanaan yang terdokumentasi, pembagian pekerjaan yang terukur, dan pengujian yang membuktikan hasil.

PMBOK mengelompokkan proses manajemen proyek ke dalam lima kelompok proses dan beberapa area pengetahuan. Tabel berikut merangkum yang dipakai dalam proyek ini.

Tabel: Kelompok proses manajemen proyek dan penerapannya
| Kelompok proses | Isi | Penerapan dalam proyek RE:coffee |
| --- | --- | --- |
| Inisiasi | Menetapkan proyek dan memperoleh otorisasi | Kick-off dengan pemilik kafe, project charter |
| Perencanaan | Menetapkan ruang lingkup, jadwal, biaya, risiko, mutu, komunikasi | WBS, estimasi PERT, Gantt chart, anggaran, daftar risiko |
| Pelaksanaan | Mengerjakan pekerjaan sesuai rencana | Analisis, perancangan, implementasi, deployment |
| Pemantauan dan pengendalian | Membandingkan kemajuan dengan rencana dan mengendalikan perubahan | Laporan progres per milestone, log perubahan ruang lingkup |
| Penutupan | Menyelesaikan seluruh kegiatan dan menyerahkan hasil | UAT, laporan akhir, berita acara serah terima (BAST) |

## 2.2 Project Charter

Project charter adalah dokumen yang secara resmi mengesahkan keberadaan proyek dan memberi project manager wewenang untuk memakai sumber daya organisasi (PMI, 2021). Charter dibuat pada tahap inisiasi dan menjadi rujukan bersama antara sponsor, klien, dan tim. Isi charter yang umum adalah tujuan dan justifikasi proyek, deskripsi tingkat tinggi, batasan ruang lingkup, deliverable utama, kriteria keberhasilan yang terukur, ringkasan jadwal dan milestone, ringkasan anggaran, risiko utama, asumsi dan kendala, daftar stakeholder, serta persetujuan.

## 2.3 Work Breakdown Structure (WBS)

Work Breakdown Structure adalah pemecahan hierarkis seluruh ruang lingkup pekerjaan proyek menjadi bagian-bagian yang lebih kecil dan mudah dikelola (PMI, 2021). Tingkat paling atas WBS adalah proyek itu sendiri, tingkat berikutnya adalah fase atau deliverable utama, dan tingkat paling bawah disebut paket kerja (work package). Paket kerja adalah unit terkecil yang dapat diestimasi waktunya, diberi biaya, ditugaskan ke satu penanggung jawab, dan diukur penyelesaiannya.

Penyusunan WBS mengikuti beberapa aturan:

1. **Aturan 100%.** Jumlah pekerjaan pada elemen anak harus sama dengan seluruh pekerjaan elemen induknya, tidak lebih dan tidak kurang.
2. **Penomoran hierarkis.** Setiap elemen diberi kode yang menunjukkan induknya, misalnya 1 untuk fase, 1.1 untuk paket kerja di bawahnya, dan 1.1.1 untuk rincian lebih lanjut.
3. **Berorientasi hasil.** Elemen WBS sebaiknya dinyatakan sebagai hasil atau deliverable, bukan daftar aktivitas harian.
4. **Kamus WBS.** Setiap paket kerja dijelaskan dalam kamus WBS yang memuat deskripsi, hasil, penanggung jawab, dan kriteria penerimaan.

WBS dapat disajikan dalam bentuk diagram pohon atau daftar berindentasi. Dalam laporan ini dipakai keduanya.

## 2.4 Estimasi Pekerjaan

Estimasi pekerjaan adalah perkiraan durasi atau usaha (effort) yang dibutuhkan untuk menyelesaikan setiap paket kerja. Beberapa teknik yang umum dipakai adalah:

Tabel: Teknik estimasi pekerjaan
| Teknik | Cara kerja | Kelebihan dan kekurangan |
| --- | --- | --- |
| Expert judgment | Perkiraan berdasarkan pengalaman orang yang ahli | Cepat, tetapi subjektif |
| Analogous | Membandingkan dengan proyek serupa sebelumnya | Cepat, butuh data proyek pembanding |
| Parametric | Memakai rumus dari data historis, misalnya COCOMO atau Function Point | Objektif, butuh kalibrasi data |
| Bottom-up | Mengestimasi setiap paket kerja lalu menjumlahkannya | Rinci, butuh WBS yang lengkap |
| Three-point (PERT) | Memakai tiga nilai: optimistis, paling mungkin, pesimistis | Memperhitungkan ketidakpastian |

Proyek ini memakai estimasi **bottom-up dengan teknik three-point (PERT)**. Setiap paket kerja diberi tiga perkiraan durasi, yaitu optimistis (O), paling mungkin (M), dan pesimistis (P). Durasi harapan (TE) dan simpangan bakunya (SD) dihitung dengan rumus berikut (Schwalbe, 2019):

> TE = (O + 4M + P) / 6

> SD = (P − O) / 6

Durasi harapan proyek adalah jumlah TE pada jalur kritis, sedangkan simpangan baku proyek adalah akar dari jumlah varian (SD²) aktivitas di jalur itu. Dengan nilai tersebut dapat dihitung peluang proyek selesai sebelum batas waktu tertentu menggunakan distribusi normal: Z = (T − TE) / SD proyek, dengan T adalah batas waktu.

## 2.5 Penjadwalan Proyek

Jadwal proyek menentukan kapan setiap paket kerja dimulai dan selesai. Tiga alat penjadwalan yang dipakai dalam laporan ini adalah:

1. **Network diagram (Precedence Diagramming Method).** Aktivitas digambarkan sebagai kotak dan ketergantungan antaraktivitas sebagai panah. Dari diagram ini dapat ditentukan jalur kritis (critical path), yaitu rangkaian aktivitas terpanjang yang menentukan durasi minimum proyek. Aktivitas di jalur kritis tidak punya kelonggaran waktu (slack atau float), sehingga keterlambatannya langsung menunda proyek.
2. **Gantt chart.** Diagram batang horizontal yang menunjukkan tanggal mulai dan selesai setiap aktivitas pada sumbu waktu. Gantt chart mudah dibaca oleh klien dan dipakai untuk memantau kemajuan.
3. **Daftar milestone.** Titik penting dengan durasi nol, misalnya charter disetujui, desain disetujui, dan serah terima. Milestone dipakai sebagai titik pemeriksaan bersama klien.

Bila satu orang mengerjakan beberapa aktivitas yang secara logika bisa paralel, jadwal harus disesuaikan dengan ketersediaan sumber daya (resource leveling), sehingga aktivitas tersebut dijalankan bergantian dan durasi proyek bertambah dari durasi jalur kritis.

## 2.6 Anggaran Biaya Proyek

Estimasi biaya proyek perangkat lunak umumnya terdiri atas biaya sumber daya manusia, biaya perangkat keras dan perangkat lunak, biaya infrastruktur seperti hosting dan domain, biaya operasional, dan cadangan biaya tak terduga atau contingency reserve (Schwalbe, 2019). Biaya SDM dihitung dari jumlah jam kerja setiap peran dikalikan tarif per jamnya. Contingency reserve disisihkan untuk risiko yang sudah teridentifikasi, biasanya 5 sampai 15 persen dari total biaya.

## 2.7 Manajemen Risiko

Risiko adalah peristiwa atau kondisi yang belum pasti yang, bila terjadi, berdampak pada satu atau lebih tujuan proyek (PMI, 2021). Manajemen risiko meliputi identifikasi risiko, analisis kualitatif dengan menilai kemungkinan (probability) dan dampak (impact), perencanaan respons, serta pemantauan. Hasilnya dicatat dalam daftar risiko (risk register).

Respons terhadap risiko negatif terdiri atas empat strategi: menghindari (avoid), memindahkan (transfer), mengurangi (mitigate), dan menerima (accept). Prioritas risiko ditentukan dari matriks kemungkinan dan dampak. Risiko dengan kemungkinan dan dampak tinggi ditangani lebih dulu.

## 2.8 Stakeholder dan Komunikasi

Stakeholder adalah individu atau kelompok yang memengaruhi atau dipengaruhi oleh proyek. Pemetaan stakeholder yang umum dipakai adalah grid kekuasaan dan kepentingan (Mendelow, 1991) yang membagi stakeholder ke dalam empat kuadran: kelola erat (kekuasaan dan kepentingan tinggi), jaga kepuasan (kekuasaan tinggi, kepentingan rendah), beri informasi (kekuasaan rendah, kepentingan tinggi), dan pantau (keduanya rendah). Pembagian tanggung jawab tiap peran terhadap deliverable dapat dinyatakan dengan matriks RACI: Responsible (yang mengerjakan), Accountable (yang bertanggung jawab akhir), Consulted (yang dimintai pendapat), dan Informed (yang diberi tahu).

## 2.9 Pemodelan Sistem

### 2.9.1 Unified Modeling Language (UML)

UML adalah bahasa pemodelan standar untuk menggambarkan, merancang, dan mendokumentasikan sistem perangkat lunak (Fowler, 2003). Diagram UML yang dipakai dalam laporan ini adalah:

Tabel: Diagram UML yang dipakai dalam laporan
| Diagram | Fungsi | Simbol utama |
| --- | --- | --- |
| Use case diagram | Menggambarkan fungsi sistem dari sudut pandang aktor | Aktor (orang lidi), use case (elips), batas sistem, relasi include, extend, dan generalisasi |
| Activity diagram | Menggambarkan alur aktivitas sebuah proses, termasuk percabangan | Titik awal, aktivitas, keputusan (belah ketupat), titik akhir, swimlane |
| Sequence diagram | Menggambarkan urutan pesan antarobjek dalam satu skenario | Aktor, lifeline, pesan, blok alt dan loop |

Pada use case diagram, relasi **include** dipakai untuk perilaku yang selalu dijalankan oleh use case lain, relasi **extend** untuk perilaku opsional, dan **generalisasi** antaraktor untuk menyatakan bahwa satu aktor mewarisi seluruh hak aktor lain (Rosa dan Shalahuddin, 2018).

### 2.9.2 User Flow

User flow adalah diagram yang menggambarkan langkah-langkah yang ditempuh pengguna di dalam aplikasi untuk mencapai suatu tujuan, mulai dari titik masuk sampai hasil akhir. Berbeda dengan activity diagram yang berfokus pada proses bisnis, user flow berfokus pada perpindahan halaman dan keputusan yang dilihat pengguna.

### 2.9.3 Data Flow Diagram (DFD)

DFD menggambarkan aliran data antara entitas luar, proses, dan penyimpanan data. DFD level 0 (diagram konteks) menampilkan sistem sebagai satu proses, sedangkan DFD level 1 memecahnya menjadi proses-proses utama.

## 2.10 Perancangan Basis Data

### 2.10.1 Entity Relationship Diagram (ERD)

ERD adalah model konseptual yang menggambarkan data sebagai entitas, atribut, dan relasi antarentitas (Chen, 1976). Notasi Chen yang dipakai dalam laporan ini menggambarkan entitas sebagai persegi panjang, relasi sebagai belah ketupat, dan atribut sebagai oval. Atribut kunci digarisbawahi dan atribut turunan digambar dengan garis putus-putus.

Kardinalitas menyatakan jumlah maksimum keterlibatan entitas dalam relasi, yaitu satu ke satu (1:1), satu ke banyak (1:M), dan banyak ke banyak (M:N). Partisipasi menyatakan apakah setiap anggota entitas wajib terlibat (partisipasi total, garis ganda) atau tidak (partisipasi parsial, garis tunggal) (Elmasri dan Navathe, 2016).

### 2.10.2 Logical Record Structure (LRS)

LRS adalah representasi struktur record hasil transformasi ERD yang menunjukkan field, kunci primer, kunci tamu, dan hubungan antarrecord. Aturan transformasi ERD ke LRS adalah: setiap entitas menjadi record; relasi 1:M diwujudkan dengan menyalin kunci primer sisi satu sebagai kunci tamu di sisi banyak; relasi M:N diwujudkan dengan record baru yang berisi kunci primer kedua entitas beserta atribut relasinya; dan atribut turunan tidak dijadikan field.

### 2.10.3 Normalisasi

Normalisasi adalah proses menata tabel agar tidak terjadi pengulangan data dan anomali saat menambah, mengubah, atau menghapus data (Connolly dan Begg, 2015). Bentuk normal yang umum dipakai adalah 1NF (nilai atomik), 2NF (tidak ada ketergantungan parsial pada kunci gabungan), dan 3NF (tidak ada ketergantungan transitif).

## 2.11 Pengujian Perangkat Lunak

Pengujian adalah proses menjalankan program dengan tujuan menemukan kesalahan (Myers dkk., 2011). Jenis pengujian yang dipakai dalam proyek ini adalah:

1. **Unit testing**, yaitu pengujian bagian terkecil program seperti fungsi dan komponen antarmuka secara terpisah dan otomatis.
2. **Black box testing**, yaitu pengujian fungsi berdasarkan masukan dan keluaran tanpa melihat kode. Teknik yang dipakai adalah equivalence partitioning, yaitu membagi masukan ke dalam kelompok yang diperlakukan sama, dan boundary value analysis, yaitu menguji nilai di sekitar batas, misalnya 0, 1, 20, dan 21 untuk jumlah pesanan yang dibatasi 1 sampai 20.
3. **User Acceptance Test (UAT)**, yaitu pengujian oleh calon pengguna untuk menilai apakah sistem dapat diterima dan sesuai kebutuhan.

## 2.12 Teknologi yang Digunakan

Tabel: Teknologi yang digunakan dalam proyek
| Teknologi | Keterangan |
| --- | --- |
| React dan TypeScript | Pustaka JavaScript untuk membangun antarmuka berbasis komponen, ditulis dengan TypeScript agar tipe data diperiksa sebelum program dijalankan |
| Vite | Alat build dan server pengembangan untuk aplikasi web modern |
| Tailwind CSS | Kerangka CSS berbasis kelas utilitas untuk menerapkan design system secara konsisten |
| TanStack Query | Pustaka pengambilan data dengan cache dan polling otomatis |
| Supabase | Platform backend berbasis PostgreSQL yang menyediakan database, autentikasi (termasuk Google OAuth), dan Row Level Security |
| PostgreSQL | Sistem manajemen basis data relasional yang mendukung constraint, trigger, view, dan function |
| Row Level Security (RLS) | Fitur PostgreSQL untuk membatasi baris data yang boleh dibaca atau diubah oleh setiap pengguna |
| Vercel | Layanan hosting aplikasi web statis dengan HTTPS dan deploy otomatis dari GitHub |
| GitHub | Penyimpanan kode sumber dengan kontrol versi Git |
| Vitest dan Testing Library | Kerangka pengujian unit dan komponen untuk aplikasi React |
| QR code | Kode matriks dua dimensi yang dapat dibaca kamera HP untuk membuka alamat web halaman meja |
