import type { ReactNode } from 'react';
import { Skeleton } from '../../components/ui';
import { MasukGoogleButton } from './MasukGoogleButton';
import { useAuth } from './useAuth';

/** Tampilkan isi hanya bila sudah login; selain itu penjelasan singkat + tombol masuk. */
export function RequireLogin({
  penjelasan,
  children,
}: {
  penjelasan: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) return <Skeleton lines={4} />;
  if (!user) {
    return (
      <div className="flex flex-col items-start gap-5">
        <p className="max-w-[40ch] text-ampas">{penjelasan}</p>
        <MasukGoogleButton />
      </div>
    );
  }
  return <>{children}</>;
}
