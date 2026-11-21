import { z } from 'zod';
import type { KategoriMenu } from '../../types/domain';

/** Aturan sama dengan constraint tabel menu (PRD 13.1, 16.9). */
export const PESAN_MENU = {
  nama: 'Nama menu harus 2 sampai 60 huruf.',
  deskripsi: 'Deskripsi maksimal 160 huruf.',
  kategori: 'Pilih kategori.',
  harga: 'Harga harus angka 1 sampai 1.000.000, tanpa titik.',
  urutan: 'Urutan harus angka 0 sampai 999.',
} as const;

const KATEGORI = [
  'kopi',
  'non_kopi',
  'makanan',
  'camilan',
] as const satisfies readonly KategoriMenu[];

/** Input form berupa string (isi field apa adanya). */
export const menuFormSchema = z.object({
  nama: z.string().trim().min(2, PESAN_MENU.nama).max(60, PESAN_MENU.nama),
  deskripsi: z
    .string()
    .trim()
    .max(160, PESAN_MENU.deskripsi)
    .transform((s) => (s === '' ? null : s)),
  kategori: z.string().pipe(z.enum(KATEGORI, { error: PESAN_MENU.kategori })),
  harga: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, PESAN_MENU.harga)
    .transform(Number)
    .pipe(z.number().int().min(1, PESAN_MENU.harga).max(1_000_000, PESAN_MENU.harga)),
  urutan: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, PESAN_MENU.urutan)
    .transform(Number),
});

export type MenuFormInput = z.input<typeof menuFormSchema>;
export type MenuFormValid = z.output<typeof menuFormSchema>;
export type MenuFormErrors = Partial<Record<keyof MenuFormInput, string>>;

export function validasiMenu(
  input: MenuFormInput,
): { ok: true; data: MenuFormValid } | { ok: false; errors: MenuFormErrors } {
  const hasil = menuFormSchema.safeParse(input);
  if (hasil.success) return { ok: true, data: hasil.data };
  const errors: MenuFormErrors = {};
  for (const issue of hasil.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && field in input) {
      const key = field as keyof MenuFormInput;
      errors[key] ??= issue.message;
    }
  }
  return { ok: false, errors };
}
