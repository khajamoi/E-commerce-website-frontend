import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Typography, Snackbar, Alert, Slide, Divider, Box } from "@mui/material";
import { motion } from "framer-motion";

function SlideDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    api
      .get("/products")
      .then((res) => {
        if (!mounted) return;

        const formatted = res.data.map((p) => {
          // ✅ Fix image handling completely
          let imageSrc = "/assets/fruit-placeholder.png";

          if (p.image) {
            if (p.image.startsWith("data:")) {
              imageSrc = p.image; // already base64
            } else if (p.image.startsWith("http")) {
              imageSrc = p.image; // full URL
            } else if (p.image.length > 100) {
              // long base64 without prefix
              imageSrc = `data:image/jpeg;base64,${p.image}`;
            } else {
              // probably a filename or relative path
              imageSrc = `${process.env.REACT_APP_API_URL || ""}/uploads/${p.image}`;
            }
          } else if (p.image_url) {
            imageSrc = p.image_url;
          } else if (p.imageBase64) {
            imageSrc = p.imageBase64;
          }

          return {
            id: p.id,
            name: p.name,
            category: p.category || "Uncategorized",
            description: p.description,
            imageBase64: imageSrc,
            price: p.price,
            stock: p.stock,
            offerActive:
              p.offer_active !== undefined
                ? p.offer_active
                : p.offerPrice != null && p.offerPrice < p.price,
            offerPrice: p.offer_price ?? p.offerPrice,
            offerPercentage: p.offer_percentage ?? p.offerPercentage,
            offerStartDate: p.offer_start_date ?? p.offerStartDate,
            offerEndDate: p.offer_end_date ?? p.offerEndDate,
            festivalName: p.festival_name ?? p.festivalName,
          };
        });

        setProducts(formatted);
      })
      .catch(() => {
        // fallback for testing
        setProducts([
          {
            id: 1,
            name: "Apple",
            price: 80,
            stock: 5,
            imageBase64: "/assets/apple.jpg",
            category: "Fruits",
          },
          {
            id: 2,
            name: "Banana",
            price: 40,
            stock: 10,
            imageBase64: "/assets/banana.jpg",
            category: "Fruits",
          },
        ]);
      })
      .finally(() => setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setSnackbarMsg(`${product.name} added to cart 🛒`);
    setSnackbarOpen(true);
  };

  const groupedByCategory = products.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f7fff7, #e8f5e9)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h3"
            className="text-center fw-bold mb-5"
            sx={{
              color: "#1b5e20",
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            🛒 Shop Smart, Save Big — Fresh Deals Await You!
          </Typography>
        </motion.div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          Object.keys(groupedByCategory).map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  mt: index === 0 ? 0 : 5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 40,
                    bgcolor: "success.main",
                    borderRadius: "5px",
                    mr: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#1b5e20",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {category}
                </Typography>
              </Box>

              <Row className="g-4 mb-4">
                {groupedByCategory[category].map((p) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={p.id}>
                    <ProductCard product={p} onAdd={handleAddToCart} />
                  </Col>
                ))}
              </Row>

              {index < Object.keys(groupedByCategory).length - 1 && (
                <Divider sx={{ my: 4 }} />
              )}
            </motion.div>
          ))
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
            bgcolor: "#ffffff",
            color: "#2e7d32",
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
