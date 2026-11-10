import { type ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { KpiSummaryCards } from '../KpiSummaryCards/KpiSummaryCards';
import type { KpiSummaryCardData } from '../KpiSummaryCards/types';
import { CoreAudiencePerformance } from './CoreAudiencePerformance';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (
      { id }: { id: string },
      values?: Record<string, string>,
    ) => {
      if (values?.competitor) return `${id}:${values.competitor}`;
      return `MSG:${id}`;
    },
  }),
}));

const mockUseAudienceTargetingKpiQuarterTags = jest.fn(() => [
  { icon: () => null, text: 'POS-PERIOD' },
]);

jest.mock('../../../../hooks', () => ({
  useAudienceTargetingKpiQuarterTags: () =>
    mockUseAudienceTargetingKpiQuarterTags(),
}));

const mockGetOptions = jest.fn(
  (_fieldKey: string, _dataFilters: unknown, _applied: unknown) => [],
);

let mockApplied: Record<string, string | undefined> = {
  audience_targeting_brands: 'PerfBrand ',
  audience_targeting_brands_comp: 'HEINEKEN',
};

jest.mock('hooks', () => ({
  useCurrentPage: () => ({ currentPage: '/consumer/audience' }),
  usePageFilterApplied: () => ({ applied: mockApplied }),
  usePageFilterData: () => ({ dataFilters: { some: 'data' } }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getOptions: (fieldKey: string, dataFilters: unknown, applied: unknown) =>
        mockGetOptions(fieldKey, dataFilters, applied),
    }),
  },
}));

jest.mock('components', () => ({
  Alert: ({
    message,
    dataTestId,
  }: {
    message: string;
    dataTestId?: string;
  }) => <div data-testid={dataTestId ?? 'alert'}>{message}</div>,
  ResponsiveBasicContainer: ({
    children,
    header,
    dataTestId,
  }: {
    children: ReactNode;
    dataTestId?: string;
    header: { title?: string; tags?: Array<{ text: string }> };
  }) => (
    <div data-testid={dataTestId ?? 'responsive-basic'}>
      <div data-testid="header-title">{header.title}</div>
      {header.tags?.map((tag, index) => (
        <span key={tag.text + index} data-testid={`header-tag-${index}`}>
          {tag.text}
        </span>
      ))}
      {children}
    </div>
  ),
}));

jest.mock('../KpiSummaryCards/KpiSummaryCards', () => ({
  KpiSummaryCards: jest.fn(
    ({
      dataTestId,
      loading,
      defaultSelected,
    }: {
      dataTestId?: string;
      loading?: boolean;
      defaultSelected?: string;
    }) => (
      <div
        data-testid={
          dataTestId ? `${dataTestId}-kpi-cards` : 'kpi-summary-cards'
        }
        data-loading={loading ? 'true' : 'false'}
        data-default-selected={defaultSelected ?? ''}
      />
    ),
  ),
}));

jest.mock('../../../../components', () => ({
  NoDataAvailable: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'no-data'}>no data</div>
  ),
  TooltipContent: () => <div data-testid="tooltip-content" />,
}));

const minimalKpiData: KpiSummaryCardData[] = [
  {
    id: 'participation',
    performanceIndex: { value: '1', variation: 'up' },
    bigNumberData: [],
  },
];

const MockKpiSummaryCards = jest.mocked(KpiSummaryCards);

