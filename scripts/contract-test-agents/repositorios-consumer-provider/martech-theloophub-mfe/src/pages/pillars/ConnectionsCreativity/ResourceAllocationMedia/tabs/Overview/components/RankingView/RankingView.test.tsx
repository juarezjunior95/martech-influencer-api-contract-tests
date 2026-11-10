import { useIntl } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { ResourceAllocationData } from '../../types';
import { getDeepDiveHeaderMessage } from '../../utils';
import { RankingView } from './RankingView';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(() => ({ currentPage: '/test-page' })),
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterApplied: jest.fn(() => ({
    isGlobalZone: false,
  })),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: { kpis: 'media_spend' },
  })),
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ id }) => id),
  })),
}));

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ length, width, height, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'ranking-view-skeleton'}
      data-length={length}
      data-width={width}
      data-height={height}
    />
  ),
}));

jest.mock('pages/components/ConnectionsCreativity', () => ({
  DeepDiveChartHeader: ({ title, measure, tooltip, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'ranking-view-header'}
      data-title={title}
      data-measure={measure}
      data-tooltip={tooltip}
    />
  ),
  RankingChart: ({
    data,
    labelIconTooltip,
    horizontalDashedLineTooltip,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId ?? 'ranking-view-chart'}
      data-data={JSON.stringify(data)}
      data-label-icon-tooltip={labelIconTooltip}
      data-horizontal-dashed-line-tooltip={horizontalDashedLineTooltip}
    />
  ),
}));

jest.mock('../../utils', () => ({
  getDeepDiveHeaderMessage: jest.fn(() => ({
    title: 'Mock Title',
    measure: 'Mock Measure',
    tooltip: 'Mock Tooltip',
    labelIconTooltip: 'Mock Label Icon Tooltip',
    horizontalDashedLineTooltip: 'Mock Horizontal Dashed Line Tooltip',
  })),
}));

describe('RankingView', () => {
  const mockData: ResourceAllocationData = {
    datasets: [
      {
        type: 'bar',
        data: [100, 200, 300],
        formattedData: ['100', '200', '300'],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
        baseChartColor: ['#000', '#111', '#222'],
      },
    ],
    labels: ['Label1', 'Label2', 'Label3'],
    icons: ['icon1.svg', 'icon2.svg', 'icon3.svg'],
  } as unknown as ResourceAllocationData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Skeleton when loadingRanking is true', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={true}
        selectedView="ranking_toggle"
      />,
    );

    screen.getByTestId('ranking-view-skeleton');
    expect(screen.queryByTestId('ranking-view-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ranking-view-chart')).not.toBeInTheDocument();
  });

  it('renders Skeleton with custom dataTestId when loading', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={true}
        selectedView="ranking_toggle"
        dataTestId="custom-ranking"
      />,
    );

    const skeleton = screen.getByTestId('skeleton-custom-ranking');
    expect(skeleton).toHaveAttribute('data-length', '1');
    expect(skeleton).toHaveAttribute('data-width', '100%');
    expect(skeleton).toHaveAttribute('data-height', '450px');
  });

  it('renders header and chart when not loading', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    screen.getByTestId('ranking-view-header');
    screen.getByTestId('ranking-view-chart');
    expect(
      screen.queryByTestId('ranking-view-skeleton'),
    ).not.toBeInTheDocument();
  });

  it('passes correct props to DeepDiveChartHeader and RankingChart', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    const header = screen.getByTestId('ranking-view-header');
    expect(header).toHaveAttribute('data-title', 'Mock Title');
    expect(header).toHaveAttribute('data-measure', 'Mock Measure');
    expect(header).toHaveAttribute('data-tooltip', 'Mock Tooltip');

    const chart = screen.getByTestId('ranking-view-chart');
    expect(chart).toHaveAttribute('data-data', JSON.stringify(mockData));
    expect(chart).toHaveAttribute(
      'data-label-icon-tooltip',
      'Mock Label Icon Tooltip',
    );
    expect(chart).toHaveAttribute(
      'data-horizontal-dashed-line-tooltip',
      'Mock Horizontal Dashed Line Tooltip',
    );
  });

  it('calls getDeepDiveHeaderMessage with correct params', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    expect(getDeepDiveHeaderMessage).toHaveBeenCalledWith({
      activeSubFilters: { kpis: 'media_spend' },
      isGlobalZone: false,
      data: mockData,
      formatMessage: expect.any(Function),
      selectedView: 'ranking_toggle',
    });
  });

  it.each([
    ['breakdown_toggle', 'breakdown_toggle'],
    [undefined, undefined],
  ])('handles selectedView: %s', (selectedView, expectedSelectedView) => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView={selectedView}
      />,
    );

    expect(getDeepDiveHeaderMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedView: expectedSelectedView,
      }),
    );
  });

  it.each([
    ['usePageFilterApplied', usePageFilterApplied],
    ['useSubFilters', useSubFilters],
    ['useIntl', useIntl],
  ])('uses %s hook', (_, hookMock) => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    expect(hookMock).toHaveBeenCalled();
  });

  it.each([
    [
      'empty object',
      {} as ResourceAllocationData,
      JSON.stringify({} as ResourceAllocationData),
    ],
    [
      'different structure',
      {
        datasets: [{ data: [50, 100] }],
        labels: ['A', 'B'],
        empty: false,
      } as unknown as ResourceAllocationData,
      JSON.stringify({
        datasets: [{ data: [50, 100] }],
        labels: ['A', 'B'],
        empty: false,
      }),
    ],
  ])('handles data: %s', (_, data, expectedData) => {
    render(
      <RankingView
        data={data}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    const chart = screen.getByTestId('ranking-view-chart');
    expect(chart).toHaveAttribute('data-data', expectedData);
  });

  it.each([
    ['isGlobalZone true', { isGlobalZone: true }, undefined],
    [
      'different activeSubFilters',
      undefined,
      { activeSubFilters: { kpis: 'campaigns' } },
    ],
  ])('works with %s', (_, pageFilterValue, subFiltersValue) => {
    if (pageFilterValue) {
      jest.mocked(usePageFilterApplied).mockReturnValue(pageFilterValue as any);
    }
    if (subFiltersValue) {
      jest.mocked(useSubFilters).mockReturnValue(subFiltersValue as any);
    }

    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    screen.getByTestId('ranking-view-header');
  });

  it('renders with custom dataTestId for all components', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
        dataTestId="custom-ranking"
      />,
    );

    expect(
      screen.getByTestId('custom-ranking-ranking-view-header'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-ranking')).toBeInTheDocument();
  });

  it('renders without custom dataTestId', () => {
    render(
      <RankingView
        data={mockData}
        loadingRanking={false}
        selectedView="ranking_toggle"
      />,
    );

    screen.getByTestId('ranking-view-header');
    screen.getByTestId('ranking-view-chart');
    expect(
      screen.queryByTestId('custom-ranking-ranking-view-header'),
    ).not.toBeInTheDocument();
  });
});
