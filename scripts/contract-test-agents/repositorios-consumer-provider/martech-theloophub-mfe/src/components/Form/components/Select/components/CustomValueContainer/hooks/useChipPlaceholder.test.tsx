import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { Option } from 'models/Filters';

import {
  type ChipPlaceholderValue,
  useChipPlaceholder,
} from './useChipPlaceholder';

describe('useChipPlaceholder', () => {
  it('returns null when getChipPlaceholder is undefined', () => {
    const currentValueRef: React.MutableRefObject<ChipPlaceholderValue> = {
      current: { label: 'A', value: 'a' },
    };

    const { result } = renderHook(() =>
      useChipPlaceholder(undefined, 'a', currentValueRef),
    );

    expect(result.current).toBeNull();
  });

  it('returns placeholder from getChipPlaceholder when value is set', () => {
    const currentValueRef: React.MutableRefObject<ChipPlaceholderValue> = {
      current: { label: 'A', value: 'a' },
    };
    const getChipPlaceholder = jest.fn(() => <span>chip</span>);

    const { result } = renderHook(() =>
      useChipPlaceholder(getChipPlaceholder, 'a', currentValueRef),
    );

    expect(getChipPlaceholder).toHaveBeenCalled();
    expect(result.current).not.toBeNull();
  });

  it('reuses cached placeholder when valueKey is unchanged but getChipPlaceholder identity changes', () => {
    const currentValueRef: React.MutableRefObject<ChipPlaceholderValue> = {
      current: { label: 'A', value: 'a' },
    };
    const getChipPlaceholder1 = jest.fn(() => <span>chip</span>);
    const getChipPlaceholder2 = jest.fn(() => <span>other</span>);

    const { result, rerender } = renderHook(
      ({ gcp }: { gcp: typeof getChipPlaceholder1 }) =>
        useChipPlaceholder(gcp, 'a', currentValueRef),
      { initialProps: { gcp: getChipPlaceholder1 } },
    );

    expect(getChipPlaceholder1).toHaveBeenCalledTimes(1);
    expect(getChipPlaceholder2).not.toHaveBeenCalled();

    rerender({ gcp: getChipPlaceholder2 });

    expect(getChipPlaceholder1).toHaveBeenCalledTimes(1);
    expect(getChipPlaceholder2).not.toHaveBeenCalled();
    expect(result.current).not.toBeNull();
  });

  it('returns null when current value is cleared after placeholder was shown', () => {
    const currentValueRef: React.MutableRefObject<ChipPlaceholderValue> = {
      current: { label: 'A', value: 'a' },
    };
    const getChipPlaceholder = jest.fn(() => <span>chip</span>);

    const { result, rerender } = renderHook(
      ({
        valueKey,
        value,
      }: {
        valueKey: string | null;
        value: Option | null;
      }) => {
        currentValueRef.current = value;
        return useChipPlaceholder(
          getChipPlaceholder,
          valueKey,
          currentValueRef,
        );
      },
      {
        initialProps: {
          valueKey: 'a' as string | null,
          value: { label: 'A', value: 'a' } as Option | null,
        },
      },
    );

    expect(result.current).not.toBeNull();

    rerender({ valueKey: null, value: null });

    expect(result.current).toBeNull();
  });
});
