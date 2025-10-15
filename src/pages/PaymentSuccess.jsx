// PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

export default function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("paymentId");
  const payerId = query.get("PayerID");

  useEffect(() => {
    async function confirmPayment() {
      await api.get(`/paypal/execute?paymentId=${paymentId}&PayerID=${payerId}`);
    }
    if (paymentId && payerId) {
      confirmPayment();
    }
  }, [paymentId, payerId]);

  return <h2>✅ Payment Successful!</h2>;
}
