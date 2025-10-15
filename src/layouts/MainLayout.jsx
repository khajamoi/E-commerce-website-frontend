import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="flex-grow-1 py-4">{children}</Container>
      <Footer />
    </div>
  );
}
