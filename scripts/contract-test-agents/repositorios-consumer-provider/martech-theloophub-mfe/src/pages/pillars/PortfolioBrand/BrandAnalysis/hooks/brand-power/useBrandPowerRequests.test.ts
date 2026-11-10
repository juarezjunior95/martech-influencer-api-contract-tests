import { renderHook } from '@testing-library/react-hooks';
import { useBffData, usePageFilterApplied, useSubFilters } from 'hooks';

import { useBrandPowerRequests } from './useBrandPowerRequests';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useBffData: jest.fn(),
  useSubFilters: jest.fn(),
}));

const BFF_VIEW_IDS = {
  power: 'portfolio-brand_brand-analysis_brand-power_brand-power',
  meaning: 'portfolio-brand_brand-analysis_brand-power_meaning',
  affinity: 'portfolio-brand_brand-analysis_brand-power_affinity',
  meet_needs: 'portfolio-brand_brand-analysis_brand-power_meet-needs',
  difference: 'portfolio-brand_brand-analysis_brand-power_difference',
  dynamic: 'portfolio-brand_brand-analysis_brand-power_dynamic',
  unique: 'portfolio-brand_brand-analysis_brand-power_unique',
  salience: 'portfolio-brand_brand-analysis_brand-power_salience',
  unaided_awareness:
    'portfolio-brand_brand-analysis_brand-power_unaided-awareness',
  brand_clarity: 'portfolio-brand_brand-analysis_brand-power_brand-clarity',
  occasion:
    'portfolio-brand_brand-analysis_brand-power_occasion-based-salience',
  imagery: 'portfolio-brand_brand-analysis_brand-power_imagery',
  bip: 'portfolio-brand_brand-analysis_brand-power_bip',
} as const;

