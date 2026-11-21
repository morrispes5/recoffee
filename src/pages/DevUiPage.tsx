import { Minus, Plus, SignOut } from '@phosphor-icons/react';
import { useState, type JSX, type ReactNode } from 'react';
import {
  BijiKopi,
  CangkirTubruk,
  GelasBlirik,
  KalengKerupuk,
  KursiPlastik,
  PiringRoti,
  Teko,
  Uap,
  type IconProps,
} from '../components/brand/icons';
import { Logo } from '../components/brand/Logo';
import {
  Badge,
  Button,
  Dialog,
  IconButton,
  InlineMessage,
  Select,
  Sheet,
  Skeleton,
  Spinner,
  Switch,
  TextArea,
  TextField,
} from '../components/ui';
import { formatRupiah } from '../lib/format';

/** `/dev/ui` — katalog token, ikon, dan komponen. Hanya di mode dev (M1 tugas 8). */
export default function DevUiPage() {
  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto flex w-full max-w-admin flex-col gap-16 px-5 py-12 sm:px-8">
        <header className="flex flex-col gap-3">
          <Logo size="lg" />
          <h1 className="text-body-l text-ampas">
            Katalog design system. Arahkan kursor dan tekan Tab untuk melihat state hover dan focus.
          </h1>
        </header>

        <Warna />
        <Tipografi />
        <LogoDanFavicon />
        <Ikon />
        <Tombol />
        <BadgeDanPesan />
        <Form />
        <DialogDanSheet />
        <Loading />
        <Motion />
      </main>
    </div>
  );
}

function Bagian({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-garis pt-8">
      <h2 className="font-display text-display-m">{judul}</h2>
      {children}
    </section>
  );
}

const WARNA = [
  { token: 'putih', hex: '#FFFFFF', kelas: 'bg-putih', guna: 'Latar utama' },
  { token: 'tegel', hex: '#F4F4F2', kelas: 'bg-tegel', guna: 'Latar sekunder, hemat' },
  { token: 'garis', hex: '#E4E2DE', kelas: 'bg-garis', guna: 'Border, leader titik' },
  { token: 'tubruk', hex: '#2B201B', kelas: 'bg-tubruk', guna: 'Teks utama, ikon' },
  { token: 'ampas', hex: '#76695F', kelas: 'bg-ampas', guna: 'Teks sekunder' },
  { token: 'blirik', hex: '#2F6B57', kelas: 'bg-blirik', guna: 'Aksen, meja terisi' },
  { token: 'lampu', hex: '#F0B840', kelas: 'bg-lampu', guna: 'Minta bill (latar)' },
  { token: 'kaleng', hex: '#B23A2E', kelas: 'bg-kaleng', guna: 'Error, destruktif' },
] as const;

function Warna() {
  return (
    <Bagian judul="Warna">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {WARNA.map((w) => (
          <li key={w.token} className="flex flex-col gap-2">
            <span className={`h-14 rounded-ui border border-garis ${w.kelas}`} />
            <span className="text-body-s">
              <span className="font-semibold">{w.token}</span>{' '}
              <span className="text-ampas tabular-nums">{w.hex}</span>
              <br />
              <span className="text-ampas">{w.guna}</span>
            </span>
          </li>
        ))}
      </ul>
    </Bagian>
  );
}

function Tipografi() {
  return (
    <Bagian judul="Tipografi">
      <div className="flex flex-col gap-5">
        <Contoh label="display-xl, Gloock">
          <span className="font-display text-display-xl">18</span>
        </Contoh>
        <Contoh label="display-l, Gloock">
          <span className="font-display text-display-l tabular-nums">{formatRupiah(72000)}</span>
        </Contoh>
        <Contoh label="display-m, Gloock">
          <span className="font-display text-display-m">Kopi</span>
        </Contoh>
        <Contoh label="body-l, Plus Jakarta Sans">
          <span className="text-body-l">Kopi Susu Gula Aren</span>
        </Contoh>
        <Contoh label="body">
          <span className="text-body">Pesan dari sini, bayar kalau sudah selesai.</span>
        </Contoh>
        <Contoh label="body-s, ampas">
          <span className="text-body-s text-ampas">Espresso, susu segar, gula aren cair.</span>
        </Contoh>
        <Contoh label="Harga tabular-nums">
          <span className="flex flex-col text-body tabular-nums">
            <span>{formatRupiah(15000)}</span>
            <span>{formatRupiah(3000)}</span>
            <span>{formatRupiah(122000)}</span>
          </span>
        </Contoh>
      </div>
    </Bagian>
  );
}

