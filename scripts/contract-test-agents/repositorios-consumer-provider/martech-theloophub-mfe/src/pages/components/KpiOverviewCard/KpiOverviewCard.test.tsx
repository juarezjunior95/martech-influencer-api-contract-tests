import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

let mockUseMediaQueryImpl: (query: string) => boolean = () => false;

jest.mock('hooks', () => ({
  useMediaQuery: (query: string) => mockUseMediaQueryImpl(query),
}));

import { KpiOverviewCard } from './KpiOverviewCard';
import type { KpiOverviewCardData } from './types';

jest.mock('components', () => ({
  Bar: () => <div data-testid="bar-chart">Bar</div>,
  BigNumber: ({
    header,
    data,
    size,
    enableTruncation,
  }: {
    header: React.ReactNode;
    data: unknown[];
    size?: string;
    enableTruncation?: boolean;
  }) => (
    <div
      data-testid="big-number"
      data-size={size ?? ''}
      data-enable-truncation={enableTruncation ? 'true' : 'false'}
    >
      {header}
      <span data-testid="big-number-count">{data.length}</span>
    </div>
  ),
  ChartHeader: ({ title }: { title?: string }) => (
    <div data-testid="chart-header">{title}</div>
  ),
  ChartWrapper: ({
    children,
    onClick,
    dataTestId,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    dataTestId?: string;
  }) => (
    <button
      type="button"
      data-testid={dataTestId ?? 'chart-wrapper'}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  ComparisonLine: () => <div data-testid="comparison-line">ComparisonLine</div>,
  NoDataYet: ({ description }: { description?: string }) => (
    <div data-testid="no-data">{description}</div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledMultiChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="multi-chart">{children}</div>
  ),
}));

jest.mock('./KpiOverviewCard.styles', () => ({
  StyledChartContainer: ({
    children,
    hasNoticeMessage,
    variation,
  }: {
    children: React.ReactNode;
    hasNoticeMessage?: boolean;
    variation?: 'export' | 'innovation';
  }) => (
    <div
      data-testid="chart-container"
      data-has-notice={hasNoticeMessage ? 'true' : 'false'}
      data-variation={variation ?? ''}
    >
      {children}
    </div>
  ),
  StyledNoticeMessageContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="notice-message-container">{children}</div>,
  StyledNoticeHeaderBlock: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="notice-header-block">{children}</div>
  ),
  StyledNoticeDivider: () => <div data-testid="notice-divider" />,
  StyledNoticeBodyBlock: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="notice-body-block">{children}</div>
  ),
  StyledKpiOverviewCardContent: ({
    children,
    variation,
  }: {
    children: React.ReactNode;
    variation?: 'export' | 'innovation';
  }) => (
    <div
      data-testid="kpi-overview-card-content"
      data-variation={variation ?? ''}
    >
      {children}
    </div>
  ),
}));

const minimalData: KpiOverviewCardData = {
  chartHeader: {
    title: 'Volume',
    measure: '[ k hl ]',
    period: "Jan-Dec'25",
  },
  bigNumberData: [
    {
      bigNumber: { value: '-0.7', measure: '%' },
      comparison: { label: 'vs', value: 'LY' },
    },
  ],
};

