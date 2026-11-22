import { ArrowRight } from '@phosphor-icons/react';
import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextField } from '../../components/ui';
import { showAlert } from '../../lib/alertStore';
import { parseNomorMeja, TOTAL_MEJA } from '../../lib/meja';

export const PESAN_NOMOR_MEJA = `Nomor meja harus angka 1 sampai ${TOTAL_MEJA}. Lihat angka di mejamu.`;

/**
 * Pintu masuk tanpa QR: pelanggan mengetik nomor meja lalu dibawa ke `/meja/:nomor`.
 * Validasinya sama dengan route (FR-01), jadi nomor di luar 1–28 tidak pernah dikirim.
 * Nomor yang salah menampilkan pesan di bawah kolom sekaligus alert modal.
 */
export function MasukMejaForm() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [nilai, setNilai] = useState('');
  const [error, setError] = useState<string | undefined>();

  const fokusInput = () => formRef.current?.querySelector('input')?.focus();

  function submit(e: FormEvent) {
    e.preventDefault();
    const diketik = nilai.trim();
    const nomor = parseNomorMeja(diketik);
    if (nomor === null) {
      setError(PESAN_NOMOR_MEJA);
      showAlert(
        diketik === ''
          ? {
              tone: 'warning',
              title: 'Nomor meja belum diisi',
              message: `Ketik angka yang tertulis di mejamu, antara 1 sampai ${TOTAL_MEJA}.`,
              actions: [{ label: 'Isi nomor meja', onClick: fokusInput }],
            }
          : {
              tone: 'error',
              title: `Meja ${diketik} tidak ada`,
              message: `Kafe kami punya meja 1 sampai ${TOTAL_MEJA}. Cek lagi angka yang tertulis di mejamu.`,
              actions: [{ label: 'Coba lagi', onClick: fokusInput }],
            },
      );
      return;
    }
    void navigate(`/meja/${nomor}`);
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-3">
      <div>
        <TextField
          label="Nomor meja"
          inputMode="numeric"
          autoComplete="off"
          enterKeyHint="go"
          maxLength={2}
          placeholder={`1–${TOTAL_MEJA}`}
          value={nilai}
          onChange={(e) => {
            setNilai(e.target.value.replace(/\D/g, ''));
            setError(undefined);
          }}
          error={error}
          className="text-center font-display text-[2rem] tabular-nums"
        />
      </div>
      <Button type="submit" fullWidth icon={<ArrowRight size={18} aria-hidden="true" />}>
        Mulai pesan
      </Button>
    </form>
  );
}
