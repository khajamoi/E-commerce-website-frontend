import React from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Chip } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.imageBase64 || "/assets/fruit-placeholder.png"}
          alt={product.name}
        />
      </Link>

      <CardContent>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography variant="h5" color="success.main" fontWeight="bold">
          ₹{product.price.toFixed(2)}
        </Typography>
        {product.stock === 0 && (
          <Chip label="Out of Stock" color="error" size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>

      <CardActions sx={{ display: "flex", gap: 1, p: 2 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<ShoppingCart size={18} />}
          onClick={() => onAdd(product)}
          disabled={product.stock === 0}
          sx={{ fontWeight: "bold" }}
        >
          Add to Cart
        </Button>
        <Button
          component={Link}
          to={`/products/${product.id}`}
          variant="outlined"
          color="success"
          fullWidth
          sx={{ fontWeight: "bold" }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}
