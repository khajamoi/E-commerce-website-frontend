import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginStepOne, verifyOtp } = useAuth();
  const nav = useNavigate();

  // Step 1: Login + send OTP
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginStepOne(email, password);
      alert("✅ OTP sent to your registered admin email.");
      setOtpStep(true);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Invalid credentials or unauthorized admin.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp(email, otp);
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        alert("⛔ Access denied. Not authorized as admin.");
        return;
      }
      alert("🎉 Welcome back, Admin!");
      nav("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    try {
      await loginStepOne(email, password);
      alert("🔁 New OTP sent to your email.");
    } catch {
      alert("Failed to resend OTP. Please check your credentials.");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
              {otpStep ? "Admin OTP Verification" : "Admin Portal Login"}
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
              {otpStep
                ? "A secure 6-digit OTP has been sent to your registered admin email."
                : "Authorized access for Admins & Managers only. Please log in securely."}
            </Typography>

            {!otpStep ? (
              <form onSubmit={handleLogin}>
                <TextField
                  label="Admin Email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  size="large"
                  sx={{ mt: 3, borderRadius: 3 }}
                  type="submit"
                  startIcon={<SecurityIcon />}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                {/*  */}
              </form>
            ) : (
              <form onSubmit={handleOtp}>
                <TextField
                  label="Enter OTP"
                  type="text"
                  fullWidth
                  required
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    type="submit"
                    sx={{ borderRadius: 3 }}
                    startIcon={<SecurityIcon />}
                  >
                    Verify & Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleResendOtp}
                    startIcon={<RestartAltIcon />}
                    sx={{ borderRadius: 3 }}
                  >
                    Resend OTP
                  </Button>
                </Stack>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
