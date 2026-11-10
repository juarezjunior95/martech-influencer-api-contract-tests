import { render, screen } from '@testing-library/react';
import { ConnectorPluginProps } from 'components/Chart/plugins';
import { theme } from 'theme';

import { StrategicInnovationChartSectionData } from '../../types';
import { StrategicInnovationChartSection } from './StrategicInnovationChartSection';

const chartDataLabelsPluginMock = { name: 'chartDataLabelsPluginMock' };
const connectorPluginMock = { name: 'connectorPluginMock' };

const mockBar = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'bar-mock'} />
));
const mockNoDataYet = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'no-data-yet-mock'} />
));
const mockBigNumbers = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'big-numbers-mock'} />
));
const mockComparisonLine = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'comparison-line-mock'} />
));

const mockGetBorderConfig = jest.fn();
const mockGetDatalabelsConfig = jest.fn();
const mockGetChartOptions = jest.fn();

const {
  getBorderConfig: actualGetBorderConfig,
  getChartOptions: actualGetChartOptions,
  getDatalabelsConfig: actualGetDatalabelsConfig,
} = jest.requireActual('./utils/utils');

jest.mock('chartjs-plugin-datalabels', () => chartDataLabelsPluginMock);

jest.mock('components/Chart/plugins/ConnectorPlugin/ConnectorPlugin', () => ({
  ConnectorPlugin: connectorPluginMock,
}));

jest.mock('components', () => ({
  Bar: (props: any) => mockBar(props),
  NoDataYet: (props: any) => mockNoDataYet(props),
}));

jest.mock('components/ComparisonLine/ComparisonLine', () => ({
  ComparisonLine: (props: any) => mockComparisonLine(props),
}));

jest.mock('../BigNumbers/BigNumbers', () => ({
  BigNumbers: (props: any) => mockBigNumbers(props),
}));

jest.mock('./utils/utils', () => ({
  getBorderConfig: (isPortfolio: boolean, index: number) =>
    mockGetBorderConfig(isPortfolio, index),
  getDatalabelsConfig: (
    isPortfolio: boolean,
    index: number,
    datasetsSum: number[] | undefined,
  ) => mockGetDatalabelsConfig(isPortfolio, index, datasetsSum),
  getChartOptions: (connector: unknown) => mockGetChartOptions(connector),
}));

const defaultBigNumber: StrategicInnovationChartSectionData['bigNumber'] = {
  id: 'defaultBigNumber',
  period: "Aug'25",
  data: [
    {
      bigNumber: {
        value: '10.5',
        measure: '%',
        color: '#007800',
      },
      comparison: {
        label: 'vs',
        value: "Jul'25",
      },
    },
  ],
};

const defaultComparisonLine = {
  title: 'Volume/SKU',
  data: [
    { value: '1.2', measure: '%', color: '#007800' },
    { value: '0.8', measure: '%', color: '#141414' },
  ],
};

const defaultChart: StrategicInnovationChartSectionData['chart'] = {
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 20],
      backgroundColor: '#EDDAB1',
    },
    {
      label: 'Dataset 2',
      data: [15, 25],
      backgroundColor: '#D3E3EE',
    },
  ],
  labels: ['2023', '2024'],
  datasetsSum: [25, 45],
  connector: {
    value: '100',
    from: '2023',
    to: '2024',
    backgroundColor: '#E6F9E6',
    textColor: '#007800',
    measure: '%',
  },
  comparisonLine: defaultComparisonLine,
};

const renderComponent = ({
  data: dataOverride,
  id = 'portfolio',
  dataTestId,
}: {
  data?: Partial<StrategicInnovationChartSectionData>;
  id?: string;
  dataTestId?: string;
} = {}) => {
  const data: StrategicInnovationChartSectionData = {
    bigNumber:
      dataOverride &&
      Object.prototype.hasOwnProperty.call(dataOverride, 'bigNumber')
        ? dataOverride.bigNumber
        : defaultBigNumber,
    chart:
      dataOverride &&
      Object.prototype.hasOwnProperty.call(dataOverride, 'chart')
        ? (dataOverride.chart as StrategicInnovationChartSectionData['chart'])
        : defaultChart,
  };

  return render(
    <StrategicInnovationChartSection
      id={id}
      data={data}
      dataTestId={dataTestId}
    />,
  );
};

