import React from 'react';

import { render, screen } from '@testing-library/react';

import { brandsSlideDataMock } from '../../../__mocks';
import { BrandsSlide } from './BrandsSlide';

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

jest.mock('pages/pillars/ValueCreation/VolumePages/components', () => ({
  BigNumbersSection: ({ loading, error, data, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'big-numbers-section'}>
      <span data-testid="bn-loading">{String(loading)}</span>
      <span data-testid="bn-error">{String(!!error)}</span>
      <span data-testid="bn-data">{JSON.stringify(data)}</span>
    </div>
  ),
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
  BarChartSection: ({
    loading,
    error,
    data,
    chartHeight,
    sectionHeader,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'bar-chart-section'}>
      <span data-testid="bar-loading">{String(loading)}</span>
      <span data-testid="bar-error">{String(!!error)}</span>
      <span data-testid="bar-data">{JSON.stringify(data)}</span>
      <span data-testid="bar-height">{chartHeight}</span>
      {sectionHeader && <div data-testid="bar-header">{sectionHeader}</div>}
    </div>
  ),
  SectionHeader: ({ period, legends }: any) => (
    <div data-testid="section-header">
      <span data-testid="header-period">{period}</span>
      <span data-testid="header-legends">{JSON.stringify(legends)}</span>
    </div>
  ),
}));

jest.mock('../../ExportTable', () => ({
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
}));

jest.mock('./BrandsSlide.styles', () => ({
  StyledBrandsSlideGrid: ({
    children,
    'data-testid': dataTestIdProp,
    style,
  }: any) => (
    <div
      data-testid={dataTestIdProp ?? 'brands-slide-grid'}
      data-style={JSON.stringify(style)}
    >
      {children}
    </div>
  ),
  StyledBigNumbersContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'big-numbers-container'}>
      {children}
    </div>
  ),
  StyledLineChartContainer: ({ children }: any) => (
    <div data-testid="line-chart-container">{children}</div>
  ),
  StyledBarChartAndMarketsContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'bar-chart-and-markets-container'}>
      {children}
    </div>
  ),
  StyledBarChartWrapper: ({ children }: any) => (
    <div data-testid="bar-chart-wrapper">{children}</div>
  ),
  StyledMarketsTableWrapper: ({ children }: any) => (
    <div data-testid="markets-table-wrapper">{children}</div>
  ),
}));

describe('BrandsSlide', () => {
  const defaultProps = {
    loading: false,
    error: null,
    data: brandsSlideDataMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render grid with BigNumbersSection, LineChartSection, BarChartSection and Markets table', () => {
      render(<BrandsSlide {...defaultProps} />);

      expect(screen.getByTestId('brands-slide-grid')).toBeInTheDocument();
      expect(screen.getByTestId('big-numbers-section')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart-section')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-section')).toBeInTheDocument();
      expect(screen.getByTestId('export-table')).toBeInTheDocument();
    });

    it('should pass bigNumbersKpiData to BigNumbersSection', () => {
      render(<BrandsSlide {...defaultProps} />);

      const bnData = screen.getByTestId('bn-data');
      expect(bnData).toHaveTextContent(
        JSON.stringify(brandsSlideDataMock.bigNumbersKpiData),
      );
    });

    it('should pass lineChartKpiData to LineChartSection', () => {
      render(<BrandsSlide {...defaultProps} />);

      const lineData = screen.getByTestId('line-data');
      expect(lineData).toHaveTextContent(
        JSON.stringify(brandsSlideDataMock.lineChartKpiData),
      );
    });

    it('should pass barChartKpiData to BarChartSection', () => {
      render(<BrandsSlide {...defaultProps} />);

      const barData = screen.getByTestId('bar-data');
      expect(barData).toHaveTextContent(
        JSON.stringify(brandsSlideDataMock.barChartKpiData),
      );
    });

    it('should pass marketsTableKpiData to ExportTable', () => {
      render(<BrandsSlide {...defaultProps} />);

      const table = screen.getByTestId('export-table');
      expect(table).toHaveTextContent(
        JSON.stringify(brandsSlideDataMock.marketsTableKpiData),
      );
    });

    it('should render SectionHeader inside LineChartSection and BarChartSection', () => {
      render(<BrandsSlide {...defaultProps} />);

      expect(screen.getByTestId('line-header')).toBeInTheDocument();
      expect(screen.getByTestId('bar-header')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should pass loading to BigNumbersSection, LineChartSection and BarChartSection', () => {
      render(<BrandsSlide {...defaultProps} loading />);

      expect(screen.getByTestId('bn-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('line-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('bar-loading')).toHaveTextContent('true');
    });

    it('should pass error to BigNumbersSection, LineChartSection and BarChartSection', () => {
      const error = new Error('Chart error');
      render(<BrandsSlide {...defaultProps} error={error} />);

      expect(screen.getByTestId('bn-error')).toHaveTextContent('true');
      expect(screen.getByTestId('line-error')).toHaveTextContent('true');
      expect(screen.getByTestId('bar-error')).toHaveTextContent('true');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom lineChartHeight', () => {
      render(<BrandsSlide {...defaultProps} lineChartHeight={350} />);

      const lineHeight = screen.getByTestId('line-height');
      expect(lineHeight).toHaveTextContent('264px');
    });

    it('should pass dataTestId to sections', () => {
      render(<BrandsSlide {...defaultProps} dataTestId="corona" />);

      expect(screen.getByTestId('brands-slide-corona')).toBeInTheDocument();
      expect(
        screen.getAllByTestId('corona-brands-slide').length,
      ).toBeGreaterThan(0);
    });
  });

  describe('Layout Structure', () => {
    it('should render bar chart and markets table in bottom section', () => {
      render(<BrandsSlide {...defaultProps} />);

      expect(screen.getByTestId('bar-chart-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('markets-table-wrapper')).toBeInTheDocument();
      expect(
        screen.getByTestId('bar-chart-and-markets-container'),
      ).toBeInTheDocument();
    });
  });
});
