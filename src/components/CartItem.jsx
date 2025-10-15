import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        p: 1,
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        sx={{
          width: 90,
          height: 90,
          borderRadius: "12px",
          objectFit: "cover",
          ml: 1,
        }}
        image={
          item.product.imageBase64 || // ✅ FIXED: Show Base64 image
          item.product.imageUrl || // fallback if available
          "/assets/fruit-placeholder.png"
        }
        alt={item.product.name}
      />

      <CardContent sx={{ flex: "1", ml: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {item.product.name}
        </Typography>
        <Typography variant="body1" color="success.main" fontWeight="bold">
          ₹{item.product.price.toFixed(2)}
        </Typography>
      </CardContent>

      {/* Quantity Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          color="success"
          size="small"
          onClick={() =>
            onUpdate(item.product.id, Math.max(1, item.qty - 1))
          }
        >
          <Remove />
        </IconButton>

        <Typography variant="body1" fontWeight="bold">
          {item.qty}
        </Typography>

        <IconButton
          color="success"
          size="small"
          onClick={() => onUpdate(item.product.id, item.qty + 1)}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Remove */}
      <IconButton color="error" onClick={() => onRemove(item.product.id)}>
        <Delete />
      </IconButton>
    </Card>
  );
}
