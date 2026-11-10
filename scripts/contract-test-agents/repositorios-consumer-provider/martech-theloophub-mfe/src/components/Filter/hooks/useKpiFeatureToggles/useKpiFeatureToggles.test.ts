import { renderHook } from '@testing-library/react-hooks';

import { useKpiFeatureToggles } from './useKpiFeatureToggles';

jest.mock('hooks', () => ({
  useFeatureToggle: jest.fn(),
}));

import { useFeatureToggle } from 'hooks';

describe('useKpiFeatureToggles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('featureToggleMap', () => {
    it('should return correct feature toggle map when all are enabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      expect(result.current.featureToggleMap).toEqual({
        volume: true,
        netRevenue: true,
        cores: true,
        marketShare: true,
        brandPower: true,
      });
    });

    it('should return correct feature toggle map when some are disabled', () => {
      (useFeatureToggle as jest.Mock)
        .mockReturnValueOnce([true, false])
        .mockReturnValueOnce([false, false])
        .mockReturnValueOnce([true, false])
        .mockReturnValueOnce([false, false])
        .mockReturnValueOnce([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      expect(result.current.featureToggleMap).toEqual({
        volume: true,
        netRevenue: false,
        cores: true,
        marketShare: false,
        brandPower: true,
      });
    });
  });

  describe('filterOptionsByFeatureToggle', () => {
    it('should filter options based on feature toggles', () => {
      (useFeatureToggle as jest.Mock)
        .mockReturnValueOnce([true, false])
        .mockReturnValueOnce([false, false])
        .mockReturnValueOnce([true, false])
        .mockReturnValueOnce([false, false])
        .mockReturnValueOnce([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      const options = [
        { value: 'volume', label: 'Volume' },
        { value: 'nr', label: 'Net Revenue' },
        { value: 'cores', label: 'Cores' },
        { value: 'market_share', label: 'Market Share' },
        { value: 'power', label: 'Brand Power' },
      ];

      const filtered = result.current.filterOptionsByFeatureToggle(options);

      expect(filtered).toEqual([
        { value: 'volume', label: 'Volume' },
        { value: 'cores', label: 'Cores' },
        { value: 'power', label: 'Brand Power' },
      ]);
    });

    it('should keep all options when all feature toggles are enabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      const options = [
        { value: 'volume', label: 'Volume' },
        { value: 'nr', label: 'Net Revenue' },
        { value: 'cores', label: 'Cores' },
        { value: 'market_share', label: 'Market Share' },
        { value: 'power', label: 'Brand Power' },
      ];

      const filtered = result.current.filterOptionsByFeatureToggle(options);

      expect(filtered).toEqual(options);
    });

    it('should keep options that are not in the feature toggle map', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      const options = [
        { value: 'volume', label: 'Volume' },
        { value: 'custom_kpi', label: 'Custom KPI' },
        { value: 'another_kpi', label: 'Another KPI' },
      ];

      const filtered = result.current.filterOptionsByFeatureToggle(options);

      expect(filtered).toEqual(options);
    });

    it('should return empty array when all mapped options are disabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      const options = [
        { value: 'volume', label: 'Volume' },
        { value: 'nr', label: 'Net Revenue' },
      ];

      const filtered = result.current.filterOptionsByFeatureToggle(options);

      expect(filtered).toEqual([]);
    });

    it('should handle empty options array', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      const { result } = renderHook(() => useKpiFeatureToggles());

      const filtered = result.current.filterOptionsByFeatureToggle([]);

      expect(filtered).toEqual([]);
    });
  });
});
