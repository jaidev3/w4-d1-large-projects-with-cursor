import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Person, Email, Schedule } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user.full_name || user.username}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                <Typography variant="body1">
                  <strong>Username:</strong> {user.username}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="primary" />
                <Typography variant="body1">
                  <strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              {user.full_name && (
                <Typography variant="body1">
                  <strong>Full Name:</strong> {user.full_name}
                </Typography>
              )}
              {user.phone && (
                <Typography variant="body1">
                  <strong>Phone:</strong> {user.phone}
                </Typography>
              )}
              {user.address && (
                <Typography variant="body1">
                  <strong>Address:</strong> {user.address}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Status Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Chip
                label={user.is_active ? 'Active' : 'Inactive'}
                color={user.is_active ? 'success' : 'error'}
                variant="outlined"
              />
              {user.is_superuser && (
                <Chip
                  label="Admin"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your dashboard! Here you can manage your profile, browse products, and view personalized recommendations.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • Update your profile information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Browse our product catalog
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View personalized recommendations (coming soon)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 