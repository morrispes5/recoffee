import { IkonKategori } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { LABEL_KATEGORI } from '../../types/domain';
import { useCart } from '../cart/useCart';
import { URUTAN_KATEGORI } from './api';
import { useMenu } from './hooks';
import { MenuRow } from './MenuRow';

/** Papan menu per kategori (FR-02, FR-03). */
export function MenuBoard({ terkunci = false }: { terkunci?: boolean }) {
  const menuQ = useMenu();
  const { dispatch, qtyOf } = useCart();

  if (menuQ.isPending) {
    return (
      <div className="flex flex-col gap-10" aria-busy="true">
        <Skeleton lines={5} label="Memuat menu" />
        <Skeleton lines={4} label="Memuat menu" />
      </div>
    );
  }

  if (menuQ.isError) {
    return (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" onClick={() => void menuQ.refetch()} className="-my-2">
            Coba lagi
          </Button>
        }
      >
        Menu belum termuat. {toUserMessage(menuQ.error)}
      </InlineMessage>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {URUTAN_KATEGORI.map((kategori) => {
        const daftar = menuQ.data.filter((m) => m.kategori === kategori);
        if (daftar.length === 0) return null;
        const judulId = `kategori-${kategori}`;
        return (
          <section key={kategori} aria-labelledby={judulId}>
            <h2 id={judulId} className="flex items-end gap-3">
              <span className="font-display text-display-m">{LABEL_KATEGORI[kategori]}</span>
              <span
                aria-hidden="true"
                className="mb-2.5 flex-1 border-b border-dotted border-ampas/50"
              />
              <IkonKategori kategori={kategori} size={28} className="mb-0.5 text-tubruk" />
            </h2>
            <ul className="mt-2 divide-y divide-garis">
              {daftar.map((menu) => (
                <MenuRow
                  key={menu.id}
                  menu={menu}
                  qty={qtyOf(menu.id)}
                  terkunci={terkunci}
                  onTambah={() =>
                    dispatch({
                      type: 'tambah',
                      item: { menuId: menu.id, nama: menu.nama, hargaTampil: menu.harga },
                    })
                  }
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
