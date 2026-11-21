import { GoogleLogo } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../components/brand/Logo';
import { Button, InlineMessage } from '../components/ui';
import { useAuth } from '../features/auth/useAuth';
import { toUserMessage } from '../lib/errors';

/**
 * `/admin/masuk` (PRD 16.5). Mock: langsung masuk sebagai kasir demo.
 * M5: redirect Google → cek is_admin(); bila false, signOut + pesan akun tidak terdaftar.
 */
export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [proses, setProses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function masuk() {
    setProses(true);
    setError(null);
    try {
      await signIn(`${window.location.origin}/admin`);
      void navigate('/admin');
    } catch (e) {
      setError(toUserMessage(e));
      setProses(false);
    }
  }

  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto flex w-full max-w-pelanggan flex-col items-start px-5 pt-24">
        <Logo size="md" />
        <h1 className="mt-12 text-body-l">Masuk untuk mengelola meja dan pesanan.</h1>
        <Button
          className="mt-8"
          onClick={() => void masuk()}
          loading={proses}
          icon={<GoogleLogo size={20} weight="bold" aria-hidden="true" />}
        >
          Masuk dengan Google
        </Button>
        {error ? (
          <InlineMessage tone="error" className="mt-4">
            {error}
          </InlineMessage>
        ) : null}
      </main>
    </div>
  );
}
