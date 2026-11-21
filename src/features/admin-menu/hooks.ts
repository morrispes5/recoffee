import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Menu } from '../../types/domain';
import { menuKey } from '../menu/hooks';
import { fetchMenuAdmin, tambahMenu, ubahMenu } from './api';
import type { MenuFormValid } from './schema';

export const menuAdminKey = ['admin', 'menu'] as const;

export function useMenuAdmin() {
  return useQuery({ queryKey: menuAdminKey, queryFn: fetchMenuAdmin });
}

function useInvalidasiMenu() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: menuAdminKey });
    void qc.invalidateQueries({ queryKey: menuKey });
  };
}

export function useSimpanMenu() {
  const invalidasi = useInvalidasiMenu();
  return useMutation({
    mutationFn: (v: { id: string | null; data: MenuFormValid }) =>
      v.id ? ubahMenu(v.id, v.data) : tambahMenu(v.data),
    onSuccess: invalidasi,
  });
}

/** Ubah satu field status (tersedia / diarsipkan). */
export function useUbahStatusMenu() {
  const invalidasi = useInvalidasiMenu();
  return useMutation({
    mutationFn: (v: { id: string; patch: Pick<Partial<Menu>, 'tersedia' | 'diarsipkan'> }) =>
      ubahMenu(v.id, v.patch),
    onSettled: invalidasi,
  });
}
