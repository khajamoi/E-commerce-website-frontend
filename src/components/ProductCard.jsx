// src/components/ProductCard.jsx
import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      {/*  Product Image */}
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.imageBase64 || "/assets/fruit-placeholder.png"}
          alt={product.name}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />
      </Link>

      {/*  Name and Price */}
      <CardContent
        sx={{
          textAlign: "center",
          flexGrow: 1,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="h5"
          color="success.main"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.3rem" },
            mt: 1,
          }}
        >
          ₹{product.price.toFixed(2)}
        </Typography>

        {product.stock === 0 && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{ mt: 1, fontWeight: "bold" }}
          />
        )}
      </CardContent>

      {/*  Buttons (Equal width & responsive) */}
     <CardActions
  sx={{
    display: "flex",
    gap: 1,
    p: 2,
    justifyContent: "center",
  }}
>
  <Button
    variant="contained"
    color="success"
    startIcon={<ShoppingCart size={18} />}
    onClick={() => onAdd(product)}
    disabled={product.stock === 0}
    sx={{
      flex: 1,
      fontWeight: "bold",
      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      py: 1,
      textTransform: "none",
      borderRadius: "10px",
      minWidth: "120px",
      whiteSpace: "nowrap", // Prevent text from wrapping
    }}
  >
    Add to Cart
  </Button>

  <Button
    component={Link}
    to={`/products/${product.id}`}
    variant="outlined"
    color="success"
    sx={{
      flex: 1,
      fontWeight: "bold",
      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      py: 1,
      textTransform: "none",
      borderRadius: "10px",
      minWidth: "120px",
      whiteSpace: "nowrap", // Prevent text from wrapping
    }}
  >
    Details
  </Button>
</CardActions>

    </Card>
  );
}
//