describe('StrategicInnovationChartSection utils', () => {
  describe('getChartOptions', () => {
    it('returns chart options with stacked scales and connector plugin', () => {
      const connector: ConnectorPluginProps = {
        value: '100',
        from: '2023',
        to: '2024',
        backgroundColor: '#E6F9E6',
        textColor: '#007800',
        measure: '%',
      };

      expect(actualGetChartOptions(connector)).toEqual({
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 80,
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            afterFit: expect.any(Function),
          },
        },
        plugins: {
          datalabels: {
            display: true,
            color: '#141414',
            font: {
              size: 12,
              family: 'Barlow',
            },
          },
          connector,
        },
      });
    });
  });

  describe('getDatalabelsConfig', () => {
    it('returns base configuration values', () => {
      const config = actualGetDatalabelsConfig(true, 0, [100]);

      expect(config.font).toEqual({
        family: 'Work Sans',
        size: 12,
        style: 'normal',
        weight: 'normal',
        lineHeight: '140%',
      });

      expect(config.labels.inside).toEqual(
        expect.objectContaining({
          anchor: 'center',
          align: 'center',
          color: theme.colors.txt.default,
        }),
      );

      expect(config.labels.top).toEqual(
        expect.objectContaining({
          anchor: 'end',
          align: 'end',
          offset: 2,
          color: theme.colors.txt.default,
        }),
      );
    });

    it('returns null inside formatter when not portfolio', () => {
      const config = actualGetDatalabelsConfig(false, 0, [100]);

      expect(config.labels.inside.formatter(50)).toBeNull();
      expect(config.labels.top.formatter(30, { dataIndex: 0 })).toBe(30);
    });

    it('returns value for inside formatter when portfolio', () => {
      const config = actualGetDatalabelsConfig(true, 0, [100]);

      expect(config.labels.inside.formatter(75)).toBe(75);
      expect(config.labels.top.formatter(30, { dataIndex: 0 })).toBeNull();
    });

    it('returns dataset sum for top formatter in portfolio second dataset', () => {
      const datasetsSum = [120, 240];
      const config = actualGetDatalabelsConfig(true, 1, datasetsSum);

      expect(config.labels.top.formatter(30, { dataIndex: 1 })).toBe(
        datasetsSum[1],
      );
    });
  });

  describe('getBorderConfig', () => {
    it('returns specific border config for portfolio first dataset', () => {
      expect(actualGetBorderConfig(true, 0)).toEqual({
        borderRadius: 0,
        borderColor: 'white',
        borderWidth: {
          top: 4,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });
    });

    it('returns default border config for other cases', () => {
      const expected = {
        borderRadius: 4,
        borderColor: 'transparent',
        borderWidth: 0,
      };

      expect(actualGetBorderConfig(false, 0)).toEqual(expected);
      expect(actualGetBorderConfig(true, 1)).toEqual(expected);
    });
  });
});

