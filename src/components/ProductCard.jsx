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
import dayjs from "dayjs";

export default function ProductCard({ product, onAdd }) {
  const hasOffer =
    product.offerActive &&
    product.offerPrice != null &&
    product.offerPrice < product.price;

  const isFestivalOffer = hasOffer && product.festivalName;

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
      {/* Product Image */}
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

      {/* Product Info */}
      <CardContent sx={{ textAlign: "center", flexGrow: 1, px: 2 }}>
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

        {/* Price & Offer */}
        {hasOffer ? (
          <Box>
            {/* Original Price */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                textDecoration: "line-through",
              }}
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
                sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
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
                  background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                  color: "#fff",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
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
      </CardContent>

      {/* Buttons */}
      <CardActions sx={{ display: "flex", gap: 1, p: 2, justifyContent: "center" }}>
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
            whiteSpace: "nowrap",
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
            whiteSpace: "nowrap",
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
}
//