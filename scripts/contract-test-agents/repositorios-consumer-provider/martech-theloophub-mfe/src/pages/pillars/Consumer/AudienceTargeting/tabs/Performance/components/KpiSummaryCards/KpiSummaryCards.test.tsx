import { fireEvent, render, screen } from '@testing-library/react';

import { KpiSummaryCards } from './KpiSummaryCards';
import { KpiSummaryCardData } from './types';

const mockOnSelectionChange = jest.fn();
const mockFormatDateToQuarterYear = jest.fn();

jest.mock('contexts/LastDataRefresh/LastDataRefresh', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisDate: {
      pos: '2024-01-15',
    },
  }),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: (date: string) => mockFormatDateToQuarterYear(date),
}));

jest.mock('components/Skeleton', () => ({
  Skeleton: ({
    width,
    height,
    length,
    borderRadius,
  }: {
    width: string;
    height: string;
    length: number;
    borderRadius: string;
  }) => (
    <div
      data-testid="skeleton"
      data-width={width}
      data-height={height}
      data-length={length}
      data-border-radius={borderRadius}
    />
  ),
}));

jest.mock('./components/KpiCard', () => ({
  KpiCard: ({
    data,
    isSelected,
    onSelect,
    period,
  }: {
    data: KpiSummaryCardData;
    isSelected: boolean;
    onSelect: (id: string) => void;
    period?: string;
  }) => (
    <button
      type="button"
      data-testid={`kpi-card-${data.id}`}
      data-selected={isSelected?.toString()}
      data-period={period}
      onClick={() => onSelect(data.id)}
    >
      {data.id}
    </button>
  ),
}));

jest.mock('./KpiSummaryCards.styles', () => ({
  StyledKpiSummaryCards: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid': string;
  }) => <div data-testid={dataTestId}>{children}</div>,
  StyledKpiSummaryCardsLoading: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid': string;
  }) => <div data-testid={dataTestId}>{children}</div>,
}));

