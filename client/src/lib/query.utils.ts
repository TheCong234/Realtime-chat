import type { IBaseQueryParams, IPaginationParams, ISearchParams } from "@/types/query.types";

/**
 * Build query params, removing undefined/null/empty values
 */
export function buildQueryParams<T extends IBaseQueryParams>(params: T): Record<string, unknown> {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

/**
 * Merge multiple query param objects
 */
export function mergeQueryParams(...params: IBaseQueryParams[]): Record<string, unknown> {
  return buildQueryParams(Object.assign({}, ...params));
}

/**
 * Create pagination params
 */
export function createPaginationParams(
  pageNumber = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortDirection = "asc",
): IPaginationParams {
  return { pageNumber, pageSize, sortBy, sortDirection };
}

/**
 * Create search params
 */
export function createSearchParams(search?: string): ISearchParams {
  return search ? { search } : {};
}
