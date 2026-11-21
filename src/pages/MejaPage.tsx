import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { CustomerHeader } from '../components/layout/CustomerHeader';
import { Button, InlineMessage } from '../components/ui';
import { MasukGoogleButton } from '../features/auth/MasukGoogleButton';
import { clearPending, peekPending, setPending } from '../features/auth/pending';
import { useAuth } from '../features/auth/useAuth';
import { CartBar } from '../features/cart/CartBar';
import { CartProvider } from '../features/cart/CartProvider';
import { CartSheet } from '../features/cart/CartSheet';
import { KirimSukses } from '../features/cart/KirimSukses';
import { useCart } from '../features/cart/useCart';
import { useMenu } from '../features/menu/hooks';
import { MenuBoard } from '../features/menu/MenuBoard';
import { useProfil } from '../features/profil/hooks';
import { ProfilDialog } from '../features/profil/ProfilDialog';
import { useKirimPesanan, useTagihan } from '../features/tagihan/hooks';
import { toUserMessage } from '../lib/errors';
import { parseNomorMeja } from '../lib/meja';
import { MejaTidakDitemukan } from './MejaTidakDitemukan';

/** `/meja/:nomor` Menu + keranjang (PRD 16.3). */
export default function MejaPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  if (nomor === null) return <MejaTidakDitemukan />;
  return (
    <CartProvider key={nomor} nomorMeja={nomor}>
      <MejaView nomor={nomor} />
    </CartProvider>
  );
}

function MejaView({ nomor }: { nomor: number }) {
  const { user } = useAuth();
  const profilQ = useProfil(user?.id ?? null);
  const tagihanQ = useTagihan(nomor, user !== null);
  const menuQ = useMenu();
  const { state, dispatch } = useCart();
  const kirim = useKirimPesanan(nomor);

  // Kembali dari login Google dengan aksi "kirim" tertunda: buka lagi sheet keranjang.
  const [sheetOpen, setSheetOpen] = useState(() => peekPending(nomor) === 'kirim');
  const [profilDitunda, setProfilDitunda] = useState(false);
  const [ubahProfil, setUbahProfil] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  useEffect(() => {
    if (user) clearPending(nomor);
  }, [user, nomor]);

  const profil = profilQ.data ?? null;
  const belumAdaProfil = user !== null && profilQ.isSuccess && profilQ.data === null;
  // Dialog data diri muncul sekali setelah login pertama (TC-27), sebelum pesanan dikirim.
  const lengkapiOpen = belumAdaProfil && !profilDitunda;
  const billDiminta = tagihanQ.data?.status === 'minta_bill';

  const habisIds = useMemo(
    () => new Set((menuQ.data ?? []).filter((m) => !m.tersedia).map((m) => m.id)),
    [menuQ.data],
  );

  function kirimSekarang() {
    kirim.mutate(
      {
        items: state.items.map((i) => ({ menu_id: i.menuId, qty: i.qty })),
        catatan: state.catatan,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'kosongkan' });
          setSheetOpen(false);
          setTerkirim(true);
        },
      },
    );
  }

  function handleKirim() {
    if (belumAdaProfil) {
      setProfilDitunda(false);
      return;
    }
    if (profil) kirimSekarang();
  }

  function bukaSheet() {
    kirim.reset();
    setSheetOpen(true);
  }

  let aksi;
  if (!user) {
    aksi = (
      <div className="flex flex-col gap-3">
        <p className="text-body-s text-ampas">Biar pesanan tercatat atas namamu.</p>
        <MasukGoogleButton
          label="Masuk dengan Google untuk pesan"
          sebelumMasuk={() => setPending(nomor, 'kirim')}
          fullWidth
        />
      </div>
    );
  } else if (billDiminta) {
    aksi = (
      <InlineMessage tone="info">Bill sudah diminta. Tambah pesanan lewat kasir.</InlineMessage>
    );
  } else {
    aksi = (
      <div className="flex flex-col gap-3">
        {kirim.isError ? (
          <InlineMessage tone="error">{toUserMessage(kirim.error)}</InlineMessage>
        ) : null}
        <Button
          fullWidth
          onClick={handleKirim}
          loading={kirim.isPending}
          disabled={state.items.length === 0 || profilQ.isPending}
        >
          Kirim pesanan
        </Button>
      </div>
    );
  }

  return (
    <>
      <CustomerHeader
        nomorMeja={nomor}
        nama={profil?.nama ?? null}
        onUbahProfil={() => setUbahProfil(true)}
      />

      <section aria-labelledby="judul-meja" className="mt-10">
        <h1 id="judul-meja" className="flex flex-col">
          <span className="text-body-s text-ampas">Meja</span>
          <span className="font-display text-display-xl">{nomor}</span>
        </h1>
        <p className="mt-3 text-ampas">Pesan dari sini, bayar kalau sudah selesai.</p>
        {billDiminta ? (
          <InlineMessage tone="info" className="mt-6">
            Bill sudah diminta. Tambah pesanan lewat kasir.
          </InlineMessage>
        ) : null}
      </section>

      <div className="mt-12">
        <MenuBoard terkunci={billDiminta} />
      </div>

      {terkirim && state.items.length === 0 ? (
        <KirimSukses nomorMeja={nomor} onTutup={() => setTerkirim(false)} />
      ) : (
        <CartBar onBuka={bukaSheet} />
      )}

      <CartSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        habisIds={habisIds}
        aksi={aksi}
      />

      {user ? (
        <ProfilDialog
          open={lengkapiOpen || ubahProfil}
          onClose={() => {
            if (ubahProfil) setUbahProfil(false);
            else setProfilDitunda(true);
          }}
          mode={lengkapiOpen ? 'lengkapi' : 'ubah'}
          email={user.email}
          awal={profil}
          onSaved={() => {
            // Lanjutkan kirim pesanan yang tertunda (PRD 16.3).
            if (lengkapiOpen && sheetOpen && state.items.length > 0) kirimSekarang();
          }}
        />
      ) : null}
    </>
  );
}
