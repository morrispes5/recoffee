import { useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../features/auth/useAuth';
import { parseNomorMeja } from '../lib/meja';
import { bacaDb, MOCK_USERS, setUserMock } from './db';
import {
  kasirKonfirmasi,
  majukanPesanan,
  MENU_UJI_HABIS,
  resetDb,
  temanPesan,
  toggleMenuHabis,
  toggleOffline,
} from './devActions';

/** Panel uji alur pelanggan dengan data mock. Hanya dimuat di mode dev (M2 tugas 5). */
export default function DevToolbar() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const nomor = parseNomorMeja(/^\/meja\/([^/]+)/.exec(pathname)?.[1]);
  const [, setVersi] = useState(0);
  const db = bacaDb();

  function jalankan(fn: () => void) {
    fn();
    setVersi((v) => v + 1);
    void qc.invalidateQueries();
  }

  return (
    <details className="fixed right-2 bottom-24 z-20 rounded-ui border border-garis bg-putih text-body-s open:w-64 open:pb-2">
      <summary className="cursor-pointer list-none px-2.5 py-1.5 font-semibold select-none">
        Mock (dev)
      </summary>
      <div className="flex flex-col gap-1 px-2">
        <Judul>Akun</Judul>
        <p className="px-1 pb-1 text-ampas">{user ? user.email : 'Belum login'}</p>
        {user?.id !== MOCK_USERS.saya.id ? (
          <Aksi onClick={() => jalankan(() => setUserMock(MOCK_USERS.saya))}>
            Pura-pura login: pelanggan demo
          </Aksi>
        ) : null}
        {user?.id !== MOCK_USERS.teman.id ? (
          <Aksi onClick={() => jalankan(() => setUserMock(MOCK_USERS.teman))}>
            Pura-pura login: teman semeja
          </Aksi>
        ) : null}
        {user ? <Aksi onClick={() => jalankan(() => setUserMock(null))}>Logout</Aksi> : null}

        {nomor !== null ? (
          <>
            <Judul>Meja {nomor}</Judul>
            <Aksi onClick={() => jalankan(() => temanPesan(nomor))}>Dimas pesan di meja ini</Aksi>
            <Aksi onClick={() => jalankan(() => majukanPesanan(nomor))}>
              Barista majukan status pesanan
            </Aksi>
            <Aksi onClick={() => jalankan(() => kasirKonfirmasi(nomor))}>
              Kasir konfirmasi bayar
            </Aksi>
          </>
        ) : null}

        <Judul>Sistem</Judul>
        <Aksi onClick={() => jalankan(() => toggleMenuHabis(MENU_UJI_HABIS.id))}>
          {MENU_UJI_HABIS.nama}: {db.menuHabis.includes(MENU_UJI_HABIS.id) ? 'habis' : 'tersedia'}
        </Aksi>
        <Aksi onClick={() => jalankan(toggleOffline)}>
          Jaringan: {db.offline ? 'putus' : 'normal'}
        </Aksi>
        <Aksi
          onClick={() =>
            jalankan(() => {
              if (!window.confirm('Hapus semua data mock, keranjang, dan login?')) return;
              resetDb();
              setUserMock(null);
              try {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('recoffee:cart:'))
                  .forEach((k) => localStorage.removeItem(k));
                sessionStorage.clear();
              } catch {
                // abaikan
              }
              window.location.reload();
            })
          }
        >
          Reset semua data mock
        </Aksi>
      </div>
    </details>
  );
}

function Judul({ children }: { children: ReactNode }) {
  return <p className="mt-2 px-1 font-semibold text-ampas">{children}</p>;
}

function Aksi({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-9 rounded-ui px-2 text-left hover:bg-tegel"
    >
      {children}
    </button>
  );
}
