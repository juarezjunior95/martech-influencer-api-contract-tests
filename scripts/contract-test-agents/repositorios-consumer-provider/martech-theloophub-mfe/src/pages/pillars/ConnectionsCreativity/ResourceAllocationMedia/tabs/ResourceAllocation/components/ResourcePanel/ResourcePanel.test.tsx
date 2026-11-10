import { fireEvent, render, screen } from '@testing-library/react';

import { caption, radioOptions } from '../../constants';
import { ResourceAllocationData } from '../../types';
import { ResourcePanel } from './ResourcePanel';

jest.mock('@hexa-ui/components', () => ({
  Radio: {
    Root: ({
      children,
      defaultValue,
      onValueChange,
      'data-testid': dataTestId,
    }: {
      children: React.ReactNode;
      defaultValue: string;
      onValueChange: (value: string) => void;
      'data-testid'?: string;
    }) => (
      <div
        data-testid={dataTestId ?? 'radio-root'}
        data-default-value={defaultValue}
        role="radiogroup"
        tabIndex={0}
        onClick={() => onValueChange('LY')}
        onKeyDown={(e) => e.key === 'Enter' && onValueChange('LY')}
      >
        {children}
      </div>
    ),
    Item: ({ value, label }: { value: string; label: string }) => (
      <input
        type="radio"
        data-testid={`radio-item-${value}`}
        value={value}
        aria-label={label}
        readOnly
      />
    ),
  },
}));

jest.mock('components', () => ({
  Legend: ({
    caption: items,
    dataTestId,
  }: {
    caption: { label: string }[];
    dataTestId?: string;
  }) => (
    <ul data-testid={dataTestId ?? 'legend'} aria-label="legend">
      {items.map((item) => (
        <li key={item.label}>{item.label}</li>
      ))}
    </ul>
  ),
}));

jest.mock('components/Expandable', () => ({
  Expandable: {
    Item: ({
      headerCustomized,
      expandableChildren,
      dataTestId,
    }: {
      headerCustomized: React.ReactNode;
      expandableChildren: React.ReactNode;
      dataTestId?: string;
    }) => (
      <section data-testid={dataTestId ?? 'expandable-item'}>
        {headerCustomized}
        {expandableChildren}
      </section>
    ),
  },
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'no-data-yet'} role="status">
      No data yet
    </div>
  ),
}));

jest.mock('..', () => ({
  ChartsArea: ({
    kpiFilters,
    dataTestId,
  }: {
    kpiFilters: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'charts-area'}
      data-kpi-filters={kpiFilters}
    />
  ),
  MultipleSkeletonLoader: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'multiple-skeleton-loader'} />
  ),
  ResourceHeader: ({ dataTestId }: { dataTestId?: string }) => (
    <header data-testid={dataTestId ?? 'resource-header'} />
  ),
}));

describe('ResourcePanel', () => {
  const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
  const mockHandleKpiFilterChange = jest.fn();

  const mockContent = {
    empty: false,
    media: { media: { labels: [], datasets: [] } },
  } as unknown as ResourceAllocationData;

  const defaultProps = {
    content: mockContent,
    kpiFilters: 'BU',
    loading: false,
    formatMessage: mockFormatMessage,
    kpiFilter: 'BU',
    handleKpiFilterChange: mockHandleKpiFilterChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) =>
    render(<ResourcePanel {...defaultProps} {...overrideProps} />);

  describe('kpi filter (radio)', () => {
    it('renders one radio item per option from the real constants', () => {
      renderComponent();

      radioOptions.kpiFilter.values.forEach((option) => {
        expect(
          screen.getByTestId(`radio-item-${option.value}`),
        ).toBeInTheDocument();
      });
    });

    it('uses the current kpiFilter as the radio default value', () => {
      renderComponent({ kpiFilter: 'LY' });

      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'data-default-value',
        'LY',
      );
    });

    it('calls handleKpiFilterChange when a new option is picked', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('radiogroup'));

      expect(mockHandleKpiFilterChange).toHaveBeenCalledWith('LY');
    });
  });

  describe('content states', () => {
    it('shows the skeleton while loading and hides charts, legend and empty state', () => {
      renderComponent({
        loading: true,
        content: { ...mockContent, empty: true },
      });

      expect(
        screen.getByTestId('multiple-skeleton-loader'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('charts-area')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('list', { name: 'legend' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders charts and the legend with every real caption label when data is loaded', () => {
      renderComponent({ kpiFilters: 'LY' });

      const chartsArea = screen.getByTestId('charts-area');
      expect(chartsArea).toBeInTheDocument();
      expect(chartsArea).toHaveAttribute('data-kpi-filters', 'LY');

      caption.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders the empty state and hides charts/legend when content is empty', () => {
      renderComponent({ content: { ...mockContent, empty: true } });

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByTestId('charts-area')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('list', { name: 'legend' }),
      ).not.toBeInTheDocument();
    });

    it('renders neither charts nor empty state when content is null', () => {
      renderComponent({ content: null });

      expect(screen.queryByTestId('charts-area')).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('data-testid propagation', () => {
    it('propagates dataTestId to all child sections in the loaded state', () => {
      renderComponent({ dataTestId: 'test' });

      expect(screen.getByTestId('test-resource-panel')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-resource-panel-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-resource-panel-charts-area'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-resource-panel-legend'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-resource-panel-radio-root'),
      ).toBeInTheDocument();
    });

    it('propagates dataTestId to the skeleton in the loading state', () => {
      renderComponent({ dataTestId: 'test', loading: true });

      expect(
        screen.getByTestId('test-resource-panel-skeleton'),
      ).toBeInTheDocument();
    });

    it('propagates dataTestId to NoDataYet in the empty state', () => {
      renderComponent({
        dataTestId: 'test',
        content: { ...mockContent, empty: true },
      });

      expect(
        screen.getByTestId('test-resource-panel-no-data-yet'),
      ).toBeInTheDocument();
    });
  });
});
