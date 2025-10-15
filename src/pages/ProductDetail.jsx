import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Typography, Paper } from "@mui/material";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct({ id, name: "Unknown", price: 0 }));
  }, [id]);

  if (!product)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  return (
    <Container className="py-5">
      <Paper sx={{ p: 4, borderRadius: "16px", boxShadow: 3 }}>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              src={product.imageBase64 || "/assets/fruit-placeholder.png"}
              alt={product.name}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />
          </Col>
          <Col md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight="bold" gutterBottom>
              ₹{product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description || "No description available."}
            </Typography>
            <Button
              variant="success"
              size="lg"
              className="mt-3"
              onClick={() => addToCart(product, 1)}
            >
              Add to Cart
            </Button>
          </Col>
        </Row>
      </Paper>
    </Container>
  );
}
