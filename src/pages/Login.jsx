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
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography align="center" color="text.secondary" gutterBottom>
              Please log in to continue
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
                color="success"
                size="large"
                type="submit"
                fullWidth
                sx={{ mt: 3, borderRadius: 3 }}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#388e3c", fontWeight: "bold" }}>
                  Register
                </Link>
              </Typography>
              <Typography align="center" sx={{ mt: 1 }}>
                Are you an Admin?{" "}
                <Link to="/admin/login" style={{ color: "#388e3c", fontWeight: "bold" }}>
                  Admin Login
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}


// // src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import '../styles/AuthPages.css';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const nav = useNavigate();

//   async function handleSubmit(ev) {
//     ev.preventDefault();
//     try {
//       await login(email, password);
//       nav('/');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Login failed');
//     }
//   }

//   return (
//     <div className="auth-container">
//       <motion.div
//         className="auth-box"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: 'easeOut' }}
//       >
//         <h2 className="auth-title">Welcome Back!</h2>
//         <p className="auth-subtitle">Please login to your account</p>

//         <form onSubmit={handleSubmit} className="auth-form">
//           <label>Email</label>
//           <input
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//           />
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//           />
//           <motion.button
//             type="submit"
//             className="auth-button login-btn"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Login
//           </motion.button>
//           <div className="auth-links">
//             <p>Don't have an account? <Link to="/signup">Register</Link></p>
//             <p>Or admin? <Link to="/admin/login">Admin Login</Link></p>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// // 
