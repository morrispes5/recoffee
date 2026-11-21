# Design System RE:coffee

> Salinan PRD bagian 15 (dibuat di M1). Sumber kebenaran untuk semua komponen.
> Implementasi token: `src/styles/index.css` (`@theme`). Katalog visual: `npm run dev` lalu buka `/dev/ui`.

Referensi metode: skill frontend-design (token dulu, satu elemen berani, sisanya tenang) dan pola "satu file design system sebagai sumber kebenaran". Di M1, bagian ini disalin ke `docs/design-system.md` dan semua komponen wajib mengikutinya.

## 15.1 Konsep

**"Warung kopi, diseduh ulang."** Nama RE:coffee dibaca sebagai _re-_ (kembali): kenangan warung kopi lama dihadirkan dengan cara yang bersih dan modern.

- **Nostalgia** datang dari _bahasa visual warung_: gelas blirik (enamel hijau berbintik), kopi tubruk dengan ampas, kaleng kerupuk, teko, papan harga yang ditulis rapi.
- **Modern** datang dari _disiplin_: latar putih, banyak ruang kosong, grid yang tenang, tipografi yang tegas.
- Elemen warung **hanya muncul sebagai ikon garis SVG**, tidak sebagai tekstur, foto, atau ilustrasi penuh.

## 15.2 Warna

| Token    | Hex       | Pemakaian                                                                                   |
| -------- | --------- | ------------------------------------------------------------------------------------------- |
| `putih`  | `#FFFFFF` | Latar utama semua halaman                                                                   |
| `tegel`  | `#F4F4F2` | Latar sekunder (area keranjang, baris hover tabel admin), sangat hemat                      |
| `garis`  | `#E4E2DE` | Border 1 px, pemisah, leader titik di papan menu                                            |
| `tubruk` | `#2B201B` | Teks utama, ikon, logo                                                                      |
| `ampas`  | `#76695F` | Teks sekunder (deskripsi menu, jam, keterangan); kontras ±5:1 di putih                      |
| `blirik` | `#2F6B57` | Aksen utama: tombol primer, fokus ring, meja terisi; kontras ±6:1 di putih                  |
| `lampu`  | `#F0B840` | Status minta bill (sebagai **latar** dengan teks `tubruk`, tidak pernah sebagai warna teks) |
| `kaleng` | `#B23A2E` | Error dan aksi destruktif (batalkan sesi)                                                   |

Aturan: maksimal satu warna aksen per layar selain status. Tidak ada gradien. Tidak ada shadow; pemisah memakai border `garis` atau ruang kosong.

## 15.3 Tipografi

| Peran                                      | Font                                                                 | Alasan                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Display (logo, nomor meja, judul kategori) | **Gloock** (Google Fonts, via `@fontsource/gloock`)                  | Serif kontras tinggi dengan rasa papan nama toko lama; dipakai hemat, hanya ukuran besar    |
| Teks, UI, angka harga                      | **Plus Jakarta Sans** (via `@fontsource-variable/plus-jakarta-sans`) | Sans modern buatan desainer Indonesia untuk identitas kota Jakarta; angka jelas untuk harga |

Skala (rem, rasio ±1.25):

| Token        | Ukuran / line-height | Pemakaian                          |
| ------------ | -------------------- | ---------------------------------- |
| `display-xl` | 4rem / 1             | Nomor meja di halaman pelanggan    |
| `display-l`  | 2.5rem / 1.1         | Judul halaman admin, total tagihan |
| `display-m`  | 1.75rem / 1.2        | Judul kategori menu                |
| `body-l`     | 1.125rem / 1.5       | Nama menu                          |
| `body`       | 1rem / 1.55          | Teks umum                          |
| `body-s`     | 0.875rem / 1.5       | Deskripsi, keterangan              |

Aturan tipografi:

- Sentence case di semua teks. **Tidak ada label ALL CAPS**, tidak ada eyebrow label di atas judul.
- Harga memakai `font-variant-numeric: tabular-nums` agar sejajar.
- Tidak menonjolkan satu kata dengan warna/italic di judul.
- Panjang baris teks maksimal ±65 karakter.

## 15.4 Spasi, grid, bentuk

