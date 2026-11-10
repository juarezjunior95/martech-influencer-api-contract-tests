import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Drivers, DriversData } from './Drivers';
import {
  AXIS_CONFIG,
  AXIS_HEADROOM_MULTIPLIER,
  CHART_COLORS,
  DATALABEL_OFFSET,
} from './drivers.constants';
import { useDriversTooltip } from './hooks';
import { getAxisBounds } from './utils';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

const mockBasicContainer = jest.fn();
const mockChartWrapper = jest.fn();
const mockChartHeader = jest.fn();
const mockLine = jest.fn();
const mockLegend = jest.fn();
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

jest.mock('components/Chart', () => ({
  Legend: (props: any) => {
    mockLegend(props);
    return <div data-testid={props.dataTestId}>Legend</div>;
  },
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./Drivers.styles', () => ({
  DriversWrapper: ({ children }: any) => (
    <div data-testid="drivers-wrapper">{children}</div>
  ),
  ContentContainer: ({ children }: any) => (
    <div data-testid="content-container">{children}</div>
  ),
  HeaderWrapper: ({ children }: any) => (
    <div data-testid="header-wrapper">{children}</div>
  ),
  ChartContentWrapper: ({ children }: any) => (
    <div data-testid="chart-content-wrapper">{children}</div>
  ),
  ChartContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']} {...props}>
      {children}
    </div>
  ),
  LegendContainer: ({ children }: any) => (
    <div data-testid="legend-container">{children}</div>
  ),
}));

jest.mock('../NoDataAvailable/NoDataAvailable', () => ({
  NoDataAvailable: ({ dataTestId }: any) => (
    <div data-testid={`${dataTestId}-no-data-available`}>No data available</div>
  ),
}));

jest.mock('./hooks', () => ({
  useDriversTooltip: jest.fn(() => jest.fn()),
}));

jest.mock('./utils', () => ({
  getAxisBounds: jest.fn((popValues, iclValues) => {
    if (!popValues?.length || !iclValues?.length) {
      return { populationMax: 0, iclMax: 0 };
    }
    return {
      populationMax: Math.max(...popValues) * 1.5,
      iclMax: Math.max(...iclValues) * 1.5,
    };
  }),
  getDataLabelPosition: jest.fn(() => ({
    anchor: 'end',
    align: 'top',
  })),
}));

