import type { CartItem } from '../../types/domain';

/** Batas sama dengan aturan database (BR-04, kolom catatan). */
export const MAX_QTY = 20;
export const MAX_BARIS = 30;
export const MAX_CATATAN = 140;

export interface CartState {
  items: CartItem[];
  catatan: string;
}

export type CartAction =
  | { type: 'tambah'; item: Omit<CartItem, 'qty'> }
  | { type: 'kurangi'; menuId: string }
  | { type: 'hapus'; menuId: string }
  | { type: 'setCatatan'; catatan: string }
  | { type: 'kosongkan' };

export const KERANJANG_KOSONG: CartState = { items: [], catatan: '' };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'tambah': {
      const ada = state.items.find((i) => i.menuId === action.item.menuId);
      if (ada) {
        if (ada.qty >= MAX_QTY) return state;
        return {
          ...state,
          items: state.items.map((i) =>
            i.menuId === action.item.menuId ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      if (state.items.length >= MAX_BARIS) return state;
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'kurangi': {
      const ada = state.items.find((i) => i.menuId === action.menuId);
      if (!ada) return state;
      if (ada.qty <= 1) {
        return { ...state, items: state.items.filter((i) => i.menuId !== action.menuId) };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.menuId === action.menuId ? { ...i, qty: i.qty - 1 } : i)),
      };
    }
    case 'hapus':
      return { ...state, items: state.items.filter((i) => i.menuId !== action.menuId) };
    case 'setCatatan':
      return { ...state, catatan: action.catatan.slice(0, MAX_CATATAN) };
    case 'kosongkan':
      return KERANJANG_KOSONG;
  }
}

export function hitungKeranjang(state: CartState): { jumlahItem: number; total: number } {
  return state.items.reduce(
    (acc, i) => ({ jumlahItem: acc.jumlahItem + i.qty, total: acc.total + i.qty * i.hargaTampil }),
    { jumlahItem: 0, total: 0 },
  );
}

// ---------- Penyimpanan per meja ----------

export const cartStorageKey = (nomorMeja: number) => `recoffee:cart:${nomorMeja}`;

function isCartItem(v: unknown): v is CartItem {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.menuId === 'string' &&
    o.menuId !== '' &&
    typeof o.nama === 'string' &&
    typeof o.hargaTampil === 'number' &&
    Number.isInteger(o.hargaTampil) &&
    o.hargaTampil > 0 &&
    typeof o.qty === 'number' &&
    Number.isInteger(o.qty) &&
    o.qty >= 1 &&
    o.qty <= MAX_QTY
  );
}

/** Validasi data dari localStorage. Bila rusak, mulai dengan keranjang kosong (PRD 14.4). */
export function parseCart(raw: unknown): CartState {
  if (typeof raw !== 'object' || raw === null) return KERANJANG_KOSONG;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.items) || !o.items.every(isCartItem)) return KERANJANG_KOSONG;
  const items: CartItem[] = o.items;
  const unik = new Set(items.map((i) => i.menuId));
  if (unik.size !== items.length || items.length > MAX_BARIS) return KERANJANG_KOSONG;
  const catatan = typeof o.catatan === 'string' ? o.catatan.slice(0, MAX_CATATAN) : '';
  return {
    items: items.map(({ menuId, nama, hargaTampil, qty }) => ({ menuId, nama, hargaTampil, qty })),
    catatan,
  };
}

export function bacaCart(nomorMeja: number): CartState {
  try {
    const raw = localStorage.getItem(cartStorageKey(nomorMeja));
    return raw ? parseCart(JSON.parse(raw)) : KERANJANG_KOSONG;
  } catch {
    return KERANJANG_KOSONG;
  }
}

export function simpanCart(nomorMeja: number, state: CartState): void {
  try {
    if (state.items.length === 0 && state.catatan === '') {
      localStorage.removeItem(cartStorageKey(nomorMeja));
    } else {
      localStorage.setItem(cartStorageKey(nomorMeja), JSON.stringify(state));
    }
  } catch {
    // localStorage tidak tersedia: keranjang tetap jalan di memori
  }
}
