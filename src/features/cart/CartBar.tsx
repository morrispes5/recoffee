import { BottomBar } from '../../components/layout/BottomBar';
import { Button } from '../../components/ui';
import { formatRupiah } from '../../lib/format';
import { useCart } from './useCart';

/** Bar keranjang menempel di bawah, muncul bila keranjang tidak kosong (PRD 16.3). */
export function CartBar({ onBuka }: { onBuka: () => void }) {
  const { jumlahItem, total } = useCart();
  if (jumlahItem === 0) return null;
  return (
    <BottomBar>
      <div className="flex items-center justify-between gap-4">
        <p className="text-body font-medium tabular-nums" aria-live="polite">
          {jumlahItem} item, {formatRupiah(total)}
        </p>
        <Button onClick={onBuka}>Lihat pesanan</Button>
      </div>
    </BottomBar>
  );
}
