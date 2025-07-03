// User interaction types matching the backend API

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
  RATING = 'rating',
}

export interface UserInteractionCreate {
  product_id: number;
  interaction_type: InteractionType;
  rating_value?: number; // For rating interactions (1-5)
  quantity?: number; // For add_to_cart/purchase interactions
  session_id?: string; // For tracking user sessions
  interaction_metadata?: Record<string, any>; // Additional interaction data
}

export interface UserInteraction {
  id: number;
  user_id: number;
  product_id: number;
  interaction_type: string;
  timestamp: string;
  rating_value?: number;
  quantity?: number;
  session_id?: string;
  interaction_metadata?: Record<string, any>;
}

export interface UserInteractionHistory {
  interactions: UserInteraction[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface UserInteractionAnalytics {
  total_views: number;
  total_likes: number;
  total_cart_additions: number;
  total_purchases: number;
  total_ratings: number;
  average_rating?: number;
  most_viewed_categories: Array<{
    category: string;
    count: number;
  }>;
  most_liked_products: Array<{
    id: number;
    name: string;
    count: number;
  }>;
  recent_activity: UserInteraction[];
}

export interface ProductInteractionStats {
  product_id: number;
  total_views: number;
  total_likes: number;
  total_cart_additions: number;
  total_purchases: number;
  total_ratings: number;
  average_rating?: number;
  view_to_cart_ratio?: number;
  cart_to_purchase_ratio?: number;
}

// Query parameters for interaction history
export interface InteractionHistoryParams {
  page?: number;
  per_page?: number;
  interaction_type?: InteractionType;
  product_id?: number;
  days_back?: number;
}

// Query parameters for analytics
export interface InteractionAnalyticsParams {
  days_back?: number;
}

// Query parameters for product stats
export interface ProductStatsParams {
  product_id: number;
  days_back?: number;
}

// Bulk interaction query parameters
export interface BulkInteractionParams {
  product_ids: number[];
  interaction_types: InteractionType[];
  limit?: number;
}

// UI-specific types
export interface InteractionContextType {
  trackView: (productId: number, interaction_metadata?: Record<string, any>) => void;
  trackLike: (productId: number, interaction_metadata?: Record<string, any>) => void;
  trackAddToCart: (productId: number, quantity?: number, interaction_metadata?: Record<string, any>) => void;
  trackPurchase: (productId: number, quantity?: number, interaction_metadata?: Record<string, any>) => void;
  trackRating: (productId: number, rating: number, interaction_metadata?: Record<string, any>) => void;
  isTracking: boolean;
  error?: string;
}

// Shopping cart types with interaction tracking
export interface CartItem {
  product_id: number;
  quantity: number;
  added_at: string;
  session_id?: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  session_id?: string;
  created_at: string;
  updated_at: string;
}

// Rating component props
export interface RatingProps {
  productId: number;
  currentRating?: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Like button props
export interface LikeButtonProps {
  productId: number;
  isLiked?: boolean;
  onToggleLike: (productId: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Analytics dashboard props
export interface AnalyticsDashboardProps {
  daysBack?: number;
  showProductStats?: boolean;
  showUserBehavior?: boolean;
  showConversionFunnels?: boolean;
} 