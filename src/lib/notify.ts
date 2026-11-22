import { toast } from 'sonner';
import { toUserMessage } from './errors';

/** `detail` boleh berupa teks langsung atau error (diterjemahkan lewat `toUserMessage`). */
function teks(detail: unknown): string | undefined {
  if (detail === undefined) return undefined;
  return typeof detail === 'string' ? detail : toUserMessage(detail);
}

/**
 * Notifikasi toast tak-menghalangi untuk kabar kecil (tersimpan, status berubah, gagal ringan).
 * Kabar besar yang butuh perhatian penuh memakai `showAlert` (modal).
 */
export const notify = {
  success: (judul: string, detail?: unknown) => toast.success(judul, { description: teks(detail) }),
  error: (judul: string, detail?: unknown) =>
    toast.error(judul, { description: teks(detail), duration: 6500 }),
  warning: (judul: string, detail?: unknown) =>
    toast.warning(judul, { description: teks(detail), duration: 5000 }),
  info: (judul: string, detail?: unknown) => toast.info(judul, { description: teks(detail) }),
};
