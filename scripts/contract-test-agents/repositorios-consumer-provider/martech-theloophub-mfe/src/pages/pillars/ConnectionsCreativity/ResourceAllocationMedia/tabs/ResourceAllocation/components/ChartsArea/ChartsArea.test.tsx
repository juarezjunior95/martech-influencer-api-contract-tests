import { fireEvent, render, screen } from '@testing-library/react';

import { ResourceAllocationData } from '../../types';
import { ChartsArea } from './ChartsArea';

jest.mock('shared/Styles', () => ({
  GlobalOverflowXStyle: () => <style data-testid="global-overflow-style" />,
}));

jest.mock('../../constants', () => ({
  borderRadius: [[{ topLeft: 5 }], [{ topRight: 5 }]],
}));

jest.mock('..', () => ({
  ChartContent: ({
    index,
    item,
    kpiFilters,
    borderRadius,
    hoverable,
    isGlobalZone,
    onCountryClick,
    dataTestId,
  }: {
    media: unknown;
    sponsorship: unknown;
    nwm: unknown;
    index: number;
    item: string;
    kpiFilters: string;
    borderRadius: unknown;
    hoverable?: boolean;
    isGlobalZone?: boolean;
    onCountryClick?: (country: string) => void;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || `chart-content-${index}`}
      data-item={item}
      data-kpi-filters={kpiFilters}
      data-index={index}
      data-has-border-radius={!!borderRadius}
      data-hoverable={hoverable ? 'true' : 'false'}
      data-is-global-zone={isGlobalZone ? 'true' : 'false'}
      role={onCountryClick ? 'button' : undefined}
      tabIndex={onCountryClick ? 0 : undefined}
      onClick={onCountryClick ? () => onCountryClick(item) : undefined}
      onKeyDown={
        onCountryClick
          ? (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCountryClick(item);
              }
            }
          : undefined
      }
    />
  ),
}));

jest.mock('./ChartsArea.styles', () => ({
  StyledChartsOverflowArea: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'charts-overflow-area'}>{children}</div>
  ),
  StyledChartsAreaContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'charts-area'}>{children}</div>,
}));

