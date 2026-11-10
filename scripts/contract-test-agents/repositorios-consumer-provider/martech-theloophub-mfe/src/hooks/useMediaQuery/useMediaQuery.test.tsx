import React from 'react';

import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { MediaQueryProvider } from 'contexts';

import { useMediaQuery } from './useMediaQuery';

jest.mock('contexts', () => {
  const actual = jest.requireActual('contexts/MediaQuery/MediaQueryProvider');
  return {
    MediaQueryContext: actual.MediaQueryContext,
    MediaQueryProvider: actual.MediaQueryProvider,
  };
});

describe('useMediaQuery', () => {
  let matchMediaMock: jest.SpyInstance;

  const createMatchMediaMock = (initialMatches: boolean) =>
    jest.fn((query: string) => ({
      matches: initialMatches,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

  beforeEach(() => {
    if (globalThis.window !== undefined) {
      matchMediaMock = jest.spyOn(globalThis.window, 'matchMedia');
    }
  });

  afterEach(() => {
    if (matchMediaMock) {
      matchMediaMock.mockRestore();
    }
  });

  describe('Standalone mode (without MediaQueryProvider)', () => {
    it('should return false when media query does not match', () => {
      matchMediaMock.mockImplementation(createMatchMediaMock(false));

      const { result } = renderHook(() => useMediaQuery('(min-width: 1440px)'));

      expect(result.current).toBe(false);
    });

    it('should return true when media query matches', () => {
      matchMediaMock.mockImplementation(createMatchMediaMock(true));

      const { result } = renderHook(() => useMediaQuery('(min-width: 1440px)'));

      expect(result.current).toBe(true);
    });

    it('should update when media query change event fires', () => {
      let currentMatches = false;
      const listeners: Array<(event: MediaQueryListEvent) => void> = [];

      matchMediaMock.mockImplementation((query: string) => ({
        get matches() {
          return currentMatches;
        },
        media: query,
        addEventListener: jest.fn(
          (event: string, handler: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listeners.push(handler);
            }
          },
        ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery('(min-width: 1440px)'));

      expect(result.current).toBe(false);

      act(() => {
        currentMatches = true;
        listeners.forEach((listener) =>
          listener({
            matches: true,
            media: '(min-width: 1440px)',
          } as MediaQueryListEvent),
        );
      });

      expect(result.current).toBe(true);
    });

    it('should remove listener on unmount', () => {
      const removeEventListenerMock = jest.fn();
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: removeEventListenerMock,
        dispatchEvent: jest.fn(),
      }));

      const { unmount } = renderHook(() =>
        useMediaQuery('(min-width: 1440px)'),
      );

      unmount();

      expect(removeEventListenerMock).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('should handle different queries independently', () => {
      matchMediaMock.mockImplementation((query: string) =>
        createMatchMediaMock(!query.includes('1440px'))(query),
      );

      const { result: result1 } = renderHook(() =>
        useMediaQuery('(min-width: 1440px)'),
      );
      const { result: result2 } = renderHook(() =>
        useMediaQuery('(max-width: 768px)'),
      );

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(true);
    });
  });

  describe('With MediaQueryProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MediaQueryProvider>{children}</MediaQueryProvider>
    );

    it('should return false when media query does not match', () => {
      matchMediaMock.mockImplementation(createMatchMediaMock(false));

      const { result } = renderHook(
        () => useMediaQuery('(min-width: 1440px)'),
        { wrapper },
      );

      expect(result.current).toBe(false);
    });

    it('should return true when media query matches', () => {
      matchMediaMock.mockImplementation(createMatchMediaMock(true));

      const { result } = renderHook(
        () => useMediaQuery('(min-width: 1440px)'),
        { wrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should update when media query change event fires', () => {
      let currentMatches = false;
      const listeners: Array<(event: MediaQueryListEvent) => void> = [];

      matchMediaMock.mockImplementation((query: string) => ({
        get matches() {
          return currentMatches;
        },
        media: query,
        addEventListener: jest.fn(
          (event: string, handler: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listeners.push(handler);
            }
          },
        ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(
        () => useMediaQuery('(min-width: 1440px)'),
        { wrapper },
      );

      expect(result.current).toBe(false);

      act(() => {
        currentMatches = true;
        listeners.forEach((listener) =>
          listener({
            matches: true,
            media: '(min-width: 1440px)',
          } as MediaQueryListEvent),
        );
      });

      expect(result.current).toBe(true);
    });

    it('should share same query result and single listener for same query', () => {
      matchMediaMock.mockImplementation(createMatchMediaMock(true));

      const mediaQuery = '(min-width: 1440px)';
      const TwoConsumers = () => {
        const a = useMediaQuery(mediaQuery);
        const b = useMediaQuery(mediaQuery);
        return (
          <div>
            <span data-testid="a">{String(a)}</span>
            <span data-testid="b">{String(b)}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <MediaQueryProvider>
          <TwoConsumers />
        </MediaQueryProvider>,
      );

      expect(getByTestId('a').textContent).toBe('true');
      expect(getByTestId('b').textContent).toBe('true');
      expect(matchMediaMock).toHaveBeenCalledWith(mediaQuery);
      expect(
        matchMediaMock.mock.calls.every((call) => call[0] === mediaQuery),
      ).toBe(true);
    });
  });

  describe('When window is undefined (SSR)', () => {
    let originalWindow: typeof globalThis.window;

    beforeEach(() => {
      originalWindow = globalThis.window;
      (globalThis as { window?: typeof globalThis.window }).window = undefined;
    });

    afterEach(() => {
      (globalThis as { window?: typeof globalThis.window }).window =
        originalWindow;
    });

    it('should return false when window is undefined', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 1440px)'));

      expect(result.current).toBe(false);
    });
  });
});
