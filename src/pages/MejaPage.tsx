import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CangkirTubruk, Uap } from '../components/brand/icons';
import { CustomerHeader } from '../components/layout/CustomerHeader';
import { LangkahPesan } from '../features/menu/LangkahPesan';
import { Button, InlineMessage, Skeleton } from '../components/ui';
import { MasukGoogleButton } from '../features/auth/MasukGoogleButton';
import { clearPending, peekPending, setPending } from '../features/auth/pending';
import { useAuth } from '../features/auth/useAuth';
import { CartBar } from '../features/cart/CartBar';
import { CartProvider } from '../features/cart/CartProvider';
import { CartSheet } from '../features/cart/CartSheet';
import { useCart } from '../features/cart/useCart';
import { useMenu } from '../features/menu/hooks';
import { MenuBoard } from '../features/menu/MenuBoard';
import { useProfil } from '../features/profil/hooks';
import { ProfilDialog } from '../features/profil/ProfilDialog';
import { useKirimPesanan, useTagihan } from '../features/tagihan/hooks';
import { showAlert } from '../lib/alertStore';
import { errorCode, toUserMessage } from '../lib/errors';
import { parseNomorMeja } from '../lib/meja';
import { simpanMejaTerakhir } from '../lib/mejaTerakhir';
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
  const { user, loading } = useAuth();
  const profilQ = useProfil(user?.id ?? null);
  const tagihanQ = useTagihan(nomor);
  const menuQ = useMenu();
  const { state, dispatch } = useCart();
  const kirim = useKirimPesanan(nomor);
  const navigate = useNavigate();

  // Kembali dari login Google dengan aksi "kirim" tertunda: buka lagi sheet keranjang.
  const [sheetOpen, setSheetOpen] = useState(() => peekPending(nomor) === 'kirim');
  const [profilDitunda, setProfilDitunda] = useState(false);
  const [ubahProfil, setUbahProfil] = useState(false);

  useEffect(() => {
    if (user) clearPending(nomor);
  }, [user, nomor]);

  // Untuk tombol "Lanjut ke meja X" di beranda.
  useEffect(() => simpanMejaTerakhir(nomor), [nomor]);

  const profil = profilQ.data ?? null;
  const belumAdaProfil = user !== null && profilQ.isSuccess && profilQ.data === null;
  // Dialog data diri muncul sekali setelah login pertama (TC-27), sebelum pesanan dikirim.
  const lengkapiOpen = belumAdaProfil && !profilDitunda;
  const billDiminta = tagihanQ.data?.status === 'minta_bill';

  const habisIds = useMemo(() => {
    if (!menuQ.data) return new Set<string>();
    const availableIds = new Set(menuQ.data.filter((menu) => menu.tersedia).map((menu) => menu.id));
    return new Set(state.items.map((item) => item.menuId).filter((id) => !availableIds.has(id)));
  }, [menuQ.data, state.items]);

  function kirimSekarang() {
    if (kirim.isPending || billDiminta || habisIds.size > 0 || state.items.length === 0) return;
    kirim.mutate(
      {
        items: state.items.map((i) => ({ menu_id: i.menuId, qty: i.qty })),
        catatan: state.catatan,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'kosongkan' });
          setSheetOpen(false);
          showAlert({
            tone: 'success',
            icon: 'cup',
            celebrate: true,
            title: 'Pesanan terkirim!',
            message: `Barista lagi meracik pesanan meja ${nomor}. Pantau statusnya di tagihan meja.`,
            actions: [
              { label: 'Lihat tagihan', onClick: () => void navigate(`/meja/${nomor}/tagihan`) },
              { label: 'Pesan lagi', variant: 'ghost' },
            ],
          });
        },
        onError: (error) => {
          const menuHabis = errorCode(error) === 'MENU_TIDAK_TERSEDIA';
          showAlert({
            tone: 'error',
            title: 'Pesanan gagal dikirim',
            message: toUserMessage(error),
            actions: [
              menuHabis
                ? { label: 'Cek keranjang', onClick: () => setSheetOpen(true) }
                : { label: 'Coba lagi', onClick: kirimSekarang },
              { label: 'Tutup', variant: 'ghost' },
            ],
          });
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
  if (loading) {
    aksi = <Skeleton lines={1} label="Memeriksa sesi masuk" />;
  } else if (!user) {
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
  } else if (profilQ.isError && !profil) {
    aksi = (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" onClick={() => void profilQ.refetch()}>
            Coba lagi
          </Button>
        }
      >
        {toUserMessage(profilQ.error)}
      </InlineMessage>
    );
  } else {
    aksi = (
      <div className="flex flex-col gap-3">
        <Button
          fullWidth
          onClick={handleKirim}
          loading={kirim.isPending}
          disabled={state.items.length === 0 || profilQ.isPending || habisIds.size > 0}
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

      <section aria-labelledby="judul-meja" className="animate-muncul pt-8">
        <div className="flex items-end justify-between gap-4">
          <h1 id="judul-meja" className="flex flex-col">
            <span className="text-body-s text-ampas">Meja</span>
            <span className="font-display text-display-xl">{nomor}</span>
          </h1>
          <span aria-hidden="true" className="mr-1 flex flex-col items-center text-tubruk">
            <Uap size={26} strokeWidth={1.25} className="-mb-2 text-ampas" />
            <CangkirTubruk size={60} strokeWidth={1.25} />
          </span>
        </div>
        <p className="mt-4 text-body-l">Pesan dari sini, bayar kalau sudah selesai.</p>
        {billDiminta ? (
          <InlineMessage tone="info" className="mt-6">
            Bill sudah diminta. Tambah pesanan lewat kasir.
          </InlineMessage>
        ) : (
          <LangkahPesan className="mt-6" />
        )}
      </section>

      <div className="mt-8">
        <MenuBoard terkunci={billDiminta} />
      </div>

      <CartBar onBuka={bukaSheet} />

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
