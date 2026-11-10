import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { LineChartPerformance } from './LineChartPerformance';
import type { LineChartPerformanceData } from './LineChartPerformance';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

const mockBasicContainer = jest.fn();
const mockChartWrapper = jest.fn();
const mockChartHeader = jest.fn();
const mockLine = jest.fn();
const mockComparisonLine = jest.fn();
const mockSkeleton = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: any) => {
    mockBasicContainer(props);
    return (
      <div data-testid={props.dataTestId}>
        {props.header?.title}
        {props.children}
      </div>
    );
  },
  ChartWrapper: (props: any) => {
    mockChartWrapper(props);
    return (
      <div data-testid={props.dataTestId}>
        {props.header}
        {props.children}
      </div>
    );
  },
  ChartHeader: (props: any) => {
    mockChartHeader(props);
    return (
      <div data-testid={props.dataTestId}>
        {props.title} {props.measure}
      </div>
    );
  },
  Line: (props: any) => {
    mockLine(props);
    return <div data-testid={props.dataTestId}>Line Chart</div>;
  },
  ComparisonLine: (props: any) => {
    mockComparisonLine(props);
    return <div data-testid={props.dataTestId}>Comparison Line</div>;
  },
  Skeleton: (props: any) => {
    mockSkeleton(props);
    return <div data-testid={props.dataTestId}>Skeleton</div>;
  },
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../NoDataAvailable/NoDataAvailable', () => ({
  NoDataAvailable: ({ dataTestId }: any) => (
    <div data-testid={dataTestId}>Data not available</div>
  ),
}));

jest.mock('./LineChartPerformance.styles', () => ({
  ContentContainer: ({ children }: any) => (
    <div data-testid="content-container">{children}</div>
  ),
  HeaderWrapper: ({ children }: any) => (
    <div data-testid="header-wrapper">{children}</div>
  ),
  ChartContentWrapper: ({ children }: any) => (
    <div data-testid="chart-content-wrapper">{children}</div>
  ),
  ChartContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
}));

