import { fireEvent, render, screen } from '@testing-library/react';
import { BorderRadius } from 'chart.js';

import { KpiContent } from '../../types';
import { ChartContent } from './ChartContent';

jest.mock('components/CaptionWithFlag/CaptionWithFlag', () => ({
  CaptionWithFlag: ({
    flag,
    label,
    dataTestId,
  }: {
    flag: string;
    label: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'caption-with-flag'}
      data-flag={flag}
      data-label={label}
    />
  ),
}));

jest.mock('../StackedBarChart', () => ({
  StackedBarChart: ({
    chart,
    roundTo,
    borderRadius,
    backgroundColor,
    dataTestId,
  }: {
    chart: unknown;
    roundTo: number;
    borderRadius: BorderRadius[][];
    backgroundColor: string[];
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'stacked-bar-chart'}
      data-chart={JSON.stringify(chart)}
      data-round-to={roundTo}
      data-border-radius={JSON.stringify(borderRadius)}
      data-background-color={JSON.stringify(backgroundColor)}
    />
  ),
}));

jest.mock('../../utils', () => ({
  buildDirectionsArray: jest.fn((data: number[]) => data.map(() => 'up')),
  createDatasetWithPattern: jest.fn(
    (dataset: { data: number[] }, kpiFilters: string) => ({
      ...dataset,
      pattern: kpiFilters,
    }),
  ),
}));

jest.mock('./ChartContent.styles', () => ({
  StyledChartContentContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'chart-content-container'}>{children}</div>
  ),
  StyledChartInner: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    'data-testid'?: string;
  }) => (
    <div data-testid="chart-inner" style={style}>
      {children}
    </div>
  ),
  StyledInteractiveWrapper: ({
    children,
    onClick,
    onKeyDown,
    role,
    tabIndex,
    isInteractive,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    role?: string;
    tabIndex?: number;
    isInteractive?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId || 'interactive-wrapper'}
      data-interactive={isInteractive ? 'true' : 'false'}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  ),
}));

