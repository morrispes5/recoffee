import { useQuery } from '@tanstack/react-query';
import { fetchRingkasanHariIni } from './api';

export const ringkasanKey = ['admin', 'ringkasan'] as const;

/** Ringkasan hari ini. Ikut diinvalidasi bersama key `['admin']` setelah konfirmasi bayar. */
export function useRingkasanHariIni() {
  return useQuery({
    queryKey: ringkasanKey,
    queryFn: fetchRingkasanHariIni,
    refetchInterval: 15_000,
  });
}
