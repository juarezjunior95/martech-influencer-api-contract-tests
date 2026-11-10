import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { useBrandParticipationData } from '../../hooks/useBrandParticipationData/useBrandParticipationData';
import { getParticipationTableConfig } from '../../utils';
import { BrandParticipation } from './BrandParticipation';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockActiveSubFilters = {
  cohorts: '',
  'price-segments-brand': '',
};
const mockKpiData = {
  tableData: {
    header: [{ id: 'brand', title: 'Brand' }],
    rows: [[{ brand: { value: 'Brand A' } }]],
  },
  ranking: {
    ranking: {
      headers: ['Header 1'],
      rows: [{ label: 'Row 1', data: [] }],
    },
  },
};
const mockTableConfig = {
  brand: { minWidth: 150 },
};

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    isGlobalZone: false,
  })),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: mockActiveSubFilters,
  })),
}));

jest.mock(
  '../../hooks/useBrandParticipationData/useBrandParticipationData',
  () => ({
    useBrandParticipationData: jest.fn(() => ({
      data: {
        tableData: mockKpiData.tableData,
        ranking: mockKpiData.ranking,
      },
      loading: false,
      error: null,
    })),
  }),
);

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({ value, defaultValue, options, onValueChange }: any) => (
    <div
      data-testid="segmented-control"
      data-value={value}
      data-default-value={defaultValue}
    >
      {options.map((option: any) => (
        <button
          key={option.value}
          data-testid={`segment-option-${option.value}`}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('components', () => ({
  SubFilter: {
    Select: ({
      apiKey,
      stateKey,
      value,
      valueLabel,
      placeholder,
      allKey,
      chips,
    }: any) => (
      <div
        data-testid={`subfilter-${stateKey}`}
        data-api-key={apiKey}
        data-state-key={stateKey}
        data-value={value}
        data-value-label={valueLabel}
        data-placeholder={placeholder}
        data-all-key={allKey}
        data-chips={String(chips)}
      >
        SubFilter: {apiKey}
      </div>
    ),
  },
}));

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ width, height, length, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Loading Skeleton
    </div>
  ),
}));

jest.mock('pages/components', () => ({
  POSBookTable: ({
    loading,
    data,
    config,
    groupHeaderHeight,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'pos-book-table'}
      data-loading={String(loading)}
      data-has-data={!!data}
      data-has-config={!!config}
      data-group-header-height={groupHeaderHeight}
    >
      POSBookTable Component
    </div>
  ),
}));

jest.mock('pages/pillars/Category/POSBook/components', () => ({
  TableHeader: ({ title, lastDataRefresh, filters, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'table-header'}
      data-title={title}
      data-last-data-refresh={lastDataRefresh}
    >
      <div data-testid="table-header-title">{title}</div>
      <div data-testid="table-header-filters">{filters}</div>
    </div>
  ),
}));

jest.mock('pages/components/BrandRanking/BrandRanking', () => ({
  BrandRanking: ({ ranking, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'brand-ranking'}
      data-has-ranking={!!ranking}
    >
      BrandRanking Component
    </div>
  ),
}));

jest.mock(
  'pages/components/POSBookTable/config/tableConfigs/globalBrandsTableConfig',
  () => ({
    globalBrandsTableConfig: {
      globalBrand: { minWidth: 200 },
    },
  }),
);

jest.mock('pages/pillars/Category/POSBook/POSBook', () => ({
  POS_BOOK_PAGE_NAME: 'POS_BOOK',
}));

jest.mock('shared/Styles', () => ({
  StyledSectionTitle: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-section-title'}>{children}</div>
  ),
}));

jest.mock('../../../../POSBook.styles', () => ({
  StyledPOSContentSection: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-pos-content-section'}>
      {children}
    </div>
  ),
  StyledPOSHeaderContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-pos-header-container'}>
      {children}
    </div>
  ),
}));

jest.mock('./BrandParticipation.styles', () => ({
  StyledBrandParticipationContent: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-brand-participation-content'}>
      {children}
    </div>
  ),
}));

jest.mock('../../constants', () => ({
  PRICE_SEGMENTS_KEY_BRAND: 'price-segments-brand',
  PRICE_SEGMENTS_ALL_BRAND: '',
  SEGMENT_OPTIONS: [
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'global-brands', label: 'Global Brands' },
    { value: 'rankings', label: 'Key Brands' },
  ],
  VIEW_TYPES: {
    PORTFOLIO: 'portfolio',
    GLOBAL_BRANDS: 'global-brands',
    RANKINGS: 'rankings',
  },
}));

