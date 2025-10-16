import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function Cart() {
  const { items, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(items.map((i) => i.product.id));

  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectedProducts = items.filter((i) => selectedItems.includes(i.product.id));
  const selectedTotal = selectedProducts.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const handleCheckout = () => {
    if (!selectedProducts.length) {
      alert("⚠️ Please select at least one item to proceed.");
      return;
    }
    navigate("/checkout/address", {
      state: { items: selectedProducts, total: selectedTotal },
    });
  };

  if (!items.length)
    return (
      <Container className="py-5 text-center">
        <Typography variant="h4">🛒 Your cart is empty</Typography>
        <Button as={Link} to="/" variant="success">
          Shop Fruits
        </Button>
      </Container>
    );

  return (
    <Container className="py-5">
      <Typography variant="h4" fontWeight="bold" className="mb-4">
        Your Cart
      </Typography>
      <Row className="gy-4">
        <Col xs={12} md={8}>
          {items.map((it) => (
            <Paper
              key={it.product.id}
              sx={{ p: 2, mb: 2, borderRadius: "16px", boxShadow: 3 }}
            >
              <Form.Check
                type="checkbox"
                id={`select-${it.product.id}`}
                label="Select for checkout"
                checked={selectedItems.includes(it.product.id)}
                onChange={() => toggleSelect(it.product.id)}
                className="mb-2"
              />
              <CartItem item={it} onUpdate={updateQty} onRemove={removeItem} />
            </Paper>
          ))}
        </Col>

        <Col xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              boxShadow: 3,
              position: "sticky",
              top: 100,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Typography>Items selected: {selectedProducts.length}</Typography>
            <Typography
              variant="h5"
              color="success.main"
              fontWeight="bold"
              className="mb-3"
            >
              Total: ₹{selectedTotal.toFixed(2)}
            </Typography>
            <Button
              variant="success"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleCheckout}
            >
              <ShoppingCartCheckoutIcon /> Proceed to Checkout
            </Button>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
}
