import { GoogleLogo } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Logo } from '../components/brand/Logo';
import { RakKafe } from '../components/brand/RakKafe';
import { Button } from '../components/ui';
import { konsumsiErrorLogin, PESAN_LOGIN_GAGAL } from '../features/auth/oauthError';
import { useAuth } from '../features/auth/useAuth';
import { showAlert } from '../lib/alertStore';
import { toUserMessage } from '../lib/errors';

/** `/admin/masuk` (PRD 16.5). */
export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const { state } = useLocation();
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (state === 'akses-ditolak') {
      showAlert({
        tone: 'error',
        title: 'Akun ini bukan admin',
        message:
          'Email yang kamu pakai belum terdaftar sebagai admin RE:coffee. Masuk dengan akun kasir yang terdaftar.',
        actions: [{ label: 'Mengerti' }],
      });
    } else if (konsumsiErrorLogin()) {
      showAlert({
        tone: 'error',
        title: 'Masuk dengan Google gagal',
        message: PESAN_LOGIN_GAGAL,
        actions: [{ label: 'Coba lagi' }],
      });
    }
  }, [state]);

  async function masuk() {
    setProses(true);
    try {
      await signIn(`${window.location.origin}/admin`);
    } catch (e) {
      showAlert({
        tone: 'error',
        title: 'Belum bisa masuk',
        message: toUserMessage(e),
        actions: [{ label: 'Mengerti' }],
      });
      setProses(false);
    }
  }

  return (
    <div className="latar-kopi flex min-h-dvh items-start justify-center bg-putih sm:items-center sm:bg-tegel sm:p-8">
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
        <RakKafe className="mt-12 w-full" />
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
