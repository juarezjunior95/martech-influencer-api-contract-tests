import React from 'react';

import { render, screen } from '@testing-library/react';

import { WaterfallChartSection } from './WaterfallChartSection';

jest.mock('components', () => ({
  Waterfall: ({
    values,
    labels,
    formattedData,
    baseChartColors,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'waterfall-chart'}>
      <div data-testid="waterfall-values">{JSON.stringify(values)}</div>
      <div data-testid="waterfall-labels">{JSON.stringify(labels)}</div>
      <div data-testid="waterfall-formatted">
        {JSON.stringify(formattedData)}
      </div>
      <div data-testid="waterfall-base-chart-colors">
        {JSON.stringify(baseChartColors)}
      </div>
    </div>
  ),
  BrandAvatarList: ({
    data,
    length,
    borderConfig,
    gridConfig,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'brand-avatar-list'}>
      <div data-testid="avatar-data">{JSON.stringify(data)}</div>
      <div data-testid="avatar-length">{length}</div>
      <div data-testid="avatar-border">{JSON.stringify(borderConfig)}</div>
      <div data-testid="avatar-grid">{JSON.stringify(gridConfig)}</div>
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
  NoDataYet: () => <div data-testid="waterfall-no-data-yet">No data</div>,
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

describe('WaterfallChartSection', () => {
  const mockData = {
    values: [100, 50, -30, 120],
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    formattedData: ['100M', '50M', '-30M', '120M'],
    brandsAvatar: {
      data: [
        { title: 'Brand A', image: 'image-a.png' },
        { title: 'Brand B', image: 'image-b.png' },
      ],
    },
    comparisonLine: {
      data: [
        { label: 'Previous', value: '80M' },
        { label: 'Current', value: '120M' },
      ],
    },
    baseChartColors: ['Megabrands', 'Expansion', 'Sustain'],
    empty: false,
  } as any;

  const defaultProps = {
    loading: false,
    error: null,
    data: mockData,
    skeletonProps: { width: '100%', height: '300px', length: 1 },
    chartHeight: '400px',
    sectionHeader: <div data-testid="section-header">Header</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<WaterfallChartSection {...defaultProps} loading={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should not render chart content when loading', () => {
      render(<WaterfallChartSection {...defaultProps} loading={true} />);

      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      render(
        <WaterfallChartSection
          {...defaultProps}
          error={new Error('Test error')}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should not render chart content when error', () => {
      render(
        <WaterfallChartSection
          {...defaultProps}
          error={new Error('Test error')}
        />,
      );

      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show NoDataYet when data.empty is true (early return, not DataStateHandler empty)', () => {
      const emptyData = { ...mockData, empty: true } as any;

      render(<WaterfallChartSection {...defaultProps} data={emptyData} />);

      expect(screen.getByTestId('waterfall-no-data-yet')).toBeInTheDocument();
      expect(
        screen.queryByTestId('data-state-handler'),
      ).not.toBeInTheDocument();
    });

    it('should not render chart when empty', () => {
      const emptyData = { ...mockData, empty: true } as any;

      render(<WaterfallChartSection {...defaultProps} data={emptyData} />);

      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('should render waterfall chart with data', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });

    it('should render BrandAvatarList', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
    });

    it('should render ComparisonLine', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('should render DataStateHandler', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });

    it('should not render content when data is null', () => {
      render(<WaterfallChartSection {...defaultProps} data={null as any} />);

      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });

    it('should not render content when data is undefined', () => {
      render(
        <WaterfallChartSection {...defaultProps} data={undefined as any} />,
      );

      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });
  });

  describe('Section Header', () => {
    it('should render section header when data is present', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('section-header')).toBeInTheDocument();
    });

    it('should render custom section header', () => {
      const customHeader = <div data-testid="custom-header">Custom</div>;

      render(
        <WaterfallChartSection
          {...defaultProps}
          sectionHeader={customHeader}
        />,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should always render section header container when data exists', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
    });
  });

  describe('Waterfall Component Props', () => {
    it('should pass values to Waterfall component', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const values = screen.getByTestId('waterfall-values');
      expect(values.textContent).toContain('100');
      expect(values.textContent).toContain('50');
    });

    it('should pass labels to Waterfall component', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const labels = screen.getByTestId('waterfall-labels');
      expect(labels.textContent).toContain('Q1');
      expect(labels.textContent).toContain('Q2');
    });

    it('should pass formattedData to Waterfall component', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const formatted = screen.getByTestId('waterfall-formatted');
      expect(formatted.textContent).toContain('100M');
    });

    it('should pass baseChartColors to Waterfall component', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const colors = screen.getByTestId('waterfall-base-chart-colors');
      expect(colors.textContent).toBe(
        JSON.stringify(['#EBB400', '#C9AF82', '#70C6FF']),
      );
    });

    it('should pass empty baseChartColors when data omits them', () => {
      const noColors = { ...mockData, baseChartColors: undefined } as any;

      render(<WaterfallChartSection {...defaultProps} data={noColors} />);

      const colors = screen.getByTestId('waterfall-base-chart-colors');
      expect(colors.textContent).toBe(JSON.stringify([]));
    });

    it('should handle undefined values', () => {
      const dataWithoutValues = { ...mockData, values: undefined } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithoutValues} />,
      );

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });
  });

  describe('Chart Height and Border', () => {
    it('should apply chartHeight to container', () => {
      const { container } = render(<WaterfallChartSection {...defaultProps} />);

      const chartContainer = container.querySelector(
        'div[style*="height: 400px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply border-bottom to chart container', () => {
      const { container } = render(<WaterfallChartSection {...defaultProps} />);

      const chartContainer = container.querySelector(
        'div[style*="border-bottom: 1px solid"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });

    it('should apply custom chartHeight', () => {
      const { container } = render(
        <WaterfallChartSection {...defaultProps} chartHeight="500px" />,
      );

      const chartContainer = container.querySelector(
        'div[style*="height: 500px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('BrandAvatarList Props', () => {
    it('should pass correct data to BrandAvatarList', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const avatarData = screen.getByTestId('avatar-data');
      expect(avatarData.textContent).toContain('Brand A');
    });

    it('should pass length based on labels length', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const avatarLength = screen.getByTestId('avatar-length');
      expect(avatarLength.textContent).toBe('4');
    });

    it('should pass correct borderConfig', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const borderConfig = screen.getByTestId('avatar-border');
      const parsed = JSON.parse(borderConfig.textContent || '{}');

      expect(parsed.marginLeft).toBe(24);
      expect(parsed.marginRight).toBe(24);
    });

    it('should pass correct gridConfig', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const gridConfig = screen.getByTestId('avatar-grid');
      const parsed = JSON.parse(gridConfig.textContent || '{}');

      expect(parsed.paddingLeft).toBe(0);
      expect(parsed.paddingRight).toBe(0);
    });

    it('should render in container with marginTop 8', () => {
      const { container } = render(<WaterfallChartSection {...defaultProps} />);

      const avatarContainer = container.querySelector(
        'div[style*="margin-top: 8px"]',
      );
      expect(avatarContainer).toBeInTheDocument();
    });
  });

  describe('ComparisonLine Props', () => {
    it('should pass comparison data', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const comparisonData = screen.getByTestId('comparison-data');
      expect(comparisonData.textContent).toContain('Previous');
    });

    it('should pass gridColumnsLength based on labels length', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const comparisonColumns = screen.getByTestId('comparison-columns');
      expect(comparisonColumns.textContent).toBe('4');
    });

    it('should pass correct borderConfig', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      const borderConfig = screen.getByTestId('comparison-border');
      const parsed = JSON.parse(borderConfig.textContent || '{}');

      expect(parsed.marginLeft).toBe(16);
      expect(parsed.marginRight).toBe(16);
    });

    it('should use empty array when comparisonLine data is missing', () => {
      const dataWithoutComparison = {
        ...mockData,
        comparisonLine: undefined,
      } as any;

      render(
        <WaterfallChartSection
          {...defaultProps}
          data={dataWithoutComparison}
        />,
      );

      const comparisonData = screen.getByTestId('comparison-data');
      expect(comparisonData.textContent).toBe('[]');
    });

    it('should render in container with marginTop 16 and marginBottom 16', () => {
      const { container } = render(<WaterfallChartSection {...defaultProps} />);

      const comparisonContainer = container.querySelector(
        'div[style*="margin-top: 16px"][style*="margin-bottom: 16px"]',
      );
      expect(comparisonContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty values array', () => {
      const dataWithEmptyValues = { ...mockData, values: [] } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithEmptyValues} />,
      );

      const values = screen.getByTestId('waterfall-values');
      expect(values.textContent).toBe('[]');
    });

    it('should handle empty labels array', () => {
      const dataWithEmptyLabels = { ...mockData, labels: [] } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithEmptyLabels} />,
      );

      const labels = screen.getByTestId('waterfall-labels');
      expect(labels.textContent).toBe('[]');
    });

    it('should handle missing brandsAvatar data', () => {
      const dataWithoutAvatar = { ...mockData, brandsAvatar: undefined } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithoutAvatar} />,
      );

      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
    });

    it('should handle negative values in waterfall', () => {
      const dataWithNegatives = {
        ...mockData,
        values: [100, -50, -30, 20],
      } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithNegatives} />,
      );

      const values = screen.getByTestId('waterfall-values');
      expect(values.textContent).toContain('-50');
      expect(values.textContent).toContain('-30');
    });

    it('should handle zero values', () => {
      const dataWithZeros = { ...mockData, values: [0, 0, 0, 0] } as any;

      render(<WaterfallChartSection {...defaultProps} data={dataWithZeros} />);

      const values = screen.getByTestId('waterfall-values');
      expect(values.textContent).toContain('0');
    });

    it('should handle undefined labels length gracefully', () => {
      const dataWithoutLabels = { ...mockData, labels: undefined } as any;

      render(
        <WaterfallChartSection {...defaultProps} data={dataWithoutLabels} />,
      );

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render all components together', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-container'),
      ).toBeInTheDocument();
    });

    it('should handle loading with all props provided', () => {
      render(<WaterfallChartSection {...defaultProps} loading={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });

    it('should handle error with all props provided', () => {
      render(
        <WaterfallChartSection {...defaultProps} error={new Error('Error')} />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });

    it('should handle minimal data structure', () => {
      const minimalData = {
        values: [100],
        labels: ['Q1'],
        formattedData: ['100M'],
        empty: false,
      } as any;

      render(<WaterfallChartSection {...defaultProps} data={minimalData} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });
  });

  describe('Data Validation', () => {
    it('should render when data exists but some nested properties are missing', () => {
      const partialData = {
        values: [100, 50],
        labels: ['Q1', 'Q2'],
        empty: false,
      } as any;

      render(<WaterfallChartSection {...defaultProps} data={partialData} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });

    it('should handle data with only required properties', () => {
      const minData = {
        values: [100],
        labels: ['Q1'],
        empty: false,
      } as any;

      render(<WaterfallChartSection {...defaultProps} data={minData} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
      expect(screen.getByTestId('brand-avatar-list')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });
  });

  describe('SkeletonProps', () => {
    it('should pass skeletonProps to DataStateHandler', () => {
      render(<WaterfallChartSection {...defaultProps} loading={true} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });

    it('should handle custom skeletonProps', () => {
      const customSkeletonProps = {
        width: '50%',
        height: '200px',
        length: 3,
        borderRadius: 'large' as const,
      };

      render(
        <WaterfallChartSection
          {...defaultProps}
          loading={true}
          skeletonProps={customSkeletonProps}
        />,
      );

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<WaterfallChartSection {...defaultProps} dataTestId="custom" />);

      const elements = screen.getAllByTestId('custom-waterfall-chart-section');
      expect(elements.length).toBeGreaterThanOrEqual(1);
      expect(elements[0]).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<WaterfallChartSection {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-waterfall-chart-section'),
      ).not.toBeInTheDocument();
    });
  });
});
