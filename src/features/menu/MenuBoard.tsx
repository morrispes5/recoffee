import { IkonKategori } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { LABEL_KATEGORI } from '../../types/domain';
import { useCart } from '../cart/useCart';
import { URUTAN_KATEGORI } from './api';
import { useMenu } from './hooks';
import { MenuRow } from './MenuRow';

/** Papan menu per kategori (FR-02, FR-03, PRD 15.5). */
export function MenuBoard({ terkunci = false }: { terkunci?: boolean }) {
  const menuQ = useMenu();
  const { dispatch, qtyOf } = useCart();

  if (menuQ.isPending) {
    return (
      <div className="flex flex-col gap-10 pt-4" aria-busy="true">
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

  const kelompok = URUTAN_KATEGORI.map((kategori) => ({
    kategori,
    daftar: menuQ.data.filter((m) => m.kategori === kategori),
  })).filter((k) => k.daftar.length > 0);

  return (
    <>
      {/* Lompat ke kategori; menempel di bawah header saat menu digulir. */}
      <nav
        aria-label="Kategori menu"
        className="sticky top-14 z-10 -mx-5 border-b border-garis bg-putih px-5 py-2"
      >
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none]">
          {kelompok.map(({ kategori }) => (
            <li key={kategori} className="shrink-0">
              <a
                href={`#kategori-${kategori}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-ui border border-garis px-3 text-body-s font-semibold text-tubruk hover:border-tubruk"
              >
                <IkonKategori kategori={kategori} size={20} className="text-blirik" />
                {LABEL_KATEGORI[kategori]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex flex-col gap-14">
        {kelompok.map(({ kategori, daftar }, urutan) => {
          const judulId = `judul-kategori-${kategori}`;
          return (
            <section
              key={kategori}
              id={`kategori-${kategori}`}
              aria-labelledby={judulId}
              className="animate-muncul scroll-mt-32 border-t-2 border-tubruk pt-5"
              style={{ animationDelay: `${120 + urutan * 90}ms` }}
            >
              <h2 id={judulId} className="flex items-end gap-3">
                <span className="font-display text-display-m">{LABEL_KATEGORI[kategori]}</span>
                <span
                  aria-hidden="true"
                  className="mb-2.5 flex-1 border-b border-dotted border-ampas/60"
                />
                <IkonKategori kategori={kategori} size={32} className="text-blirik" />
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
    </>
  );
}
