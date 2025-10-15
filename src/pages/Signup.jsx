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
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      await signup({ name, email, phoneNumber, password });
      alert("Registration successful! Please login.");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
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
              Create Account
            </Typography>
            <Typography align="center" color="text.secondary" gutterBottom>
              Join us and start shopping fresh!
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
              <TextField label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth margin="normal" required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
              <Button
                variant="contained"
                color="success"
                size="large"
                type="submit"
                fullWidth
                sx={{ mt: 3, borderRadius: 3 }}
                startIcon={<PersonAddIcon />}
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}


// // src/pages/Signup.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import '../styles/AuthPages.css';

// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const { signup } = useAuth();
//   const nav = useNavigate();

//   async function handleSubmit(ev) {
//     ev.preventDefault();
//     try {
//       await signup({ name, email, phoneNumber, password });
//       alert('Registration successful! Please login.');
//       nav('/login');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Signup failed');
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
//         <h2 className="auth-title">Create Account</h2>
//         <p className="auth-subtitle">Join us and start shopping today!</p>

//         <form onSubmit={handleSubmit} className="auth-form">
//           <label>Name</label>
//           <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />

//           <label>Email</label>
//           <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required />

//           <label>Phone</label>
//           <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Your phone number" required />

//           <label>Password</label>
//           <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" required />

//           <motion.button
//             type="submit"
//             className="auth-button signup-btn"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Sign Up
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
