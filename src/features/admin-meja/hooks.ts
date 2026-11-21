import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MetodeBayar } from '../../types/domain';
import { batalkanSesi, fetchDenah, fetchDetailMeja, konfirmasiBayar } from './api';

const POLLING_ADMIN = 5_000; // PRD 12.3

export const denahKey = ['admin', 'denah'] as const;
export const detailMejaKey = (nomor: number) => ['admin', 'meja', nomor] as const;

export function useDenah() {
  return useQuery({ queryKey: denahKey, queryFn: fetchDenah, refetchInterval: POLLING_ADMIN });
}

export function useDetailMeja(nomor: number) {
  return useQuery({
    queryKey: detailMejaKey(nomor),
    queryFn: () => fetchDetailMeja(nomor),
    refetchInterval: POLLING_ADMIN,
  });
}

function useInvalidasiSesi() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ['admin'] });
    void qc.invalidateQueries({ queryKey: ['tagihan'] });
  };
}

export function useKonfirmasiBayar() {
  const invalidasi = useInvalidasiSesi();
  return useMutation({
    mutationFn: (v: { sesiId: string; metode: MetodeBayar | null }) =>
      konfirmasiBayar(v.sesiId, v.metode),
    onSuccess: invalidasi,
  });
}

export function useBatalkanSesi() {
  const invalidasi = useInvalidasiSesi();
  return useMutation({ mutationFn: batalkanSesi, onSuccess: invalidasi });
}
