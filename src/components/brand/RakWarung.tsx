import { cn } from '../../lib/cn';
import { CangkirTubruk, GelasBlirik, KalengKerupuk, PiringRoti, Teko, Uap } from './icons';

/**
 * Rak warung: deretan ikon garis di atas satu bilah papan (PRD 15.1, 15.6).
 * Murni dekoratif, disusun dari ikon SVG tulis tangan yang sudah ada.
 */
export function RakWarung({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('select-none', className)}>
      <div className="flex items-end justify-between px-2 text-tubruk">
        <KalengKerupuk size={56} strokeWidth={1.25} />
        <Teko size={52} strokeWidth={1.25} className="text-blirik" />
        <span className="flex flex-col items-center">
          <Uap size={24} strokeWidth={1.25} className="-mb-2 text-ampas" />
          <CangkirTubruk size={48} strokeWidth={1.25} />
        </span>
        <GelasBlirik size={48} strokeWidth={1.25} className="text-blirik" />
        <PiringRoti size={48} strokeWidth={1.25} />
      </div>
      <div className="mt-1 h-0.5 rounded-full bg-tubruk" />
      <div className="mx-4 h-2 border-x-2 border-tubruk" />
    </div>
  );
}
