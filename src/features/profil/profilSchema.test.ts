import { describe, expect, it } from 'vitest';
import { PESAN_HP, PESAN_NAMA, validasiProfil } from './schema';

const HP_OK = '081234567890';

describe('validasiProfil — nama (BVA 1, 2, 50, 51)', () => {
  it.each([
    ['a', false],
    ['ab', true],
    ['a'.repeat(50), true],
    ['a'.repeat(51), false],
    ['  a  ', false],
  ])('nama %j valid=%s', (nama, valid) => {
    const hasil = validasiProfil({ nama, no_hp: HP_OK });
    expect(hasil.ok).toBe(valid);
    if (!hasil.ok) expect(hasil.errors.nama).toBe(PESAN_NAMA);
  });

  it('memangkas spasi di tepi nama', () => {
    const hasil = validasiProfil({ nama: '  Rina  ', no_hp: HP_OK });
    expect(hasil.ok && hasil.data.nama).toBe('Rina');
  });
});

describe('validasiProfil — nomor HP', () => {
  it.each(['081234567890', '6281234567890', '+6281234567890', '0812-3456-7890', '0812 3456 7890'])(
    'menerima %j',
    (no_hp) => {
      expect(validasiProfil({ nama: 'Rina', no_hp }).ok).toBe(true);
    },
  );

  it.each(['0712345678', '08123', 'abc', ''])('menolak %j', (no_hp) => {
    const hasil = validasiProfil({ nama: 'Rina', no_hp });
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.errors.no_hp).toBe(PESAN_HP);
  });

  it('menormalkan tanda hubung dan spasi', () => {
    const hasil = validasiProfil({ nama: 'Rina', no_hp: '0812-3456 7890' });
    expect(hasil.ok && hasil.data.no_hp).toBe('081234567890');
  });
});
