// src/context/CheckoutContext.jsx
import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState({
    items: [],
    total: 0,
    addressId: null,
  });

  const setItems = (items, total) => {
    setCheckoutData((prev) => ({ ...prev, items, total }));
  };

  const setAddress = (addressId) => {
    setCheckoutData((prev) => ({ ...prev, addressId }));
  };

  const clearCheckout = () => setCheckoutData({ items: [], total: 0, addressId: null });

  return (
    <CheckoutContext.Provider value={{ checkoutData, setItems, setAddress, clearCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
