import { Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { IkonKategori } from '../../components/brand/icons';
import { Badge, Button, InlineMessage, Skeleton, Switch } from '../../components/ui';
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Switch label="Tampilkan menu diarsipkan" checked={tampilArsip} onChange={setTampilArsip} />
        <Button
          icon={<Plus size={18} aria-hidden="true" />}
          onClick={() => setForm({ open: true, menu: null })}
        >
          Tambah menu
        </Button>
      </div>

      {pesan ? <InlineMessage tone="sukses">{pesan}</InlineMessage> : null}
      {ubahStatus.isError ? (
        <InlineMessage tone="error">{toUserMessage(ubahStatus.error)}</InlineMessage>
      ) : null}

      {menuQ.isPending ? (
        <Skeleton lines={8} label="Memuat menu" />
      ) : menuQ.isError ? (
        <InlineMessage tone="error">{toUserMessage(menuQ.error)}</InlineMessage>
      ) : (
        URUTAN_KATEGORI.map((kategori) => {
          const daftar = menuQ.data.filter(
            (m) => m.kategori === kategori && (tampilArsip || !m.diarsipkan),
          );
          return (
            <section key={kategori} aria-labelledby={`admin-kategori-${kategori}`}>
              <h2
                id={`admin-kategori-${kategori}`}
                className="flex items-center gap-3 font-display text-display-m"
              >
                {LABEL_KATEGORI[kategori]}
                <IkonKategori kategori={kategori} size={24} />
              </h2>
              {daftar.length === 0 ? (
                <p className="mt-3 text-body-s text-ampas">Belum ada menu di kategori ini.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
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
            </section>
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
