import { render, screen } from '@testing-library/react';

import { mockBeesDistributionKpiData } from '../../__mocks';
import { ChartItem } from './ChartItem';

jest.mock('components', () => ({
  BigNumber: ({
    header,
    data,
    dataTestId,
    asCard,
    size,
  }: {
    header: React.ReactNode;
    data: unknown[];
    dataTestId?: string;
    asCard: boolean;
    size: string;
  }) => (
    <div
      data-testid={dataTestId || 'big-number'}
      data-as-card={asCard}
      data-size={size}
    >
      {header}
      <div data-testid="big-number-data">{JSON.stringify(data)}</div>
    </div>
  ),
  ChartHeader: ({
    title,
    measure,
    dataTestId,
    config,
  }: {
    title?: string;
    measure?: string;
    dataTestId?: string;
    config?: {
      inline?: string;
      type?: string;
    };
  }) => (
    <div
      data-testid={dataTestId || 'chart-header'}
      data-title={title}
      data-measure={measure}
      data-config={JSON.stringify(config)}
    >
      {title} {measure}
    </div>
  ),
  NoDataYet: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'no-data-yet'}>No Data Yet</div>
  ),
}));

const mockBar = jest.fn();
const mockLine = jest.fn();

jest.mock('components/Chart', () => ({
  Bar: (props: {
    datasets: unknown[];
    labels: string[];
    formattedData?: string[][];
    dataTestId?: string;
    showDivider: boolean;
    options: unknown;
  }) => {
    mockBar(props);
    return (
      <div
        data-testid={props.dataTestId || 'bar-chart'}
        data-datasets={JSON.stringify(props.datasets)}
        data-labels={JSON.stringify(props.labels)}
        data-formatted-data={JSON.stringify(props.formattedData)}
        data-show-divider={props.showDivider}
        data-options={JSON.stringify(props.options)}
      >
        Bar Chart
      </div>
    );
  },
  Line: (props: {
    datasets: unknown[];
    labels: string[];
    formattedData?: string[][];
    dataTestId?: string;
    showCustomGrid: boolean;
    options: unknown;
  }) => {
    mockLine(props);
    return (
      <div
        data-testid={props.dataTestId || 'line-chart'}
        data-datasets={JSON.stringify(props.datasets)}
        data-labels={JSON.stringify(props.labels)}
        data-formatted-data={JSON.stringify(props.formattedData)}
        data-show-custom-grid={props.showCustomGrid}
        data-options={JSON.stringify(props.options)}
      >
        Line Chart
      </div>
    );
  },
}));

jest.mock('components/ComparisonLine', () => ({
  ComparisonLine: ({
    gridColumnsLength,
    dataTestId,
    gridConfig,
    borderConfig,
  }: {
    data: unknown[];
    gridColumnsLength: number;
    dataTestId?: string;
    gridConfig: unknown;
    borderConfig: unknown;
  }) => (
    <div
      data-testid={dataTestId || 'comparison-line'}
      data-grid-columns={gridColumnsLength}
      data-grid-config={JSON.stringify(gridConfig)}
      data-border-config={JSON.stringify(borderConfig)}
    >
      Comparison Line
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledMultiChartContainer: ({
    children,
    type,
  }: {
    children: React.ReactNode;
    type: number;
  }) => (
    <div data-testid="multi-chart-container" data-type={type}>
      {children}
    </div>
  ),
}));

jest.mock('./ChartItem.styles', () => ({
  StyledChartItemWrapper: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'chart-item-wrapper'}>{children}</div>,

  StyledBeesDistributionCharContainer: ({
    children,
    isEmpty,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    isEmpty: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId || 'bees-distribution-char-container'}
      data-is-empty={isEmpty}
    >
      {children}
    </div>
  ),
  StyledDivider: ({
    'data-testid': dataTestId,
  }: {
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId || 'styled-divider'}
      style={{ display: 'flex', width: '100%', height: '1px' }}
    />
  ),
  StyledNoDataContainer: ({
    children,
    'data-testid': dataTestId,
    withBorder,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    withBorder?: boolean;
  }) => (
    <div
      data-testid={dataTestId || 'no-data-container'}
      data-with-border={withBorder}
    >
      {children}
    </div>
  ),
  StyledBeesDistributionChartContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="bees-distribution-chart-container">{children}</div>,
}));

const mockKpiData = {
  ...mockBeesDistributionKpiData.total_distribution,
  legend: [],
};

