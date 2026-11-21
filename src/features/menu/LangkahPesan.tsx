import { cn } from '../../lib/cn';

const LANGKAH = ['Pilih menu', 'Kirim pesanan', 'Minta bill'] as const;

/** Pengingat alur singkat di atas papan menu (nama aksi sama dengan tombol, PRD 15.10). */
export function LangkahPesan({ className }: { className?: string }) {
  return (
    <ol
      aria-label="Cara pesan"
      className={cn(
        'grid grid-cols-3 divide-x divide-garis rounded-ui border border-garis',
        className,
      )}
    >
      {LANGKAH.map((teks, i) => (
        <li key={teks} className="flex flex-col gap-2 px-3 py-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-blirik text-[0.75rem] font-semibold text-putih tabular-nums">
            {i + 1}
          </span>
          <span className="text-body-s leading-tight font-semibold">{teks}</span>
        </li>
      ))}
    </ol>
  );
}
