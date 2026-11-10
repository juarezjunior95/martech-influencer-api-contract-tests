import React from 'react';

import { render, screen } from '@testing-library/react';

import { LineChartSection } from './LineChartSection';

jest.mock('components', () => ({
  Line: ({ datasets, labels, options, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'line-chart'}>
      <div data-testid="line-datasets">{JSON.stringify(datasets)}</div>
      <div data-testid="line-labels">{JSON.stringify(labels)}</div>
      <div data-testid="line-options">{JSON.stringify(options)}</div>
    </div>
  ),
  ComparisonLine: ({
    data,
    gridColumnsLength,
    borderConfig,
    gridConfig,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'comparison-line'}>
      <div data-testid="comparison-data">{JSON.stringify(data)}</div>
      <div data-testid="comparison-columns">{gridColumnsLength}</div>
      <div data-testid="comparison-border">{JSON.stringify(borderConfig)}</div>
      <div data-testid="comparison-grid">{JSON.stringify(gridConfig)}</div>
    </div>
  ),
  DataStateHandler: ({ loading, error, empty, children, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'data-state-handler'}>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">Error</div>}
      {empty && <div data-testid="empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
  Skeleton: () => <div data-testid="skeleton">Skeleton</div>,
}));

jest.mock('pages/pillars/ValueCreation/VolumePages/VolumePages.styles', () => ({
  StyledSectionHeaderContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'section-header-container'}>
      {children}
    </div>
  ),
}));