describe('ChartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBar.mockClear();
    mockLine.mockClear();
  });

  describe('Rendering', () => {
    it('should render chart-item with data-testid', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(screen.getByTestId('chart-item-test-id')).toBeInTheDocument();
    });

    it('should render chart-item-container with data-testid', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(
        screen.getByTestId('chart-item-container-test-id'),
      ).toBeInTheDocument();
    });
  });

  describe('BigNumber rendering', () => {
    it('should render BigNumber when bigNumberData exists', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(screen.getByTestId('test-id-chart-item')).toBeInTheDocument();
    });

    it('should not render BigNumber when bigNumberData is empty', () => {
      const kpiWithoutBigNumber = {
        ...mockKpiData,
        bigNumberData: [],
      };

      render(<ChartItem kpi={kpiWithoutBigNumber} dataTestId="test-id" />);

      expect(
        screen.queryByTestId('test-id-chart-item'),
      ).not.toBeInTheDocument();
    });

    it('should render ChartHeader in BigNumber header', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-chart-item-header'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('test-id-chart-item-header')).toHaveAttribute(
        'data-title',
        'Delta small',
      );
      expect(screen.getByTestId('test-id-chart-item-header')).toHaveAttribute(
        'data-measure',
        '[ Measure ]',
      );
    });
  });

  describe('Bar chart rendering', () => {
    it('should render Bar chart when hasBarData is true', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(screen.getByTestId('test-id-chart-item-bar')).toBeInTheDocument();
    });

    it('should render NoDataYet when hasBarData is false', () => {
      const kpiWithoutBarData = {
        ...mockKpiData,
        barChart: {
          ...mockKpiData.barChart,
          datasets: [
            {
              ...mockKpiData.barChart.datasets[0],
              data: [],
            },
          ],
        },
      };

      render(<ChartItem kpi={kpiWithoutBarData} dataTestId="test-id" />);

      expect(
        screen.getByTestId('chart-item-no-data-test-id'),
      ).toBeInTheDocument();
    });

    it('should render ComparisonLine for Bar chart', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const comparisonLines = screen.getAllByTestId(
        'test-id-chart-item-comparison-line',
      );
      expect(comparisonLines.length).toBeGreaterThan(0);
    });
  });

  describe('Line chart rendering', () => {
    it('should render Line chart when hasLineData is true', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(screen.getByTestId('test-id-chart-item-line')).toBeInTheDocument();
    });

    it('should render NoDataYet when hasLineData is false', () => {
      const kpiWithoutLineData = {
        ...mockKpiData,
        lineChart: {
          ...mockKpiData.lineChart,
          datasets: [
            {
              ...mockKpiData.lineChart.datasets[0],
              data: [],
            },
          ],
        },
      };

      render(<ChartItem kpi={kpiWithoutLineData} dataTestId="test-id" />);

      const noDataElements = screen.getAllByTestId(
        'chart-item-no-data-test-id',
      );
      expect(noDataElements.length).toBeGreaterThan(0);
    });

    it('should render ComparisonLine for Line chart', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const comparisonLines = screen.getAllByTestId(
        'test-id-chart-item-comparison-line',
      );
      expect(comparisonLines.length).toBe(2);
    });
  });

  describe('Empty state', () => {
    it('should set isEmpty to true when no bar or line data', () => {
      const emptyKpi = {
        ...mockKpiData,
        barChart: {
          ...mockKpiData.barChart,
          datasets: [
            {
              ...mockKpiData.barChart.datasets[0],
              data: [],
            },
          ],
        },
        lineChart: {
          ...mockKpiData.lineChart,
          datasets: [
            {
              ...mockKpiData.lineChart.datasets[0],
              data: [],
            },
          ],
        },
      };

      render(<ChartItem kpi={emptyKpi} dataTestId="test-id" />);

      const container = screen.getByTestId('chart-item-container-test-id');
      expect(container).toHaveAttribute('data-is-empty', 'true');
    });

    it('should set isEmpty to false when has bar or line data', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const container = screen.getByTestId('chart-item-container-test-id');
      expect(container).toHaveAttribute('data-is-empty', 'false');
    });
  });

  describe('Divider rendering', () => {
    it('should render divider with data-testid', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      expect(
        screen.getByTestId('chart-item-divider-test-id'),
      ).toBeInTheDocument();
    });

    it('should render divider even when bigNumberData is empty', () => {
      const kpiWithoutBigNumber = {
        ...mockKpiData,
        bigNumberData: [],
      };

      render(<ChartItem kpi={kpiWithoutBigNumber} dataTestId="test-id" />);

      expect(
        screen.getByTestId('chart-item-divider-test-id'),
      ).toBeInTheDocument();
    });
  });

  describe('Multi chart container', () => {
    it('should render both chart containers', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const containers = screen.getAllByTestId(
        'bees-distribution-chart-container',
      );
      expect(containers).toHaveLength(2);
    });
  });

  describe('Chart options configuration', () => {
    it('should configure Bar chart afterFit callback', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const barCall = mockBar.mock.calls[0][0];
      const mockAxis = { width: 0 };
      barCall.options.scales.y.afterFit(mockAxis);

      expect(mockAxis.width).toBe(45);
    });

    it('should configure Line chart afterFit callback', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const lineCall = mockLine.mock.calls[0][0];
      const mockAxis = { width: 0 };
      lineCall.options.scales.y.afterFit(mockAxis);

      expect(mockAxis.width).toBe(45);
    });

    it('should pass suggestedMin and suggestedMax to Line chart', () => {
      render(<ChartItem kpi={mockKpiData} dataTestId="test-id" />);

      const lineCall = mockLine.mock.calls[0][0];
      expect(lineCall.options.scales.y.suggestedMin).toBe(0);
      expect(lineCall.options.scales.y.suggestedMax).toBe(14);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined kpi prop', () => {
      render(<ChartItem dataTestId="test-id" />);

      const container = screen.getByTestId('chart-item-container-test-id');
      expect(container).toHaveAttribute('data-is-empty', 'true');
    });

    it('should handle kpi with only bar data', () => {
      const kpiWithOnlyBar = {
        ...mockKpiData,
        lineChart: {
          ...mockKpiData.lineChart,
          datasets: [
            {
              ...mockKpiData.lineChart.datasets[0],
              data: [],
            },
          ],
        },
      };

      render(<ChartItem kpi={kpiWithOnlyBar} dataTestId="test-id" />);

      expect(screen.getByTestId('test-id-chart-item-bar')).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-id-chart-item-line'),
      ).not.toBeInTheDocument();
    });

    it('should handle kpi with only line data', () => {
      const kpiWithOnlyLine = {
        ...mockKpiData,
        barChart: {
          ...mockKpiData.barChart,
          datasets: [
            {
              ...mockKpiData.barChart.datasets[0],
              data: [],
            },
          ],
        },
      };

      render(<ChartItem kpi={kpiWithOnlyLine} dataTestId="test-id" />);

      expect(
        screen.queryByTestId('test-id-chart-item-bar'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('test-id-chart-item-line')).toBeInTheDocument();
    });
  });
});
