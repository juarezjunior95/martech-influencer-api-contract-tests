import { render, screen } from '@testing-library/react';
import { CategoryOverviewInterface } from 'components';

import { CategoryGrowthLevers } from './CategoryGrowthLevers';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id, defaultMessage }) => {
      if (id.includes('tooltip')) {
        return `Tooltip for ${id.split('.').pop()}`;
      }
      return defaultMessage;
    }),
  }),
}));

const mockUseIsInExportPage = jest.fn(() => false);

jest.mock('hooks', () => ({
  useIsInExportPage: () => mockUseIsInExportPage(),
}));

jest.mock('components', () => ({
  CategoryOverview: ({ data }: any) => (
    <div data-testid="category-overview" data-title={data.title}>
      {data.title}
      {data.tooltip && (
        <span data-testid="overview-tooltip">{data.tooltip}</span>
      )}
    </div>
  ),
  ErrorMessage: () => <div data-testid="error-message">Error Message</div>,
  Skeleton: ({ height, width, length, gap }: any) => (
    <div
      data-testid="skeleton"
      data-height={height}
      data-width={width}
      data-length={length}
      data-gap={gap}
    >
      Loading...
    </div>
  ),
}));

jest.mock('./CategoryGrowthLevers.styles', () => ({
  StyledContent: ({ children }: any) => (
    <div data-testid="styled-content">{children}</div>
  ),
}));

