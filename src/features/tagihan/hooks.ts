import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { errorCode } from '../../lib/errors';
import type { MetodeBayar } from '../../types/domain';
import { menuKey } from '../menu/hooks';
import { fetchStatusTerakhir, fetchTagihan, kirimPesanan, mintaBill, type ItemKirim } from './api';

export const tagihanKey = (nomor: number) => ['tagihan', nomor] as const;

/** Tagihan meja aktif, polling 10 detik (PRD 12.3). Butuh login. */
export function useTagihan(nomor: number, enabled: boolean) {
  return useQuery({
    queryKey: tagihanKey(nomor),
    queryFn: () => fetchTagihan(nomor),
    enabled,
    refetchInterval: 10_000,
  });
}

export function useKirimPesanan(nomor: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { items: ItemKirim[]; catatan: string }) =>
      kirimPesanan(nomor, v.items, v.catatan),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagihanKey(nomor) }),
    onError: (error) => {
      // Ada menu yang baru habis: segarkan papan menu agar label "Habis" muncul.
      if (errorCode(error) === 'MENU_TIDAK_TERSEDIA') {
        void qc.invalidateQueries({ queryKey: menuKey });
      }
      if (errorCode(error) === 'TAGIHAN_SEDANG_DIPROSES') {
        void qc.invalidateQueries({ queryKey: tagihanKey(nomor) });
      }
    },
  });
}

export function useMintaBill(nomor: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (metode: MetodeBayar) => mintaBill(nomor, metode),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagihanKey(nomor) }),
  });
}

/** Status sesi terakhir yang pernah dilihat di tab ini, untuk layar terima kasih. */
export function useStatusTerakhir(nomor: number, sesiId: string | null) {
  return useQuery({
    queryKey: ['statusTerakhir', nomor, sesiId] as const,
    queryFn: () => (sesiId ? fetchStatusTerakhir(nomor, sesiId) : null),
    enabled: sesiId !== null,
  });
}
