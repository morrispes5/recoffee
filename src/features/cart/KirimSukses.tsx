import { X } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { CangkirTubruk, Uap } from '../../components/brand/icons';
import { BottomBar } from '../../components/layout/BottomBar';
import { IconButton } from '../../components/ui';

/** Satu-satunya momen animasi: uap naik di atas cangkir saat pesanan terkirim (PRD 15.9). */
export function KirimSukses({ nomorMeja, onTutup }: { nomorMeja: number; onTutup: () => void }) {
  return (
    <BottomBar>
      <div className="flex items-center gap-4" role="status">
        <span className="relative flex shrink-0 flex-col items-center text-tubruk">
          <Uap size={20} className="-mb-1.5 animate-uap text-ampas" />
          <CangkirTubruk size={36} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Pesanan terkirim ke barista.</p>
          <Link
            to={`/meja/${nomorMeja}/tagihan`}
            className="text-body-s font-medium text-blirik underline underline-offset-2"
          >
            Lihat tagihan
          </Link>
        </div>
        <IconButton label="Tutup pesan" onClick={onTutup} className="border-0">
          <X size={18} aria-hidden="true" />
        </IconButton>
      </div>
    </BottomBar>
  );
}
