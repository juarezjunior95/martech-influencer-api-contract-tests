import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { InnovationPerformanceData } from '../../types';
import { InnovationPerfomance } from './InnovationPerfomance';

const mockInnovationPerfomanceWaterfall = jest.fn(
  (props: Record<string, unknown>) => (
    <div
      data-testid={(props.dataTestId as string) || 'innovation-waterfall-mock'}
    >
      {props.interactiveConfig ? (
        <button
          type="button"
          data-testid="waterfall-click-trigger"
          onClick={() =>
            (
              props.interactiveConfig as {
                onBarSelect: (i: number | null) => void;
              }
            ).onBarSelect(1)
          }
        />
      ) : null}
    </div>
  ),
);

const mockNoDataYet = jest.fn((props: { dataTestId?: string }) => (
  <div data-testid={props.dataTestId} />
));

const mockSkeleton = jest.fn((props: { dataTestId?: string }) => (
  <div data-testid={props.dataTestId} />
));

const mockCustomTooltip = jest.fn(
  ({
    children,
    dataTestId,
  }: {
    children?: React.ReactNode;
    dataTestId?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
);

jest.mock(
  '../InnovationPerformanceWaterfall/InnovationPerfomanceWaterfall',
  () => ({
    InnovationPerfomanceWaterfall: (props: Record<string, unknown>) =>
      mockInnovationPerfomanceWaterfall(props),
  }),
);

jest.mock('components', () => ({
  NoDataYet: (props: Record<string, unknown>) => mockNoDataYet(props as never),
  Skeleton: (props: Record<string, unknown>) => mockSkeleton(props as never),
  CustomTooltip: (props: Record<string, unknown>) =>
    mockCustomTooltip(props as never),
}));

jest.mock('components/Chart/ChartWrapper', () => {
  const { forwardRef, createElement } = jest.requireActual(
    'react',
  ) as typeof import('react');

  return {
    ChartWrapper: forwardRef(
      ({ children, ...props }: Record<string, unknown>, ref: unknown) =>
        createElement(
          'div',
          { ref, 'data-testid': props['data-testid'] as string | undefined },
          children,
        ),
    ),
  };
});

jest.mock('components/ChartHeader', () => ({
  ChartHeader: (props: { dataTestId?: string }) => (
    <div data-testid={props.dataTestId} />
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: () => <span data-testid="info-icon" />,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, ...rest }: Record<string, unknown>) => (
    <h5 {...rest}>{children as React.ReactNode}</h5>
  ),
  Grid: {
    Container: ({ children, ...rest }: Record<string, unknown>) => (
      <div {...rest}>{children as React.ReactNode}</div>
    ),
    Item: ({ children, ...rest }: Record<string, unknown>) => (
      <div {...rest}>{children as React.ReactNode}</div>
    ),
  },
}));

const mockAppliedFilters = { country: ['BR'], zone: ['LATAM'] };
let mockActiveSubFilters = { kpis: 'volume' };
let mockIsGlobalZone = false;

const mockUseBffData = jest.fn();
const mockTrackGA = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (params: unknown) => mockUseBffData(params),
  useCurrentPage: jest.fn(() => ({ currentPage: 'innovation' })),
  usePageFilterApplied: jest.fn(() => ({
    applied: mockAppliedFilters,
    isGlobalZone: mockIsGlobalZone,
  })),
  useSubFilters: jest.fn(() => ({ activeSubFilters: mockActiveSubFilters })),
  useGoogleAnalytics: () => mockTrackGA,
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('./InnovationPerformance.styles', () => {
  const { forwardRef, createElement } = jest.requireActual(
    'react',
  ) as typeof import('react');

  return {
    StyledBreakdownHeader: ({ children, ...rest }: Record<string, unknown>) =>
      createElement('div', { ...rest }, children as React.ReactNode),
    StyledBreakdownHeading: ({ children, ...rest }: Record<string, unknown>) =>
      createElement('h5', { ...rest }, children as React.ReactNode),
    StyledBreakdownSection: forwardRef(
      ({ children, ...rest }: Record<string, unknown>, ref: unknown) =>
        createElement('section', { ref, ...rest }, children as React.ReactNode),
    ),
    StyledInnovationPerformanceChartHeaderSpacing: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => createElement('div', null, children),
    StyledInnovationPerformanceContainer: ({
      children,
      ...rest
    }: Record<string, unknown>) =>
      createElement('div', { ...rest }, children as React.ReactNode),
  };
});

jest.mock(
  '../InnovationPerformanceWaterfall/InnovationPerfomanceWaterfall.styles',
  () => ({
    StyledWaterfallContainer: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => <div>{children}</div>,
  }),
);

jest.mock('../../configs', () => ({
  volumeBreakdownOptions: {},
}));

const createPerformanceData = (
  overrides: Partial<InnovationPerformanceData> = {},
): InnovationPerformanceData => ({
  data: [100, 20, -10, 110],
  labels: ['Start', 'Gain', 'Loss', 'End'],
  comparisonLineData: [],
  clickableIndexes: [
    { index: 1, value: 'gain' },
    { index: 2, value: 'loss' },
  ],
  ...overrides,
});

const createBreakdownData = (
  overrides: Partial<InnovationPerformanceData> = {},
): InnovationPerformanceData => ({
  data: [50, 30, 20],
  labels: ['A', 'B', 'C'],
  comparisonLineData: [],
  ...overrides,
});

const createFullKpiPerformanceData = () => ({
  volume: createPerformanceData({ labels: ['Volume1', 'Volume2'] }),
  nr: createPerformanceData({ labels: ['NR1', 'NR2'] }),
  maco: createPerformanceData({ labels: ['MACO1', 'MACO2'] }),
});

const renderComponent = (
  props: React.ComponentProps<typeof InnovationPerfomance>,
) => render(<InnovationPerfomance {...props} />);

const lastWaterfallProps = (): Record<string, unknown> => {
  const props =
    mockInnovationPerfomanceWaterfall.mock.calls[
      mockInnovationPerfomanceWaterfall.mock.calls.length - 1
    ]?.[0];
  if (!props) {
    throw new Error('InnovationPerfomanceWaterfall was not invoked');
  }
  return props;
};

describe('InnovationPerfomance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockActiveSubFilters = { kpis: 'volume' };
    mockIsGlobalZone = false;
    mockUseBffData.mockReturnValue({ data: null, loading: false });
  });

  it('requests breakdown BFF with skip until a bar is selected, then passes filter and country/zone', () => {
    const performanceData = { volume: createPerformanceData() };

    renderComponent({ performanceData });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'innovation_innovation_performance-breakdown_breakdown',
        kpiGroup: 'innovation',
        skipRequest: true,
        subFilters: expect.objectContaining({
          country: ['BR'],
          zone: ['LATAM'],
        }),
      }),
    );

    fireEvent.click(screen.getByTestId('waterfall-click-trigger'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        skipRequest: false,
        subFilters: expect.objectContaining({
          filter: 'gain',
          country: ['BR'],
          zone: ['LATAM'],
        }),
      }),
    );
  });

  it('sends a GA drilldown event when a clickable bar is selected', () => {
    const performanceData = { volume: createPerformanceData() };

    renderComponent({ performanceData });

    fireEvent.click(screen.getByTestId('waterfall-click-trigger'));

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Filter',
      event_action: 'drilldown',
      event_label: 'Gain',
    });
  });

  it('renders performance skeleton when loading with optional dataTestId on skeleton', () => {
    renderComponent({
      performanceData: { volume: createPerformanceData() },
      loading: true,
      dataTestId: 'tip',
    });

    expect(mockSkeleton).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: 'skeleton-tip-performance',
      }),
    );
  });

  it('renders NoDataYet for empty performance or empty breakdown', () => {
    const { rerender } = renderComponent({
      performanceData: { volume: createPerformanceData({ empty: true }) },
    });

    expect(mockNoDataYet).toHaveBeenCalled();

    rerender(
      <InnovationPerfomance
        performanceData={{ volume: createPerformanceData() }}
        breakdownData={{ volume: createBreakdownData({ empty: true }) }}
      />,
    );

    expect(mockNoDataYet).toHaveBeenCalled();
  });

  it('passes interactiveConfig to the performance waterfall only when clickableIndexes exist', () => {
    const withClick = { volume: createPerformanceData() };
    const withoutClick = {
      volume: createPerformanceData({ clickableIndexes: undefined }),
    };

    const { rerender } = renderComponent({ performanceData: withClick });
    expect(lastWaterfallProps().interactiveConfig).toEqual(
      expect.objectContaining({
        fillHeight: true,
        clickability: { clickableIndexes: [1, 2] },
      }),
    );

    rerender(<InnovationPerfomance performanceData={withoutClick} />);
    expect(lastWaterfallProps().interactiveConfig).toBeUndefined();
  });

  it.each([
    { kpis: 'volume' as const, expectedLabel: 'Volume1' },
    { kpis: 'nr' as const, expectedLabel: 'NR1' },
    { kpis: 'maco' as const, expectedLabel: 'MACO1' },
  ])('routes performance data for kpis=$kpis', ({ kpis, expectedLabel }) => {
    mockActiveSubFilters = { kpis };
    const performanceData = createFullKpiPerformanceData();

    renderComponent({ performanceData });

    expect(
      (lastWaterfallProps().data as InnovationPerformanceData).labels,
    ).toContain(expectedLabel);
  });

  it.each([
    { isGlobalZone: true, scope: 'Country' },
    { isGlobalZone: false, scope: 'Brand' },
  ])(
    'shows $scope in breakdown heading when isGlobalZone=$isGlobalZone',
    ({ isGlobalZone, scope }) => {
      mockIsGlobalZone = isGlobalZone;
      const performanceData = { volume: createPerformanceData() };
      const breakdownData = { volume: createBreakdownData() };

      renderComponent({ performanceData, breakdownData });

      expect(screen.getByText(new RegExp(scope))).toBeInTheDocument();
      expect(screen.getByText(/Total Innovation/)).toBeInTheDocument();
    },
  );

  it.each([
    {
      kpis: 'volume' as const,
      titleId:
        'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.volumeBreakdown.title',
    },
    {
      kpis: 'nr' as const,
      titleId:
        'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.nrBreakdown.title',
    },
    {
      kpis: 'maco' as const,
      titleId:
        'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.macoBreakdown.title',
    },
  ])('uses breakdown title id for kpis=$kpis', ({ kpis, titleId }) => {
    mockActiveSubFilters = { kpis };
    const performanceData = { volume: createPerformanceData() };
    const breakdownData = { volume: createBreakdownData() };

    renderComponent({ performanceData, breakdownData });

    expect(screen.getByText(new RegExp(titleId))).toBeInTheDocument();
  });

  it('shows breakdown tooltip after selecting a bar', () => {
    const performanceData = { volume: createPerformanceData() };
    const breakdownData = { volume: createBreakdownData() };

    renderComponent({
      performanceData,
      breakdownData,
      dataTestId: 'tip',
    });

    expect(
      screen.queryByTestId('tip-breakdown-tooltip'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('waterfall-click-trigger'));

    expect(screen.getByTestId('tip-breakdown-tooltip')).toBeInTheDocument();
  });

  it('shows breakdown skeleton while filtered BFF request is loading', () => {
    mockUseBffData.mockReturnValue({ data: null, loading: true });
    const performanceData = { volume: createPerformanceData() };

    renderComponent({ performanceData, dataTestId: 'tip' });

    fireEvent.click(screen.getByTestId('waterfall-click-trigger'));

    expect(mockSkeleton).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: 'skeleton-tip-breakdown',
      }),
    );
  });

  it('uses BFF breakdown-volume payload for the breakdown waterfall after drilldown', () => {
    const filtered = createBreakdownData({ labels: ['From BFF'] });
    mockUseBffData.mockImplementation((params: Record<string, unknown>) => {
      if (
        params.subFilters &&
        (params.subFilters as { filter?: string }).filter
      ) {
        return {
          data: { 'breakdown-volume': filtered },
          loading: false,
        };
      }
      return { data: null, loading: false };
    });

    const performanceData = { volume: createPerformanceData() };
    const breakdownData = {
      volume: createBreakdownData({ labels: ['Static'] }),
    };

    renderComponent({ performanceData, breakdownData, dataTestId: 'bff' });

    fireEvent.click(screen.getByTestId('waterfall-click-trigger'));

    const breakdownWaterfallCalls = mockInnovationPerfomanceWaterfall.mock.calls
      .map((c) => c[0])
      .filter((p): p is Record<string, unknown> => {
        if (typeof p !== 'object' || p === null) return false;
        const { dataTestId } = p as { dataTestId?: unknown };
        return (
          typeof dataTestId === 'string' &&
          dataTestId.includes('waterfall-breakdown')
        );
      });
    const breakdownWaterfallCall =
      breakdownWaterfallCalls[breakdownWaterfallCalls.length - 1];

    expect(breakdownWaterfallCall).toBeDefined();
    const labels = (breakdownWaterfallCall?.data as InnovationPerformanceData)
      ?.labels;
    expect(labels).toContain('From BFF');
  });

  describe('dataTestId', () => {
    it.each(['tip', 'tip-123_special'])(
      'exposes chart wrapper, sections, and waterfall ids (%s)',
      (prefix) => {
        const performanceData = { volume: createPerformanceData() };
        const breakdownData = { volume: createBreakdownData() };

        renderComponent({ performanceData, breakdownData, dataTestId: prefix });

        expect(
          screen.getByTestId(`${prefix}-chart-wrapper`),
        ).toBeInTheDocument();
        expect(screen.getByTestId(`${prefix}-container`)).toContainElement(
          screen.getByTestId(`${prefix}-performance-section`),
        );
        expect(screen.getByTestId(`${prefix}-container`)).toContainElement(
          screen.getByTestId(`${prefix}-breakdown-section`),
        );

        expect(mockInnovationPerfomanceWaterfall).toHaveBeenCalledWith(
          expect.objectContaining({
            dataTestId: `${prefix}-waterfall-performance`,
          }),
        );
        expect(mockInnovationPerfomanceWaterfall).toHaveBeenCalledWith(
          expect.objectContaining({
            dataTestId: `${prefix}-waterfall-breakdown`,
          }),
        );
      },
    );

    it('omits prefixed layout test ids when dataTestId is not set', () => {
      renderComponent({ performanceData: { volume: createPerformanceData() } });

      expect(screen.queryByTestId(/-container$/)).not.toBeInTheDocument();
    });

    it('passes no-data test ids to NoDataYet for empty performance', () => {
      renderComponent({
        performanceData: { volume: createPerformanceData({ empty: true }) },
        dataTestId: 'tip',
      });

      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'tip-no-data-performance',
        }),
      );
    });
  });
});
