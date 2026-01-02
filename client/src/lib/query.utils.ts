import type { IBaseQueryParams, IPaginationParams, ISearchParams } from "@/types/query.types";

/**
 * Build query params, removing undefined/null/empty values
 */
export function buildQueryParams<T extends IBaseQueryParams>(params: T): Record<string, any> {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
}

/**
 * Merge multiple query param objects
 */
export function mergeQueryParams(...params: IBaseQueryParams[]): Record<string, any> {
  return buildQueryParams(Object.assign({}, ...params));
}

/**
 * Create pagination params
 */
export function createPaginationParams(pageNumber = 1, pageSize = 10): IPaginationParams {
  return { pageNumber, pageSize };
}

/**
 * Create search params
 */
export function createSearchParams(search?: string): ISearchParams {
  return search ? { search } : {};
}
