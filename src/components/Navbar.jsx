import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import "../styles/Navbar.css";
import logo from "../assets/HSKAMind.jpeg";
import api from "../api/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const categoryRef = useRef(null);

  // ✅ Fetch categories once
  useEffect(() => {
    api
      .get("/products/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // ✅ Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setShowCategories(false);
    } else {
      setShowCategories((prev) => !prev);
    }
  };

  // ✅ Category selection
  const handleCategorySelect = (category) => {
    nav(`/products?category=${encodeURIComponent(category)}`);
    setShowCategories(false);
    setMenuOpen(false);
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
            <img src={logo} alt="HSKAMinds Logo" className="brand-logo" />
            <span className="brand-text">HSKAMinds Technology</span>
          </Link>
        </motion.div>
      </div>

      {/* ---------- Mobile Menu Icon with Notification Dot ---------- */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="menu-wrapper">
          {menuOpen ? (
            <X size={28} color="#fff" />
          ) : (
            <Menu size={28} color="#fff" />
          )}
          {/* 🔴 Notification Dot when items are in the cart */}
          {items.length > 0 && !menuOpen && (
            <span className="menu-notification-dot"></span>
          )}
        </div>
      </div>

      {/* ---------- Right Section ---------- */}
      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {/* ---------- Search ---------- */}
        <div className="search-container" ref={categoryRef}>
          <form className="search-bar-right" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Click 🔍 for categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-right"
            />
            <button type="submit" className="search-btn-right">
              <Search className="search-icon-right" />
            </button>
          </form>

          {showCategories && (
            <motion.ul
              className="category-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="category-item"
                >
                  {category}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* ---------- Cart ---------- */}
        <motion.div
          className="cart-icon"
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/cart"
            className="cart-link"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingCart className="icon" />
            <span className="cart-count">{items.length}</span>
          </Link>
        </motion.div>

        {/* ---------- Auth / Dashboard ---------- */}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name || user.username}</span>
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
            <motion.button
              className="logout-btn"
              onClick={logout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="icon" />
              Logout
            </motion.button>
          </>
        ) : (
          <>
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
