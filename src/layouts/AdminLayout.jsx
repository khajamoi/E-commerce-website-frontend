import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  CssBaseline,
  Button,
  useTheme,
} from "@mui/material";
import {
  Menu,
  Home,
  Package,
  ClipboardList,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // or clear auth context if you use AuthProvider
    navigate("/admin/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/admin" },
    { text: "Products", icon: <Package />, path: "/admin/products" },
    { text: "Orders", icon: <ClipboardList />, path: "/admin/orders" },
    { text: "Reports", icon: <FileText />, path: "/admin/reports" },
    { text: "Users", icon: <Users />, path: "/admin/users" },
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: theme.palette.mode === "light" ? "#1e293b" : "#0f172a", // Beautiful dark navy sidebar
        color: "white",
      }}
    >
      {/* Sidebar Header */}
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
          textAlign: "center",
          bgcolor: "rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Admin Panel
      </Typography>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Divider + Logout Button */}
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          color="error"
          startIcon={<LogOut />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer (Mobile + Desktop) */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        {/* Mobile Menu Button (only visible on small screens) */}
        <Box sx={{ display: { md: "none" }, mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(true)} color="primary">
            <Menu />
          </IconButton>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
