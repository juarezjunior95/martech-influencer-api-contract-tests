import { act, renderHook } from '@testing-library/react-hooks';

import { useSorting } from './useSorting';

describe('useSorting', () => {
  describe('handleSortClick', () => {
    it('should not call onSortChange when not provided', () => {
      const { result } = renderHook(() => useSorting({}));

      expect(() =>
        act(() => {
          result.current.handleSortClick('col1');
        }),
      ).not.toThrow();
    });

    it('should cycle from none to asc', () => {
      const onSortChange = jest.fn();
      const { result } = renderHook(() => useSorting({ onSortChange }));

      act(() => {
        result.current.handleSortClick('col1');
      });

      expect(onSortChange).toHaveBeenCalledWith({
        columnId: 'col1',
        direction: 'asc',
      });
    });

    it('should cycle from asc to desc', () => {
      const onSortChange = jest.fn();
      const { result } = renderHook(() =>
        useSorting({
          sortState: { columnId: 'col1', direction: 'asc' },
          onSortChange,
        }),
      );

      act(() => {
        result.current.handleSortClick('col1');
      });

      expect(onSortChange).toHaveBeenCalledWith({
        columnId: 'col1',
        direction: 'desc',
      });
    });

    it('should cycle from desc to none', () => {
      const onSortChange = jest.fn();
      const { result } = renderHook(() =>
        useSorting({
          sortState: { columnId: 'col1', direction: 'desc' },
          onSortChange,
        }),
      );

      act(() => {
        result.current.handleSortClick('col1');
      });

      expect(onSortChange).toHaveBeenCalledWith({
        columnId: 'col1',
        direction: 'none',
      });
    });

    it('should start fresh when clicking different column', () => {
      const onSortChange = jest.fn();
      const { result } = renderHook(() =>
        useSorting({
          sortState: { columnId: 'col1', direction: 'asc' },
          onSortChange,
        }),
      );

      act(() => {
        result.current.handleSortClick('col2');
      });

      expect(onSortChange).toHaveBeenCalledWith({
        columnId: 'col2',
        direction: 'asc',
      });
    });
  });

  describe('getSortDirection', () => {
    it('should return undefined when no sortState', () => {
      const { result } = renderHook(() => useSorting({}));

      expect(result.current.getSortDirection('col1')).toBeUndefined();
    });

    it('should return direction for matching column', () => {
      const { result } = renderHook(() =>
        useSorting({
          sortState: { columnId: 'col1', direction: 'asc' },
        }),
      );

      expect(result.current.getSortDirection('col1')).toBe('asc');
    });

    it('should return undefined for non-matching column', () => {
      const { result } = renderHook(() =>
        useSorting({
          sortState: { columnId: 'col1', direction: 'asc' },
        }),
      );

      expect(result.current.getSortDirection('col2')).toBeUndefined();
    });
  });
});
