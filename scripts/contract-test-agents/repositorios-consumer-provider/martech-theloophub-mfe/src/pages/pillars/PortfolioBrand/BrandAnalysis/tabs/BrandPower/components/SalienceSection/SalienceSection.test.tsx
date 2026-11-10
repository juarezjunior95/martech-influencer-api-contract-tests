import * as ReactRouterDom from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooks from 'hooks';

import { handleExpandSection } from '../../utils/handleExpand';
import { SalienceSection } from './SalienceSection';

const mockFormatMessage = jest.fn((msg) => msg.id || msg.defaultMessage);
const mockSetSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams();

const mockKpisConfig = {
  salience: {
    title: 'PortfolioBrand.BrandPower.kpis.salience.title',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.salience.tooltip',
    },
  },
  unaided_awareness: {
    title: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    },
  },
  brand_clarity: {
    title: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    },
  },
  occasion: {
    title: 'PortfolioBrand.BrandPower.kpis.occasion.title',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.occasion.tooltip',
    },
  },
} as any;

const chartBlock = {
  type: 'bar' as const,
  labels: ["Q1'24"],
  datasets: [{ type: 'bar' as const, label: 'Test', data: [10] }],
};

const salienceData = {
  quarterly: chartBlock,
  ytd: {
    ...chartBlock,
    labels: ['2024'],
  },
  yearly: {
    ...chartBlock,
    labels: ['2025'],
  },
};

const occasionData = {
  type: 'bar' as const,
  labels: ['Occasion 1'],
  datasets: [{ type: 'bar' as const, label: 'Test', data: [15] }],
};

const createKpiResponse = <T,>(kpiData: T, loading = false) => ({
  kpiData,
  loading,
});

const mockedHooks = hooks as jest.Mocked<typeof hooks>;
const mockedReactRouterDom = ReactRouterDom as jest.Mocked<
  typeof ReactRouterDom
>;

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('react-router-dom');
jest.mock('hooks');

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
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-tooltip">{children}</div>
  ),
}));

