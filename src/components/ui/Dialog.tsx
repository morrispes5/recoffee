import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useNativeDialog } from './useNativeDialog';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Tombol aksi, ditampilkan rata kanan di bawah. */
  footer?: ReactNode;
  className?: string;
}

/** Dialog konfirmasi memakai elemen <dialog> native (PRD 15.8). */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const dialogProps = useNativeDialog(open, onClose);

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={cn(
        'm-auto w-[calc(100%-2.5rem)] max-w-md rounded-ui border border-garis bg-putih p-0 text-tubruk',
        'translate-y-2 opacity-0 transition-[opacity,translate,overlay,display] transition-discrete duration-200',
        'open:translate-y-0 open:opacity-100 starting:open:translate-y-2 starting:open:opacity-0',
        'backdrop:bg-tubruk/40',
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id={titleId} className="text-body-l font-semibold">
          {title}
        </h2>
        {description ? (
          <div id={descId} className="text-body text-ampas">
            {description}
          </div>
        ) : null}
        {children}
        {footer ? (
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
