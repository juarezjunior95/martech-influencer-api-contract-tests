import React from 'react';

import { render, screen } from '@testing-library/react';

import type { BarChartKpiData } from '../../../types';
import { BarChartSlideContent } from './BarChartSlideContent';
import type { BarChartSlideContentData } from './types';

jest.mock('../../Sections', () => ({
  BarChartSection: ({
    loading,
    error,
    data,
    chartHeight,
    centerZeroLine,
    skeletonProps,
    sectionHeader,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'bar-chart-section'}>
      <div data-testid="bar-loading">{String(loading)}</div>
      <div data-testid="bar-error">{String(!!error)}</div>
      <div data-testid="bar-data">{JSON.stringify(data)}</div>
      <div data-testid="bar-height">{chartHeight}</div>
      <div data-testid="bar-center-zero">{String(centerZeroLine)}</div>
      <div data-testid="bar-skeleton">{JSON.stringify(skeletonProps)}</div>
      {sectionHeader && <div data-testid="bar-header">{sectionHeader}</div>}
    </div>
  ),
}));

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: ({ period, legends, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'section-header'}>
      <span data-testid="header-period">{period}</span>
      <span data-testid="header-legends">{JSON.stringify(legends)}</span>
    </div>
  ),
}));

jest.mock('./BarChartSlideContent.styles', () => ({
  StyledBarChartSliderGrid: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'bar-chart-slider-grid'}>
      {children}
    </div>
  ),
  StyledBarChartWrapper: ({ children }: any) => (
    <div data-testid="bar-chart-wrapper">{children}</div>
  ),
  StyledBarChartContainer: ({ children }: any) => (
    <div data-testid="bar-chart-container">{children}</div>
  ),
}));

describe('BarChartSlideContent', () => {
  const mockBarChartMtdData: BarChartKpiData = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [100, 200, 300] }],
    period: 'MTD',
    legend: [{ label: 'Series 1', color: '#000', shape: 'circle' as const }],
    formattedData: [],
  };

  const mockBarChartYtdData: BarChartKpiData = {
    ...mockBarChartMtdData,
    period: 'YTD',
  };

  const defaultData: BarChartSlideContentData = {
    barChartMtdKpiData: mockBarChartMtdData,
    barChartYtdKpiData: mockBarChartYtdData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render main grid and BarChartSection', () => {
      render(<BarChartSlideContent data={defaultData} />);

      expect(screen.getByTestId('bar-chart-slider-grid')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-wrapper')).toBeInTheDocument();
      const containers = screen.getAllByTestId('bar-chart-container');
      expect(containers).toHaveLength(2);
      const sections = screen.getAllByTestId('bar-chart-section');
      expect(sections).toHaveLength(2);
    });

    it('should pass data to BarChartSection', () => {
      render(<BarChartSlideContent data={defaultData} />);

      const barDataElements = screen.getAllByTestId('bar-data');
      expect(barDataElements[0].textContent).toContain('MTD');
      expect(barDataElements[0].textContent).toContain('A');
      expect(barDataElements[1].textContent).toContain('YTD');
    });

    it('should render SectionHeader inside BarChartSection', () => {
      render(<BarChartSlideContent data={defaultData} />);

      const headers = screen.getAllByTestId('bar-header');
      expect(headers).toHaveLength(2);
      const periodElements = screen.getAllByTestId('header-period');
      expect(periodElements[0]).toHaveTextContent('MTD');
      expect(periodElements[1]).toHaveTextContent('YTD');
    });
  });

  describe('Default Props', () => {
    it('should use default chartHeight of 168px', () => {
      render(<BarChartSlideContent data={defaultData} />);

      const heights = screen.getAllByTestId('bar-height');
      expect(heights[0]).toHaveTextContent('168px');
      expect(heights[1]).toHaveTextContent('168px');
    });

    it('should not pass centerZeroLine by default', () => {
      render(<BarChartSlideContent data={defaultData} />);

      const centerZeros = screen.getAllByTestId('bar-center-zero');
      expect(centerZeros[0]).toHaveTextContent('undefined');
    });

    it('should use default skeletonProps', () => {
      render(<BarChartSlideContent data={defaultData} />);

      const skeletons = screen.getAllByTestId('bar-skeleton');
      expect(skeletons[0].textContent).toContain('396px');
      expect(skeletons[0].textContent).toContain('medium');
    });
  });

  describe('Custom Props', () => {
    it('should pass custom chartHeight', () => {
      render(<BarChartSlideContent data={defaultData} chartHeight="230px" />);

      const heights = screen.getAllByTestId('bar-height');
      expect(heights[0]).toHaveTextContent('230px');
      expect(heights[1]).toHaveTextContent('230px');
    });

    it('should pass centerZeroLine when true', () => {
      render(<BarChartSlideContent data={defaultData} centerZeroLine />);

      const centerZeros = screen.getAllByTestId('bar-center-zero');
      expect(centerZeros[0]).toHaveTextContent('true');
    });

    it('should pass custom skeletonProps', () => {
      const customSkeleton = {
        height: '200px',
        width: '50%',
        length: 2,
        borderRadius: 'small' as const,
      };

      render(
        <BarChartSlideContent
          data={defaultData}
          skeletonProps={customSkeleton}
        />,
      );

      const skeletons = screen.getAllByTestId('bar-skeleton');
      expect(skeletons[0].textContent).toContain('200px');
      expect(skeletons[0].textContent).toContain('small');
    });
  });

  describe('Data States', () => {
    it('should pass loading state to BarChartSection', () => {
      render(<BarChartSlideContent data={defaultData} loading />);

      const loadingElements = screen.getAllByTestId('bar-loading');
      expect(loadingElements[0]).toHaveTextContent('true');
    });

    it('should pass error state to BarChartSection', () => {
      render(
        <BarChartSlideContent
          data={defaultData}
          error={new Error('Test error')}
        />,
      );

      const errorElements = screen.getAllByTestId('bar-error');
      expect(errorElements[0]).toHaveTextContent('true');
    });

    it('should handle undefined data', () => {
      render(
        <BarChartSlideContent
          data={
            {
              barChartMtdKpiData: undefined,
              barChartYtdKpiData: undefined,
            } as BarChartSlideContentData
          }
        />,
      );

      const sections = screen.getAllByTestId('bar-chart-section');
      expect(sections).toHaveLength(2);
      const barDataElements = screen.getAllByTestId('bar-data');
      expect(barDataElements).toHaveLength(2);
    });
  });

  describe('dataTestId', () => {
    it('should apply dataTestId to grid and section', () => {
      render(<BarChartSlideContent data={defaultData} dataTestId="my-chart" />);

      expect(
        screen.getByTestId('bar-chart-slide-content-my-chart'),
      ).toBeInTheDocument();
      const sections = screen.getAllByTestId(
        'my-chart-bar-chart-slide-content',
      );
      expect(sections).toHaveLength(2);
    });

    it('should not set data-testid on grid when dataTestId is not provided', () => {
      render(<BarChartSlideContent data={defaultData} />);

      expect(screen.getByTestId('bar-chart-slider-grid')).toBeInTheDocument();
    });
  });
});
