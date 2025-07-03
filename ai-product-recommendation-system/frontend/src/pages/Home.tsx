import React from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { ShoppingCart, Recommend, Security, Speed } from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const features = [
    {
      icon: <Recommend color="primary" sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized product recommendations based on your preferences and behavior.',
    },
    {
      icon: <ShoppingCart color="primary" sx={{ fontSize: 40 }} />,
      title: 'Extensive Product Catalog',
      description: 'Browse thousands of products across multiple categories with detailed information.',
    },
    {
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      title: 'Secure Authentication',
      description: 'Your data is protected with enterprise-grade security and encryption.',
    },
    {
      icon: <Speed color="primary" sx={{ fontSize: 40 }} />,
      title: 'Fast & Responsive',
      description: 'Enjoy a smooth, fast experience with our optimized platform.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ p: 6, mb: 6, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to AI Product Recommendation System
        </Typography>
        <Typography variant="h6" paragraph>
          Discover products you'll love with our intelligent recommendation engine
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Welcome back, {user?.full_name || user?.username}!
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Why Choose Our Platform?
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="h5" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" paragraph>
            Join thousands of users who are already discovering amazing products with our AI-powered recommendations.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
          >
            Create Your Account
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Home; 