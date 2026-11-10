import { render, screen, waitFor } from '@testing-library/react';

import { AudienceTargetingError } from '../../constants';
import type { KpiSummaryCardData } from './components/KpiSummaryCards/types';
import { Performance } from './Performance';

const mockCoreAudiencePerformance = jest.fn();
const mockBreakdown = jest.fn();
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

let mockApplied: Record<string, string> = {
  country: 'BRA',
  audience_targeting_brands: 'Corona',
  audience_targeting_brands_comp: 'Skol',
  kpis: 'p4w',
};

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({ applied: mockApplied }),
  usePageFilterManagement: () => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
  }),
}));

jest.mock('./components', () => ({
  CoreAudiencePerformance: (props: unknown) => {
    mockCoreAudiencePerformance(props);
    return <div data-testid="core-audience-performance-mock" />;
  },
  Breakdown: (props: unknown) => {
    mockBreakdown(props);
    return <div data-testid="breakdown-mock" />;
  },
}));

const defaultProps = {
  dataTestId: 'performance',
  audiencePerformanceData: [{ id: 'participation', value: 50 }] as never,
  participationBreakdownData: [],
  audiencePerformanceError: null,
  isAudienceLoading: false,
  isBreakdownLoading: false,
  breakdownError: null,
};

const sampleKpiCard = (id: string, empty?: boolean): KpiSummaryCardData => ({
  id,
  empty,
  performanceIndex: { value: '1', variation: 'neutral' },
  bigNumberData: [],
});

