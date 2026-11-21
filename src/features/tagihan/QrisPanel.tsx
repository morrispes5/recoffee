import { useState } from 'react';
import { formatRupiah } from '../../lib/format';

/**
 * Panel QRIS statis (FR-09). Gambar `public/qris.png` disediakan pemilik (sudah dipotong tanpa
 * nama, alamat, NMID). Bila file belum ada, tampil kotak penanda, bukan QR palsu.
 */
export function QrisPanel({ total }: { total: number }) {
  const [gagal, setGagal] = useState(false);
  return (
    <section
      aria-labelledby="judul-qris"
      className="flex flex-col items-center gap-5 rounded-ui border border-garis px-5 py-6 text-center"
    >
      <h2 id="judul-qris" className="text-body-l font-semibold">
        Bayar pakai QRIS
      </h2>
      {gagal ? (
        <div className="grid aspect-square w-full max-w-[280px] place-items-center rounded-ui bg-tegel px-6 text-body-s text-ampas">
          Gambar QRIS belum dipasang. Tempel file public/qris.png.
        </div>
      ) : (
        <img
          src="/qris.png"
          alt="Kode QRIS RE:coffee"
          width={280}
          height={280}
          className="h-auto w-full max-w-[280px]"
          onError={() => setGagal(true)}
        />
      )}
      <div>
        <p className="text-body-s text-ampas">Nominal yang dibayar</p>
        <p className="font-display text-display-l tabular-nums">{formatRupiah(total)}</p>
      </div>
      <p className="max-w-[34ch] text-body-s text-ampas">
        Scan QRIS, masukkan nominal sesuai total, lalu tunjukkan bukti ke kasir.
      </p>
    </section>
  );
}