jest.mock('../Chart/Chart', () => ({
  Chart: ({ loading, chartList }: any) => (
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
  KpiSection: ({ kpi, loading, data, subFilter }: any) => (
    <div
      data-testid="kpi-section"
      data-loading={String(loading)}
      data-data-length={data?.length || 0}
      data-kpi-title={kpi?.title}
    >
      {subFilter}
    </div>
  ),
}));

jest.mock('../PowerAwarenessFilter/PowerAwarenessFilter', () => ({
  PowerAwarenessFilter: ({ value, onChange }: any) => (
    <div data-testid="power-awareness-filter" data-value={value}>
      <button onClick={() => onChange({ value: 'brand-clarity' })}>
        Change
      </button>
    </div>
  ),
}));

jest.mock(
  'pages/pillars/PortfolioBrand/BrandAnalysis/components/PcYearQuarter/PcYearQuarter',
  () => ({
    PcYearQuarter: ({
      yearQuarterSelected,
    }: {
      yearQuarterSelected: string;
    }) => (
      <div
        data-testid="pc-year-quarter"
        data-year-quarter={yearQuarterSelected}
      />
    ),
  }),
);

jest.mock('../../utils', () => ({
  getChartList: jest.fn((data) => {
    if (!data || data.empty) return [];
    return [data];
  }),
}));

jest.mock('../../utils/handleExpand', () => ({
  handleExpandSection: jest.fn(),
}));

describe('SalienceSection', () => {
  const baseProps = {
    quarterYearSelected: 'quarter' as const,
    kpisConfig: mockKpisConfig,
    salienceKpiResponse: createKpiResponse(salienceData),
    occasionKpiResponse: createKpiResponse(occasionData),
    powerAwarenessKpiResponses: {
      unaided_awareness: createKpiResponse(salienceData),
      brand_clarity: createKpiResponse(salienceData),
    },
    powerAwarenessSelected: 'unaided-awareness',
    onPowerAwarenessChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockSearchParams.get = jest.fn().mockReturnValue(null);

    mockedReactRouterDom.useSearchParams = jest
      .fn()
      .mockReturnValue([mockSearchParams, mockSetSearchParams]);

    mockedHooks.useSubFilters.mockReturnValue({
      activeSubFilters: {},
      subFiltersLoaded: {
        pc_time_frame_years: true,
        pc_time_frame_quarters: true,
      },
    } as any);

    mockedHooks.usePageFilterApplied.mockReturnValue({
      applied: { time_frame: '2025' },
    } as any);
  });

  it('should render chart with data from hook response', () => {
    render(<SalienceSection {...baseProps} />);

    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-chart-list-length',
      '1',
    );
  });

  it('should render NoData state when kpiData has empty flag', () => {
    render(
      <SalienceSection
        {...baseProps}
        salienceKpiResponse={createKpiResponse({ empty: true } as any)}
      />,
    );

    expect(screen.getByTestId('chart')).toHaveAttribute(
      'data-chart-list-length',
      '0',
    );
  });

  it('should render expanded sections and call power awareness callback', async () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    const onPowerAwarenessChange = jest.fn();

    render(
      <SalienceSection
        {...baseProps}
        onPowerAwarenessChange={onPowerAwarenessChange}
      />,
    );

    const kpiSections = screen.getAllByTestId('kpi-section');
    expect(kpiSections).toHaveLength(2);

    await userEvent.click(screen.getByText('Change'));

    expect(onPowerAwarenessChange).toHaveBeenCalledWith('brand-clarity');
  });

  it('should keep occasion loading while pcTimeFrame is not loaded', () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    mockedHooks.useSubFilters.mockReturnValue({
      activeSubFilters: {},
      subFiltersLoaded: {
        pc_time_frame_years: true,
        pc_time_frame_quarters: false,
      },
    } as any);

    render(<SalienceSection {...baseProps} />);

    const kpiSections = screen.getAllByTestId('kpi-section');
    expect(kpiSections[1]).toHaveAttribute('data-loading', 'true');
  });

  it('should handle null awareness responses without crashing', () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    render(
      <SalienceSection
        {...baseProps}
        powerAwarenessKpiResponses={{
          unaided_awareness: createKpiResponse(null as any),
          brand_clarity: createKpiResponse(null as any),
        }}
      />,
    );

    const kpiSections = screen.getAllByTestId('kpi-section');
    expect(kpiSections[0]).toHaveAttribute('data-data-length', '0');
  });

  it('should use pc_time_frame_years loading state when year view is selected', () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    mockedHooks.useSubFilters.mockReturnValue({
      activeSubFilters: {},
      subFiltersLoaded: {
        pc_time_frame_years: false,
        pc_time_frame_quarters: true,
      },
    } as any);

    render(<SalienceSection {...baseProps} quarterYearSelected="year" />);

    const kpiSections = screen.getAllByTestId('kpi-section');
    expect(kpiSections[1]).toHaveAttribute('data-loading', 'true');
  });

  it('should fallback to empty awareness response and unaided_awareness config when selected key is not in responses', () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    render(
      <SalienceSection
        {...baseProps}
        powerAwarenessSelected="unknown-key"
        powerAwarenessKpiResponses={{} as any}
      />,
    );

    const kpiSections = screen.getAllByTestId('kpi-section');

    expect(kpiSections[0]).toHaveAttribute('data-loading', 'false');
    expect(kpiSections[0]).toHaveAttribute('data-data-length', '0');
    expect(kpiSections[0]).toHaveAttribute(
      'data-kpi-title',
      `${mockKpisConfig.unaided_awareness.title}.unknown-key.title`,
    );
  });

  it('should pass empty data array to occasion section when occasion kpiData is null', () => {
    mockSearchParams.get = jest.fn().mockReturnValue('salience');

    render(
      <SalienceSection
        {...baseProps}
        occasionKpiResponse={createKpiResponse(null as any)}
      />,
    );

    const kpiSections = screen.getAllByTestId('kpi-section');
    expect(kpiSections[1]).toHaveAttribute('data-data-length', '0');
  });

  describe('expand toggle', () => {
    const mockHandleExpandSection = handleExpandSection as jest.Mock;

    it('should call handleExpandSection with the new value when Expand is toggled from collapsed', async () => {
      render(<SalienceSection {...baseProps} />);

      await userEvent.click(screen.getByTestId('expand'));

      expect(mockHandleExpandSection).toHaveBeenCalledWith(
        true,
        'salience',
        mockSetSearchParams,
        mockSearchParams,
      );
    });

    it('should call handleExpandSection with the new value when Expand is toggled from expanded', async () => {
      mockSearchParams.get = jest.fn().mockReturnValue('salience');

      render(<SalienceSection {...baseProps} />);

      await userEvent.click(screen.getByTestId('expand'));

      expect(mockHandleExpandSection).toHaveBeenCalledWith(
        false,
        'salience',
        mockSetSearchParams,
        mockSearchParams,
      );
    });
  });
});
