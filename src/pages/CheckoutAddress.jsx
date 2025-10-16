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
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

export default function CheckoutAddress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [], total = 0 } = location.state || {};

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

  /** Load saved addresses */
  useEffect(() => {
    if (!user) return;
    api
      .get(`/addresses/user/${user.id}`)
      .then((res) => {
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.isDefault);
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
      alert("✅ Address added successfully!");
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
    navigate("/Checkout", {
      state: { addressId: selectedId, items, total },
    });
  }

  return (
    <Container fluid className="py-5" style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{
          color: "#2E7D32",
          textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
          mb: 4,
        }}
      >
        🏡 Delivery Address
      </Typography>

      <Row className="gy-4">
        {/* LEFT SECTION */}
        <Col xs={12} lg={8}>
          {/* SAVED ADDRESSES */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              mb: 4,
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              background: "#fff",
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
                      borderRadius: "12px",
                      border:
                        selectedId === addr.id
                          ? "2px solid #4caf50"
                          : "1px solid #ddd",
                      backgroundColor:
                        selectedId === addr.id ? "#E8F5E9" : "#fff",
                      cursor: "pointer",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
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
                          {addr.landmark && (
                            <Typography variant="body2" color="text.secondary">
                              📍 Landmark: {addr.landmark}
                            </Typography>
                          )}
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

          {/* ADD NEW ADDRESS */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              background: "#fff",
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
              <Row className="gy-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
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
                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          country: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Landmark</Form.Label>
                    <Form.Control
                      placeholder="Nearby landmark (optional)"
                      value={newAddress.landmark}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          landmark: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      value={newAddress.phoneNumber}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          phoneNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Address Type</Form.Label>
                    <Form.Select
                      value={newAddress.addressType}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressType: e.target.value,
                        })
                      }
                    >
                      <option value="HOME">Home</option>
                      <option value="WORK">Work</option>
                      <option value="OTHER">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    label="Set as default"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                </Col>

                <Col xs={12}>
                  <Tooltip title="Save address to your account">
                    <Button
                      type="submit"
                      className="w-100 mt-2"
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
                </Col>
              </Row>
            </Form>
          </Paper>
        </Col>

        {/* RIGHT SECTION */}
        <Col xs={12} lg={4}>
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              background: "#fff",
              position: "sticky",
              top: "90px",
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
            <Divider className="mb-2" />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Total Items: {items.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Price: ₹{total.toFixed(2)}
            </Typography>
            <Button
              variant="success"
              size="lg"
              className="w-100 mt-4"
              style={{
                padding: "14px",
                fontWeight: "600",
                fontSize: "1rem",
                borderRadius: "12px",
              }}
              onClick={handleProceed}
            >
              Proceed to Payment →
            </Button>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
}
