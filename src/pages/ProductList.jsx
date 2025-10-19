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

  // Extract search & category params
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const category = queryParams.get("category") || "";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "/products";

        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        } else if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await api.get(url);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Spinner animation="border" variant="success" />
      </Box>
    );
  }

  // No products found
  if (!products.length) {
    return (
      <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
        No products found.
      </Typography>
    );
  }

  // Main UI
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f7fff7, #e8f5e9)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      <Container className="py-5">
        <Typography
          variant="h3"
          fontWeight="bold"
          className="text-center mb-5"
          sx={{ color: "#2e7d32" }}
        >
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : category
            ? `Category: ${category}`
            : "All Fruits"}
        </Typography>

        <Row className="g-4">
          {products.map((product) => (
            <Col xs={12} sm={6} md={4} key={product.id}>
              <ProductCard
                product={product}
                onAdd={() => addToCart(product)} // ✅ Correct function call
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
 