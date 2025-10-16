import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Search,
  Menu,
  X,
  KeyRound, // ✅ Icon for Password Generator
} from "lucide-react";
import "../styles/Navbar.css";
import logo from "../assets/Arflag.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // ---------- Logout ----------
  const handleLogout = () => {
    logout();
    nav("/");
    setMenuOpen(false);
  };

  // ---------- Search ----------
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ---------- Left Section: Logo ---------- */}
      <div className="nav-left">
        <motion.div
          className="brand-wrapper"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="FruitStore Logo" className="brand-logo" />
            <span className="brand-text">FruitStore</span>
          </Link>
        </motion.div>
      </div>

      {/* ---------- Hamburger Icon (Mobile) ---------- */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
      </div>

      {/* ---------- Right Section ---------- */}
      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {/* ---------- Search Bar ---------- */}
        <form className="search-bar-right" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-right"
          />
          <button type="submit" className="search-btn-right">
            <Search className="search-icon-right" />
          </button>
        </form>

        {/* ---------- Cart ---------- */}
        <motion.div
          className="cart-icon"
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            <ShoppingCart className="icon" />
            <span className="cart-count">{items.length}</span>
          </Link>
        </motion.div>

        {/* ---------- Password Generator Link ---------- */}
        {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/password"
            className="auth-btn password-btn"
            onClick={() => setMenuOpen(false)}
          >
            <KeyRound className="icon" />
            Password Generator
          </Link>
        </motion.div> */}

        {/* ---------- Conditional Rendering for Auth ---------- */}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name || user.username}</span>

            {/* Admin Dashboard Link */}
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="admin-link"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard className="icon" />
                Dashboard
              </Link>
            )}

            {/* Logout */}
            <motion.button
              className="logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="icon" />
              Logout
            </motion.button>
          </>
        ) : (
          <>
            {/* Login */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="auth-btn login-btn"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="icon" />
                Login
              </Link>
            </motion.div>

            {/* Signup */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="auth-btn signup-btn"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus className="icon" />
                Sign up
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
}
