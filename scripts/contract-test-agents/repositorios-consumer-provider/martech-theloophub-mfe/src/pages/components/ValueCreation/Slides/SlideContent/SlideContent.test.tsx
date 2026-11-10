import { render, screen } from '@testing-library/react';

import { SlideContent } from './SlideContent';
import type { SlideContentData } from './types';

jest.mock('components', () => ({
  DataStateHandler: ({ loading, error, empty, children, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'data-state-handler'}>
      {loading && <div data-testid="dsh-loading">Loading</div>}
      {error && <div data-testid="dsh-error">Error</div>}
      {empty && <div data-testid="dsh-empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/components/Sections/BigNumbersSection',
  () => ({
    BigNumbersSection: ({ loading, error, data, dataTestId }: any) => (
      <div data-testid={dataTestId ?? 'big-numbers-section'}>
        <span data-testid="bn-loading">{String(loading)}</span>
        <span data-testid="bn-error">{String(!!error)}</span>
        <span data-testid="bn-data">{JSON.stringify(data)}</span>
      </div>
    ),
  }),
);

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/components/Sections/LineChartSection',
  () => ({
    LineChartSection: ({
      loading,
      error,
      data,
      chartHeight,
      sectionHeader,
      dataTestId,
    }: any) => (
      <div data-testid={dataTestId ?? 'line-chart-section'}>
        <span data-testid="line-loading">{String(loading)}</span>
        <span data-testid="line-error">{String(!!error)}</span>
        <span data-testid="line-data">{JSON.stringify(data)}</span>
        <span data-testid="line-height">{chartHeight}</span>
        {sectionHeader && <div data-testid="line-header">{sectionHeader}</div>}
      </div>
    ),
  }),
);

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: ({ period, legends }: any) => (
    <div data-testid="section-header">
      <span data-testid="header-period">{period}</span>
      <span data-testid="header-legends">{JSON.stringify(legends)}</span>
    </div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/components/ExportTable',
  () => ({
    ExportTable: ({
      data,
      headerHeight,
      rowHeight,
      tableHeight,
      dataTestId,
    }: any) => (
      <div
        data-testid={dataTestId ?? 'export-table'}
        data-header-height={headerHeight}
        data-row-height={rowHeight}
        data-table-height={tableHeight}
      >
        {JSON.stringify(data)}
      </div>
    ),
  }),
);

jest.mock('./SlideContent.styles', () => ({
  StyledSliderGrid: ({
    children,
    'data-testid': dataTestIdProp,
    style,
  }: any) => (
    <div
      data-testid={dataTestIdProp ?? 'slide-slider-grid'}
      data-style={JSON.stringify(style)}
    >
      {children}
    </div>
  ),
  StyledBigNumberContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'big-number-container'}>{children}</div>
  ),
  StyledLineChartContainer: ({ children }: any) => (
    <div data-testid="line-chart-container">{children}</div>
  ),
  StyledTables: ({ children, 'data-testid': dataTestIdProp }: any) => (
    <div data-testid={dataTestIdProp ?? 'slide-tables'}>{children}</div>
  ),
}));

describe('SlideContent', () => {
  const mockTableData = {
    header: [{ id: 'col1', title: 'Col 1' }],
    rows: [[{ col1: { value: 'x' } }]],
  };

  const defaultData: SlideContentData = {
    bigNumbersKpiData: [
      {
        data: [{ bigNumber: { value: 100 } }],
        header: { title: 'Total', period: 'YTD' },
      },
    ],
    lineChartKpiData: {
      labels: ['Q1', 'Q2'],
      datasets: [{ data: [10, 20] }],
      formattedData: [],
      period: 'YTD',
      legend: [],
    },
    prioritiesTableKpiData: mockTableData,
    portfolioTableKpiData: mockTableData,
    marketsTableKpiData: mockTableData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render grid, BigNumbersSection, LineChartSection and tables', () => {
      render(<SlideContent data={defaultData} />);

      expect(screen.getByTestId('slide-slider-grid')).toBeInTheDocument();
      expect(screen.getByTestId('big-numbers-section')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart-section')).toBeInTheDocument();
      expect(screen.getByTestId('slide-tables')).toBeInTheDocument();
    });

    it('should pass data to BigNumbersSection and LineChartSection', () => {
      render(<SlideContent data={defaultData} />);

      expect(screen.getByTestId('bn-data').textContent).toContain('Total');
      expect(screen.getByTestId('line-data').textContent).toContain('YTD');
    });

    it('should render all three ExportTables by default', () => {
      render(<SlideContent data={defaultData} />);

      const tables = screen.getAllByTestId('export-table');
      expect(tables).toHaveLength(3);
    });

    it('should render SectionHeader inside LineChartSection', () => {
      render(<SlideContent data={defaultData} />);

      expect(screen.getByTestId('line-header')).toBeInTheDocument();
      expect(screen.getByTestId('header-period')).toHaveTextContent('YTD');
    });
  });

  describe('Default Props', () => {
    it('should use default lineChartHeight for chart height', () => {
      render(<SlideContent data={defaultData} />);

      expect(screen.getByTestId('line-height')).toHaveTextContent('400px');
    });

    it('should dynamically calculate row heights and pass header heights to ExportTable', () => {
      render(<SlideContent data={defaultData} />);

      const tables = screen.getAllByTestId('export-table');
      expect(tables).toHaveLength(3);
      expect(tables[0]).toHaveAttribute('data-row-height', '193');
      expect(tables[0]).toHaveAttribute('data-header-height', '45');
      expect(tables[1]).toHaveAttribute('data-row-height', '193');
      expect(tables[1]).toHaveAttribute('data-header-height', '45');
      expect(tables[2]).toHaveAttribute('data-row-height', '193');
      expect(tables[2]).toHaveAttribute('data-header-height', '45');
    });

    it('should apply grid style with default tableHeight and lineChartHeight', () => {
      render(<SlideContent data={defaultData} />);

      const grid = screen.getByTestId('slide-slider-grid');
      expect(grid.dataset.style).toContain('400');
      expect(grid.dataset.style).toContain('223');
    });
  });

  describe('Custom Props', () => {
    it('should dynamically calculate row heights based on table data', () => {
      render(<SlideContent data={defaultData} />);

      const tables = screen.getAllByTestId('export-table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should pass custom header heights', () => {
      render(
        <SlideContent
          data={defaultData}
          prioritiesTableHeaderHeight={50}
          portfolioTableHeaderHeight={60}
        />,
      );

      const tables = screen.getAllByTestId('export-table');
      expect(tables[0]).toHaveAttribute('data-header-height', '50');
      expect(tables[1]).toHaveAttribute('data-header-height', '60');
    });

    it('should use custom lineChartHeight for chart height', () => {
      render(<SlideContent data={defaultData} lineChartHeight={350} />);

      expect(screen.getByTestId('line-height')).toHaveTextContent('350px');
    });

    it('should pass tableHeight to ExportTable', () => {
      render(<SlideContent data={defaultData} tableHeight={300} />);

      const tables = screen.getAllByTestId('export-table');
      expect(tables[0]).toHaveAttribute('data-table-height', '300');
      expect(tables[1]).toHaveAttribute('data-table-height', '300');
    });
  });

  describe('Table Visibility', () => {
    it('should hide priorities table when priorities data has no rows', () => {
      render(
        <SlideContent
          data={{
            ...defaultData,
            prioritiesTableKpiData: { header: [], rows: [] },
          }}
        />,
      );

      const tables = screen.getAllByTestId('export-table');
      expect(tables).toHaveLength(2);
    });

    it('should hide portfolio table when portfolio data has no rows', () => {
      render(
        <SlideContent
          data={{
            ...defaultData,
            portfolioTableKpiData: { header: [], rows: [] },
          }}
        />,
      );

      const tables = screen.getAllByTestId('export-table');
      expect(tables).toHaveLength(2);
    });

    it('should render only markets table when priorities and portfolio have no rows', () => {
      render(
        <SlideContent
          data={{
            ...defaultData,
            prioritiesTableKpiData: { header: [], rows: [] },
            portfolioTableKpiData: { header: [], rows: [] },
          }}
        />,
      );

      expect(screen.getByTestId('slide-tables')).toBeInTheDocument();
      expect(screen.queryAllByTestId('export-table')).toHaveLength(1);
    });
  });

  describe('Data States', () => {
    it('should pass loading prop to BigNumbersSection and LineChartSection', () => {
      render(<SlideContent data={defaultData} loading />);

      expect(screen.getByTestId('bn-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('line-loading')).toHaveTextContent('true');
    });

    it('should pass error prop to LineChartSection and DataStateHandler', () => {
      render(
        <SlideContent data={defaultData} error={new Error('Chart error')} />,
      );

      expect(screen.getByTestId('line-error')).toHaveTextContent('true');
      const errorHandlers = screen.getAllByTestId('dsh-error');
      expect(errorHandlers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('dataTestId', () => {
    it('should apply dataTestId to grid, container and tables', () => {
      render(<SlideContent data={defaultData} dataTestId="my-slide" />);

      expect(screen.getByTestId('slide-content-my-slide')).toBeInTheDocument();
      expect(
        screen.getByTestId('big-number-and-line-chart-my-slide'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('slide-content-tables-my-slide'),
      ).toBeInTheDocument();
    });

    it('should pass dataTestId to BigNumbersSection and LineChartSection', () => {
      render(<SlideContent data={defaultData} dataTestId="slide-a" />);

      const slideContentSections = screen.getAllByTestId(
        'slide-a-slide-content',
      );
      expect(slideContentSections).toHaveLength(2);
    });

    it('should not set data-testid on grid when dataTestId is not provided', () => {
      render(<SlideContent data={defaultData} />);

      expect(screen.getByTestId('slide-slider-grid')).toBeInTheDocument();
    });
  });

  describe('Undefined data', () => {
    it('should handle undefined data', () => {
      render(<SlideContent data={undefined as any} />);

      expect(screen.getByTestId('slide-slider-grid')).toBeInTheDocument();
      expect(screen.getByTestId('big-numbers-section')).toBeInTheDocument();
      expect(screen.getByTestId('bn-data')).toBeInTheDocument();
    });
  });
});
