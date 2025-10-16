import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Typography, Box } from "@mui/material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const location = useLocation();

  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    let url = "/products";
    if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;

    api
      .get(url)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Spinner animation="border" variant="success" />
      </Box>
    );

  if (!products.length)
    return (
      <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
        No products found.
      </Typography>
    );

  return (
    <Container className="py-5">
      <Typography
        variant="h3"
        fontWeight="bold"
        className="text-center mb-5"
        sx={{ color: "#2e7d32" }}
      >
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Fruits"}
      </Typography>

      <Row className="g-4">
        {products.map((p) => (
          <Col xs={12} sm={6} md={4} key={p.id}>
            <ProductCard product={p} onAdd={() => addToCart(p, 1)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
