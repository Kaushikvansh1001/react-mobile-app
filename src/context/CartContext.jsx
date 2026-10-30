import { createContext, useCallback, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((item) => {
    setItems((current) => {
      const index = current.findIndex(
        (entry) => entry.id === item.id && entry.portionId === item.portionId,
      );

      if (index === -1) {
        return [...current, item];
      }

      const next = [...current];
      next[index] = item;
      return next;
    });
  }, []);

  return <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used within CartProvider');
  }

  return value;
}