- Skala spasi (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Antar-section minimal 48 px di mobile, 64–96 px di desktop.
- Pelanggan: satu kolom, lebar konten maks 480 px, padding samping 20 px, rata kiri.
- Admin: lebar konten maks 1120 px, rata kiri, navigasi atas sederhana.
- Radius: 6 px untuk tombol/input/dialog; `9999px` hanya untuk meja (lingkaran) dan badge status. Tidak ada radius lain.
- Target sentuh minimal 44 × 44 px.

## 15.5 Elemen signature: papan menu warung

Satu-satunya elemen "berani" di desain. Menu **tidak** ditampilkan sebagai grid kartu, melainkan sebagai **daftar harga ala papan warung**:

```
Kopi                                        [ikon gelas blirik]

Kopi Tubruk ·························· Rp15.000   [ + ]
Kopi hitam diseduh langsung, ampasnya ikut menemani.

Kopi Susu Gula Aren ·················· Rp22.000   [ + ]
Espresso, susu segar, gula aren cair.
```

- Leader titik memakai `border-bottom: 1px dotted var(--color-garis)` pada elemen flex pengisi, bukan karakter titik.
- Judul kategori memakai Gloock `display-m` dengan ikon SVG kategori di kanan.
- Menu habis: nama dan harga berwarna `ampas`, harga dicoret, tombol diganti teks "Habis".

## 15.6 Ikon SVG kustom (tulis tangan, tanpa AI)

Spesifikasi: viewBox 24 × 24, stroke 1.5 px, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`, warna `currentColor`. Setiap ikon adalah komponen React di `src/components/brand/icons/`.

| Ikon                                                                                              | Dipakai untuk                                        |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `GelasBlirik`                                                                                     | Kategori kopi (gelas enamel dengan 3–4 titik bintik) |
| `CangkirTubruk`                                                                                   | Kopi tubruk, empty state tagihan                     |
| `Teko`                                                                                            | Kategori non-kopi                                    |
| `PiringRoti`                                                                                      | Kategori makanan                                     |
| `KalengKerupuk`                                                                                   | Kategori camilan                                     |
| `BijiKopi`                                                                                        | Logo mark, favicon, pemisah dekoratif tunggal        |
| `KursiPlastik`                                                                                    | Empty state denah (semua meja kosong)                |
| `Uap`                                                                                             | Animasi kecil saat pesanan terkirim                  |
| Ikon UI umum (plus, minus, check, x, sign out, arrow kiri) memakai Phosphor Icons gaya `regular`. |

## 15.7 Logo

- Wordmark: **RE:coffee** dengan Gloock, warna `tubruk`.
- Tanda titik dua ":" diganti **dua biji kopi kecil** bertumpuk (SVG `BijiKopi` versi isi `blirik`).
- Logo mark (favicon): satu biji kopi `blirik` di lingkaran putih, file `public/favicon.svg`.
- Komponen: `<Logo size="sm|md|lg" />`.

## 15.8 Komponen dasar (`src/components/ui/`)

| Komponen                                    | Varian / state wajib                                                                                                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                    | `primary` (latar blirik, teks putih), `secondary` (border garis, teks tubruk), `ghost`, `danger` (teks kaleng); state default, hover, focus-visible, disabled, loading |
| `IconButton`                                | Untuk + / − di menu dan keranjang, 44 px                                                                                                                               |
| `Badge`                                     | Status pesanan dan meja, selalu berisi teks (tidak hanya warna)                                                                                                        |
| `Dialog`                                    | Konfirmasi bayar, batalkan sesi; memakai elemen `<dialog>` native                                                                                                      |
| `Sheet`                                     | Panel keranjang dari bawah (mobile)                                                                                                                                    |
| `TextField`, `TextArea`, `Select`, `Switch` | Untuk form menu admin; label di atas, pesan error di bawah                                                                                                             |
| `InlineMessage`                             | Info, sukses, error                                                                                                                                                    |
| `Spinner` / `Skeleton`                      | Loading; skeleton berupa garis abu `tegel`, bukan kotak kartu                                                                                                          |

Fokus: `outline: 2px solid var(--color-blirik); outline-offset: 2px` pada `:focus-visible`.

## 15.9 Motion

- Satu momen saja: saat pesanan terkirim, ikon `Uap` di atas `CangkirTubruk` naik dan memudar (±600 ms).
- Transisi sheet/dialog 150–200 ms, hanya opacity + translate.
- Tidak ada animasi masuk per section, tidak ada hover lift.
- Hormati `prefers-reduced-motion: reduce` → semua animasi dimatikan.

## 15.10 Penulisan (copy)

- Bahasa Indonesia santai-sopan, sentence case, kalimat pendek.
- Tombol menyebut aksinya, dan nama aksi konsisten sepanjang alur:
  - **Tambah** → **Lihat pesanan** → **Kirim pesanan** → pesan "Pesanan terkirim ke barista."
  - **Minta bill** → pesan "Bill diminta. Kasir akan segera memproses."
  - **Konfirmasi bayar** → pesan "Pembayaran meja 18 dikonfirmasi. Meja kosong lagi."
- Error menjelaskan apa yang terjadi dan apa yang harus dilakukan, tanpa minta maaf berlebihan.
- Empty state mengajak bertindak: "Belum ada pesanan. Pilih menu di atas untuk mulai."

## 15.11 Larangan desain

- Grid kartu menu dengan foto, shadow, dan radius besar.
- Gradien, glassmorphism, blob dekoratif.
- Latar krem/beige; latar wajib putih.
- Label ALL CAPS, eyebrow, penomoran 01/02/03 yang bukan urutan.
- Gambar AI, foto stok yang di-generate, ilustrasi orang.
- Emoji sebagai ikon.

## Implementasi di kode (M1)

| Token PRD              | Kelas Tailwind                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Warna `putih`…`kaleng` | `bg-blirik`, `text-ampas`, `border-garis`, dst. Palet bawaan Tailwind dimatikan.                 |
| Font display / teks    | `font-display` (Gloock), `font-sans` (Plus Jakarta Sans, default body)                           |
| Skala tipografi        | `text-display-xl`, `text-display-l`, `text-display-m`, `text-body-l`, `text-body`, `text-body-s` |
| Radius                 | `rounded-ui` (6 px), `rounded-full` (meja, badge). Radius lain dimatikan.                        |
| Shadow                 | Dimatikan seluruhnya.                                                                            |
| Lebar konten           | `max-w-pelanggan` (480 px), `max-w-admin` (1120 px)                                              |
| Spasi                  | Skala bawaan Tailwind (1 = 4 px): 1, 2, 3, 4, 6, 8, 12, 16, 24 = 4…96 px                         |
| Motion uap             | `animate-uap` (600 ms), mati otomatis saat `prefers-reduced-motion`                              |
| Fokus                  | `:focus-visible` outline 2 px blirik, offset 2 px (global)                                       |
