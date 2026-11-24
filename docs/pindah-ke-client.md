# Pindah RE:coffee ke akun client

Panduan memindahkan seluruh project dari akun pemilik lama (`morrispes5`) ke akun client, lalu menjalankannya
di laptop client. Ditulis 24 Nov 2026. Perkiraan total 1 sampai 2 jam, kebanyakan menunggu dan klik di dashboard.

Setiap langkah ditandai siapa yang mengerjakan:

- **[PEMILIK]** dikerjakan pemilik lama di akunnya sendiri.
- **[CLIENT]** dikerjakan client. Client boleh minta bantuan Claude Code di laptopnya; `CLAUDE.md` di root repo
  sudah menjelaskan project ini ke Claude.

## Ringkasan: apa pindah ke mana

| Bagian              | Cara pindah                           | Data ikut?                     | Alamat berubah?                         |
| ------------------- | ------------------------------------- | ------------------------------ | --------------------------------------- |
| Kode (GitHub)       | Transfer repo ke akun GitHub client   | Ya, semua riwayat commit       | Jadi `github.com/<client>/recoffee`     |
| Database (Supabase) | Transfer project ke organisasi client | Ya: menu, meja, pesanan, login | Tidak. URL dan kunci API tetap sama     |
| Login Google        | Client membuat OAuth client baru      | Tidak perlu                    | Tidak                                   |
| Hosting (Vercel)    | Client import repo ke Vercel miliknya | Tidak ada data di Vercel       | **Ya**, jadi alamat `*.vercel.app` baru |

Karena alamat Vercel berubah, QR meja harus dibuat ulang (satu perintah, langkah 7). Vercel Hobby (gratis) tidak
bisa menerima transfer project dari akun lain, jadi import ulang adalah jalan termudah.

## Langkah 0. Akun client [CLIENT]

Siapkan dulu, semuanya gratis:

