// src/components/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { TextField, Button, Typography } from "@mui/material";

export default function Footer() {
  // Social media links
  const socialLinks = {
    facebook: "https://www.facebook.com/yourpage",
    instagram: "https://www.instagram.com/yourprofile",
    twitter: "https://twitter.com/yourprofile",
    linkedin: "https://www.linkedin.com/in/yourprofile",
  };

  // Custom color for FruitStore in copyright
  const fruitStoreColor = "#ff5722"; // orange/red color

  return (
    <footer className="bg-dark text-light mt-auto">
      <Container className="py-5">
        <Row className="gy-4">
          {/* Brand Info */}
          <Col md={3}>
            <div className="d-flex align-items-center mb-3">
              <img
                src="/assets/logo.png"
                alt="FruitStore"
                className="rounded-circle border border-success me-2"
                style={{ width: 48, height: 48 }}
              />
              <Typography variant="h6" className="fw-bold" sx={{ color: "#4caf50" }}>
                FruitStore 🍎
              </Typography>
            </div>
            <Typography variant="body2" color="gray">
              Delivering <span className="text-success fw-semibold">fresh fruits</span> to your
              doorstep. Shop fresh, live healthy!
            </Typography>
            <div className="d-flex gap-3 mt-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-circle bg-secondary text-white"
                style={{ display: "inline-flex" }}
              >
                <Facebook size={18} />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-circle bg-secondary text-white"
                style={{ display: "inline-flex" }}
              >
                <Instagram size={18} />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-circle bg-secondary text-white"
                style={{ display: "inline-flex" }}
              >
                <Twitter size={18} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-circle bg-secondary text-white"
                style={{ display: "inline-flex" }}
              >
                <Linkedin size={18} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3}>
            <Typography variant="h6" className="mb-3 text-white">
              Quick Links
            </Typography>
            <ul className="list-unstyled">
              {["Home", "Shop", "Cart", "Checkout", "Contact Us"].map((name, i) => (
                <li key={i} className="mb-2">
                  <a
                    href={`/${name.toLowerCase().replace(/\s/g, "")}`}
                    className="text-light text-decoration-none"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={3}>
            <Typography variant="h6" className="mb-3 text-white">
              Contact Us
            </Typography>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-start gap-2">
                <MapPin size={18} /> 123 Fresh Street, Hyderabad, India
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <Phone size={18} />
                <a href="tel:+911234567890" className="text-light text-decoration-none">
                  +91 12345 67890
                </a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} />
                <a href="mailto:support@fruitstore.com" className="text-light text-decoration-none">
                  support@fruitstore.com
                </a>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col md={3}>
            <Typography variant="h6" className="mb-3 text-white">
              Subscribe
            </Typography>
            <Typography variant="body2" color="gray" className="mb-3">
              Get exclusive offers, discounts, and updates.
            </Typography>
            <form className="d-flex flex-column gap-2">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Enter your email"
                fullWidth
                InputProps={{
                  style: { backgroundColor: "white", borderRadius: "8px" },
                }}
              />
              <Button variant="contained" color="success" className="fw-bold">
                Subscribe
              </Button>
            </form>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div className="bg-secondary text-center py-3">
        <Typography variant="body2" color="white">
          © {new Date().getFullYear()}{" "}
          <span className="fw-bold" style={{ color: fruitStoreColor }}>
            FruitStore
          </span>
          . All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}
