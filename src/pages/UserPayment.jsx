import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, ToggleButton, ButtonGroup } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";
import api from "../api/api";

export default function UserPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total, userId } = location.state || { items: [], total: 0, userId: null };

  const [paymentData, setPaymentData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [method, setMethod] = useState("ONLINE");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const makePayload = () => ({
    items: items.map((i) => ({ productId: i.product.id, qty: i.qty, price: i.product.price })),
    total,
    payment: method === "ONLINE" ? paymentData : null,
    paymentMethod: method,
    userId: userId,
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const payload = makePayload();
    const response = await api.post("/payments/process", payload);

    if (response.status === 200 && response.data) {
      const { status, barcodeBase64 } = response.data;

      if (method === "UPI") {
        setQrCode(barcodeBase64); // now correctly showing QR
      }

      if (status === "SUCCESS" || status === "COD_PENDING" || status === "UPI_PENDING") {
        // Clear cart before navigating
        localStorage.removeItem("cart");
        setPaymentData({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
        setQrCode(null); // reset QR code
        navigate("/"); // go to home page
      } else {
        alert("Payment failed. Please check details.");
      }
    } else {
      alert("Payment failed. Try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Payment error: " + (err.response?.data || err.message));
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="py-5">
      <Paper sx={{ p: 4, borderRadius: "16px", maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>

        <div className="mb-3">
          <ButtonGroup>
            <ToggleButton
              id="t-online"
              type="radio"
              variant={method === "ONLINE" ? "primary" : "outline-primary"}
              checked={method === "ONLINE"}
              onChange={() => setMethod("ONLINE")}
            >Online Card</ToggleButton>

            <ToggleButton
              id="t-cod"
              type="radio"
              variant={method === "COD" ? "primary" : "outline-primary"}
              checked={method === "COD"}
              onChange={() => setMethod("COD")}
            >Cash on Delivery</ToggleButton>

            <ToggleButton
              id="t-upi"
              type="radio"
              variant={method === "UPI" ? "primary" : "outline-primary"}
              checked={method === "UPI"}
              onChange={() => setMethod("UPI")}
            >UPI / QR Scan</ToggleButton>
          </ButtonGroup>
        </div>

        <Form onSubmit={handleSubmit}>
          {method === "ONLINE" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Card Holder Name</Form.Label>
                <Form.Control type="text" name="cardHolder" value={paymentData.cardHolder} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handleChange} maxLength="19" required />
              </Form.Group>

              <div className="d-flex gap-2 mb-3">
                <Form.Group className="flex-fill">
                  <Form.Label>Expiry</Form.Label>
                  <Form.Control type="month" name="expiry" value={paymentData.expiry} onChange={handleChange} required />
                </Form.Group>

                <Form.Group style={{ width: 120 }}>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control type="password" name="cvv" value={paymentData.cvv} onChange={handleChange} maxLength="3" required />
                </Form.Group>
              </div>
            </>
          )}

          <Button variant="success" size="lg" className="w-100" type="submit" disabled={loading}>
            {method === "ONLINE" ? `Pay ₹${total}` :
             method === "COD" ? `Place COD Order ₹${total}` :
             `Pay via UPI ₹${total}`}
          </Button>
        </Form>

        {qrCode && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Typography variant="h6">Scan QR Code</Typography>
            <img src={`data:image/png;base64,${qrCode}`} alt="UPI QR" style={{ maxWidth: 300, marginTop: 12 }} />
            <p>Scan this QR in Google Pay, PhonePe, Paytm, etc.</p>
          </div>
        )}
      </Paper>
    </Container>
  );
}
