import { useEffect, useRef, useState } from 'react';

function gerakDikurangi(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Angka yang "berjalan" dari nilai sebelumnya ke target (±600 ms, ease-out).
 * Langsung ke target bila pengguna memilih kurangi gerakan.
 */
export function useCountUp(target: number, durasi = 600): number {
  const kurangi = gerakDikurangi();
  const [nilai, setNilai] = useState(0);
  const dariRef = useRef(0);

  useEffect(() => {
    if (kurangi) return;
    const dari = dariRef.current;
    const mulai = performance.now();
    let frame = 0;
    const langkah = (sekarang: number) => {
      const t = Math.min(1, (sekarang - mulai) / durasi);
      const eased = 1 - (1 - t) ** 3;
      const berikut = Math.round(dari + (target - dari) * eased);
      dariRef.current = berikut;
      setNilai(berikut);
      if (t < 1) frame = requestAnimationFrame(langkah);
    };
    frame = requestAnimationFrame(langkah);
    return () => cancelAnimationFrame(frame);
  }, [target, durasi, kurangi]);

  return kurangi ? target : nilai;
}
