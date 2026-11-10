import React from 'react';

import { render, screen } from '@testing-library/react';

import { PortfolioPerformanceSlideContent } from './PortfolioPerformanceSlideContent';

jest.mock('components', () => ({
  DataStateHandler: ({
    loading,
    error,
    empty,
    children,
    skeletonProps,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'data-state-handler'}>
      <div data-testid="dsh-loading">{String(loading)}</div>
      <div data-testid="dsh-error">{String(!!error)}</div>
      <div data-testid="dsh-empty">{String(empty)}</div>
      <div data-testid="dsh-skeleton">{JSON.stringify(skeletonProps)}</div>
      {children}
    </div>
  ),
}));

jest.mock('../../PortfolioTable', () => ({
  PortfolioTable: ({ data, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'portfolio-table'}>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

jest.mock('../../PorfolioFooter', () => ({
  PortfolioFooter: ({ data, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'portfolio-footer'}>
      <div data-testid="footer-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

jest.mock('./PortfolioPerformanceSlideContent.styles', () => ({
  StyledMainContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'main-container'}>{children}</div>
  ),
  StyledPortfolioPerformanceSliderGrid: ({ children }: any) => (
    <div data-testid="portfolio-slider-grid">{children}</div>
  ),
}));

describe('PortfolioPerformanceSlideContent', () => {
  const mockData = {
    portfolioTableKpiData: {
      loading: false,
      error: null,
      kpiData: {
        table: {
          header: [
            { id: 'portfolio', title: 'Portfolio' },
            { id: 'mtd', title: 'MTD' },
          ],
          rows: [
            [
              { portfolio: { value: 'Portfolio 1' }, mtd: { value: 100 } },
              { portfolio: { value: 'Portfolio 2' }, mtd: { value: 200 } },
            ],
          ],
        },
        footer: [
          {
            portfolio: { title: 'Total', subtitle: 'All portfolios' },
            month: {
              value: 300,
              comparison: 'vs LY',
              measure: '%',
              variationDirection: 'green',
            },
            l3m: {
              value: 400,
              comparison: 'vs PY',
              measure: 'pp',
              variationDirection: 'red',
            },
            ytd: {
              value: 500,
              comparison: 'vs Target',
              measure: 'M',
              variationDirection: 'blue',
            },
          },
        ],
        empty: false,
      },
    },
  } as any;

  const defaultProps = {
    data: mockData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render main container', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
    });

    it('should render two portfolio slider grids', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const grids = screen.getAllByTestId('portfolio-slider-grid');
      expect(grids).toHaveLength(2);
    });

    it('should render two DataStateHandler components', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const handlers = screen.getAllByTestId('data-state-handler');
      expect(handlers).toHaveLength(2);
    });

    it('should render PortfolioTable', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(screen.getByTestId('portfolio-table')).toBeInTheDocument();
    });

    it('should render PortfolioFooter', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(screen.getByTestId('portfolio-footer')).toBeInTheDocument();
    });
  });

  describe('PortfolioTable DataStateHandler Props', () => {
    it('should pass loading state to table DataStateHandler', () => {
      const dataWithLoading = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          loading: true,
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithLoading} />);

      const loadings = screen.getAllByTestId('dsh-loading');
      expect(loadings[0].textContent).toBe('true');
    });

    it('should pass error to table DataStateHandler', () => {
      const dataWithError = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          error: new Error('Test Error'),
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithError} />);

      const errors = screen.getAllByTestId('dsh-error');
      expect(errors[0].textContent).toBe('true');
    });

    it('should pass empty state to table DataStateHandler', () => {
      const dataWithEmpty = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { ...mockData.portfolioTableKpiData.kpiData, empty: true },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmpty} />);

      const empties = screen.getAllByTestId('dsh-empty');
      expect(empties[0].textContent).toBe('true');
    });

    it('should pass correct skeletonProps to table DataStateHandler', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const tableSkeleton = JSON.parse(skeletons[0].textContent || '{}');

      expect(tableSkeleton.height).toBe('560px');
      expect(tableSkeleton.width).toBe('1349px');
      expect(tableSkeleton.length).toBe(1);
      expect(tableSkeleton.borderRadius).toBe('medium');
    });
  });

  describe('PortfolioFooter DataStateHandler Props', () => {
    it('should pass loading state to footer DataStateHandler', () => {
      const dataWithLoading = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          loading: true,
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithLoading} />);

      const loadings = screen.getAllByTestId('dsh-loading');
      expect(loadings[1].textContent).toBe('true');
    });

    it('should pass error to footer DataStateHandler', () => {
      const dataWithError = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          error: new Error('Test Error'),
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithError} />);

      const errors = screen.getAllByTestId('dsh-error');
      expect(errors[1].textContent).toBe('true');
    });

    it('should pass empty state to footer DataStateHandler', () => {
      const dataWithEmpty = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { ...mockData.portfolioTableKpiData.kpiData, empty: true },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmpty} />);

      const empties = screen.getAllByTestId('dsh-empty');
      expect(empties[1].textContent).toBe('true');
    });

    it('should pass correct skeletonProps to footer DataStateHandler', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const footerSkeleton = JSON.parse(skeletons[1].textContent || '{}');

      expect(footerSkeleton.height).toBe('160px');
      expect(footerSkeleton.width).toBe('1349px');
      expect(footerSkeleton.length).toBe(1);
      expect(footerSkeleton.borderRadius).toBe('medium');
    });
  });

  describe('PortfolioTable Props', () => {
    it('should pass table data to PortfolioTable', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData.textContent).toContain('Portfolio 1');
    });

    it('should pass complete table structure to PortfolioTable', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const tableData = screen.getByTestId('table-data');
      const parsedData = JSON.parse(tableData.textContent || '{}');

      expect(parsedData.header).toBeDefined();
      expect(parsedData.rows).toBeDefined();
      expect(parsedData.header).toHaveLength(2);
    });

    it('should handle missing table data', () => {
      const dataWithoutTable = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { empty: false },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithoutTable} />);

      expect(screen.getByTestId('portfolio-table')).toBeInTheDocument();
    });
  });

  describe('PortfolioFooter Props', () => {
    it('should pass footer data to PortfolioFooter', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const footerData = screen.getByTestId('footer-data');
      expect(footerData.textContent).toContain('Total');
    });

    it('should pass complete footer structure to PortfolioFooter', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const footerData = screen.getByTestId('footer-data');
      const parsedData = JSON.parse(footerData.textContent || '[]');

      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].portfolio).toBeDefined();
      expect(parsedData[0].month).toBeDefined();
      expect(parsedData[0].l3m).toBeDefined();
      expect(parsedData[0].ytd).toBeDefined();
    });

    it('should handle missing footer data', () => {
      const dataWithoutFooter = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { table: mockData.portfolioTableKpiData.kpiData.table },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithoutFooter} />);

      expect(screen.getByTestId('portfolio-footer')).toBeInTheDocument();
    });
  });

  describe('DataStateHandler Shares Same States', () => {
    it('should use same loading state for both handlers', () => {
      const dataWithLoading = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          loading: true,
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithLoading} />);

      const loadings = screen.getAllByTestId('dsh-loading');
      expect(loadings[0].textContent).toBe('true');
      expect(loadings[1].textContent).toBe('true');
    });

    it('should use same error state for both handlers', () => {
      const dataWithError = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          error: new Error('Test Error'),
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithError} />);

      const errors = screen.getAllByTestId('dsh-error');
      expect(errors[0].textContent).toBe('true');
      expect(errors[1].textContent).toBe('true');
    });

    it('should use same empty state for both handlers', () => {
      const dataWithEmpty = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { ...mockData.portfolioTableKpiData.kpiData, empty: true },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmpty} />);

      const empties = screen.getAllByTestId('dsh-empty');
      expect(empties[0].textContent).toBe('true');
      expect(empties[1].textContent).toBe('true');
    });
  });

  describe('Skeleton Props Differences', () => {
    it('should have different skeleton heights for table and footer', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const tableSkeleton = JSON.parse(skeletons[0].textContent || '{}');
      const footerSkeleton = JSON.parse(skeletons[1].textContent || '{}');

      expect(tableSkeleton.height).toBe('560px');
      expect(footerSkeleton.height).toBe('160px');
    });

    it('should have same skeleton width for table and footer', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const tableSkeleton = JSON.parse(skeletons[0].textContent || '{}');
      const footerSkeleton = JSON.parse(skeletons[1].textContent || '{}');

      expect(tableSkeleton.width).toBe('1349px');
      expect(footerSkeleton.width).toBe('1349px');
    });

    it('should have same skeleton length for table and footer', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const tableSkeleton = JSON.parse(skeletons[0].textContent || '{}');
      const footerSkeleton = JSON.parse(skeletons[1].textContent || '{}');

      expect(tableSkeleton.length).toBe(1);
      expect(footerSkeleton.length).toBe(1);
    });

    it('should have same skeleton borderRadius for table and footer', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const skeletons = screen.getAllByTestId('dsh-skeleton');
      const tableSkeleton = JSON.parse(skeletons[0].textContent || '{}');
      const footerSkeleton = JSON.parse(skeletons[1].textContent || '{}');

      expect(tableSkeleton.borderRadius).toBe('medium');
      expect(footerSkeleton.borderRadius).toBe('medium');
    });
  });

  describe('Container Structure', () => {
    it('should render StyledMainContainer as root', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
    });

    it('should render first grid with PortfolioTable', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const grids = screen.getAllByTestId('portfolio-slider-grid');
      const firstGrid = grids[0];

      expect(
        firstGrid.querySelector('[data-testid="portfolio-table"]'),
      ).toBeInTheDocument();
    });

    it('should render second grid with PortfolioFooter', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const grids = screen.getAllByTestId('portfolio-slider-grid');
      const secondGrid = grids[1];

      expect(
        secondGrid.querySelector('[data-testid="portfolio-footer"]'),
      ).toBeInTheDocument();
    });

    it('should wrap PortfolioTable in DataStateHandler', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const handlers = screen.getAllByTestId('data-state-handler');
      const firstHandler = handlers[0];

      expect(
        firstHandler.querySelector('[data-testid="portfolio-table"]'),
      ).toBeInTheDocument();
    });

    it('should wrap PortfolioFooter in DataStateHandler', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      const handlers = screen.getAllByTestId('data-state-handler');
      const secondHandler = handlers[1];

      expect(
        secondHandler.querySelector('[data-testid="portfolio-footer"]'),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing nested kpiData', () => {
      const partialData = {
        portfolioTableKpiData: {
          loading: false,
          error: null,
          kpiData: { empty: false },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={partialData} />);

      expect(screen.getByTestId('portfolio-table')).toBeInTheDocument();
      expect(screen.getByTestId('portfolio-footer')).toBeInTheDocument();
    });

    it('should handle null portfolioTableKpiData', () => {
      const dataWithNull = {
        portfolioTableKpiData: null,
      } as any;

      expect(() => {
        render(<PortfolioPerformanceSlideContent data={dataWithNull} />);
      }).toThrow();
    });

    it('should handle undefined data', () => {
      expect(() => {
        render(<PortfolioPerformanceSlideContent data={undefined as any} />);
      }).toThrow();
    });

    it('should handle empty table data', () => {
      const dataWithEmptyTable = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: {
            table: { header: [], rows: [] },
            footer: mockData.portfolioTableKpiData.kpiData.footer,
            empty: false,
          },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmptyTable} />);

      const tableData = screen.getByTestId('table-data');
      const parsedData = JSON.parse(tableData.textContent || '{}');

      expect(parsedData.header).toHaveLength(0);
      expect(parsedData.rows).toHaveLength(0);
    });

    it('should handle empty footer data', () => {
      const dataWithEmptyFooter = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: {
            table: mockData.portfolioTableKpiData.kpiData.table,
            footer: [],
            empty: false,
          },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmptyFooter} />);

      const footerData = screen.getByTestId('footer-data');
      const parsedData = JSON.parse(footerData.textContent || '[]');

      expect(parsedData).toHaveLength(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle loading state with all components', () => {
      const dataWithLoading = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          loading: true,
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithLoading} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
      expect(screen.getAllByTestId('dsh-loading')).toHaveLength(2);
      expect(screen.getByTestId('portfolio-table')).toBeInTheDocument();
      expect(screen.getByTestId('portfolio-footer')).toBeInTheDocument();
    });

    it('should handle error state with all components', () => {
      const dataWithError = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          error: new Error('Server Error'),
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithError} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
      const errors = screen.getAllByTestId('dsh-error');
      expect(errors[0].textContent).toBe('true');
      expect(errors[1].textContent).toBe('true');
    });

    it('should handle empty state with all components', () => {
      const dataWithEmpty = {
        portfolioTableKpiData: {
          ...mockData.portfolioTableKpiData,
          kpiData: { ...mockData.portfolioTableKpiData.kpiData, empty: true },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={dataWithEmpty} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
      const empties = screen.getAllByTestId('dsh-empty');
      expect(empties[0].textContent).toBe('true');
      expect(empties[1].textContent).toBe('true');
    });

    it('should render all components together successfully', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(screen.getByTestId('main-container')).toBeInTheDocument();
      expect(screen.getAllByTestId('portfolio-slider-grid')).toHaveLength(2);
      expect(screen.getAllByTestId('data-state-handler')).toHaveLength(2);
      expect(screen.getByTestId('portfolio-table')).toBeInTheDocument();
      expect(screen.getByTestId('portfolio-footer')).toBeInTheDocument();
    });

    it('should pass complex table data correctly', () => {
      const complexData = {
        portfolioTableKpiData: {
          loading: false,
          error: null,
          kpiData: {
            table: {
              header: [
                { id: 'col1', title: 'Column 1', subtitle: 'Subtitle 1' },
                { id: 'col2', title: 'Column 2', tooltip: true },
                { id: 'col3', title: 'Column 3' },
              ],
              rows: [
                [
                  {
                    col1: { value: 'Value 1', prefix: '$' },
                    col2: { value: 100, variation: 10 },
                    col3: { value: 'Text' },
                  },
                ],
              ],
            },
            footer: mockData.portfolioTableKpiData.kpiData.footer,
            empty: false,
          },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={complexData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData.textContent).toContain('Column 1');
      expect(tableData.textContent).toContain('Subtitle 1');
    });

    it('should pass complex footer data correctly', () => {
      const complexFooterData = {
        portfolioTableKpiData: {
          loading: false,
          error: null,
          kpiData: {
            table: mockData.portfolioTableKpiData.kpiData.table,
            footer: [
              {
                portfolio: { title: 'Total 1', subtitle: 'Sub 1' },
                month: { value: 100, comparison: 'vs LY', measure: '%' },
                l3m: { value: 200, comparison: 'vs PY', measure: 'pp' },
                ytd: { value: 300, comparison: 'vs Target', measure: 'M' },
              },
              {
                portfolio: { title: 'Total 2', subtitle: 'Sub 2' },
                month: { value: 150, comparison: 'vs LY', measure: '%' },
                l3m: { value: 250, comparison: 'vs PY', measure: 'pp' },
                ytd: { value: 350, comparison: 'vs Target', measure: 'M' },
              },
            ],
            empty: false,
          },
        },
      } as any;

      render(<PortfolioPerformanceSlideContent data={complexFooterData} />);

      const footerData = screen.getByTestId('footer-data');
      const parsedData = JSON.parse(footerData.textContent || '[]');

      expect(parsedData).toHaveLength(2);
      expect(parsedData[0].portfolio.title).toBe('Total 1');
      expect(parsedData[1].portfolio.title).toBe('Total 2');
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid on root and children when dataTestId is provided', () => {
      render(
        <PortfolioPerformanceSlideContent
          {...defaultProps}
          dataTestId="portfolio-perf"
        />,
      );

      const rootElements = screen.getAllByTestId(
        'portfolio-performance-slide-content-portfolio-perf',
      );
      expect(rootElements.length).toBeGreaterThanOrEqual(1);
      expect(rootElements[0]).toBeInTheDocument();

      const tableHandlers = screen.getAllByTestId(
        'portfolio-performance-slide-content-portfolio-table-portfolio-perf',
      );
      expect(tableHandlers.length).toBeGreaterThanOrEqual(1);
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<PortfolioPerformanceSlideContent {...defaultProps} />);

      expect(
        screen.queryByTestId('portfolio-performance-slide-content-'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('main-container')).toBeInTheDocument();
    });
  });
});
