import React from "react";
import { useCart } from "../context/CartContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Container, Button, Table } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Checkout() {
  const { items, total } = useCart();
  const nav = useNavigate();

  const handleProceedToPayment = () => {
  nav("/checkout/UserPayment", { state: { items, total } }); // ✅ FIXED
};


  return (
    <Container className="py-5">
      <Paper sx={{ p: 4, borderRadius: "16px", maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Checkout Summary
        </Typography>

        {/* Product Summary Table */}
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

        <Typography
          variant="h5"
          color="success.main"
          fontWeight="bold"
          gutterBottom
          className="mt-3"
        >
          Total: ₹{total.toFixed(2)}
        </Typography>

        {/* Proceed to Payment Button */}
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




// import React from "react";
// import { useCart } from "../context/CartContext";
// import api from "../api/api";
// import { useNavigate } from "react-router-dom";
// import { Container, Button } from "react-bootstrap";
// import { Typography, Paper, Alert } from "@mui/material";

// export default function CheckoutPayPal() {
//   const { items, total, clearCart } = useCart();
//   const nav = useNavigate();
//   const [error, setError] = React.useState(null);
//   const [loading, setLoading] = React.useState(false);

//   async function handlePayWithPayPal() {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await api.post("/paypal/create", { total });
//       const { url } = res.data;

//       window.location.href = url; // Redirect to PayPal approval page
//     } catch (err) {
//       console.error(err);
//       setError("Failed to start PayPal payment.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Container className="py-5">
//       <Paper sx={{ p: 4, borderRadius: "16px", maxWidth: 500, mx: "auto" }}>
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Pay with PayPal
//         </Typography>
//         {error && <Alert severity="error">{error}</Alert>}
//         <Typography variant="body1" gutterBottom>
//           Items: {items.length}
//         </Typography>
//         <Typography
//           variant="h5"
//           color="success.main"
//           fontWeight="bold"
//           gutterBottom
//         >
//           Total: ${total.toFixed(2)}
//         </Typography>
//         <Button
//           variant="warning"
//           size="lg"
//           className="w-100 d-flex align-items-center justify-content-center gap-2"
//           onClick={handlePayWithPayPal}
//           disabled={loading}
//         >
//           {loading ? "Redirecting..." : "Pay with PayPal"}
//         </Button>
//       </Paper>
//     </Container>
//   );
// }