describe('KpiSummaryCards', () => {
  const mockData: KpiSummaryCardData[] = [
    {
      id: 'participation',
      performanceIndex: { value: '1.5', variation: 'up' },
      bigNumberData: [
        { id: 'core', value: '10%', measure: '%', variation: 'up' },
        { id: 'brand', value: '8%', measure: '%', variation: 'down' },
      ],
    },
    {
      id: 'occasions',
      performanceIndex: { value: '0.8', variation: 'down' },
      bigNumberData: [
        { id: 'core', value: '5', measure: '#', variation: 'down' },
        { id: 'brand', value: '6', measure: '#', variation: 'up' },
      ],
    },
    {
      id: 'brandPower',
      performanceIndex: { value: '1.0', variation: 'neutral' },
      bigNumberData: [
        { id: 'core', value: '50%', measure: '%', variation: 'neutral' },
        { id: 'brand', value: '55%', measure: '%', variation: 'up' },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDateToQuarterYear.mockReturnValue('Q1 2024');
  });

  describe('Basic Rendering', () => {
    it('should render the container with default data-testid', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-summary-cards')).toBeInTheDocument();
    });

    it('should render the container with custom data-testid', () => {
      render(<KpiSummaryCards data={mockData} dataTestId="custom" />);

      expect(
        screen.getByTestId('custom-kpi-summary-cards'),
      ).toBeInTheDocument();
    });

    it('should render all KpiCard components', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-card-participation')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-card-occasions')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-card-brandPower')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      render(<KpiSummaryCards data={mockData} loading={true} />);

      expect(
        screen.getByTestId('skeleton-kpi-summary-cards-loading'),
      ).toBeInTheDocument();
    });

    it('should render 3 skeleton items', () => {
      render(<KpiSummaryCards data={mockData} loading={true} />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(3);
    });

    it('should render skeleton with correct props', () => {
      render(<KpiSummaryCards data={mockData} loading={true} />);

      const skeleton = screen.getAllByTestId('skeleton')[0];
      expect(skeleton).toHaveAttribute('data-width', '100%');
      expect(skeleton).toHaveAttribute('data-height', '160.205px');
      expect(skeleton).toHaveAttribute('data-length', '1');
      expect(skeleton).toHaveAttribute('data-border-radius', 'small');
    });

    it('should render skeleton with custom data-testid', () => {
      render(
        <KpiSummaryCards data={mockData} loading={true} dataTestId="custom" />,
      );

      expect(screen.getByTestId('custom-skeleton-loading')).toBeInTheDocument();
    });

    it('should not render KpiCards when loading', () => {
      render(<KpiSummaryCards data={mockData} loading={true} />);

      expect(
        screen.queryByTestId('kpi-card-participation'),
      ).not.toBeInTheDocument();
    });

    it('should render KpiCards when loading is false', () => {
      render(<KpiSummaryCards data={mockData} loading={false} />);

      expect(screen.getByTestId('kpi-card-participation')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should have participation selected by default', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-card-participation')).toHaveAttribute(
        'data-selected',
        'true',
      );
      expect(screen.getByTestId('kpi-card-occasions')).toHaveAttribute(
        'data-selected',
        'false',
      );
    });

    it('should use defaultSelected prop', () => {
      render(<KpiSummaryCards data={mockData} defaultSelected="occasions" />);

      expect(screen.getByTestId('kpi-card-participation')).toHaveAttribute(
        'data-selected',
        'false',
      );
      expect(screen.getByTestId('kpi-card-occasions')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('should change selection when KpiCard is clicked', () => {
      render(<KpiSummaryCards data={mockData} />);

      fireEvent.click(screen.getByTestId('kpi-card-occasions'));

      expect(screen.getByTestId('kpi-card-participation')).toHaveAttribute(
        'data-selected',
        'false',
      );
      expect(screen.getByTestId('kpi-card-occasions')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('should call onSelectionChange when selection changes', () => {
      render(
        <KpiSummaryCards
          data={mockData}
          onSelectionChange={mockOnSelectionChange}
        />,
      );

      fireEvent.click(screen.getByTestId('kpi-card-occasions'));

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('occasions');
    });

    it('should not throw when onSelectionChange is not provided', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(() => {
        fireEvent.click(screen.getByTestId('kpi-card-occasions'));
      }).not.toThrow();
    });

    it('should allow selecting brandPower', () => {
      render(
        <KpiSummaryCards
          data={mockData}
          onSelectionChange={mockOnSelectionChange}
        />,
      );

      fireEvent.click(screen.getByTestId('kpi-card-brandPower'));

      expect(screen.getByTestId('kpi-card-brandPower')).toHaveAttribute(
        'data-selected',
        'true',
      );
      expect(mockOnSelectionChange).toHaveBeenCalledWith('brandPower');
    });
  });

  describe('Period Formatting', () => {
    it('should call formatDateToQuarterYear with lastDataRefreshKpisDate', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(mockFormatDateToQuarterYear).toHaveBeenCalledWith('2024-01-15');
    });

    it('should pass formatted date to KpiCard as period', () => {
      mockFormatDateToQuarterYear.mockReturnValue('Q1 2024');

      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-card-participation')).toHaveAttribute(
        'data-period',
        'Q1 2024',
      );
    });

    it('should update period when date changes', () => {
      mockFormatDateToQuarterYear.mockReturnValue('Q2 2024');

      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-card-participation')).toHaveAttribute(
        'data-period',
        'Q2 2024',
      );
    });
  });

  describe('Data Props', () => {
    it('should render empty when data is empty array', () => {
      render(<KpiSummaryCards data={[]} />);

      expect(screen.getByTestId('kpi-summary-cards')).toBeInTheDocument();
      expect(
        screen.queryByTestId('kpi-card-participation'),
      ).not.toBeInTheDocument();
    });

    it('should render single item', () => {
      const singleItem = [mockData[0]];

      render(<KpiSummaryCards data={singleItem} />);

      expect(screen.getByTestId('kpi-card-participation')).toBeInTheDocument();
      expect(
        screen.queryByTestId('kpi-card-occasions'),
      ).not.toBeInTheDocument();
    });

    it('should pass data to KpiCard', () => {
      render(<KpiSummaryCards data={mockData} />);

      expect(screen.getByTestId('kpi-card-participation')).toHaveTextContent(
        'participation',
      );
      expect(screen.getByTestId('kpi-card-occasions')).toHaveTextContent(
        'occasions',
      );
    });
  });

  describe('Multiple Selections', () => {
    it('should handle multiple selection changes', () => {
      render(
        <KpiSummaryCards
          data={mockData}
          onSelectionChange={mockOnSelectionChange}
        />,
      );

      fireEvent.click(screen.getByTestId('kpi-card-occasions'));
      fireEvent.click(screen.getByTestId('kpi-card-brandPower'));
      fireEvent.click(screen.getByTestId('kpi-card-participation'));

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(3);
      expect(mockOnSelectionChange).toHaveBeenNthCalledWith(1, 'occasions');
      expect(mockOnSelectionChange).toHaveBeenNthCalledWith(2, 'brandPower');
      expect(mockOnSelectionChange).toHaveBeenNthCalledWith(3, 'participation');
    });

    it('should only have one selected item at a time', () => {
      render(<KpiSummaryCards data={mockData} />);

      fireEvent.click(screen.getByTestId('kpi-card-occasions'));

      const selectedCards = screen
        .getAllByTestId(/kpi-card-/)
        .filter((el) => el.getAttribute('data-selected') === 'true');

      expect(selectedCards).toHaveLength(1);
    });
  });
});
