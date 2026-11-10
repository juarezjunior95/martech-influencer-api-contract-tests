import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { StackedChart } from '../../types';
import { StackedBarChart, StackedBarChartProps } from '../StackedBarChart';

jest.mock('react-chartjs-2', () => ({
  Bar: jest.fn(({ data, options, plugins, 'data-testid': dataTestId }) => (
    <div data-testid={dataTestId || 'chart'}>
      <p>Mocked Chart</p>
      <p>Data: {JSON.stringify(data)}</p>
      <p>Options: {JSON.stringify(options)}</p>
      <p>Plugins: {JSON.stringify(plugins)}</p>
    </div>
  )),
}));

describe('StackedBarChart', () => {
  const mockChart = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    total_allocation: {
      unit: '%',
      value: [50, 60, 70],
    },
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 20, 30],
        directions: ['up', 'down', ''],
        formattedData: ['10%', '20%', '30%'],
      },
    ],
  };

  const mockProps: StackedBarChartProps = {
    chart: mockChart as StackedChart,
    borderRadius: { topLeft: 10, topRight: 10, bottomRight: 0, bottomLeft: 0 },
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  };

  it('renders the Bar chart component with provided data', () => {
    render(<StackedBarChart {...mockProps} />);

    const chart = screen.getByTestId('chart');
    expect(chart).toBeInTheDocument();

    const chartDataText =
      chart.querySelector('p:nth-child(2)')?.textContent ?? '';
    const chartData = JSON.parse(chartDataText.replace('Data: ', ''));
    expect(chartData.labels).toEqual(['Label 1', 'Label 2', 'Label 3']);
  });

  it('fills the parent container (horizontal layout)', () => {
    render(<StackedBarChart {...mockProps} />);

    const container = screen.getByTestId('chart').parentElement;
    expect(container).toHaveStyle('width: 100%');
    expect(container).toHaveStyle('height: 100%');
  });

  it('handles empty datasets gracefully', () => {
    const emptyChart = { ...mockChart, datasets: [] };
    render(<StackedBarChart {...mockProps} chart={emptyChart} />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('propagates dataTestId as suffix to the Bar element and omits it when not provided', () => {
    const { rerender } = render(
      <StackedBarChart {...mockProps} dataTestId="test" />,
    );
    expect(screen.getByTestId('test-stacked-bar-chart')).toBeInTheDocument();

    rerender(<StackedBarChart {...mockProps} />);
    expect(
      screen.queryByTestId('test-stacked-bar-chart'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
