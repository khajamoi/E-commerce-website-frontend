// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        alert("Not authorized as admin.");
        return;
      }
      nav("/admin"); // ✅ This will keep you at /admin even after refresh
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Admin login failed");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
              Admin Portal
            </Typography>
            <Typography align="center" color="text.secondary" gutterBottom>
              Secure Login for Admins & Managers
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="warning"
                size="large"
                type="submit"
                fullWidth
                sx={{ mt: 3, borderRadius: 3 }}
                startIcon={<SecurityIcon />}
              >
                Admin Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
