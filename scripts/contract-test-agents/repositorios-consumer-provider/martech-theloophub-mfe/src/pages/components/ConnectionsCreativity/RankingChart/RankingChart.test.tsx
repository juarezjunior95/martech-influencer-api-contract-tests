import { render, screen } from '@testing-library/react';
import * as Components from 'components';
import { ResourceAllocationData } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';

import { RankingChart } from './RankingChart';

jest.mock('components', () => ({
  Bar: jest.fn(
    ({
      datasets,
      labels,
      formattedData,
      size,
      baseChartColors,
      plugins,
      options,
      showGrid,
      indexAxis,
      dataTestId,
    }: any) => (
      <div
        data-testid={dataTestId ?? 'bar-chart'}
        data-datasets={JSON.stringify(datasets)}
        data-labels={JSON.stringify(labels)}
        data-formatted-data={JSON.stringify(formattedData)}
        data-size={size}
        data-base-chart-colors={JSON.stringify(baseChartColors)}
        data-plugins-count={plugins?.length || 0}
        data-show-grid={showGrid}
        data-index-axis={indexAxis}
        data-options={JSON.stringify(options)}
      />
    ),
  ),
  VariationCaption: jest.fn(
    ({
      variationCaptionData,
      gridColumnsCount,
      paddingLeft,
      dataTestId,
    }: any) => (
      <div
        data-testid={dataTestId ?? 'variation-caption'}
        data-variation-caption-data={JSON.stringify(variationCaptionData)}
        data-grid-columns-count={gridColumnsCount}
        data-padding-left={paddingLeft}
      />
    ),
  ),
}));

jest.mock('components/Chart/plugins', () => ({
  DatalabelWithVariation: { id: 'datalabelWithVariation' },
  LabelIcon: { id: 'labelIcon' },
  createHorizontalDashedLinePlugin: jest.fn(() => ({
    id: 'horizontalDashedLine',
  })),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'no-data-yet'} />
  ),
}));

jest.mock('./RankingChart.styles', () => ({
  StyledEmptyState: ({ children }: any) => (
    <div data-testid="styled-empty-state">{children}</div>
  ),
}));

jest.mock('utils/getColor', () => ({
  getVariationColor: jest.fn((direction: string) => {
    if (direction === 'up') return '#00FF00';
    if (direction === 'down') return '#FF0000';
    return '';
  }),
}));

const MockedBar = jest.mocked(Components.Bar);

