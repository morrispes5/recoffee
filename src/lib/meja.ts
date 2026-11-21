export const TOTAL_MEJA = 28;

/** Hanya menerima string integer 1–28. Selain itu null. */
export function parseNomorMeja(param: string | undefined): number | null {
  if (param === undefined || !/^\d{1,2}$/.test(param)) return null;
  const nomor = Number(param);
  return nomor >= 1 && nomor <= TOTAL_MEJA ? nomor : null;
}