1. Akun Google (Gmail). Dipakai untuk login kasir di aplikasi dan untuk Google Cloud.
2. Akun GitHub. Catat username-nya dan kirim ke pemilik.
3. Akun Vercel, daftar dengan tombol **Continue with GitHub** (plan Hobby).
4. Akun Supabase, daftar dengan **Continue with GitHub**. Buat satu organisasi (plan Free), misalnya `recoffee-client`.
5. Di laptop, pasang [Git](https://git-scm.com/downloads) dan [Node.js 22 LTS](https://nodejs.org/). Cek dengan
   `git --version` dan `node -v`.

## Langkah 1. Rapikan repo sebelum dipindah [PEMILIK]

1. Commit dan push semua perubahan yang belum masuk (`git status` harus bersih).
2. Pastikan `.env.local` tidak ikut ter-commit (sudah di `.gitignore`).

## Langkah 2. Transfer repo GitHub [PEMILIK lalu CLIENT]

1. **[PEMILIK]** Buka https://github.com/morrispes5/recoffee, Settings, General, paling bawah **Danger Zone**,
   **Transfer ownership**. Isi username GitHub client, ketik `morrispes5/recoffee` untuk konfirmasi.
2. **[CLIENT]** Buka email dari GitHub dan terima transfer. Repo sekarang di `github.com/<client>/recoffee`
   (tetap privat).
3. **[CLIENT]** Settings, Secrets and variables, Actions. Pastikan ada `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.
   Bila hilang, isi ulang dengan nilai dari langkah 4 (Project Settings, API Keys, publishable key).
4. **[CLIENT]** Tab Actions: bila workflow dimatikan setelah transfer, aktifkan, lalu jalankan `keep-alive` manual
   (Run workflow) dan pastikan hijau.

## Langkah 3. Transfer project Supabase [CLIENT lalu PEMILIK]

Transfer menjaga semua data, URL `https://<ref>.supabase.co`, dan kunci API, jadi kode dan ENV tidak perlu diubah.

1. **[CLIENT]** Di organisasi Supabase client: Organization Settings, Team, **Invite member**. Undang email akun
   Supabase pemilik dengan role **Owner**.
2. **[PEMILIK]** Terima undangan. Lalu buka project `recoffee` (organisasi pemilik), Project Settings, General,
   **Transfer project**, pilih organisasi client. Bila Supabase menolak karena ada integrasi GitHub atau Vercel yang
   terpasang di project, putuskan dulu integrasinya, lalu ulangi.
3. **[CLIENT]** Pastikan project `recoffee` muncul di organisasinya dan statusnya tidak _paused_.
4. **[PEMILIK]** Keluar dari organisasi client (Organization Settings, Team, Leave). Client yang mengeluarkan juga boleh.

Bila transfer tidak bisa (misal kuota 2 project gratis di organisasi client sudah penuh), pakai jalan cadangan:
client membuat project baru dan menjalankan `supabase/migrations/0001` sampai `0005` lalu `supabase/seed.sql`,
seperti `docs/serah-terima.md` bagian 4. Data pesanan lama hilang, tapi isinya hanya data uji.

## Langkah 4. Jalankan di laptop client [CLIENT]

Repo masih privat. Bila belum ditransfer (langkah 2), client hanya bisa clone setelah **[PEMILIK]** mengundangnya:
https://github.com/morrispes5/recoffee, Settings, Collaborators, **Add people**, isi username GitHub client, lalu
client menerima undangan lewat email. Alamat clone-nya `https://github.com/morrispes5/recoffee.git`. Saat clone
pertama, Git di laptop client akan membuka jendela login GitHub; masuk dengan akun GitHub client.

```powershell
git clone https://github.com/<client>/recoffee.git
cd recoffee
npm install
copy .env.example .env.local
```

Isi `.env.local` dari dashboard Supabase, project `recoffee`, Project Settings, API Keys:

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable key>
```

Lalu `npm run dev` dan buka http://localhost:5173/meja/5. Menu harus muncul. Login kasir belum jalan sampai langkah 5.

Kalau dibantu Claude Code, cukup buka folder `recoffee` dan tulis misalnya: _"Baca CLAUDE.md dan
docs/pindah-ke-client.md, bantu aku lanjut dari langkah 4."_ Kunci di `.env.local` diisi sendiri, jangan ditempel
ke chat.

## Langkah 5. Login Google milik client [CLIENT]

Saat ini login Google memakai OAuth client di Google Cloud pemilik. Client membuat miliknya sendiri:

1. Buka https://console.cloud.google.com dengan Gmail client, buat project baru `recoffee`.
2. Google Auth Platform: Branding (nama aplikasi `RE:coffee`, email client), Audience: **External**, status
   **Testing**. Tambahkan Gmail client dan Gmail penguji (dosen, teman UAT) sebagai **Test users**.
3. Clients, **Create client**, jenis **Web application**. Di _Authorized redirect URIs_ isi
   `https://<ref>.supabase.co/auth/v1/callback`. Simpan Client ID dan Client Secret.
4. Supabase, Authentication, Sign In / Providers, **Google**: ganti Client ID dan Client Secret dengan yang baru. Save.
5. Daftarkan Gmail client sebagai kasir. Supabase, SQL Editor:

   ```sql
   insert into admin (email, nama) values ('gmail-client@gmail.com', 'Kasir 1');
   ```

   Email ditulis huruf kecil. Setelah login client berhasil, hapus admin lama:

   ```sql
   delete from admin where email = 'morrispes5@gmail.com';
   ```

6. Uji di http://localhost:5173/admin/masuk. Supabase, Authentication, URL Configuration, Redirect URLs harus berisi
   `http://localhost:5173/**` supaya login lokal kembali ke localhost.

## Langkah 6. Hosting Vercel milik client [CLIENT]

1. https://vercel.com/new, pilih repo `recoffee` dari GitHub client, **Import**.
2. Framework preset **Vite**, build `npm run build`, output `dist` (biasanya terdeteksi sendiri).
3. Environment Variables (Production dan Preview): `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, nilainya sama
   dengan `.env.local`.
4. **Deploy**. Catat alamatnya, misalnya `https://recoffee-abc.vercel.app`. Bila mau alamat yang lebih rapi,
   Project Settings, Domains, ubah subdomain `*.vercel.app` yang masih kosong.
5. Supabase, Authentication, URL Configuration: **Site URL** diganti alamat baru, dan tambahkan
   `https://alamat-baru/**` di **Redirect URLs**. Hapus `https://recoffee-ten.vercel.app/**`.

## Langkah 7. QR meja dan alamat di dokumen [CLIENT]

```powershell
node scripts/generate-qr.mjs https://alamat-baru
```

Lalu ganti tulisan `recoffee-ten.vercel.app` di `README.md`, `docs/` dan `public/qr-meja/cetak.html` dengan alamat
baru (Claude Code bisa mengerjakan ini), commit, dan push. Push ke `main` otomatis memicu deploy ulang di Vercel.
Cetak ulang `/qr-meja/cetak.html` bila QR lama sudah dicetak.

## Langkah 8. Uji [CLIENT]

Jalankan checklist `docs/serah-terima.md` bagian 2 di alamat baru: menu muncul, login kasir, satu pesanan uji sampai
bayar, lalu bersihkan data uji.

## Langkah 9. Bersih-bersih akun pemilik [PEMILIK]

Kerjakan **setelah** langkah 8 lulus, karena sebelum itu akun lama masih jadi cadangan:

1. Vercel pemilik: project `recoffee`, Settings, Advanced, **Delete Project**. Alamat `recoffee-ten.vercel.app` mati.
2. Google Cloud pemilik: hapus OAuth client lama (atau seluruh project `recoffee`).
3. Pastikan sudah tidak menjadi anggota organisasi Supabase client dan bukan collaborator repo GitHub client,
   kecuali client ingin pemilik tetap membantu.

## Yang tidak boleh

Sama dengan `docs/serah-terima.md` bagian 5: jangan commit `.env.local` atau kunci apa pun, jangan memakai kunci
`service_role`, dan jangan menaruh QRIS versi lengkap di `public/`.
