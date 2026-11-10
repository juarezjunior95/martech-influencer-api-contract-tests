import { useIntl } from 'react-intl';

import { renderHook } from '@testing-library/react-hooks';
import {
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
  useSubFilters,
} from 'hooks';

import { getCommercialResultsConfig } from '../../utils';
import { useBigNumberData } from '../useBigNumberData/useBigNumberData';
import { useWaterfallData } from '../useWaterfallData/useWaterfallData';
import { useKpiDrillDownData } from './useKpiDrillDownData';

const mockApplied = { kpis: 'volume', periods: 'YTD', zone: 'LATAM' };
const mockDataFilters = { zone: ['LATAM'] };
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();
const mockActiveSubFilters = { waterfall_view_by: 'brand' };
const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);

const mockBigNumbersData = {
  title: 'Big Numbers',
  loading: false,
  error: null,
  selectedBigNumberIndex: 0,
  handleBigNumbersSelect: jest.fn(),
  bigNumbersData: [],
};

const mockWaterfallData = {
  title: 'Waterfall',
  loading: false,
  error: null,
  isViewByDisabled: false,
  contextKey: 'ctx',
  handleViewByChange: jest.fn(),
  handleBarClick: jest.fn(),
  waterfallData: {} as any,
};

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
  usePageFilterManagement: jest.fn(),
  useSubFilters: jest.fn(),
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('../useBigNumberData/useBigNumberData', () => ({
  useBigNumberData: jest.fn(),
}));

jest.mock('../useWaterfallData/useWaterfallData', () => ({
  useWaterfallData: jest.fn(),
}));

jest.mock('../../utils', () => ({
  getCommercialResultsConfig: jest.fn(({ kpiSlug }: { kpiSlug: string }) => ({
    kpiGroup: kpiSlug,
    periodValues: ['YTD', 'L3M', 'MTD'],
    measure: '[ k hl ]',
    driversTitle: `${kpiSlug} Drivers`,
  })),
}));

function setupMocks(overrides: { applied?: Record<string, unknown> } = {}) {
  const applied = { ...mockApplied, ...overrides.applied };

  (usePageFilterApplied as jest.Mock).mockReturnValue({
    applied,
    isGlobalZone: applied.zone === 'ABI',
  });
  (usePageFilterData as jest.Mock).mockReturnValue({
    dataFilters: mockDataFilters,
  });
  (usePageFilterManagement as jest.Mock).mockReturnValue({
    updateForm: mockUpdateForm,
    apply: mockApply,
  });
  (useSubFilters as jest.Mock).mockReturnValue({
    activeSubFilters: mockActiveSubFilters,
  });
  (useIntl as jest.Mock).mockReturnValue({ formatMessage: mockFormatMessage });
  (useBigNumberData as jest.Mock).mockReturnValue(mockBigNumbersData);
  (useWaterfallData as jest.Mock).mockReturnValue(mockWaterfallData);
}

describe('useKpiDrillDownData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  describe('return shape', () => {
    it('returns all expected keys', () => {
      const { result } = renderHook(() => useKpiDrillDownData());

      expect(result.current).toMatchObject({
        applied: expect.any(Object),
        performanceInfo: expect.any(Object),
        config: expect.any(Object),
        bigNumbersData: expect.any(Object),
        waterfallData: expect.any(Object),
      });
    });

    it('exposes applied from usePageFilterApplied', () => {
      const { result } = renderHook(() => useKpiDrillDownData());

      expect(result.current.applied).toEqual(mockApplied);
    });

    it('exposes bigNumbersData from useBigNumberData', () => {
      const { result } = renderHook(() => useKpiDrillDownData());

      expect(result.current.bigNumbersData).toBe(mockBigNumbersData);
    });

    it('exposes waterfallData from useWaterfallData', () => {
      const { result } = renderHook(() => useKpiDrillDownData());

      expect(result.current.waterfallData).toBe(mockWaterfallData);
    });
  });

  describe('config', () => {
    it('calls getCommercialResultsConfig with the kpiSlug from applied.kpis', () => {
      setupMocks({ applied: { kpis: 'nr' } });

      renderHook(() => useKpiDrillDownData());

      expect(getCommercialResultsConfig).toHaveBeenCalledWith({
        kpiSlug: 'nr',
      });
    });

    it('defaults kpiSlug to "volume" when applied.kpis is undefined', () => {
      setupMocks({ applied: { kpis: undefined } });

      renderHook(() => useKpiDrillDownData());

      expect(getCommercialResultsConfig).toHaveBeenCalledWith({
        kpiSlug: 'volume',
      });
    });

    it('exposes the config returned by getCommercialResultsConfig', () => {
      const { result } = renderHook(() => useKpiDrillDownData());

      expect(result.current.config).toEqual({
        kpiGroup: 'volume',
        periodValues: ['YTD', 'L3M', 'MTD'],
        measure: '[ k hl ]',
        driversTitle: 'volume Drivers',
      });
    });
  });
});
