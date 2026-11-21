import { GoogleLogo } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button, InlineMessage } from '../../components/ui';
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
  const [error, setError] = useState<string | null>(null);

  async function masuk() {
    setError(null);
    setProses(true);
    sebelumMasuk?.();
    try {
      await signIn();
    } catch (e) {
      setError(toUserMessage(e));
    } finally {
      setProses(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => void masuk()}
        loading={proses}
        fullWidth={fullWidth}
        icon={<GoogleLogo size={20} weight="bold" aria-hidden="true" />}
      >
        {label}
      </Button>
      {error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
    </div>
  );
}
