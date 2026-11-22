import { useQuery } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
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

  useEffect(() => {
    if (denied) void signOut().catch(() => undefined);
  }, [denied, signOut]);

  if (loading || (user && access.isPending)) {
    return (
      <main className="mx-auto w-full max-w-admin px-5 py-12">
        <Skeleton lines={4} label="Memeriksa akses admin" />
      </main>
    );
  }
  if (denied) return <Navigate to="/admin/masuk" state="akses-ditolak" replace />;
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
