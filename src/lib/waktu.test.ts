import { describe, expect, it } from 'vitest';
import { awalHariJakarta, formatTanggalPanjang, lamaSejak } from './waktu';

describe('awalHariJakarta', () => {
  it('mengembalikan 00.00 WIB (17.00 UTC hari sebelumnya)', () => {
    const now = new Date('2026-11-22T03:15:00Z'); // 10.15 WIB
    expect(awalHariJakarta(now).toISOString()).toBe('2026-11-21T17:00:00.000Z');
  });

  it('sudah berganti hari saat lewat tengah malam WIB walau UTC masih kemarin', () => {
    const now = new Date('2026-11-21T17:30:00Z'); // 00.30 WIB tanggal 22
    expect(awalHariJakarta(now).toISOString()).toBe('2026-11-21T17:00:00.000Z');
  });
});

describe('lamaSejak', () => {
  const now = new Date('2026-11-22T10:00:00Z');
  it.each([
    ['2026-11-22T09:59:40Z', 'baru saja'],
    ['2026-11-22T09:53:00Z', '7 menit'],
    ['2026-11-22T09:00:00Z', '1 jam'],
    ['2026-11-22T08:55:00Z', '1 jam 5 menit'],
    ['2026-11-22T10:05:00Z', 'baru saja'],
  ])('%s → %s', (iso, hasil) => {
    expect(lamaSejak(iso, now)).toBe(hasil);
  });
});

describe('formatTanggalPanjang', () => {
  it('memakai nama hari dan bulan bahasa Indonesia', () => {
    expect(formatTanggalPanjang(new Date('2026-11-22T03:00:00Z'))).toBe('Minggu, 22 November 2026');
  });
});
