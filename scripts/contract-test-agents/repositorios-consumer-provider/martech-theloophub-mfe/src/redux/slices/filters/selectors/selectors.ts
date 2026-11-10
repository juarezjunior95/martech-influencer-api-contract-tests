import { createSelector } from '@reduxjs/toolkit';
import {
  FilterDataAccessor,
  FilterRegistry,
  PerformanceToolFilterDataTransformer,
} from 'domain/Filter';
import type {
  FilterDataStructure,
  FilterForm,
  FilterStatus,
} from 'models/Filters';
import { RootState } from 'redux/types';

export const selectFiltersState = (state: RootState) => state.filters;

export const selectCurrentPage = (state: RootState) =>
  state.filters.currentPage;

export const selectAllPages = (state: RootState) => state.filters.pages;

export const selectPage = (pageName: string) => (state: RootState) =>
  state.filters.pages[pageName];

export const selectCurrentPageData = createSelector(
  [selectFiltersState],
  (filtersState) => {
    const currentPage = filtersState.currentPage;
    if (!currentPage) return null;
    return filtersState.pages[currentPage] || null;
  },
);

// Memoized selectors for specific pages
const pageStatusSelectors = new Map<
  string,
  (state: RootState) => FilterStatus
>();
const pageDataFiltersSelectors = new Map<
  string,
  (state: RootState) => FilterDataStructure
>();
const pageDataFiltersAppliedSelectors = new Map<
  string,
  (state: RootState) => FilterDataStructure
>();
const pageDefaultsSelectors = new Map<
  string,
  (state: RootState) => FilterForm
>();
const pageAppliedSelectors = new Map<
  string,
  (state: RootState) => FilterForm
>();
const pageFormSelectors = new Map<string, (state: RootState) => FilterForm>();

