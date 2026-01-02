// Base query params
export interface IBaseQueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Pagination params
export interface IPaginationParams extends IBaseQueryParams {
  pageNumber?: number;
  pageSize?: number;
}

// Search params
export interface ISearchParams extends IBaseQueryParams {
  search?: string;
}

// Sort params
export interface ISortParams extends IBaseQueryParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Combined params for common use cases
export interface IPagedSearchParams extends IPaginationParams, ISearchParams {}

export interface IFullQueryParams extends IPaginationParams, ISearchParams, ISortParams {}
