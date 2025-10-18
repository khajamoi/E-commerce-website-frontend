import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { Container, Row, Col } from "react-bootstrap";
import {
  Typography,
  Paper,
  Button,
  Chip,
  Box,
  CardMedia,
} from "@mui/material";
import { ShoppingCart } from "lucide-react";
import dayjs from "dayjs";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() =>
        setProduct({ id, name: "Unknown", price: 0, stock: 0 })
      );
  }, [id]);

  if (!product)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const hasOffer =
    product.offerActive &&
    product.offerPrice != null &&
    product.offerPrice < product.price;

  const isFestivalOffer = hasOffer && product.festivalName;

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
        <Paper sx={{ p: 4, borderRadius: "16px", boxShadow: 3 }}>
          <Row className="align-items-center">
            {/* Product Image */}
            <Col md={6} className="text-center mb-3 mb-md-0">
              <CardMedia
                component="img"
                image={product.imageBase64 || "/assets/fruit-placeholder.png"}
                alt={product.name}
                sx={{
                  maxHeight: 350,
                  objectFit: "cover",
                  borderRadius: "16px",
                  boxShadow: 3,
                }}
              />
            </Col>

            {/* Product Info */}
            <Col md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>

              {/* Price & Offer */}
              {hasOffer ? (
                <Box>
                  {/* Original Price */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ₹{product.price.toFixed(2)}
                  </Typography>

                  {/* Offer Price */}
                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                    sx={{ mt: 0.5 }}
                  >
                    ₹{product.offerPrice.toFixed(2)}
                  </Typography>

                  {/* Offer Percentage */}
                  {product.offerPercentage && (
                    <Chip
                      label={`${product.offerPercentage}% OFF`}
                      color="success"
                      size="small"
                      sx={{ mt: 1, fontWeight: "bold" }}
                    />
                  )}

                  {/* Offer Period */}
                  {product.offerStartDate && product.offerEndDate && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      Offer: {dayjs(product.offerStartDate).format("DD MMM")} -{" "}
                      {dayjs(product.offerEndDate).format("DD MMM")}
                    </Typography>
                  )}

                  {/* Festival Badge */}
                  {isFestivalOffer && (
                    <Chip
                      label={`🎉 ${product.festivalName} Offer`}
                      size="small"
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        background:
                          "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                        color: "#fff",
                        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Typography
                  variant="h5"
                  color="success.main"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  ₹{product.price.toFixed(2)}
                </Typography>
              )}

              {/* Stock */}
              {product.stock === 0 && (
                <Chip
                  label="Out of Stock"
                  color="error"
                  size="small"
                  sx={{ mt: 1, fontWeight: "bold" }}
                />
              )}

              {/* Description */}
              <Typography variant="body1" sx={{ mt: 2 }}>
                {product.description || "No description available."}
              </Typography>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 3,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ShoppingCart size={18} />}
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                  sx={{
                    flex: 1,
                    fontWeight: "bold",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "10px",
                    minWidth: "150px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  sx={{
                    flex: 1,
                    fontWeight: "bold",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "10px",
                    minWidth: "150px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Details
                </Button>
              </Box>
            </Col>
          </Row>
        </Paper>
      </Container>
    </div>
  );
}
