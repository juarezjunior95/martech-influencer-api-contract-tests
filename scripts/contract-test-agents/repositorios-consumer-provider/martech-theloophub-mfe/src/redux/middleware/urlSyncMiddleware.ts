import { Middleware } from '@reduxjs/toolkit';
import { FilterForm, FilterPage } from 'models/Filters';
import {
  applyFilters,
  loadFilters,
  setCurrentPage,
  setFilterVisibility,
} from 'redux/slices/filters';

const PERFORMANCE_TOOL_DEFAULT_KPI_KEY = 'performance_tool_default_kpi';

export const urlSyncMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();
  const { currentPage, previousPage, pages } = state.filters;
  const currentPageFilters = currentPage ? pages[currentPage] : null;

  const actionIsSetFilterVisibility =
    (action as any).type === setFilterVisibility.type;
  const actionIsApplyFilters = (action as any).type === applyFilters.type;
  const actionIsSetCurrentPage = (action as any).type === setCurrentPage.type;
  const actionIsLoadFiltersFulfilled =
    (action as any).type === loadFilters.fulfilled.type;

  // Handle setFilterVisibility separately - only clear URL when isHidden=true
  if (actionIsSetFilterVisibility) {
    clearUrlWhenCurrentFiltersAreHidden(currentPageFilters);
  } else if (actionIsApplyFilters) {
    syncAppliedFiltersToUrlWhenVisible(currentPageFilters);
  } else if (actionIsSetCurrentPage || actionIsLoadFiltersFulfilled) {
    syncAppliedFiltersToUrlWhenNavigating(currentPageFilters);
    syncNavigationKpi(pages, currentPage, previousPage);
  }

  return result;
};

function clearUrlWhenCurrentFiltersAreHidden(page: FilterPage | null) {
  if (!page?.isHidden) return;
  const currentParams = new URLSearchParams(globalThis.location.search);
  const urlHasFilterParams = Array.from(currentParams.keys()).some((key) =>
    key.startsWith('filter_'),
  );
  if (urlHasFilterParams) return;
  clearFiltersFromUrl();
}

function syncAppliedFiltersToUrlWhenVisible(page: FilterPage | null) {
  if (page && !page.isHidden) {
    syncFiltersToUrl(page.applied);
  }
}

function syncAppliedFiltersToUrlWhenNavigating(page: FilterPage | null) {
  if (!page || page.isHidden || !page.applied) return;

  const currentParams = new URLSearchParams(globalThis.location.search);
  const urlAlreadyHasFilters = Array.from(currentParams.keys()).some((key) =>
    key.startsWith('filter_'),
  );

  if (urlAlreadyHasFilters) return;
  syncFiltersToUrl(page.applied);
}

function syncNavigationKpi(
  pages: Record<string, FilterPage>,
  currentPage: string | null,
  previousPage: string | null,
) {
  const page = currentPage ? pages[currentPage] : null;
  const prevPage = previousPage ? pages[previousPage] : null;

  if (page?.defaultKpi && prevPage?.status === 'loaded') {
    sessionStorage.setItem(PERFORMANCE_TOOL_DEFAULT_KPI_KEY, page.defaultKpi);
    return;
  }

  if (page?.status === 'loaded' && !page?.defaultKpi) {
    sessionStorage.removeItem(PERFORMANCE_TOOL_DEFAULT_KPI_KEY);
  }
}

function syncFiltersToUrl(filters: FilterForm) {
  const params = new URLSearchParams(globalThis.location.search);

  Array.from(params.keys()).forEach((key) => {
    if (key.startsWith('filter_')) params.delete(key);
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(`filter_${key}`, String(value));
  });

  const queryString = params.toString();
  const newUrl = queryString ? `?${queryString}` : globalThis.location.pathname;
  globalThis.history.replaceState({}, '', newUrl);
}

function clearFiltersFromUrl() {
  const params = new URLSearchParams(globalThis.location.search);
  let hasFilterParams = false;

  Array.from(params.keys()).forEach((key) => {
    if (key.startsWith('filter_')) {
      params.delete(key);
      hasFilterParams = true;
    }
  });

  if (hasFilterParams) {
    const queryString = params.toString();
    const newUrl = queryString
      ? `?${queryString}`
      : globalThis.location.pathname;
    globalThis.history.replaceState({}, '', newUrl);
  }
}
