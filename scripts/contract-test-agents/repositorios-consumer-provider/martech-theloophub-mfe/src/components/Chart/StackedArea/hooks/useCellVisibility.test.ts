import { renderHook } from '@testing-library/react-hooks';

import type { StackedAreaColumn } from '../types';
import { useCellVisibility } from './useCellVisibility';

describe('useCellVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds height and showNumber to each segment', () => {
    const columns: StackedAreaColumn[] = [
      { label: 'Col1', segments: [{ value: 50 }, { value: 50 }] },
    ];

    const { result } = renderHook(() => useCellVisibility(columns, 300));

    expect(result.current[0].segments[0]).toHaveProperty('height');
    expect(result.current[0].segments[0]).toHaveProperty('showNumber');
    expect(result.current[0].segments[1]).toHaveProperty('height');
    expect(result.current[0].segments[1]).toHaveProperty('showNumber');
  });

  it('calculates height proportionally', () => {
    const columns: StackedAreaColumn[] = [
      { label: 'Col1', segments: [{ value: 50 }, { value: 50 }] },
    ];

    const { result } = renderHook(() => useCellVisibility(columns, 300));

    expect(result.current[0].segments[0].height).toBeCloseTo(150);
    expect(result.current[0].segments[1].height).toBeCloseTo(150);
  });

  it('sets showNumber to false for very small segments', () => {
    const columns: StackedAreaColumn[] = [
      { label: 'Col1', segments: [{ value: 99 }, { value: 1 }] },
    ];

    const { result } = renderHook(() => useCellVisibility(columns, 300));

    expect(result.current[0].segments[0].showNumber).toBe(true);
    expect(result.current[0].segments[1].showNumber).toBe(false);
  });

  it('returns memoized result when inputs do not change', () => {
    const columns: StackedAreaColumn[] = [
      { label: 'Col1', segments: [{ value: 50 }, { value: 50 }] },
    ];

    const { result, rerender } = renderHook(
      ({ cols, h }) => useCellVisibility(cols, h),
      { initialProps: { cols: columns, h: 300 } },
    );

    const first = result.current;
    rerender({ cols: columns, h: 300 });

    expect(result.current).toBe(first);
  });

  it('recalculates when chartHeight changes', () => {
    const columns: StackedAreaColumn[] = [
      { label: 'Col1', segments: [{ value: 50 }, { value: 50 }] },
    ];

    const { result, rerender } = renderHook(
      ({ cols, h }) => useCellVisibility(cols, h),
      { initialProps: { cols: columns, h: 300 } },
    );

    const first = result.current;
    rerender({ cols: columns, h: 600 });

    expect(result.current).not.toBe(first);
    expect(result.current[0].segments[0].height).toBeCloseTo(300);
  });
});
