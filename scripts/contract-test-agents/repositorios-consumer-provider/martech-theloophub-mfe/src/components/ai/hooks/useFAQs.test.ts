import { act, renderHook } from '@testing-library/react-hooks';

import { useFAQs } from './useFAQs';

const mockFAQs = [
  { id: '1', query: 'What is sales trend?' },
  { id: '2', query: 'Show top brands' },
];

jest.mock('redux/api/insightsCopilot', () => ({
  useGetFAQsQuery: () => ({ data: mockFAQs, isLoading: false }),
}));

describe('useFAQs', () => {
  it('should expose items from RTK query', () => {
    const { result } = renderHook(() => useFAQs());
    expect(result.current.items).toBe(mockFAQs);
  });

  it('should call onSelect with faq query on handleClick', () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useFAQs({ onSelect }));

    act(() => {
      result.current.handleClick(mockFAQs[0] as any);
    });

    expect(onSelect).toHaveBeenCalledWith('What is sales trend?');
  });

  it('should not throw when onSelect is not provided', () => {
    const { result } = renderHook(() => useFAQs());

    expect(() => {
      act(() => {
        result.current.handleClick(mockFAQs[0] as any);
      });
    }).not.toThrow();
  });
});