describe('useBrandPowerRequests', () => {
  const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
  const mockUseBffData = useBffData as jest.Mock;
  const mockUseSubFilters = useSubFilters as jest.Mock;

  const getCallByBffId = (id: string) =>
    mockUseBffData.mock.calls.find((call) => call[0].id === id)?.[0];

  const renderUseBrandPowerRequests = ({
    quarterYearSelected = 'quarter',
    powerAwarenessSelected = 'unaided-awareness',
    enabled = {
      power: true,
      details: true,
    },
  }: {
    quarterYearSelected?: 'quarter' | 'year';
    enabled?: {
      power: boolean;
      details: boolean;
    };
    powerAwarenessSelected?: string;
  } = {}) =>
    renderHook(() =>
      useBrandPowerRequests({
        quarterYearSelected,
        powerAwarenessSelected,
        enabled,
      }),
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
      },
    });

    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });

    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_quarters: '2025-Q4',
        pc_time_frame_years: '2025',
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });
  });

  it('should call useBffData for all 13 KPIs', () => {
    renderUseBrandPowerRequests();

    expect(mockUseBffData).toHaveBeenCalledTimes(13);
  });

  it('should request only power when details are disabled', () => {
    renderUseBrandPowerRequests({
      enabled: {
        power: true,
        details: false,
      },
    });

    const powerCall = getCallByBffId(BFF_VIEW_IDS.power);
    const meaningCall = getCallByBffId(BFF_VIEW_IDS.meaning);
    const occasionCall = getCallByBffId(BFF_VIEW_IDS.occasion);
    const brandClarityCall = getCallByBffId(BFF_VIEW_IDS.brand_clarity);

    expect(powerCall.skipRequest).toBe(false);
    expect(meaningCall.skipRequest).toBe(true);
    expect(occasionCall.skipRequest).toBe(true);
    expect(brandClarityCall.skipRequest).toBe(true);
  });

  it('should keep power BFF subFilters as null without brand context', () => {
    renderUseBrandPowerRequests();

    expect(getCallByBffId(BFF_VIEW_IDS.power).subFilters).toBeNull();
  });

  it('should set power BFF subFilters to viewtype brand with brand context', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        brands_abi: 'Brahma',
        brands_comp: 'Crystal',
      },
    });

    renderUseBrandPowerRequests();

    expect(getCallByBffId(BFF_VIEW_IDS.power).subFilters).toEqual({
      viewtype: 'brand',
    });
  });

  it('should disable detail requests when country is ABI even if enabled.details=true', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'ABI',
      },
    });

    renderUseBrandPowerRequests({
      enabled: {
        power: true,
        details: true,
      },
    });

    const powerCall = getCallByBffId(BFF_VIEW_IDS.power);
    const meaningCall = getCallByBffId(BFF_VIEW_IDS.meaning);
    const imageryCall = getCallByBffId(BFF_VIEW_IDS.imagery);
    const bipCall = getCallByBffId(BFF_VIEW_IDS.bip);
    const brandClarityCall = getCallByBffId(BFF_VIEW_IDS.brand_clarity);

    expect(powerCall.skipRequest).toBe(false);
    expect(meaningCall.skipRequest).toBe(true);
    expect(imageryCall.skipRequest).toBe(true);
    expect(bipCall.skipRequest).toBe(true);
    expect(brandClarityCall.skipRequest).toBe(true);
  });

  it('should keep brand_clarity request disabled when powerAwarenessSelected is not brand-clarity', () => {
    renderUseBrandPowerRequests({
      powerAwarenessSelected: 'unaided-awareness',
    });

    const brandClarityCall = getCallByBffId(BFF_VIEW_IDS.brand_clarity);

    expect(brandClarityCall.skipRequest).toBe(true);
  });

  it('should load brand_clarity on demand when powerAwarenessSelected is brand-clarity', () => {
    renderUseBrandPowerRequests({
      powerAwarenessSelected: 'brand-clarity',
    });

    const brandClarityCall = getCallByBffId(BFF_VIEW_IDS.brand_clarity);

    expect(brandClarityCall.skipRequest).toBe(false);
  });

  it('should forward occasion BFF subFilters based on selected quarter', () => {
    renderUseBrandPowerRequests({ quarterYearSelected: 'quarter' });

    const occasionCall = getCallByBffId(BFF_VIEW_IDS.occasion);

    expect(occasionCall.subFilters).toEqual({
      dt_ini: '2025-10-01',
      dt_end: '2025-12-01',
    });
  });

  it('should forward occasion BFF subFilters based on selected year', () => {
    renderUseBrandPowerRequests({ quarterYearSelected: 'year' });

    const occasionCall = getCallByBffId(BFF_VIEW_IDS.occasion);

    expect(occasionCall.subFilters).toEqual({
      dt_ini: '2025-01-01',
      dt_end: '2025-12-01',
    });
  });

  it('should forward imagery subFilters when imagery question is loaded and selected', () => {
    renderUseBrandPowerRequests();

    const imageryCall = getCallByBffId(BFF_VIEW_IDS.imagery);

    expect(imageryCall.subFilters).toEqual({
      imagery_question: 'question_1',
    });
  });

  it('should keep imagery subFilters as null while imagery_questions is not loaded', () => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_quarters: '2025-Q4',
        pc_time_frame_years: '2025',
      },
      subFiltersLoaded: {
        imagery_questions: false,
      },
    });

    renderUseBrandPowerRequests();

    const imageryCall = getCallByBffId(BFF_VIEW_IDS.imagery);
    const bipCall = getCallByBffId(BFF_VIEW_IDS.bip);

    expect(imageryCall.subFilters).toBeNull();
    expect(imageryCall.skipRequest).toBe(true);
    expect(bipCall.skipRequest).toBe(false);
  });

  it('should keep imagery subFilters as null while imagery_questions has no selected value', () => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_quarters: '2025-Q4',
        pc_time_frame_years: '2025',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests();

    const imageryCall = getCallByBffId(BFF_VIEW_IDS.imagery);
    const bipCall = getCallByBffId(BFF_VIEW_IDS.bip);

    expect(imageryCall.subFilters).toBeNull();
    expect(imageryCall.skipRequest).toBe(true);
    expect(bipCall.skipRequest).toBe(false);
  });

  it('should pass through power data as returned by useBffData', () => {
    mockUseBffData.mockImplementation((config: any) => {
      if (config.id === BFF_VIEW_IDS.power) {
        return {
          data: {
            'brand-power': {
              kpiData: {
                quarterly: { labels: [], datasets: [] },
              },
            },
          },
          loading: false,
          error: null,
        };
      }

      return {
        data: {},
        loading: false,
        error: null,
      };
    });

    const { result } = renderUseBrandPowerRequests();

    expect(result.current.responses.power.kpiData).toEqual({
      quarterly: { labels: [], datasets: [] },
    });
  });

  it('should expose brand_clarity in responses with stable shape', () => {
    mockUseBffData.mockImplementation((config: any) => {
      if (config.id === BFF_VIEW_IDS.brand_clarity) {
        return {
          data: {
            'brand-clarity': {
              kpiData: { yearly: {} },
            },
          },
          loading: true,
          error: null,
        };
      }

      return {
        data: {},
        loading: false,
        error: null,
      };
    });

    const { result } = renderUseBrandPowerRequests({
      powerAwarenessSelected: 'brand-clarity',
    });

    expect(result.current.responses.brand_clarity).toEqual({
      kpiData: { yearly: {} },
      loading: true,
    });
  });

  it('should pass kpiGroup as power for all BFF calls', () => {
    renderUseBrandPowerRequests();

    mockUseBffData.mock.calls.forEach((call) => {
      expect(call[0].kpiGroup).toBe('power');
    });
  });

  it('should treat array brand context with elements as a valid selection', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        brands_abi: ['Brahma'],
      },
    });

    renderUseBrandPowerRequests();

    expect(getCallByBffId(BFF_VIEW_IDS.power).subFilters).toEqual({
      viewtype: 'brand',
    });
  });

  it('should treat empty arrays brand context as no selection', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        brands_abi: [],
        sub_brands: [],
        brands_comp: [],
      },
    });

    renderUseBrandPowerRequests();

    expect(getCallByBffId(BFF_VIEW_IDS.power).subFilters).toBeNull();
  });

  it('should not send occasion date subFilters when pc_time_frame is not selected', () => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests({ quarterYearSelected: 'quarter' });

    expect(getCallByBffId(BFF_VIEW_IDS.occasion).subFilters).toEqual({});
  });

  it('should fallback occasion year to applied.time_frame when pc_time_frame_years is not a valid year', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        time_frame: '2024',
      },
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_years: 'all',
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests({ quarterYearSelected: 'year' });

    expect(getCallByBffId(BFF_VIEW_IDS.occasion).subFilters).toEqual({
      dt_ini: '2024-01-01',
      dt_end: '2024-12-01',
    });
  });

  it('should not send occasion date subFilters in year view when no year can be resolved from any source', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        time_frame: 'all',
      },
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_years: 'invalid',
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests({ quarterYearSelected: 'year' });

    expect(getCallByBffId(BFF_VIEW_IDS.occasion).subFilters).toEqual({});
  });

  it('should fallback occasion quarter year to applied.time_frame when pc_time_frame_quarters has no year', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        country: 'BRA',
        time_frame: '2024',
      },
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_quarters: 'Q2',
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests({ quarterYearSelected: 'quarter' });

    expect(getCallByBffId(BFF_VIEW_IDS.occasion).subFilters).toEqual({
      dt_ini: '2024-04-01',
      dt_end: '2024-06-01',
    });
  });

  it('should not send occasion date subFilters in quarter view when no quarter can be parsed', () => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {
        pc_time_frame_quarters: 'invalid',
        imagery_questions: 'question_1',
      },
      subFiltersLoaded: {
        imagery_questions: true,
      },
    });

    renderUseBrandPowerRequests({ quarterYearSelected: 'quarter' });

    expect(getCallByBffId(BFF_VIEW_IDS.occasion).subFilters).toEqual({});
  });
});
