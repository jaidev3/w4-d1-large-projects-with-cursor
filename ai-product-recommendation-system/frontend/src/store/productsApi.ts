import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Product, 
  ProductFilters, 
  ProductSearchParams, 
  ProductStats, 
  ProductCreate, 
  ProductUpdate 
} from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/products`,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'ProductStats', 'Categories'],
  endpoints: (builder) => ({
    // Get products with filters
    getProducts: builder.query<Product[], ProductFilters>({
      query: (filters = {}) => ({
        url: '',
        params: {
          skip: filters.skip || 0,
          limit: filters.limit || 20,
          ...(filters.search && { search: filters.search }),
          ...(filters.category && { category: filters.category }),
          ...(filters.subcategory && { subcategory: filters.subcategory }),
          ...(filters.min_price !== undefined && { min_price: filters.min_price }),
          ...(filters.max_price !== undefined && { max_price: filters.max_price }),
          ...(filters.min_rating !== undefined && { min_rating: filters.min_rating }),
          ...(filters.max_rating !== undefined && { max_rating: filters.max_rating }),
          ...(filters.is_featured !== undefined && { is_featured: filters.is_featured }),
          ...(filters.is_on_sale !== undefined && { is_on_sale: filters.is_on_sale }),
          ...(filters.in_stock !== undefined && { in_stock: filters.in_stock }),
          ...(filters.sort_by && { sort_by: filters.sort_by }),
          ...(filters.sort_order && { sort_order: filters.sort_order }),
        },
      }),
      providesTags: ['Product'],
    }),

    // Search products
    searchProducts: builder.query<Product[], ProductSearchParams>({
      query: ({ q, limit = 20 }) => ({
        url: 'search',
        params: { q, limit },
      }),
      providesTags: ['Product'],
    }),

    // Get single product
    getProduct: builder.query<Product, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get categories
    getCategories: builder.query<string[], void>({
      query: () => 'categories',
      providesTags: ['Categories'],
    }),

    // Get subcategories by category
    getSubcategories: builder.query<string[], string>({
      query: (category) => `categories/${encodeURIComponent(category)}/subcategories`,
      providesTags: ['Categories'],
    }),

    // Get featured products
    getFeaturedProducts: builder.query<Product[], number>({
      query: (limit = 10) => ({
        url: 'featured',
        params: { limit },
      }),
      providesTags: ['Product'],
    }),

    // Get products on sale
    getSaleProducts: builder.query<Product[], number>({
      query: (limit = 20) => ({
        url: 'on-sale',
        params: { limit },
      }),
      providesTags: ['Product'],
    }),

    // Get product statistics
    getProductStats: builder.query<ProductStats, void>({
      query: () => 'stats',
      providesTags: ['ProductStats'],
    }),

    // Create product (admin only)
    createProduct: builder.mutation<Product, ProductCreate>({
      query: (product) => ({
        url: '',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product', 'ProductStats', 'Categories'],
    }),

    // Update product (admin only)
    updateProduct: builder.mutation<Product, { id: number; product: ProductUpdate }>({
      query: ({ id, product }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
        'ProductStats',
      ],
    }),

    // Delete product (admin only)
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        'Product',
        'ProductStats',
        'Categories',
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetFeaturedProductsQuery,
  useGetSaleProductsQuery,
  useGetProductStatsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi; 