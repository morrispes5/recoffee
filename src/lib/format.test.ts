import { describe, expect, it } from 'vitest';
import { formatJam, formatRupiah } from './format';

describe('formatRupiah', () => {
  it('memformat ribuan dengan titik', () => {
    expect(formatRupiah(15000)).toMatch(/^Rp\s?15\.000$/);
  });

  it('memformat nol', () => {
    expect(formatRupiah(0)).toMatch(/^Rp\s?0$/);
  });

  it('memformat jutaan', () => {
    expect(formatRupiah(1000000)).toMatch(/^Rp\s?1\.000\.000$/);
  });
});

describe('formatJam', () => {
  it('memakai zona Asia/Jakarta', () => {
    // 07.05 UTC = 14.05 WIB
    expect(formatJam('2026-11-21T07:05:00Z')).toMatch(/^14[.:]05$/);
  });
});
