import { fireEvent, render, screen } from '@testing-library/react';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import { Power } from './Power';

const mockOnFilterChange = jest.fn();

const mockUseMediaQuery = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUseSubFilters = jest.fn();
const mockUseBffData = jest.fn();
const mockUsePerformanceToolData = jest.fn();
const mockUseFeatureToggle = jest.fn();
const mockAISummary = jest.fn();

jest.mock('hooks', () => ({
  useMediaQuery: (...args: unknown[]) => mockUseMediaQuery(...args),
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  useSubFilters: (...args: unknown[]) => mockUseSubFilters(...args),
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
}));

jest.mock('hooks/useBffData', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

jest.mock('../../../hooks/usePerformanceToolData', () => ({
  usePerformanceToolData: (...args: unknown[]) =>
    mockUsePerformanceToolData(...args),
}));

jest.mock('../../../PerformanceTool.styles', () => ({
  StyledPerformanceToolContent: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="performance-tool-content">{children}</div>,
}));

const mockBigNumbersSection = jest.fn();
jest.mock('../../Sections', () => ({
  BigNumbersSection: (props: {
    title: string;
    data?: unknown;
    defaultSelected?: number;
    onSelect?: (index: number) => void;
    loading: boolean;
    error: Error | null;
  }) => {
    mockBigNumbersSection(props);
    return (
      <div
        data-testid="big-numbers-section"
        data-title={props.title}
        data-loading={props.loading}
        data-default-selected={props.defaultSelected}
      >
        {props.data ? 'has-data' : 'no-data'}
        {props.onSelect && (
          <button
            data-testid="big-number-select-button"
            onClick={() => props.onSelect?.(0)}
          >
            Select
          </button>
        )}
      </div>
    );
  },
  PerformanceSection: (props: {
    title: string;
    lineBarChartsTitle?: string;
    waterfallTitle?: string;
    measure?: string;
    lineBarChartsData?: unknown;
    waterfallData?: unknown;
    waterfallRequest: UseBffDataResponse;
    lineBarChartsRequest: UseBffDataResponse;
    waterfallVariant?: 'large' | 'small';
    showDrivers?: boolean;
    waterfallConfig: unknown;
  }) => (
    <div
      data-testid="brand-power-performance-section"
      data-title={props.title}
      data-waterfall-variant={props.waterfallVariant}
    >
      PerformanceSection
    </div>
  ),
  DriversSection: ({ title }: { title: string }) => (
    <div data-testid="brand-power-drivers-section">DriversSection: {title}</div>
  ),
}));

jest.mock('../../../config', () => ({
  powerWaterfallConfig: { some: 'config' },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: (props: Record<string, unknown>) => {
    mockAISummary(props);
    return <div data-testid="ai-summary" />;
  },
}));

const mockDefaultBffData: UseBffDataResponse = {
  data: null,
  loading: false,
  error: null,
} as unknown as UseBffDataResponse;

const mockBigNumbersData = {
  'overtime-performance': [
    { value: 100, label: 'YTD' },
    { value: 200, label: 'QTD' },
  ],
};

describe('Power', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    mockUsePageFilterApplied.mockReturnValue({
      applied: { portfolios: 'Beer', brands: null, periods: 'YTD' },
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: { waterfall_view_by: 'brand' },
    });
    mockUseFeatureToggle.mockReturnValue([false, false]);
    mockUseBffData.mockReturnValue(mockDefaultBffData);
    mockUsePerformanceToolData.mockReturnValue(mockBigNumbersData);
  });

  describe('Rendering', () => {
    it('should render the main sections (content, big numbers with title, performance) and no drivers when brands is unset', () => {
      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(
        screen.getByTestId('performance-tool-content'),
      ).toBeInTheDocument();
      const bigNumbers = screen.getByTestId('big-numbers-section');
      expect(bigNumbers).toBeInTheDocument();
      expect(bigNumbers).toHaveAttribute('data-title', 'Overtime Performance');
      expect(
        screen.getByTestId('brand-power-performance-section'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('brand-power-drivers-section'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call onFilterChange when big number is selected', () => {
      render(<Power onFilterChange={mockOnFilterChange} />);

      fireEvent.click(screen.getByTestId('big-number-select-button'));

      expect(mockOnFilterChange).toHaveBeenCalledWith('periods', 'YTD');
    });
  });

  describe('States', () => {
    it('should use large variant on large screens', () => {
      mockUseMediaQuery.mockReturnValue(true);

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(
        screen.getByTestId('brand-power-performance-section'),
      ).toHaveAttribute('data-waterfall-variant', 'large');
    });

    it('should use small variant on small screens', () => {
      mockUseMediaQuery.mockReturnValue(false);

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(
        screen.getByTestId('brand-power-performance-section'),
      ).toHaveAttribute('data-waterfall-variant', 'small');
    });

    it('should render BrandPowerDriversSection when brands is set and not All', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { portfolios: 'Beer', brands: 'Budweiser', periods: 'YTD' },
      });

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(
        screen.getByTestId('brand-power-drivers-section'),
      ).toBeInTheDocument();
    });

    it('should not show drivers when brands is All', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { portfolios: 'Beer', brands: 'All', periods: 'YTD' },
      });

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(
        screen.queryByTestId('brand-power-drivers-section'),
      ).not.toBeInTheDocument();
    });

    it('should set default selected to 0 when periods is not in PERIOD_VALUES', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { portfolios: 'Beer', brands: null, periods: 'UNKNOWN' },
      });

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(screen.getByTestId('big-numbers-section')).toHaveAttribute(
        'data-default-selected',
        '0',
      );
    });

    it('should set selectedBigNumberIndex to 1 when periods is QTD', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { portfolios: 'Beer', brands: null, periods: 'QTD' },
      });

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(screen.getByTestId('big-numbers-section')).toHaveAttribute(
        'data-default-selected',
        '1',
      );
    });

    it('should render AI summary with the Brand Power identifier when enabled', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          zone: 'NAZ',
          country: 'CAN',
          brand_filter_groupings: 'All Brands',
          portfolios: 'Beer',
          growth_levers: 'All',
          brands: 'All',
          sub_brands: 'All',
          kpis: 'power',
          periods: 'YTD',
        },
      });

      render(<Power onFilterChange={mockOnFilterChange} />);

      expect(screen.getByTestId('ai-summary')).toBeInTheDocument();
      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          summaryPageIdentifier:
            '7. Value Creation; Performance Tool; Brand Power',
          kpiGroup: 'power',
          subFilters: expect.objectContaining({
            country: 'CAN',
            page_filter: 'All',
            brand: 'All',
            sub_brand: 'All',
            viewtype: '',
            period: 'YTD',
          }),
        }),
      );
    });
  });
});
