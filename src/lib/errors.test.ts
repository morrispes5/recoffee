import { describe, expect, it } from 'vitest';
import { errorCode, PESAN_DEFAULT, toUserMessage } from './errors';

describe('toUserMessage', () => {
  it('memetakan kode dikenal dari Error', () => {
    expect(toUserMessage(new Error('TAGIHAN_SEDANG_DIPROSES'))).toBe(
      'Bill sudah diminta. Tambah pesanan lewat kasir.',
    );
  });

  it('mengenali kode di dalam pesan panjang (gaya error Postgres)', () => {
    expect(toUserMessage({ message: 'ERROR: MENU_TIDAK_TERSEDIA (P0001)' })).toMatch(
      /baru saja habis/,
    );
  });

  it('memberi pesan default untuk error tidak dikenal', () => {
    expect(toUserMessage(new TypeError('Failed to fetch'))).toBe(PESAN_DEFAULT);
    expect(toUserMessage(null)).toBe(PESAN_DEFAULT);
    expect(toUserMessage(42)).toBe(PESAN_DEFAULT);
  });

  it('tidak salah cocok dengan kode yang mirip', () => {
    expect(errorCode('PROFIL_TIDAK_VALIDASI')).toBeNull();
  });
});
