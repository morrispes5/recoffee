import { CaretRight } from '@phosphor-icons/react';
import { BottomBar } from '../../components/layout/BottomBar';
import { formatRupiah } from '../../lib/format';
import { useCart } from './useCart';

/** Bar keranjang menempel di bawah, muncul bila keranjang tidak kosong (PRD 16.3). */
export function CartBar({ onBuka }: { onBuka: () => void }) {
  const { jumlahItem, total } = useCart();
  if (jumlahItem === 0) return null;
  return (
    <BottomBar>
      <button
        type="button"
        onClick={onBuka}
        className="flex min-h-14 w-full items-center gap-3 rounded-ui bg-blirik px-4 text-left text-putih transition-colors duration-150 hover:bg-blirik/90"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-putih text-body-s font-semibold text-blirik tabular-nums">
          {jumlahItem}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Lihat pesanan</span>
          <span className="block text-body-s text-putih/80 tabular-nums" aria-live="polite">
            {jumlahItem} item, {formatRupiah(total)}
          </span>
        </span>
        <CaretRight size={20} aria-hidden="true" />
      </button>
    </BottomBar>
  );
}
