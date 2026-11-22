import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from './api';

export const menuKey = ['menu'] as const;

export function useMenu() {
  return useQuery({ queryKey: menuKey, queryFn: fetchMenu, refetchInterval: 10_000 });
}
