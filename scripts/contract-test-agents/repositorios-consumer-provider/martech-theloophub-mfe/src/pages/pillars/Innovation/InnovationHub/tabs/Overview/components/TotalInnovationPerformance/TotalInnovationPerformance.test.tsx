import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import type { FilterDataStructure, Option } from 'models/Filters';

import { TotalInnovationPerformance } from './TotalInnovationPerformance';

/** Matches BFF `presets/innovation_hub` shape: `kpis.values[]` + `default` + `enabled`. */
function innovationHubKpisPresetFixture(
  values: Option[],
): Pick<FilterDataStructure, 'kpis'> {
  const first = values[0] ?? { value: 'volume', label: 'Volume' };
  return {
    kpis: {
      values,
      default: first,
      enabled: true,
    },
  };
}

const mockNavigate = jest.fn();
const mockSetSubFilterValue = jest.fn();
const mockUseInnovationHubOverviewData = jest.fn();

const defaultAppliedDataFilters = innovationHubKpisPresetFixture([
  { value: 'volume', label: 'Volume' },
  { value: 'nr', label: 'Net Revenue' },
  { value: 'maco', label: 'MACO' },
  { value: 'maco_margin', label: 'MACO Margin' },
]);

let mockAppliedDataFilters: Pick<FilterDataStructure, 'kpis'> =
  defaultAppliedDataFilters;

let mockUseMediaQueryImpl: (query: string) => boolean = () => false;

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

jest.mock(
  '../../hooks/useInnovationHubOverviewData/useInnovationHubOverviewData',
  () => ({
    useInnovationHubOverviewData: () => mockUseInnovationHubOverviewData(),
  }),
);

jest.mock('hooks', () => ({
  useMediaQuery: (query: string) => mockUseMediaQueryImpl(query),
  usePageFilterData: () => ({ appliedDataFilters: mockAppliedDataFilters }),
  useSubFilters: () => ({
    setSubFilterValue: mockSetSubFilterValue,
  }),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }: { id: string }) => id),
  }),
}));

jest.mock('pages/components/KpiOverviewCard', () => ({
  ...jest.requireActual<typeof import('pages/components/KpiOverviewCard')>(
    'pages/components/KpiOverviewCard',
  ),
  KpiOverviewCard: ({
    onClick,
    data,
    dataTestId,
    tooltip,
    variation,
    chartColors,
  }: {
    onClick?: () => void;
    data?: { chartHeader?: { title?: string } };
    dataTestId?: string;
    tooltip?: string;
    variation?: string;
    chartColors?: Record<string, string>;
  }) => (
    <button
      type="button"
      data-testid={
        dataTestId ?? `kpi-card-${data?.chartHeader?.title ?? 'unknown'}`
      }
      data-has-onclick={onClick ? 'true' : 'false'}
      data-tooltip={tooltip ?? ''}
      data-variation={variation ?? ''}
      data-has-chart-colors={chartColors ? 'true' : 'false'}
      onClick={onClick}
    >
      {data?.chartHeader?.title}
    </button>
  ),
}));

jest.mock('components', () => ({
  DataStateHandler: ({
    loading,
    error,
    empty,
    children,
    dataTestId,
    skeletonProps,
  }: {
    loading?: boolean;
    error?: boolean;
    empty?: boolean;
    children: React.ReactNode;
    dataTestId?: string;
    skeletonProps?: { length?: number; width?: string; height?: string };
  }) => {
    if (loading) {
      const length = skeletonProps?.length ?? 1;
      const baseTestId = dataTestId
        ? `data-state-handler-skeleton-${dataTestId}`
        : 'data-state-handler-skeleton';

      return (
        <div
          data-testid={baseTestId}
          data-skeleton-width={skeletonProps?.width ?? ''}
          data-skeleton-height={skeletonProps?.height ?? ''}
        >
          {Array.from({ length }, (_, index) => (
            <div key={index} data-testid={`${baseTestId}-item-${index}`} />
          ))}
        </div>
      );
    }
    if (error) {
      return <div data-testid={`${dataTestId}-error`} />;
    }
    if (empty) {
      return <div data-testid={`${dataTestId}-empty`} />;
    }
    return <div data-testid={`${dataTestId}-content`}>{children}</div>;
  },
}));

