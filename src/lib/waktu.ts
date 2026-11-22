const ZONA = 'Asia/Jakarta';
const OFFSET_JAKARTA_MS = 7 * 60 * 60 * 1000; // WIB = UTC+7, tanpa daylight saving

/** Awal hari ini (00.00 WIB) sebagai Date UTC, untuk filter "hari ini" di database. */
export function awalHariJakarta(now: Date = new Date()): Date {
  const wib = new Date(now.getTime() + OFFSET_JAKARTA_MS);
  const tengahMalamWib = Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
  return new Date(tengahMalamWib - OFFSET_JAKARTA_MS);
}

/** Lama menunggu sejak `iso`, contoh "baru saja", "7 menit", "1 jam 5 menit". */
export function lamaSejak(iso: string, now: Date = new Date()): string {
  const menit = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000));
  if (menit < 1) return 'baru saja';
  if (menit < 60) return `${menit} menit`;
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  return sisa === 0 ? `${jam} jam` : `${jam} jam ${sisa} menit`;
}

const tanggalFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: ZONA,
});

/** Contoh "Minggu, 22 November 2026". */
export function formatTanggalPanjang(now: Date = new Date()): string {
  return tanggalFormatter.format(now);
}
