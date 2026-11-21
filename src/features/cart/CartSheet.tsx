import { Minus, Plus } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Button, IconButton, Sheet, TextArea } from '../../components/ui';
import { cn } from '../../lib/cn';
import { formatRupiah } from '../../lib/format';
import { MAX_CATATAN, MAX_QTY } from './cartReducer';
import { useCart } from './useCart';

export interface CartSheetProps {
  open: boolean;
  onClose: () => void;
  /** menuId yang ternyata sudah habis, ditandai di daftar. */
  habisIds: ReadonlySet<string>;
  /** Area aksi (tombol kirim / masuk Google / pesan error). */
  aksi: ReactNode;
}

/** Sheet keranjang: − qty +, hapus, catatan, total, aksi kirim (PRD 16.3). */
export function CartSheet({ open, onClose, habisIds, aksi }: CartSheetProps) {
  const { state, dispatch, total } = useCart();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Pesanan kamu"
      footer={
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-ampas">Total</span>
            <span className="text-body-l font-semibold tabular-nums">{formatRupiah(total)}</span>
          </div>
          {aksi}
        </div>
      }
    >
      {state.items.length === 0 ? (
        <p className="py-6 text-ampas">Belum ada pesanan. Pilih menu untuk mulai.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-garis">
          {state.items.map((item) => {
            const habis = habisIds.has(item.menuId);
            return (
              <li key={item.menuId} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className={cn('font-medium', habis && 'text-ampas')}>{item.nama}</p>
                  <p className="text-body-s text-ampas tabular-nums">
                    {habis ? (
                      <span className="font-medium text-kaleng">Habis, hapus dulu</span>
                    ) : (
                      formatRupiah(item.hargaTampil * item.qty)
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'hapus', menuId: item.menuId })}
                    className="-ml-1 min-h-8 rounded-ui px-1 text-body-s text-ampas underline underline-offset-2 hover:text-kaleng"
                  >
                    Hapus
                  </button>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <IconButton
                    label={`Kurangi ${item.nama}`}
                    onClick={() => dispatch({ type: 'kurangi', menuId: item.menuId })}
                  >
                    <Minus size={18} aria-hidden="true" />
                  </IconButton>
                  <span
                    className="w-8 text-center font-semibold tabular-nums"
                    aria-label={`Jumlah ${item.nama}`}
                  >
                    {item.qty}
                  </span>
                  <IconButton
                    label={`Tambah ${item.nama}`}
                    disabled={item.qty >= MAX_QTY || habis}
                    onClick={() =>
                      dispatch({
                        type: 'tambah',
                        item: {
                          menuId: item.menuId,
                          nama: item.nama,
                          hargaTampil: item.hargaTampil,
                        },
                      })
                    }
                  >
                    <Plus size={18} aria-hidden="true" />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {state.items.length > 0 ? (
        <div className="mt-4">
          <TextArea
            label="Catatan (opsional)"
            value={state.catatan}
            onChange={(e) => dispatch({ type: 'setCatatan', catatan: e.target.value })}
            maxLength={MAX_CATATAN}
            rows={2}
            placeholder="Contoh: less sugar, es dipisah"
          />
        </div>
      ) : null}
      {state.items.length > 0 ? (
        <Button
          variant="ghost"
          className="mt-2 -ml-3 text-ampas"
          onClick={() => dispatch({ type: 'kosongkan' })}
        >
          Kosongkan pesanan
        </Button>
      ) : null}
    </Sheet>
  );
}
