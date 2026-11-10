import { act, renderHook } from '@testing-library/react-hooks';

import { buildInnovationHubPerformanceBreakdownHref } from '../../utils/buildInnovationHubPerformanceBreakdownHref';
import { useInnovationHubPerformanceBreakdownNavigation } from './useInnovationHubPerformanceBreakdownNavigation';

const mockSearchParams = new URLSearchParams('foo=1');
const mockNavigate = jest.fn();
const mockSetSubFilterValue = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, jest.fn()],
}));

jest.mock('hooks', () => ({
  useSubFilters: () => ({
    setSubFilterValue: mockSetSubFilterValue,
  }),
}));

describe('useInnovationHubPerformanceBreakdownNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined onClick resolver when card is not navigable', () => {
    const { result } = renderHook(() =>
      useInnovationHubPerformanceBreakdownNavigation(['volume']),
    );

    expect(result.current.resolveOnClick('nr')).toBeUndefined();
  });

  it('should navigate and set sub-filter when navigable card handler runs', () => {
    const { result } = renderHook(() =>
      useInnovationHubPerformanceBreakdownNavigation(['volume', 'nr']),
    );

    const onClick = result.current.resolveOnClick('nr');
    expect(onClick).toEqual(expect.any(Function));

    act(() => {
      onClick?.();
    });

    expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', 'nr');
    expect(mockNavigate).toHaveBeenCalledWith(
      buildInnovationHubPerformanceBreakdownHref(mockSearchParams, 'nr'),
    );
  });
});