describe('CoreAudiencePerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = {
      audience_targeting_brands: 'PerfBrand ',
      audience_targeting_brands_comp: 'HEINEKEN',
    };
    mockUseAudienceTargetingKpiQuarterTags.mockReturnValue([
      { icon: () => null, text: 'POS-PERIOD' },
    ]);
  });

  test('should loads KPI quarter tags from useAudienceTargetingKpiQuarterTags', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-performance"
        error={null}
      />,
    );

    expect(mockUseAudienceTargetingKpiQuarterTags).toHaveBeenCalled();
  });

  test('should renders period tag from hook in the header', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-performance"
        error={null}
      />,
    );

    expect(screen.getByTestId('header-tag-0')).toHaveTextContent('POS-PERIOD');
  });

  test('should builds title with brand prefix and performance title message', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-performance"
        error={null}
      />,
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'PerfBrand MSG:Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.title',
    );
  });

  test('should renders NoDataAvailable when data is empty and not loading', () => {
    render(
      <CoreAudiencePerformance
        data={[]}
        dataTestId="core-empty"
        error={null}
      />,
    );

    expect(screen.getByTestId('core-empty')).toBeInTheDocument();
    expect(
      screen.queryByTestId('core-empty-kpi-cards'),
    ).not.toBeInTheDocument();
  });

  test('should renders NoDataAvailable when error is set', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-err"
        error={new Error('x')}
      />,
    );

    expect(screen.getByTestId('core-err')).toBeInTheDocument();
  });

  test('should renders KpiSummaryCards with loading flag when isLoading', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-performance"
        isLoading
        error={null}
      />,
    );

    expect(screen.getByTestId('core-performance-kpi-cards')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  test('should forwards defaultSelected and onSelectionChange to KpiSummaryCards', () => {
    const onSelectionChange = jest.fn();
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-performance"
        defaultSelected="participation"
        onSelectionChange={onSelectionChange}
        error={null}
      />,
    );

    expect(screen.getByTestId('core-performance-kpi-cards')).toHaveAttribute(
      'data-default-selected',
      'participation',
    );
    expect(MockKpiSummaryCards.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        defaultSelected: 'participation',
        onSelectionChange,
        data: minimalKpiData,
        dataTestId: 'core-performance',
      }),
    );
  });
});

describe('CoreAudiencePerformance — edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = {
      audience_targeting_brands: undefined,
      audience_targeting_brands_comp: 'HEINEKEN',
    };
    mockUseAudienceTargetingKpiQuarterTags.mockReturnValue([]);
  });

  test('should builds title with empty string when audience_targeting_brands is undefined', () => {
    render(<CoreAudiencePerformance data={minimalKpiData} error={null} />);

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'MSG:Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.title',
    );
  });

  test('should competitor alert uses fallback data-testid when dataTestId prop is omitted', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        error={null}
        competitorWithoutData
      />,
    );

    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });
});

describe('CoreAudiencePerformance — competitorWithoutData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = {
      audience_targeting_brands: 'PerfBrand ',
      audience_targeting_brands_comp: 'HEINEKEN',
    };
    mockUseAudienceTargetingKpiQuarterTags.mockReturnValue([]);
    mockGetOptions.mockReturnValue([]);
  });

  test('should does not render alert when competitorWithoutData is false', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-perf"
        error={null}
        competitorWithoutData={false}
      />,
    );
    expect(
      screen.queryByTestId('core-perf-competitor-without-data'),
    ).not.toBeInTheDocument();
  });

  test('should does not render alert when competitorWithoutData is omitted', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-perf"
        error={null}
      />,
    );
    expect(
      screen.queryByTestId('core-perf-competitor-without-data'),
    ).not.toBeInTheDocument();
  });

  test('should renders alert when competitorWithoutData is true', () => {
    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-perf"
        error={null}
        competitorWithoutData
      />,
    );
    expect(
      screen.getByTestId('core-perf-competitor-without-data'),
    ).toBeInTheDocument();
  });

  test('should shows resolved competitor label in alert message', () => {
    mockGetOptions.mockReturnValue([{ value: 'HEINEKEN', label: 'Heineken' }]);

    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-perf"
        error={null}
        competitorWithoutData
      />,
    );

    expect(
      screen.getByTestId('core-perf-competitor-without-data'),
    ).toHaveTextContent(
      'Consumer.AudienceTargeting.Empty.competitorWithoutData:Heineken',
    );
  });

  test('should falls back to raw competitor code when no matching label', () => {
    mockGetOptions.mockReturnValue([]);

    render(
      <CoreAudiencePerformance
        data={minimalKpiData}
        dataTestId="core-perf"
        error={null}
        competitorWithoutData
      />,
    );

    expect(
      screen.getByTestId('core-perf-competitor-without-data'),
    ).toHaveTextContent(
      'Consumer.AudienceTargeting.Empty.competitorWithoutData:HEINEKEN',
    );
  });
});
