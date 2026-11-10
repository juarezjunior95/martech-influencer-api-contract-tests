import { render, screen } from '@testing-library/react';
import { KpiConfig } from 'pages/types';

import { KpiSection } from './KpiSection';

const mockFormatMessage = jest.fn((msg) => msg.id || msg.defaultMessage);

const mockKpi: KpiConfig = {
  title: 'PortfolioBrand.BrandPower.kpis.awareness.title',
  tooltip: {
    content: 'PortfolioBrand.BrandPower.kpis.awareness.tooltip',
  },
  measure: 'percentage',
  kpiName: 'awareness',
} as any;

const mockChartData = [
  {
    type: 'bar' as const,
    labels: ['2023', '2024'],
    datasets: [{ type: 'bar' as const, label: 'Dataset 1', data: [10, 20] }],
  },
];

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: () => <div data-testid="icon" />,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: { name: 'Info' },
}));

jest.mock('components', () => ({
  CustomTooltip: ({
    content,
    children,
  }: {
    content: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="custom-tooltip">
      <div data-testid="tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledHeader: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
  StyledTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-title">{children}</div>
  ),
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-tooltip">{children}</div>
  ),
}));

jest.mock('../Chart/Chart', () => ({
  Chart: ({ loading, chartList }: { loading: boolean; chartList: any[] }) => (
    <div
      data-testid="chart"
      data-loading={String(loading)}
      data-chart-list-length={chartList?.length || 0}
    />
  ),
}));

describe('KpiSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, tooltip and Chart using the provided kpi config', () => {
    render(<KpiSection kpi={mockKpi} loading={false} data={mockChartData} />);

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: mockKpi.title,
      defaultMessage: '',
    });
    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: mockKpi.tooltip.content,
      defaultMessage: '',
    });
    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-chart-list-length',
      '1',
    );
  });

  it.each([true, false])('forwards loading=%s to Chart', (loading) => {
    render(<KpiSection kpi={mockKpi} loading={loading} data={mockChartData} />);

    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-loading',
      String(loading),
    );
  });

  it('renders the optional subFilter when provided and hides it otherwise', () => {
    const subFilter = <div data-testid="sub-filter">Sub Filter</div>;

    const { rerender } = render(
      <KpiSection
        kpi={mockKpi}
        loading={false}
        data={mockChartData}
        subFilter={subFilter}
      />,
    );
    expect(screen.getByTestId('sub-filter')).toBeInTheDocument();

    rerender(<KpiSection kpi={mockKpi} loading={false} data={mockChartData} />);
    expect(screen.queryByTestId('sub-filter')).not.toBeInTheDocument();
  });

  describe('header data-testid', () => {
    it('appends -header suffix to the header data-testid when dataTestId is provided', () => {
      render(
        <KpiSection
          kpi={mockKpi}
          loading={false}
          data={mockChartData}
          dataTestId="awareness"
        />,
      );

      expect(screen.getByTestId('awareness-header')).toBeInTheDocument();
    });

    it('does not render a header data-testid when dataTestId is not provided', () => {
      render(<KpiSection kpi={mockKpi} loading={false} data={mockChartData} />);

      expect(screen.queryByTestId('awareness-header')).not.toBeInTheDocument();
    });
  });
});
