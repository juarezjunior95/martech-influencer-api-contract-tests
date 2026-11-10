import React from 'react';

import { render, screen } from '@testing-library/react';

import { StrategicInnovationHealthData } from '../../types';
import {
  STRATEGIC_INNOVATION_LEGEND_CONFIG,
  StrategicInnovationPortfolio,
} from './StrategicInnovationPortfolio';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => {
  const messages: Record<string, string> = {
    'Innovation.Innovation.Overview.StrategicInnovationPillars.Legend.innovation':
      'Innovation',
    'Innovation.Innovation.Overview.StrategicInnovationPillars.Legend.mature':
      'Mature',
    'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.title':
      'Portfolio Health',
    'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.tooltip':
      'Portfolio health tooltip',
  };
  return messages[id] ?? id;
});

const expectedLegendItems = [
  {
    label: 'Innovation',
    color: '#D3E3EE',
    ...STRATEGIC_INNOVATION_LEGEND_CONFIG,
  },
  {
    label: 'Mature',
    color: '#EDDAB1',
    ...STRATEGIC_INNOVATION_LEGEND_CONFIG,
  },
];

const mockChartHeader = jest.fn((props: Record<string, unknown>) => (
  <div data-testid={props.dataTestId as string | undefined}>
    {props.title as React.ReactNode}
  </div>
));

const mockChartLegend = jest.fn((props: Record<string, unknown>) => (
  <div data-testid={props.dataTestId as string | undefined}>ChartLegend</div>
));

const mockPortfolioHealthBigNumbers = jest.fn(
  (props: Record<string, unknown>) => (
    <div data-testid={props.dataTestId as string | undefined}>
      PortfolioHealthBigNumbers
    </div>
  ),
);

const mockStyledChipRoot = jest.fn((props: Record<string, unknown>) => (
  <div
    data-testid={props['data-testid'] as string | undefined}
    data-disabled={props.disabled === true ? 'true' : 'false'}
  >
    {props.children as React.ReactNode}
  </div>
));

const mockStyledChipLabel = jest.fn((props: Record<string, unknown>) => (
  <span data-testid={props['data-testid'] as string | undefined}>
    {props.children as React.ReactNode}
  </span>
));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('components/ChartHeader', () => ({
  ChartHeader: (props: Record<string, unknown>) => mockChartHeader(props),
}));

jest.mock('components/ChartLegend', () => ({
  ChartLegend: (props: Record<string, unknown>) => mockChartLegend(props),
}));

jest.mock('../PortfolioHealthBigNumbers', () => ({
  PortfolioHealthBigNumbers: (props: Record<string, unknown>) =>
    mockPortfolioHealthBigNumbers(props),
}));

jest.mock('components/ChartHeader/ChartHeader.styles', () => ({
  StyledChipRoot: (props: Record<string, unknown>) => mockStyledChipRoot(props),
  StyledChipLabel: (props: Record<string, unknown>) =>
    mockStyledChipLabel(props),
}));

const defaultData: StrategicInnovationHealthData = {
  id: 'health-1',
  period: 'Q1 2024',
  bigNumbers: [
    {
      id: 'big-number-1',
      period: "Jan'24",
      data: [
        {
          bigNumber: { value: '10', measure: '%', color: '#00AA00' },
          comparison: { label: 'vs', value: "Dec'23" },
        },
      ],
    },
  ],
  legend: [
    { label: 'On Track', color: '#00AA00' },
    { label: 'At Risk', color: '#FFAA00' },
  ],
};

const renderComponent = (
  data?: StrategicInnovationHealthData,
  dataTestId?: string,
) =>
  render(<StrategicInnovationPortfolio data={data} dataTestId={dataTestId} />);

const lastProps = (mockFn: jest.Mock) =>
  mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];

const expectFormatMessagePortfolioAndLegend = () => {
  expect(mockFormatMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.title',
    }),
  );
  expect(mockFormatMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.tooltip',
    }),
  );
  expect(mockFormatMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.Legend.innovation',
    }),
  );
  expect(mockFormatMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.Legend.mature',
    }),
  );
};

