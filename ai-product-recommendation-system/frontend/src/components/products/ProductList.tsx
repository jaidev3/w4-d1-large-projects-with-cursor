import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { ViewModule, ViewList } from '@mui/icons-material';
import ProductCard from './ProductCard';
import type { ProductListProps } from '../../types/product';

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  error,
  viewType = 'grid',
  onLoadMore,
  hasMore = false,
}) => {
  const handleAddToCart = (product: any) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
  };

  const handleToggleFavorite = (product: any) => {
    // TODO: Implement favorites functionality
    console.log('Toggle favorite:', product);
  };

  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search or filters
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {viewType === 'grid' ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
                viewType="grid"
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewType="list"
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </Box>
      )}

      {/* Load More Button */}
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onLoadMore}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Load More Products'}
          </Button>
        </Box>
      )}

      {/* Loading more products indicator */}
      {loading && products.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default ProductList; 