describe('LineChartPerformance Component', () => {
  const mockData: LineChartPerformanceData = {
    title: 'Beer Volume Performance',
    chartTitle: 'Beer Volume Overtime',
    chartLabel: 'Beer Volume',
    unit: 'k hl',
    comparisonTitle: 'vs LY',
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    values: [140500, 142300, 138900, 145200, 146800, 147500, 148817, 150200],
    formattedValues: [
      '140,500',
      '142,300',
      '138,900',
      '145,200',
      '146,800',
      '147,500',
      '148,817',
      '150,200',
    ],
    comparisonData: [
      { value: '-', measure: '', color: '#5C5C5C' },
      { value: '1.3', measure: '%', color: '#007800' },
      { value: '-2.4', measure: '%', color: '#C80000' },
      { value: '4.5', measure: '%', color: '#007800' },
      { value: '1.1', measure: '%', color: '#007800' },
      { value: '0.5', measure: '%', color: '#007800' },
      { value: '0.9', measure: '%', color: '#007800' },
      { value: '0.9', measure: '%', color: '#007800' },
    ],
  };

  const renderLineChartPerformance = (
    props: Partial<React.ComponentProps<typeof LineChartPerformance>> = {},
  ) =>
    render(
      <LineChartPerformance data={mockData} dataTestId="volume" {...props} />,
    );

  const getLineProps = () => mockLine.mock.calls[0][0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading and empty states', () => {
    it('renders only the loading skeleton while data is loading', () => {
      renderLineChartPerformance({ loading: true });

      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({
          width: '100%',
          height: '400px',
          length: 1,
          dataTestId: 'skeleton-volume',
        }),
      );
      expect(screen.getByTestId('skeleton-volume')).toBeInTheDocument();
      expect(mockBasicContainer).not.toHaveBeenCalled();
      expect(mockLine).not.toHaveBeenCalled();
    });

    it('does not generate a skeleton test id when dataTestId is omitted', () => {
      render(<LineChartPerformance loading />);

      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it.each([
      ['data is missing', undefined],
      ['values are empty', { ...mockData, values: [] }],
      ['labels are empty', { ...mockData, labels: [] }],
    ])('renders NoDataAvailable when %s', (_scenario, data) => {
      renderLineChartPerformance({ data });

      expect(screen.getByText('Data not available')).toBeInTheDocument();
      expect(mockBasicContainer).not.toHaveBeenCalled();
      expect(mockLine).not.toHaveBeenCalled();
    });
  });

  describe('Rendering with chart data', () => {
    it('renders the chart container, header, line chart, and comparison line', () => {
      renderLineChartPerformance();

      expect(screen.getByTestId('volume')).toBeInTheDocument();
      expect(screen.getByText('Beer Volume Performance')).toBeInTheDocument();
      expect(
        screen.getByText('Beer Volume Overtime [ k hl ]'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('volume-chart')).toHaveTextContent(
        'Line Chart',
      );
      expect(screen.getByTestId('volume-comparison-line')).toHaveTextContent(
        'Comparison Line',
      );
      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            title: 'Beer Volume Performance',
            titleSize: 'H2',
          }),
          layout: { bodyPadding: false, background: '#F9F9F9' },
        }),
      );
      expect(mockChartWrapper).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: 'volume-chart-wrapper' }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Beer Volume Overtime',
          measure: '  [ k hl ]',
          config: { inline: 'horizontal', type: 'large', alignment: 'left' },
        }),
      );
    });

    it('passes chart data, formatting, and comparison data to chart components', () => {
      renderLineChartPerformance();

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'volume-chart',
          labels: mockData.labels,
          datasets: [
            {
              label: 'Beer Volume k hl',
              data: mockData.values,
              borderColor: '#DEB333',
              pointBackgroundColor: '#DEB333',
              borderWidth: 2,
              pointRadius: 5,
              pointBorderWidth: 2,
              pointBorderColor: '#FFFFFF',
              yAxisID: 'y',
            },
          ],
          formattedData: [mockData.formattedValues],
        }),
      );
      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'volume-comparison-line',
          data: [{ title: 'vs LY', data: mockData.comparisonData }],
          gridColumnsLength: mockData.labels.length,
          gridConfig: { paddingLeft: 2, paddingRight: 2 },
          borderConfig: { marginLeft: 56, marginRight: 8 },
        }),
      );
    });

    it('configures the chart plugin, legend, grid, and Y-axis formatter', () => {
      renderLineChartPerformance();

      const lineProps = getLineProps();
      const yAxis = lineProps.options.scales.y;

      expect(lineProps.options.plugins).toEqual(
        expect.objectContaining({
          legend: { display: false },
          lineChartHighlight: {
            display: true,
            highlightIndex: undefined,
            highlightColor: '#FFF8DC',
          },
        }),
      );
      expect(yAxis).toEqual(
        expect.objectContaining({
          type: 'linear',
          position: 'left',
          grid: expect.objectContaining({
            drawOnChartArea: true,
            drawTicks: true,
            tickLength: 4,
            tickWidth: 2,
          }),
        }),
      );
      expect(yAxis.suggestedMin).toBeUndefined();
      expect(yAxis.suggestedMax).toBeUndefined();
      expect(yAxis.ticks.stepSize).toBeUndefined();
      expect(yAxis.ticks.callback(148817.3)).toBe('148.8k');
      expect(yAxis.ticks.callback(1500000)).toBe('1.5M');
      expect(yAxis.ticks.callback(500)).toBe('500');
      expect(yAxis.ticks.callback('string')).toBe('string');

      const axis = { width: 0 };
      yAxis.afterFit(axis);
      expect(axis.width).toBe(55);
    });

    it('applies a custom line color when provided', () => {
      renderLineChartPerformance({ lineColor: '#123456' });

      expect(getLineProps().datasets[0]).toEqual(
        expect.objectContaining({
          borderColor: '#123456',
          pointBackgroundColor: '#123456',
          pointBorderColor: '#FFFFFF',
        }),
      );
    });
  });

  describe('Optional configuration', () => {
    it('does not pass generated test ids to child charts when dataTestId is omitted', () => {
      render(<LineChartPerformance data={mockData} />);

      expect(screen.getByText('Beer Volume Performance')).toBeInTheDocument();
      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it('applies Y-axis bounds and step size from yAxisConfig', () => {
      renderLineChartPerformance({
        yAxisConfig: { suggestedMin: 80, suggestedMax: 100, stepSize: 5 },
      });

      const yAxis = getLineProps().options.scales.y;

      expect(yAxis.suggestedMin).toBe(80);
      expect(yAxis.suggestedMax).toBe(100);
      expect(yAxis.ticks.stepSize).toBe(5);
    });

    it('highlights the matching label when highlightLabel is provided', () => {
      renderLineChartPerformance({ highlightLabel: '2023' });

      expect(getLineProps().options.plugins.lineChartHighlight).toEqual(
        expect.objectContaining({ highlightIndex: 5 }),
      );
    });

    it('keeps highlight index undefined when the label is not found', () => {
      renderLineChartPerformance({ highlightLabel: '2030' });

      expect(getLineProps().options.plugins.lineChartHighlight).toEqual(
        expect.objectContaining({ highlightIndex: undefined }),
      );
    });
  });
});
