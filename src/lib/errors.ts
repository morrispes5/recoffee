/** Pemetaan kode error database → pesan UI (PRD 13.5). */
const PESAN_KODE: Record<string, string> = {
  ITEM_TIDAK_VALID: 'Keranjang kosong atau terlalu banyak item.',
  MEJA_TIDAK_DITEMUKAN: 'Nomor meja tidak dikenal. Scan ulang QR di meja kamu.',
  TAGIHAN_SEDANG_DIPROSES: 'Bill sudah diminta. Tambah pesanan lewat kasir.',
  QTY_TIDAK_VALID: 'Jumlah tiap menu harus 1 sampai 20.',
  MENU_TIDAK_TERSEDIA: 'Ada menu yang baru saja habis. Hapus dari keranjang lalu kirim lagi.',
  MENU_TIDAK_DITEMUKAN: 'Menu ini tidak ditemukan. Muat ulang daftar menu.',
  METODE_TIDAK_VALID: 'Pilih metode bayar dulu.',
  SESI_TIDAK_AKTIF: 'Meja ini tidak punya tagihan aktif.',
  BUKAN_ADMIN: 'Akun ini tidak punya akses admin.',
  BELUM_LOGIN: 'Masuk dengan Google dulu untuk melanjutkan.',
  PROFIL_BELUM_LENGKAP: 'Lengkapi nama dan nomor HP dulu.',
  PROFIL_TIDAK_VALID: 'Nama 2–50 huruf dan nomor HP harus benar. Contoh: 081234567890.',
  BUKAN_PEMESAN_MEJA: 'Bill hanya bisa diminta oleh yang sudah memesan di meja ini.',
  TRANSISI_STATUS_TIDAK_VALID: 'Status pesanan sudah berubah. Muat ulang antrian.',
  SUPABASE_ENV_INVALID: 'Koneksi RE:coffee belum dikonfigurasi.',
};

export const PESAN_DEFAULT = 'Gagal terhubung. Cek koneksi lalu coba lagi.';

function ambilTeks(error: unknown): string | null {
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error;
    if (typeof message === 'string') return message;
  }
  return null;
}

/** Kode error yang dikenal di dalam pesan error, atau null. */
export function errorCode(error: unknown): string | null {
  const teks = ambilTeks(error);
  if (!teks) return null;
  for (const kode of Object.keys(PESAN_KODE)) {
    if (new RegExp(`\\b${kode}\\b`).test(teks)) return kode;
  }
  return null;
}

export function toUserMessage(error: unknown): string {
  const kode = errorCode(error);
  return (kode && PESAN_KODE[kode]) || PESAN_DEFAULT;
}
