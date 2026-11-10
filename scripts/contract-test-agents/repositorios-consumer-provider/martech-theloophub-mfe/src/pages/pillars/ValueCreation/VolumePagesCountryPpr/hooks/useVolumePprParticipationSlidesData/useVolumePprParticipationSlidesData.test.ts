import { renderHook } from '@testing-library/react-hooks';

import {
  countryParticipationExportTableConfig,
  globalParticipationExportTableConfig,
} from '../../components/Slides/ParticipationBreakdownByCohortSlide/config';
import { useVolumePprParticipationSlidesData } from './useVolumePprParticipationSlidesData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

const idle = {
  data: undefined,
  loading: false,
  error: null as Error | null,
};

const cohortRequest = {
  id: 'category_pos-book_grow-the-category_cohort',
  kpiGroup: 'pos',
  subFilters: {
    cohort: 'All',
    pos_kpi: 'participation',
    timeperiod: 'QTD',
  },
};

const countryManufactureRequest = {
  id: 'category_pos-book_lead-the-category_country_manufacture-participation',
  kpiGroup: 'pos',
  subFilters: {
    price_segment: 'all',
    timeperiod: 'QTD',
  },
};

const globalManufactureRequest = {
  id: 'category_pos-book_lead-the-category_global_manufacture-participation',
  kpiGroup: 'pos',
  subFilters: {
    price_segment: 'all',
    timeperiod: 'QTD',
  },
};

const countryRankingRequest = (skipRequest: boolean) => ({
  id: 'category_pos-book_lead-the-category_country_participation-ranking',
  kpiGroup: 'pos',
  subFilters: {
    timeperiod: 'QTD',
    cohort: 'All',
  },
  skipRequest,
});

const globalRankingRequest = (skipRequest: boolean) => ({
  id: 'category_pos-book_lead-the-category_global_participation-ranking',
  kpiGroup: 'pos',
  subFilters: {
    timeperiod: 'QTD',
    cohort: 'All',
  },
  skipRequest,
});

describe('useVolumePprParticipationSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idle);
  });

  it('calls useBffData for all participation endpoints with country ranking active when not global zone', () => {
    renderHook(() => useVolumePprParticipationSlidesData(false, 'BR'));

    expect(mockUseBffData).toHaveBeenCalledTimes(5);
    expect(mockUseBffData).toHaveBeenNthCalledWith(1, cohortRequest);
    expect(mockUseBffData).toHaveBeenNthCalledWith(
      2,
      countryManufactureRequest,
    );
    expect(mockUseBffData).toHaveBeenNthCalledWith(3, globalManufactureRequest);
    expect(mockUseBffData).toHaveBeenNthCalledWith(
      4,
      countryRankingRequest(false),
    );
    expect(mockUseBffData).toHaveBeenNthCalledWith(
      5,
      globalRankingRequest(true),
    );
  });

  it('calls useBffData with global ranking active and country ranking skipped when global zone', () => {
    renderHook(() => useVolumePprParticipationSlidesData(true, 'BR'));

    expect(mockUseBffData).toHaveBeenCalledTimes(5);
    expect(mockUseBffData).toHaveBeenNthCalledWith(
      4,
      countryRankingRequest(true),
    );
    expect(mockUseBffData).toHaveBeenNthCalledWith(
      5,
      globalRankingRequest(false),
    );
  });

  it('aggregates sectionLoading when any underlying request is loading', () => {
    mockUseBffData
      .mockReturnValueOnce({ ...idle, loading: true })
      .mockReturnValue(idle);

    const { result } = renderHook(() =>
      useVolumePprParticipationSlidesData(false, 'BR'),
    );

    expect(result.current.sectionLoading).toBe(true);
  });

  it('sets sectionLoading false when all requests are idle', () => {
    const { result } = renderHook(() =>
      useVolumePprParticipationSlidesData(false, 'BR'),
    );

    expect(result.current.sectionLoading).toBe(false);
  });

  it('requests the participation QTD BFF ids and applies skipRequest by isGlobalZone for ranking', () => {
    renderHook(() => useVolumePprParticipationSlidesData(true, 'BR'));

    const calls = mockUseBffData.mock.calls.map(
      (c) =>
        c[0] as {
          id: string;
          subFilters: Record<string, unknown>;
          skipRequest?: boolean;
        },
    );

    expect(calls.map((c) => c.id)).toEqual([
      'category_pos-book_grow-the-category_cohort',
      'category_pos-book_lead-the-category_country_manufacture-participation',
      'category_pos-book_lead-the-category_global_manufacture-participation',
      'category_pos-book_lead-the-category_country_participation-ranking',
      'category_pos-book_lead-the-category_global_participation-ranking',
    ]);
    // country ranking is skipped when isGlobalZone=true, global is active
    expect(calls[3].skipRequest).toBe(true);
    expect(calls[4].skipRequest).toBe(false);
    // all use QTD
    calls.forEach((c) => expect(c.subFilters.timeperiod).toBe('QTD'));
  });

  it('routes ranking to country when not global zone', () => {
    renderHook(() => useVolumePprParticipationSlidesData(false, 'BR'));

    const calls = mockUseBffData.mock.calls.map(
      (c) => c[0] as { skipRequest?: boolean },
    );
    expect(calls[3].skipRequest).toBe(false);
    expect(calls[4].skipRequest).toBe(true);
  });

  it("uses globalParticipationExportTableConfig and global manufacture data when countryValue === 'ABI'", () => {
    const globalManufacturePayload = { 'manufacture-participation': 'global' };
    const countryManufacturePayload = {
      'manufacture-participation': 'country',
    };
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (
        props.id ===
        'category_pos-book_lead-the-category_global_manufacture-participation'
      )
        return { ...idle, data: globalManufacturePayload };
      if (
        props.id ===
        'category_pos-book_lead-the-category_country_manufacture-participation'
      )
        return { ...idle, data: countryManufacturePayload };
      return idle;
    });

    const { result: abiResult } = renderHook(() =>
      useVolumePprParticipationSlidesData(false, 'ABI'),
    );
    expect(
      abiResult.current.participationBreakdownByCohortManufatureSlideData,
    ).toBe('global');
    expect(abiResult.current.manufactureParticipationExportTableConfig).toBe(
      globalParticipationExportTableConfig,
    );

    const { result: countryResult } = renderHook(() =>
      useVolumePprParticipationSlidesData(false, 'BR'),
    );
    expect(
      countryResult.current.participationBreakdownByCohortManufatureSlideData,
    ).toBe('country');
    expect(
      countryResult.current.manufactureParticipationExportTableConfig,
    ).toBe(countryParticipationExportTableConfig);
  });
});
