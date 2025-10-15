import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const GradientTableCell = styled(TableCell)({
  background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
});

const HoverTableRow = styled(TableRow)({
  transition: "transform 0.15s, box-shadow 0.15s",
  "&:hover": {
    transform: "scale(1.01)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
});

const statusColors = {
  PENDING: "warning",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "error",
  PAID: "success",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

useEffect(() => {
  api.get("/orders/admin")
    .then((res) => {
      console.log("Orders fetched:", res.data); // <--- add this
      setOrders(res.data || []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load orders", err);
      setOrders([]);
      setLoading(false);
    });
}, []);


  const toggleRow = (orderId) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ textAlign: "center" }}>
        Manage Orders
      </Typography>

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <GradientTableCell />
              <GradientTableCell>Order ID</GradientTableCell>
              <GradientTableCell>User</GradientTableCell>
              <GradientTableCell>Email</GradientTableCell>
              <GradientTableCell>Payment ID</GradientTableCell>
              <GradientTableCell>Total (₹)</GradientTableCell>
              <GradientTableCell>Status</GradientTableCell>
              <GradientTableCell>Created At</GradientTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <HoverTableRow>
                  <TableCell align="center">
                    <IconButton onClick={() => toggleRow(order.id)}>
                      {expandedRow === order.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>

                  <TableCell align="center">{order.id}</TableCell>
                  <TableCell align="center">{order.userName || "-"}</TableCell>
                  <TableCell align="center">{order.userEmail || "-"}</TableCell>
                  <TableCell align="center">{order.razorpayPaymentId || "-"}</TableCell>
                  <TableCell align="center">{Number(order.total).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip label={order.status} color={statusColors[order.status] || "default"} />
                  </TableCell>
                  <TableCell align="center">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</TableCell>
                </HoverTableRow>

                <TableRow>
                  <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRow === order.id} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="h6" gutterBottom>Order Items</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center"><b>Product ID</b></TableCell>
                              <TableCell align="center"><b>Product Name</b></TableCell>
                              <TableCell align="center"><b>Price (₹)</b></TableCell>
                              <TableCell align="center"><b>Quantity</b></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
  {order.items && order.items.length > 0 ? (
    order.items.map((item) => (
      <TableRow key={item.id}>
        <TableCell align="center">{item.productId ?? "-"}</TableCell>
        <TableCell align="center">{item.productName ?? "-"}</TableCell>
        <TableCell align="center">{Number(item.price).toFixed(2)}</TableCell>
        <TableCell align="center">{item.quantity}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell align="center" colSpan={4}>No items found</TableCell>
    </TableRow>
  )}
</TableBody>

                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
