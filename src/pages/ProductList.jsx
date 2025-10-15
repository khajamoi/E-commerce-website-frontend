import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Typography } from "@mui/material";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get("/products")
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-light py-5">
      <Container>
        <Typography variant="h3" fontWeight="bold" className="text-center mb-5" style={{ color: "#2e7d32" }}>
          All Fruits
        </Typography>

        {loading ? (
          <div className="d-flex justify-content-center">
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
