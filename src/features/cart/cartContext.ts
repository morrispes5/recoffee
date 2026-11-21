import { createContext, type Dispatch } from 'react';
import type { CartAction, CartState } from './cartReducer';

export interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  jumlahItem: number;
  total: number;
  qtyOf: (menuId: string) => number;
}

export const CartContext = createContext<CartContextValue | null>(null);