describe('ChartContent', () => {
  const createMockKpiContent = (
    overrides: Partial<KpiContent> = {},
  ): KpiContent =>
    ({
      datasets: [
        { data: [100, 200], label: 'Dataset 1' },
        { data: [150, 250], label: 'Dataset 2' },
      ],
      total_allocation: {
        unit: '$',
        value: [
          [1000, 2000],
          [1500, 2500],
        ],
      },
      caption_country_flag: {
        item1: { flag: 'BR', label: 'Brazil' },
        item2: { flag: 'US', label: 'United States' },
      },
      ...overrides,
    }) as unknown as KpiContent;

  const defaultProps = {
    media: createMockKpiContent(),
    sponsorship: createMockKpiContent(),
    nwm: createMockKpiContent(),
    index: 0,
    item: 'item1',
    kpiFilters: 'BP',
    borderRadius: [[{ topLeft: 5 }], [{ topRight: 5 }]] as BorderRadius[][],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<ChartContent {...defaultProps} {...overrideProps} />);
  };

  describe('StackedBarChart props', () => {
    it('passes correct props (roundTo, backgroundColor, borderRadius) to StackedBarChart', () => {
      renderComponent();

      const chart = screen.getByTestId('stacked-bar-chart');
      expect(chart).toHaveAttribute('data-round-to', '100');
      expect(chart).toHaveAttribute(
        'data-background-color',
        JSON.stringify([
          ['#C9AF82', '#70C6FF', '#EBB400'],
          ['#E2D4BB', '#99D6FF', '#FFDE70'],
        ]),
      );
      expect(chart).toHaveAttribute(
        'data-border-radius',
        JSON.stringify(defaultProps.borderRadius),
      );
    });
  });

  describe('CaptionWithFlag props', () => {
    it('passes correct flag and label based on item', () => {
      renderComponent();

      const caption = screen.getByTestId('caption-with-flag');
      expect(caption).toHaveAttribute('data-flag', 'BR');
      expect(caption).toHaveAttribute('data-label', 'Brazil');
    });

    it('resolves flag and label for a different item', () => {
      renderComponent({ item: 'item2' });

      const caption = screen.getByTestId('caption-with-flag');
      expect(caption).toHaveAttribute('data-flag', 'US');
      expect(caption).toHaveAttribute('data-label', 'United States');
    });
  });

  describe('chart data construction', () => {
    it('uses the correct index to slice total_allocation.value', () => {
      renderComponent({ index: 1 });

      const chart = screen.getByTestId('stacked-bar-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart') || '{}');

      expect(chartData.total_allocation.value).toEqual([1500, 2500]);
    });

    it('includes kpiFilters and AC in labels', () => {
      renderComponent({ kpiFilters: 'FC' });

      const chart = screen.getByTestId('stacked-bar-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart') || '{}');

      expect(chartData.labels).toContain('FC');
      expect(chartData.labels).toContain('AC');
    });

    it('orders datasets as [nwm, sponsorship, media] to match color array (NWM=index 0)', () => {
      const {
        buildDirectionsArray: mockBuildDirs,
        createDatasetWithPattern: mockCreate,
      } = jest.requireMock('../../utils') as any;

      renderComponent();

      const calls = mockCreate.mock.calls;
      expect(calls).toHaveLength(3);
      expect(mockBuildDirs).toHaveBeenCalledTimes(1);

      const nwmCall = calls.find(
        (call: any[]) => call[0]?.directions !== undefined,
      );
      expect(nwmCall).toBeDefined();
      expect(calls.indexOf(nwmCall)).toBe(0);
    });
  });

  describe('layout', () => {
    it('uses the fixed horizontal row height for the chart', () => {
      renderComponent();

      expect(screen.getByTestId('chart-inner')).toHaveStyle('height: 108px');
    });
  });

  describe('null rendering', () => {
    it('returns null when all rows (AC and BU/LY) have empty data AND no total_allocation', () => {
      const emptyKpiContent = createMockKpiContent({
        datasets: [
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
        ],
        total_allocation: { unit: '$', value: [[], []] },
      });

      const { container } = render(
        <ChartContent
          {...defaultProps}
          media={emptyKpiContent}
          sponsorship={emptyKpiContent}
          nwm={emptyKpiContent}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders when at least one row has data', () => {
      const partialKpiContent = createMockKpiContent({
        datasets: [
          { data: [100, '' as unknown as number], label: '' },
          { data: [100, '' as unknown as number], label: '' },
        ],
      });

      renderComponent({
        media: partialKpiContent,
        sponsorship: partialKpiContent,
        nwm: partialKpiContent,
      });

      expect(screen.getByTestId('chart-content-container')).toBeInTheDocument();
    });

    it('renders empty-bar overlay when all dataset rows are empty but total_allocation has "-"', () => {
      const emptyKpiContent = createMockKpiContent({
        datasets: [
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
        ],
        total_allocation: { unit: '$', value: [['-', '$0.0']] },
      });

      renderComponent({
        media: emptyKpiContent,
        sponsorship: emptyKpiContent,
        nwm: emptyKpiContent,
      });

      expect(screen.getByTestId('chart-content-container')).toBeInTheDocument();
    });

    it('renders empty-bar overlay when all dataset rows are empty but total_allocation has "$0.0"', () => {
      const emptyKpiContent = createMockKpiContent({
        datasets: [
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
          {
            data: ['' as unknown as number, '' as unknown as number],
            label: '',
          },
        ],
        total_allocation: { unit: '$', value: [['$0.0', '$0.0']] },
      });

      renderComponent({
        media: emptyKpiContent,
        sponsorship: emptyKpiContent,
        nwm: emptyKpiContent,
      });

      expect(screen.getByTestId('chart-content-container')).toBeInTheDocument();
    });
  });

  describe('hover wrapper', () => {
    it('does not render the interactive wrapper when neither hoverable nor a country click handler is set', () => {
      renderComponent();

      expect(
        screen.queryByTestId('interactive-wrapper'),
      ).not.toBeInTheDocument();
    });

    it('renders a non-interactive wrapper when hoverable is true and no country click is configured', () => {
      renderComponent({ hoverable: true });

      const wrapper = screen.getByTestId('interactive-wrapper');
      expect(wrapper).not.toHaveAttribute('role');
      expect(wrapper).not.toHaveAttribute('tabindex');
    });
  });

  describe('country click behaviour (isGlobalZone)', () => {
    it('does not render interactive wrapper when item equals pinnedLabel', () => {
      renderComponent({
        isGlobalZone: true,
        item: 'item1',
        pinnedLabel: 'item1',
        onCountryClick: jest.fn(),
      });

      expect(
        screen.queryByTestId('interactive-wrapper'),
      ).not.toBeInTheDocument();
    });

    it('renders interactive wrapper when pinnedLabel is null (all items become clickable)', () => {
      renderComponent({
        isGlobalZone: true,
        index: 0,
        pinnedLabel: null,
        onCountryClick: jest.fn(),
      });

      // Without a pinnedLabel, item1 !== null → becomes clickable; wrapper rendered
      const wrapper = screen.getByTestId('interactive-wrapper');
      expect(wrapper).toHaveAttribute('role', 'button');
    });

    it('renders interactive wrapper with role="button" when isGlobalZone=true and item differs from pinnedLabel', () => {
      renderComponent({
        isGlobalZone: true,
        index: 0,
        item: 'item1',
        pinnedLabel: 'ABI',
        onCountryClick: jest.fn(),
      });

      const wrapper = screen.getByTestId('interactive-wrapper');
      expect(wrapper).toHaveAttribute('role', 'button');
      expect(wrapper).toHaveAttribute('tabindex', '0');
    });

    it('calls onCountryClick with item on click, Enter and Space', () => {
      const onCountryClick = jest.fn();
      renderComponent({
        isGlobalZone: true,
        index: 0,
        item: 'item1',
        pinnedLabel: 'ABI',
        onCountryClick,
      });

      const wrapper = screen.getByTestId('interactive-wrapper');

      fireEvent.click(wrapper);
      expect(onCountryClick).toHaveBeenCalledWith('item1');

      fireEvent.keyDown(wrapper, { key: 'Enter' });
      expect(onCountryClick).toHaveBeenCalledWith('item1');

      fireEvent.keyDown(wrapper, { key: ' ' });
      expect(onCountryClick).toHaveBeenCalledWith('item1');

      expect(onCountryClick).toHaveBeenCalledTimes(3);
    });

    it('does not call onCountryClick when isGlobalZone=false', () => {
      const onCountryClick = jest.fn();
      renderComponent({
        isGlobalZone: false,
        index: 0,
        item: 'item1',
        pinnedLabel: 'ABI',
        onCountryClick,
        hoverable: true,
      });

      fireEvent.click(screen.getByTestId('interactive-wrapper'));

      expect(onCountryClick).not.toHaveBeenCalled();
    });
  });

  describe('data-testid propagation', () => {
    it('propagates dataTestId to the container and children, falls back to defaults when not provided', () => {
      const { rerender } = render(
        <ChartContent {...defaultProps} dataTestId="test-chart-content" />,
      );
      expect(
        screen.getAllByTestId('test-chart-content').length,
      ).toBeGreaterThan(0);

      rerender(<ChartContent {...defaultProps} />);
      expect(
        screen.queryByTestId('test-chart-content'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('chart-content-container')).toBeInTheDocument();
    });
  });
});