export const selectPageStatus = (pageName: string) => {
  if (!pageStatusSelectors.has(pageName)) {
    pageStatusSelectors.set(
      pageName,
      createSelector([selectPage(pageName)], (page) => page?.status || 'idle'),
    );
  }
  const selector = pageStatusSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectCurrentPageForm = createSelector(
  [selectCurrentPageData],
  (pageData) => pageData?.form || {},
);

export const selectPageRawData = (pageName: string) => (state: RootState) =>
  state.filters.pages[pageName]?.rawData;

export const selectPageDataFilters = (pageName: string) => {
  if (!pageDataFiltersSelectors.has(pageName)) {
    pageDataFiltersSelectors.set(
      pageName,
      createSelector(
        [
          selectPage(pageName),
          (state: RootState) => state.filters.pages[pageName]?.form,
          selectPageRawData(pageName),
        ],
        (page, form, rawData) => {
          if (
            !rawData ||
            !PerformanceToolFilterDataTransformer.isValidFormat(rawData)
          ) {
            return page?.dataFilters || {};
          }

          const dataFilters = PerformanceToolFilterDataTransformer.transform(
            rawData,
            form.kpis as string,
            form,
          );

          return dataFilters;
        },
      ),
    );
  }
  const selector = pageDataFiltersSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectPageDataFiltersFromApplied = (pageName: string) => {
  if (!pageDataFiltersAppliedSelectors.has(pageName)) {
    pageDataFiltersAppliedSelectors.set(
      pageName,
      createSelector(
        [
          selectPage(pageName),
          (state: RootState) => state.filters.pages[pageName]?.applied,
          selectPageRawData(pageName),
        ],
        (page, applied, rawData) => {
          if (
            !rawData ||
            !PerformanceToolFilterDataTransformer.isValidFormat(rawData)
          ) {
            return page?.dataFilters || {};
          }

          const dataFilters = PerformanceToolFilterDataTransformer.transform(
            rawData,
            applied?.kpis as string,
            applied || {},
          );

          return dataFilters;
        },
      ),
    );
  }
  const selector = pageDataFiltersAppliedSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectPageDefaults = (pageName: string) => {
  if (!pageDefaultsSelectors.has(pageName)) {
    pageDefaultsSelectors.set(
      pageName,
      createSelector(
        [selectPageDataFilters(pageName), selectPage(pageName)],
        (dataFilters, page) => {
          if (page?.defaultKpi) {
            return page.defaults || {};
          }

          if (!dataFilters || Object.keys(dataFilters).length === 0) {
            return page?.defaults || {};
          }

          return FilterRegistry.calculateDefaults(dataFilters);
        },
      ),
    );
  }
  const selector = pageDefaultsSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectPageApplied = (pageName: string) => {
  if (!pageAppliedSelectors.has(pageName)) {
    pageAppliedSelectors.set(
      pageName,
      createSelector([selectPage(pageName)], (page) => page?.applied || {}),
    );
  }
  const selector = pageAppliedSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectPageForm = (pageName: string) => {
  if (!pageFormSelectors.has(pageName)) {
    pageFormSelectors.set(
      pageName,
      createSelector([selectPage(pageName)], (page) => page?.form || {}),
    );
  }
  const selector = pageFormSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectPageAvailableFields = (pageName: string) => {
  return createSelector(
    [
      selectPageDataFilters(pageName),
      selectPageApplied(pageName),
      selectPageRawData(pageName),
    ],
    (dataFilters, applied, rawData) => {
      if (!dataFilters || Object.keys(dataFilters).length === 0) {
        return [];
      }

      const registeredFilters = FilterRegistry.getInstance().getAll();
      const isNested =
        rawData && PerformanceToolFilterDataTransformer.isValidFormat(rawData);

      if (!isNested) {
        return registeredFilters.map((config) => config.key);
      }

      const availableFieldKeys = registeredFilters
        .filter((config) => {
          const options = FilterDataAccessor.getInstance().getOptions(
            config.key,
            dataFilters,
            applied,
          );
          return options && options.length > 0;
        })
        .map((config) => config.key);

      return availableFieldKeys;
    },
  );
};

export const selectPageVisibleFields = (
  pageName: string,
  requestedFields: string[] = [],
) => {
  return createSelector(
    [selectPageAvailableFields(pageName)],
    (availableFieldKeys) => {
      if (requestedFields.length === 0) {
        return [...availableFieldKeys];
      }

      return requestedFields.filter((field) =>
        availableFieldKeys.includes(field),
      );
    },
  );
};

export const selectCurrentPageStatus = createSelector(
  [selectCurrentPageData],
  (pageData) => pageData?.status || 'idle',
);

export const selectCurrentPageDataFilters = createSelector(
  [
    selectCurrentPageData,
    selectCurrentPageForm,
    (state: RootState) =>
      state.filters.currentPage
        ? state.filters.pages[state.filters.currentPage]?.rawData
        : null,
  ],
  (pageData, form, rawData): FilterDataStructure => {
    if (!pageData) return {};
    if (
      !rawData ||
      !PerformanceToolFilterDataTransformer.isValidFormat(rawData)
    ) {
      return pageData.dataFilters || {};
    }

    const transformedData = PerformanceToolFilterDataTransformer.transform(
      rawData,
      form.kpis as string,
      form,
    );

    return transformedData;
  },
);

export const selectCurrentPageDefaults: (state: RootState) => FilterForm =
  createSelector(
    [selectCurrentPageDataFilters, selectCurrentPageData],
    (dataFilters, pageData): FilterForm => {
      if (!pageData) return {};

      if (pageData.defaultKpi) {
        return pageData.defaults || {};
      }

      if (!dataFilters || Object.keys(dataFilters).length === 0) {
        return pageData.defaults || {};
      }

      return FilterRegistry.calculateDefaults(dataFilters);
    },
  );

export const selectCurrentPageApplied = createSelector(
  [selectCurrentPageData],
  (pageData) => pageData?.applied || {},
);

const pageLoadingSelectors = new Map<string, (state: RootState) => boolean>();
const pageLoadedSelectors = new Map<string, (state: RootState) => boolean>();
const pageErrorSelectors = new Map<string, (state: RootState) => boolean>();

export const selectIsPageLoading = (pageName: string) => {
  if (!pageLoadingSelectors.has(pageName)) {
    pageLoadingSelectors.set(
      pageName,
      createSelector(
        [selectPageStatus(pageName)],
        (status) => status === 'loading',
      ),
    );
  }
  const selector = pageLoadingSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectIsPageLoaded = (pageName: string) => {
  if (!pageLoadedSelectors.has(pageName)) {
    pageLoadedSelectors.set(
      pageName,
      createSelector(
        [selectPageStatus(pageName)],
        (status) => status === 'loaded',
      ),
    );
  }
  const selector = pageLoadedSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectIsPageError = (pageName: string) => {
  if (!pageErrorSelectors.has(pageName)) {
    pageErrorSelectors.set(
      pageName,
      createSelector(
        [selectPageStatus(pageName)],
        (status) => status === 'error',
      ),
    );
  }
  const selector = pageErrorSelectors.get(pageName);
  if (!selector) {
    throw new Error(`Selector for page ${pageName} not found`);
  }
  return selector;
};

export const selectIsCurrentPageLoading = createSelector(
  [selectCurrentPageStatus],
  (status) => status === 'loading',
);

export const selectIsCurrentPageLoaded = createSelector(
  [selectCurrentPageStatus],
  (status) => status === 'loaded',
);

export const selectIsCurrentPageError = createSelector(
  [selectCurrentPageStatus],
  (status) => status === 'error',
);
