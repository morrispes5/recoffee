import { useEffect, useRef, type MouseEvent } from 'react';

/**
 * Sinkronkan prop `open` dengan elemen <dialog> native (showModal/close).
 * Escape dan klik backdrop memanggil onClose; parent tetap pemilik state.
 */
export function useNativeDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const dialogProps = {
    ref,
    onClose: () => {
      if (open) onClose();
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      // Klik tepat di dialog (bukan isinya) = klik backdrop.
      if (e.target === e.currentTarget) onClose();
    },
  };

  return dialogProps;
}