function Contoh({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-56 shrink-0 text-body-s text-ampas">{label}</span>
      {children}
    </div>
  );
}

function LogoDanFavicon() {
  return (
    <Bagian judul="Logo">
      <div className="flex flex-wrap items-end gap-10">
        <Logo size="sm" />
        <Logo size="md" />
        <Logo size="lg" />
      </div>
      <div className="flex items-end gap-6">
        {[16, 32, 48].map((s) => (
          <span key={s} className="flex flex-col items-start gap-2">
            <img src="/favicon.svg" width={s} height={s} alt="" />
            <span className="text-body-s text-ampas tabular-nums">{s} px</span>
          </span>
        ))}
      </div>
    </Bagian>
  );
}

const IKON: Array<{ nama: string; Ikon: (p: IconProps) => JSX.Element; guna: string }> = [
  { nama: 'GelasBlirik', Ikon: GelasBlirik, guna: 'Kategori kopi' },
  { nama: 'CangkirTubruk', Ikon: CangkirTubruk, guna: 'Empty state tagihan' },
  { nama: 'Teko', Ikon: Teko, guna: 'Kategori non-kopi' },
  { nama: 'PiringRoti', Ikon: PiringRoti, guna: 'Kategori makanan' },
  { nama: 'KalengKerupuk', Ikon: KalengKerupuk, guna: 'Kategori camilan' },
  { nama: 'BijiKopi', Ikon: BijiKopi, guna: 'Logo mark, pemisah' },
  { nama: 'KursiPlastik', Ikon: KursiPlastik, guna: 'Empty state denah' },
  { nama: 'Uap', Ikon: Uap, guna: 'Animasi pesanan terkirim' },
];

function Ikon() {
  return (
    <Bagian judul="Ikon SVG kustom">
      <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {IKON.map(({ nama, Ikon: I, guna }) => (
          <li key={nama} className="flex items-center gap-5">
            <span className="flex items-end gap-4 text-tubruk">
              <I size={16} />
              <I size={24} />
              <I size={48} />
            </span>
            <span className="text-body-s">
              <span className="font-semibold">{nama}</span>
              <br />
              <span className="text-ampas">{guna}</span>
            </span>
          </li>
        ))}
      </ul>
    </Bagian>
  );
}

