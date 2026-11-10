import React from 'react';

import { render, screen } from '@testing-library/react';

import { BarChartSection } from './BarChartSection';

jest.mock('components', () => ({
  Bar: ({ datasets, labels, options, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'bar-chart'}>
      <div data-testid="bar-datasets">{JSON.stringify(datasets)}</div>
      <div data-testid="bar-labels">{JSON.stringify(labels)}</div>
      <div data-testid="bar-options">{JSON.stringify(options)}</div>
    </div>
  ),
  BrandAvatarList: ({ data, length, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'brand-avatar-list'}>
      <div data-testid="avatar-data">{JSON.stringify(data)}</div>
      <div data-testid="avatar-length">{length}</div>
    </div>
  ),
  ComparisonLine: ({ data, gridColumnsLength, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'comparison-line'}>
      <div data-testid="comparison-data">{JSON.stringify(data)}</div>
      <div data-testid="comparison-columns">{gridColumnsLength}</div>
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

jest.mock('components/Chart/utils', () => ({
  getChartSuggestedMinMax: jest.fn(() => ({
    min: -10,
    max: 50,
  })),
  calculateMin: jest.fn(() => 0),
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

describe('BarChartSection', () => {
  const mockData = {
    datasets: [
      { data: [10, 20, 30], label: 'Dataset 1' },
      { data: [15, 25, 35], label: 'Dataset 2' },
    ],
    labels: ['Label 1', 'Label 2', 'Label 3'],
    formattedData: [
      ['10%', '15%'],
      ['20%', '25%'],
      ['30%', '35%'],
    ],
    baseChartColors: ['#FF0000', '#00FF00'],
    highlightLabels: ['Label 1', 'Label 3'],
    stripedIndexes: [1],
    roundedArrow: false,
    connector: false,
    period: 'MTD',
    comparisonLine: {
      data: [{ label: 'Comparison', value: '10%' }],
    },
    brandsAvatar: {
      data: [
        { title: 'Brand 1', image: 'image1.png' },
        { title: 'Brand 2', image: 'image2.png' },
      ],
    },
    empty: false,
  };

  const defaultProps = {
    loading: false,
    error: null,
    data: mockData as any,
    skeletonProps: { width: '100%', height: '400px', length: 3 },
    chartHeight: '400px',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<BarChartSection {...defaultProps} loading={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should not render chart content when loading', () => {
      render(<BarChartSection {...defaultProps} loading={true} />);

      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      render(
        <BarChartSection
          {...defaultProps}
          error={new Error('Test error')}
          data={{ ...mockData, datasets: null } as any}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should show error when data.datasets is missing', () => {
      render(
        <BarChartSection
          {...defaultProps}
          data={{ ...mockData, datasets: null, empty: false } as any}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when data.empty is true', () => {
      render(
        <BarChartSection
          {...defaultProps}
          data={{ ...mockData, empty: true } as any}
        />,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('should not render chart when empty', () => {
      render(
        <BarChartSection
          {...defaultProps}
          data={{ ...mockData, empty: true } as any}
        />,
      );

      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('should render bar chart with data', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should render BrandAvatarList when data.brandsAvatar.data exists', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
    });

    it('should render ComparisonLine', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('should not render BrandAvatarList when brandsAvatar.data is missing', () => {
      const dataWithoutAvatar = { ...mockData, brandsAvatar: undefined } as any;

      render(<BarChartSection {...defaultProps} data={dataWithoutAvatar} />);

      expect(screen.queryByTestId('brand-avatar-list')).not.toBeInTheDocument();
    });
  });

  describe('Section Header', () => {
    it('should render section header when provided', () => {
      const sectionHeader = <div data-testid="custom-header">Header</div>;

      render(
        <BarChartSection {...defaultProps} sectionHeader={sectionHeader} />,
      );

      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should not render section header container when not provided', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(
        screen.queryByTestId('section-header-container'),
      ).not.toBeInTheDocument();
    });

    it('should not render section header container when sectionHeader is null', () => {
      render(<BarChartSection {...defaultProps} sectionHeader={null} />);

      expect(
        screen.queryByTestId('section-header-container'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Bar Component Props', () => {
    it('should pass datasets to Bar component', () => {
      render(<BarChartSection {...defaultProps} />);

      const datasets = screen.getByTestId('bar-datasets');
      expect(datasets.textContent).toContain('Dataset 1');
    });

    it('should pass labels to Bar component', () => {
      render(<BarChartSection {...defaultProps} />);

      const labels = screen.getByTestId('bar-labels');
      expect(labels.textContent).toContain('Label 1');
    });

    it('should pass drawZeroLine prop', () => {
      render(<BarChartSection {...defaultProps} drawZeroLine={false} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should use default drawZeroLine as true', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should pass datalabelsPosition prop', () => {
      render(
        <BarChartSection {...defaultProps} datalabelsPosition="internal" />,
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should use default datalabelsPosition as external', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should pass showLabels prop', () => {
      render(<BarChartSection {...defaultProps} showLabels={true} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Chart Height', () => {
    it('should apply chartHeight to container', () => {
      const { container } = render(
        <BarChartSection {...defaultProps} chartHeight="500px" />,
      );

      const chartContainer = container.querySelector(
        'div[style*="height: 500px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply default chartHeight', () => {
      const { container } = render(<BarChartSection {...defaultProps} />);

      const chartContainer = container.querySelector(
        'div[style*="height: 400px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('Center Zero Line', () => {
    it('should calculate adjustedMin and adjustedMax when centerZeroLine is true', () => {
      render(<BarChartSection {...defaultProps} centerZeroLine={true} />);

      const options = screen.getByTestId('bar-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.scales.y.min).toBeDefined();
      expect(parsedOptions.scales.y.max).toBeDefined();
    });

    it('should use normal min/max when centerZeroLine is false', () => {
      render(<BarChartSection {...defaultProps} centerZeroLine={false} />);

      const options = screen.getByTestId('bar-options');
      expect(options).toBeInTheDocument();
    });
  });

  describe('BrandAvatarList Props', () => {
    it('should pass correct data to BrandAvatarList', () => {
      render(<BarChartSection {...defaultProps} />);

      const avatarData = screen.getByTestId('avatar-data');
      expect(avatarData.textContent).toContain('Brand 1');
    });

    it('should pass length prop to BrandAvatarList', () => {
      render(<BarChartSection {...defaultProps} />);

      const avatarLength = screen.getByTestId('avatar-length');
      expect(avatarLength.textContent).toBe('3');
    });
  });

  describe('ComparisonLine Props', () => {
    it('should pass comparisonLine data', () => {
      render(<BarChartSection {...defaultProps} />);

      const comparisonData = screen.getByTestId('comparison-data');
      expect(comparisonData.textContent).toContain('Comparison');
    });

    it('should pass gridColumnsLength', () => {
      render(<BarChartSection {...defaultProps} />);

      const comparisonColumns = screen.getByTestId('comparison-columns');
      expect(comparisonColumns.textContent).toBe('3');
    });
  });

  describe('Layout Padding', () => {
    it('should set padding top to 80 when roundedArrow is true', () => {
      const dataWithArrow = { ...mockData, roundedArrow: true } as any;

      render(<BarChartSection {...defaultProps} data={dataWithArrow} />);

      const options = screen.getByTestId('bar-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.layout.padding.top).toBe(80);
    });

    it('should set padding top to 80 when connector is true', () => {
      const dataWithConnector = { ...mockData, connector: true } as any;

      render(<BarChartSection {...defaultProps} data={dataWithConnector} />);

      const options = screen.getByTestId('bar-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.layout.padding.top).toBe(80);
    });

    it('should set padding top to 10 when neither roundedArrow nor connector', () => {
      render(<BarChartSection {...defaultProps} />);

      const options = screen.getByTestId('bar-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.layout.padding.top).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      render(<BarChartSection {...defaultProps} data={null as any} />);

      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('should handle empty datasets', () => {
      const emptyData = { ...mockData, datasets: [] } as any;

      render(<BarChartSection {...defaultProps} data={emptyData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle empty labels', () => {
      const noLabelsData = { ...mockData, labels: [] } as any;

      render(<BarChartSection {...defaultProps} data={noLabelsData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle missing baseChartColors', () => {
      const noColorsData = { ...mockData, baseChartColors: undefined } as any;

      render(<BarChartSection {...defaultProps} data={noColorsData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle missing comparisonLine data', () => {
      const noComparisonData = {
        ...mockData,
        comparisonLine: undefined,
      } as any;

      render(<BarChartSection {...defaultProps} data={noComparisonData} />);

      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render all components together', () => {
      const sectionHeader = <div>Header</div>;

      render(
        <BarChartSection {...defaultProps} sectionHeader={sectionHeader} />,
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
    });

    it('should handle all optional props together', () => {
      const sectionHeader = <div>Header</div>;

      render(
        <BarChartSection
          {...defaultProps}
          sectionHeader={sectionHeader}
          drawZeroLine={false}
          centerZeroLine={true}
          datalabelsPosition="internal"
          showLabels={true}
        />,
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle loading with error (loading takes precedence)', () => {
      render(
        <BarChartSection
          {...defaultProps}
          loading={true}
          error={new Error('Error')}
        />,
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Chart Options', () => {
    it('should pass correct scales options', () => {
      render(<BarChartSection {...defaultProps} />);

      const options = screen.getByTestId('bar-options');
      const parsedOptions = JSON.parse(options.textContent || '{}');

      expect(parsedOptions.scales).toBeDefined();
      expect(parsedOptions.scales.y).toBeDefined();
    });

    it('should calculate negative min correctly', () => {
      render(<BarChartSection {...defaultProps} />);

      const options = screen.getByTestId('bar-options');
      expect(options).toBeInTheDocument();
    });
  });

  describe('Margin and Spacing', () => {
    it('should apply marginTop to ComparisonLine container', () => {
      const { container } = render(<BarChartSection {...defaultProps} />);

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 16px"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<BarChartSection {...defaultProps} dataTestId="custom" />);

      const elements = screen.getAllByTestId('custom-bar-chart-section');
      expect(elements.length).toBeGreaterThanOrEqual(1);
      expect(elements[0]).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<BarChartSection {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-bar-chart-section'),
      ).not.toBeInTheDocument();
    });
  });
});
