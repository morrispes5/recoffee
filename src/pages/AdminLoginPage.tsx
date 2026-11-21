import { GoogleLogo } from '@phosphor-icons/react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui';

/** `/admin/masuk` (PRD 16.5). Tombol belum terhubung ke Supabase Auth (M5). */
export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto flex w-full max-w-pelanggan flex-col items-start px-5 pt-24">
        <Logo size="md" />
        <h1 className="mt-12 text-body-l">Masuk untuk mengelola meja dan pesanan.</h1>
        <Button className="mt-8" icon={<GoogleLogo size={20} aria-hidden="true" />} disabled>
          Masuk dengan Google
        </Button>
      </main>
    </div>
  );
}
