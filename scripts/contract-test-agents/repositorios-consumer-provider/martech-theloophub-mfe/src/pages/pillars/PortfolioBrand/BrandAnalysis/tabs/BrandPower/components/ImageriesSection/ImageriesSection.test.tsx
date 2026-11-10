import { render, screen, waitFor } from '@testing-library/react';
import * as hooks from 'hooks';
import { FilterValue } from 'models/Filters';

import { powerKpiConfigs } from '../../constants';
import { ImageriesSection } from './ImageriesSection';

const mockSetSubFilterValue = jest.fn();
const mockLoadSubFilterData = jest.fn();

const mockActiveSubFilters = {
  imagery_questions: 'question1',
  competitor_brands: 'Brands ABI',
};

const mockSubFiltersData = {
  imagery_questions: {
    values: [{ label: 'Question 1', value: 'question1' }],
  },
};

const mockApplied = {
  country: 'BR' as FilterValue,
  brands_abi: 'brand1' as FilterValue,
  time_frame: '2024' as FilterValue,
};

const mockImageriesKpiData = {
  loading: false,
  kpiData: { imageries: { kpiData: { data: [{ quarter: 'Q1', value: 10 }] } } },
};

const mockBipKpiData = {
  loading: false,
  kpiData: {
    header: [{ field: 'brand', label: 'Brand' }],
    rows: [{ brand: 'Brand A', value: 100 }],
  },
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('hooks', () => ({
  __esModule: true,
  ...jest.createMockFromModule<typeof import('hooks')>('hooks'),
}));

jest.mock('pages/pillars/PortfolioBrand/BrandAnalysis/BrandAnalysis', () => ({
  BRAND_POWER_PAGE_NAME: 'brand-power-page',
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
  }: {
    header: { rightContent?: React.ReactNode };
    children: React.ReactNode;
  }) => (
    <div data-testid="basic-container">
      <div data-testid="header-right-content">{header?.rightContent}</div>
      {children}
    </div>
  ),
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock(
  'components/SubFilter/components/FilterSkeleton/FilterSkeleton',
  () => ({
    FilterSkeleton: () => <div data-testid="filter-skeleton" />,
  }),
);

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('../BipTable/BipTable', () => ({
  BipTable: () => <div data-testid="bip-table" />,
}));

jest.mock('../Chart/Chart', () => ({
  Chart: ({ loading }: { loading: boolean }) => (
    <div data-testid="chart" data-loading={String(loading)} />
  ),
}));

jest.mock('./components/ImageryQuestionsSelect', () => ({
  ImageryQuestionsSelect: () => <div data-testid="imagery-questions-select" />,
}));

jest.mock('../../utils', () => ({
  applyCompetitorConfigs: jest.fn((data) => data),
  getChartList: jest.fn(() => [{ data: 'mock-chart' }]),
}));

jest.mock('../../utils/bipTableConfig', () => ({
  getBipTableConfig: jest.fn(() => ({ columns: [] })),
}));

const mockedHooks = hooks as jest.Mocked<typeof hooks>;

const defaultProps = {
  quarterYearSelected: 'quarter' as const,
  kpiConfig: powerKpiConfigs,
  imageriesKpiResponse: mockImageriesKpiData as any,
  bipKpiResponse: mockBipKpiData as any,
};

describe('ImageriesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedHooks.useSubFilters.mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
      subFiltersLoaded: { imagery_questions: true },
      setSubFilterValue: mockSetSubFilterValue,
      subFiltersData: mockSubFiltersData,
      loadSubFilterData: mockLoadSubFilterData,
    } as any);

    mockedHooks.usePageFilterApplied.mockReturnValue({
      applied: mockApplied,
    } as any);
  });

  it('renders ImageryQuestionsSelect once the filter is loaded and FilterSkeleton otherwise', () => {
    const { rerender } = render(<ImageriesSection {...defaultProps} />);
    expect(screen.getByTestId('imagery-questions-select')).toBeInTheDocument();

    mockedHooks.useSubFilters.mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
      subFiltersLoaded: { imagery_questions: false },
      setSubFilterValue: mockSetSubFilterValue,
      subFiltersData: mockSubFiltersData,
      loadSubFilterData: mockLoadSubFilterData,
    } as any);
    rerender(<ImageriesSection {...defaultProps} />);
    expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
  });

  it('forwards parent loading flags to Chart', () => {
    render(
      <ImageriesSection
        {...defaultProps}
        imageriesKpiResponse={{ loading: true, kpiData: {} } as any}
        bipKpiResponse={{ loading: true, kpiData: {} } as any}
      />,
    );

    expect(screen.getByTestId('chart')).toHaveAttribute('data-loading', 'true');
  });

  describe('BipTable rendering', () => {
    it('renders BipTable when bip data is available', () => {
      render(<ImageriesSection {...defaultProps} />);

      expect(screen.getByTestId('bip-table')).toBeInTheDocument();
    });

    it('renders Skeleton when bip data is loading', () => {
      render(
        <ImageriesSection
          {...defaultProps}
          bipKpiResponse={{ loading: true, kpiData: {} } as any}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('skips BipTable when bip data has empty=true', () => {
      render(
        <ImageriesSection
          {...defaultProps}
          bipKpiResponse={{ loading: false, kpiData: { empty: true } } as any}
        />,
      );

      expect(screen.queryByTestId('bip-table')).not.toBeInTheDocument();
    });
  });

  describe('preset filter loading', () => {
    it('requests imagery-questions with current country/subbrand', async () => {
      render(<ImageriesSection {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadSubFilterData).toHaveBeenCalledWith(
          'imagery-questions',
          {
            'imagery-questions[country]': 'BR',
            'imagery-questions[subbrand]': 'brand1',
          },
          'imagery_questions',
        );
      });
    });

    it.each(['country', 'brands_abi'] as const)(
      'does not request when %s is missing',
      async (field) => {
        mockedHooks.usePageFilterApplied.mockReturnValue({
          applied: { ...mockApplied, [field]: null },
        } as any);

        render(<ImageriesSection {...defaultProps} />);

        await waitFor(() => {
          expect(mockLoadSubFilterData).not.toHaveBeenCalled();
        });
      },
    );

    it('re-runs the request when country changes', async () => {
      const { rerender } = render(<ImageriesSection {...defaultProps} />);

      await waitFor(() =>
        expect(mockLoadSubFilterData).toHaveBeenCalledTimes(1),
      );

      mockedHooks.usePageFilterApplied.mockReturnValue({
        applied: { ...mockApplied, country: 'AR' as FilterValue },
      } as any);
      rerender(<ImageriesSection {...defaultProps} />);

      await waitFor(() => {
        expect(mockLoadSubFilterData).toHaveBeenLastCalledWith(
          'imagery-questions',
          {
            'imagery-questions[country]': 'AR',
            'imagery-questions[subbrand]': 'brand1',
          },
          'imagery_questions',
        );
      });
    });
  });
});
