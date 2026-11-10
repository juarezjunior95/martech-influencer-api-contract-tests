import { Chart as ReactChart } from 'react-chartjs-2';

import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { ChartData } from '../../../../models/ChartData';
import { WithStandartDeviation } from './WithStandartDeviation';

jest.mock('react-chartjs-2', () => ({
  Chart: jest.fn(),
}));

jest.mock('components/Chart/register', () => ({
  registerChartModules: jest.fn(),
}));

jest.mock('chartjs-plugin-datalabels', () => ({}));

describe('WithStandartDeviation Component', () => {
  const mockData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [-10, 20, 30, 40, 50],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        variationColor: ['red', 'blue', 'green', 'yellow', 'purple'],
        unitOfMeasure: '%',
      } as any,
    ],
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders the chart with correct labels and datasets', async () => {
    (ReactChart as jest.Mock).mockImplementation(() => <div role="img" />);

    render(<WithStandartDeviation {...mockData} />);

    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());

    expect(ReactChart).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            expect.objectContaining({
              label: 'Dataset 1',
              data: [-10, 20, 30, 40, 50],
            }),
          ],
        },
      }),
      {},
    );
  });

  it('validates the grid color function for y-axis', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const gridColorFunction = options.scales.y.grid.color;
      const colorForZero = gridColorFunction({ tick: { value: 0 } });
      const colorForTen = gridColorFunction({ tick: { value: 10 } });

      return (
        <div data-testid="chart">
          <div data-testid="color-for-zero">{colorForZero}</div>
          <div data-testid="color-for-ten">{colorForTen}</div>
        </div>
      );
    });

    const { getByTestId } = render(<WithStandartDeviation {...mockData} />);

    const colorForZero = getByTestId('color-for-zero').textContent;
    const colorForTen = getByTestId('color-for-ten').textContent;

    expect(colorForZero).toBe('#828f9b');
    expect(colorForTen).toBe('transparent');
  });

  it('validates the ticks callback function for y-axis', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const ticksCallback = options.scales.y.ticks.callback;
      const zeroLabel = ticksCallback(0);
      const tenLabel = ticksCallback(10);

      return (
        <div data-testid="chart">
          <div data-testid="zero-label">{String(zeroLabel)}</div>
          <div data-testid="ten-label">{String(tenLabel)}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} />);

    expect(screen.getByTestId('zero-label').textContent).toBe('0');
    expect(screen.getByTestId('ten-label').textContent).toBe('10');
  });

  it('validates datalabels anchor function for positive and negative values', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const anchorFn = options.plugins.datalabels.anchor;
      const positiveAnchor = anchorFn({ datasetIndex: 0, dataIndex: 1 });
      const negativeAnchor = anchorFn({ datasetIndex: 0, dataIndex: 0 });

      return (
        <div data-testid="chart">
          <div data-testid="positive-anchor">{positiveAnchor}</div>
          <div data-testid="negative-anchor">{negativeAnchor}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} />);

    expect(screen.getByTestId('positive-anchor').textContent).toBe('end');
    expect(screen.getByTestId('negative-anchor').textContent).toBe('start');
  });

  it('validates datalabels align function for positive and negative values', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const alignFn = options.plugins.datalabels.align;
      const positiveAlign = alignFn({ datasetIndex: 0, dataIndex: 1 });
      const negativeAlign = alignFn({ datasetIndex: 0, dataIndex: 0 });

      return (
        <div data-testid="chart">
          <div data-testid="positive-align">{positiveAlign}</div>
          <div data-testid="negative-align">{negativeAlign}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} />);

    expect(screen.getByTestId('positive-align').textContent).toBe('end');
    expect(screen.getByTestId('negative-align').textContent).toBe('start');
  });

  it('validates datalabels color function', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const colorFn = options.plugins.datalabels.color;
      const color = colorFn({ datasetIndex: 0, dataIndex: 0 });

      return (
        <div data-testid="chart">
          <div data-testid="data-color">{color}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} />);

    expect(screen.getByTestId('data-color').textContent).toBe('red');
  });

  it('validates datalabels formatter function', async () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const formatterFn = options.plugins.datalabels.formatter;
      const formatted = formatterFn(20, { datasetIndex: 0, dataIndex: 1 });

      return (
        <div data-testid="chart">
          <div data-testid="formatted-label">{formatted}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} />);

    expect(screen.getByTestId('formatted-label').textContent).toBe('20%');
  });

  it('should use min and max props when provided', () => {
    (ReactChart as jest.Mock).mockImplementation(({ options }) => {
      const yMin = options.scales.y.min;
      const yMax = options.scales.y.max;

      return (
        <div data-testid="chart">
          <div data-testid="y-min">{String(yMin)}</div>
          <div data-testid="y-max">{String(yMax)}</div>
        </div>
      );
    });

    render(<WithStandartDeviation {...mockData} min={-50} max={150} />);

    expect(screen.getByTestId('y-min').textContent).toBe('-50');
    expect(screen.getByTestId('y-max').textContent).toBe('150');
  });
});
