import { m } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { closeAlert, useActiveAlert, type ActiveAlert } from '../../lib/alertStore';
import { celebrate } from '../../lib/celebrate';
import { cn } from '../../lib/cn';
import { Button } from '../ui';
import { useNativeDialog } from '../ui/useNativeDialog';
import { AlertIcon } from './AlertIcon';

/**
 * Tempat alert modal global (`showAlert`). Memakai <dialog> native supaya selalu tampil di
 * atas dialog/sheet lain (top layer). Dialog dibuat selebar layar agar kanvas konfeti
 * di dalamnya ikut berada di top layer.
 */
export function AlertHost() {
  const active = useActiveAlert();
  // Isi terakhir tetap dirender selagi dialog memudar keluar.
  const [shown, setShown] = useState<ActiveAlert | null>(active);
  if (active && active !== shown) setShown(active);

  const dialogProps = useNativeDialog(active !== null, closeAlert);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (active?.celebrate) void celebrate(canvasRef.current);
  }, [active]);

  if (!shown) return null;
  const actions = shown.actions ?? [{ label: 'Oke' }];

  return (
    <dialog
      {...dialogProps}
      onClick={undefined}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={shown.message ? messageId : undefined}
      className={cn(
        'm-0 size-full max-h-none max-w-none bg-transparent p-0 text-tubruk',
        'opacity-0 transition-[opacity,overlay,display] transition-discrete duration-200',
        'open:opacity-100 starting:open:opacity-0',
        'backdrop:bg-tubruk/50',
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 size-full"
      />
      <div
        className="grid size-full place-items-center p-5"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAlert();
        }}
      >
        <m.div
          key={shown.id}
          className="relative w-full max-w-sm rounded-ui border border-garis bg-putih p-6 text-center"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          <AlertIcon tone={shown.tone} icon={shown.icon} />
          <h2 id={titleId} className="mt-5 font-display text-display-m text-balance">
            {shown.title}
          </h2>
          {shown.message ? (
            <div id={messageId} className="mt-2 text-body text-pretty text-ampas">
              {shown.message}
            </div>
          ) : null}
          <div className="mt-6 flex flex-col gap-2">
            {actions.map((aksi, i) => (
              <Button
                key={aksi.label}
                fullWidth
                autoFocus={i === 0}
                variant={aksi.variant ?? (i === 0 ? 'primary' : 'secondary')}
                onClick={() => {
                  closeAlert();
                  aksi.onClick?.();
                }}
              >
                {aksi.label}
              </Button>
            ))}
          </div>
        </m.div>
      </div>
    </dialog>
  );
}
