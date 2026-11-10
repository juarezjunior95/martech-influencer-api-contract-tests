import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePageFilterApplied } from 'hooks';

import { getChartList } from '../../utils';
import { BrandPowerSection } from './BrandPowerSection';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockSetQuarterYearSelected = jest.fn();
const mockGetChartList = getChartList as jest.Mock;

const baseBrandPowerData = {
  quarterly: { labels: ["Q1'24"], datasets: [{ type: 'bar', data: [52.9] }] },
  ytd: { labels: [2024], datasets: [{ type: 'bar', data: [52.9] }] },
  yearly: { labels: [2024], datasets: [{ type: 'bar', data: [52.9] }] },
} as const;

const mockKpisConfig = {
  power: {
    kpiName: 'test_kpi',
    kpiGroup: 'test_group',
    title: 'PortfolioBrand.BrandPower.kpis.brandPower.title',
    titleAllBrands: 'PortfolioBrand.BrandPower.kpis.brandPower.titleAllBrands',
    measure: 'PortfolioBrand.BrandPower.kpis.brandPower.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.brandPower.tooltip.content',
      source: 'kantar' as const,
      refresh: 'quarterly' as const,
    },
  },
} as any;

const buildKpiResponse = <T,>(kpiData: T, loading = false) => ({
  kpiData,
  loading,
});

jest.mock('pages/pillars/PortfolioBrand/BrandAnalysis/BrandAnalysis', () => ({
  BRAND_POWER_PAGE_NAME: 'brand-power',
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    applied: { time_frame: '2025' },
    isGlobalZone: false,
  })),
}));

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    options,
    onValueChange,
  }: {
    options: Array<{ label: string; value: string }>;
    onValueChange: (value: string) => void;
  }) => (
    <div data-testid="segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
  }: {
    header: { title: string; rightContent?: ReactNode };
    children: ReactNode;
  }) => (
    <div data-testid="basic-container">
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('pages/pillars/PortfolioBrand/BrandAnalysis/components', () => ({
  SourceTooltipContent: () => <div data-testid="source-tooltip-content" />,
}));

jest.mock('../Chart/Chart', () => ({
  Chart: ({ loading }: { loading: boolean }) => (
    <div data-testid="chart" data-loading={String(loading)} />
  ),
}));

jest.mock('../../utils', () => ({
  getChartList: jest.fn(),
}));

const renderComponent = (
  overrides: {
    quarterYearSelected?: 'quarter' | 'year';
    kpiResponse?: { kpiData: any; loading: boolean };
  } = {},
) =>
  render(
    <BrandPowerSection
      quarterYearSelected={overrides.quarterYearSelected ?? 'quarter'}
      setQuarterYearSelected={mockSetQuarterYearSelected}
      kpisConfig={mockKpisConfig}
      kpiResponse={
        overrides.kpiResponse ?? (buildKpiResponse(baseBrandPowerData) as any)
      }
    />,
  );

describe('BrandPowerSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: { time_frame: '2025' },
      isGlobalZone: false,
    });
    mockGetChartList.mockImplementation((data, sel) =>
      !data || data.empty
        ? []
        : sel === 'quarter'
          ? [data.quarterly, data.ytd]
          : [data.yearly],
    );
  });

  it('delegates the chart list to getChartList with the current selection', () => {
    renderComponent({ quarterYearSelected: 'year' });

    expect(mockGetChartList).toHaveBeenCalledWith(baseBrandPowerData, 'year');
  });

  it('forwards loading state from kpiResponse to Chart', () => {
    renderComponent({
      kpiResponse: buildKpiResponse(baseBrandPowerData, true),
    });

    expect(screen.getByTestId('chart')).toHaveAttribute('data-loading', 'true');
  });

  it('triggers setQuarterYearSelected when a segment is selected', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('option-year'));

    expect(mockSetQuarterYearSelected).toHaveBeenCalledWith('year');
  });

  it('uses the global title when isGlobalZone is true', () => {
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: { time_frame: '2025' },
      isGlobalZone: true,
    });

    renderComponent();

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'PortfolioBrand.BrandPower.kpis.brandPower.titleAllBrands',
      defaultMessage: 'Brand Power',
    });
  });
});
