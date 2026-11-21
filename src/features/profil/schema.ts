import { z } from 'zod';

/** Sama dengan constraint tabel pelanggan dan function simpan_profil (PRD 13.1, 13.3). */
export const POLA_HP = /^(\+62|62|0)8[0-9]{7,12}$/;
export const PESAN_NAMA = 'Nama harus 2 sampai 50 huruf.';
export const PESAN_HP = 'Nomor HP belum benar. Contoh: 081234567890.';

export function normalisasiHp(input: string): string {
  return input.replace(/[\s-]/g, '');
}

export const profilSchema = z.object({
  nama: z.string().trim().min(2, PESAN_NAMA).max(50, PESAN_NAMA),
  no_hp: z.string().transform(normalisasiHp).pipe(z.string().regex(POLA_HP, PESAN_HP)),
});

export type ProfilInput = z.input<typeof profilSchema>;
export type ProfilValid = z.output<typeof profilSchema>;
export type ProfilErrors = Partial<Record<keyof ProfilInput, string>>;

export function validasiProfil(
  input: ProfilInput,
): { ok: true; data: ProfilValid } | { ok: false; errors: ProfilErrors } {
  const hasil = profilSchema.safeParse(input);
  if (hasil.success) return { ok: true, data: hasil.data };
  const errors: ProfilErrors = {};
  for (const issue of hasil.error.issues) {
    const field = issue.path[0];
    if ((field === 'nama' || field === 'no_hp') && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { ok: false, errors };
}
