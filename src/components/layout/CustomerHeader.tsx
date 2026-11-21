import { Link } from 'react-router';
import { useAuth } from '../../features/auth/useAuth';
import { Logo } from '../brand/Logo';

export const linkHeaderClass =
  'inline-flex min-h-11 items-center rounded-ui px-2 text-body-s font-medium text-tubruk hover:bg-tegel';

/** Header halaman meja: logo, link tagihan, Masuk / Keluar (PRD 16.3). */
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
    <header className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="rounded-ui py-2">
          <Logo size="sm" />
        </Link>
        <nav aria-label="Akun dan tagihan" className="-mr-2 flex items-center">
          <Link to={`/meja/${nomorMeja}/tagihan`} className={linkHeaderClass}>
            Tagihan meja
          </Link>
          {loading ? null : user ? (
            <button type="button" onClick={() => void signOut()} className={linkHeaderClass}>
              Keluar
            </button>
          ) : (
            <button type="button" onClick={() => void signIn()} className={linkHeaderClass}>
              Masuk
            </button>
          )}
        </nav>
      </div>
      {user && nama ? (
        <p className="flex flex-wrap items-center gap-x-1 text-body-s text-ampas">
          <span>
            Halo, <span className="font-medium text-tubruk">{nama}</span>.
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
    </header>
  );
}
