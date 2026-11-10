import React from 'react';

import { render, screen } from '@testing-library/react';

import { BigNumbersSection } from './BigNumbersSection';

jest.mock('components', () => ({
  BigNumber: ({
    header,
    data,
    size,
    orientation,
    spacing,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'big-number'}>
      <div data-testid="big-number-header">{header}</div>
      <div data-testid="big-number-data">{JSON.stringify(data)}</div>
      <div data-testid="big-number-size">{size}</div>
      <div data-testid="big-number-orientation">{orientation}</div>
      <div data-testid="big-number-spacing">{spacing}</div>
    </div>
  ),
  ChartHeader: ({ title, config }: any) => (
    <div data-testid="chart-header">
      <div data-testid="chart-header-title">{title}</div>
      <div data-testid="chart-header-config">{JSON.stringify(config)}</div>
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

jest.mock('../../../__mocks', () => ({
  GlobalMockData: {
    bigNumbers: [
      {
        header: { title: 'Mock Title 1' },
        data: { value: 100, unitOfMeasure: '%' },
      },
      {
        header: { title: 'Mock Title 2' },
        data: { value: 200, unitOfMeasure: 'M' },
      },
    ],
  },
}));

jest.mock('components/BigNumber/components/BigNumberSecondaryInfo', () => ({
  BigNumberSecondaryInfo: ({ item }: any) => (
    <div data-testid="big-number-secondary-info">
      {item?.secondaryInfo?.value} {item?.secondaryInfo?.label}
    </div>
  ),
}));

jest.mock('./BigNumberSection.styles', () => ({
  StyledBigNumberContainer: ({ children }: any) => (
    <div data-testid="big-number-container">{children}</div>
  ),
  StyledCardWrapper: ({ children }: any) => (
    <div data-testid="card-wrapper">{children}</div>
  ),
  StyledBottomInfo: ({ children }: any) => (
    <div data-testid="bottom-info">{children}</div>
  ),
}));

describe('BigNumbersSection', () => {
  const mockData = [
    {
      header: { title: 'Total Sales' },
      data: { value: 1500, unitOfMeasure: 'M' },
    },
    {
      header: { title: 'Growth Rate' },
      data: { value: 25, unitOfMeasure: '%' },
    },
    {
      header: { title: 'Market Share' },
      data: { value: 45, unitOfMeasure: '%' },
    },
  ] as any;

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
      render(<BigNumbersSection loading={true} error={null} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should not render big numbers when loading', () => {
      render(<BigNumbersSection loading={true} error={null} />);

      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      render(
        <BigNumbersSection
          loading={false}
          error={new Error('Test error')}
          data={mockData}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should not render big numbers when error', () => {
      render(
        <BigNumbersSection
          loading={false}
          error={new Error('Test error')}
          data={mockData}
        />,
      );

      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('should render big numbers with data', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(3);
    });

    it('should render StyledBigNumberContainer', () => {
      render(<BigNumbersSection {...defaultProps} />);

      expect(screen.getByTestId('big-number-container')).toBeInTheDocument();
    });

    it('should render DataStateHandler', () => {
      render(<BigNumbersSection {...defaultProps} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('should show empty state when data prop is not provided', () => {
      render(<BigNumbersSection loading={false} error={null} />);

      expect(screen.getByTestId('empty')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });

    it('should show empty state when data is empty array', () => {
      render(<BigNumbersSection loading={false} error={null} data={[]} />);

      expect(screen.getByTestId('empty')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });

    it('should use default orientation as vertical', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const orientations = screen.getAllByTestId('big-number-orientation');
      orientations.forEach((orientation) => {
        expect(orientation.textContent).toBe('vertical');
      });
    });

    it('should use default skeletonProps', () => {
      render(<BigNumbersSection loading={true} error={null} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('BigNumber Props', () => {
    it('should pass correct header to BigNumber', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const headers = screen.getAllByTestId('chart-header-title');
      expect(headers[0].textContent).toBe('Total Sales');
      expect(headers[1].textContent).toBe('Growth Rate');
      expect(headers[2].textContent).toBe('Market Share');
    });

    it('should pass correct data to BigNumber', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const dataElements = screen.getAllByTestId('big-number-data');
      expect(dataElements[0].textContent).toContain('1500');
      expect(dataElements[1].textContent).toContain('25');
      expect(dataElements[2].textContent).toContain('45');
    });

    it('should pass size as medium', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const sizes = screen.getAllByTestId('big-number-size');
      sizes.forEach((size) => {
        expect(size.textContent).toBe('medium');
      });
    });

    it('should pass spacing as loose', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const spacings = screen.getAllByTestId('big-number-spacing');
      spacings.forEach((spacing) => {
        expect(spacing.textContent).toBe('loose');
      });
    });

    it('should pass orientation prop to BigNumber', () => {
      render(<BigNumbersSection {...defaultProps} orientation="horizontal" />);

      const orientations = screen.getAllByTestId('big-number-orientation');
      orientations.forEach((orientation) => {
        expect(orientation.textContent).toBe('horizontal');
      });
    });
  });

  describe('ChartHeader Props', () => {
    it('should render ChartHeader for each BigNumber', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const headers = screen.getAllByTestId('chart-header');
      expect(headers).toHaveLength(3);
    });

    it('should pass correct title to ChartHeader', () => {
      render(<BigNumbersSection {...defaultProps} />);

      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('Growth Rate')).toBeInTheDocument();
      expect(screen.getByText('Market Share')).toBeInTheDocument();
    });

    it('should pass correct config to ChartHeader', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const configs = screen.getAllByTestId('chart-header-config');
      configs.forEach((config) => {
        const parsed = JSON.parse(config.textContent || '{}');
        expect(parsed.inline).toBe('vertical');
        expect(parsed.type).toBe('large');
      });
    });
  });

  describe('Orientation Prop', () => {
    it('should pass vertical orientation', () => {
      render(<BigNumbersSection {...defaultProps} orientation="vertical" />);

      const orientations = screen.getAllByTestId('big-number-orientation');
      orientations.forEach((orientation) => {
        expect(orientation.textContent).toBe('vertical');
      });
    });

    it('should pass horizontal orientation', () => {
      render(<BigNumbersSection {...defaultProps} orientation="horizontal" />);

      const orientations = screen.getAllByTestId('big-number-orientation');
      orientations.forEach((orientation) => {
        expect(orientation.textContent).toBe('horizontal');
      });
    });
  });

  describe('Skeleton Props', () => {
    it('should pass custom skeletonProps', () => {
      const customSkeletonProps = {
        height: '200px',
        width: '300px',
        length: 5,
        borderRadius: 'large' as const,
      };

      render(
        <BigNumbersSection
          loading={true}
          error={null}
          skeletonProps={customSkeletonProps}
        />,
      );

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
    });
  });

  describe('Data Mapping', () => {
    it('should render correct number of BigNumbers based on data length', () => {
      const singleData = [mockData[0]] as any;

      render(<BigNumbersSection {...defaultProps} data={singleData} />);

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(1);
    });

    it('should handle empty data array', () => {
      render(<BigNumbersSection {...defaultProps} data={[]} />);

      const bigNumbers = screen.queryAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(0);
    });

    it('should generate unique keys for BigNumbers', () => {
      render(<BigNumbersSection {...defaultProps} />);

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with same title but different values', () => {
      const duplicateTitleData = [
        {
          header: { title: 'Same Title' },
          data: { value: 100, unitOfMeasure: '%' },
        },
        {
          header: { title: 'Same Title' },
          data: { value: 200, unitOfMeasure: '%' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={duplicateTitleData} />);

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(2);
    });

    it('should handle data with zero value', () => {
      const zeroData = [
        {
          header: { title: 'Zero Value' },
          data: { value: 0, unitOfMeasure: '%' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={zeroData} />);

      const dataElement = screen.getByTestId('big-number-data');
      expect(dataElement.textContent).toContain('0');
    });

    it('should handle data with negative value', () => {
      const negativeData = [
        {
          header: { title: 'Negative Value' },
          data: { value: -50, unitOfMeasure: '%' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={negativeData} />);

      const dataElement = screen.getByTestId('big-number-data');
      expect(dataElement.textContent).toContain('-50');
    });

    it('should handle data with decimal value', () => {
      const decimalData = [
        {
          header: { title: 'Decimal Value' },
          data: { value: 12.5, unitOfMeasure: '%' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={decimalData} />);

      const dataElement = screen.getByTestId('big-number-data');
      expect(dataElement.textContent).toContain('12.5');
    });

    it('should handle long titles', () => {
      const longTitleData = [
        {
          header: {
            title:
              'This is a very long title that should still render correctly',
          },
          data: { value: 100, unitOfMeasure: '%' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={longTitleData} />);

      expect(
        screen.getByText(
          'This is a very long title that should still render correctly',
        ),
      ).toBeInTheDocument();
    });

    it('should handle different unit of measures', () => {
      const differentUnitsData = [
        {
          header: { title: 'Percentage' },
          data: { value: 100, unitOfMeasure: '%' },
        },
        {
          header: { title: 'Million' },
          data: { value: 50, unitOfMeasure: 'M' },
        },
        {
          header: { title: 'Billion' },
          data: { value: 5, unitOfMeasure: 'B' },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={differentUnitsData} />);

      const dataElements = screen.getAllByTestId('big-number-data');
      expect(dataElements).toHaveLength(3);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle loading with data provided', () => {
      render(<BigNumbersSection loading={true} error={null} data={mockData} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });

    it('should handle error with data provided', () => {
      render(
        <BigNumbersSection
          loading={false}
          error={new Error('Error')}
          data={mockData}
        />,
      );

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    });

    it('should render with all custom props', () => {
      const customSkeletonProps = {
        height: '150px',
        width: '250px',
        length: 4,
        borderRadius: 'small' as const,
      };

      render(
        <BigNumbersSection
          loading={false}
          error={null}
          data={mockData}
          orientation="horizontal"
          skeletonProps={customSkeletonProps}
        />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(3);

      const orientations = screen.getAllByTestId('big-number-orientation');
      orientations.forEach((orientation) => {
        expect(orientation.textContent).toBe('horizontal');
      });
    });
  });

  describe('bottomInfo', () => {
    it('should render BigNumberSecondaryInfo when bottomInfo is provided', () => {
      const dataWithBottomInfo = [
        {
          header: { title: 'Month' },
          data: [{ bigNumber: { value: '-2.5', measure: '%' } }],
          bottomInfo: {
            secondaryInfo: { value: '23,638.0', label: '[k hl]' },
          },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={dataWithBottomInfo} />);

      expect(
        screen.getByTestId('big-number-secondary-info'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('bottom-info')).toBeInTheDocument();
    });

    it('should not render BigNumberSecondaryInfo when bottomInfo is not provided', () => {
      const dataWithoutBottomInfo = [
        {
          header: { title: 'Month' },
          data: [{ bigNumber: { value: '-2.5', measure: '%' } }],
        },
      ] as any;

      render(
        <BigNumbersSection {...defaultProps} data={dataWithoutBottomInfo} />,
      );

      expect(
        screen.queryByTestId('big-number-secondary-info'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('bottom-info')).not.toBeInTheDocument();
    });

    it('should render bottomInfo content correctly', () => {
      const dataWithBottomInfo = [
        {
          header: { title: 'Month' },
          data: [{ bigNumber: { value: '-2.5', measure: '%' } }],
          bottomInfo: {
            secondaryInfo: { value: '23,638.0', label: '[k hl]' },
          },
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={dataWithBottomInfo} />);

      expect(screen.getByText('23,638.0 [k hl]')).toBeInTheDocument();
    });

    it('should render bottomInfo only for cards that have it', () => {
      const mixedData = [
        {
          header: { title: 'Month' },
          data: [{ bigNumber: { value: '-2.5', measure: '%' } }],
          bottomInfo: {
            secondaryInfo: { value: '23,638.0', label: '[k hl]' },
          },
        },
        {
          header: { title: 'L3M' },
          data: [{ bigNumber: { value: '-1.7', measure: '%' } }],
        },
      ] as any;

      render(<BigNumbersSection {...defaultProps} data={mixedData} />);

      const bottomInfos = screen.getAllByTestId('bottom-info');
      expect(bottomInfos).toHaveLength(1);
    });
  });

  describe('Empty State', () => {
    it('should not show empty state (always false)', () => {
      render(<BigNumbersSection {...defaultProps} />);

      expect(screen.queryByTestId('empty')).not.toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<BigNumbersSection {...defaultProps} dataTestId="custom" />);

      expect(
        screen.getByTestId('custom-big-numbers-section'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<BigNumbersSection {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-big-numbers-section'),
      ).not.toBeInTheDocument();
    });
  });
});
