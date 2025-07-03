import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  UserInteraction,
  UserInteractionCreate,
  UserInteractionHistory,
  UserInteractionAnalytics,
  ProductInteractionStats,
  InteractionHistoryParams,
  InteractionAnalyticsParams,
  ProductStatsParams,
  BulkInteractionParams,
  InteractionType
} from '../types/interaction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const interactionsApi = createApi({
  reducerPath: 'interactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Interaction', 'InteractionHistory', 'InteractionAnalytics', 'ProductStats'],
  endpoints: (builder) => ({
    // Track user interaction
    trackInteraction: builder.mutation<UserInteraction, UserInteractionCreate>({
      query: (interaction) => ({
        url: 'interactions',
        method: 'POST',
        body: interaction,
      }),
      invalidatesTags: ['Interaction', 'InteractionHistory', 'InteractionAnalytics', 'ProductStats'],
    }),

    // Get interaction history
    getInteractionHistory: builder.query<UserInteractionHistory, InteractionHistoryParams>({
      query: (params = {}) => ({
        url: 'interactions/history',
        params: {
          page: params.page || 1,
          per_page: params.per_page || 20,
          ...(params.interaction_type && { interaction_type: params.interaction_type }),
          ...(params.product_id && { product_id: params.product_id }),
          ...(params.days_back && { days_back: params.days_back }),
        },
      }),
      providesTags: ['InteractionHistory'],
    }),

    // Get user analytics
    getUserAnalytics: builder.query<UserInteractionAnalytics, InteractionAnalyticsParams>({
      query: (params = {}) => ({
        url: 'interactions/analytics',
        params: {
          days_back: params.days_back || 30,
        },
      }),
      providesTags: ['InteractionAnalytics'],
    }),

    // Get product interaction stats
    getProductStats: builder.query<ProductInteractionStats, ProductStatsParams>({
      query: ({ product_id, days_back = 30 }) => ({
        url: `products/${product_id}/stats`,
        params: { days_back },
      }),
      providesTags: (result, error, { product_id }) => [
        { type: 'ProductStats', id: product_id },
      ],
    }),

    // Get bulk interactions
    getBulkInteractions: builder.query<UserInteraction[], BulkInteractionParams>({
      query: ({ product_ids, interaction_types, limit = 100 }) => ({
        url: 'interactions/bulk',
        params: {
          product_ids: product_ids.join(','),
          interaction_types: interaction_types.join(','),
          limit,
        },
      }),
      providesTags: ['Interaction'],
    }),

    // Delete interaction (for privacy/GDPR compliance)
    deleteInteraction: builder.mutation<{ message: string }, number>({
      query: (interactionId) => ({
        url: `interactions/${interactionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Interaction', 'InteractionHistory', 'InteractionAnalytics'],
    }),
  }),
});

export const {
  useTrackInteractionMutation,
  useGetInteractionHistoryQuery,
  useGetUserAnalyticsQuery,
  useGetProductStatsQuery,
  useGetBulkInteractionsQuery,
  useDeleteInteractionMutation,
} = interactionsApi;

// Helper functions for common interactions
export const useInteractionTracking = () => {
  const [trackInteraction, { isLoading: isTracking, error }] = useTrackInteractionMutation();

  const trackView = async (productId: number, interaction_metadata?: Record<string, any>) => {
    try {
      await trackInteraction({
        product_id: productId,
        interaction_type: InteractionType.VIEW,
        interaction_metadata,
      }).unwrap();
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  const trackLike = async (productId: number, interaction_metadata?: Record<string, any>) => {
    try {
      await trackInteraction({
        product_id: productId,
        interaction_type: InteractionType.LIKE,
        interaction_metadata,
      }).unwrap();
    } catch (err) {
      console.error('Failed to track like:', err);
    }
  };

  const trackAddToCart = async (productId: number, quantity = 1, interaction_metadata?: Record<string, any>) => {
    try {
      await trackInteraction({
        product_id: productId,
        interaction_type: InteractionType.ADD_TO_CART,
        quantity,
        interaction_metadata,
      }).unwrap();
    } catch (err) {
      console.error('Failed to track add to cart:', err);
    }
  };

  const trackPurchase = async (productId: number, quantity = 1, interaction_metadata?: Record<string, any>) => {
    try {
      await trackInteraction({
        product_id: productId,
        interaction_type: InteractionType.PURCHASE,
        quantity,
        interaction_metadata,
      }).unwrap();
    } catch (err) {
      console.error('Failed to track purchase:', err);
    }
  };

  const trackRating = async (productId: number, rating: number, interaction_metadata?: Record<string, any>) => {
    try {
      await trackInteraction({
        product_id: productId,
        interaction_type: InteractionType.RATING,
        rating_value: rating,
        interaction_metadata,
      }).unwrap();
    } catch (err) {
      console.error('Failed to track rating:', err);
    }
  };

  return {
    trackView,
    trackLike,
    trackAddToCart,
    trackPurchase,
    trackRating,
    isTracking,
    error: error as string | undefined,
  };
}; 