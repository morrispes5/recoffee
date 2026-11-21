import { Plus } from '@phosphor-icons/react';
import { IconButton } from '../../components/ui';
import { cn } from '../../lib/cn';
import { formatRupiah } from '../../lib/format';
import type { Menu } from '../../types/domain';
import { MAX_QTY } from '../cart/cartReducer';

export interface MenuRowProps {
  menu: Menu;
  qty: number;
  onTambah: () => void;
  /** true saat bill sudah diminta: tombol tambah dinonaktifkan. */
  terkunci?: boolean;
}

/** Satu baris papan menu warung: nama ····· harga [+] (PRD 15.5). */
export function MenuRow({ menu, qty, onTambah, terkunci = false }: MenuRowProps) {
  const habis = !menu.tersedia;
  return (
    <li className="py-4">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className={cn('text-body-l font-semibold', habis && 'text-ampas')}>
            {menu.nama}
          </span>
          <span
            aria-hidden="true"
            className="min-w-4 flex-1 translate-y-[-0.3em] border-b border-dotted border-ampas/60"
          />
          <span
            className={cn(
              'text-body font-semibold whitespace-nowrap tabular-nums',
              habis && 'font-normal text-ampas line-through',
            )}
          >
            {habis ? <span className="sr-only">Harga </span> : null}
            {formatRupiah(menu.harga)}
          </span>
        </div>
        <div className="flex w-16 shrink-0 items-center justify-end gap-1.5">
          {habis ? (
            <span className="pr-1 text-body-s font-medium text-ampas">Habis</span>
          ) : (
            <>
              {qty > 0 ? (
                <span className="text-body-s font-semibold text-blirik tabular-nums">{qty}×</span>
              ) : null}
              <IconButton
                label={
                  qty > 0
                    ? `Tambah ${menu.nama}, sekarang ${qty} di pesanan`
                    : `Tambah ${menu.nama}`
                }
                onClick={onTambah}
                disabled={terkunci || qty >= MAX_QTY}
                variant={qty > 0 ? 'primary' : 'aksen'}
              >
                <Plus size={18} aria-hidden="true" />
              </IconButton>
            </>
          )}
        </div>
      </div>
      {menu.deskripsi ? (
        <p className="mt-1 max-w-[42ch] pr-16 text-body-s text-ampas">{menu.deskripsi}</p>
      ) : null}
    </li>
  );
}
