import { cn } from '../../lib/cn';
import { CangkirTubruk, Croissant, Daun, GelasEs, Kue, Uap } from './icons';

/**
 * Rak kafe: deretan ikon garis di atas satu bilah papan, melayang pelan bergantian.
 * Murni dekoratif, disusun dari ikon SVG tulis tangan (PRD 15.1, 15.6).
 */
export function RakKafe({ className }: { className?: string }) {
  const melayang = (jeda: number) => ({ animationDelay: `${jeda}ms` });
  return (
    <div aria-hidden="true" className={cn('select-none', className)}>
      <div className="flex items-end justify-between px-2 text-tubruk">
        <span className="animate-melayang" style={melayang(0)}>
          <GelasEs size={56} strokeWidth={1.25} className="text-blirik" />
        </span>
        <span className="animate-melayang" style={melayang(500)}>
          <Croissant size={52} strokeWidth={1.25} />
        </span>
        <span className="flex animate-melayang flex-col items-center" style={melayang(1000)}>
          <Uap size={24} strokeWidth={1.25} className="-mb-2 text-ampas" />
          <CangkirTubruk size={48} strokeWidth={1.25} />
        </span>
        <span className="animate-melayang" style={melayang(1500)}>
          <Daun size={48} strokeWidth={1.25} className="text-blirik" />
        </span>
        <span className="animate-melayang" style={melayang(2000)}>
          <Kue size={48} strokeWidth={1.25} />
        </span>
      </div>
      <div className="mt-1 h-0.5 rounded-full bg-tubruk" />
      <div className="mx-4 h-2 border-x-2 border-tubruk" />
    </div>
  );
}
