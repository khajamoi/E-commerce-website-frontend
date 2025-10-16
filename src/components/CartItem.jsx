import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        p: 1.5,
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", sm: 90 },
          height: { xs: 160, sm: 90 },
          borderRadius: "12px",
          objectFit: "cover",
        }}
        image={
          item.product.imageBase64 ||
          item.product.imageUrl ||
          "/assets/fruit-placeholder.png"
        }
        alt={item.product.name}
      />

      <CardContent
        sx={{
          flex: 1,
          width: "100%",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {item.product.name}
        </Typography>
        <Typography
          variant="body1"
          color="success.main"
          fontWeight="bold"
          sx={{ mb: { xs: 1, sm: 0 } }}
        >
          ₹{item.product.price.toFixed(2)}
        </Typography>
      </CardContent>

      <Divider
        sx={{
          display: { xs: "block", sm: "none" },
          width: "100%",
          my: 1,
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
          gap: 1.5,
        }}
      >
        <IconButton
          color="success"
          size="small"
          onClick={() => onUpdate(item.product.id, Math.max(1, item.qty - 1))}
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

        <IconButton color="error" onClick={() => onRemove(item.product.id)}>
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
}
