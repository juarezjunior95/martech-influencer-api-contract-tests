import { render, screen } from '@testing-library/react';

import { RankedContainerData } from '../../types';
import { RankedVerticalBar } from './RankedVerticalBar';

const mockRankedData: RankedContainerData = {
  labels: [
    ['Brand A', 'Subtitle A'],
    ['Brand B', 'Subtitle B'],
    ['Brand C', 'Subtitle C'],
  ] as [string, string][],
  datasets: [
    {
      data: [45, 30, 25],
      source: ['abi', 'comp', 'abi'],
      unitMeasure: ['%', '%', '%'],
    },
    {
      data: [45, 30, 25],
      unitMeasure: ['%', '%', '%'],
      source: ['abi', 'comp', 'abi'],
    },
    {
      data: [45, 30, 25],
      source: ['abi', 'comp', 'abi'],
      unitMeasure: ['%', '%', '%'],
    },
  ],
  legend: {
    items: [
      { label: 'ABI Brand', color: '#E8D19D' },
      { label: 'Competitor', color: '#C0D1DC' },
    ],
  },
};

jest.mock('react-chartjs-2', () => ({
  Bar: ({ options, data, plugins }: any) => (
    <div
      data-testid="bar-chart"
      data-has-options={!!options}
      data-has-data={!!data}
      data-has-plugins={!!plugins}
      data-plugins-length={plugins?.length}
    >
      Bar Chart Component
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  ),
}));

jest.mock('chartjs-plugin-datalabels', () => ({
  __esModule: true,
  default: 'ChartDataLabels',
}));

jest.mock('components/Chart/register', () => ({
  registerChartModules: jest.fn(),
}));

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        default: '#141414',
        secondary: '#6B7280',
      },
      charts: {
        bg: {
          comparison: {
            primary: {
              low: '#E8D19D',
            },
            secondary: {
              low: '#C0D1DC',
            },
          },
        },
      },
    },
  },
}));

