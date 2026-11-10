import { render, screen } from '@testing-library/react';

import { Chart } from './Chart';

const mockChartData = [
  {
    type: 'bar' as const,
    labels: ['2023', '2024'],
    datasets: [{ type: 'bar' as const, label: 'Dataset 1', data: [10, 20] }],
  },
];

const mockMultipleCharts = [
  {
    type: 'bar' as const,
    labels: ['Q1', 'Q2'],
    datasets: [{ type: 'bar' as const, label: 'Chart 1', data: [5, 10] }],
  },
  {
    type: 'bar' as const,
    labels: ['Q3', 'Q4'],
    datasets: [{ type: 'bar' as const, label: 'Chart 2', data: [15, 20] }],
  },
];

jest.mock('components', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('components/deprecated', () => ({
  Bar: () => <div data-testid="bar" />,
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: () => <div data-testid="no-data-yet" />,
}));

jest.mock('pages/components', () => ({
  ChartWithCaption: ({
    chartComponent: ChartComponent,
  }: {
    chartComponent: React.ComponentType;
  }) => (
    <div data-testid="chart-with-caption">
      <ChartComponent />
    </div>
  ),
}));

jest.mock('./Chart.styles', () => ({
  StyledNoDataContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-no-data-container">{children}</div>
  ),
  StyledQuarterChartsContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-quarter-charts-container">{children}</div>,
  StyledYearChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-year-chart-container">{children}</div>
  ),
}));

describe('Chart', () => {
  it('renders Skeleton when loading and hides charts', () => {
    render(<Chart loading={true} chartList={mockChartData} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-with-caption')).not.toBeInTheDocument();
  });

  it.each([
    ['empty chartList', []],
    ['first chart with #empty flag', [{ '#empty': true } as any]],
    ['first chart with empty flag', [{ empty: true } as any]],
  ])('renders NoDataYet when %s', (_label, chartList) => {
    render(<Chart loading={false} chartList={chartList} />);

    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    expect(screen.getByTestId('styled-no-data-container')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-with-caption')).not.toBeInTheDocument();
  });

  it('renders a single chart inside StyledYearChartContainer when chartList has 1 item', () => {
    render(<Chart loading={false} chartList={mockChartData} />);

    expect(
      screen.getByTestId('styled-year-chart-container'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('styled-quarter-charts-container'),
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId('chart-with-caption')).toHaveLength(1);
  });

  it('renders multiple charts inside StyledQuarterChartsContainer when chartList has more than 1 item', () => {
    render(<Chart loading={false} chartList={mockMultipleCharts} />);

    expect(
      screen.getByTestId('styled-quarter-charts-container'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('styled-year-chart-container'),
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId('chart-with-caption')).toHaveLength(2);
  });
});