describe('RankingChart', () => {
  const mockData: ResourceAllocationData = {
    datasets: [
      {
        data: [100, 200, 300],
        formattedData: ['100', '200', '300'],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
        baseChartColor: ['#000', '#111', '#222'],
      },
    ],
    labels: ['Label1', 'Label2', 'Label3'],
    formattedData: [['100', '200', '300']],
    icons: ['icon1.svg'],
    hasPercentage: false,
    horizontalDashedLine: [{ value: 150 }],
  } as unknown as ResourceAllocationData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders NoDataYet when data is empty', () => {
    render(<RankingChart data={{ empty: true } as ResourceAllocationData} />);

    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
  });

  it('renders NoDataYet when datasets is missing', () => {
    render(<RankingChart data={{} as ResourceAllocationData} />);

    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
  });

  it('renders Bar chart with correct props', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toBeInTheDocument();
    expect(barChart.getAttribute('data-size')).toBe('small');
    expect(barChart.getAttribute('data-show-grid')).toBe('true');
    expect(barChart.getAttribute('data-index-axis')).toBe('x');
  });

  it('uses formattedData from top-level when available', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    const formattedData = JSON.parse(
      barChart.getAttribute('data-formatted-data') || '[]',
    );
    expect(formattedData).toEqual([['100', '200', '300']]);
  });

  it('renders correctly with hasPercentage', () => {
    const dataWithPercentage = {
      ...mockData,
      hasPercentage: true,
      formattedData: [['50%', '75%', '100%']],
    } as ResourceAllocationData;

    render(<RankingChart data={dataWithPercentage} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toBeInTheDocument();
    const options = JSON.parse(barChart.getAttribute('data-options') || '{}');
    expect(options.scales?.y?.ticks).toBeDefined();
  });

  it('configures y-axis ticks options correctly', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    const options = JSON.parse(barChart.getAttribute('data-options') || '{}');
    expect(options.scales?.y?.ticks).toBeDefined();
    expect(options.scales?.y?.ticks?.color).toBeDefined();
  });

  it('configures y-axis with correct grid settings', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    const options = JSON.parse(barChart.getAttribute('data-options') || '{}');
    expect(options.scales?.y?.grid?.drawOnChartArea).toBe(true);
    expect(options.scales?.y?.grid?.drawTicks).toBe(true);
    expect(options.scales?.y?.grid?.tickWidth).toBe(1);
    expect(options.scales?.y?.grid?.lineWidth).toBe(1);
  });

  it('configures plugins correctly', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    const pluginsCount = parseInt(
      barChart.getAttribute('data-plugins-count') || '0',
    );
    expect(pluginsCount).toBeGreaterThan(0);
  });

  it('includes all required plugins (DatalabelWithVariation, LabelIcon, and horizontalDashedLine when data exists)', () => {
    render(<RankingChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    const pluginsCount = parseInt(
      barChart.getAttribute('data-plugins-count') || '0',
    );
    expect(pluginsCount).toBe(3);
  });

  it('renders VariationCaption with variation_caption data', () => {
    const dataWithVariation = {
      ...mockData,
      variation_caption: [
        {
          title: 'Title',
          subtitle: 'Subtitle',
          variationsRows: {
            kpi1: { title: 'KPI 1', data: [] },
          },
        },
      ],
    } as unknown as ResourceAllocationData;

    render(<RankingChart data={dataWithVariation} />);

    const variationCaption = screen.getByTestId('variation-caption');
    expect(variationCaption).toBeInTheDocument();
    expect(variationCaption.getAttribute('data-grid-columns-count')).toBe('3');
    expect(variationCaption.getAttribute('data-padding-left')).toBe('42');
  });

  it('handles nested data structure', () => {
    const nestedData = {
      nestedKey: mockData,
    } as unknown as ResourceAllocationData;

    render(<RankingChart data={nestedData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  describe('suggestedMax with horizontalDashedLine guidelines', () => {
    it('should set suggestedMax to highest guideline when data values are below it', () => {
      const dataWithLowValues: ResourceAllocationData = {
        ...mockData,
        datasets: [{ data: [27, 14, 0, 0], backgroundColor: [] }],
        horizontalDashedLine: [{ value: 45 }, { value: 35 }],
      } as unknown as ResourceAllocationData;

      render(<RankingChart data={dataWithLowValues} />);

      const options = MockedBar.mock.calls[0][0].options as any;
      expect(options.scales.y.suggestedMax).toBe(45);
    });

    it('should not set suggestedMax when there are no guidelines', () => {
      const dataWithoutGuidelines: ResourceAllocationData = {
        ...mockData,
        horizontalDashedLine: [],
      } as unknown as ResourceAllocationData;

      render(<RankingChart data={dataWithoutGuidelines} />);

      const options = MockedBar.mock.calls[0][0].options as any;
      expect(options.scales.y.suggestedMax).toBeUndefined();
    });
  });

  describe('data-testid Rendering', () => {
    const mockData: ResourceAllocationData = {
      datasets: [
        {
          data: [100, 200],
          formattedData: ['100', '200'],
          backgroundColor: ['#FF5733', '#33FF57'],
        },
      ],
      labels: ['Label1', 'Label2'],
    } as unknown as ResourceAllocationData;

    it('should accept optional dataTestId prop', () => {
      render(<RankingChart data={mockData} dataTestId="test" />);

      expect(screen.getByTestId('test-ranking-chart')).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is undefined', () => {
      render(<RankingChart data={mockData} />);

      expect(
        screen.queryByTestId('test-ranking-chart'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should propagate dataTestId to Bar component', () => {
      render(<RankingChart data={mockData} dataTestId="test" />);

      expect(screen.getByTestId('test-ranking-chart-bar')).toBeInTheDocument();
    });

    it('should propagate dataTestId to VariationCaption', () => {
      const mockDataWithCaption = {
        ...mockData,
        variation_caption: [
          {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            variationsRows: {
              kpi1: { title: 'KPI 1', data: [] },
            },
          },
        ],
      } as unknown as ResourceAllocationData;

      render(<RankingChart data={mockDataWithCaption} dataTestId="test" />);

      expect(
        screen.getByTestId('test-ranking-chart-caption'),
      ).toBeInTheDocument();
    });

    it('should propagate dataTestId to NoDataYet when data is empty', () => {
      const emptyData = { empty: true } as unknown as ResourceAllocationData;
      render(<RankingChart data={emptyData} dataTestId="test" />);

      expect(
        screen.getByTestId('test-ranking-chart-no-data-yet'),
      ).toBeInTheDocument();
    });

    it('should propagate dataTestId to empty state wrapper', () => {
      const emptyData = { empty: true } as unknown as ResourceAllocationData;
      render(<RankingChart data={emptyData} dataTestId="test" />);

      expect(
        screen.getByTestId('test-ranking-chart-empty-state-wrapper'),
      ).toBeInTheDocument();
    });

    it('should propagate dataTestId to bar wrapper', () => {
      render(<RankingChart data={mockData} dataTestId="test" />);

      expect(
        screen.getByTestId('test-ranking-chart-wrapper'),
      ).toBeInTheDocument();
    });
  });
});
