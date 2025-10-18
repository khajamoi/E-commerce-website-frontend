import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

export default function CartItem({ item, onUpdate, onRemove }) {
  const product = item.product;
  const hasOffer =
    product.offerActive && product.offerPrice != null && product.offerPrice < product.price;
  const isFestivalOffer = hasOffer && product.festivalName;

  // Price to display in total
  const effectivePrice = hasOffer ? product.offerPrice : product.price;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        overflow: "visible", // ensures no content hides
        mb: 2,
        p: 1.5,
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", sm: 100, md: 110 },
          height: { xs: 160, sm: 100, md: 110 },
          borderRadius: "12px",
          objectFit: "contain",
          backgroundColor: "#fafafa",
          flexShrink: 0, // prevents image from shrinking on mid screens
        }}
        image={product.imageBase64 || product.imageUrl || "/assets/fruit-placeholder.png"}
        alt={product.name}
      />

      <CardContent
        sx={{
          flex: 1,
          width: "100%",
          textAlign: { xs: "center", sm: "left" },
          minWidth: 0, // prevents content overflow pushing buttons
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {product.name}
        </Typography>

        {/* Price & Offer */}
        {hasOffer ? (
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              ₹{product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="success.main" fontWeight="bold">
              ₹{product.offerPrice.toFixed(2)}
            </Typography>

            {product.offerPercentage && (
              <Chip
                label={`${product.offerPercentage}% OFF`}
                color="success"
                size="small"
                sx={{ mt: 0.5, fontWeight: "bold" }}
              />
            )}

            {product.offerStartDate && product.offerEndDate && (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
              >
                Offer: {dayjs(product.offerStartDate).format("DD MMM")} -{" "}
                {dayjs(product.offerEndDate).format("DD MMM")}
              </Typography>
            )}

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
          <Typography variant="body1" color="success.main" fontWeight="bold">
            ₹{product.price.toFixed(2)}
          </Typography>
        )}
      </CardContent>

      <Divider
        sx={{
          display: { xs: "block", sm: "none" },
          width: "100%",
          my: 1,
        }}
      />

      {/* Updated Button Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
          gap: 1,
          flexWrap: "nowrap",
          flexShrink: 0, // prevents buttons from collapsing at mid widths
        }}
      >
        {/* Decrease Quantity */}
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() => onUpdate(product.id, Math.max(1, item.qty - 1))}
          sx={{
            minWidth: "36px",
            height: "36px",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: 0,
          }}
        >
          <Remove fontSize="small" />
        </Button>

        {/* Quantity Display */}
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ minWidth: "24px", textAlign: "center" }}
        >
          {item.qty}
        </Typography>

        {/* Increase Quantity */}
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() => onUpdate(product.id, item.qty + 1)}
          sx={{
            minWidth: "36px",
            height: "36px",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: 0,
          }}
        >
          <Add fontSize="small" />
        </Button>

        {/* Remove Item */}
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onRemove(product.id)}
          sx={{
            minWidth: "40px",
            height: "36px",
            fontWeight: "bold",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            flexShrink: 0, // ensures button stays visible on mid-screens
          }}
        >
          <Delete fontSize="small" />
        </Button>
      </Box>
    </Card>
  );
}
//