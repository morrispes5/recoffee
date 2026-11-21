import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StatusPesanan } from '../../types/domain';
import { fetchAntrian, ubahStatusPesanan, type StatusAntrian } from './api';

export const antrianKey = ['admin', 'antrian'] as const;

export function useAntrian() {
  return useQuery({ queryKey: antrianKey, queryFn: fetchAntrian, refetchInterval: 5_000 });
}

export function useUbahStatusPesanan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; dari: StatusAntrian; ke: StatusPesanan }) =>
      ubahStatusPesanan(v.id, v.dari, v.ke),
    // Sukses maupun gagal (status sudah berubah di perangkat lain): muat ulang antrian.
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      void qc.invalidateQueries({ queryKey: ['tagihan'] });
    },
  });
}
