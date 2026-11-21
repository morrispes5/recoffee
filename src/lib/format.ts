const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const jamFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
});

/** Format integer Rupiah. Satu-satunya cara menampilkan uang (PRD aturan 6). */
export function formatRupiah(n: number): string {
  // Intl memakai spasi tak putus antara "Rp" dan angka; dirapatkan agar tampil "Rp15.000".
  return rupiahFormatter.format(n).replace(/\s/g, '');
}

/** Jam:menit zona Asia/Jakarta, contoh "14.05". */
export function formatJam(iso: string): string {
  return jamFormatter.format(new Date(iso));
}
