// Product types matching the backend API

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  manufacturer?: string;
  description?: string;
  quantity_in_stock: number;
  is_featured: boolean;
  is_on_sale: boolean;
  sale_price?: number;
  weight?: number;
  dimensions?: string;
  release_date?: string;
  rating: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  manufacturer?: string;
  description?: string;
  quantity_in_stock?: number;
  is_featured?: boolean;
  is_on_sale?: boolean;
  sale_price?: number;
  weight?: number;
  dimensions?: string;
  release_date?: string;
  rating?: number;
  image_url?: string;
}

export interface ProductUpdate {
  name?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  manufacturer?: string;
  description?: string;
  quantity_in_stock?: number;
  is_featured?: boolean;
  is_on_sale?: boolean;
  sale_price?: number;
  weight?: number;
  dimensions?: string;
  release_date?: string;
  rating?: number;
  image_url?: string;
}

// API Query Parameters
export interface ProductFilters {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  max_rating?: number;
  is_featured?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}

export type SortBy = 'name' | 'price' | 'rating' | 'created_at' | 'popularity';
export type SortOrder = 'asc' | 'desc';

// Search params
export interface ProductSearchParams {
  q: string;
  limit?: number;
}

// Product statistics
export interface ProductStats {
  total_products: number;
  featured_count: number;
  on_sale_count: number;
  in_stock_count: number;
  average_price: number;
  average_rating: number;
  price_range: {
    min: number;
    max: number;
  };
}

// UI-specific types
export interface ProductGridViewType {
  view: 'grid' | 'list';
  columns: 2 | 3 | 4;
}

export interface ProductFilterState {
  priceRange: [number, number];
  ratingRange: [number, number];
  selectedCategories: string[];
  selectedSubcategories: string[];
  showFeatured: boolean;
  showOnSale: boolean;
  showInStock: boolean;
}

// Shopping cart types (for future use)
export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Pagination types
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Component props types
export interface ProductCardProps {
  product: Product;
  viewType?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  viewType?: 'grid' | 'list';
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface ProductFiltersProps {
  filters: ProductFilterState;
  onFiltersChange: (filters: ProductFilterState) => void;
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  onClearFilters: () => void;
}

export interface ProductSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
}

export interface ProductSortProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

// Error types
export interface ProductError {
  message: string;
  code?: string;
  details?: Record<string, any>;
} 