import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { fetchIsAdmin } from './api';
import { useAuth } from './useAuth';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const access = useQuery({
    queryKey: ['admin', 'access', user?.id],
    queryFn: fetchIsAdmin,
    enabled: !!user,
    staleTime: 0,
  });
  const denied = access.data === false;
  // Setelah signOut selesai, user menjadi null dan cache akses terhapus, sehingga `denied` kembali
  // false. Tanpa catatan ini pengalihan kedua ke /admin/masuk kehilangan status penolakan dan
  // pesan "Akun ini bukan admin" tidak pernah tampil.
  const [pernahDitolak, setPernahDitolak] = useState(false);
  if (denied && !pernahDitolak) setPernahDitolak(true);

  useEffect(() => {
    if (denied) void signOut().catch(() => undefined);
  }, [denied, signOut]);

  if (denied || pernahDitolak) return <Navigate to="/admin/masuk" state="akses-ditolak" replace />;
  if (loading || (user && access.isPending)) {
    return (
      <main className="mx-auto w-full max-w-admin px-5 py-12">
        <Skeleton lines={4} label="Memeriksa akses admin" />
      </main>
    );
  }
  if (!user) return <Navigate to="/admin/masuk" replace />;
  if (access.isError) {
    return (
      <main className="mx-auto w-full max-w-admin px-5 py-12">
        <InlineMessage
          tone="error"
          action={
            <Button variant="ghost" onClick={() => void access.refetch()}>
              Coba lagi
            </Button>
          }
        >
          {toUserMessage(access.error)}
        </InlineMessage>
      </main>
    );
  }
  return children;
}
