import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { errorCode } from '../../lib/errors';
import type { MetodeBayar } from '../../types/domain';
import { useAuth } from '../auth/useAuth';
import { menuKey } from '../menu/hooks';
import { fetchStatusTerakhir, fetchTagihan, kirimPesanan, mintaBill, type ItemKirim } from './api';

export const tagihanKey = (nomor: number) => ['tagihan', nomor] as const;

/** Tagihan meja aktif, polling 10 detik (PRD 12.3). Butuh login. */
export function useTagihan(nomor: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...tagihanKey(nomor), user?.id],
    queryFn: () => fetchTagihan(nomor),
    enabled: !!user,
    refetchInterval: 10_000,
  });
}

export function useKirimPesanan(nomor: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { items: ItemKirim[]; catatan: string }) =>
      kirimPesanan(nomor, v.items, v.catatan),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      return qc.invalidateQueries({ queryKey: tagihanKey(nomor) });
    },
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
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      return qc.invalidateQueries({ queryKey: tagihanKey(nomor) });
    },
  });
}

/** Status sesi terakhir yang pernah dilihat di tab ini, untuk layar terima kasih. */
export function useStatusTerakhir(nomor: number, sesiId: string | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['statusTerakhir', nomor, sesiId, user?.id] as const,
    queryFn: () => (sesiId ? fetchStatusTerakhir(nomor, sesiId) : null),
    enabled: !!user && sesiId !== null,
  });
}