describe('StrategicInnovationPortfolio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wires ChartHeader, big numbers, and legend from health data and i18n', () => {
    renderComponent(defaultData);

    expect(mockChartHeader).toHaveBeenCalledTimes(1);
    expect(lastProps(mockChartHeader)).toMatchObject({
      title: 'Portfolio Health',
      info: 'Portfolio health tooltip',
      config: {
        inline: 'horizontal',
        type: 'small',
        periodPosition: 'top-right',
      },
    });

    expect(mockPortfolioHealthBigNumbers).toHaveBeenCalledWith(
      expect.objectContaining({ data: defaultData.bigNumbers }),
    );

    expect(mockChartLegend).toHaveBeenCalledWith(
      expect.objectContaining({ items: expectedLegendItems }),
    );

    expectFormatMessagePortfolioAndLegend();
  });

  it('passes an empty bigNumbers array when data is omitted', () => {
    renderComponent();

    expect(mockPortfolioHealthBigNumbers).toHaveBeenCalledWith(
      expect.objectContaining({ data: [] }),
    );
    expect(mockChartLegend).toHaveBeenCalledWith(
      expect.objectContaining({ items: expectedLegendItems }),
    );
  });

  it('defaults bigNumbers to [] when health payload omits them', () => {
    const data: StrategicInnovationHealthData = {
      id: 'health-2',
      period: 'Q2 2024',
    };

    renderComponent(data);

    expect(lastProps(mockPortfolioHealthBigNumbers)).toMatchObject({
      data: [],
    });
  });

  it('builds legend from i18n and fixed colors, ignoring API legend payload', () => {
    const data: StrategicInnovationHealthData = {
      id: 'health-3',
      period: 'Q3 2024',
      bigNumbers: [],
      legend: [
        { label: 'Wrong Innovation', color: '#WRONG1' },
        { label: 'Wrong Mature', color: '#WRONG2' },
      ],
    };

    renderComponent(data);

    expect(lastProps(mockChartLegend)).toMatchObject({
      items: expectedLegendItems,
    });
  });

  it('renders the period label from health.period', () => {
    renderComponent(defaultData, 'p');

    expect(screen.getByTestId('p-period-label')).toHaveTextContent('Q1 2024');
  });

  it('renders an empty period label when data is undefined', () => {
    render(<StrategicInnovationPortfolio dataTestId="p" />);

    expect(screen.getByTestId('p-period-label')).toBeEmptyDOMElement();
  });

  describe('dataTestId', () => {
    it.each(['custom', 'test-portfolio-123_special'])(
      'prefixes the layout tree and forwards ids to children (%s)',
      (prefix) => {
        const { container } = renderComponent(defaultData, prefix);

        const root = screen.getByTestId(prefix);
        expect(root).toContainElement(screen.getByTestId(`${prefix}-health`));
        expect(root).toContainElement(
          screen.getByTestId(`${prefix}-big-numbers-container`),
        );
        expect(root).toContainElement(
          screen.getByTestId(`${prefix}-legend-container`),
        );

        expect(lastProps(mockChartHeader)).toMatchObject({
          dataTestId: `${prefix}-header`,
        });
        expect(lastProps(mockPortfolioHealthBigNumbers)).toMatchObject({
          dataTestId: `${prefix}-big-numbers`,
        });
        expect(lastProps(mockChartLegend)).toMatchObject({
          dataTestId: `${prefix}-legend`,
        });

        expect(
          container.querySelector(`[data-testid="${prefix}-period"]`),
        ).toBeInTheDocument();
        expect(
          container.querySelector(`[data-testid="${prefix}-period-label"]`),
        ).toBeInTheDocument();
      },
    );

    it('does not pass prefixed test ids to children when dataTestId is omitted', () => {
      renderComponent(defaultData);

      expect(lastProps(mockChartHeader)).toMatchObject({
        dataTestId: undefined,
      });
      expect(lastProps(mockPortfolioHealthBigNumbers)).toMatchObject({
        dataTestId: undefined,
      });
      expect(lastProps(mockChartLegend)).toMatchObject({
        dataTestId: undefined,
      });
    });

    it('updates the root test id when dataTestId changes on rerender', () => {
      const { rerender, container } = renderComponent(defaultData, 'a');

      expect(container.querySelector('[data-testid="a"]')).toBeInTheDocument();

      rerender(
        <StrategicInnovationPortfolio data={defaultData} dataTestId="b" />,
      );

      expect(
        container.querySelector('[data-testid="a"]'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('b')).toBeInTheDocument();
      expect(screen.getByTestId('b-health')).toBeInTheDocument();
    });
  });
});
