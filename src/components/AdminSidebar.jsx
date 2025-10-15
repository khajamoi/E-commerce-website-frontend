import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Home, Package, Users, Settings, FileText, ClipboardList, Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div style={{ width: 240, padding: "1rem" }}>
      <Typography variant="h6" gutterBottom>
        Admin Panel
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin">
            <Home style={{ marginRight: 8 }} />
            <ListItemText primary="Overview" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/products">
            <Package style={{ marginRight: 8 }} />
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/orders">
            <ClipboardList style={{ marginRight: 8 }} />
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/reports">
            <FileText style={{ marginRight: 8 }} />
            <ListItemText primary="Medical Reports" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/users">
            <Users style={{ marginRight: 8 }} />
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/settings">
            <Settings style={{ marginRight: 8 }} />
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar for Desktop */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="bg-light border-end d-none d-md-block"
          style={{ minHeight: "100vh" }}
        >
          {sidebar}
        </Col>

        {/* Sidebar for Mobile (Drawer) */}
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sidebar}
        </Drawer>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="p-4">
          {/* Menu Button (only on small screens) */}
          <div className="d-md-none mb-3">
            <IconButton onClick={() => setMobileOpen(true)}>
              <Menu />
            </IconButton>
          </div>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
