import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout"; // <-- contains Navbar & Footer
import AdminLayout from "./layouts/AdminLayout"; // <-- only admin sidebar

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import AdminMedicalReports from "./pages/admin/AdminMedicalReports";

import { useAuth, AuthProvider } from "./context/AuthContext";

import CheckoutAddress from "./pages/CheckoutAddress";
import Payment from "./pages/Payment";
import UserPayment from "./pages/UserPayment";
// import Password from "./pages/password";
import Password from "./pages/Password";

function AppWrapper() {
  const { user } = useAuth();
  const userId = user?.id || null;

  return (
    <CartProvider userId={userId}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/UserPayment" element={<UserPayment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
}
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === "ADMIN" ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ---------- Public Pages (With Navbar + Footer) ---------- */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />


                <Route
                  path="/checkout/address"
                  element={
                    <PrivateRoute>
                      <CheckoutAddress />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/checkout/payment"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/checkout/UserPayment"
                  element={
                    <PrivateRoute>
                      <UserPayment />
                    </PrivateRoute>
                  }
                />
              <Route path="/password" element={<Password />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </Layout>
          }
        />

        {/* ---------- Admin Pages (NO Navbar + Footer) ---------- */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/products" element={<AdminProducts />} />
                  <Route path="/orders" element={<AdminOrders />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/reports" element={<AdminMedicalReports />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ---------- Admin Auth (Separate pages) ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
      </Routes>
    </AuthProvider>
  );
}
/////////