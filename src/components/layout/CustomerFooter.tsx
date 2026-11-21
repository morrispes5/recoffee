import { BijiKopi } from '../brand/icons';

/** Penutup halaman pelanggan. Ruang bawah ekstra agar tidak tertutup bar keranjang. */
export function CustomerFooter() {
  return (
    <footer className="mt-20 border-t border-garis px-5 pt-6 pb-32 text-body-s text-ampas">
      <p className="flex items-center gap-2">
        <BijiKopi size={16} filled className="text-blirik" />
        RE:coffee. Warung kopi, diseduh ulang.
      </p>
    </footer>
  );
}
