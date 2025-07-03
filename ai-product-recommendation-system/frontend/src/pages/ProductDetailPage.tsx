import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  Paper,
  Chip,
  Rating,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Autorenew as ReturnIcon,
} from '@mui/icons-material';
import { useGetProductQuery } from '../store/productsApi';
import { useInteractionTracking } from '../store/interactionsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || '0');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const { trackView, trackLike, trackAddToCart, trackRating } = useInteractionTracking();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Track detailed view when component mounts or product changes
  useEffect(() => {
    if (product && currentUser) {
      trackView(product.id, {
        view_type: 'detail',
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        is_featured: product.is_featured,
        is_on_sale: product.is_on_sale,
        source: 'product_detail_page',
        tab_viewed: selectedTab,
      });
    }
  }, [product, currentUser, trackView, selectedTab]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + change, product?.quantity_in_stock || 1));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product || !currentUser) return;
    
    // Track add to cart interaction
    trackAddToCart(product.id, quantity, {
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      is_on_sale: product.is_on_sale,
      sale_price: product.sale_price,
      quantity_selected: quantity,
      source: 'product_detail_page',
    });
    
    // TODO: Implement actual cart functionality
    console.log('Add to cart:', { product, quantity });
  };

  const handleToggleFavorite = () => {
    if (!product || !currentUser) return;
    
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    // Track like interaction (only when liking)
    if (newFavoriteStatus) {
      trackLike(product.id, {
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        rating: product.rating,
        source: 'product_detail_page',
      });
    }
    
    // TODO: Implement actual favorites functionality
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (!product || !currentUser || newValue === null) return;
    
    setUserRating(newValue);
    
    // Track rating interaction
    trackRating(product.id, newValue, {
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      source: 'product_detail_page',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Product not found or failed to load.
        </Alert>
      </Container>
    );
  }

  const displayPrice = product.is_on_sale && product.sale_price ? product.sale_price : product.price;
  const originalPrice = product.is_on_sale && product.sale_price ? product.price : null;
  const savings = originalPrice ? originalPrice - displayPrice : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">{product.category}</Typography>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.image_url || '/placeholder-image.jpg'}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Product Title and Tags */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={handleToggleFavorite}>
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {product.is_featured && (
                <Chip label="Featured" color="primary" size="small" />
              )}
              {product.is_on_sale && (
                <Chip label="On Sale" color="secondary" size="small" />
              )}
              {product.quantity_in_stock === 0 && (
                <Chip label="Out of Stock" color="error" size="small" />
              )}
              {product.quantity_in_stock > 0 && product.quantity_in_stock <= 10 && (
                <Chip label="Low Stock" color="warning" size="small" />
              )}
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.toFixed(1)})
              </Typography>
            </Box>

            {/* User Rating */}
            {currentUser && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Rate this product:
                </Typography>
                <Rating
                  value={userRating}
                  onChange={handleRatingChange}
                  precision={1}
                  size="large"
                />
                {userRating && (
                  <Typography variant="body2" color="text.secondary">
                    Your rating: {userRating} stars
                  </Typography>
                )}
              </Box>
            )}

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${displayPrice.toFixed(2)}
              </Typography>
              {originalPrice && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${originalPrice.toFixed(2)}
                  </Typography>
                  <Chip
                    label={`Save $${savings.toFixed(2)}`}
                    color="success"
                    size="small"
                  />
                </Box>
              )}
            </Box>

            {/* Category and Manufacturer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Category: {product.category}
                {product.subcategory && ` • ${product.subcategory}`}
              </Typography>
              {product.manufacturer && (
                <Typography variant="body1" color="text.secondary">
                  Manufacturer: {product.manufacturer}
                </Typography>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {product.quantity_in_stock > 0 ? (
                <Typography variant="body1" color="success.main">
                  ✓ In Stock ({product.quantity_in_stock} available)
                </Typography>
              ) : (
                <Typography variant="body1" color="error.main">
                  ✗ Out of Stock
                </Typography>
              )}
            </Box>

            {/* Quantity and Add to Cart */}
            {product.quantity_in_stock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.quantity_in_stock)))}
                      inputProps={{ min: 1, max: product.quantity_in_stock, style: { textAlign: 'center', width: 50 } }}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity_in_stock}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    sx={{ flexGrow: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            )}

            {/* Product Features */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ShippingIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      Free Shipping
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ReturnIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      30-Day Returns
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SecurityIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="caption" display="block">
                      Secure Payment
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* Product Details Tabs */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews" />
            </Tabs>
          </Box>
          
          <TabPanel value={selectedTab} index={0}>
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description || 'No description available.'}
            </Typography>
          </TabPanel>
          
          <TabPanel value={selectedTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Category</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography>
                
                {product.subcategory && (
                  <>
                    <Typography variant="subtitle2">Subcategory</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.subcategory}
                    </Typography>
                  </>
                )}
                
                {product.manufacturer && (
                  <>
                    <Typography variant="subtitle2">Manufacturer</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.manufacturer}
                    </Typography>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {product.weight && (
                  <>
                    <Typography variant="subtitle2">Weight</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.weight} lbs
                    </Typography>
                  </>
                )}
                
                {product.dimensions && (
                  <>
                    <Typography variant="subtitle2">Dimensions</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.dimensions}
                    </Typography>
                  </>
                )}
                
                {product.release_date && (
                  <>
                    <Typography variant="subtitle2">Release Date</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(product.release_date).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={selectedTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="h6">{product.rating.toFixed(1)} out of 5</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Reviews functionality will be implemented in a future update.
            </Typography>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage; 