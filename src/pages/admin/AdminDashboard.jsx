import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Package, ClipboardList, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Products", desc: "Manage your inventory", icon: <Package />, link: "/admin/products" },
    { title: "Orders", desc: "Track customer orders", icon: <ClipboardList />, link: "/admin/orders" },
    { title: "Reports", desc: "View medical reports", icon: <FileText />, link: "/admin/reports" },
    { title: "Users", desc: "Manage users & roles", icon: <Users />, link: "/admin/users" },
  ];

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, Admin 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your products, orders, users, and reports all in one place.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Card
                onClick={() => navigate(card.link)}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  p: 1,
                  borderRadius: 3,
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6, bgcolor: "grey.100" },
                }}
              >
                <CardContent>
                  <div style={{ fontSize: "2rem", color: "#1976d2", marginBottom: "10px" }}>
                    {card.icon}
                  </div>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
