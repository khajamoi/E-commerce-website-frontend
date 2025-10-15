// src/pages/Cart.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <Container className="py-5 text-center">
        <Typography variant="h4" gutterBottom>
          🛒 Your cart is empty
        </Typography>
        <Button as={Link} to="/" variant="success">
          Shop Fruits
        </Button>
      </Container>
    );

  return (
    <Container className="py-5">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Your Cart
      </Typography>

      <Row>
        <Col md={8}>
          {items.map((it) => (
            <CartItem
              key={it.product.id}
              item={it}
              onUpdate={updateQty}
              onRemove={removeItem}
            />
          ))}
        </Col>

        <Col md={4}>
          <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body1" className="mb-2">
              Items: {items.length}
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              Total: ₹{total.toFixed(2)}
            </Typography>
            <Button
              variant="success"
              className="mt-3 w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate("/checkout/address")}
            >
              <ShoppingCartCheckoutIcon /> Proceed to Checkout
            </Button>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
}
