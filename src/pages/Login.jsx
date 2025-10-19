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




// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Stack,
// } from "@mui/material";
// import LoginIcon from "@mui/icons-material/Login";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpStep, setOtpStep] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { loginStepOne, verifyOtp } = useAuth();
//   const nav = useNavigate();

//   async function handleLogin(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await loginStepOne(email, password);
//       alert("✅ OTP sent to your email! Please check your inbox.");
//       setOtpStep(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "❌ Invalid credentials or user not found.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleOtp(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await verifyOtp(email, otp);
//       alert("🎉 Login successful!");
//       nav("/");
//     } catch (err) {
//       alert(err.response?.data?.message || "❌ Invalid or expired OTP.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleResendOtp() {
//     try {
//       await loginStepOne(email, password);
//       alert("🔁 New OTP sent to your email!");
//     } catch {
//       alert("Failed to resend OTP. Please check your credentials.");
//     }
//   }

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
//       <motion.div
//         initial={{ opacity: 0, y: -40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         style={{ width: "100%", maxWidth: 400 }}
//       >
//         <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
//           <CardContent sx={{ p: 4 }}>
//             <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
//               {otpStep ? "Verify OTP" : "Welcome Back"}
//             </Typography>
//             <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
//               {otpStep
//                 ? "We’ve sent a 6-digit OTP to your registered email. Enter it below to verify your login."
//                 : "Login securely with your email and password. New here? Register below!"}
//             </Typography>

//             {!otpStep ? (
//               <form onSubmit={handleLogin}>
//                 <TextField
//                   label="Email"
//                   type="email"
//                   fullWidth
//                   required
//                   margin="normal"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <TextField
//                   label="Password"
//                   type="password"
//                   fullWidth
//                   required
//                   margin="normal"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Button
//                   variant="contained"
//                   color="success"
//                   fullWidth
//                   size="large"
//                   sx={{ mt: 3, borderRadius: 3 }}
//                   type="submit"
//                   startIcon={<LoginIcon />}
//                   disabled={loading}
//                 >
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </Button>

//                 <Typography align="center" sx={{ mt: 3 }}>
//                   New user?{" "}
//                   <Link to="/signup" style={{ textDecoration: "none", fontWeight: "bold", color: "#2e7d32" }}>
//                     Create an account
//                   </Link>
//                 </Typography>
//               </form>
//             ) : (
//               <form onSubmit={handleOtp}>
//                 <TextField
//                   label="Enter OTP"
//                   type="text"
//                   fullWidth
//                   required
//                   margin="normal"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                 />
//                 <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     fullWidth
//                     type="submit"
//                     sx={{ borderRadius: 3 }}
//                   >
//                     Verify & Login
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     fullWidth
//                     onClick={handleResendOtp}
//                     startIcon={<RestartAltIcon />}
//                     sx={{ borderRadius: 3 }}
//                   >
//                     Resend OTP
//                   </Button>
//                 </Stack>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </Box>
//   );
// }
// ////