describe('CategoryGrowthLevers Component', () => {
  const mockData: CategoryOverviewInterface[] = [
    {
      title: 'Revenue',
      versus: 'vs LY',
      kpi: {
        header: [
          { id: 'mix', title: 'Mix' },
          { id: 'vsLy', title: 'vs LY' },
        ],
        rows: [
          {
            label: 'Total',
            mix: { value: 100, unitOfMeasure: '%' },
            vsLy: { value: 5, unitOfMeasure: '%', direction: 'up' },
          },
        ],
      },
    },
    {
      title: 'Volume',
      versus: 'vs LY',
      kpi: {
        header: [
          { id: 'mix', title: 'Mix' },
          { id: 'vsLy', title: 'vs LY' },
        ],
        rows: [
          {
            label: 'Total',
            mix: { value: 50, unitOfMeasure: '%' },
            vsLy: { value: 10, unitOfMeasure: '%', direction: 'up' },
          },
        ],
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsInExportPage.mockReturnValue(false);
  });

  describe('Loading State', () => {
    it('should render skeleton when loading is true', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render skeleton with correct props when not on an export page', () => {
      mockUseIsInExportPage.mockReturnValue(false);

      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-height', '168px');
      expect(skeleton).toHaveAttribute('data-width', '241px');
      expect(skeleton).toHaveAttribute('data-length', '5');
      expect(skeleton).toHaveAttribute('data-gap', 'medium');
    });

    it('should render skeleton with different width when in export pages', () => {
      mockUseIsInExportPage.mockReturnValue(true);

      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-width', '311px');
    });

    it('should not render CategoryOverview when loading', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render ErrorMessage when error is provided', () => {
      const error = new Error('Test error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should not render CategoryOverview when error exists', () => {
      const error = new Error('Test error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });
  });

  describe('Empty Data State', () => {
    it('should render ErrorMessage when data is null', () => {
      render(
        <CategoryGrowthLevers
          data={null as any}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should render ErrorMessage when data is undefined', () => {
      render(
        <CategoryGrowthLevers
          data={undefined as any}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should render ErrorMessage when data has empty property set to true', () => {
      render(
        <CategoryGrowthLevers
          data={{ empty: true }}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should not render CategoryOverview when data is empty', () => {
      render(
        <CategoryGrowthLevers
          data={{ empty: true }}
          error={null}
          loading={false}
        />,
      );

      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });
  });

  describe('Success State with Data', () => {
    it('should render CategoryOverview components when data is valid', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(2);
    });

    it('should render correct titles for each CategoryOverview', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('should render StyledContent container', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.getByTestId('styled-content')).toBeInTheDocument();
    });

    it('should pass correct data to each CategoryOverview', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews[0]).toHaveAttribute('data-title', 'Revenue');
      expect(overviews[1]).toHaveAttribute('data-title', 'Volume');
    });

    it('should render with single item', () => {
      const singleItem = [mockData[0]];

      render(
        <CategoryGrowthLevers data={singleItem} error={null} loading={false} />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(1);
    });

    it('should not render skeleton or error when data is valid', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Prop', () => {
    it('should include tooltip when tooltip prop is true (default)', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      const tooltips = screen.getAllByTestId('overview-tooltip');
      expect(tooltips).toHaveLength(2);
    });

    it('should include tooltip when tooltip prop is explicitly true', () => {
      render(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const tooltips = screen.getAllByTestId('overview-tooltip');
      expect(tooltips).toHaveLength(2);
    });

    it('should not include tooltip when tooltip prop is false', () => {
      render(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={false}
        />,
      );

      expect(screen.queryByTestId('overview-tooltip')).not.toBeInTheDocument();
    });

    it('should format tooltip message correctly', () => {
      render(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const tooltips = screen.getAllByTestId('overview-tooltip');
      expect(tooltips[0]).toHaveTextContent('Tooltip for Revenue');
      expect(tooltips[1]).toHaveTextContent('Tooltip for Volume');
    });
  });

  describe('Integration with useIsInExportPage', () => {
    it('should call useIsInExportPage hook during loading', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(mockUseIsInExportPage).toHaveBeenCalled();
    });
  });

  describe('Key Generation', () => {
    it('should generate unique keys for items with same title', () => {
      const duplicateData: CategoryOverviewInterface[] = [
        { ...mockData[0], title: 'Same Title' },
        { ...mockData[1], title: 'Same Title' },
      ];

      render(
        <CategoryGrowthLevers
          data={duplicateData}
          error={null}
          loading={false}
        />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(2);
    });
  });

  describe('Complex Scenarios', () => {
    it('should prioritize loading state over error state', () => {
      const error = new Error('Test error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should prioritize loading state over data', () => {
      render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });

    it('should render with empty array', () => {
      render(<CategoryGrowthLevers data={[]} error={null} loading={false} />);

      expect(screen.getByTestId('styled-content')).toBeInTheDocument();
      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });

    it('should handle data with missing optional properties', () => {
      const minimalData: CategoryOverviewInterface[] = [
        {
          title: 'Minimal',
          versus: 'vs LY',
        },
      ];

      render(
        <CategoryGrowthLevers
          data={minimalData}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
    });

    it('should render multiple items with tooltips enabled', () => {
      const multipleItems: CategoryOverviewInterface[] = [
        { title: 'Item 1', versus: 'vs LY' },
        { title: 'Item 2', versus: 'vs LY' },
        { title: 'Item 3', versus: 'vs LY' },
        { title: 'Item 4', versus: 'vs LY' },
        { title: 'Item 5', versus: 'vs LY' },
      ];

      render(
        <CategoryGrowthLevers
          data={multipleItems}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(5);
    });
  });

  describe('Error Priority', () => {
    it('should show error when both error and empty data exist', () => {
      const error = new Error('Test error');

      render(
        <CategoryGrowthLevers
          data={{ empty: true }}
          error={error}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to data state', () => {
      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();

      rerender(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('category-overview')).toHaveLength(2);
    });

    it('should transition from loading to error state', () => {
      const error = new Error('Test error');

      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should transition from loading to empty state', () => {
      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(
        <CategoryGrowthLevers
          data={{ empty: true }}
          error={null}
          loading={false}
        />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should transition from data to loading state', () => {
      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.getAllByTestId('category-overview')).toHaveLength(2);

      rerender(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });

    it('should update data when props change', () => {
      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={false} />,
      );

      expect(screen.getAllByTestId('category-overview')).toHaveLength(2);

      const newData: CategoryOverviewInterface[] = [
        { title: 'NewItem1', versus: 'vs LY' },
        { title: 'NewItem2', versus: 'vs LY' },
        { title: 'NewItem3', versus: 'vs LY' },
      ];

      rerender(
        <CategoryGrowthLevers data={newData} error={null} loading={false} />,
      );

      expect(screen.getAllByTestId('category-overview')).toHaveLength(3);
      expect(screen.getByText('NewItem1')).toBeInTheDocument();
      expect(screen.getByText('NewItem2')).toBeInTheDocument();
      expect(screen.getByText('NewItem3')).toBeInTheDocument();
    });

    it('should toggle tooltip visibility on prop change', () => {
      const { rerender } = render(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      expect(screen.getAllByTestId('overview-tooltip')).toHaveLength(2);

      rerender(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={false}
        />,
      );

      expect(screen.queryByTestId('overview-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('FormatMessage Integration', () => {
    it('should call formatMessage with correct tooltip id pattern', () => {
      render(
        <CategoryGrowthLevers
          data={mockData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const tooltips = screen.getAllByTestId('overview-tooltip');
      expect(tooltips[0]).toHaveTextContent('Tooltip for Revenue');
      expect(tooltips[1]).toHaveTextContent('Tooltip for Volume');
    });

    it('should handle special characters in title for tooltip id', () => {
      const dataWithSpecialChars: CategoryOverviewInterface[] = [
        { title: 'Revenue-Growth', versus: 'vs LY' },
        { title: 'Volume_Share', versus: 'vs LY' },
      ];

      render(
        <CategoryGrowthLevers
          data={dataWithSpecialChars}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const tooltips = screen.getAllByTestId('overview-tooltip');
      expect(tooltips[0]).toHaveTextContent('Tooltip for Revenue-Growth');
      expect(tooltips[1]).toHaveTextContent('Tooltip for Volume_Share');
    });
  });

  describe('CategoryOverview Data Spreading', () => {
    it('should spread all original data properties to CategoryOverview', () => {
      const richData: CategoryOverviewInterface[] = [
        {
          title: 'ComplexItem',
          versus: 'vs LY',
          kpi: {
            header: [
              { id: 'mix', title: 'Mix' },
              { id: 'vsLy', title: 'vs LY' },
            ],
            rows: [
              {
                label: 'Row 1',
                mix: { value: 10, unitOfMeasure: '%' },
                vsLy: { value: 20, unitOfMeasure: '%', direction: 'up' },
              },
            ],
          },
        },
      ];

      render(
        <CategoryGrowthLevers
          data={richData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const overview = screen.getByTestId('category-overview');
      expect(overview).toHaveAttribute('data-title', 'ComplexItem');
    });
  });

  describe('Export page skeleton width variations', () => {
    it('should maintain correct width through multiple renders', () => {
      mockUseIsInExportPage.mockReturnValue(false);

      const { rerender } = render(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toHaveAttribute(
        'data-width',
        '241px',
      );

      mockUseIsInExportPage.mockReturnValue(true);

      rerender(
        <CategoryGrowthLevers data={mockData} error={null} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toHaveAttribute(
        'data-width',
        '311px',
      );
    });
  });

  describe('Empty Edge Cases', () => {
    it('should treat empty: false as valid data', () => {
      const dataWithEmptyFalse = [
        { title: 'ValidItem', versus: 'vs LY' },
      ] as CategoryOverviewInterface[];

      render(
        <CategoryGrowthLevers
          data={dataWithEmptyFalse}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should render ErrorMessage when data object has empty: true', () => {
      render(
        <CategoryGrowthLevers
          data={{ empty: true }}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('styled-content')).not.toBeInTheDocument();
    });
  });

  describe('Large Data Sets', () => {
    it('should render many CategoryOverview items efficiently', () => {
      const largeData: CategoryOverviewInterface[] = Array.from(
        { length: 20 },
        (_, index) => ({
          title: `Item ${index + 1}`,
          versus: 'vs LY',
        }),
      );

      render(
        <CategoryGrowthLevers
          data={largeData}
          error={null}
          loading={false}
          tooltip={true}
        />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(20);
    });
  });

  describe('Versus Property Variations', () => {
    it('should handle different versus values', () => {
      const dataWithDifferentVersus: CategoryOverviewInterface[] = [
        { title: 'Item1', versus: 'vs LY' },
        { title: 'Item2', versus: 'vs PY' },
        { title: 'Item3', versus: 'vs Budget' },
      ];

      render(
        <CategoryGrowthLevers
          data={dataWithDifferentVersus}
          error={null}
          loading={false}
        />,
      );

      const overviews = screen.getAllByTestId('category-overview');
      expect(overviews).toHaveLength(3);
    });

    it('should handle undefined versus property', () => {
      const dataWithoutVersus: CategoryOverviewInterface[] = [
        { title: 'ItemWithoutVersus' } as CategoryOverviewInterface,
      ];

      render(
        <CategoryGrowthLevers
          data={dataWithoutVersus}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
    });
  });

  describe('Error Types', () => {
    it('should handle TypeError', () => {
      const error = new TypeError('Type error occurred');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should handle custom Error', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      const error = new CustomError('Custom error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  describe('KPI Structure Variations', () => {
    it('should handle data with complex KPI structure', () => {
      const complexKpiData: CategoryOverviewInterface[] = [
        {
          title: 'ComplexKPI',
          versus: 'vs LY',
          kpi: {
            header: [
              { id: 'mix', title: 'Mix' },
              { id: 'vsLy', title: 'vs LY' },
            ],
            rows: [
              {
                label: 'Total',
                mix: { value: 100, unitOfMeasure: '%' },
                vsLy: { value: 5, unitOfMeasure: '%', direction: 'up' },
              },
              {
                label: 'Subtotal',
                mix: { value: 50, unitOfMeasure: '%' },
                vsLy: { value: 10, unitOfMeasure: '%', direction: 'up' },
              },
            ],
          },
        },
      ];

      render(
        <CategoryGrowthLevers
          data={complexKpiData}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
    });

    it('should handle data with empty KPI rows', () => {
      const emptyRowsData: CategoryOverviewInterface[] = [
        {
          title: 'EmptyRows',
          versus: 'vs LY',
          kpi: {
            header: [{ id: 'mix', title: 'Mix' }],
            rows: [],
          },
        },
      ];

      render(
        <CategoryGrowthLevers
          data={emptyRowsData}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
    });

    it('should handle data with empty KPI header', () => {
      const emptyHeaderData: CategoryOverviewInterface[] = [
        {
          title: 'EmptyHeader',
          versus: 'vs LY',
          kpi: {
            header: [],
            rows: [],
          },
        },
      ];

      render(
        <CategoryGrowthLevers
          data={emptyHeaderData}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('category-overview')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering Order', () => {
    it('should check loading before error', () => {
      const error = new Error('Error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should check error before data validation', () => {
      const error = new Error('Error');

      render(
        <CategoryGrowthLevers data={mockData} error={error} loading={false} />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('category-overview')).not.toBeInTheDocument();
    });

    it('should check data existence before empty property', () => {
      render(
        <CategoryGrowthLevers
          data={null as any}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});
