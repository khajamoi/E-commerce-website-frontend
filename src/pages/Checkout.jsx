// src/pages/Checkout.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Container, Button, Table } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Checkout() {
  const { removeItem } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = location.state || {};

  const handleProceedToPayment = () => {
    // Remove only selected items from cart after successful payment
    navigate("/checkout/UserPayment", { state: { items, total } });
  };

  if (!items || items.length === 0)
    return (
      <Container className="py-5 text-center">
        <Typography variant="h5">No items selected for checkout.</Typography>
        <Button onClick={() => navigate("/cart")} variant="success" className="mt-3">
          Go back to Cart
        </Button>
      </Container>
    );

  return (
    <Container className="py-5">
      <Paper sx={{ p: 4, borderRadius: "16px", maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Checkout Summary
        </Typography>

        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price (₹)</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product.id}>
                <td>{item.product.name}</td>
                <td>{item.qty}</td>
                <td>{item.product.price.toFixed(2)}</td>
                <td>{(item.qty * item.product.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Typography variant="h5" color="success.main" fontWeight="bold" className="mt-3">
          Total: ₹{total.toFixed(2)}
        </Typography>

        <Button
          variant="success"
          size="lg"
          className="w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
          onClick={handleProceedToPayment}
        >
          <CheckCircleOutlineIcon /> Proceed to Payment
        </Button>
      </Paper>
    </Container>
  );
}
