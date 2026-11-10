import { useNavigate } from 'react-router-dom';

import { renderHook } from '@testing-library/react-hooks';

import { NavigationConfig, useChartNavigation } from './useChartNavigation';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useChartNavigation', () => {
  let mockNavigate: jest.Mock;
  let mockOnNavigate: jest.Mock;
  let mockWindowOpen: jest.SpyInstance;
  let mockScrollTo: jest.SpyInstance;
  let mockScrollIntoView: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigate = jest.fn();
    mockOnNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    mockWindowOpen = jest.spyOn(window, 'open').mockImplementation();
    mockScrollTo = jest.spyOn(window, 'scrollTo').mockImplementation();
    mockScrollIntoView = jest.fn();
    jest.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic functionality', () => {
    it('should return handleNavigation function', () => {
      const config: NavigationConfig = {};
      const { result } = renderHook(() => useChartNavigation({ config }));

      expect(typeof result.current.handleNavigation).toBe('function');
    });

    it('should return early when index is null', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/test' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(null);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should return early when target does not exist', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/test' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(99);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('onNavigate callback', () => {
    it('should call onNavigate when provided', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/test' },
      };
      const { result } = renderHook(() =>
        useChartNavigation({ config, onNavigate: mockOnNavigate }),
      );

      result.current.handleNavigation(0);

      expect(mockOnNavigate).toHaveBeenCalledWith(0, {
        type: 'route',
        destination: '/test',
      });
    });

    it('should not call onNavigate when not provided', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/test' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockOnNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Route navigation', () => {
    it('should navigate to destination when type is route', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/test-page' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockNavigate).toHaveBeenCalledWith('/test-page');
    });

    it('should not navigate when destination is missing', () => {
      const config: NavigationConfig = {
        0: { type: 'route' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('External navigation', () => {
    it('should open external link when type is external', () => {
      const config: NavigationConfig = {
        0: { type: 'external', destination: 'https://example.com' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer',
      );
    });

    it('should not open when destination is missing', () => {
      const config: NavigationConfig = {
        0: { type: 'external' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });

  describe('Scroll navigation', () => {
    it('should scroll to top when destination is "top"', () => {
      const config: NavigationConfig = {
        0: { type: 'scroll', destination: 'top' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should scroll to bottom when destination is "bottom"', () => {
      const config: NavigationConfig = {
        0: { type: 'scroll', destination: 'bottom' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    });

    it('should scroll to element when destination is a selector', () => {
      const config: NavigationConfig = {
        0: { type: 'scroll', destination: '#section-id' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(document.querySelector).toHaveBeenCalledWith('#section-id');
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });

    it('should handle scroll error gracefully when element not found', () => {
      jest.spyOn(document, 'querySelector').mockReturnValue(null);
      const config: NavigationConfig = {
        0: { type: 'scroll', destination: '#invalid' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      expect(() => {
        result.current.handleNavigation(0);
      }).not.toThrow();
    });

    it('should handle scroll error gracefully when scrollIntoView throws', () => {
      const mockElement = {
        scrollIntoView: jest.fn(() => {
          throw new Error('Scroll error');
        }),
      };
      jest.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);
      const config: NavigationConfig = {
        0: { type: 'scroll', destination: '#element' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      expect(() => {
        result.current.handleNavigation(0);
      }).not.toThrow();
    });

    it('should not scroll when destination is missing', () => {
      const config: NavigationConfig = {
        0: { type: 'scroll' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockScrollTo).not.toHaveBeenCalled();
      expect(document.querySelector).not.toHaveBeenCalled();
    });
  });

  describe('Action navigation', () => {
    it('should call handler when type is action', () => {
      const mockHandler = jest.fn();
      const config: NavigationConfig = {
        0: { type: 'action', handler: mockHandler },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should not throw when handler is missing', () => {
      const config: NavigationConfig = {
        0: { type: 'action' },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      expect(() => {
        result.current.handleNavigation(0);
      }).not.toThrow();
    });
  });

  describe('Multiple navigation types', () => {
    it('should handle different navigation types in same config', () => {
      const config: NavigationConfig = {
        0: { type: 'route', destination: '/page1' },
        1: { type: 'external', destination: 'https://example.com' },
        2: { type: 'scroll', destination: 'top' },
        3: { type: 'action', handler: jest.fn() },
      };
      const { result } = renderHook(() => useChartNavigation({ config }));

      result.current.handleNavigation(0);
      expect(mockNavigate).toHaveBeenCalledWith('/page1');

      result.current.handleNavigation(1);
      expect(mockWindowOpen).toHaveBeenCalled();

      result.current.handleNavigation(2);
      expect(mockScrollTo).toHaveBeenCalled();

      result.current.handleNavigation(3);
      expect(config[3].handler).toHaveBeenCalled();
    });
  });
});
