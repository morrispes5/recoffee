import { cn } from '../../lib/cn';
import { BijiKopi } from './icons/BijiKopi';

type LogoSize = 'sm' | 'md' | 'lg';

const UKURAN: Record<LogoSize, { text: string; biji: number }> = {
  sm: { text: 'text-[1.25rem]', biji: 9 },
  md: { text: 'text-display-m', biji: 12 },
  lg: { text: 'text-display-l', biji: 17 },
};

/**
 * Wordmark RE:coffee (PRD 15.7). Titik dua diganti dua biji kopi blirik bertumpuk.
 */
export function Logo({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  const { text, biji } = UKURAN[size];
  return (
    <span
      role="img"
      aria-label="RE:coffee"
      className={cn(
        'inline-flex items-center font-display leading-none text-tubruk select-none',
        text,
        className,
      )}
    >
      <span aria-hidden="true">RE</span>
      <span
        aria-hidden="true"
        className="mx-[0.08em] inline-flex flex-col items-center gap-[0.02em] text-blirik"
      >
        <BijiKopi size={biji} filled strokeWidth={2} />
        <BijiKopi size={biji} filled strokeWidth={2} />
      </span>
      <span aria-hidden="true">coffee</span>
    </span>
  );
}
