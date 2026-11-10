import { useLocation } from 'react-router-dom';

import { renderHook } from '@testing-library/react-hooks';
import { useHomeUrl } from 'config/platformUrls';

import { useBreadcrumbsFromRoute } from './useBreadcrumbsFromRoute';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('config/platformUrls', () => ({
  useHomeUrl: jest.fn(),
}));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockUseHomeUrl = useHomeUrl as jest.MockedFunction<typeof useHomeUrl>;

describe('useBreadcrumbsFromRoute', () => {
  const HOME_URL = 'https://one.martech.uat.bees-platform.dev';

  beforeEach(() => {
    mockUseHomeUrl.mockReturnValue(HOME_URL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array for root path', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([]);
  });

  it('should generate breadcrumbs for pillar route with external link', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: `${HOME_URL}/?pillar=value-creation`,
        pageName: 'Value Creation',
      },
    ]);
  });

  it('should generate breadcrumbs for multi-level route', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/performance-tool/drill-down',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: `${HOME_URL}/?pillar=value-creation`,
        pageName: 'Value Creation',
      },
      {
        href: '/value-creation/performance-tool',
        pageName: 'Performance Tool',
      },
      {
        href: '#',
        pageName: 'Drill Down',
      },
    ]);
  });

  it('should use segment name as label when not in ROUTE_LABELS', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/unknown-page',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: `${HOME_URL}/?pillar=value-creation`,
        pageName: 'Value Creation',
      },
      {
        href: '#',
        pageName: 'unknown-page',
      },
    ]);
  });

  it('should generate internal links for intermediate segments', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/portfolio-performance/overview',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: `${HOME_URL}/?pillar=value-creation`,
        pageName: 'Value Creation',
      },
      {
        href: '/value-creation/portfolio-performance',
        pageName: 'Portfolio Performance',
      },
      {
        href: '#',
        pageName: 'overview',
      },
    ]);
  });

  it('should handle all pillar segments correctly', () => {
    const pillars = [
      'value-creation',
      'portfolio-brand',
      'category',
      'consumer',
      'connections-creativity',
      'innovation',
      'trade-execution',
    ];

    pillars.forEach((pillar) => {
      mockUseLocation.mockReturnValue({
        pathname: `/${pillar}`,
        search: '',
        hash: '',
        state: null,
        key: 'default',
      });

      const { result } = renderHook(() => useBreadcrumbsFromRoute());

      expect(result.current[0].href).toBe(`${HOME_URL}/?pillar=${pillar}`);
    });
  });

  it('should mark last segment with # as href', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/growth-league/overview',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    const lastItem = result.current[result.current.length - 1];
    expect(lastItem.href).toBe('#');
    expect(lastItem.pageName).toBe('overview');
  });

  it('should handle non-pillar first segment as internal link', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/development/components',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: '/development',
        pageName: 'development',
      },
      {
        href: '#',
        pageName: 'components',
      },
    ]);
  });

  it('should update breadcrumbs when location changes', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/growth-league',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result, rerender } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current.length).toBe(2);
    expect(result.current[1].pageName).toBe('Growth League');

    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/performance-tool/drill-down',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    rerender();

    expect(result.current.length).toBe(3);
    expect(result.current[1].pageName).toBe('Performance Tool');
    expect(result.current[2].pageName).toBe('Drill Down');
  });

  it('should handle routes with tabs correctly', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/value-creation/performance-review',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { result } = renderHook(() => useBreadcrumbsFromRoute());

    expect(result.current).toEqual([
      {
        href: `${HOME_URL}/?pillar=value-creation`,
        pageName: 'Value Creation',
      },
      {
        href: '#',
        pageName: 'Performance Review',
      },
    ]);
  });
});
