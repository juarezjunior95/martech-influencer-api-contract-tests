import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprExportPageLoading } from './useVolumePprExportPageLoading';

const allFalse = {
  sustainableGrowthOverview: false,
  sustainableGrowthByGrowthLever: false,
  participation: false,
  volume: false,
  netRevenue: false,
  marketShare: false,
  portfolioPerformance: false,
  brandPower: false,
  pnl: false,
  resourceAllocation: false,
};

describe('useVolumePprExportPageLoading', () => {
  it('returns false when every section flag is false', () => {
    const { result } = renderHook(() =>
      useVolumePprExportPageLoading(allFalse),
    );
    expect(result.current).toBe(false);
  });

  it('returns true when any section flag is true', () => {
    const { result } = renderHook(() =>
      useVolumePprExportPageLoading({
        ...allFalse,
        participation: true,
      }),
    );
    expect(result.current).toBe(true);
  });
});
