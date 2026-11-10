import { act, renderHook } from '@testing-library/react-hooks';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { PageIndexes } from 'pages/types';

import { usePageIndexes } from './usePageIndexes';
import { calculatePageIndexes } from './utils';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
}));

jest.mock('./utils', () => ({
  calculatePageIndexes: jest.fn(),
}));

describe('usePageIndexes', () => {
  const mockUseCurrentPage = useCurrentPage as jest.Mock;
  const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
  const mockCalculatePageIndexes = calculatePageIndexes as jest.Mock;

  let mockContainerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockContainerRef = {
      current: document.createElement('div'),
    };

    mockUseCurrentPage.mockReturnValue({
      currentPage: 'test-page',
    });

    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'LATAM', country: 'Brazil' },
    });

    mockCalculatePageIndexes.mockReturnValue({});
  });

  describe('Initial State', () => {
    it('should initialize with empty pageIndexes', () => {
      mockCalculatePageIndexes.mockReturnValue({});

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.pageIndexes).toEqual({});
      expect(result.current.totalPages).toBe(0);
    });

    it('should call calculatePageIndexes on mount', () => {
      renderHook(() => usePageIndexes(mockContainerRef));

      expect(mockCalculatePageIndexes).toHaveBeenCalledWith(mockContainerRef);
      expect(mockCalculatePageIndexes).toHaveBeenCalledTimes(1);
    });

    it('should call useCurrentPage and usePageFilterApplied on mount', () => {
      renderHook(() => usePageIndexes(mockContainerRef));

      expect(mockUseCurrentPage).toHaveBeenCalled();
      expect(mockUsePageFilterApplied).toHaveBeenCalled();
    });

    it('should initialize with calculated pageIndexes', () => {
      const mockIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.pageIndexes).toEqual(mockIndexes);
      expect(result.current.totalPages).toBe(2);
    });
  });

  describe('updateIndexes', () => {
    it('should update pageIndexes when called', () => {
      const initialIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
      };
      const updatedIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      };

      mockCalculatePageIndexes.mockReturnValueOnce(initialIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(1);

      mockCalculatePageIndexes.mockReturnValueOnce(updatedIndexes);

      act(() => {
        result.current.updateIndexes();
      });

      expect(result.current.pageIndexes).toEqual(updatedIndexes);
      expect(result.current.totalPages).toBe(2);
    });

    it('should call calculatePageIndexes with containerRef', () => {
      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      mockCalculatePageIndexes.mockClear();

      act(() => {
        result.current.updateIndexes();
      });

      expect(mockCalculatePageIndexes).toHaveBeenCalledWith(mockContainerRef);
    });

    it('should maintain stable function reference', () => {
      const { result, rerender } = renderHook(() =>
        usePageIndexes(mockContainerRef),
      );

      const firstUpdateIndexes = result.current.updateIndexes;

      rerender();

      expect(result.current.updateIndexes).toBe(firstUpdateIndexes);
    });
  });

  describe('getPageByName', () => {
    it('should return page info for existing page', () => {
      const mockIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      const pageInfo = result.current.getPageByName('page1');

      expect(pageInfo).toEqual({ index: 1, name: 'page1' });
    });

    it('should return undefined for non-existing page', () => {
      const mockIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      const pageInfo = result.current.getPageByName('nonExisting');

      expect(pageInfo).toBeUndefined();
    });

    it('should return undefined when pageIndexes is empty', () => {
      mockCalculatePageIndexes.mockReturnValue({});

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      const pageInfo = result.current.getPageByName('page1');

      expect(pageInfo).toBeUndefined();
    });

    it('should maintain stable function reference', () => {
      const { result, rerender } = renderHook(() =>
        usePageIndexes(mockContainerRef),
      );

      const firstGetPageByName = result.current.getPageByName;

      rerender();

      expect(result.current.getPageByName).toBe(firstGetPageByName);
    });

    it('should update when pageIndexes change', () => {
      const initialIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
      };
      const updatedIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      };

      mockCalculatePageIndexes.mockReturnValueOnce(initialIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.getPageByName('page2')).toBeUndefined();

      mockCalculatePageIndexes.mockReturnValueOnce(updatedIndexes);

      act(() => {
        result.current.updateIndexes();
      });

      expect(result.current.getPageByName('page2')).toEqual({
        index: 2,
        name: 'page2',
      });
    });
  });

  describe('totalPages', () => {
    it('should return 0 when no pages exist', () => {
      mockCalculatePageIndexes.mockReturnValue({});

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(0);
    });

    it('should return correct count for single page', () => {
      mockCalculatePageIndexes.mockReturnValue({
        page1: { index: 1, name: 'page1' },
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(1);
    });

    it('should return correct count for multiple pages', () => {
      mockCalculatePageIndexes.mockReturnValue({
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
        page3: { index: 3, name: 'page3' },
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(3);
    });

    it('should update when pageIndexes change', () => {
      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(1);

      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      });

      act(() => {
        result.current.updateIndexes();
      });

      expect(result.current.totalPages).toBe(2);
    });
  });

  describe('containerRef Changes', () => {
    it('should recalculate when containerRef changes', () => {
      const { rerender } = renderHook(({ ref }) => usePageIndexes(ref), {
        initialProps: { ref: mockContainerRef },
      });

      expect(mockCalculatePageIndexes).toHaveBeenCalledTimes(1);

      const newContainerRef = {
        current: document.createElement('div'),
      };

      mockCalculatePageIndexes.mockClear();

      rerender({ ref: newContainerRef });

      expect(mockCalculatePageIndexes).toHaveBeenCalledWith(newContainerRef);
    });

    it('should handle null containerRef', () => {
      const nullRef: React.RefObject<HTMLDivElement> = {
        current: null,
      };

      mockCalculatePageIndexes.mockReturnValue({});

      const { result } = renderHook(() => usePageIndexes(nullRef));

      expect(result.current.pageIndexes).toEqual({});
      expect(mockCalculatePageIndexes).toHaveBeenCalledWith(nullRef);
    });
  });

  describe('applied filters Integration', () => {
    it('should recalculate when applied filters change', () => {
      const { rerender } = renderHook(() => usePageIndexes(mockContainerRef));

      mockCalculatePageIndexes.mockClear();

      mockUsePageFilterApplied.mockReturnValue({
        applied: { zone: 'NAM', country: 'USA' },
      });

      rerender();

      expect(mockCalculatePageIndexes).toHaveBeenCalled();
    });

    it('should handle null applied filters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.pageIndexes).toBeDefined();
    });

    it('should handle undefined applied filters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: undefined,
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.pageIndexes).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle page with element property', () => {
      const mockElement = document.createElement('section');
      const mockIndexes: PageIndexes = {
        page1: { index: 1, name: 'page1', element: mockElement },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      const pageInfo = result.current.getPageByName('page1');

      expect(pageInfo?.element).toBe(mockElement);
    });

    it('should handle page names with special characters', () => {
      const mockIndexes: PageIndexes = {
        'page-1': { index: 1, name: 'page-1' },
        page_2: { index: 2, name: 'page_2' },
        'page.3': { index: 3, name: 'page.3' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.getPageByName('page-1')).toBeDefined();
      expect(result.current.getPageByName('page_2')).toBeDefined();
      expect(result.current.getPageByName('page.3')).toBeDefined();
      expect(result.current.totalPages).toBe(3);
    });

    it('should handle empty string as page name', () => {
      const mockIndexes: PageIndexes = {
        '': { index: 1, name: '' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.getPageByName('')).toBeDefined();
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle very large number of pages', () => {
      const mockIndexes: PageIndexes = {};
      for (let i = 1; i <= 100; i++) {
        mockIndexes[`page${i}`] = { index: i, name: `page${i}` };
      }

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(100);
      expect(result.current.getPageByName('page50')).toEqual({
        index: 50,
        name: 'page50',
      });
    });

    it('should handle calculatePageIndexes returning different objects', () => {
      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(1);

      mockCalculatePageIndexes.mockReturnValueOnce({});

      act(() => {
        result.current.updateIndexes();
      });

      expect(result.current.totalPages).toBe(0);
    });
  });

  describe('Multiple Hook Instances', () => {
    it('should work correctly with multiple instances', () => {
      const containerRef1 = { current: document.createElement('div') };
      const containerRef2 = { current: document.createElement('div') };

      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
      });

      const { result: result1 } = renderHook(() =>
        usePageIndexes(containerRef1),
      );

      mockCalculatePageIndexes.mockReturnValueOnce({
        page2: { index: 1, name: 'page2' },
      });

      const { result: result2 } = renderHook(() =>
        usePageIndexes(containerRef2),
      );

      expect(result1.current.getPageByName('page1')).toBeDefined();
      expect(result1.current.getPageByName('page2')).toBeUndefined();

      expect(result2.current.getPageByName('page2')).toBeDefined();
      expect(result2.current.getPageByName('page1')).toBeUndefined();
    });
  });

  describe('Return Value Structure', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current).toHaveProperty('pageIndexes');
      expect(result.current).toHaveProperty('updateIndexes');
      expect(result.current).toHaveProperty('getPageByName');
      expect(result.current).toHaveProperty('totalPages');
    });

    it('should return correct types for each property', () => {
      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(typeof result.current.pageIndexes).toBe('object');
      expect(typeof result.current.updateIndexes).toBe('function');
      expect(typeof result.current.getPageByName).toBe('function');
      expect(typeof result.current.totalPages).toBe('number');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical pagination scenario', () => {
      const mockIndexes: PageIndexes = {
        overview: { index: 1, name: 'overview' },
        details: { index: 2, name: 'details' },
        summary: { index: 3, name: 'summary' },
      };

      mockCalculatePageIndexes.mockReturnValue(mockIndexes);

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(3);
      expect(result.current.getPageByName('overview')?.index).toBe(1);
      expect(result.current.getPageByName('details')?.index).toBe(2);
      expect(result.current.getPageByName('summary')?.index).toBe(3);
    });

    it('should handle dynamic content update', () => {
      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
      });

      const { result } = renderHook(() => usePageIndexes(mockContainerRef));

      expect(result.current.totalPages).toBe(2);

      mockCalculatePageIndexes.mockReturnValueOnce({
        page1: { index: 1, name: 'page1' },
        page2: { index: 2, name: 'page2' },
        page3: { index: 3, name: 'page3' },
        page4: { index: 4, name: 'page4' },
      });

      act(() => {
        result.current.updateIndexes();
      });

      expect(result.current.totalPages).toBe(4);
    });

    it('should handle filter change triggering recalculation', () => {
      const initialFilters = { zone: 'LATAM' };
      const updatedFilters = { zone: 'NAM' };

      mockUsePageFilterApplied.mockReturnValue({ applied: initialFilters });

      const { rerender } = renderHook(() => usePageIndexes(mockContainerRef));

      const initialCallCount = mockCalculatePageIndexes.mock.calls.length;

      mockUsePageFilterApplied.mockReturnValue({ applied: updatedFilters });

      rerender();

      expect(mockCalculatePageIndexes.mock.calls.length).toBeGreaterThan(
        initialCallCount,
      );
    });
  });
});
