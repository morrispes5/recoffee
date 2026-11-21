import { X } from '@phosphor-icons/react';
import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';
import { useNativeDialog } from './useNativeDialog';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Area bawah yang selalu terlihat (total + tombol kirim). */
  footer?: ReactNode;
}

/** Panel dari bawah untuk keranjang di mobile (PRD 15.8). */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const titleId = useId();
  const dialogProps = useNativeDialog(open, onClose);

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      className={cn(
        'mx-auto mt-auto mb-0 flex max-h-[88dvh] w-full max-w-pelanggan flex-col rounded-t-ui border border-b-0 border-garis bg-putih p-0 text-tubruk not-open:hidden',
        'translate-y-full transition-[translate,overlay,display] transition-discrete duration-200 ease-out',
        'open:translate-y-0 starting:open:translate-y-full',
        'backdrop:bg-tubruk/40',
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-garis py-2 pr-2 pl-5">
        <h2 id={titleId} className="text-body-l font-semibold">
          {title}
        </h2>
        <IconButton label="Tutup" onClick={onClose} className="border-0">
          <X size={20} />
        </IconButton>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? (
        <footer className="border-t border-garis px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      ) : null}
    </dialog>
  );
}
