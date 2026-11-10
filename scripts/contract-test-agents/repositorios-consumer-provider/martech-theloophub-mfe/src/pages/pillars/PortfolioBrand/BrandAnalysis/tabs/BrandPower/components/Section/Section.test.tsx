import * as ReactRouterDom from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooks from 'hooks';
import { FilterValue } from 'models/Filters';
import { KpiConfig } from 'pages/types';

import { handleExpandSection } from '../../utils/handleExpand';
import { Section } from './Section';

const mockSetSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams();

const mockApplied = { time_frame: '2024' as FilterValue };

const buildKpi = (suffix: string): KpiConfig =>
  ({
    title: `PortfolioBrand.BrandPower.kpis.${suffix}.title`,
    tooltip: {
      content: `PortfolioBrand.BrandPower.kpis.${suffix}.tooltip`,
    },
    kpiName: `${suffix}_kpi`,
    kpiGroup: 'brand_power',
  }) as any;

const mockMainKpi = buildKpi('main');
const mockSecondKpi = buildKpi('second');
const mockThirdKpi = buildKpi('third');

const validChartBlock = {
  type: 'bar' as const,
  datasets: [{ type: 'bar' as const, label: 'Test', data: [10] }],
  labels: ['Q1'],
};

const validData = {
  quarterly: validChartBlock,
  ytd: validChartBlock,
  yearly: validChartBlock,
};

const buildResponse = <T,>(kpiData: T, loading = false) => ({
  kpiData,
  loading,
});

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: ({ id }: { id: string }) => id }),
}));

jest.mock('react-router-dom');

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
}));

jest.mock('pages/pillars/PortfolioBrand/BrandAnalysis/BrandAnalysis', () => ({
  BRAND_POWER_PAGE_NAME: 'brand-power-page',
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
  }: {
    header: any;
    children: React.ReactNode;
  }) => (
    <div data-testid="basic-container">
      <div data-testid="header-right-content">{header?.rightContent}</div>
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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

jest.mock('../Expand/Expand', () => ({
  Expand: ({
    value,
    onValueChange,
  }: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <button
      data-testid="expand"
      data-expanded={String(value)}
      onClick={() => onValueChange(!value)}
    >
      Expand
    </button>
  ),
}));

jest.mock('../KpiSection/KpiSection', () => ({
  KpiSection: ({ kpi, data }: any) => (
    <div
      data-testid="kpi-section"
      data-kpi-title={kpi.title}
      data-data-length={data?.length || 0}
    />
  ),
}));

jest.mock('../../utils', () => ({
  getChartList: jest.fn((data) => (!data || data.empty ? [] : [data])),
}));

jest.mock('../../utils/handleExpand', () => ({
  handleExpandSection: jest.fn(),
}));

const mockedHooks = hooks as jest.Mocked<typeof hooks>;
const mockedReactRouterDom = ReactRouterDom as jest.Mocked<
  typeof ReactRouterDom
>;

const renderSection = (props?: Partial<React.ComponentProps<typeof Section>>) =>
  render(
    <Section
      name="test-section"
      mainKpi={mockMainKpi}
      secondKpi={mockSecondKpi}
      thirdKpi={mockThirdKpi}
      mainKpiResponse={buildResponse(validData)}
      secondKpiResponse={buildResponse(validData)}
      thirdKpiResponse={buildResponse(validData)}
      quarterYearSelected="quarter"
      {...props}
    />,
  );

describe('Section', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get = jest.fn().mockReturnValue(null);
    mockedReactRouterDom.useSearchParams = jest
      .fn()
      .mockReturnValue([mockSearchParams, mockSetSearchParams]);
    mockedHooks.usePageFilterApplied.mockReturnValue({
      applied: mockApplied,
    } as any);
  });

  it('renders the main chart with the response data length', () => {
    renderSection();

    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-chart-list-length',
      '1',
    );
  });

  it('forwards loading state from the main response', () => {
    renderSection({ mainKpiResponse: buildResponse(validData, true) });

    expect(screen.getByTestId('chart')).toHaveAttribute('data-loading', 'true');
  });

  it('renders second and third KpiSection only when expanded', () => {
    (mockSearchParams.get as jest.Mock).mockReturnValue('test-section');

    renderSection();

    const sections = screen.getAllByTestId('kpi-section');
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveAttribute('data-kpi-title', mockSecondKpi.title);
    expect(sections[1]).toHaveAttribute('data-kpi-title', mockThirdKpi.title);
  });

  it('delegates expand toggle to handleExpandSection', async () => {
    renderSection();

    await userEvent.click(screen.getByTestId('expand'));

    expect(handleExpandSection).toHaveBeenCalledWith(
      true,
      'test-section',
      mockSetSearchParams,
      mockSearchParams,
    );
  });

  it.each([
    ['empty payload', { empty: true } as any],
    ['null payload', null as any],
  ])('renders empty chart list for %s', (_label, payload) => {
    renderSection({ mainKpiResponse: buildResponse(payload) });

    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-chart-list-length',
      '0',
    );
  });

  it('keeps expanded KpiSection resilient when secondary payloads are empty/null', () => {
    (mockSearchParams.get as jest.Mock).mockReturnValue('test-section');

    renderSection({
      secondKpiResponse: buildResponse({ empty: true } as any),
      thirdKpiResponse: buildResponse(null as any),
    });

    const sections = screen.getAllByTestId('kpi-section');
    expect(sections[0]).toHaveAttribute('data-data-length', '0');
    expect(sections[1]).toHaveAttribute('data-data-length', '0');
  });
});
