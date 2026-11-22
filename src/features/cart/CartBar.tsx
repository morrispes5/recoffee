import { CaretRight } from '@phosphor-icons/react';
import { AnimatePresence, m } from 'motion/react';
import { BottomBar } from '../../components/layout/BottomBar';
import { formatRupiah } from '../../lib/format';
import { useCart } from './useCart';

/** Bar keranjang menempel di bawah, meluncur masuk bila keranjang tidak kosong (PRD 16.3). */
export function CartBar({ onBuka }: { onBuka: () => void }) {
  const { jumlahItem, total } = useCart();
  return (
    <AnimatePresence>
      {jumlahItem > 0 ? (
        <BottomBar key="bar-keranjang">
          <m.button
            type="button"
            onClick={onBuka}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex min-h-14 w-full items-center gap-3 rounded-ui bg-blirik px-4 text-left text-putih hover:bg-blirik/90"
          >
            <span
              key={jumlahItem}
              className="flex size-8 shrink-0 animate-pop items-center justify-center rounded-full bg-putih text-body-s font-semibold text-blirik tabular-nums"
            >
              {jumlahItem}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Lihat pesanan</span>
              <span className="block text-body-s text-putih/80 tabular-nums" aria-live="polite">
                {jumlahItem} item, {formatRupiah(total)}
              </span>
            </span>
            <CaretRight size={20} aria-hidden="true" />
          </m.button>
        </BottomBar>
      ) : null}
    </AnimatePresence>
  );
}