function Tombol() {
  return (
    <Bagian judul="Tombol">
      <div className="flex flex-col gap-4">
        {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
          <div key={v} className="flex flex-wrap items-center gap-3">
            <span className="w-24 text-body-s text-ampas">{v}</span>
            <Button variant={v}>Kirim pesanan</Button>
            <Button variant={v} disabled>
              Nonaktif
            </Button>
            <Button variant={v} loading>
              Mengirim
            </Button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-body-s text-ampas">ikon</span>
          <Button variant="ghost" icon={<SignOut size={20} aria-hidden="true" />}>
            Keluar
          </Button>
          <IconButton label="Kurangi">
            <Minus size={18} />
          </IconButton>
          <IconButton label="Tambah" variant="primary">
            <Plus size={18} />
          </IconButton>
          <IconButton label="Tambah (nonaktif)" disabled>
            <Plus size={18} />
          </IconButton>
        </div>
      </div>
    </Bagian>
  );
}

function BadgeDanPesan() {
  return (
    <Bagian judul="Badge dan pesan">
      <div className="flex flex-wrap gap-2">
        <Badge tone="garis">Kosong</Badge>
        <Badge tone="blirik">Terisi</Badge>
        <Badge tone="lampu">Minta bill</Badge>
        <Badge tone="netral">Baru</Badge>
        <Badge tone="netral">Diproses</Badge>
        <Badge tone="garis">Diantar</Badge>
        <Badge tone="kaleng">Habis</Badge>
      </div>
      <div className="flex max-w-xl flex-col gap-3">
        <InlineMessage tone="info">Bill sudah diminta. Tambah pesanan lewat kasir.</InlineMessage>
        <InlineMessage tone="sukses">Pesanan terkirim ke barista.</InlineMessage>
        <InlineMessage tone="error">
          Pesanan belum terkirim. Cek koneksi lalu coba lagi.
        </InlineMessage>
      </div>
    </Bagian>
  );
}

function Form() {
  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [tersedia, setTersedia] = useState(true);
  return (
    <Bagian judul="Form">
      <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          label="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Rina"
          autoComplete="name"
        />
        <TextField
          label="Nomor HP"
          defaultValue="0712345678"
          inputMode="tel"
          error="Nomor HP belum benar. Contoh: 081234567890."
        />
        <TextField label="Harga" inputMode="numeric" hint="Tanpa titik, contoh 18000." />
        <TextField label="Nonaktif" defaultValue="Kopi Tubruk" disabled />
        <TextArea
          label="Catatan (opsional)"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          maxLength={140}
          placeholder="Contoh: less sugar"
        />
        <Select
          label="Kategori"
          defaultValue="kopi"
          options={[
            { value: 'kopi', label: 'Kopi' },
            { value: 'non_kopi', label: 'Non-kopi' },
            { value: 'makanan', label: 'Makanan' },
            { value: 'camilan', label: 'Camilan' },
          ]}
        />
        <div className="flex flex-col gap-1">
          <Switch
            label="Kopi Tubruk"
            checked={tersedia}
            onChange={setTersedia}
            stateText={{ on: 'Tersedia', off: 'Habis' }}
          />
          <Switch label="Nonaktif" checked={false} onChange={() => undefined} disabled />
        </div>
      </div>
    </Bagian>
  );
}

function DialogDanSheet() {
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  return (
    <Bagian judul="Dialog dan sheet">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setDialog(true)}>
          Buka dialog
        </Button>
        <Button variant="secondary" onClick={() => setSheet(true)}>
          Buka sheet
        </Button>
      </div>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Konfirmasi pembayaran"
        description={`Konfirmasi pembayaran meja 18 sebesar ${formatRupiah(72000)}?`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(false)}>
              Batal
            </Button>
            <Button onClick={() => setDialog(false)}>Konfirmasi bayar</Button>
          </>
        }
      />
      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Pesanan kamu"
        footer={
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-ampas">Total</span>
              <span className="text-body-l font-semibold tabular-nums">{formatRupiah(57000)}</span>
            </div>
            <Button fullWidth onClick={() => setSheet(false)}>
              Kirim pesanan
            </Button>
          </div>
        }
      >
        <ul className="flex flex-col divide-y divide-garis">
          {[
            ['Es Kopi Susu', 2, 20000],
            ['Pisang Goreng', 1, 14000],
            ['Kerupuk Kaleng', 1, 3000],
          ].map(([nama, qty, harga]) => (
            <li key={String(nama)} className="flex items-center justify-between gap-3 py-3">
              <span>
                {nama}
                <br />
                <span className="text-body-s text-ampas tabular-nums">
                  {formatRupiah(Number(harga))}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <IconButton label={`Kurangi ${String(nama)}`}>
                  <Minus size={18} />
                </IconButton>
                <span className="w-6 text-center tabular-nums">{qty}</span>
                <IconButton label={`Tambah ${String(nama)}`}>
                  <Plus size={18} />
                </IconButton>
              </span>
            </li>
          ))}
        </ul>
      </Sheet>
    </Bagian>
  );
}

function Loading() {
  return (
    <Bagian judul="Loading">
      <div className="flex items-center gap-6 text-blirik">
        <Spinner label="Memuat" />
        <Spinner size={28} label="Memuat" className="text-ampas" />
      </div>
      <Skeleton lines={4} className="max-w-md" />
    </Bagian>
  );
}

function Motion() {
  const [kunci, setKunci] = useState(0);
  return (
    <Bagian judul="Motion">
      <div className="flex items-end gap-6">
        <span className="relative inline-flex flex-col items-center text-tubruk">
          <Uap key={kunci} size={28} className="-mb-1 animate-uap text-ampas" />
          <CangkirTubruk size={48} />
        </span>
        <Button variant="secondary" onClick={() => setKunci((k) => k + 1)}>
          Putar ulang uap
        </Button>
      </div>
      <p className="text-body-s text-ampas">
        Satu momen saja, saat pesanan terkirim. Mati otomatis bila prefers-reduced-motion.
      </p>
    </Bagian>
  );
}
