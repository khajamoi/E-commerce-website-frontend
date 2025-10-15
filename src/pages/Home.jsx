import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Typography } from "@mui/material";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    api
      .get("/products")
      .then((res) => {
        if (mounted) setProducts(res.data);
      })
      .catch(() => {
        if (mounted)
          setProducts([
            { id: 1, name: "Apple", price: 80, stock: 5, imageBase64: "/assets/apple.jpg" },
            { id: 2, name: "Banana", price: 40, stock: 10, imageBase64: "/assets/banana.jpg" },
          ]);
      })
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="bg-light py-5">
      <Container>
        <Typography
          variant="h3"
          className="text-center fw-bold mb-5"
          style={{ color: "#2e7d32" }}
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
              <Col xs={12} sm={6} md={4} key={p.id}>
                <ProductCard product={p} onAdd={() => addToCart(p, 1)} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
