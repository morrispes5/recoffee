import { useSyncExternalStore, type ReactNode } from 'react';

export type AlertTone = 'success' | 'error' | 'warning' | 'info';

export interface AlertAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Dipanggil setelah alert ditutup. */
  onClick?: () => void;
}

export interface AlertOptions {
  tone: AlertTone;
  title: string;
  message?: ReactNode;
  /** `cup` = cangkir beruap, dipakai untuk pesanan terkirim. */
  icon?: 'cup';
  /** Tembakkan konfeti saat alert muncul (hanya untuk kabar baik). */
  celebrate?: boolean;
  /** Tombol aksi. Bila kosong, satu tombol "Oke". */
  actions?: AlertAction[];
}

export interface ActiveAlert extends AlertOptions {
  id: number;
}

let active: ActiveAlert | null = null;
let counter = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Tampilkan alert modal. Satu alert sekali tampil; yang baru menggantikan yang lama. */
export function showAlert(options: AlertOptions): void {
  counter += 1;
  active = { ...options, id: counter };
  emit();
}

export function closeAlert(): void {
  if (active === null) return;
  active = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActiveAlert(): ActiveAlert | null {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}
