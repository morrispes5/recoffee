import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { CartContext, type CartContextValue } from './cartContext';
import { bacaCart, cartReducer, hitungKeranjang, simpanCart } from './cartReducer';

/** Keranjang per meja, tersimpan di localStorage `recoffee:cart:<nomor>` (PRD 14.4). */
export function CartProvider({ nomorMeja, children }: { nomorMeja: number; children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, nomorMeja, bacaCart);

  useEffect(() => {
    simpanCart(nomorMeja, state);
  }, [nomorMeja, state]);

  const value = useMemo<CartContextValue>(() => {
    const { jumlahItem, total } = hitungKeranjang(state);
    return {
      state,
      dispatch,
      jumlahItem,
      total,
      qtyOf: (menuId) => state.items.find((i) => i.menuId === menuId)?.qty ?? 0,
    };
  }, [state]);

  return <CartContext value={value}>{children}</CartContext>;
}
