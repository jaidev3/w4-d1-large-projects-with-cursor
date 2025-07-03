import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Pagination,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Favorite as LikeIcon,
  ShoppingCart as CartIcon,
  Star as RatingIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  useGetInteractionHistoryQuery,
  useGetUserAnalyticsQuery,
} from '../store/interactionsApi';
import { InteractionType } from '../types/interaction';

const UserInteractionHistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [interactionType, setInteractionType] = useState<InteractionType | ''>('');
  const [daysBack, setDaysBack] = useState(30);

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useGetInteractionHistoryQuery({
    page,
    per_page: 20,
    interaction_type: interactionType || undefined,
    days_back: daysBack,
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetUserAnalyticsQuery({ days_back: daysBack });

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <ViewIcon />;
      case 'like':
        return <LikeIcon />;
      case 'add_to_cart':
        return <CartIcon />;
      case 'rating':
        return <RatingIcon />;
      default:
        return <ViewIcon />;
    }
  };

  const formatInteractionType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Activity History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track your interactions with products and view your activity analytics.
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Interaction Type</InputLabel>
              <Select
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value as InteractionType | '')}
                label="Interaction Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value={InteractionType.VIEW}>Views</MenuItem>
                <MenuItem value={InteractionType.LIKE}>Likes</MenuItem>
                <MenuItem value={InteractionType.ADD_TO_CART}>Add to Cart</MenuItem>
                <MenuItem value={InteractionType.RATING}>Ratings</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value))}
                label="Time Period"
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
                <MenuItem value={365}>Last year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
        >
          <Tab icon={<TimelineIcon />} label="Activity Timeline" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
        </Tabs>
      </Box>

      {/* Activity Timeline Tab */}
      {selectedTab === 0 && (
        <Box>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : historyError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load interaction history.
            </Alert>
          ) : (
            <>
              {historyData?.interactions.length === 0 ? (
                <Alert severity="info">
                  No interactions found for the selected criteria.
                </Alert>
              ) : (
                <List>
                  {historyData?.interactions.map((interaction) => (
                    <ListItem key={interaction.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        {getInteractionIcon(interaction.interaction_type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {formatInteractionType(interaction.interaction_type)}
                            </Typography>
                            <Chip
                              label={formatInteractionType(interaction.interaction_type)}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Product ID: {interaction.product_id}
                            </Typography>
                            <Typography variant="body2">
                              {format(new Date(interaction.timestamp), 'PPp')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </Box>
      )}

      {/* Analytics Tab */}
      {selectedTab === 1 && (
        <Box>
          {analyticsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : analyticsError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load analytics data.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ViewIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" color="info.main">
                      {analyticsData?.total_views || 0}
                    </Typography>
                    <Typography variant="body2">Total Views</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <LikeIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                    <Typography variant="h4" color="error.main">
                      {analyticsData?.total_likes || 0}
                    </Typography>
                    <Typography variant="body2">Total Likes</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CartIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main">
                      {analyticsData?.total_cart_additions || 0}
                    </Typography>
                    <Typography variant="body2">Cart Additions</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <RatingIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h4" color="secondary.main">
                      {analyticsData?.average_rating?.toFixed(1) || 'N/A'}
                    </Typography>
                    <Typography variant="body2">Avg Rating</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default UserInteractionHistoryPage; 