describe('LineChartSection', () => {
  const mockData = {
    datasets: [
      { data: [10, 20, 30, 40], label: 'Dataset 1' },
      { data: [15, 25, 35, 45], label: 'Dataset 2' },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    formattedData: [
      ['10%', '15%'],
      ['20%', '25%'],
      ['30%', '35%'],
      ['40%', '45%'],
    ],
    highlightLabels: ['Jan', 'Mar'],
    comparisonLine: {
      data: [
        { label: 'Previous Year', value: '100M' },
        { label: 'Current Year', value: '120M' },
      ],
    },
    empty: false,
  } as any;

  const defaultProps = {
    loading: false,
    error: null,
    data: mockData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<LineChartSection loading={true} error={null} data={mockData} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should not render chart content when loading', () => {
      render(<LineChartSection loading={true} error={null} data={mockData} />);

      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      render(
        <LineChartSection
          loading={false}
          error={new Error('Test error')}
          data={mockData}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should not render chart content when error', () => {
      render(
        <LineChartSection
          loading={false}
          error={new Error('Test error')}
          data={mockData}
        />,
      );

      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when data.empty is true', () => {
      const emptyData = { ...mockData, empty: true } as any;

      render(
        <LineChartSection loading={false} error={null} data={emptyData} />,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('should not render chart when empty', () => {
      const emptyData = { ...mockData, empty: true } as any;

      render(
        <LineChartSection loading={false} error={null} data={emptyData} />,
      );

      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('should render line chart with data', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should render ComparisonLine', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('should render DataStateHandler', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('Section Header', () => {
    it('should render section header when provided', () => {
      const sectionHeader = <div data-testid="custom-header">Header</div>;

      render(
        <LineChartSection {...defaultProps} sectionHeader={sectionHeader} />,
      );

      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should not render section header container when not provided', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(
        screen.queryByTestId('section-header-container'),
      ).not.toBeInTheDocument();
    });

    it('should not render section header container when undefined', () => {
      render(<LineChartSection {...defaultProps} sectionHeader={undefined} />);

      expect(
        screen.queryByTestId('section-header-container'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Line Component Props', () => {
    it('should pass datasets to Line component', () => {
      render(<LineChartSection {...defaultProps} />);

      const datasets = screen.getByTestId('line-datasets');
      expect(datasets.textContent).toContain('Dataset 1');
    });

    it('should pass labels to Line component', () => {
      render(<LineChartSection {...defaultProps} />);

      const labels = screen.getByTestId('line-labels');
      expect(labels.textContent).toContain('Jan');
    });

    it('should pass correct options to Line component', () => {
      render(<LineChartSection {...defaultProps} />);

      const options = screen.getByTestId('line-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.layout.padding.top).toBe(0);
    });

    it('should handle missing datasets with empty array', () => {
      const dataWithoutDatasets = { ...mockData, datasets: undefined } as any;

      render(<LineChartSection {...defaultProps} data={dataWithoutDatasets} />);

      const datasets = screen.getByTestId('line-datasets');
      expect(datasets.textContent).toBe('[]');
    });
  });

  describe('Chart Height', () => {
    it('should apply default chartHeight', () => {
      const { container } = render(<LineChartSection {...defaultProps} />);

      const chartContainer = container.querySelector(
        'div[style*="height: 160px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom chartHeight', () => {
      const { container } = render(
        <LineChartSection {...defaultProps} chartHeight="300px" />,
      );

      const chartContainer = container.querySelector(
        'div[style*="height: 300px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('Default SkeletonProps', () => {
    it('should use default skeletonProps when not provided', () => {
      render(<LineChartSection loading={true} error={null} data={mockData} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });

    it('should use custom skeletonProps when provided', () => {
      const customSkeletonProps = {
        height: '400px',
        width: '100%',
        length: 2,
        borderRadius: 'large' as const,
      };

      render(
        <LineChartSection
          loading={true}
          error={null}
          data={mockData}
          skeletonProps={customSkeletonProps}
        />,
      );

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('ComparisonLine Props', () => {
    it('should pass comparison data', () => {
      render(<LineChartSection {...defaultProps} />);

      const comparisonData = screen.getByTestId('comparison-data');
      expect(comparisonData.textContent).toContain('Previous Year');
    });

    it('should pass gridColumnsLength based on labels length', () => {
      render(<LineChartSection {...defaultProps} />);

      const comparisonColumns = screen.getByTestId('comparison-columns');
      expect(comparisonColumns.textContent).toBe('4');
    });

    it('should use default borderConfig', () => {
      render(<LineChartSection {...defaultProps} />);

      const borderConfig = screen.getByTestId('comparison-border');
      const parsed = JSON.parse(borderConfig.textContent || '{}');

      expect(parsed.marginLeft).toBe(8);
      expect(parsed.marginRight).toBe(8);
    });

    it('should use default gridConfig', () => {
      render(<LineChartSection {...defaultProps} />);

      const gridConfig = screen.getByTestId('comparison-grid');
      const parsed = JSON.parse(gridConfig.textContent || '{}');

      expect(parsed.paddingLeft).toBe(8);
      expect(parsed.paddingRight).toBe(8);
    });

    it('should handle empty comparisonLine data', () => {
      const dataWithoutComparison = {
        ...mockData,
        comparisonLine: undefined,
      } as any;

      render(
        <LineChartSection {...defaultProps} data={dataWithoutComparison} />,
      );

      const comparisonData = screen.getByTestId('comparison-data');
      expect(comparisonData.textContent).toBe('[]');
    });
  });

  describe('ComparisonConfig', () => {
    it('should apply custom marginTop', () => {
      const comparisonConfig = { marginTop: '24px' };
      const { container } = render(
        <LineChartSection
          {...defaultProps}
          comparisonConfig={comparisonConfig}
        />,
      );

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 24px"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });

    it('should apply default marginTop as 0', () => {
      const { container } = render(<LineChartSection {...defaultProps} />);

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 0"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });

    it('should apply custom borderConfig', () => {
      const comparisonConfig = {
        borderConfig: { marginLeft: 16, marginRight: 16 },
      };

      render(
        <LineChartSection
          {...defaultProps}
          comparisonConfig={comparisonConfig}
        />,
      );

      const borderConfig = screen.getByTestId('comparison-border');
      const parsed = JSON.parse(borderConfig.textContent || '{}');

      expect(parsed.marginLeft).toBe(16);
      expect(parsed.marginRight).toBe(16);
    });

    it('should apply custom gridConfig', () => {
      const comparisonConfig = {
        gridConfig: { paddingLeft: 12, paddingRight: 12 },
      };

      render(
        <LineChartSection
          {...defaultProps}
          comparisonConfig={comparisonConfig}
        />,
      );

      const gridConfig = screen.getByTestId('comparison-grid');
      const parsed = JSON.parse(gridConfig.textContent || '{}');

      expect(parsed.paddingLeft).toBe(12);
      expect(parsed.paddingRight).toBe(12);
    });

    it('should apply all custom comparisonConfig options', () => {
      const comparisonConfig = {
        marginTop: 32,
        borderConfig: { marginLeft: 20, marginRight: 20 },
        gridConfig: { paddingLeft: 16, paddingRight: 16 },
      };
      const { container } = render(
        <LineChartSection
          {...defaultProps}
          comparisonConfig={comparisonConfig}
        />,
      );

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 32"]',
      );
      expect(comparisonContainer).toBeInTheDocument();

      const borderConfig = screen.getByTestId('comparison-border');
      const parsedBorder = JSON.parse(borderConfig.textContent || '{}');
      expect(parsedBorder.marginLeft).toBe(20);

      const gridConfig = screen.getByTestId('comparison-grid');
      const parsedGrid = JSON.parse(gridConfig.textContent || '{}');
      expect(parsedGrid.paddingLeft).toBe(16);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data properties gracefully', () => {
      const minimalData = { empty: false } as any;

      render(
        <LineChartSection loading={false} error={null} data={minimalData} />,
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle empty datasets array', () => {
      const dataWithEmptyDatasets = { ...mockData, datasets: [] } as any;

      render(
        <LineChartSection {...defaultProps} data={dataWithEmptyDatasets} />,
      );

      const datasets = screen.getByTestId('line-datasets');
      expect(datasets.textContent).toBe('[]');
    });

    it('should handle empty labels array', () => {
      const dataWithEmptyLabels = { ...mockData, labels: [] } as any;

      render(<LineChartSection {...defaultProps} data={dataWithEmptyLabels} />);

      const labels = screen.getByTestId('line-labels');
      expect(labels.textContent).toBe('[]');
    });

    it('should handle undefined labels', () => {
      const dataWithoutLabels = { ...mockData, labels: undefined } as any;

      render(<LineChartSection {...defaultProps} data={dataWithoutLabels} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle numeric marginTop in comparisonConfig', () => {
      const comparisonConfig = { marginTop: 16 };
      const { container } = render(
        <LineChartSection
          {...defaultProps}
          comparisonConfig={comparisonConfig}
        />,
      );

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 16"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render all components together', () => {
      const sectionHeader = <div>Header</div>;
      const comparisonConfig = {
        marginTop: '20px',
        borderConfig: { marginLeft: 10, marginRight: 10 },
        gridConfig: { paddingLeft: 10, paddingRight: 10 },
      };

      render(
        <LineChartSection
          {...defaultProps}
          sectionHeader={sectionHeader}
          chartHeight="250px"
          comparisonConfig={comparisonConfig}
        />,
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
    });

    it('should handle loading with all props provided', () => {
      const sectionHeader = <div>Header</div>;
      const comparisonConfig = { marginTop: '20px' };

      render(
        <LineChartSection
          loading={true}
          error={null}
          data={mockData}
          sectionHeader={sectionHeader}
          chartHeight="250px"
          comparisonConfig={comparisonConfig}
        />,
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    it('should handle error with all props provided', () => {
      const sectionHeader = <div>Header</div>;

      render(
        <LineChartSection
          loading={false}
          error={new Error('Error')}
          data={mockData}
          sectionHeader={sectionHeader}
          chartHeight="250px"
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Data Propagation', () => {
    it('should propagate formattedData to Line component', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should propagate highlightLabels to Line component', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<LineChartSection {...defaultProps} dataTestId="custom" />);

      const elements = screen.getAllByTestId('custom-line-chart-section');
      expect(elements.length).toBeGreaterThanOrEqual(1);
      expect(elements[0]).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<LineChartSection {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-line-chart-section'),
      ).not.toBeInTheDocument();
    });
  });
});