describe('StrategicInnovationChartSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetBorderConfig.mockImplementation((_isPortfolio, index) => ({
      borderConfig: `border-${index}`,
    }));
    mockGetDatalabelsConfig.mockImplementation((_isPortfolio, index) => ({
      datalabelConfig: `datalabel-${index}`,
    }));
    mockGetChartOptions.mockImplementation((connector) => ({
      connector,
    }));
  });

  it('renders big numbers, bar chart and comparison line when chart data exists', () => {
    renderComponent();

    expect(mockBigNumbers).toHaveBeenCalledTimes(1);
    const bigNumbersProps = mockBigNumbers.mock.calls[0][0];
    expect(bigNumbersProps.data).toEqual([defaultBigNumber]);
    expect(bigNumbersProps.asCard).toBe(false);

    expect(mockBar).toHaveBeenCalledTimes(1);
    const barProps = mockBar.mock.calls[0][0];
    const borderConfigs = mockGetBorderConfig.mock.results.map(
      (result) => result.value,
    );
    const datalabelConfigs = mockGetDatalabelsConfig.mock.results.map(
      (result) => result.value,
    );

    expect(barProps.datasets).toEqual(
      defaultChart?.datasets?.map((dataset, index) => ({
        ...dataset,
        ...borderConfigs[index],
        datalabels: datalabelConfigs[index],
      })),
    );
    expect(barProps.labels).toBe(defaultChart?.labels);
    expect(barProps.plugins).toEqual([
      chartDataLabelsPluginMock,
      connectorPluginMock,
    ]);

    defaultChart?.datasets?.forEach((_dataset, index) => {
      expect(mockGetBorderConfig).toHaveBeenNthCalledWith(
        1 + index,
        true,
        index,
      );
      expect(mockGetDatalabelsConfig).toHaveBeenNthCalledWith(
        1 + index,
        true,
        index,
        defaultChart?.datasetsSum,
      );
    });

    expect(mockGetChartOptions).toHaveBeenCalledWith(defaultChart?.connector);
    expect(barProps.options).toEqual(mockGetChartOptions.mock.results[0].value);

    expect(mockComparisonLine).toHaveBeenCalledTimes(1);
    const comparisonLineProps = mockComparisonLine.mock.calls[0][0];
    expect(comparisonLineProps.data).toEqual([defaultComparisonLine]);
    expect(comparisonLineProps.gridColumnsLength).toBe(
      defaultComparisonLine.data.length,
    );
  });

  it('renders a fallback when the chart has no datasets', () => {
    renderComponent({
      data: {
        chart: {
          datasets: [],
          labels: [],
          datasetsSum: [],
        },
      },
    });

    expect(mockNoDataYet).toHaveBeenCalledTimes(1);
    expect(mockBar).not.toHaveBeenCalled();
    expect(mockComparisonLine).not.toHaveBeenCalled();
  });

  it('does not render a comparison line when none is provided', () => {
    renderComponent({
      data: {
        chart: {
          ...defaultChart,
          comparisonLine: undefined,
        },
      },
    });

    expect(mockComparisonLine).not.toHaveBeenCalled();
  });

  describe('data-testid Implementation', () => {
    it('should accept dataTestId as optional prop', () => {
      renderComponent({ dataTestId: 'test-chart' });

      expect(
        screen.getByTestId('chart-section-test-chart'),
      ).toBeInTheDocument();
    });

    it('should render without dataTestId prop', () => {
      renderComponent();

      expect(mockBigNumbers).toHaveBeenCalled();
      expect(mockBar).toHaveBeenCalled();
    });

    it('should not render data-testid attributes when dataTestId is undefined', () => {
      renderComponent({ dataTestId: undefined });

      expect(mockBigNumbers).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: undefined,
        }),
      );
      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({
          'data-testid': undefined,
        }),
      );
    });

    it('should apply correct data-testid to root container', () => {
      renderComponent({ dataTestId: 'custom' });

      expect(screen.getByTestId('chart-section-custom')).toBeInTheDocument();
    });

    it('should apply correct data-testid to big number container', () => {
      const { container } = renderComponent({ dataTestId: 'custom' });

      const bigNumberContainer = container.querySelector(
        '[data-testid="custom-big-number-container"]',
      );
      expect(bigNumberContainer).toBeInTheDocument();
    });

    it('should propagate dataTestId to BigNumbers component', () => {
      renderComponent({ dataTestId: 'custom' });

      expect(mockBigNumbers).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'custom-big-numbers',
        }),
      );
    });

    it('should apply correct data-testid to chart content wrapper', () => {
      const { container } = renderComponent({ dataTestId: 'custom' });

      const chartContent = container.querySelector(
        '[data-testid="custom-chart-content"]',
      );
      expect(chartContent).toBeInTheDocument();
    });

    it('should apply correct data-testid to bar container', () => {
      const { container } = renderComponent({ dataTestId: 'custom' });

      const barContainer = container.querySelector(
        '[data-testid="custom-bar-container"]',
      );
      expect(barContainer).toBeInTheDocument();
    });

    it('should propagate dataTestId to Bar component with chart prefix', () => {
      renderComponent({ dataTestId: 'custom' });

      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({
          'data-testid': 'chart-custom',
        }),
      );
    });

    it('should apply correct data-testid to comparison line container', () => {
      const { container } = renderComponent({ dataTestId: 'custom' });

      const comparisonContainer = container.querySelector(
        '[data-testid="custom-comparison-line-container"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });

    it('should propagate dataTestId to ComparisonLine component', () => {
      renderComponent({ dataTestId: 'custom' });

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          'data-testid': 'custom-comparison-line',
        }),
      );
    });

    it('should propagate dataTestId to NoDataYet with empty-state prefix when no data', () => {
      renderComponent({
        dataTestId: 'custom',
        data: {
          chart: { datasets: [], labels: [] },
        },
      });

      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          'data-testid': 'empty-state-custom',
        }),
      );
    });

    it('should render all data-testids in correct hierarchy', () => {
      const { container } = renderComponent({ dataTestId: 'test' });

      const root = container.querySelector(
        '[data-testid="chart-section-test"]',
      );
      const bigNumberContainer = container.querySelector(
        '[data-testid="test-big-number-container"]',
      );
      const chartContent = container.querySelector(
        '[data-testid="test-chart-content"]',
      );

      expect(root).toContainElement(bigNumberContainer as HTMLElement);
      expect(root).toContainElement(chartContent as HTMLElement);
    });

    it('should maintain dataTestId after rerender', () => {
      const { rerender } = renderComponent({ dataTestId: 'initial' });

      expect(screen.getByTestId('chart-section-initial')).toBeInTheDocument();

      rerender(
        <StrategicInnovationChartSection
          id="portfolio"
          data={{
            chart: defaultChart,
            bigNumber: defaultBigNumber,
          }}
          dataTestId="initial"
        />,
      );

      expect(screen.getByTestId('chart-section-initial')).toBeInTheDocument();
    });

    it('should use kebab-case naming convention for all data-testids', () => {
      const { container } = renderComponent({ dataTestId: 'test-chart' });

      const allTestIds = Array.from(
        container.querySelectorAll('[data-testid]'),
      ).map((el) => el.getAttribute('data-testid'));

      allTestIds.forEach((testId) => {
        expect(testId).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
      });
    });

    it('should handle special characters in dataTestId', () => {
      renderComponent({ dataTestId: 'test-chart-123' });

      expect(
        screen.getByTestId('chart-section-test-chart-123'),
      ).toBeInTheDocument();
    });
  });
});
