import {
  applyFilters,
  loadFilters,
  setCurrentPage,
  setFilterVisibility,
} from 'redux/slices/filters';

import { urlSyncMiddleware } from './urlSyncMiddleware';

// Mock window.history and window.location
const mockReplaceState = jest.fn();
const mockLocation = {
  search: '',
  pathname: '/test-page',
};

Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('urlSyncMiddleware', () => {
  let store: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplaceState.mockClear();
    mockLocation.search = '';
    mockLocation.pathname = '/test-page';

    store = {
      getState: jest.fn(),
    };

    next = jest.fn((action) => action);
  });

  describe('Action handling', () => {
    it('should call next with the action', () => {
      const action = { type: 'SOME_ACTION' };
      store.getState.mockReturnValue({
        filters: {
          currentPage: null,
          pages: {},
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      const result = middleware(action);

      expect(next).toHaveBeenCalledWith(action);
      expect(result).toBe(action);
    });

    it('should not sync URL for unrelated actions', () => {
      const action = { type: 'UNRELATED_ACTION' };
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: { zone: 'SAZ' },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('applyFilters action', () => {
    it('should sync filters to URL when filters are applied', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                zone: 'SAZ',
                country: 'BRA',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        '?filter_zone=SAZ&filter_country=BRA',
      );
    });

    it('should preserve non-filter query params', () => {
      mockLocation.search = '?tab=overview&other=value';

      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                zone: 'SAZ',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('tab=overview'),
      );
      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('other=value'),
      );
      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('filter_zone=SAZ'),
      );
    });

    it('should remove old filter params before adding new ones', () => {
      mockLocation.search = '?filter_zone=EUR&filter_country=BEL';

      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                zone: 'SAZ',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      // Should not contain old country param
      expect(mockReplaceState).not.toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('filter_country'),
      );
      // Should contain new zone value
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '?filter_zone=SAZ');
    });

    it('should skip null/undefined/empty filter values', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                zone: 'SAZ',
                country: null,
                brands: undefined,
                subBrands: '',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '?filter_zone=SAZ');
    });
  });

  describe('setCurrentPage action', () => {
    it('should sync filters to URL when page changes', () => {
      const action = setCurrentPage('new-page');
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'new-page',
          pages: {
            'new-page': {
              applied: {
                zone: 'EUR',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '?filter_zone=EUR');
    });
  });

  describe('loadFilters.fulfilled action', () => {
    it('should sync filters to URL when filters are loaded', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const action = loadFilters.fulfilled(
        {
          pageName: 'new-page',
          dataFilters: {},
        },
        'request-id',
        {
          pageName: 'new-page',
        },
      );

      store.getState.mockReturnValue({
        filters: {
          currentPage: 'new-page',
          previousPage: 'previous-page',
          pages: {
            'new-page': {
              applied: {
                zone: 'EUR',
              },
              isHidden: false,
              defaultKpi: 'volume',
            },
            'previous-page': {
              status: 'loaded',
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '?filter_zone=EUR');
      expect(setItemSpy).toHaveBeenCalledWith(
        'performance_tool_default_kpi',
        'volume',
      );

      setItemSpy.mockRestore();
    });
  });

  describe('setFilterVisibility action', () => {
    it('should NOT clear filters when visibility is set to true and URL has filter_* params', () => {
      mockLocation.search = '?filter_zone=SAZ&filter_country=BRA';

      const action = setFilterVisibility({ page: 'test-page', isHidden: true });
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: { zone: 'SAZ' },
              isHidden: true,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });
    it('should clear filters when visibility is true and URL has only non-filter params', () => {
      mockLocation.search = '?tab=overview&other=value';

      const action = setFilterVisibility({ page: 'test-page', isHidden: true });
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: { zone: 'SAZ' },
              isHidden: true,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('should not clear filters when visibility is set to false', () => {
      mockLocation.search = '?filter_zone=SAZ';

      const action = setFilterVisibility({
        page: 'test-page',
        isHidden: false,
      });
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: { zone: 'SAZ' },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('isHidden handling', () => {
    it('should not call replaceState when no filter params exist and isHidden is true', () => {
      mockLocation.search = '?tab=overview';

      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {},
              isHidden: true,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should not sync when currentPage is null', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: null,
          pages: {},
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('should not sync when page does not exist in pages', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'non-existent-page',
          pages: {},
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('should handle empty applied filters', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {},
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test-page');
    });

    it('should handle special characters in filter values', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                brands: "Beck's",
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('filter_brands'),
      );
    });

    it('should convert numeric values to strings', () => {
      const action = applyFilters();
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'test-page',
          pages: {
            'test-page': {
              applied: {
                time_frame: 2025,
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        '?filter_time_frame=2025',
      );
    });
  });

  describe('when navigating with filter_* already in URL', () => {
    it('should NOT override existing filter_* params on setCurrentPage', () => {
      mockLocation.search =
        '?filter_zone=SAZ&filter_country=ARG&filter_years=2025&filter_segments=Beer';

      const action = setCurrentPage('category_home');
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'category_home',
          previousPage: null,
          pages: {
            category_home: {
              applied: {
                zone: 'ABI',
                country: 'ABI',
                years: '2025',
                segments: 'Beer',
              },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('should NOT override existing filter_* params on loadFilters.fulfilled', () => {
      mockLocation.search = '?filter_zone=SAZ&filter_country=ARG';

      const action = loadFilters.fulfilled(
        { pageName: 'category_home', dataFilters: {} },
        'request-id',
        { pageName: 'category_home' },
      );

      store.getState.mockReturnValue({
        filters: {
          currentPage: 'category_home',
          previousPage: null,
          pages: {
            category_home: {
              applied: { zone: 'ABI', country: 'ABI' },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('should still write defaults to URL on setCurrentPage when no filter_* present', () => {
      mockLocation.search = '';

      const action = setCurrentPage('category_home');
      store.getState.mockReturnValue({
        filters: {
          currentPage: 'category_home',
          previousPage: null,
          pages: {
            category_home: {
              applied: { zone: 'ABI', country: 'ABI' },
              isHidden: false,
            },
          },
        },
      });

      const middleware = urlSyncMiddleware(store)(next);
      middleware(action);

      expect(mockReplaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('filter_zone=ABI'),
      );
    });
  });
});
