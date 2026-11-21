import { cn } from '../../lib/cn';

const LEBAR = ['w-full', 'w-4/5', 'w-3/5', 'w-11/12', 'w-2/3'] as const;

/** Skeleton berupa garis abu tegel, bukan kotak kartu (PRD 15.8). */
export function Skeleton({
  lines = 3,
  label = 'Memuat',
  className,
}: {
  lines?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div role="status" aria-label={label} className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={cn('block h-3 rounded-ui bg-tegel', LEBAR[i % LEBAR.length])}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
