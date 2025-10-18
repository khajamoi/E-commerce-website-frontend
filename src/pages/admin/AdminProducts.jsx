import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../../api/api';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Checkbox, FormControlLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', stock: '', description: '', category: '',
    offerPercentage: '', offerStartDate: null, offerEndDate: null,
    festivalOffer: false, festivalName: '',
  });
  const [file, setFile] = useState(null);
  const [previewEffectivePrice, setPreviewEffectivePrice] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      // assuming api baseURL is '/api'
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;
    setForm(prev => {
      const next = { ...prev, [name]: v };
      computePreviewEffective(next);
      return next;
    });
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function startAdd() {
    setEditing(null);
    const initial = {
      name: '', price: '', stock: '', description: '', category: '',
      offerPercentage: '', offerStartDate: null, offerEndDate: null,
      festivalOffer: false, festivalName: '',
    };
    setForm(initial);
    setFile(null);
    setPreviewEffectivePrice(null);
    setOpenForm(true);
  }

  function startEdit(p) {
    setEditing(p.id);
    setForm({
      name: p.name || '',
      price: p.price != null ? p.price.toString() : '',
      stock: p.stock != null ? p.stock.toString() : '',
      description: p.description || '',
      category: p.category || '',
      offerPercentage: p.offerPercentage != null ? p.offerPercentage.toString() : '',
      offerStartDate: p.offerStartDate ? dayjs(p.offerStartDate) : null,
      offerEndDate: p.offerEndDate ? dayjs(p.offerEndDate) : null,
      festivalOffer: !!p.festivalOffer,
      festivalName: p.festivalName || '',
    });
    setFile(null);
    // compute preview from server-sent offerPrice (if present) or from price/offerPercentage
    if (p.offerPrice != null) {
      setPreviewEffectivePrice(p.offerPrice);
    } else {
      computePreviewEffective({
        price: p.price != null ? p.price.toString() : '',
        offerPercentage: p.offerPercentage != null ? p.offerPercentage.toString() : ''
      });
    }
    setOpenForm(true);
  }

  function resetForm() {
    setEditing(null);
    setFile(null);
    setOpenForm(false);
    setForm({
      name: '', price: '', stock: '', description: '', category: '',
      offerPercentage: '', offerStartDate: null, offerEndDate: null,
      festivalOffer: false, festivalName: '',
    });
    setPreviewEffectivePrice(null);
  }

  function computePreviewEffective(f) {
    const price = parseFloat(f.price);
    const offer = parseFloat(f.offerPercentage);
    if (!Number.isNaN(price) && !Number.isNaN(offer) && offer > 0) {
      const discounted = price - (price * (offer / 100));
      // round to 2 decimals for display and sending
      const rounded = Math.round(discounted * 100) / 100;
      setPreviewEffectivePrice(rounded);
    } else if (!Number.isNaN(price)) {
      setPreviewEffectivePrice(Math.round(price * 100) / 100);
    } else {
      setPreviewEffectivePrice(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // build DTO exactly as backend expects; include offerPrice from preview
    const dto = {
      name: form.name,
      description: form.description,
      price: form.price ? parseFloat(form.price) : 0,
      stock: form.stock ? parseInt(form.stock, 10) : 0,
      category: form.category || null,
      offerPercentage: form.offerPercentage !== '' ? parseFloat(form.offerPercentage) : null,
      offerStartDate: form.offerStartDate ? form.offerStartDate.format('YYYY-MM-DD') : null,
      offerEndDate: form.offerEndDate ? form.offerEndDate.format('YYYY-MM-DD') : null,
      festivalOffer: !!form.festivalOffer,
      festivalName: form.festivalName || null,
      // key change: include offerPrice (this gets stored to DB column offer_price)
      offerPrice: previewEffectivePrice != null ? Number(previewEffectivePrice) : null,
    };

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (file) {
      formData.append('image', file);
    }

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

        <Dialog open={openForm} onClose={resetForm} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {editing ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
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
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                margin="normal"
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
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={3}
              />

              <TextField
                label="Offer %"
                name="offerPercentage"
                type="number"
                value={form.offerPercentage}
                onChange={handleChange}
                fullWidth
                margin="normal"
                helperText="Leave blank if no offer"
              />

              <DatePicker
                label="Offer Start Date"
                value={form.offerStartDate}
                onChange={(newVal) => {
                  setForm(prev => {
                    const next = { ...prev, offerStartDate: newVal };
                    computePreviewEffective(next);
                    return next;
                  });
                }}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DatePicker
                label="Offer End Date"
                value={form.offerEndDate}
                onChange={(newVal) => {
                  setForm(prev => {
                    const next = { ...prev, offerEndDate: newVal };
                    computePreviewEffective(next);
                    return next;
                  });
                }}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="festivalOffer"
                    checked={form.festivalOffer}
                    onChange={handleChange}
                  />
                }
                label="Festival Offer?"
              />

              {/* Festival name input */}
              {form.festivalOffer && (
                <TextField
                  label="Festival Name"
                  name="festivalName"
                  value={form.festivalName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              )}

              {/* effective price preview */}
              <TextField
                label="Preview Effective Price"
                value={previewEffectivePrice != null ? previewEffectivePrice.toFixed(2) : '-'}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
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

        <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="product table">
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price (₹)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Offer Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Offer %</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Offer Period</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Festival?</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Festival Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow
                  key={p.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#e3f2fd', transform: 'scale(1.01)', transition: '0.2s' },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={p.imageBase64 ? `data:image/jpeg;base64,${p.imageBase64}` : undefined}
                      alt={p.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{p.category}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{p.price != null ? p.price.toFixed(2) : '-'}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {p.offerPrice != null ? p.offerPrice.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{p.stock}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {p.offerPercentage != null ? `${p.offerPercentage}%` : '-'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {p.offerStartDate && p.offerEndDate
                      ? `${p.offerStartDate} to ${p.offerEndDate}`
                      : '-'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {p.festivalOffer ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {p.festivalName || '-'}
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
    </LocalizationProvider>
  );
}
