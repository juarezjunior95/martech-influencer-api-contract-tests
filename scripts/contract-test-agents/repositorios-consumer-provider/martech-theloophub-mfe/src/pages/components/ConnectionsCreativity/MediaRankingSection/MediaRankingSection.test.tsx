import { render, screen } from '@testing-library/react';
import { ResourceAllocationData } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';
import { getDeepDiveHeaderMessage } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/deepDiveHeaderUtils';

import { MediaRankingSection } from './MediaRankingSection';

jest.mock('components', () => ({
  Legend: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'legend'} />
  ),
}));

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'skeleton'} />
  ),
}));

jest.mock('../DeepDiveChartHeader/DeepDiveChartHeader', () => ({
  DeepDiveChartHeader: ({
    title,
    measure,
    dataTestId,
  }: {
    title: string;
    measure: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'header'}
      data-title={title}
      data-measure={measure}
    />
  ),
}));

jest.mock('../RankingChart/RankingChart', () => ({
  RankingChart: ({
    dataTestId,
    chartHeight,
  }: {
    dataTestId?: string;
    chartHeight?: string;
  }) => (
    <div data-testid={dataTestId ?? 'chart'} data-chart-height={chartHeight} />
  ),
}));

jest.mock(
  'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/deepDiveHeaderUtils',
  () => ({
    getDeepDiveHeaderMessage: jest.fn(() => ({
      title: 'Mock Title',
      measure: 'Mock Measure',
      tooltip: 'Mock Tooltip',
      labelIconTooltip: 'Mock Label Tooltip',
      horizontalDashedLineTooltip: 'Mock Line Tooltip',
    })),
  }),
);

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);

const rankingWithLegend: ResourceAllocationData = {
  datasets: [
    {
      type: 'bar',
      data: [1, 2],
      baseChartColor: ['#111'],
    },
  ],
  labels: ['A', 'B'],
} as unknown as ResourceAllocationData;

const defaultProps = {
  rankingKpiData: {
    media_spend: rankingWithLegend,
  },
  loadingRanking: false,
  activeRankingSubfilter: 'media_spend',
  isGlobalZone: false,
  formatMessage: mockFormatMessage,
  dataTestId: 'mr',
};

describe('MediaRankingSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Skeleton while loadingRanking is true', () => {
    render(<MediaRankingSection {...defaultProps} loadingRanking />);

    expect(screen.getByTestId('skeleton-mr')).toBeInTheDocument();
    expect(screen.queryByTestId('mr-ranking-wrapper')).not.toBeInTheDocument();
  });

  it('renders header and RankingChart when not loading', () => {
    render(<MediaRankingSection {...defaultProps} />);

    expect(screen.getByTestId('mr-ranking-wrapper')).toBeInTheDocument();
    const header = screen.getByTestId('mr-ranking-view-header');
    expect(header).toHaveAttribute('data-title', 'Mock Title');
    expect(header).toHaveAttribute('data-measure', 'Mock Measure');

    const chart = screen.getByTestId('mr');
    expect(chart).toHaveAttribute('data-chart-height', '350px');
  });

  it('passes custom chartHeight to RankingChart', () => {
    render(<MediaRankingSection {...defaultProps} chartHeight="286px" />);

    expect(screen.getByTestId('mr')).toHaveAttribute(
      'data-chart-height',
      '286px',
    );
  });

  it('calls getDeepDiveHeaderMessage with ranking view and kpis subfilter', () => {
    render(<MediaRankingSection {...defaultProps} />);

    expect(getDeepDiveHeaderMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        activeSubFilters: { kpis: 'media_spend' },
        isGlobalZone: false,
        formatMessage: mockFormatMessage,
      }),
    );
  });

  it('renders legend when showLegend is true and chart has baseChartColor', () => {
    render(<MediaRankingSection {...defaultProps} showLegend />);

    expect(screen.getByTestId('mr-ranking-legend-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('mr-ranking-legend')).toBeInTheDocument();
  });

  it('does not render legend when showLegend is false', () => {
    render(<MediaRankingSection {...defaultProps} showLegend={false} />);

    expect(
      screen.queryByTestId('mr-ranking-legend-wrapper'),
    ).not.toBeInTheDocument();
  });
});
