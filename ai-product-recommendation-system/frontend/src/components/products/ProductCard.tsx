import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Rating } from '@mui/material';
import { ShoppingCart as CartIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import type { ProductCardProps } from '../../types/product';

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewType = 'grid',
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite?.(product);
  };

  const displayPrice = product.is_on_sale && product.sale_price ? product.sale_price : product.price;
  const originalPrice = product.is_on_sale && product.sale_price ? product.price : null;

  if (viewType === 'list') {
    return (
      <Card sx={{ display: 'flex', mb: 2, height: 200 }}>
        <CardMedia
          component="img"
          sx={{ width: 200, height: 200, objectFit: 'cover' }}
          image={product.image_url || '/placeholder-image.jpg'}
          alt={product.name}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography 
                component={Link} 
                to={`/products/${product.id}`}
                variant="h6" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'text.primary',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.is_featured && (
                  <Chip label="Featured" color="primary" size="small" />
                )}
                {product.is_on_sale && (
                  <Chip label="On Sale" color="secondary" size="small" />
                )}
                {product.quantity_in_stock === 0 && (
                  <Chip label="Out of Stock" color="error" size="small" />
                )}
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {product.category} {product.subcategory && `• ${product.subcategory}`}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {product.description?.substring(0, 150)}...
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.toFixed(1)})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" color="primary.main">
                  ${displayPrice.toFixed(2)}
                </Typography>
                {originalPrice && (
                  <Typography 
                    variant="body2" 
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${originalPrice.toFixed(2)}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleToggleFavorite}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.quantity_in_stock === 0}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    );
  }

  // Grid view
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.image_url || '/placeholder-image.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Button
            size="small"
            onClick={handleToggleFavorite}
            sx={{ 
              minWidth: 'auto', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
            }}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </Button>
        </Box>
        {(product.is_featured || product.is_on_sale || product.quantity_in_stock === 0) && (
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {product.is_featured && (
              <Chip label="Featured" color="primary" size="small" />
            )}
            {product.is_on_sale && (
              <Chip label="On Sale" color="secondary" size="small" />
            )}
            {product.quantity_in_stock === 0 && (
              <Chip label="Out of Stock" color="error" size="small" />
            )}
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          component={Link} 
          to={`/products/${product.id}`}
          variant="h6" 
          sx={{ 
            textDecoration: 'none', 
            color: 'text.primary',
            '&:hover': { textDecoration: 'underline' },
            mb: 1,
            fontSize: '1rem'
          }}
        >
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={product.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({product.rating.toFixed(1)})
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {product.description?.substring(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="primary.main">
              ${displayPrice.toFixed(2)}
            </Typography>
            {originalPrice && (
              <Typography 
                variant="body2" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${originalPrice.toFixed(2)}
              </Typography>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          disabled={product.quantity_in_stock === 0}
          fullWidth
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 