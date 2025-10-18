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
      <div
        style={{
          background: "linear-gradient(to bottom, #f7fff7, #e8f5e9)",
          minHeight: "100vh",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <Container className="py-5 text-center">
          <Typography variant="h5">No items selected for checkout.</Typography>
          <Button
            onClick={() => navigate("/cart")}
            variant="success"
            className="mt-3"
          >
            Go back to Cart
          </Button>
        </Container>
      </div>
    );

  return (
    // ✅ Added background color same as Home page
    <div
      style={{
        background: "linear-gradient(to bottom, #f7fff7, #e8f5e9)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      <Container className="py-5">
        <Paper
          sx={{ p: 4, borderRadius: "16px", maxWidth: 800, mx: "auto" }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Checkout Summary
          </Typography>

          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price (₹)</th>
                <th>Offer Price (₹)</th>
                <th>Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const hasOffer =
                  item.product.offerActive && item.product.offerPrice != null;
                const effectivePrice = hasOffer
                  ? item.product.offerPrice
                  : item.product.price;

                return (
                  <tr key={item.product.id}>
                    <td>{item.product.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.product.price.toFixed(2)}</td>
                    <td>{hasOffer ? item.product.offerPrice.toFixed(2) : "-"}</td>
                    <td>{(item.qty * effectivePrice).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Typography
            variant="h5"
            color="success.main"
            fontWeight="bold"
            className="mt-3"
          >
            Total: ₹{total.toFixed(2)}
          </Typography>

          <Button
            variant="success"
            size="lg"
            className="w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
            onClick={handleProceedToPayment}
            style={{
              fontWeight: "bold",
              fontSize: "0.8rem",
              padding: "10px 0",
              textTransform: "none",
              borderRadius: "10px",
              minWidth: "120px",
              whiteSpace: "nowrap",
            }}
          >
            <CheckCircleOutlineIcon /> Proceed to Payment
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
