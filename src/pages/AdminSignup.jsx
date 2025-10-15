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
  MenuItem,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AdminSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const { adminSignup } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      await adminSignup({ name, email, phoneNumber, password, role });
      alert("Admin registered successfully! Please login.");
      nav("/admin/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Admin signup failed");
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
              Admin Registration
            </Typography>
            <Typography align="center" color="text.secondary" gutterBottom>
              Register as an Admin or Manager securely
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
              <TextField label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth margin="normal" required />
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
              </TextField>
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />

              <Button
                variant="contained"
                color="warning"
                size="large"
                type="submit"
                fullWidth
                sx={{ mt: 3, borderRadius: 3 }}
                startIcon={<AdminPanelSettingsIcon />}
              >
                Register Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}



// // src/pages/AdminSignup.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import '../styles/AuthPages.css';

// export default function AdminSignup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('ADMIN');
//   const { adminSignup } = useAuth();
//   const nav = useNavigate();

//   async function handleSubmit(ev) {
//     ev.preventDefault();
//     try {
//       await adminSignup({ name, email, phoneNumber, password, role });
//       alert('Admin registered successfully! Please login.');
//       nav('/admin/login');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Admin signup failed');
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
//         <h2 className="auth-title">Admin Registration</h2>
//         <p className="auth-subtitle">Securely register as an Admin or Manager</p>

//         <form onSubmit={handleSubmit} className="auth-form">
//           <label>Name</label>
//           <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />

//           <label>Email</label>
//           <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" required />

//           <label>Phone</label>
//           <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone number" required />

//           <label>Role</label>
//           <select value={role} onChange={e => setRole(e.target.value)} className="role-dropdown">
//             <option>ADMIN</option>
//             <option>MANAGER</option>
//           </select>

//           <label>Password</label>
//           <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Set password" required />

//           <motion.button
//             type="submit"
//             className="auth-button admin-btn"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Register Admin
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
