// Matches PaginatedResult<T> from backend
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Query params for listings endpoint
export interface ListingFilterParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  orderBy?: string;
}