describe('KpiOverviewCard', () => {
  beforeEach(() => {
    mockUseMediaQueryImpl = () => false;
  });

  describe('Basic Rendering', () => {
    it('should forward dataTestId to ChartWrapper', () => {
      render(<KpiOverviewCard data={minimalData} dataTestId="my-kpi-card" />);

      expect(screen.getByTestId('my-kpi-card')).toBeInTheDocument();
    });

    it('should render with minimal data', () => {
      render(<KpiOverviewCard data={minimalData} />);

      expect(screen.getByTestId('chart-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('chart-header')).toHaveTextContent('Volume');
      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });

    it('should pass default BigNumber size when variation is omitted', () => {
      render(<KpiOverviewCard data={minimalData} />);

      expect(screen.getByTestId('kpi-overview-card-content')).toHaveAttribute(
        'data-variation',
        '',
      );
      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'xxsmall',
      );
    });

    it('should render tooltip when provided', () => {
      render(<KpiOverviewCard data={minimalData} tooltip="Volume tooltip" />);

      expect(screen.getByTestId('chart-header')).toBeInTheDocument();
    });

    it('should render when data is undefined', () => {
      render(<KpiOverviewCard data={undefined} />);

      expect(screen.getByTestId('chart-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('no-data')).toBeInTheDocument();
      expect(screen.getByTestId('chart-container')).toHaveAttribute(
        'data-has-notice',
        'true',
      );
    });

    it('should render with variation export and use export BigNumber size', () => {
      render(<KpiOverviewCard data={minimalData} variation="export" />);

      expect(screen.getByTestId('kpi-overview-card-content')).toHaveAttribute(
        'data-variation',
        'export',
      );
      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'small',
      );
    });

    it('should render with variation innovation and use non-export BigNumber size', () => {
      render(<KpiOverviewCard data={minimalData} variation="innovation" />);

      expect(screen.getByTestId('kpi-overview-card-content')).toHaveAttribute(
        'data-variation',
        'innovation',
      );
      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'xxsmall',
      );
    });
  });

  describe('Notice / empty state layout', () => {
    it('should forward variation to styled root when noticeMessage is set', () => {
      const dataWithNotice: KpiOverviewCardData = {
        ...minimalData,
        noticeMessage: 'No data available',
      };

      render(<KpiOverviewCard data={dataWithNotice} variation="export" />);

      expect(screen.getByTestId('kpi-overview-card-content')).toHaveAttribute(
        'data-variation',
        'export',
      );
      expect(screen.getByTestId('chart-container')).toHaveAttribute(
        'data-has-notice',
        'true',
      );
      expect(screen.getByTestId('chart-container')).toHaveAttribute(
        'data-variation',
        'export',
      );
      expect(screen.getByTestId('no-data')).toHaveTextContent(
        'No data available',
      );
    });
  });

  describe('Click Behavior', () => {
    it('should call onClick when wrapper is clicked', () => {
      const onClick = jest.fn();
      render(
        <KpiOverviewCard
          data={minimalData}
          tooltip="Volume tooltip"
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByTestId('chart-wrapper'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('With charts', () => {
    it('should render bar and comparison when data has barChart and comparisonLine', () => {
      const dataWithCharts: KpiOverviewCardData = {
        ...minimalData,
        barChart: {
          labels: ["YTD'22", "YTD'23"],
          datasets: [{ label: 'D1', data: [1, 2], backgroundColor: '#ccc' }],
          formattedData: [['1', '2']],
        },
        comparisonLine: {
          data: [
            {
              title: 'vs LY',
              data: [{ value: '1', measure: '%', color: '#000' }],
            },
          ],
        },
      };

      render(<KpiOverviewCard data={dataWithCharts} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
      const chartSlot = screen.getByTestId('chart-container');
      expect(chartSlot).toContainElement(screen.getByTestId('bar-chart'));
      expect(chartSlot).not.toContainElement(
        screen.getByTestId('comparison-line'),
      );
    });

    it('should forward variation to chart container when charts are shown', () => {
      const dataWithCharts: KpiOverviewCardData = {
        ...minimalData,
        barChart: {
          labels: ['A'],
          datasets: [{ label: 'D1', data: [1], backgroundColor: '#ccc' }],
          formattedData: [['1']],
        },
        comparisonLine: {
          data: [
            {
              title: 'vs LY',
              data: [{ value: '1', measure: '%', color: '#000' }],
            },
          ],
        },
      };

      render(<KpiOverviewCard data={dataWithCharts} variation="innovation" />);

      expect(screen.getByTestId('chart-container')).toHaveAttribute(
        'data-variation',
        'innovation',
      );
      expect(screen.getByTestId('chart-container')).toHaveAttribute(
        'data-has-notice',
        'false',
      );
      const chartSlot = screen.getByTestId('chart-container');
      expect(chartSlot).toContainElement(screen.getByTestId('bar-chart'));
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('should render bar only when comparisonLine is absent', () => {
      const dataBarOnly: KpiOverviewCardData = {
        ...minimalData,
        barChart: {
          labels: ['A'],
          datasets: [{ label: 'D1', data: [1], backgroundColor: '#ccc' }],
          formattedData: [['1']],
        },
      };

      render(<KpiOverviewCard data={dataBarOnly} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });

    it('should render comparison only when barChart is absent', () => {
      const dataComparisonOnly: KpiOverviewCardData = {
        ...minimalData,
        comparisonLine: {
          data: [
            {
              title: 'vs LY',
              data: [
                { value: '1', measure: '%', color: '#000' },
                { value: '2', measure: '%', color: '#111' },
              ],
            },
          ],
        },
      };

      render(<KpiOverviewCard data={dataComparisonOnly} />);

      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('should render NoDataYet when noticeMessage is provided (with chart slot)', () => {
      const dataWithNotice: KpiOverviewCardData = {
        ...minimalData,
        comparisonLine: {
          data: [
            {
              title: 'vs LY',
              data: [{ value: '0', measure: '%', color: '#000' }],
            },
          ],
        },
        noticeMessage: 'No data available',
      };

      render(<KpiOverviewCard data={dataWithNotice} />);

      expect(screen.getByTestId('no-data')).toHaveTextContent(
        'No data available',
      );
    });
  });

  describe('Viewport breakpoints', () => {
    it('should use desktop large media query branch', () => {
      mockUseMediaQueryImpl = (query) =>
        query.includes('1440') && !query.includes('1920');

      render(<KpiOverviewCard data={minimalData} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'xsmall',
      );
    });

    it('should use desktop xlarge media query branch', () => {
      mockUseMediaQueryImpl = (query) => query.includes('1920');

      render(<KpiOverviewCard data={minimalData} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'small',
      );
    });

    it('should prefer export size over xlarge breakpoint', () => {
      mockUseMediaQueryImpl = (query) => query.includes('1920');

      render(<KpiOverviewCard data={minimalData} variation="export" />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'small',
      );
    });
  });
});
