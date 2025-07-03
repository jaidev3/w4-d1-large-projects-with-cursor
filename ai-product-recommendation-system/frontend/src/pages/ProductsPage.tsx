import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Button,
  ButtonGroup,
  Chip,
  Drawer,
  useMediaQuery,
  useTheme,
  Slider,
  FormControlLabel,
  Switch,
  Divider,
  Badge,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/productsApi';
import type { ProductFilters, SortBy, SortOrder } from '../types/product';

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for filters and view
  const [filters, setFilters] = useState<ProductFilters>({
    skip: 0,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);

  // API queries
  const { data: products = [], isLoading, error } = useGetProductsQuery(filters);
  const { data: categories = [] } = useGetCategoriesQuery();

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      search: query || undefined,
      skip: 0, // Reset pagination
    }));
  };

  // Category filter handler
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      setFilters(prevFilters => ({
        ...prevFilters,
        category: newCategories.length > 0 ? newCategories.join(',') : undefined,
        skip: 0,
      }));
      
      return newCategories;
    });
  };

  // Price range handler
  const handlePriceRangeChange = (newValue: number | number[]) => {
    const range = newValue as [number, number];
    setPriceRange(range);
    setFilters(prev => ({
      ...prev,
      min_price: range[0],
      max_price: range[1],
      skip: 0,
    }));
  };

  // Rating range handler
  const handleRatingRangeChange = (newValue: number | number[]) => {
    const range = newValue as [number, number];
    setRatingRange(range);
    setFilters(prev => ({
      ...prev,
      min_rating: range[0],
      max_rating: range[1],
      skip: 0,
    }));
  };

  // Boolean filter handlers
  const handleFeaturedToggle = () => {
    setShowFeatured(prev => {
      const newValue = !prev;
      setFilters(prevFilters => ({
        ...prevFilters,
        is_featured: newValue || undefined,
        skip: 0,
      }));
      return newValue;
    });
  };

  const handleOnSaleToggle = () => {
    setShowOnSale(prev => {
      const newValue = !prev;
      setFilters(prevFilters => ({
        ...prevFilters,
        is_on_sale: newValue || undefined,
        skip: 0,
      }));
      return newValue;
    });
  };

  const handleInStockToggle = () => {
    setShowInStock(prev => {
      const newValue = !prev;
      setFilters(prevFilters => ({
        ...prevFilters,
        in_stock: newValue || undefined,
        skip: 0,
      }));
      return newValue;
    });
  };

  // Sort handler
  const handleSortChange = (sortBy: SortBy, sortOrder: SortOrder) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: sortOrder,
      skip: 0,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setRatingRange([0, 5]);
    setShowFeatured(false);
    setShowOnSale(false);
    setShowInStock(false);
    setFilters({
      skip: 0,
      limit: 20,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  };

  // Load more products
  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      skip: (prev.skip || 0) + (prev.limit || 20),
    }));
  };

  // Filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (ratingRange[0] > 0 || ratingRange[1] < 5) count++;
    if (showFeatured) count++;
    if (showOnSale) count++;
    if (showInStock) count++;
    return count;
  };

  // Filter drawer content
  const FilterContent = () => (
    <Box sx={{ width: 300, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              color={selectedCategories.includes(category) ? 'primary' : 'default'}
              onClick={() => handleCategoryToggle(category)}
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
        />
      </Box>

      {/* Rating Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rating: {ratingRange[0]} - {ratingRange[1]} stars
        </Typography>
        <Slider
          value={ratingRange}
          onChange={handleRatingRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
        />
      </Box>

      {/* Boolean Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Product Type
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showFeatured}
              onChange={handleFeaturedToggle}
            />
          }
          label="Featured Products"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showOnSale}
              onChange={handleOnSaleToggle}
            />
          }
          label="On Sale"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showInStock}
              onChange={handleInStockToggle}
            />
          }
          label="In Stock"
        />
      </Box>

      {/* Clear Filters */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Search and Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={`${filters.sort_by}_${filters.sort_order}`}
                label="Sort By"
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('_') as [SortBy, SortOrder];
                  handleSortChange(sortBy, sortOrder);
                }}
              >
                <MenuItem value="created_at_desc">Newest First</MenuItem>
                <MenuItem value="created_at_asc">Oldest First</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating_desc">Highest Rated</MenuItem>
                <MenuItem value="rating_asc">Lowest Rated</MenuItem>
                <MenuItem value="name_asc">Name: A to Z</MenuItem>
                <MenuItem value="name_desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* View Controls */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Badge badgeContent={getActiveFilterCount()} color="primary">
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  Filters
                </Button>
              </Badge>
              
              <ButtonGroup variant="outlined">
                <Button
                  onClick={() => setViewType('grid')}
                  variant={viewType === 'grid' ? 'contained' : 'outlined'}
                >
                  <GridViewIcon />
                </Button>
                <Button
                  onClick={() => setViewType('list')}
                  variant={viewType === 'list' ? 'contained' : 'outlined'}
                >
                  <ListViewIcon />
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {searchQuery && (
            <Chip
              label={`Search: ${searchQuery}`}
              onDelete={() => handleSearch('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              onDelete={() => handleCategoryToggle(category)}
              color="primary"
              variant="outlined"
            />
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 1000) && (
            <Chip
              label={`Price: $${priceRange[0]}-$${priceRange[1]}`}
              onDelete={() => setPriceRange([0, 1000])}
              color="primary"
              variant="outlined"
            />
          )}
          {showFeatured && (
            <Chip
              label="Featured"
              onDelete={handleFeaturedToggle}
              color="primary"
              variant="outlined"
            />
          )}
          {showOnSale && (
            <Chip
              label="On Sale"
              onDelete={handleOnSaleToggle}
              color="primary"
              variant="outlined"
            />
          )}
          {showInStock && (
            <Chip
              label="In Stock"
              onDelete={handleInStockToggle}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Product List */}
      <ProductList
        products={products}
        loading={isLoading}
        error={error as string}
        viewType={viewType}
        onLoadMore={handleLoadMore}
        hasMore={products.length >= (filters.limit || 20)}
      />

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <FilterContent />
      </Drawer>
    </Container>
  );
};

export default ProductsPage; 