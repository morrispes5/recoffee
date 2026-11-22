/**
 * Supabase mengembalikan kegagalan login Google lewat URL redirect
 * (`?error=...&error_description=...`, atau di hash). Router segera mengganti URL,
 * jadi nilainya ditangkap sekali saat aplikasi dimuat (modul ini diimpor di `main.tsx`).
 */
function tangkap(): string | null {
  if (typeof window === 'undefined') return null;
  const { search, hash, pathname } = window.location;
  const query = new URLSearchParams(search);
  const fragmen = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const ada = query.get('error') ?? fragmen.get('error');
  if (!ada) return null;

  // Bersihkan parameter error agar tidak muncul lagi saat halaman dimuat ulang.
  for (const key of ['error', 'error_code', 'error_description']) query.delete(key);
  const sisa = query.toString();
  window.history.replaceState(window.history.state, '', `${pathname}${sisa ? `?${sisa}` : ''}`);
  return ada;
}

const errorLogin = tangkap();

/**
 * True bila halaman ini dimuat dari redirect login yang gagal. Tidak mengubah state,
 * sehingga aman dipanggil dua kali oleh StrictMode. Nilai hilang di muat ulang berikutnya.
 */
export function ambilErrorLogin(): boolean {
  return errorLogin !== null;
}

export const PESAN_LOGIN_GAGAL =
  'Masuk dengan Google gagal. Coba lagi; bila terus terjadi, hubungi pengelola RE:coffee.';
