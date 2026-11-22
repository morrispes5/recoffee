import { Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { IkonKategori } from '../../components/brand/icons';
import { Badge, Button, InlineMessage, Panel, Skeleton, Switch } from '../../components/ui';
import { cn } from '../../lib/cn';
import { toUserMessage } from '../../lib/errors';
import { formatRupiah } from '../../lib/format';
import { LABEL_KATEGORI, type Menu } from '../../types/domain';
import { URUTAN_KATEGORI } from '../menu/api';
import { useMenuAdmin, useUbahStatusMenu } from './hooks';
import { MenuForm } from './MenuForm';

/** Tabel kelola menu per kategori (FR-18, FR-19, FR-20, PRD 16.9). */
export function MenuTable() {
  const menuQ = useMenuAdmin();
  const ubahStatus = useUbahStatusMenu();
  const [tampilArsip, setTampilArsip] = useState(false);
  const [form, setForm] = useState<{ open: boolean; menu: Menu | null }>({
    open: false,
    menu: null,
  });
  const [pesan, setPesan] = useState<string | null>(null);

  function ubah(menu: Menu, patch: { tersedia?: boolean; diarsipkan?: boolean }, teks: string) {
    setPesan(null);
    ubahStatus.mutate({ id: menu.id, patch }, { onSuccess: () => setPesan(teks) });
  }

  const sedangDiubah = ubahStatus.isPending ? ubahStatus.variables.id : null;

  const semua = menuQ.data ?? [];
  const aktif = semua.filter((m) => !m.diarsipkan);
  const ringkasan = [
    { label: 'Menu tampil', nilai: aktif.filter((m) => m.tersedia).length, warna: 'bg-blirik' },
    { label: 'Ditandai habis', nilai: aktif.filter((m) => !m.tersedia).length, warna: 'bg-lampu' },
    { label: 'Diarsipkan', nilai: semua.length - aktif.length, warna: 'bg-garis' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex animate-muncul flex-wrap items-center justify-between gap-4 rounded-ui border border-garis bg-putih p-4 sm:px-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Ringkasan menu">
          {ringkasan.map((r) => (
            <li key={r.label} className="flex items-center gap-2 text-body-s text-ampas">
              <span aria-hidden="true" className={cn('size-2.5 rounded-full', r.warna)} />
              {r.label}
              <span className="font-semibold text-tubruk tabular-nums">{r.nilai}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-4">
          <Switch label="Tampilkan arsip" checked={tampilArsip} onChange={setTampilArsip} />
          <Button
            icon={<Plus size={18} aria-hidden="true" />}
            onClick={() => setForm({ open: true, menu: null })}
          >
            Tambah menu
          </Button>
        </div>
      </div>

      {pesan ? (
        <InlineMessage tone="sukses" className="animate-muncul">
          {pesan}
        </InlineMessage>
      ) : null}
      {ubahStatus.isError ? (
        <InlineMessage tone="error">{toUserMessage(ubahStatus.error)}</InlineMessage>
      ) : null}

      {menuQ.isPending ? (
        <Skeleton lines={8} label="Memuat menu" />
      ) : menuQ.isError ? (
        <InlineMessage tone="error">{toUserMessage(menuQ.error)}</InlineMessage>
      ) : (
        URUTAN_KATEGORI.map((kategori, urutanKategori) => {
          const daftar = menuQ.data.filter(
            (m) => m.kategori === kategori && (tampilArsip || !m.diarsipkan),
          );
          return (
            <Panel
              key={kategori}
              id={`admin-kategori-${kategori}`}
              delay={80 + urutanKategori * 60}
              judul={
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-tegel text-blirik">
                    <IkonKategori kategori={kategori} size={22} />
                  </span>
                  {LABEL_KATEGORI[kategori]}
                </span>
              }
              aksi={
                <span className="text-body-s text-ampas tabular-nums">{daftar.length} menu</span>
              }
            >
              {daftar.length === 0 ? (
                <p className="text-body-s text-ampas">Belum ada menu di kategori ini.</p>
              ) : (
                <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
                  <table className="w-full min-w-[44rem] table-fixed border-collapse text-left">
                    <colgroup>
                      <col />
                      <col className="w-28" />
                      <col className="w-36" />
                      <col className="w-20" />
                      <col className="w-48" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-garis text-body-s text-ampas">
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Nama
                        </th>
                        <th scope="col" className="py-2 pr-4 text-right font-medium">
                          Harga
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Ketersediaan
                        </th>
                        <th scope="col" className="py-2 pr-4 text-right font-medium">
                          Urutan
                        </th>
                        <th scope="col" className="py-2 text-right font-medium">
                          <span className="sr-only">Aksi</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {daftar.map((m) => (
                        <tr
                          key={m.id}
                          className={cn(
                            'border-b border-garis align-middle hover:bg-tegel',
                            m.diarsipkan && 'text-ampas',
                          )}
                        >
                          <td className="py-3 pr-4">
                            <span className="flex flex-wrap items-center gap-2 font-medium">
                              {m.nama}
                              {m.diarsipkan ? <Badge tone="garis">Diarsipkan</Badge> : null}
                            </span>
                            {m.deskripsi ? (
                              <span className="block max-w-[46ch] text-body-s text-ampas">
                                {m.deskripsi}
                              </span>
                            ) : null}
                          </td>
                          <td className="py-3 pr-4 text-right whitespace-nowrap tabular-nums">
                            {formatRupiah(m.harga)}
                          </td>
                          <td className="py-3 pr-4">
                            <Switch
                              label={`${m.nama} tersedia`}
                              hideLabel
                              checked={m.tersedia}
                              disabled={m.diarsipkan || sedangDiubah === m.id}
                              stateText={{ on: 'Tersedia', off: 'Habis' }}
                              onChange={(tersedia) =>
                                ubah(
                                  m,
                                  { tersedia },
                                  tersedia
                                    ? `${m.nama} tersedia lagi.`
                                    : `${m.nama} ditandai habis.`,
                                )
                              }
                            />
                          </td>
                          <td className="py-3 pr-4 text-right tabular-nums">{m.urutan}</td>
                          <td className="py-3 text-right whitespace-nowrap">
                            {m.diarsipkan ? (
                              <Button
                                variant="ghost"
                                disabled={sedangDiubah === m.id}
                                onClick={() =>
                                  ubah(m, { diarsipkan: false }, `${m.nama} dipulihkan.`)
                                }
                              >
                                Pulihkan
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  onClick={() => setForm({ open: true, menu: m })}
                                >
                                  Ubah
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="text-ampas"
                                  disabled={sedangDiubah === m.id}
                                  onClick={() =>
                                    ubah(
                                      m,
                                      { diarsipkan: true },
                                      `${m.nama} diarsipkan. Tidak tampil lagi di halaman pelanggan.`,
                                    )
                                  }
                                >
                                  Arsipkan
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          );
        })
      )}

      <MenuForm
        open={form.open}
        menu={form.menu}
        onClose={() => setForm((f) => ({ ...f, open: false }))}
        onSaved={(nama) => setPesan(form.menu ? `${nama} disimpan.` : `${nama} ditambahkan.`)}
      />
    </div>
  );
}
