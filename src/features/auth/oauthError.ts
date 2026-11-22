/**
 * Supabase mengembalikan hasil login Google lewat URL redirect: `?error=...` bila gagal,
 * `?code=...` bila berhasil (PKCE). Router segera mengganti URL, jadi keduanya ditangkap sekali
 * saat aplikasi dimuat (modul ini diimpor di `main.tsx`). Dibaca dengan `konsumsi*` di efek.
 */
function tangkap(): { gagal: boolean; berhasil: boolean } {
  if (typeof window === 'undefined') return { gagal: false, berhasil: false };
  const { search, hash, pathname } = window.location;
  const query = new URLSearchParams(search);
  const fragmen = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const gagal = (query.get('error') ?? fragmen.get('error')) !== null;

  if (gagal) {
    // Bersihkan parameter error agar tidak muncul lagi saat halaman dimuat ulang.
    for (const key of ['error', 'error_code', 'error_description']) query.delete(key);
    const sisa = query.toString();
    window.history.replaceState(window.history.state, '', `${pathname}${sisa ? `?${sisa}` : ''}`);
  }
  // `code` dibiarkan: Supabase memakainya untuk menukar sesi, lalu menghapusnya sendiri.
  return { gagal, berhasil: !gagal && query.has('code') };
}

const awal = tangkap();
let loginGagal = awal.gagal;
let loginBerhasil = awal.berhasil;

/** True sekali bila halaman ini dimuat dari redirect login yang gagal. */
export function konsumsiErrorLogin(): boolean {
  const nilai = loginGagal;
  loginGagal = false;
  return nilai;
}

/** True sekali bila halaman ini dimuat dari redirect login yang berhasil. */
export function konsumsiLoginBerhasil(): boolean {
  const nilai = loginBerhasil;
  loginBerhasil = false;
  return nilai;
}

export const PESAN_LOGIN_GAGAL =
  'Masuk dengan Google gagal. Coba lagi; bila terus terjadi, hubungi pengelola RE:coffee.';
