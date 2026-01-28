import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../Redux/Admin/Action';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material';

const categories = {
  men: [
    { label: 'Clothing', value: 'clothing' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
  ],
  women: [
    { label: 'Clothing', value: 'clothing' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Jewelry', value: 'jewelry' },
  ],
  kids: [
    { label: 'Clothing', value: 'clothing' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Toys', value: 'toys' },
  ],
};

// third level is now nested by top-level category -> second-level category
const thirdLevelCategories = {
  men: {
    clothing: [
      { label: 'Shirt', value: 'shirt' },
      { label: 'T-Shirt', value: 't-shirt' },
      { label: 'Jeans', value: 'men_jeans' },
      { label: 'Pants', value: 'pants' },
      { label: 'Jackets', value: 'jackets' },
      { label: 'Sweaters', value: 'sweaters' },
    ],
    shoes: [
      { label: 'Sneakers', value: 'sneakers' },
      { label: 'Formal', value: 'formal' },
      { label: 'Casual', value: 'casual' },
      { label: 'Sports', value: 'sports' },
    ],
    accessories: [
      { label: 'Bags', value: 'bags' },
      { label: 'Belts', value: 'belts' },
      { label: 'Watches', value: 'watches' },
      { label: 'Sunglasses', value: 'sunglasses' },
      { label: 'Wallets', value: 'wallets' },
      { label: 'Wallets', value: 'wallets' },
      { label: 'Headphones', value: 'headphones' },
    ],
  },
  women: {
    clothing: [
      { label: 'Dresses', value: 'dresses' },
      { label: 'Gowns', value: 'gowns' },
      { label: 'Sarees', value: 'sarees' },
      { label: 'Tops', value: 'top' },
      { label: 'Jeans', value: 'women_jeans' },
      { label: 'Jackets', value: 'jackets' },
      { label: 'Activewear', value: 'activewear' },
    ],
    shoes: [
      { label: 'Heels', value: 'heels' },
      { label: 'Flats', value: 'flats' },
      { label: 'Sneakers', value: 'sneakers' },
    ],
    accessories: [
      { label: 'Bags', value: 'bags' },
      { label: 'Belts', value: 'belts' },
      { label: 'Watches', value: 'watches' },
      { label: 'Sunglasses', value: 'sunglasses' },
    ],
    jewelry: [
      { label: 'Necklaces', value: 'necklaces' },
      { label: 'Earrings', value: 'earrings' },
    ],
  },
  kids: {
    clothing: [
      { label: 'Baby Clothing', value: 'baby_clothing' },
      { label: 'Kids Shirts', value: 'kids_shirts' },
    ],
    shoes: [
      { label: 'Kids Sneakers', value: 'kids_sneakers' },
    ],
    toys: [
      { label: 'Soft Toys', value: 'soft_toys' },
    ],
  },
};

export default function CreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((store) => store.admin);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    discountPercent: '',
    brand: '',
    color: '',
    imageUrl: '',
    topLevelCategory: '',
    secondLevelCategory: '',
    thirdLevelCategory: '',
  });

  const [sizes, setSizes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'topLevelCategory') {
      setFormData((prev) => ({ ...prev, secondLevelCategory: '', thirdLevelCategory: '' }));
    }
    if (name === 'secondLevelCategory') {
      setFormData((prev) => ({ ...prev, thirdLevelCategory: '' }));
    }
  };

  const handleAddSize = () => {
    setSizes([...sizes, { name: '', quantity: '' }]);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (sizes.length === 0) {
      setSnackbar({ open: true, message: 'Please add at least one size with quantity!', severity: 'error' });
      return;
    }

    const hasInvalidSize = sizes.some(size => !size.name || !size.quantity || size.quantity <= 0);
    if (hasInvalidSize) {
      setSnackbar({ open: true, message: 'All sizes must have a name and valid quantity!', severity: 'error' });
      return;
    }

    const totalQuantity = sizes.reduce((sum, size) => sum + parseInt(size.quantity || 0), 0);

    const sizesArray = sizes.map((size) => ({
      name: size.name.trim(),
      quantity: parseInt(size.quantity),
    }));

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: parseFloat(formData.discountPrice),
      discountPercent: parseFloat(formData.discountPercent),
      quantity: totalQuantity,
      sizes: sizesArray,
    };

    dispatch(createProduct(productData));
    setSnackbar({ open: true, message: 'Product created successfully!', severity: 'success' });
    setTimeout(() => {
      navigate('/admin/products');
    }, 1500);
  };

  // compute third level options based on selected top and second level
  const thirdLevelOptions =
    formData.topLevelCategory && formData.secondLevelCategory
      ? thirdLevelCategories[formData.topLevelCategory]?.[formData.secondLevelCategory] || []
      : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/products')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
          Create New Product
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Discounted Price"
                name="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Discount Percent"
                name="discountPercent"
                type="number"
                value={formData.discountPercent}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Top Level Category"
                name="topLevelCategory"
                value={formData.topLevelCategory}
                onChange={handleChange}
                required
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                {Object.keys(categories).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </MenuItem>
                ))}

              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Second Level Category"
                name="secondLevelCategory"
                value={formData.secondLevelCategory}
                onChange={handleChange}
                disabled={!formData.topLevelCategory}
                required
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                {formData.topLevelCategory &&
                  categories[formData.topLevelCategory].map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}

              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Third Level Category"
                name="thirdLevelCategory"
                value={formData.thirdLevelCategory}
                onChange={handleChange}
                disabled={!formData.secondLevelCategory}
                required
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                {thirdLevelOptions.length > 0 ? (
                  thirdLevelOptions.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No subcategories available</MenuItem>
                )}

              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sizes & Quantities
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddSize}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      bgcolor: 'rgba(139, 92, 246, 0.04)',
                    },
                  }}
                >
                  Add Size
                </Button>
              </Box>

              {sizes.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderColor: '#d1d5db',
                    bgcolor: '#f9fafb',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No sizes added yet. Click "Add Size" to start adding product sizes with their quantities.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {sizes.map((size, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#8b5cf6',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Size Name"
                            value={size.name}
                            onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                            placeholder="e.g., S, M, L, XL"
                            required
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={size.quantity}
                            onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)}
                            placeholder="e.g., 100"
                            required
                            size="small"
                            inputProps={{ min: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveSize(index)}
                            sx={{ height: 40 }}
                            startIcon={<Delete />}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/products')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #7c3aed, #db2777)',
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Create Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