describe('Performance edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = {
      country: 'BRA',
      audience_targeting_brands: 'Corona',
      audience_targeting_brands_comp: 'Skol',
      kpis: 'p4w',
    };
  });

  test('should renders normal content when no errors and data is available', () => {
    render(<Performance {...defaultProps} />);

    expect(
      screen.getByTestId('core-audience-performance-mock'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-mock')).toBeInTheDocument();
    expect(
      screen.queryByTestId('performance-no-country-data'),
    ).not.toBeInTheDocument();
  });

  test('should renders breakdown when audience data is empty (country without data handled at page level)', () => {
    render(
      <Performance
        {...defaultProps}
        audiencePerformanceData={[]}
        participationBreakdownData={[]}
      />,
    );

    expect(
      screen.queryByTestId('performance-no-country-data'),
    ).not.toBeInTheDocument();
  });

  // Note: data refresh fail and permission required are handled globally in
  // AudienceTargeting.tsx (hides tabs + shows page-level NoDataAvailable).
  // See AudienceTargeting.test.tsx for those scenarios.

  test('should does not render empty state when loading is true', () => {
    render(
      <Performance
        {...defaultProps}
        audiencePerformanceData={[]}
        isAudienceLoading
      />,
    );

    expect(
      screen.queryByTestId('performance-no-country-data'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('core-audience-performance-mock'),
    ).toBeInTheDocument();
  });

  test('should passes competitorWithoutData=true to CoreAudiencePerformance and Breakdown and clears their errors', () => {
    const competitorError = new Error(
      AudienceTargetingError.CompetitorWithoutData,
    );

    render(
      <Performance
        {...defaultProps}
        audiencePerformanceError={competitorError}
      />,
    );

    expect(
      screen.getByTestId('core-audience-performance-mock'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-mock')).toBeInTheDocument();

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      error: Error | null;
      competitorWithoutData: boolean;
    };
    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      error: Error | null;
      competitorWithoutData: boolean;
    };

    expect(coreProps.error).toBeNull();
    expect(coreProps.competitorWithoutData).toBe(true);
    expect(breakdownProps.error).toBeNull();
    expect(breakdownProps.competitorWithoutData).toBe(true);
  });

  test('should passes defaultSelected=participation when kpis filter is p4w', () => {
    mockApplied = { ...mockApplied, kpis: 'p4w' };
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      defaultSelected: string;
    };
    expect(coreProps.defaultSelected).toBe('participation');
  });

  test('should passes defaultSelected=occasions when kpis filter is occasion', () => {
    mockApplied = { ...mockApplied, kpis: 'occasion' };
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      defaultSelected: string;
    };
    expect(coreProps.defaultSelected).toBe('occasions');
  });

  test('should passes defaultSelected=brandPower when kpis filter is power', () => {
    mockApplied = { ...mockApplied, kpis: 'power' };
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      defaultSelected: string;
    };
    expect(coreProps.defaultSelected).toBe('brandPower');
  });

  test('should passes variant=occasions to Breakdown when kpis filter is occasion', () => {
    mockApplied = { ...mockApplied, kpis: 'occasion' };
    render(<Performance {...defaultProps} />);

    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      variant: string;
    };
    expect(breakdownProps.variant).toBe('occasions');
  });

  test('should update kpis to first non-empty card when current KPI is empty in response', async () => {
    mockApplied = { ...mockApplied, kpis: 'occasion' };
    const audienceData: KpiSummaryCardData[] = [
      sampleKpiCard('participation'),
      { ...sampleKpiCard('occasions'), empty: true },
      sampleKpiCard('brandPower'),
    ];

    render(
      <Performance {...defaultProps} audiencePerformanceData={audienceData} />,
    );

    await waitFor(() => {
      expect(mockUpdateForm).toHaveBeenCalledWith('kpis', 'p4w');
      expect(mockApply).toHaveBeenCalled();
    });
  });

  test('should not change kpis when all KPI cards are empty', async () => {
    mockApplied = { ...mockApplied, kpis: 'occasion' };
    const audienceData: KpiSummaryCardData[] = [
      { ...sampleKpiCard('participation'), empty: true },
      { ...sampleKpiCard('occasions'), empty: true },
      { ...sampleKpiCard('brandPower'), empty: true },
    ];

    mockUpdateForm.mockClear();
    mockApply.mockClear();

    render(
      <Performance {...defaultProps} audiencePerformanceData={audienceData} />,
    );

    await waitFor(() => {
      expect(mockCoreAudiencePerformance).toHaveBeenCalled();
    });

    expect(mockUpdateForm).not.toHaveBeenCalled();
    expect(mockApply).not.toHaveBeenCalled();
  });

  test('should handleKpiSelectionChange calls updateForm and apply with mapped filter value', () => {
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      onSelectionChange: (id: string) => void;
    };
    coreProps.onSelectionChange('occasions');

    expect(mockUpdateForm).toHaveBeenCalledWith('kpis', 'occasion');
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  test('should handleKpiSelectionChange maps brandPower card to power filter', () => {
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      onSelectionChange: (id: string) => void;
    };
    coreProps.onSelectionChange('brandPower');

    expect(mockUpdateForm).toHaveBeenCalledWith('kpis', 'power');
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  test('should handleKpiSelectionChange uses cardId as-is when no mapping exists', () => {
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      onSelectionChange: (id: string) => void;
    };
    coreProps.onSelectionChange('unknownCard');

    expect(mockUpdateForm).toHaveBeenCalledWith('kpis', 'unknownCard');
  });

  test('should falls back to p4w variant when kpis filter is undefined', () => {
    mockApplied = {
      country: 'BRA',
      audience_targeting_brands: 'Corona',
      audience_targeting_brands_comp: 'Skol',
    };
    render(<Performance {...defaultProps} />);

    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      variant: string;
    };
    expect(breakdownProps.variant).toBe('p4w');
  });

  test('should falls back to participation as defaultSelected when kpis filter is unknown', () => {
    mockApplied = { ...mockApplied, kpis: 'unknown-kpi' };
    render(<Performance {...defaultProps} />);

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      defaultSelected: string;
    };
    expect(coreProps.defaultSelected).toBe('participation');
  });

  test('should passes empty arrays when audiencePerformanceData and participationBreakdownData are undefined', () => {
    render(
      <Performance
        dataTestId="performance"
        audiencePerformanceError={null}
        isAudienceLoading={false}
        isBreakdownLoading={false}
        breakdownError={null}
      />,
    );

    const coreProps = mockCoreAudiencePerformance.mock.calls[0][0] as {
      data: unknown[];
    };
    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      data: unknown[];
    };
    expect(coreProps.data).toEqual([]);
    expect(breakdownProps.data).toEqual([]);
  });

  test('should passes isBreakdownLoading=false when prop is undefined', () => {
    render(
      <Performance
        dataTestId="performance"
        audiencePerformanceData={[]}
        participationBreakdownData={[]}
        audiencePerformanceError={null}
        breakdownError={null}
      />,
    );

    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      isLoading: boolean;
    };
    expect(breakdownProps.isLoading).toBe(false);
  });

  test('should passes breakdownError to Breakdown component when audiencePerformanceError is null', () => {
    const breakdownError = new Error('breakdown fail');
    render(
      <Performance
        {...defaultProps}
        audiencePerformanceError={null}
        breakdownError={breakdownError}
      />,
    );

    const breakdownProps = mockBreakdown.mock.calls[0][0] as {
      error: Error | null;
    };
    expect(breakdownProps.error).toBe(breakdownError);
  });
});
