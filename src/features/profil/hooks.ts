import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfil, simpanProfil } from './api';

export const profilKey = (userId: string | null) => ['profil', userId] as const;

/** Data diri user yang sedang login; null = belum mengisi. */
export function useProfil(userId: string | null) {
  return useQuery({
    queryKey: profilKey(userId),
    queryFn: fetchProfil,
    enabled: userId !== null,
    staleTime: 60_000,
  });
}

export function useSimpanProfil() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { nama: string; noHp: string }) => simpanProfil(v.nama, v.noHp),
    onSuccess: () => {
      // Biarkan dialog menjalankan onSaved sebelum hasil refetch menutupnya.
      void qc.invalidateQueries({ queryKey: ['profil'] });
      // Nama baru juga tampil di tagihan.
      void qc.invalidateQueries({ queryKey: ['tagihan'] });
    },
  });
}
