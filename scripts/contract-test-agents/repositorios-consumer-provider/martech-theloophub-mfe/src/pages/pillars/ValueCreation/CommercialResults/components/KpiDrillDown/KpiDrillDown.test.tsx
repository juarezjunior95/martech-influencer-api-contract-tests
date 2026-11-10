import React from 'react';

import { render, screen } from '@testing-library/react';

import { UseKpiDrillDownData } from '../../types';
import { KpiDrillDown } from './KpiDrillDown';

const mockHookData: UseKpiDrillDownData = {
  applied: { kpis: 'volume', periods: 'YTD' } as any,
  performanceInfo: {
    performanceSection: 'Volume Performance',
    tooltip: 'Performance tooltip',
  },
  config: {
    kpiGroup: 'volume',
    periodValues: ['YTD', 'L3M', 'MTD'],
    measure: '[ k hl ]',
    driversTitle: 'Volume Drivers',
  },
  bigNumbersData: {
    title: 'Overtime Performance',
    loading: false,
    error: null,
    selectedBigNumberIndex: 0,
    handleBigNumbersSelect: jest.fn(),
    bigNumbersData: [],
  },
  waterfallData: {
    title: 'Volume Contribution',
    loading: false,
    error: null,
    isViewByDisabled: false,
    contextKey: 'volume-context',
    handleViewByChange: jest.fn(),
    handleBarClick: jest.fn(),
    waterfallData: {} as any,
  },
  lineBarChartData: {
    title: 'Monthly View',
    loading: false,
    error: null,
    showLineDataLabels: true,
    data: {} as any,
    subtitle: {
      prefix: 'Filtered by',
      value: 'Brahma',
    },
  },
};

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
}));

jest.mock('../../hooks/useKpiDrillDownData/useKpiDrillDownData', () => ({
  useKpiDrillDownData: jest.fn(),
}));

jest.mock('../Sections/BigNumbersSection/BigNumbersSection', () => ({
  BigNumbersSection: ({
    data,
    skeletonProps,
  }: {
    data: { title: string };
    skeletonProps: Record<string, unknown>;
  }) => (
    <div
      data-testid="big-numbers-section"
      data-title={data.title}
      data-skeleton-height={skeletonProps?.height as string}
    />
  ),
}));

jest.mock('../Sections/PerformanceSection', () => ({
  PerformanceSection: ({
    title,
    tooltip,
    children,
  }: {
    title: string;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="performance-section"
      data-title={title}
      data-tooltip={tooltip}
    >
      {children}
    </div>
  ),
}));

jest.mock('../Sections/ExploreFurtherSection/ExploreFurtherSection', () => ({
  ExploreFurtherSection: () => <div data-testid="explore-further-section" />,
}));

jest.mock('components', () => ({
  ExploreFurther: ({
    filterPageName,
    dataTestId,
    cards,
  }: {
    filterPageName: string;
    dataTestId: string;
    cards: any[];
  }) => (
    <div
      data-testid="explore-further"
      data-filter-page-name={filterPageName}
      data-data-test-id={dataTestId}
    >
      {cards.map((card) => (
        <div key={card.title} data-testid="explore-further-card">
          {card.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../Sections/Charts/WaterfallSection/WaterfallSection', () => ({
  WaterfallSection: ({ measure }: { measure: string }) => (
    <div data-testid="waterfall-section" data-measure={measure} />
  ),
}));

jest.mock('../Sections/Charts/LineBarChartSection/LineBarChartSection', () => ({
  LineBarChartsSection: () => <div data-testid="line-bar-chart-section" />,
}));

jest.mock('../../CommercialResults.styles', () => ({
  StyledCommercialResultsContent: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="kpi-drill-down-content">{children}</div>,
}));

jest.mock('pages/pillars/ValueCreation/PerformanceTool/config', () => ({
  volumeWaterfallConfig: {},
}));

const { useKpiDrillDownData } = jest.requireMock(
  '../../hooks/useKpiDrillDownData/useKpiDrillDownData',
);

function renderKpiDrillDown() {
  return render(<KpiDrillDown onFilterChange={jest.fn()} />);
}

describe('KpiDrillDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useKpiDrillDownData.mockReturnValue(mockHookData);
  });

  describe('Component Rendering', () => {
    it('renders without errors', () => {
      renderKpiDrillDown();

      expect(screen.getByTestId('kpi-drill-down-content')).toBeInTheDocument();
    });

    it('renders BigNumbersSection', () => {
      renderKpiDrillDown();

      expect(screen.getByTestId('big-numbers-section')).toBeInTheDocument();
    });

    it('renders PerformanceSection', () => {
      renderKpiDrillDown();

      expect(screen.getByTestId('performance-section')).toBeInTheDocument();
    });

    it('renders WaterfallSection inside PerformanceSection', () => {
      renderKpiDrillDown();

      expect(screen.getByTestId('waterfall-section')).toBeInTheDocument();
    });
  });

  describe('Hook integration', () => {
    it('calls useKpiDrillDownData on render', () => {
      renderKpiDrillDown();

      expect(useKpiDrillDownData).toHaveBeenCalled();
    });

    it('reflects updated titles when the hook returns a different KPI', () => {
      useKpiDrillDownData.mockReturnValue({
        ...mockHookData,
        performanceInfo: {
          performanceSection: 'Performance Section',
          tooltip: 'Power tooltip',
        },
      });

      renderKpiDrillDown();

      expect(screen.getByTestId('performance-section')).toHaveAttribute(
        'data-title',
        'Performance Section',
      );
    });

    it('reflects the config measure when the hook returns a different config', () => {
      useKpiDrillDownData.mockReturnValue({
        ...mockHookData,
        config: { ...mockHookData.config, measure: '[ % ]' },
      });

      renderKpiDrillDown();

      expect(screen.getByTestId('waterfall-section')).toHaveAttribute(
        'data-measure',
        '[ % ]',
      );
    });
  });
});
