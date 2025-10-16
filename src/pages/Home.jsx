import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Typography, Snackbar, Alert, Slide } from "@mui/material";

function SlideDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get("/products")
      .then((res) => mounted && setProducts(res.data))
      .catch(() =>
        mounted &&
        setProducts([
          { id: 1, name: "Apple", price: 80, stock: 5, imageBase64: "/assets/apple.jpg" },
          { id: 2, name: "Banana", price: 40, stock: 10, imageBase64: "/assets/banana.jpg" },
        ])
      )
      .finally(() => setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setSnackbarMsg(`${product.name} added to cart 🛒`);
    setSnackbarOpen(true);
  };

  return (
    <div className="bg-light py-5">
      <Container>
        <Typography
          variant="h3"
          className="text-center fw-bold mb-5"
          sx={{ color: "#2e7d32", fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" } }}
        >
          🛒 Fresh Fruits Collection
        </Typography>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <Row className="g-4">
            {products.map((p) => (
              <Col xs={12} sm={6} md={4} lg={3} key={p.id}>
                <ProductCard product={p} onAdd={() => handleAddToCart(p)} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={SlideDown}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: 3,
            bgcolor: "white",
            color: "#2e7d32",
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
