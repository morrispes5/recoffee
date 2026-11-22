import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Select, Switch, TextArea, TextField } from '../components/ui';
import { MenuForm } from '../features/admin-menu/MenuForm';
import { MasukMejaForm } from '../features/meja/MasukMejaForm';
import { ProfilDialog } from '../features/profil/ProfilDialog';

/**
 * Uji aksesibilitas otomatis (M6, PRD 19). axe-core memeriksa aturan WCAG 2.1 A dan AA pada
 * komponen yang dirender: label form, nama tombol, peran ARIA, dan struktur dialog.
 * Aturan kontras warna dimatikan karena jsdom tidak punya layout; kontras dihitung terpisah
 * dari token warna (lihat docs/mppl/10-pengujian.md).
 */
async function pelanggaran(container: HTMLElement): Promise<string[]> {
  const hasil = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  return hasil.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} elemen)`);
}

function dalamQuery(isi: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{isi}</QueryClientProvider>;
}

// jsdom belum punya showModal/close pada <dialog>; cukup meniru atribut `open`.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

afterEach(cleanup);

describe('aksesibilitas', () => {
  it('kontrol negatif: input tanpa label dan tombol tanpa nama terdeteksi', async () => {
    const { container } = render(
      <form>
        <input type="text" />
        <button type="button" />
      </form>,
    );
    const hasil = await pelanggaran(container);
    expect(hasil.some((v) => v.startsWith('label'))).toBe(true);
    expect(hasil.some((v) => v.startsWith('button-name'))).toBe(true);
  });

  it('form nomor meja di beranda tanpa pelanggaran', async () => {
    const { container } = render(
      <MemoryRouter>
        <MasukMejaForm />
      </MemoryRouter>,
    );
    expect(await pelanggaran(container)).toEqual([]);
  });

  it('komponen form dasar (input, select, textarea, sakelar) tanpa pelanggaran', async () => {
    function Contoh() {
      const [aktif, setAktif] = useState(true);
      return (
        <form>
          <TextField label="Nama menu" hint="Contoh: Es Kopi Susu Aren" />
          <TextField label="Harga (Rp)" error="Harga harus 1 sampai 1.000.000." />
          <Select
            label="Kategori"
            defaultValue="kopi"
            options={[
              { value: 'kopi', label: 'Kopi' },
              { value: 'non_kopi', label: 'Non-kopi' },
            ]}
          />
          <TextArea label="Catatan" />
          <Switch label="Tersedia" checked={aktif} onChange={setAktif} />
        </form>
      );
    }
    const { container } = render(<Contoh />);
    expect(await pelanggaran(container)).toEqual([]);
  });

  it('dialog data diri tanpa pelanggaran', async () => {
    render(
      dalamQuery(
        <ProfilDialog open mode="lengkapi" email="uji@contoh.test" onClose={() => undefined} />,
      ),
    );
    expect(await pelanggaran(document.body)).toEqual([]);
  });

  it('form tambah menu admin tanpa pelanggaran', async () => {
    render(
      dalamQuery(<MenuForm open menu={null} onClose={() => undefined} onSaved={() => undefined} />),
    );
    expect(await pelanggaran(document.body)).toEqual([]);
  });
});
