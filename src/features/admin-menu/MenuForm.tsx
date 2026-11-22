import { useState, type FormEvent } from 'react';
import { Button, Dialog, Select, TextArea, TextField } from '../../components/ui';
import { showAlert } from '../../lib/alertStore';
import { toUserMessage } from '../../lib/errors';
import { LABEL_KATEGORI, type KategoriMenu, type Menu } from '../../types/domain';
import { URUTAN_KATEGORI } from '../menu/api';
import { useSimpanMenu } from './hooks';
import { validasiMenu, type MenuFormErrors, type MenuFormInput } from './schema';

export interface MenuFormProps {
  open: boolean;
  onClose: () => void;
  /** null = tambah menu baru */
  menu: Menu | null;
  kategoriAwal?: KategoriMenu;
  onSaved: (nama: string) => void;
}

/** Form tambah/ubah menu dalam dialog (FR-18, PRD 16.9). */
export function MenuForm(props: MenuFormProps) {
  return <MenuFormIsi key={props.open ? (props.menu?.id ?? 'baru') : 'tutup'} {...props} />;
}

function MenuFormIsi({ open, onClose, menu, kategoriAwal = 'kopi', onSaved }: MenuFormProps) {
  const [input, setInput] = useState<MenuFormInput>({
    nama: menu?.nama ?? '',
    deskripsi: menu?.deskripsi ?? '',
    kategori: menu?.kategori ?? kategoriAwal,
    harga: menu ? String(menu.harga) : '',
    urutan: menu ? String(menu.urutan) : '0',
  });
  const [errors, setErrors] = useState<MenuFormErrors>({});
  const simpan = useSimpanMenu();

  const set = (field: keyof MenuFormInput) => (value: string) =>
    setInput((prev) => ({ ...prev, [field]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const hasil = validasiMenu(input);
    if (!hasil.ok) {
      setErrors(hasil.errors);
      return;
    }
    setErrors({});
    simpan.mutate(
      { id: menu?.id ?? null, data: hasil.data },
      {
        onSuccess: () => {
          onClose();
          onSaved(hasil.data.nama);
        },
        onError: (error) =>
          showAlert({
            tone: 'error',
            title: 'Menu belum tersimpan',
            message: toUserMessage(error),
            actions: [{ label: 'Coba lagi' }],
          }),
      },
    );
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!simpan.isPending) onClose();
      }}
      title={menu ? `Ubah ${menu.nama}` : 'Tambah menu'}
      className="max-w-lg"
    >
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <TextField
          label="Nama menu"
          value={input.nama}
          onChange={(e) => set('nama')(e.target.value)}
          error={errors.nama}
          maxLength={60}
          required
        />
        <TextArea
          label="Deskripsi (opsional)"
          value={input.deskripsi}
          onChange={(e) => set('deskripsi')(e.target.value)}
          error={errors.deskripsi}
          maxLength={160}
          rows={2}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Kategori"
            value={input.kategori}
            onChange={(e) => set('kategori')(e.target.value)}
            error={errors.kategori}
            options={URUTAN_KATEGORI.map((k) => ({ value: k, label: LABEL_KATEGORI[k] }))}
          />
          <TextField
            label="Harga (Rp)"
            value={input.harga}
            onChange={(e) => set('harga')(e.target.value)}
            error={errors.harga}
            hint="Angka saja tanpa titik, contoh 18000."
            inputMode="numeric"
            required
          />
          <TextField
            label="Urutan tampil"
            value={input.urutan}
            onChange={(e) => set('urutan')(e.target.value)}
            error={errors.urutan}
            hint="Angka kecil tampil lebih dulu."
            inputMode="numeric"
          />
        </div>
        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={simpan.isPending}>
            Batal
          </Button>
          <Button type="submit" loading={simpan.isPending}>
            {menu ? 'Simpan perubahan' : 'Tambah menu'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
