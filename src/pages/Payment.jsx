// src/pages/CheckoutAddress.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import {
  Typography,
  Paper,
  Divider,
  Radio,
  FormControlLabel,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

export default function CheckoutAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
    phoneNumber: "",
    addressType: "HOME",
    isDefault: false,
  });

  const navigate = useNavigate();

  /** Load saved addresses */
  useEffect(() => {
    if (!user) return;
    api
      .get(`/addresses/user/${user.id}`)
      .then((res) => {
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.isDefault === true);
        if (defaultAddr) setSelectedId(defaultAddr.id);
      })
      .catch(() => setAddresses([]));
  }, [user]);

  /** Add new address */
  async function handleAddAddress(e) {
    e.preventDefault();
    try {
      const res = await api.post(`/addresses/user/${user.id}/add`, newAddress);
      setAddresses((prev) => [...prev, res.data]);
      if (res.data.isDefault) setSelectedId(res.data.id);

      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        landmark: "",
        phoneNumber: "",
        addressType: "HOME",
        isDefault: false,
      });

      alert("✅ Address added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add address");
    }
  }

  /** Proceed to payment */
  function handleProceed() {
    if (!selectedId) {
      alert("⚠️ Please select an address to proceed");
      return;
    }
    navigate("/checkout/payment", { state: { addressId: selectedId } });
  }

  return (
    <Container className="py-5">
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 4,
          color: "#2E7D32",
          textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        🏡 Delivery Address
      </Typography>

      <Row>
        {/* LEFT COLUMN */}
        <Col md={8}>
          {/* SAVED ADDRESSES */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              mb: 4,
              background: "#f9f9f9",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Saved Addresses
            </Typography>
            <Divider className="mb-3" />
            {addresses.length === 0 ? (
              <Typography color="text.secondary">
                No saved addresses. Please add one below.
              </Typography>
            ) : (
              <RadioGroup
                value={selectedId}
                onChange={(e) => setSelectedId(Number(e.target.value))}
              >
                {addresses.map((addr) => (
                  <Paper
                    key={addr.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: "14px",
                      border:
                        selectedId === addr.id
                          ? "2px solid #4caf50"
                          : "1px solid #ddd",
                      backgroundColor: selectedId === addr.id ? "#E8F5E9" : "#fff",
                      cursor: "pointer",
                      transition: "0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setSelectedId(addr.id)}
                  >
                    <FormControlLabel
                      value={addr.id}
                      control={<Radio />}
                      label={
                        <div>
                          <Typography fontWeight="bold" variant="body1">
                            {addr.addressType === "HOME" && (
                              <HomeIcon sx={{ color: "#388e3c", mr: 1 }} />
                            )}
                            {addr.addressType === "WORK" && (
                              <WorkIcon sx={{ color: "#1976d2", mr: 1 }} />
                            )}
                            {addr.addressType === "OTHER" && (
                              <LocationOnIcon sx={{ color: "#f57c00", mr: 1 }} />
                            )}
                            {addr.addressType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            {addr.postalCode}, {addr.country}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, fontWeight: "500" }}
                          >
                            📞 {addr.phoneNumber}
                          </Typography>
                          {addr.isDefault && (
                            <span className="badge bg-success mt-2">Default</span>
                          )}
                        </div>
                      }
                    />
                  </Paper>
                ))}
              </RadioGroup>
            )}
          </Paper>

          {/* ADD NEW ADDRESS FORM */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              background: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#1976d2" }}
            >
              <AddLocationAltIcon sx={{ mr: 1 }} />
              Add New Address
            </Typography>
            <Divider className="mb-3" />

            <Form onSubmit={handleAddAddress}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      placeholder="Enter street address"
                      className="custom-input"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      placeholder="Enter city"
                      className="custom-input"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      placeholder="Enter state"
                      className="custom-input"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      placeholder="Enter postal code"
                      className="custom-input"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      placeholder="Enter country"
                      className="custom-input"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Landmark</Form.Label>
                <Form.Control
                  placeholder="Nearby landmark (optional)"
                  className="custom-input"
                  value={newAddress.landmark}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, landmark: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  placeholder="Contact phone number"
                  className="custom-input"
                  value={newAddress.phoneNumber}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phoneNumber: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Check
                type="checkbox"
                label="Set as default address"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
              />

              <Tooltip title="Save address to your account">
                <Button
                  type="submit"
                  className="mt-3 w-100"
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    backgroundColor: "#1976d2",
                    border: "none",
                    fontSize: "1rem",
                  }}
                >
                  + Add Address
                </Button>
              </Tooltip>
            </Form>
          </Paper>
        </Col>

        {/* RIGHT COLUMN */}
        <Col md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              background: "#fdfdfd",
              position: "sticky",
              top: "20px",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#333" }}
            >
              Delivery Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a delivery address to continue to payment.
            </Typography>
            <Button
              variant="success"
              size="lg"
              className="mt-4 w-100"
              style={{
                padding: "14px",
                fontWeight: "600",
                fontSize: "1rem",
                borderRadius: "14px",
              }}
              onClick={handleProceed}
            >
              Proceed to Payment →
            </Button>
          </Paper>
        </Col>
      </Row>

      {/* Custom Styles for Input Focus */}
      <style jsx="true">{`
        .custom-input {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          transition: all 0.3s ease;
          box-shadow: none;
        }

        .custom-input:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 8px rgba(25, 118, 210, 0.6);
        }
      `}</style>
    </Container>
  );
}
