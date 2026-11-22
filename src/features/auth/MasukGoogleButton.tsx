import { GoogleLogo } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '../../components/ui';
import { showAlert } from '../../lib/alertStore';
import { toUserMessage } from '../../lib/errors';
import { useAuth } from './useAuth';

/** Tombol "Masuk dengan Google". `sebelumMasuk` dipanggil sebelum redirect (simpan aksi tertunda). */
export function MasukGoogleButton({
  label = 'Masuk dengan Google',
  sebelumMasuk,
  fullWidth = false,
}: {
  label?: string;
  sebelumMasuk?: () => void;
  fullWidth?: boolean;
}) {
  const { signIn } = useAuth();
  const [proses, setProses] = useState(false);

  async function masuk() {
    setProses(true);
    sebelumMasuk?.();
    try {
      await signIn();
    } catch (e) {
      showAlert({
        tone: 'error',
        title: 'Belum bisa masuk',
        message: toUserMessage(e),
        actions: [{ label: 'Mengerti' }],
      });
    } finally {
      setProses(false);
    }
  }

  return (
    <Button
      onClick={() => void masuk()}
      loading={proses}
      fullWidth={fullWidth}
      icon={<GoogleLogo size={20} weight="bold" aria-hidden="true" />}
    >
      {label}
    </Button>
  );
}
