import { act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useBreadcrumbs } from 'components/Breadcrumbs/hooks/useBreadcrumbs';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';

describe('useBreadcrumbs Hook', () => {
  describe('With less than 3 pages', () => {
    it('should not collapse with 1 page', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(false);
      expect(result.current.visibleItems).toEqual(mockPageList);
      expect(result.current.hiddenItemsCount).toBe(0);
    });

    it('should not collapse with 2 pages', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(false);
      expect(result.current.visibleItems).toEqual(mockPageList);
      expect(result.current.hiddenItemsCount).toBe(0);
    });

    it('should not collapse with 3 pages', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(false);
      expect(result.current.visibleItems).toEqual(mockPageList);
      expect(result.current.hiddenItemsCount).toBe(0);
    });
  });

  describe('With more than 3 pages', () => {
    it('should collapse with 4 pages and show first, second to last and last', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems).toEqual([
        mockPageList[0],
        mockPageList[2],
        mockPageList[3],
      ]);
      expect(result.current.hiddenItemsCount).toBe(1);
    });

    it('should collapse with 5 pages', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
        { href: '/page-5', pageName: 'Página 5' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems).toEqual([
        mockPageList[0],
        mockPageList[3],
        mockPageList[4],
      ]);
      expect(result.current.hiddenItemsCount).toBe(2);
    });

    it('should collapse with 10 pages', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = Array.from(
        { length: 10 },
        (_, idx) => ({
          href: `/page-${idx + 1}`,
          pageName: `Página ${idx + 1}`,
        }),
      );

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems).toEqual([
        mockPageList[0],
        mockPageList[8],
        mockPageList[9],
      ]);
      expect(result.current.hiddenItemsCount).toBe(7);
    });
  });

  describe('isExpanded state', () => {
    it('should start with isExpanded as false', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
    });

    it('should expand when setIsExpanded(true) is called', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems.length).toBe(3);

      act(() => {
        result.current.setIsExpanded(true);
      });

      expect(result.current.shouldCollapse).toBe(false);
      expect(result.current.visibleItems).toEqual(mockPageList);
      expect(result.current.hiddenItemsCount).toBe(0);
    });

    it('should collapse again when setIsExpanded(false) is called', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      act(() => {
        result.current.setIsExpanded(true);
      });

      expect(result.current.shouldCollapse).toBe(false);

      act(() => {
        result.current.setIsExpanded(false);
      });

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems.length).toBe(3);
    });

    it('should allow multiple alternations between expanded and collapsed', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);

      act(() => {
        result.current.setIsExpanded(true);
      });
      expect(result.current.shouldCollapse).toBe(false);

      act(() => {
        result.current.setIsExpanded(false);
      });
      expect(result.current.shouldCollapse).toBe(true);

      act(() => {
        result.current.setIsExpanded(true);
      });
      expect(result.current.shouldCollapse).toBe(false);
    });
  });

  describe('setIsExpanded function', () => {
    it('should return a setIsExpanded function', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(typeof result.current.setIsExpanded).toBe('function');
    });

    it('should not change shouldCollapse when there are 3 or less pages', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(false);

      act(() => {
        result.current.setIsExpanded(true);
      });

      expect(result.current.shouldCollapse).toBe(false);
    });
  });

  describe('Extreme cases', () => {
    it('should handle empty list', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(false);
      expect(result.current.visibleItems).toEqual([]);
      expect(result.current.hiddenItemsCount).toBe(0);
    });

    it('should calculate hiddenItemsCount correctly', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = Array.from(
        { length: 20 },
        (_, idx) => ({
          href: `/page-${idx + 1}`,
          pageName: `Página ${idx + 1}`,
        }),
      );

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);
      expect(result.current.visibleItems.length).toBe(3);
      expect(result.current.hiddenItemsCount).toBe(17);
    });
  });

  describe('Return of the hook', () => {
    it('should return all expected properties', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current).toHaveProperty('setIsExpanded');
      expect(result.current).toHaveProperty('shouldCollapse');
      expect(result.current).toHaveProperty('visibleItems');
      expect(result.current).toHaveProperty('hiddenItemsCount');
      expect(result.current).toHaveProperty('containerRef');
    });

    it('should return correct types for each property', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(typeof result.current.setIsExpanded).toBe('function');
      expect(typeof result.current.shouldCollapse).toBe('boolean');
      expect(Array.isArray(result.current.visibleItems)).toBe(true);
      expect(typeof result.current.hiddenItemsCount).toBe('number');
      expect(result.current.containerRef).toHaveProperty('current');
    });
  });

  describe('Logic of visibleItems', () => {
    it('should return all items when should not collapse', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.visibleItems).toEqual(mockPageList);
    });

    it('should return first, second to last and last when should collapse', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
        { href: '/page-5', pageName: 'Página 5' },
        { href: '/page-6', pageName: 'Página 6' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.visibleItems).toEqual([
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-5', pageName: 'Página 5' },
        { href: '/page-6', pageName: 'Página 6' },
      ]);
    });

    it('should maintain the structure of visible items', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/home', pageName: 'Home' },
        { href: '/products', pageName: 'Produtos' },
        { href: '/products/category', pageName: 'Categoria' },
        { href: '/products/category/item', pageName: 'Item' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      result.current.visibleItems.forEach((item) => {
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('pageName');
        expect(typeof item.href).toBe('string');
        expect(typeof item.pageName).toBe('string');
      });
    });
  });

  describe('Click outside behavior', () => {
    it('should collapse when clicking outside the container', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      const containerElement = document.createElement('ul');
      act(() => {
        if (result.current.containerRef.current === null) {
          result.current.containerRef.current = containerElement;
        }
        result.current.setIsExpanded(true);
      });

      expect(result.current.shouldCollapse).toBe(false);

      const outsideElement = document.createElement('div');
      document.body.appendChild(containerElement);
      document.body.appendChild(outsideElement);

      act(() => {
        fireEvent.mouseDown(outsideElement);
      });

      expect(result.current.shouldCollapse).toBe(true);

      document.body.removeChild(containerElement);
      document.body.removeChild(outsideElement);
    });

    it('should not collapse when clicking inside the container', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      const containerElement = document.createElement('ul');
      act(() => {
        if (result.current.containerRef.current === null) {
          result.current.containerRef.current = containerElement;
        }
        result.current.setIsExpanded(true);
      });

      expect(result.current.shouldCollapse).toBe(false);

      document.body.appendChild(containerElement);

      act(() => {
        fireEvent.mouseDown(containerElement);
      });

      expect(result.current.shouldCollapse).toBe(false);

      document.body.removeChild(containerElement);
    });

    it('should not add event listener when not expanded', () => {
      const mockPageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const { result } = renderHook(() => useBreadcrumbs(mockPageList));

      expect(result.current.shouldCollapse).toBe(true);

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        fireEvent.mouseDown(outsideElement);
      });

      expect(result.current.shouldCollapse).toBe(true);

      document.body.removeChild(outsideElement);
    });
  });
});
