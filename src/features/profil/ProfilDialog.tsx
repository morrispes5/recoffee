import { useState, type FormEvent } from 'react';
import { Button, Dialog, InlineMessage, TextField } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import type { Profil } from '../../types/domain';
import { useSimpanProfil } from './hooks';
import { validasiProfil, type ProfilErrors } from './schema';

export interface ProfilDialogProps {
  open: boolean;
  onClose: () => void;
  /** 'lengkapi' = login pertama; 'ubah' = dari link Ubah data diri. */
  mode: 'lengkapi' | 'ubah';
  email: string;
  awal?: Profil | null;
  /** Dipanggil setelah tersimpan (mis. melanjutkan kirim pesanan yang tertunda). */
  onSaved?: () => void;
}

/** Dialog data diri pelanggan: nama + nomor HP (FR-24, PRD 16.3). */
export function ProfilDialog(props: ProfilDialogProps) {
  // Remount saat dibuka agar form selalu mulai dari data terbaru.
  return <ProfilDialogIsi key={props.open ? 'buka' : 'tutup'} {...props} />;
}

function ProfilDialogIsi({ open, onClose, mode, email, awal, onSaved }: ProfilDialogProps) {
  const [nama, setNama] = useState(awal?.nama ?? '');
  const [noHp, setNoHp] = useState(awal?.no_hp ?? '');
  const [errors, setErrors] = useState<ProfilErrors>({});
  const simpan = useSimpanProfil();

  function submit(e: FormEvent) {
    e.preventDefault();
    const hasil = validasiProfil({ nama, no_hp: noHp });
    if (!hasil.ok) {
      setErrors(hasil.errors);
      return;
    }
    setErrors({});
    simpan.mutate(
      { nama: hasil.data.nama, noHp: hasil.data.no_hp },
      {
        onSuccess: () => {
          onClose();
          onSaved?.();
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'lengkapi' ? 'Lengkapi data diri' : 'Ubah data diri'}
      description={
        mode === 'lengkapi'
          ? 'Sekali saja. Biar pesanan tercatat atas namamu.'
          : `Masuk sebagai ${email}.`
      }
    >
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <TextField
          label="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          error={errors.nama}
          autoComplete="name"
          maxLength={50}
          required
        />
        <TextField
          label="Nomor HP"
          value={noHp}
          onChange={(e) => setNoHp(e.target.value)}
          error={errors.no_hp}
          hint="Nomor HP hanya dilihat kasir."
          placeholder="081234567890"
          inputMode="tel"
          autoComplete="tel"
          required
        />
        {simpan.isError ? (
          <InlineMessage tone="error">{toUserMessage(simpan.error)}</InlineMessage>
        ) : null}
        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={simpan.isPending}>
            {mode === 'lengkapi' ? 'Nanti saja' : 'Batal'}
          </Button>
          <Button type="submit" loading={simpan.isPending}>
            Simpan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