jest.mock('./RankedVerticalBar.styles', () => ({
  StyledContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-container'}>{children}</div>,
  StyledContent: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-content'}>{children}</div>,
  StyledChartWrapper: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-chart-wrapper'}>{children}</div>
  ),
  StyledLegend: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-legend'}>{children}</div>,
  StyledLegendItem: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-legend-item'}>{children}</div>,
  StyledLegendColor: ({
    style,
    'data-testid': dataTestId,
  }: {
    style: React.CSSProperties;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-legend-color'} style={style} />,
  StyledLegendLabel: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-legend-label'}>{children}</div>,
}));

jest.mock('./utils', () => ({
  getBarColors: jest.fn((source: string[]) =>
    source
      ? source.map((s) => (s.toLowerCase() === 'comp' ? '#C0D1DC' : '#E8D19D'))
      : ['#E8D19D'],
  ),
}));

describe('RankedVerticalBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('renders StyledContainer', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
    });

    it('renders StyledContent', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-content')).toBeInTheDocument();
    });

    it('renders StyledChartWrapper', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-chart-wrapper')).toBeInTheDocument();
    });

    it('renders Bar chart', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Legend Rendering', () => {
    it('renders legend when data.legend is provided', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-legend')).toBeInTheDocument();
    });

    it('does not render legend when data.legend is not provided', () => {
      const dataWithoutLegend = { ...mockRankedData, legend: undefined };
      render(<RankedVerticalBar data={dataWithoutLegend} />);

      expect(screen.queryByTestId('styled-legend')).not.toBeInTheDocument();
    });

    it('renders all legend items', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const legendItems = screen.getAllByTestId('styled-legend-item');
      expect(legendItems).toHaveLength(2);
    });

    it('renders legend labels correctly', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const legendLabels = screen.getAllByTestId('styled-legend-label');
      expect(legendLabels[0]).toHaveTextContent('ABI Brand');
      expect(legendLabels[1]).toHaveTextContent('Competitor');
    });

    it('renders legend colors with correct backgroundColor', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const legendColors = screen.getAllByTestId('styled-legend-color');
      expect(legendColors[0]).toHaveStyle({ backgroundColor: '#E8D19D' });
      expect(legendColors[1]).toHaveStyle({ backgroundColor: '#C0D1DC' });
    });

    it('legend items have unique keys', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const legendItems = screen.getAllByTestId('styled-legend-item');
      expect(legendItems).toHaveLength(2);
    });
  });

  describe('Chart Configuration', () => {
    it('passes options to Bar chart', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-has-options', 'true');
    });

    it('passes data to Bar chart', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-has-data', 'true');
    });

    it('passes ChartDataLabels plugin to Bar chart', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const barChart = screen.getByTestId('bar-chart');
      expect(barChart).toHaveAttribute('data-has-plugins', 'true');
      expect(barChart).toHaveAttribute('data-plugins-length', '1');
    });

    it('chart data includes labels from input data', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartData = screen.getByTestId('chart-data');
      const dataObject = JSON.parse(chartData.textContent || '{}');
      expect(dataObject.labels).toEqual(mockRankedData.labels);
    });

    it('chart data includes transformed datasets', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartData = screen.getByTestId('chart-data');
      const dataObject = JSON.parse(chartData.textContent || '{}');
      expect(dataObject.datasets).toHaveLength(1);
      expect(dataObject.datasets[0].data).toEqual([45, 30, 25]);
    });

    it('dataset has barThickness of 40', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartData = screen.getByTestId('chart-data');
      const dataObject = JSON.parse(chartData.textContent || '{}');
      expect(dataObject.datasets[0].barThickness).toBe(40);
    });

    it('dataset has borderRadius of 4', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartData = screen.getByTestId('chart-data');
      const dataObject = JSON.parse(chartData.textContent || '{}');
      expect(dataObject.datasets[0].borderRadius).toBe(4);
    });
  });

  describe('Title Prop', () => {
    it('displays title when provided', () => {
      render(<RankedVerticalBar data={mockRankedData} title="Test Title" />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.title.display).toBe(true);
      expect(optionsObject.plugins.title.text).toBe('Test Title');
    });

    it('does not display title when not provided', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.title.display).toBe(false);
    });

    it('does not display title when title is empty string', () => {
      render(<RankedVerticalBar data={mockRankedData} title="" />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.title.display).toBe(false);
    });
  });

  describe('Chart Options', () => {
    it('chart is responsive', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.responsive).toBe(true);
    });

    it('chart does not maintain aspect ratio', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.maintainAspectRatio).toBe(false);
    });

    it('legend is not displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.legend.display).toBe(false);
    });

    it('datalabels are displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.datalabels.display).toBe(true);
    });

    it('datalabels have correct font configuration', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.datalabels.font).toEqual({
        weight: 'normal',
        family: "'Work Sans', sans-serif",
        size: 12,
      });
    });

    it('datalabels have correct anchor and align', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.datalabels.anchor).toBe('center');
      expect(optionsObject.plugins.datalabels.align).toBe('center');
    });

    it('x-axis is displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.scales.x.display).toBe(true);
    });

    it('x-axis grid is not displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.scales.x.grid.display).toBe(false);
    });

    it('y-axis is not displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.scales.y.display).toBe(false);
    });

    it('y-axis grid is not displayed', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartOptions = screen.getByTestId('chart-options');
      const optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.scales.y.grid.display).toBe(false);
    });
  });

  describe('Component Hierarchy', () => {
    it('StyledContent is inside StyledContainer', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const container = screen.getByTestId('styled-container');
      const content = screen.getByTestId('styled-content');

      expect(container).toContainElement(content);
    });

    it('StyledLegend is inside StyledContent', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const content = screen.getByTestId('styled-content');
      const legend = screen.getByTestId('styled-legend');

      expect(content).toContainElement(legend);
    });

    it('StyledChartWrapper is inside StyledContent', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const content = screen.getByTestId('styled-content');
      const chartWrapper = screen.getByTestId('styled-chart-wrapper');

      expect(content).toContainElement(chartWrapper);
    });

    it('Bar chart is inside StyledChartWrapper', () => {
      render(<RankedVerticalBar data={mockRankedData} />);

      const chartWrapper = screen.getByTestId('styled-chart-wrapper');
      const barChart = screen.getByTestId('bar-chart');

      expect(chartWrapper).toContainElement(barChart);
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('styled-legend')).toBeInTheDocument();

      rerender(<RankedVerticalBar data={mockRankedData} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('styled-legend')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles data with empty legend', () => {
      const dataWithEmptyLegend = {
        ...mockRankedData,
        legend: { items: [] },
      };
      render(<RankedVerticalBar data={dataWithEmptyLegend} />);

      expect(screen.getByTestId('styled-legend')).toBeInTheDocument();
      expect(screen.queryAllByTestId('styled-legend-item')).toHaveLength(0);
    });

    it('handles data without datasets[1]', () => {
      const dataWithoutDataset1 = {
        ...mockRankedData,
        datasets: [mockRankedData.datasets[0]],
      };
      render(<RankedVerticalBar data={dataWithoutDataset1} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles data without datasets[2]', () => {
      const dataWithoutDataset2 = {
        ...mockRankedData,
        datasets: [mockRankedData.datasets[0], mockRankedData.datasets[1]],
      };
      render(<RankedVerticalBar data={dataWithoutDataset2} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles data with non-array unitMeasure', () => {
      const dataWithNonArrayUnitMeasure = {
        ...mockRankedData,
        datasets: [
          mockRankedData.datasets[0],
          { ...mockRankedData.datasets[1], unitMeasure: 'not-an-array' as any },
          mockRankedData.datasets[2],
        ],
      };
      render(<RankedVerticalBar data={dataWithNonArrayUnitMeasure} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles undefined unitMeasure in datasets[1]', () => {
      const dataWithoutUnitMeasure = {
        ...mockRankedData,
        datasets: [
          mockRankedData.datasets[0],
          { data: [45, 30, 25] } as any,
          mockRankedData.datasets[2],
        ],
      };
      render(<RankedVerticalBar data={dataWithoutUnitMeasure} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles empty labels array', () => {
      const dataWithEmptyLabels = {
        ...mockRankedData,
        labels: [] as [string, string][],
      };
      render(<RankedVerticalBar data={dataWithEmptyLabels} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles undefined source in datasets[2]', () => {
      const dataWithoutSource = {
        ...mockRankedData,
        datasets: [
          mockRankedData.datasets[0],
          mockRankedData.datasets[1],
          { data: [45, 30, 25] } as any,
        ],
      };
      render(<RankedVerticalBar data={dataWithoutSource} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Props Variations', () => {
    it('handles different title values', () => {
      const { rerender } = render(
        <RankedVerticalBar data={mockRankedData} title="Title 1" />,
      );

      let chartOptions = screen.getByTestId('chart-options');
      let optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.title.text).toBe('Title 1');

      rerender(<RankedVerticalBar data={mockRankedData} title="Title 2" />);

      chartOptions = screen.getByTestId('chart-options');
      optionsObject = JSON.parse(chartOptions.textContent || '{}');
      expect(optionsObject.plugins.title.text).toBe('Title 2');
    });

    it('handles data with different number of items', () => {
      const dataWithMoreItems: RankedContainerData = {
        ...mockRankedData,
        labels: [
          ['Brand A', 'Subtitle A'],
          ['Brand B', 'Subtitle B'],
          ['Brand C', 'Subtitle C'],
          ['Brand D', 'Subtitle D'],
          ['Brand E', 'Subtitle E'],
        ] as [string, string][],
        datasets: [
          {
            data: [45, 30, 25, 20, 15],
            source: ['abi', 'comp', 'abi', 'comp', 'abi'],
            unitMeasure: ['%', '%', '%', '%', '%'],
          },
          {
            data: [45, 30, 25, 20, 15],
            unitMeasure: ['%', '%', '%', '%', '%'],
            source: ['abi', 'comp', 'abi', 'comp', 'abi'],
          },
          {
            data: [45, 30, 25, 20, 15],
            source: ['abi', 'comp', 'abi', 'comp', 'abi'],
            unitMeasure: ['%', '%', '%', '%', '%'],
          },
        ],
      };
      render(<RankedVerticalBar data={dataWithMoreItems} />);

      const chartData = screen.getByTestId('chart-data');
      const dataObject = JSON.parse(chartData.textContent || '{}');
      expect(dataObject.datasets[0].data).toHaveLength(5);
    });
  });

  describe('data-testid Implementation', () => {
    describe('dataTestId prop', () => {
      it('accepts dataTestId as optional prop', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="vertical-bar-test"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-vertical-bar-test'),
        ).toBeInTheDocument();
      });

      it('renders without dataTestId prop', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-vertical-bar-'),
        ).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is undefined', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId={undefined} />,
        );

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-vertical-bar-'),
        ).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is empty string', () => {
        render(<RankedVerticalBar data={mockRankedData} dataTestId="" />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-vertical-bar-'),
        ).not.toBeInTheDocument();
      });
    });

    describe('StyledContainer data-testid', () => {
      it('applies correct data-testid to StyledContainer', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="test-container"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-test-container'),
        ).toBeInTheDocument();
      });

      it('uses ranked-vertical-bar- prefix', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="my-container" />,
        );

        const container = screen.getByTestId(
          'ranked-vertical-bar-my-container',
        );
        expect(container).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      });
    });

    describe('StyledContent data-testid', () => {
      it('applies correct data-testid to StyledContent', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="test-content" />,
        );

        expect(
          screen.getByTestId('ranked-content-test-content'),
        ).toBeInTheDocument();
      });

      it('uses ranked-content- prefix', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="my-content" />,
        );

        const content = screen.getByTestId('ranked-content-my-content');
        expect(content).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        expect(screen.getByTestId('styled-content')).toBeInTheDocument();
      });
    });

    describe('StyledChartWrapper data-testid', () => {
      it('applies correct data-testid to StyledChartWrapper', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="test-chart" />,
        );

        expect(
          screen.getByTestId('ranked-chart-wrapper-test-chart'),
        ).toBeInTheDocument();
      });

      it('uses ranked-chart-wrapper- prefix', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="my-chart" />,
        );

        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-my-chart',
        );
        expect(chartWrapper).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        expect(screen.getByTestId('styled-chart-wrapper')).toBeInTheDocument();
      });
    });

    describe('StyledLegend data-testid', () => {
      it('applies correct data-testid to StyledLegend', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="test-legend" />,
        );

        expect(
          screen.getByTestId('ranked-legend-test-legend'),
        ).toBeInTheDocument();
      });

      it('uses ranked-legend- prefix', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="my-legend" />,
        );

        const legend = screen.getByTestId('ranked-legend-my-legend');
        expect(legend).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        expect(screen.getByTestId('styled-legend')).toBeInTheDocument();
      });

      it('does not render legend data-testid when legend is not provided', () => {
        const dataWithoutLegend = { ...mockRankedData, legend: undefined };
        render(
          <RankedVerticalBar data={dataWithoutLegend} dataTestId="no-legend" />,
        );

        expect(
          screen.queryByTestId('ranked-legend-no-legend'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Legend items data-testid', () => {
      it('applies correct data-testid to legend items', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="legend-items" />,
        );

        expect(
          screen.getByTestId('ranked-legend-item-0-legend-items'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-legend-item-1-legend-items'),
        ).toBeInTheDocument();
      });

      it('applies correct data-testid to legend colors', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="legend-colors"
          />,
        );

        expect(
          screen.getByTestId('ranked-legend-color-0-legend-colors'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-legend-color-1-legend-colors'),
        ).toBeInTheDocument();
      });

      it('applies correct data-testid to legend labels', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="legend-labels"
          />,
        );

        expect(
          screen.getByTestId('ranked-legend-label-0-legend-labels'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-legend-label-1-legend-labels'),
        ).toBeInTheDocument();
      });

      it('legend items have sequential indices', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="sequential" />,
        );

        expect(
          screen.getByTestId('ranked-legend-item-0-sequential'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-legend-item-1-sequential'),
        ).toBeInTheDocument();
      });

      it('does not apply data-testid to legend items when dataTestId is not provided', () => {
        render(<RankedVerticalBar data={mockRankedData} />);

        const legendItems = screen.getAllByTestId('styled-legend-item');
        expect(legendItems).toHaveLength(2);
      });
    });

    describe('dataTestId hierarchy validation', () => {
      it('renders all data-testids in correct hierarchy', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="hierarchy-test"
          />,
        );

        const container = screen.getByTestId(
          'ranked-vertical-bar-hierarchy-test',
        );
        const content = screen.getByTestId('ranked-content-hierarchy-test');
        const legend = screen.getByTestId('ranked-legend-hierarchy-test');
        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-hierarchy-test',
        );

        expect(container).toContainElement(content);
        expect(content).toContainElement(legend);
        expect(content).toContainElement(chartWrapper);
      });

      it('maintains hierarchy without legend', () => {
        const dataWithoutLegend = { ...mockRankedData, legend: undefined };
        render(
          <RankedVerticalBar
            data={dataWithoutLegend}
            dataTestId="no-legend-hierarchy"
          />,
        );

        const container = screen.getByTestId(
          'ranked-vertical-bar-no-legend-hierarchy',
        );
        const content = screen.getByTestId(
          'ranked-content-no-legend-hierarchy',
        );
        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-no-legend-hierarchy',
        );

        expect(container).toContainElement(content);
        expect(content).toContainElement(chartWrapper);
      });

      it('legend items are inside legend', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="legend-hierarchy"
          />,
        );

        const legend = screen.getByTestId('ranked-legend-legend-hierarchy');
        const legendItem0 = screen.getByTestId(
          'ranked-legend-item-0-legend-hierarchy',
        );
        const legendItem1 = screen.getByTestId(
          'ranked-legend-item-1-legend-hierarchy',
        );

        expect(legend).toContainElement(legendItem0);
        expect(legend).toContainElement(legendItem1);
      });
    });

    describe('dataTestId with special characters', () => {
      it('handles dataTestId with hyphens', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="vertical-bar-test"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-vertical-bar-test'),
        ).toBeInTheDocument();
      });

      it('handles dataTestId with numbers', () => {
        render(<RankedVerticalBar data={mockRankedData} dataTestId="bar123" />);

        expect(
          screen.getByTestId('ranked-vertical-bar-bar123'),
        ).toBeInTheDocument();
      });

      it('handles dataTestId with underscores', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="bar_test_id" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-bar_test_id'),
        ).toBeInTheDocument();
      });
    });

    describe('dataTestId persistence across renders', () => {
      it('maintains dataTestId after rerender', () => {
        const { rerender } = render(
          <RankedVerticalBar data={mockRankedData} dataTestId="persistent" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-persistent'),
        ).toBeInTheDocument();

        rerender(
          <RankedVerticalBar data={mockRankedData} dataTestId="persistent" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-persistent'),
        ).toBeInTheDocument();
      });

      it('updates dataTestId when changed', () => {
        const { rerender } = render(
          <RankedVerticalBar data={mockRankedData} dataTestId="first" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-first'),
        ).toBeInTheDocument();

        rerender(
          <RankedVerticalBar data={mockRankedData} dataTestId="second" />,
        );

        expect(
          screen.queryByTestId('ranked-vertical-bar-first'),
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-vertical-bar-second'),
        ).toBeInTheDocument();
      });

      it('removes dataTestId when changed to undefined', () => {
        const { rerender } = render(
          <RankedVerticalBar data={mockRankedData} dataTestId="removable" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-removable'),
        ).toBeInTheDocument();

        rerender(
          <RankedVerticalBar data={mockRankedData} dataTestId={undefined} />,
        );

        expect(
          screen.queryByTestId('ranked-vertical-bar-removable'),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      });
    });

    describe('dataTestId with legend states', () => {
      it('maintains dataTestId when legend is present', () => {
        render(
          <RankedVerticalBar data={mockRankedData} dataTestId="with-legend" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-with-legend'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-legend-with-legend'),
        ).toBeInTheDocument();
      });

      it('maintains dataTestId when legend is absent', () => {
        const dataWithoutLegend = { ...mockRankedData, legend: undefined };
        render(
          <RankedVerticalBar
            data={dataWithoutLegend}
            dataTestId="without-legend"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-without-legend'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-legend-without-legend'),
        ).not.toBeInTheDocument();
      });

      it('preserves dataTestId across legend changes', () => {
        const { rerender } = render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="legend-change"
          />,
        );

        expect(
          screen.getByTestId('ranked-legend-legend-change'),
        ).toBeInTheDocument();

        const dataWithoutLegend = { ...mockRankedData, legend: undefined };
        rerender(
          <RankedVerticalBar
            data={dataWithoutLegend}
            dataTestId="legend-change"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-legend-change'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-legend-legend-change'),
        ).not.toBeInTheDocument();
      });
    });

    describe('dataTestId with title prop', () => {
      it('maintains dataTestId when title is provided', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            title="Test Title"
            dataTestId="with-title"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-with-title'),
        ).toBeInTheDocument();
      });

      it('maintains dataTestId when title is not provided', () => {
        render(
          <RankedVerticalBar
            data={mockRankedData}
            dataTestId="without-title"
          />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-without-title'),
        ).toBeInTheDocument();
      });
    });
  });
});
