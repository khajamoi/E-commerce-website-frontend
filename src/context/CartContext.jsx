import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children, userId }) {
  const [items, setItems] = useState([]);

  // Load cart for logged-in user
  useEffect(() => {
    if (!userId) {
      setItems([]); // clear cart if no user
      return;
    }
    const raw = localStorage.getItem(`fe_cart_${userId}`);
    if (raw) setItems(JSON.parse(raw));
  }, [userId]);

  // Save cart for logged-in user
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`fe_cart_${userId}`, JSON.stringify(items));
  }, [items, userId]);

  const clearCart = () => setItems([]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      return [...prev, { product, qty }];
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Total calculation based on offerPrice if exists
  const total = items.reduce((s, i) => {
    const price = i.product.offerActive && i.product.offerPrice != null
      ? i.product.offerPrice
      : i.product.price;
    return s + price * i.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
