# Serah terima dan operasional RE:coffee (M7)

Dokumen ini menjawab tiga pertanyaan: apa yang sedang berjalan dan di akun siapa, apa yang dicek sebelum demo,
dan bagaimana memasang ulang dari nol kalau akun atau project berpindah.

## 1. Yang sedang berjalan

| Hal               | Alamat atau lokasi                                                | Dipegang oleh                      |
| ----------------- | ----------------------------------------------------------------- | ---------------------------------- |
| Aplikasi produksi | https://recoffee-ten.vercel.app                                   | Akun Vercel pemilik (`morrispes5`) |
| Halaman pelanggan | `/meja/N`, N = 1 sampai 28 (contoh `/meja/18`)                    |                                    |
| Halaman kasir     | `/admin/masuk` (login Google), lalu `/admin`                      |                                    |
| Kode              | https://github.com/morrispes5/recoffee (privat)                   | Akun GitHub pemilik                |
| Database dan Auth | Project Supabase `recoffee`, region Singapore, free plan          | Organisasi Supabase pemilik        |
| Login Google      | OAuth client di Google Cloud project `recoffee`                   | Akun Google pemilik                |
| QR meja           | `public/qr-meja/meja-NN.svg`, halaman cetak `/qr-meja/cetak.html` | Dibuat dari repo                   |
| Penjaga database  | GitHub Actions `keep-alive` (tiap 3 hari)                         | Repo GitHub                        |

Setiap `git push` ke cabang `main` memicu deploy produksi otomatis di Vercel (repo sudah tersambung).

### Keputusan hosting (22 Nov 2026)

Semua infrastruktur tetap di akun pemilik. Nisa memakai akun Google pemilik untuk masuk sebagai kasir saat
demo, atas keputusan pemilik. Nisa hanya butuh login Google untuk aplikasi; dia tidak butuh akses ke dashboard
Supabase, Vercel, atau GitHub. Google bisa meminta verifikasi 2 langkah ke HP pemilik saat login dari
perangkat baru, jadi coba login dari perangkat yang akan dipakai presentasi jauh sebelum hari H.

Bila nanti infrastruktur harus dipindah ke akun lain, ikuti bagian 4.

## 2. Checklist sebelum demo

Lakukan sehari sebelum demo (H-1) dan ulangi singkat pada pagi harinya.

- [ ] Buka https://recoffee-ten.vercel.app/meja/18: menu muncul.
- [ ] Masuk di `/admin/masuk` dengan akun Google kasir. Aplikasi Google berstatus Testing, jadi login perlu
      diulang kira-kira tiap 7 hari.
- [ ] Buat satu pesanan uji dari `/meja/N`, proses dan antar dari antrian, minta bill, lalu konfirmasi bayar.
- [ ] Bersihkan data uji (SQL di bawah) supaya dasbor mulai dari Rp0.
- [ ] Cek dashboard Supabase: project tidak berstatus _paused_. Bila paused, tekan **Restore project** dan tunggu
      beberapa menit.
- [ ] GitHub, tab Actions, workflow `keep-alive`: jalankan manual (Run workflow) dan pastikan hijau.
- [ ] `public/qris.png` terpasang dan hanya berisi kotak QR (tanpa NMID dan alamat).
- [ ] Cetak `/qr-meja/cetak.html` (Ctrl+P), minimal meja 1, 18, dan 27. Pindai satu QR dengan kamera HP dan
      pastikan membuka meja yang benar.
- [ ] Bila penguji akan mencoba memesan atau masuk kasir, daftarkan Gmail mereka sebagai _Test user_ di Google
      Auth Platform (Audience). Tanpa itu Google menolak login.

Uang sungguhan: QRIS yang dipakai asli. Saat demo cukup tunjukkan alurnya; jangan minta penguji membayar
total tagihan sungguhan.

### SQL membersihkan data uji

Jalankan di SQL Editor Supabase. Urutan hapus anak ke induk. Menu, meja, admin, dan profil tidak ikut terhapus.

```sql
delete from item_pesanan;
delete from pesanan;
delete from sesi_meja;
```

## 3. Mengubah alamat atau domain

QR berisi alamat lengkap. Bila alamat aplikasi berubah (ganti nama project Vercel, domain sendiri), lakukan:

1. Ubah **Site URL** dan tambahkan alamat baru ke **Redirect URLs** di Supabase, Authentication, URL Configuration
   (bentuk `https://alamat-baru/**`).
2. Buat ulang QR: `node scripts/generate-qr.mjs https://alamat-baru`, commit, push, lalu cetak ulang.

Alamat di Google Cloud tidak perlu diubah, karena callback login menuju Supabase, bukan ke Vercel.

## 4. Memasang ulang dari nol (akun atau project baru)

Perkiraan 30 sampai 45 menit. Kode tidak berisi rahasia; yang dibutuhkan hanya dua nilai ENV.

1. **Kode.** Salin atau transfer repo GitHub. Riwayat commit ikut apa adanya.
2. **Supabase.** Buat project baru. Di SQL Editor jalankan berurutan `supabase/migrations/0001` sampai `0005`, lalu
   `supabase/seed.sql`. Sebelum menjalankan seed, ganti email admin di baris terakhir dengan email Google kasir
   yang baru (huruf kecil). Migrasi `0005` sudah memasukkan 22 menu kafe.
3. **Google Cloud.** Buat project, lalu Google Auth Platform: aplikasi _External_, status _Testing_, tambahkan
   akun penguji sebagai _Test user_. Buat OAuth client jenis _Web application_ dengan _Authorized redirect URI_
   `https://<ref-project-supabase>.supabase.co/auth/v1/callback`.
4. **Supabase Auth.** Authentication, Sign In / Providers, Google: aktifkan, tempel Client ID dan Client Secret
   dari langkah 3. Lalu URL Configuration: Site URL dan Redirect URLs sesuai bagian 3.
5. **Vercel.** Import repo (preset Vite, build `npm run build`, output `dist`). Isi Environment Variables
   (Production dan Preview): `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key, dari Project
   Settings, API Keys). `vercel.json` sudah menangani refresh route dalam.
6. **GitHub Actions.** Di Settings, Secrets and variables, Actions, isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY`
   agar `keep-alive` berjalan.
7. **QRIS dan QR meja.** Tempel `public/qris.png`, lalu `node scripts/generate-qr.mjs https://alamat-baru`.
8. **Uji.** Ikuti checklist bagian 2.

## 5. Yang tidak boleh

- Jangan commit `.env`, `.env.local`, atau kunci apa pun. Hanya `.env.example` yang ada di repo.
- Jangan memakai kunci `service_role` di project ini.
- Jangan menaruh gambar QRIS versi lengkap (berisi NMID dan alamat) di `public/`; file di sana bisa dibuka siapa saja.
- Jangan menghapus atau mem-pause project Supabase sebelum nilai keluar.
- Jangan membagikan password Google akun kasir ke pihak lain di luar yang sudah diputuskan pemilik.
