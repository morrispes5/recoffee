import { Receipt, SignIn, SignOut } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ambilErrorLogin, PESAN_LOGIN_GAGAL } from '../../features/auth/oauthError';
import { useAuth } from '../../features/auth/useAuth';
import { toUserMessage } from '../../lib/errors';
import { InlineMessage } from '../ui';
import { CustomerTopBar } from './CustomerTopBar';

export const linkHeaderClass =
  'inline-flex min-h-11 items-center gap-1.5 rounded-ui px-2 text-body-s font-medium text-tubruk hover:bg-tegel';

/** Header halaman meja: logo, link tagihan, Masuk / Keluar, sapaan (PRD 16.3). */
export function CustomerHeader({
  nomorMeja,
  nama,
  onUbahProfil,
}: {
  nomorMeja: number;
  nama: string | null;
  onUbahProfil: () => void;
}) {
  const { user, loading, signIn, signOut } = useAuth();
  const [error, setError] = useState<string | null>(() =>
    ambilErrorLogin() ? PESAN_LOGIN_GAGAL : null,
  );

  async function changeSession(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(toUserMessage(e));
    }
  }

  return (
    <>
      <CustomerTopBar>
        <Link to={`/meja/${nomorMeja}/tagihan`} className={linkHeaderClass}>
          <Receipt size={18} aria-hidden="true" />
          Tagihan meja
        </Link>
        {loading ? null : user ? (
          <button
            type="button"
            onClick={() => void changeSession(signOut)}
            className={linkHeaderClass}
          >
            <SignOut size={18} aria-hidden="true" />
            Keluar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void changeSession(signIn)}
            className="ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-ui border border-garis px-3 text-body-s font-semibold text-tubruk hover:border-tubruk"
          >
            <SignIn size={18} aria-hidden="true" />
            Masuk
          </button>
        )}
      </CustomerTopBar>
      {error ? (
        <InlineMessage tone="error" className="mt-4">
          {error}
        </InlineMessage>
      ) : null}
      {user && nama ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-1 text-body-s text-ampas">
          <span>
            Halo, <span className="font-semibold text-tubruk">{nama}</span>.
          </span>
          <button
            type="button"
            onClick={onUbahProfil}
            className="min-h-8 rounded-ui px-1 underline underline-offset-2 hover:text-tubruk"
          >
            Ubah data diri
          </button>
        </p>
      ) : null}
    </>
  );
}
