import { render, screen } from '@testing-library/react';
import { useCurrentPage, usePageFilterApplied } from 'hooks';

import { Bar } from './Bar';

jest.mock('react-chartjs-2', () => ({
  Chart: ({ data, options, plugins, type }: any) => {
    if (options?.scales?.x?.ticks?.callback) {
      options.scales.x.ticks.callback(0, 0);
      options.scales.x.ticks.callback(1, 1);
    }

    if (options?.scales?.y?.ticks?.callback) {
      options.scales.y.ticks.callback(10, 0);
      options.scales.y.ticks.callback(20.5, 1);
      options.scales.y.ticks.callback(30, 2);
    }

    if (options?.scales?.x?.ticks?.font) {
      options.scales.x.ticks.font({ tick: { label: 'Q1' } });
      options.scales.x.ticks.font({ tick: { label: 'Other' } });
    }

    if (options?.scales?.y?.grid?.tickColor) {
      options.scales.y.grid.tickColor({ index: 0 });
      options.scales.y.grid.tickColor({ index: 1 });
    }

    if (options?.scales?.y?.grid?.color) {
      options.scales.y.grid.color({ tick: { value: 0 } });
      options.scales.y.grid.color({ tick: { value: 10 } });
    }

    if (options?.scales?.y?.afterFit) {
      const mockAxis = { width: 0 };
      options.scales.y.afterFit(mockAxis);
    }

    if (data?.datasets?.[0]?.datalabels?.formatter) {
      data.datasets[0].datalabels.formatter(10, { dataIndex: 0 });
      data.datasets[0].datalabels.formatter(20, { dataIndex: 1 });
    }

    return (
      <div
        data-testid="chart-component"
        data-type={type}
        data-datasets-count={data.datasets.length}
        data-plugins-count={plugins.length}
      >
        Chart
      </div>
    );
  },
}));

jest.mock('components/Chart/utils', () => ({
  getChartSuggestedMinMax: jest.fn(() => ({ min: 0, max: 100 })),
  getConnectorData: jest.fn(() => ({})),
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
}));

jest.mock('components/Chart/plugins', () => ({
  BaseChartColors: {},
  createHorizontalDashedLinePlugin: jest.fn(() => ({})),
  DatalabelWithVariation: {},
  LabelIcon: {},
  OffsetFirstTick: {},
  RoundedArrow: {},
  StripedBackground: {},
  VerticalGuidelines: {},
}));

jest.mock('theme', () => ({
  theme: {
    colors: {
      charts: {
        border: { neutrals: { 40: '#border-color' } },
        bg: { neutrals: { 5: '#bg-5', 40: '#bg-40' } },
        txt: { status: { increase: '#increase', decrease: '#decrease' } },
      },
      txt: { default: '#txt-default', secondary: '#txt-secondary' },
    },
  },
}));

jest.mock('utils/format', () => ({
  formatNumberWithSuffix: jest.fn((value) => ({ value: String(value) })),
}));

describe('Bar (deprecated)', () => {
  const mockDatasets = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30],
      backgroundColor: ['#color1', '#color2', '#color3'],
    },
  ];

  const mockLabels = ['Jan', 'Feb', 'Mar'];

  beforeEach(() => {
    jest.clearAllMocks();
    (useCurrentPage as jest.Mock).mockReturnValue({
      currentPage: 'test-page',
    });
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: { time_frame: 'Q1' },
    });
  });

  it('should render Chart component with data-testid', () => {
    render(
      <Bar
        datasets={mockDatasets}
        labels={mockLabels}
        dataTestId="test-bar-chart"
      />,
    );

    expect(screen.getByTestId('test-bar-chart')).toBeInTheDocument();
  });

  it('should render with formattedData and execute callbacks', () => {
    const formattedData = ['10k', '20k', '30k'];
    const labels = ['Jan', 'Feb', ['Mar', '2024']];

    render(
      <Bar
        datasets={mockDatasets}
        labels={labels}
        formattedData={formattedData}
        indexAxis="y"
      />,
    );

    expect(screen.getByTestId('chart-component')).toBeInTheDocument();
  });

  it('should render with indexAxis x and execute callbacks', () => {
    render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="x" />);

    expect(screen.getByTestId('chart-component')).toBeInTheDocument();
  });

  it('should render with horizontalDashedLine plugin', () => {
    const horizontalDashedLine = [
      { value: 50, unitMeasure: '%' },
      { value: 75, unitMeasure: '%' },
    ];

    render(
      <Bar
        datasets={mockDatasets}
        labels={mockLabels}
        horizontalDashedLine={horizontalDashedLine}
      />,
    );

    expect(screen.getByTestId('chart-component')).toBeInTheDocument();
  });
});
