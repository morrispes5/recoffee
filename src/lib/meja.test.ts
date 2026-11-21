import { describe, expect, it } from 'vitest';
import { parseNomorMeja } from './meja';

describe('parseNomorMeja', () => {
  it.each([
    ['1', 1],
    ['18', 18],
    ['28', 28],
  ])('menerima %s', (input, expected) => {
    expect(parseNomorMeja(input)).toBe(expected);
  });

  it.each(['0', '29', 'abc', '1.5', '', '-1', '018', ' 18'])('menolak %j', (input) => {
    expect(parseNomorMeja(input)).toBeNull();
  });

  it('menolak undefined', () => {
    expect(parseNomorMeja(undefined)).toBeNull();
  });
});