describe('Drivers Component', () => {
  const mockData: DriversData = {
    title: 'Drivers',
    chartTitle: 'Population & BICL Overtime',
    populationUnit: '# and L/Year',
    populationLabel: 'Population',
    iclLabel: 'BICL',
    populationComparisonTitle: 'Population vs LY',
    iclComparisonTitle: 'BICL vs LY',
    labels: ['2018', '2019', '2020', '2021'],
    populationValues: [152.5, 154.3, 156.1, 161.5],
    iclValues: [89.2, 91.2, 93.1, 92.2],
    populationFormattedValues: ['152.5', '154.3', '156.1', '161.5'],
    iclFormattedValues: ['89.2', '91.2', '93.1', '92.2'],
    populationComparisonData: [
      { value: '-', measure: '', color: '#5C5C5C' },
      { value: '1.2', measure: '%', color: '#007800', trend: 'positive' },
      { value: '1.2', measure: '%', color: '#007800', trend: 'positive' },
      { value: '-0.8', measure: '%', color: '#C80000', trend: 'negative' },
    ],
    iclComparisonData: [
      { value: '-', measure: '', color: '#5C5C5C' },
      { value: '2.3', measure: '%', color: '#007800', trend: 'positive' },
      { value: '2.1', measure: '%', color: '#007800', trend: 'positive' },
      { value: '-0.2', measure: '%', color: '#C80000', trend: 'negative' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    test('should render Skeleton when loading is true', () => {
      render(<Drivers loading dataTestId="drill-down" />);
      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({
          width: '100%',
          height: '300px',
          length: 1,
          dataTestId: 'skeleton-drill-down-drivers',
        }),
      );
      expect(
        screen.getByTestId('skeleton-drill-down-drivers'),
      ).toBeInTheDocument();
    });

    test('should not render chart content when loading is true', () => {
      render(<Drivers loading data={mockData} dataTestId="drill-down" />);
      expect(mockBasicContainer).not.toHaveBeenCalled();
      expect(mockLine).not.toHaveBeenCalled();
    });
  });

  describe('Rendering without data', () => {
    it.each([
      ['data is undefined', undefined],
      ['labels are empty', { ...mockData, labels: [] }],
      ['population values are empty', { ...mockData, populationValues: [] }],
    ])('should render NoDataAvailable when %s', (_scenario, data) => {
      render(<Drivers data={data} dataTestId="test" />);

      expect(screen.getByTestId('test-no-data-available')).toBeInTheDocument();
      expect(mockLine).not.toHaveBeenCalled();
    });
  });

  describe('Rendering with data', () => {
    test('should render the component with all main elements', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(screen.getByTestId('drivers-drivers')).toBeInTheDocument();
      expect(screen.getByText('Drivers')).toBeInTheDocument();
    });

    test('should render ChartHeader with correct title and measure', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Population & BICL Overtime',
          measure: '  [ # and L/Year ]',
          config: {
            inline: 'horizontal',
            type: 'large',
            alignment: 'left',
          },
        }),
      );
    });

    test('should render Line chart with correct props', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'drivers-drivers-chart',
          labels: mockData.labels,
          axisType: 'two',
          datasets: [
            {
              label: 'Population',
              data: mockData.populationValues,
              borderColor: CHART_COLORS.population.border,
              backgroundColor: CHART_COLORS.population.background,
              pointBackgroundColor: CHART_COLORS.population.background,
              borderWidth: 2,
              yAxisID: 'y',
              datalabels: expect.objectContaining({
                offset: DATALABEL_OFFSET,
                color: expect.any(String),
                formatter: expect.any(Function),
                anchor: expect.any(Function),
                align: expect.any(Function),
              }),
            },
            {
              label: 'BICL',
              data: mockData.iclValues,
              borderColor: CHART_COLORS.icl.border,
              backgroundColor: CHART_COLORS.icl.background,
              pointBackgroundColor: CHART_COLORS.icl.background,
              borderWidth: 2,
              yAxisID: 'y1',
              datalabels: expect.objectContaining({
                offset: DATALABEL_OFFSET,
                color: expect.any(String),
                formatter: expect.any(Function),
                anchor: expect.any(Function),
                align: expect.any(Function),
              }),
            },
          ],
          formattedData: [
            mockData.populationFormattedValues,
            mockData.iclFormattedValues,
          ],
          options: expect.objectContaining({
            plugins: expect.any(Object),
            scales: expect.any(Object),
          }),
        }),
      );
    });

    test('should configure chart plugins for tooltip, highlight, and legend', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              legend: { display: false },
              lineChartHighlight: {
                display: true,
                highlightIndex: undefined,
                highlightColor: '#FFF8DC',
              },
              tooltip: expect.objectContaining({
                enabled: false,
                external: expect.any(Function),
                mode: 'index',
                intersect: true,
              }),
            }),
          }),
        }),
      );
    });
  });

  describe('Legend', () => {
    test('should render Legend component with correct props', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: [
            {
              label: 'Population',
              color: CHART_COLORS.population.background,
              border: CHART_COLORS.population.border,
              pointStyle: 'roundedRectangle',
            },
            {
              label: 'BICL',
              color: CHART_COLORS.icl.background,
              border: CHART_COLORS.icl.border,
              pointStyle: 'roundedRectangle',
            },
          ],
          legendPosition: 'right',
          fontSize: 'xsmall',
          dataTestId: 'drivers-drivers-legend',
        }),
      );
    });

    test('should render Legend with dynamic ICL type label from API data', () => {
      const bybData: DriversData = {
        ...mockData,
        iclLabel: 'BYB ICL',
        chartTitle: 'Population & BYB ICL Overtime',
        iclComparisonTitle: 'BYB ICL vs LY',
      };
      render(<Drivers data={bybData} dataTestId="drivers" />);

      expect(mockLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: expect.arrayContaining([
            expect.objectContaining({ label: 'BYB ICL' }),
          ]),
        }),
      );
    });

    test('should render Legend inside LegendContainer', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(screen.getByTestId('legend-container')).toBeInTheDocument();
      expect(screen.getByTestId('drivers-drivers-legend')).toBeInTheDocument();
    });
  });

  describe('ComparisonLine components', () => {
    test('should render ComparisonLine with both population and ICL data combined', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'drivers-drivers-comparison-line',
          data: [
            {
              title: 'Population vs LY',
              data: mockData.populationComparisonData,
            },
            {
              title: 'BICL vs LY',
              data: mockData.iclComparisonData,
            },
          ],
          gridColumnsLength: mockData.labels.length,
          gridConfig: { paddingLeft: 2, paddingRight: 2 },
          borderConfig: {
            marginLeft: AXIS_CONFIG.y.width + 1,
            marginRight: AXIS_CONFIG.y1.width,
          },
        }),
      );
      expect(
        screen.getByTestId('drivers-drivers-comparison-line'),
      ).toBeInTheDocument();
    });
  });

  describe('data-testid implementation', () => {
    test('should pass dataTestId to all child components correctly', () => {
      render(<Drivers data={mockData} dataTestId="test-drivers" />);

      // Main container
      expect(screen.getByTestId('test-drivers-drivers')).toBeInTheDocument();

      // Chart
      expect(
        screen.getByTestId('test-drivers-drivers-chart'),
      ).toBeInTheDocument();

      // Legend
      expect(
        screen.getByTestId('test-drivers-drivers-legend'),
      ).toBeInTheDocument();

      // Comparison Line
      expect(
        screen.getByTestId('test-drivers-drivers-comparison-line'),
      ).toBeInTheDocument();
    });

    test('should not break when dataTestId is not provided', () => {
      render(<Drivers data={mockData} />);

      expect(screen.getByText('Drivers')).toBeInTheDocument();
      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
      expect(mockLegend).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });
  });

  describe('Chart scales configuration', () => {
    test('should configure two Y-axes correctly', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            scales: expect.objectContaining({
              x: {
                suggestedMin: 0,
                suggestedMax: mockData.labels.length - 1,
              },
              y: expect.objectContaining({
                type: 'linear',
                position: 'left',
                suggestedMin: 0,
                suggestedMax:
                  Math.max(...mockData.populationValues) *
                  AXIS_HEADROOM_MULTIPLIER,
                ticks: {
                  display: true,
                  callback: expect.any(Function),
                },
                afterFit: expect.any(Function),
              }),
              y1: expect.objectContaining({
                type: 'linear',
                position: 'right',
                suggestedMax:
                  Math.max(...mockData.iclValues) * AXIS_HEADROOM_MULTIPLIER,
                ticks: {
                  display: true,
                  callback: expect.any(Function),
                },
                afterFit: expect.any(Function),
              }),
            }),
          }),
        }),
      );
    });

    test('should apply fixed axis widths', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      const lineCall = mockLine.mock.calls[0][0];
      const yAxisMock = { width: 0 };
      const y1AxisMock = { width: 0 };

      lineCall.options.scales.y.afterFit(yAxisMock);
      lineCall.options.scales.y1.afterFit(y1AxisMock);

      expect(yAxisMock.width).toBe(AXIS_CONFIG.y.width);
      expect(y1AxisMock.width).toBe(AXIS_CONFIG.y1.width);
    });
  });

  describe('highlightLabel prop', () => {
    test('should highlight the specified label when highlightLabel is provided', () => {
      render(
        <Drivers data={mockData} dataTestId="drivers" highlightLabel="2020" />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              lineChartHighlight: expect.objectContaining({
                highlightIndex: 2, // '2020' is at index 2
              }),
            }),
          }),
        }),
      );
    });

    test('should return undefined when highlightLabel is not found', () => {
      render(
        <Drivers data={mockData} dataTestId="drivers" highlightLabel="2030" />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              lineChartHighlight: expect.objectContaining({
                highlightIndex: undefined,
              }),
            }),
          }),
        }),
      );
    });
  });

  describe('Hooks and Utils integration', () => {
    test('should use useDriversTooltip hook', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      expect(useDriversTooltip).toHaveBeenCalledWith({
        populationLabel: mockData.populationLabel,
        iclLabel: mockData.iclLabel,
        populationFormattedValues: mockData.populationFormattedValues,
        iclFormattedValues: mockData.iclFormattedValues,
        populationValues: mockData.populationValues,
        iclValues: mockData.iclValues,
      });
    });

    test('should format data labels and resolve their positions', () => {
      render(<Drivers data={mockData} dataTestId="drivers" />);

      const lineCall = mockLine.mock.calls[0][0];
      const populationDataset = lineCall.datasets[0];
      const iclDataset = lineCall.datasets[1];
      const context = { dataIndex: 2 };

      expect(populationDataset.datalabels.formatter(null, context)).toBe(
        '156.1',
      );
      expect(iclDataset.datalabels.formatter(null, context)).toBe('93.1');
      expect(
        populationDataset.datalabels.formatter(null, { dataIndex: 10 }),
      ).toBe('');
      expect(iclDataset.datalabels.formatter(null, { dataIndex: 10 })).toBe('');

      expect(populationDataset.datalabels.anchor(context)).toBe('end');
      expect(populationDataset.datalabels.align(context)).toBe('top');
      expect(iclDataset.datalabels.anchor(context)).toBe('end');
      expect(iclDataset.datalabels.align(context)).toBe('top');
      expect(getAxisBounds).toHaveBeenCalledWith(
        mockData.populationValues,
        mockData.iclValues,
      );
    });
  });
});
