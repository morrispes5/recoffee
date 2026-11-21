import { beforeEach, describe, expect, it } from 'vitest';
import {
  bacaCart,
  cartReducer,
  cartStorageKey,
  hitungKeranjang,
  KERANJANG_KOSONG,
  MAX_BARIS,
  MAX_QTY,
  parseCart,
  simpanCart,
  type CartState,
} from './cartReducer';

const tubruk = { menuId: 'm1', nama: 'Kopi Tubruk', hargaTampil: 15000 };
const pisang = { menuId: 'm2', nama: 'Pisang Goreng', hargaTampil: 14000 };

function tambahN(state: CartState, item: typeof tubruk, n: number): CartState {
  let s = state;
  for (let i = 0; i < n; i++) s = cartReducer(s, { type: 'tambah', item });
  return s;
}

describe('cartReducer', () => {
  it('menambah item baru dengan qty 1', () => {
    const s = cartReducer(KERANJANG_KOSONG, { type: 'tambah', item: tubruk });
    expect(s.items).toEqual([{ ...tubruk, qty: 1 }]);
  });

  it('menambah item yang sama menaikkan qty', () => {
    const s = tambahN(KERANJANG_KOSONG, tubruk, 2);
    expect(s.items).toHaveLength(1);
    expect(s.items[0]?.qty).toBe(2);
  });

  it(`qty tidak melebihi ${MAX_QTY}`, () => {
    const s = tambahN(KERANJANG_KOSONG, tubruk, MAX_QTY + 3);
    expect(s.items[0]?.qty).toBe(MAX_QTY);
  });

  it(`baris tidak melebihi ${MAX_BARIS}`, () => {
    let s = KERANJANG_KOSONG;
    for (let i = 0; i < MAX_BARIS + 2; i++) {
      s = cartReducer(s, { type: 'tambah', item: { ...tubruk, menuId: `m${i}` } });
    }
    expect(s.items).toHaveLength(MAX_BARIS);
  });

  it('mengurangi sampai 0 menghapus item', () => {
    let s = tambahN(KERANJANG_KOSONG, tubruk, 2);
    s = cartReducer(s, { type: 'kurangi', menuId: 'm1' });
    expect(s.items[0]?.qty).toBe(1);
    s = cartReducer(s, { type: 'kurangi', menuId: 'm1' });
    expect(s.items).toHaveLength(0);
  });

  it('hapus menghilangkan baris', () => {
    let s = tambahN(KERANJANG_KOSONG, tubruk, 3);
    s = cartReducer(s, { type: 'tambah', item: pisang });
    s = cartReducer(s, { type: 'hapus', menuId: 'm1' });
    expect(s.items.map((i) => i.menuId)).toEqual(['m2']);
  });

  it('catatan dipotong 140 karakter', () => {
    const s = cartReducer(KERANJANG_KOSONG, { type: 'setCatatan', catatan: 'x'.repeat(200) });
    expect(s.catatan).toHaveLength(140);
  });

  it('kosongkan mengembalikan keranjang kosong', () => {
    let s = tambahN(KERANJANG_KOSONG, tubruk, 2);
    s = cartReducer(s, { type: 'setCatatan', catatan: 'less sugar' });
    expect(cartReducer(s, { type: 'kosongkan' })).toEqual(KERANJANG_KOSONG);
  });

  it('menghitung jumlah item dan total', () => {
    let s = tambahN(KERANJANG_KOSONG, tubruk, 2);
    s = cartReducer(s, { type: 'tambah', item: pisang });
    expect(hitungKeranjang(s)).toEqual({ jumlahItem: 3, total: 44000 });
  });
});

describe('parseCart dan penyimpanan', () => {
  beforeEach(() => localStorage.clear());

  it('data rusak menjadi keranjang kosong', () => {
    expect(parseCart(null)).toEqual(KERANJANG_KOSONG);
    expect(parseCart({ items: 'x' })).toEqual(KERANJANG_KOSONG);
    expect(parseCart({ items: [{ ...tubruk, qty: 99 }] })).toEqual(KERANJANG_KOSONG);
    expect(parseCart({ items: [{ ...tubruk, hargaTampil: 1.5, qty: 1 }] })).toEqual(
      KERANJANG_KOSONG,
    );
  });

  it('JSON tidak valid di localStorage diabaikan', () => {
    localStorage.setItem(cartStorageKey(18), '{bukan json');
    expect(bacaCart(18)).toEqual(KERANJANG_KOSONG);
  });

  it('tersimpan terpisah per meja', () => {
    simpanCart(18, tambahN(KERANJANG_KOSONG, tubruk, 2));
    simpanCart(4, tambahN(KERANJANG_KOSONG, pisang, 1));
    expect(bacaCart(18).items[0]).toMatchObject({ menuId: 'm1', qty: 2 });
    expect(bacaCart(4).items[0]).toMatchObject({ menuId: 'm2', qty: 1 });
    expect(bacaCart(7)).toEqual(KERANJANG_KOSONG);
  });

  it('keranjang kosong menghapus key', () => {
    simpanCart(18, tambahN(KERANJANG_KOSONG, tubruk, 1));
    simpanCart(18, KERANJANG_KOSONG);
    expect(localStorage.getItem(cartStorageKey(18))).toBeNull();
  });
});
