import { m } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { IkonKategori } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { cn } from '../../lib/cn';
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
  const [aktif, setAktif] = useState<string | null>(null);

  const kelompok = useMemo(
    () =>
      URUTAN_KATEGORI.map((kategori) => ({
        kategori,
        daftar: (menuQ.data ?? []).filter((m) => m.kategori === kategori),
      })).filter((k) => k.daftar.length > 0),
    [menuQ.data],
  );

  // Scroll-spy: chip kategori mengikuti bagian yang sedang dibaca.
  useEffect(() => {
    const elemen = kelompok
      .map((k) => document.getElementById(`kategori-${k.kategori}`))
      .filter((el): el is HTMLElement => el !== null);
    if (elemen.length === 0) return;
    const pengamat = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (e.isIntersecting) setAktif(e.target.id.replace('kategori-', ''));
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const el of elemen) pengamat.observe(el);
    return () => pengamat.disconnect();
  }, [kelompok]);

  // Chip aktif selalu terlihat di barisnya.
  useEffect(() => {
    if (!aktif) return;
    document
      .getElementById(`chip-${aktif}`)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [aktif]);

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

  return (
    <>
      {/* Lompat ke kategori; menempel di bawah header, penanda aktif bergeser mengikuti scroll. */}
      <nav
        aria-label="Kategori menu"
        className="sticky top-14 z-10 -mx-5 border-b border-garis bg-putih px-5 py-2"
      >
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none]">
          {kelompok.map(({ kategori }) => {
            const dipilih = aktif === kategori;
            return (
              <li key={kategori} className="shrink-0">
                <a
                  id={`chip-${kategori}`}
                  href={`#kategori-${kategori}`}
                  aria-current={dipilih ? 'true' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-ui border px-3 text-body-s font-semibold transition-colors duration-200',
                    dipilih
                      ? 'border-blirik text-putih'
                      : 'border-garis text-tubruk hover:border-tubruk',
                  )}
                >
                  {dipilih ? (
                    <m.span
                      layoutId="chip-kategori"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-ui bg-blirik"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  ) : null}
                  <span className="relative flex items-center gap-2">
                    <IkonKategori
                      kategori={kategori}
                      size={20}
                      className={dipilih ? 'text-putih' : 'text-blirik'}
                    />
                    {LABEL_KATEGORI[kategori]}
                  </span>
                </a>
              </li>
            );
          })}
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