jest.mock('../../utils', () => ({
  getParticipationTableConfig: jest.fn(() => mockTableConfig),
}));

describe('BrandParticipation', () => {
  const defaultProps = {
    formatMessage: mockFormatMessage,
    lastDataRefresh: '2025-01-15',
  };

  const renderBrandParticipation = (
    props: Partial<React.ComponentProps<typeof BrandParticipation>> = {},
  ) => render(<BrandParticipation {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      isGlobalZone: false,
    });
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
    });
    (useBrandParticipationData as jest.Mock).mockReturnValue({
      data: {
        tableData: mockKpiData.tableData,
        ranking: mockKpiData.ranking,
      },
      loading: false,
      error: null,
    });
  });

  describe('Component Structure', () => {
    it('renders StyledPOSContentSection', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('styled-pos-content-section'),
      ).toBeInTheDocument();
    });

    it('renders StyledPOSHeaderContainer', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('styled-pos-header-container'),
      ).toBeInTheDocument();
    });

    it('renders StyledSectionTitle with correct text', () => {
      render(<BrandParticipation {...defaultProps} />);

      const sectionTitle = screen.getByTestId('styled-section-title');
      expect(sectionTitle).toBeInTheDocument();
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.LeadTheCategory.brandParticipation.title',
      });
    });

    it('renders SegmentedControl', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('renders StyledBrandParticipationContent', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('styled-brand-participation-content'),
      ).toBeInTheDocument();
    });

    it('renders TableHeader', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });
  });

  describe('SegmentedControl Configuration', () => {
    it('passes correct default value', () => {
      render(<BrandParticipation {...defaultProps} />);

      const segmentedControl = screen.getByTestId('segmented-control');
      expect(segmentedControl).toHaveAttribute(
        'data-default-value',
        'portfolio',
      );
    });

    it('initial value is portfolio', () => {
      render(<BrandParticipation {...defaultProps} />);

      const segmentedControl = screen.getByTestId('segmented-control');
      expect(segmentedControl).toHaveAttribute('data-value', 'portfolio');
    });

    it('renders all segment options when isGlobalZone is true', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('segment-option-portfolio'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('segment-option-global-brands'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('segment-option-rankings')).toBeInTheDocument();
    });

    it('filters out global-brands option when isGlobalZone is false', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('segment-option-portfolio'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('segment-option-global-brands'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('segment-option-rankings')).toBeInTheDocument();
    });
  });

  describe('View Selection', () => {
    it('changes view when segment option is clicked', () => {
      renderBrandParticipation();

      const rankingsOption = screen.getByTestId('segment-option-rankings');
      fireEvent.click(rankingsOption);

      const segmentedControl = screen.getByTestId('segmented-control');
      expect(segmentedControl).toHaveAttribute('data-value', 'rankings');
    });

    it('updates title when view changes', () => {
      renderBrandParticipation();

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.LeadTheCategory.brandParticipation.rankings.title',
      });
    });
  });

  describe('Portfolio View', () => {
    it('renders POSBookTable for portfolio view', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
    });

    it('passes correct data to POSBookTable', () => {
      render(<BrandParticipation {...defaultProps} />);

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-has-data', 'true');
    });

    it('passes loading state to POSBookTable', () => {
      (useBrandParticipationData as jest.Mock).mockReturnValue({
        data: {
          tableData: mockKpiData.tableData,
          ranking: mockKpiData.ranking,
        },
        loading: true,
        error: null,
      });

      render(<BrandParticipation {...defaultProps} />);

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-loading', 'true');
    });

    it('passes tableConfig to POSBookTable', () => {
      render(<BrandParticipation {...defaultProps} />);

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-has-config', 'true');
    });
  });

  describe('Rankings View', () => {
    it('renders BrandRanking when view is rankings and not loading', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(screen.getByTestId('brand-ranking')).toBeInTheDocument();
    });

    it('renders Skeleton when rankings view is loading', () => {
      (useBrandParticipationData as jest.Mock).mockReturnValue({
        data: {
          tableData: mockKpiData.tableData,
          ranking: mockKpiData.ranking,
        },
        loading: true,
        error: null,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('data-width', '1290px');
      expect(skeleton).toHaveAttribute('data-height', '684px');
    });

    it('passes ranking data to BrandRanking', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const brandRanking = screen.getByTestId('brand-ranking');
      expect(brandRanking).toHaveAttribute('data-has-ranking', 'true');
    });
  });
  describe('Global Brands View', () => {
    beforeEach(() => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });
    });

    it('renders POSBookTable when view is global-brands and not loading', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
    });

    it('renders Skeleton when global-brands view is loading', () => {
      (useBrandParticipationData as jest.Mock).mockReturnValue({
        data: {
          tableData: mockKpiData.tableData,
          ranking: mockKpiData.ranking,
        },
        loading: true,
        error: null,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('passes globalBrands data to POSBookTable', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-has-data', 'true');
    });

    it('passes groupHeaderHeight to POSBookTable', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-group-header-height', '81');
    });
  });

  describe('SubFilters - Cohorts', () => {
    it('renders Cohort SubFilter for portfolio view when isGlobalZone is true', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      render(<BrandParticipation {...defaultProps} />);

      expect(screen.getByTestId('subfilter-cohorts')).toBeInTheDocument();
    });

    it('does not render Cohort SubFilter for portfolio view when isGlobalZone is false', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      render(<BrandParticipation {...defaultProps} />);

      expect(screen.queryByTestId('subfilter-cohorts')).not.toBeInTheDocument();
    });

    it('renders Cohort SubFilter for rankings view', () => {
      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(screen.getByTestId('subfilter-cohorts')).toBeInTheDocument();
    });

    it('renders Cohort SubFilter for global-brands view', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      expect(screen.getByTestId('subfilter-cohorts')).toBeInTheDocument();
    });

    it('Cohort SubFilter shows empty value when cohorts is All', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { ...mockActiveSubFilters, cohorts: 'All' },
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const cohortFilter = screen.getByTestId('subfilter-cohorts');
      expect(cohortFilter).toHaveAttribute('data-value', '');
    });

    it('Cohort SubFilter valueLabel changes based on cohorts value', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { ...mockActiveSubFilters, cohorts: 'All' },
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const cohortFilter = screen.getByTestId('subfilter-cohorts');
      expect(cohortFilter).toHaveAttribute(
        'data-value-label',
        'Select a Cohort',
      );
    });
  });

  describe('SubFilters - Price Segment', () => {
    it('renders Price Segment SubFilter when view is rankings and isGlobalZone is false', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(
        screen.getByTestId('subfilter-price-segments-brand'),
      ).toBeInTheDocument();
    });

    it('does not render Price Segment SubFilter when view is rankings and isGlobalZone is true', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(
        screen.queryByTestId('subfilter-price-segments-brand'),
      ).not.toBeInTheDocument();
    });

    it('does not render Price Segment SubFilter for portfolio view', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.queryByTestId('subfilter-price-segments-brand'),
      ).not.toBeInTheDocument();
    });

    it('Price Segment SubFilter has correct configuration', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const priceSegmentFilter = screen.getByTestId(
        'subfilter-price-segments-brand',
      );
      expect(priceSegmentFilter).toHaveAttribute(
        'data-api-key',
        'price-segments',
      );
      expect(priceSegmentFilter).toHaveAttribute(
        'data-state-key',
        'price-segments-brand',
      );
      expect(priceSegmentFilter).toHaveAttribute('data-all-key', '');
    });

    it('Price Segment SubFilter valueLabel changes based on value', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          ...mockActiveSubFilters,
          'price-segments-brand': '',
        },
      });

      render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      const priceSegmentFilter = screen.getByTestId(
        'subfilter-price-segments-brand',
      );
      expect(priceSegmentFilter).toHaveAttribute(
        'data-value-label',
        'Select a Price Segment',
      );
    });
  });

  describe('TableHeader Props', () => {
    it('passes title to TableHeader', () => {
      render(<BrandParticipation {...defaultProps} />);

      const tableHeader = screen.getByTestId('table-header');
      expect(tableHeader).toHaveAttribute('data-title');
    });

    it('passes lastDataRefresh to TableHeader', () => {
      render(<BrandParticipation {...defaultProps} />);

      const tableHeader = screen.getByTestId('table-header');
      expect(tableHeader).toHaveAttribute(
        'data-last-data-refresh',
        '2025-01-15',
      );
    });

    it('passes filters to TableHeader', () => {
      render(<BrandParticipation {...defaultProps} />);

      const filters = screen.getByTestId('table-header-filters');
      expect(filters).toBeInTheDocument();
    });
  });

  describe('Hooks Integration', () => {
    it('calls usePageFilterApplied with correct page name', () => {
      renderBrandParticipation();

      expect(usePageFilterApplied).toHaveBeenCalledWith('POS_BOOK');
    });

    it('calls useBrandParticipationData with the initial portfolio view', () => {
      renderBrandParticipation();

      expect(useBrandParticipationData).toHaveBeenLastCalledWith('portfolio');
    });

    it('calls useBrandParticipationData with the selected rankings view', () => {
      renderBrandParticipation();

      fireEvent.click(screen.getByTestId('segment-option-rankings'));

      expect(useBrandParticipationData).toHaveBeenLastCalledWith('rankings');
    });

    it('calls useBrandParticipationData with the selected global-brands view', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      renderBrandParticipation();

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      expect(useBrandParticipationData).toHaveBeenLastCalledWith(
        'global-brands',
      );
    });

    it('renders data from useBrandParticipationData in portfolio view', () => {
      render(<BrandParticipation {...defaultProps} />);

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-has-data', 'true');
    });

    it('calls getParticipationTableConfig with the current zone flag', () => {
      render(<BrandParticipation {...defaultProps} />);

      expect(getParticipationTableConfig).toHaveBeenLastCalledWith(false);
    });

    it('recalculates tableConfig when the zone flag changes', () => {
      const { rerender } = render(<BrandParticipation {...defaultProps} />);

      expect(getParticipationTableConfig).toHaveBeenLastCalledWith(false);

      (getParticipationTableConfig as jest.Mock).mockClear();
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      rerender(<BrandParticipation {...defaultProps} />);

      expect(getParticipationTableConfig).toHaveBeenLastCalledWith(true);
    });
  });

  describe('useEffect - Global Zone Correction', () => {
    it('resets to portfolio when global-brands is selected but isGlobalZone is false', async () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      const { rerender } = render(<BrandParticipation {...defaultProps} />);

      fireEvent.click(screen.getByTestId('segment-option-global-brands'));

      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      rerender(<BrandParticipation {...defaultProps} />);

      await waitFor(() => {
        const segmentedControl = screen.getByTestId('segmented-control');
        expect(segmentedControl).toHaveAttribute('data-value', 'portfolio');
      });
    });
  });

  describe('Component Hierarchy', () => {
    it('TableHeader is inside StyledBrandParticipationContent', () => {
      render(<BrandParticipation {...defaultProps} />);

      const content = screen.getByTestId('styled-brand-participation-content');
      const tableHeader = screen.getByTestId('table-header');

      expect(content).toContainElement(tableHeader);
    });

    it('SegmentedControl is inside StyledPOSHeaderContainer', () => {
      render(<BrandParticipation {...defaultProps} />);

      const headerContainer = screen.getByTestId('styled-pos-header-container');
      const segmentedControl = screen.getByTestId('segmented-control');

      expect(headerContainer).toContainElement(segmentedControl);
    });

    it('Main content is inside StyledPOSContentSection', () => {
      render(<BrandParticipation {...defaultProps} />);

      const contentSection = screen.getByTestId('styled-pos-content-section');
      const headerContainer = screen.getByTestId('styled-pos-header-container');
      const content = screen.getByTestId('styled-brand-participation-content');

      expect(contentSection).toContainElement(headerContainer);
      expect(contentSection).toContainElement(content);
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('styled-pos-content-section'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();

      rerender(<BrandParticipation {...defaultProps} />);

      expect(
        screen.getByTestId('styled-pos-content-section'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined activeSubFilters', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: undefined,
      });

      render(<BrandParticipation {...defaultProps} />);

      expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
    });

    it('handles null tableData', () => {
      (useBrandParticipationData as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      render(<BrandParticipation {...defaultProps} />);

      const posBookTable = screen.getByTestId('pos-book-table');
      expect(posBookTable).toHaveAttribute('data-has-data', 'false');
    });

    it('handles empty lastDataRefresh', () => {
      render(<BrandParticipation {...defaultProps} lastDataRefresh="" />);

      const tableHeader = screen.getByTestId('table-header');
      expect(tableHeader).toHaveAttribute('data-last-data-refresh', '');
    });
  });

  describe('data-testid Implementation', () => {
    describe('Without dataTestId prop', () => {
      it('does not render custom data-testid on StyledPOSContentSection when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(
          screen.getByTestId('styled-pos-content-section'),
        ).toBeInTheDocument();
      });

      it('does not render custom data-testid on StyledPOSHeaderContainer when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(
          screen.getByTestId('styled-pos-header-container'),
        ).toBeInTheDocument();
      });

      it('does not render custom data-testid on StyledSectionTitle when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(screen.getByTestId('styled-section-title')).toBeInTheDocument();
      });

      it('does not render custom data-testid on StyledBrandParticipationContent when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(
          screen.getByTestId('styled-brand-participation-content'),
        ).toBeInTheDocument();
      });

      it('does not render custom data-testid on TableHeader when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(screen.getByTestId('table-header')).toBeInTheDocument();
      });

      it('does not render custom data-testid on POSBookTable when dataTestId is not provided', () => {
        render(<BrandParticipation {...defaultProps} />);

        expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
      });

      it('does not render custom data-testid on Skeleton when dataTestId is not provided', () => {
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        render(<BrandParticipation {...defaultProps} />);

        fireEvent.click(screen.getByTestId('segment-option-rankings'));

        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      });
    });

    describe('With dataTestId prop', () => {
      it.each([
        ['StyledPOSContentSection', 'section-brand-part'],
        ['StyledPOSHeaderContainer', 'header-container-brand-part'],
        ['StyledSectionTitle', 'title-brand-part'],
        ['StyledBrandParticipationContent', 'content-brand-part'],
        ['POSBookTable portfolio view', 'brand-part-portfolio'],
      ])('renders data-testid on %s', (_, testId) => {
        renderBrandParticipation({ dataTestId: 'brand-part' });

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });

      it('renders data-testid on TableHeader without duplicating prefix', () => {
        renderBrandParticipation({ dataTestId: 'brand-part' });

        const elements = screen.getAllByTestId('brand-part');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });

      it('renders data-testid on Skeleton for rankings view with suffix', () => {
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        renderBrandParticipation({ dataTestId: 'brand-part' });

        fireEvent.click(screen.getByTestId('segment-option-rankings'));

        expect(
          screen.getByTestId('skeleton-brand-part-rankings'),
        ).toBeInTheDocument();
      });

      it('renders data-testid on POSBookTable for global-brands view with suffix', () => {
        (usePageFilterApplied as jest.Mock).mockReturnValue({
          isGlobalZone: true,
        });

        renderBrandParticipation({ dataTestId: 'brand-part' });

        fireEvent.click(screen.getByTestId('segment-option-global-brands'));

        expect(
          screen.getByTestId('brand-part-global-brands'),
        ).toBeInTheDocument();
      });

      it('renders data-testid on Skeleton for global-brands view with suffix', () => {
        (usePageFilterApplied as jest.Mock).mockReturnValue({
          isGlobalZone: true,
        });
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        renderBrandParticipation({ dataTestId: 'brand-part' });

        fireEvent.click(screen.getByTestId('segment-option-global-brands'));

        expect(
          screen.getByTestId('skeleton-brand-part-global-brands'),
        ).toBeInTheDocument();
      });

      it('renders data-testid on BrandRanking with suffix', () => {
        renderBrandParticipation({ dataTestId: 'brand-part' });

        fireEvent.click(screen.getByTestId('segment-option-rankings'));

        expect(screen.getByTestId('brand-part-rankings')).toBeInTheDocument();
      });
    });

    describe('dataTestId with empty string', () => {
      it('does not render custom data-testid when dataTestId is empty string', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="" />);

        expect(
          screen.getByTestId('styled-pos-content-section'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
      });
    });

    describe('dataTestId propagation across views', () => {
      it('maintains dataTestId when switching from portfolio to rankings', () => {
        render(
          <BrandParticipation {...defaultProps} dataTestId="switch-test" />,
        );

        expect(screen.getByTestId('section-switch-test')).toBeInTheDocument();
        expect(screen.getByTestId('switch-test-portfolio')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('segment-option-rankings'));

        expect(screen.getByTestId('section-switch-test')).toBeInTheDocument();
        expect(screen.getByTestId('switch-test-rankings')).toBeInTheDocument();
      });

      it('maintains dataTestId when switching from portfolio to global-brands', () => {
        (usePageFilterApplied as jest.Mock).mockReturnValue({
          isGlobalZone: true,
        });

        render(
          <BrandParticipation {...defaultProps} dataTestId="switch-test" />,
        );

        expect(screen.getByTestId('switch-test-portfolio')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('segment-option-global-brands'));

        expect(
          screen.getByTestId('switch-test-global-brands'),
        ).toBeInTheDocument();
      });

      it('preserves dataTestId structure after multiple view changes', () => {
        (usePageFilterApplied as jest.Mock).mockReturnValue({
          isGlobalZone: true,
        });

        render(
          <BrandParticipation {...defaultProps} dataTestId="persistent" />,
        );

        expect(screen.getByTestId('persistent-portfolio')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('segment-option-rankings'));
        expect(screen.getByTestId('persistent-rankings')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('segment-option-global-brands'));
        expect(
          screen.getByTestId('persistent-global-brands'),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('segment-option-portfolio'));
        expect(screen.getByTestId('persistent-portfolio')).toBeInTheDocument();
      });
    });

    describe('dataTestId with loading states', () => {
      it('renders correct dataTestId on Skeleton when portfolio is loading', () => {
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        render(<BrandParticipation {...defaultProps} dataTestId="loading" />);

        const posBookTable = screen.getByTestId('loading-portfolio');
        expect(posBookTable).toHaveAttribute('data-loading', 'true');
      });

      it('renders correct dataTestId on Skeleton when rankings is loading', () => {
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        render(<BrandParticipation {...defaultProps} dataTestId="loading" />);

        fireEvent.click(screen.getByTestId('segment-option-rankings'));

        expect(
          screen.getByTestId('skeleton-loading-rankings'),
        ).toBeInTheDocument();
      });

      it('renders correct dataTestId on Skeleton when global-brands is loading', () => {
        (usePageFilterApplied as jest.Mock).mockReturnValue({
          isGlobalZone: true,
        });
        (useBrandParticipationData as jest.Mock).mockReturnValue({
          data: {
            tableData: mockKpiData.tableData,
            ranking: mockKpiData.ranking,
          },
          loading: true,
          error: null,
        });

        render(<BrandParticipation {...defaultProps} dataTestId="loading" />);

        fireEvent.click(screen.getByTestId('segment-option-global-brands'));

        expect(
          screen.getByTestId('skeleton-loading-global-brands'),
        ).toBeInTheDocument();
      });
    });

    describe('dataTestId with special characters', () => {
      it('handles dataTestId with hyphens', () => {
        render(
          <BrandParticipation
            {...defaultProps}
            dataTestId="brand-participation-test"
          />,
        );

        expect(
          screen.getByTestId('section-brand-participation-test'),
        ).toBeInTheDocument();
      });

      it('handles dataTestId with numbers', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="brand-1" />);

        expect(screen.getByTestId('section-brand-1')).toBeInTheDocument();
      });

      it('handles dataTestId with underscores', () => {
        render(
          <BrandParticipation {...defaultProps} dataTestId="brand_part" />,
        );

        expect(screen.getByTestId('section-brand_part')).toBeInTheDocument();
      });
    });

    describe('dataTestId hierarchy validation', () => {
      it('maintains correct parent-child relationships with data-testid', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="hierarchy" />);

        const section = screen.getByTestId('section-hierarchy');
        const headerContainer = screen.getByTestId(
          'header-container-hierarchy',
        );
        const content = screen.getByTestId('content-hierarchy');

        expect(section).toContainElement(headerContainer);
        expect(section).toContainElement(content);
      });

      it('all styled components have correct dataTestId structure', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="complete" />);

        expect(screen.getByTestId('section-complete')).toBeInTheDocument();
        expect(
          screen.getByTestId('header-container-complete'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('title-complete')).toBeInTheDocument();
        expect(screen.getByTestId('content-complete')).toBeInTheDocument();
        expect(screen.getByTestId('complete-portfolio')).toBeInTheDocument();
      });
    });

    describe('dataTestId does not create duplicates', () => {
      it('does not create duplicate styled-pos-content-section when dataTestId is provided', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="unique" />);

        expect(
          screen.queryByTestId('styled-pos-content-section'),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('section-unique')).toBeInTheDocument();
      });

      it('TableHeader receives dataTestId without duplication', () => {
        render(<BrandParticipation {...defaultProps} dataTestId="unique" />);

        expect(screen.queryByTestId('table-header')).not.toBeInTheDocument();
        const elements = screen.getAllByTestId('unique');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
