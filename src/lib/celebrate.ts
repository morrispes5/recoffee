import type { Options } from 'canvas-confetti';

const WARNA = ['#2F6B57', '#F0B840', '#2B201B', '#76695F', '#B23A2E'];

function gerakDikurangi(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Konfeti warna palet RE:coffee. Di dalam `<dialog>` modal, berikan `canvas` milik dialog
 * itu sendiri: lapisan atas (top layer) menutupi kanvas global milik library.
 * Library dimuat saat dibutuhkan agar bundle awal tetap kecil.
 */
export async function celebrate(canvas?: HTMLCanvasElement | null): Promise<void> {
  if (gerakDikurangi()) return;
  const { default: confetti } = await import('canvas-confetti');
  const tembak: (opsi: Options) => unknown = canvas
    ? confetti.create(canvas, { resize: true, useWorker: false })
    : confetti;
  const dasar: Options = { colors: WARNA, ticks: 220, gravity: 1.1, scalar: 1.05 };

  tembak({
    ...dasar,
    particleCount: 80,
    spread: 75,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
  });
  window.setTimeout(() => {
    tembak({ ...dasar, particleCount: 45, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    tembak({ ...dasar, particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
  }, 180);
}
