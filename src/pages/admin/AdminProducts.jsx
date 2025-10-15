import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function startAdd() {
    setEditing(null);
    setForm({ name: '', price: '', stock: '', description: '' });
    setFile(null);
    setOpenForm(true);
  }

  function startEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setFile(null);
    setOpenForm(true);
  }

  function resetForm() {
    setEditing(null);
    setFile(null);
    setOpenForm(false);
    setForm({ name: '', price: '', stock: '', description: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(form)], { type: 'application/json' }));
    if (file) formData.append('image', file);

    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Manage Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={startAdd}
        sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}
      >
        + Add Product
      </Button>

      {/* Product Form Dialog */}
      <Dialog open={openForm} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editing ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '8px',
                borderRadius: '4px',
                borderColor: '#c4c4c4',
                fontSize: '16px',
              }}
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ marginTop: '16px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="product table">
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price (₹)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p, index) => (
              <TableRow
                key={p.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                  '&:hover': { backgroundColor: '#e3f2fd', transform: 'scale(1.01)', transition: '0.2s' },
                }}
              >
                <TableCell>
                  <Avatar
                    src={p.imageBase64 ? `data:image/png;base64,${p.imageBase64}` : '/assets/fruit-placeholder.png'}
                    alt={p.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{p.price.toFixed(2)}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{p.stock}</TableCell>
                <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.description}
                </TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" onClick={() => startEdit(p)} sx={{ mr: 1, borderRadius: 2 }}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(p.id)} sx={{ borderRadius: 2 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
