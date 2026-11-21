import { useContext } from 'react';
import { CartContext, type CartContextValue } from './cartContext';

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart harus dipakai di dalam <CartProvider>');
  return ctx;
}
