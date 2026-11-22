import { GoogleLogo } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Logo } from '../components/brand/Logo';
import { RakWarung } from '../components/brand/RakWarung';
import { Button, InlineMessage } from '../components/ui';
import { useAuth } from '../features/auth/useAuth';
import { toUserMessage } from '../lib/errors';

/** `/admin/masuk` (PRD 16.5). */
export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const { state } = useLocation();
  const [proses, setProses] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    state === 'akses-ditolak' ? 'Akun ini belum terdaftar sebagai admin RE:coffee.' : null,
  );

  async function masuk() {
    setProses(true);
    setError(null);
    try {
      await signIn(`${window.location.origin}/admin`);
    } catch (e) {
      setError(toUserMessage(e));
      setProses(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-start justify-center bg-putih sm:items-center sm:bg-tegel sm:p-8">
      <main className="flex w-full max-w-pelanggan flex-col items-start bg-putih px-5 pt-16 pb-12 sm:rounded-ui sm:border sm:border-garis sm:px-10 sm:pt-12">
        <Logo size="md" />
        <h1 className="mt-10 font-display text-display-m text-balance">
          Masuk untuk mengelola meja dan pesanan.
        </h1>
        <p className="mt-3 text-ampas">Khusus kasir dan barista dengan akun Google terdaftar.</p>
        <Button
          className="mt-8"
          fullWidth
          onClick={() => void masuk()}
          loading={proses}
          icon={<GoogleLogo size={20} weight="bold" aria-hidden="true" />}
        >
          Masuk dengan Google
        </Button>
        {error ? (
          <InlineMessage tone="error" className="mt-4 w-full">
            {error}
          </InlineMessage>
        ) : null}
        <RakWarung className="mt-12 w-full" />
        <Link
          to="/"
          className="mt-6 rounded-ui py-2 text-body-s text-ampas underline-offset-4 hover:text-tubruk hover:underline"
        >
          Ke beranda pelanggan
        </Link>
      </main>
    </div>
  );
}