describe('ChartsArea', () => {
  const createMockContent = (
    labels: string[] = ['Brazil', 'USA'],
    hasData: boolean[] = [true, true],
  ): ResourceAllocationData =>
    ({
      media: {
        media: {
          labels,
          datasets: labels.map((_, idx) =>
            hasData[idx] ? { data: [100, 200] } : undefined,
          ),
          total_allocation: { unit: '$', value: [[1000], [2000]] },
          caption_country_flag: {
            Brazil: { flag: 'BR', label: 'Brazil' },
            USA: { flag: 'US', label: 'United States' },
          },
        },
      },
      sponsorship_activation: {
        sponsorship_activation: {
          labels,
          datasets: labels.map((_, idx) =>
            hasData[idx] ? { data: [50, 100] } : undefined,
          ),
          total_allocation: { unit: '$', value: [[500], [1000]] },
          caption_country_flag: {},
        },
      },
      non_working_money: {
        non_working_money: {
          labels,
          datasets: labels.map((_, idx) =>
            hasData[idx] ? { data: [25, 50] } : undefined,
          ),
          total_allocation: { unit: '$', value: [[250], [500]] },
          caption_country_flag: {},
        },
      },
    }) as unknown as ResourceAllocationData;

  const defaultProps = {
    content: createMockContent(),
    kpiFilters: 'BP',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<ChartsArea {...defaultProps} {...overrideProps} />);
  };

  describe('ChartContent rendering', () => {
    it('renders one ChartContent per label that has data', () => {
      renderComponent();

      expect(screen.getByTestId('chart-content-0')).toBeInTheDocument();
      expect(screen.getByTestId('chart-content-1')).toBeInTheDocument();
    });

    it('skips labels where all three data sources have no data', () => {
      const content = createMockContent(
        ['Brazil', 'USA', 'Germany'],
        [true, false, true],
      );
      renderComponent({ content });

      expect(screen.getByTestId('chart-content-0')).toBeInTheDocument();
      expect(screen.queryByTestId('chart-content-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('chart-content-2')).toBeInTheDocument();
    });

    it('renders no charts when all labels have no data', () => {
      renderComponent({
        content: createMockContent(['Brazil', 'USA'], [false, false]),
      });

      expect(screen.queryByTestId('chart-content-0')).not.toBeInTheDocument();
    });

    it('checks hasData from all three sources — renders if any one has data', () => {
      const mixedContent: ResourceAllocationData = {
        media: {
          media: {
            labels: ['Brazil', 'USA'],
            datasets: [{ data: [100] }, undefined],
            total_allocation: { unit: '$', value: [] },
            caption_country_flag: {},
          },
        },
        sponsorship_activation: {
          sponsorship_activation: {
            labels: ['Brazil', 'USA'],
            datasets: [undefined, { data: [50] }],
            total_allocation: { unit: '$', value: [] },
            caption_country_flag: {},
          },
        },
        non_working_money: {
          non_working_money: {
            labels: ['Brazil', 'USA'],
            datasets: [undefined, undefined],
            total_allocation: { unit: '$', value: [] },
            caption_country_flag: {},
          },
        },
      } as unknown as ResourceAllocationData;

      renderComponent({ content: mixedContent });

      expect(screen.getByTestId('chart-content-0')).toBeInTheDocument();
      expect(screen.getByTestId('chart-content-1')).toBeInTheDocument();
    });
  });

  describe('ChartContent props', () => {
    it('passes item, index, kpiFilters and borderRadius correctly to each ChartContent', () => {
      renderComponent({ kpiFilters: 'FC' });

      const chart0 = screen.getByTestId('chart-content-0');
      const chart1 = screen.getByTestId('chart-content-1');

      expect(chart0).toHaveAttribute('data-item', 'Brazil');
      expect(chart0).toHaveAttribute('data-index', '0');
      expect(chart0).toHaveAttribute('data-kpi-filters', 'FC');
      expect(chart0).toHaveAttribute('data-has-border-radius', 'true');

      expect(chart1).toHaveAttribute('data-item', 'USA');
      expect(chart1).toHaveAttribute('data-index', '1');
    });

    it.each(['BP', 'FC', 'AC', 'LE'])(
      'passes %s kpiFilters correctly',
      (filter) => {
        renderComponent({ kpiFilters: filter });

        expect(screen.getByTestId('chart-content-0')).toHaveAttribute(
          'data-kpi-filters',
          filter,
        );
      },
    );
  });

  describe('isGlobalZone propagation', () => {
    it('does not mark ChartContent as global zone by default', () => {
      renderComponent();

      expect(screen.getByTestId('chart-content-0')).toHaveAttribute(
        'data-is-global-zone',
        'false',
      );
    });

    it('forwards isGlobalZone=true to ChartContent', () => {
      renderComponent({ isGlobalZone: true });

      expect(screen.getByTestId('chart-content-0')).toHaveAttribute(
        'data-is-global-zone',
        'true',
      );
    });
  });

  describe('onCountryClick propagation', () => {
    it('forwards onCountryClick to ChartContent and triggers it on click', () => {
      const onCountryClick = jest.fn();
      renderComponent({ isGlobalZone: true, onCountryClick });

      fireEvent.click(screen.getByTestId('chart-content-0'));

      expect(onCountryClick).toHaveBeenCalledWith('Brazil');
    });
  });

  describe('hoverable propagation', () => {
    it('does not mark ChartContent as hoverable by default', () => {
      renderComponent();

      expect(screen.getByTestId('chart-content-0')).toHaveAttribute(
        'data-hoverable',
        'false',
      );
    });

    it('forwards hoverable=true to ChartContent', () => {
      renderComponent({ hoverable: true });

      expect(screen.getByTestId('chart-content-0')).toHaveAttribute(
        'data-hoverable',
        'true',
      );
    });
  });

  describe('data-testid propagation', () => {
    it('propagates dataTestId to container, overflow area and chart items', () => {
      render(<ChartsArea {...defaultProps} dataTestId="test-charts-area" />);

      expect(screen.getByTestId('test-charts-area')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-charts-area-overflow'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-charts-area-chart-content-0'),
      ).toBeInTheDocument();
    });

    it('falls back to default test ids when dataTestId is not provided', () => {
      render(<ChartsArea {...defaultProps} />);

      expect(screen.queryByTestId('test-charts-area')).not.toBeInTheDocument();
      expect(screen.getByTestId('charts-area')).toBeInTheDocument();
    });
  });
});
