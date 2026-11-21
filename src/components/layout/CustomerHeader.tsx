import { Receipt, SignIn, SignOut } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useAuth } from '../../features/auth/useAuth';
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
  return (
    <>
      <CustomerTopBar>
        <Link to={`/meja/${nomorMeja}/tagihan`} className={linkHeaderClass}>
          <Receipt size={18} aria-hidden="true" />
          Tagihan meja
        </Link>
        {loading ? null : user ? (
          <button type="button" onClick={() => void signOut()} className={linkHeaderClass}>
            <SignOut size={18} aria-hidden="true" />
            Keluar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void signIn()}
            className="ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-ui border border-garis px-3 text-body-s font-semibold text-tubruk hover:border-tubruk"
          >
            <SignIn size={18} aria-hidden="true" />
            Masuk
          </button>
        )}
      </CustomerTopBar>
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