const readyMainCards = {
  volume: {
    chartHeader: { title: 'Volume', measure: '', period: '' },
    bigNumberData: [],
  },
  nr: {
    chartHeader: { title: 'Net Revenue', measure: '', period: '' },
    bigNumberData: [],
  },
  maco: {
    chartHeader: { title: 'MACO', measure: '', period: '' },
    bigNumberData: [],
  },
  macoMargin: {
    chartHeader: { title: 'MACO Margin', measure: '', period: '' },
    bigNumberData: [],
  },
  customMetric: {
    chartHeader: { title: 'Custom', measure: '', period: '' },
    bigNumberData: [],
  },
};

describe('TotalInnovationPerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      ...(defaultAppliedDataFilters.kpis?.values ?? []),
    ]);
    mockUseMediaQueryImpl = () => false;
    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'ready',
      mainCards: readyMainCards,
      refetch: jest.fn(),
    });
  });

  it('should render loading skeletons via DataStateHandler', () => {
    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'loading',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'data-state-handler-skeleton-innovation-hub-total-innovation-performance',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'data-state-handler-skeleton-innovation-hub-total-innovation-performance-item-0',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'data-state-handler-skeleton-innovation-hub-total-innovation-performance-item-3',
      ),
    ).toBeInTheDocument();
  });

  it('should pass innovation skeleton dimensions (250×695) below 1920px', () => {
    mockUseMediaQueryImpl = (query) =>
      query.includes('1440') && !query.includes('1920');

    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'loading',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance />);

    const skeleton = screen.getByTestId(
      'data-state-handler-skeleton-innovation-hub-total-innovation-performance',
    );
    expect(skeleton).toHaveAttribute('data-skeleton-width', '250px');
    expect(skeleton).toHaveAttribute('data-skeleton-height', '695px');
  });

  it('should pass innovation skeleton dimensions (336×695) from 1920px', () => {
    mockUseMediaQueryImpl = (query) => query.includes('1920');

    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'loading',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance />);

    const skeleton = screen.getByTestId(
      'data-state-handler-skeleton-innovation-hub-total-innovation-performance',
    );
    expect(skeleton).toHaveAttribute('data-skeleton-width', '336px');
    expect(skeleton).toHaveAttribute('data-skeleton-height', '695px');
  });

  it('should render error state', () => {
    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'error',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId('innovation-hub-total-innovation-performance-error'),
    ).toBeInTheDocument();
  });

  it('should render empty state', () => {
    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'empty',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId('innovation-hub-total-innovation-performance-empty'),
    ).toBeInTheDocument();
  });

  it('should render KPI cards when ready', () => {
    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('innovation-hub-total-innovation-performance-kpi-nr'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-maco',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-macoMargin',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toHaveAttribute('data-variation', 'innovation');
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toHaveAttribute('data-has-chart-colors', 'true');
  });

  it('should render KPI cards in preset order', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'nr', label: 'Net Revenue' },
      { value: 'volume', label: 'Volume' },
      { value: 'maco_margin', label: 'MACO Margin' },
      { value: 'maco', label: 'MACO' },
      { value: 'custom_metric', label: 'Custom' },
    ]);

    render(<TotalInnovationPerformance />);

    const content = screen.getByTestId(
      'innovation-hub-total-innovation-performance-content',
    );
    const buttons = within(content).getAllByRole('button');
    expect(
      buttons.map((el) => (el as HTMLButtonElement).dataset.testid),
    ).toEqual([
      'innovation-hub-total-innovation-performance-kpi-nr',
      'innovation-hub-total-innovation-performance-kpi-volume',
      'innovation-hub-total-innovation-performance-kpi-macoMargin',
      'innovation-hub-total-innovation-performance-kpi-maco',
      'innovation-hub-total-innovation-performance-kpi-customMetric',
    ]);
  });

  it('should not render KPI cards when preset includes a KPI with no mainCards payload', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'volume', label: 'Volume' },
      { value: 'orphan_kpi', label: 'Orphan' },
    ]);

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        'innovation-hub-total-innovation-performance-kpi-orphanKpi',
      ),
    ).not.toBeInTheDocument();
  });

  it('should use card id as tooltip when no i18n mapping exists for that KPI', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'volume', label: 'Volume' },
      { value: 'custom_metric', label: 'Custom' },
    ]);

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-customMetric',
      ),
    ).toHaveAttribute('data-tooltip', 'customMetric');
  });

  it('should pass tooltip ids to each KPI card', () => {
    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toHaveAttribute(
      'data-tooltip',
      'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipVolume',
    );
    expect(
      screen.getByTestId('innovation-hub-total-innovation-performance-kpi-nr'),
    ).toHaveAttribute(
      'data-tooltip',
      'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipNr',
    );
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-maco',
      ),
    ).toHaveAttribute(
      'data-tooltip',
      'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipMaco',
    );
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-macoMargin',
      ),
    ).toHaveAttribute(
      'data-tooltip',
      'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipMacoMargin',
    );
  });

  it('should use custom dataTestId for grid and state handler', () => {
    mockUseInnovationHubOverviewData.mockReturnValue({
      view: 'loading',
      mainCards: null,
      refetch: jest.fn(),
    });

    render(<TotalInnovationPerformance dataTestId="custom-tip-prefix" />);

    expect(screen.getByTestId('custom-tip-prefix-grid')).toBeInTheDocument();
    expect(
      screen.getByTestId('data-state-handler-skeleton-custom-tip-prefix'),
    ).toBeInTheDocument();
  });

  it('should use custom dataTestId prefix on KPI cards when ready', () => {
    render(<TotalInnovationPerformance dataTestId="custom-tip-prefix" />);

    expect(
      screen.getByTestId('custom-tip-prefix-kpi-volume'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-tip-prefix-kpi-nr')).toBeInTheDocument();
  });

  it('should navigate when preset marks only nr as enabled KPI', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'nr', label: 'Net Revenue' },
    ]);

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId('innovation-hub-total-innovation-performance-kpi-nr'),
    ).toHaveAttribute('data-has-onclick', 'true');

    fireEvent.click(
      screen.getByTestId('innovation-hub-total-innovation-performance-kpi-nr'),
    );

    expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', 'nr');
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(
        '/innovation/innovation-performance/performance-and-breakdown',
      ),
    );
  });

  it('should not attach onClick to KPI cards disabled in preset', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'volume', label: 'Volume' },
      { value: 'nr', label: 'Net Revenue' },
      { value: 'maco', label: 'MACO', isDisabled: true },
      { value: 'maco_margin', label: 'MACO Margin', isDisabled: true },
    ]);

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-maco',
      ),
    ).toHaveAttribute('data-has-onclick', 'false');
    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-macoMargin',
      ),
    ).toHaveAttribute('data-has-onclick', 'false');
  });

  it('should navigate when a navigable KPI card is clicked', () => {
    mockAppliedDataFilters = innovationHubKpisPresetFixture([
      { value: 'volume', label: 'Volume' },
      { value: 'nr', label: 'Net Revenue' },
    ]);

    render(<TotalInnovationPerformance />);

    expect(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    ).toHaveAttribute('data-has-onclick', 'true');

    fireEvent.click(
      screen.getByTestId(
        'innovation-hub-total-innovation-performance-kpi-volume',
      ),
    );

    expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', 'volume');
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(
        '/innovation/innovation-performance/performance-and-breakdown',
      ),
    );
  });
});
