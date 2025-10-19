// // src/pages/OtpVerify.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";

// export default function OtpVerify() {
//   const { verifyOtp, pendingOtpEmail } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");

//   useEffect(() => {
//     // prefer passed state email, else pending from context
//     const stateEmail = location.state?.email;
//     if (stateEmail) setEmail(stateEmail);
//     else if (pendingOtpEmail) setEmail(pendingOtpEmail);
//   }, [location.state, pendingOtpEmail]);

//   async function handleSubmit(ev) {
//     ev.preventDefault();
//     try {
//       const user = await verifyOtp(email, code);
//       // redirect based on role
//       if (user.role === "ADMIN" || user.role === "MANAGER") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || err.message || "OTP verification failed");
//     }
//   }

//   async function resendOtp() {
//     try {
//       // call login endpoint again to re-send OTP (but don't supply password here)
//       // We'll call /auth/login - must provide password: We'll instead add a resend endpoint or call login flow;
//       // Simpler: ask user to login again. Provide message.
//       alert("To resend OTP, please go back and login again.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to resend OTP");
//     }
//   }

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
//       <Card sx={{ width: 420 }}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography variant="h5" align="center" gutterBottom>Verify OTP</Typography>
//           <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
//             Enter the one-time code sent to your email.
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
//             <TextField label="OTP" value={code} onChange={(e) => setCode(e.target.value)} fullWidth margin="normal" required />
//             <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Verify & Login</Button>
//           </form>
//           <Typography align="center" sx={{ mt: 2 }}>
//             Didn't receive? <Link to="/login">Login again</Link> or <Button onClick={resendOtp} size="small">Resend</Button>
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
