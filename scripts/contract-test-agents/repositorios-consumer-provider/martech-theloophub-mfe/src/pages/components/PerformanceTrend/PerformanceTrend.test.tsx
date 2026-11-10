import React from 'react';

import { render, screen } from '@testing-library/react';

import { PerformanceTrend } from './PerformanceTrend';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('hooks', () => ({
  useFilters: () => ({ isActiveScope: false }),
  useIsInExportPage: () => false,
  useCurrentPage: () => ({ currentPage: 'test-page' }),
  usePageFilterApplied: () => ({ isGlobalZone: false }),
}));

jest.mock('components', () => ({
  DataStateHandler: ({ children, loading, error, empty }: any) => (
    <div
      data-testid="data-state-handler"
      data-loading={loading}
      data-error={!!error}
      data-empty={empty}
    >
      {children}
    </div>
  ),
  VariationCaption: () => <div>Variation</div>,
}));

jest.mock('components/Chart', () => ({
  Scale: () => <div>Scale</div>,
  SimpleBarChart: () => <div>Chart</div>,
}));

jest.mock('../ContentHeader', () => ({
  ContentHeader: () => <div data-testid="content-header">Header</div>,
}));

jest.mock('../PowerLegend', () => ({
  PowerLegend: ({ loading, ...props }: any) => (
    <div
      data-testid={props['data-testid'] || 'power-legend'}
      data-loading={loading}
    >
      Legend
    </div>
  ),
}));

const mockContainerWithScroll = jest.fn(({ children }: any) => (
  <div data-testid="container-with-scroll">{children}</div>
));

jest.mock('utils/container', () => ({
  ContainerWithScroll: (props: any) => mockContainerWithScroll(props),
}));

jest.mock('./PerformanceTrend.styles', () => ({
  StyledChartContainer: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  StyledSummaryForPowerPerformance: ({ children }: any) => (
    <div>{children}</div>
  ),
  StyledTrendOverTimeVariation: ({ children }: any) => <div>{children}</div>,
  StyledYearPowerAcVariation: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('shared/Styles', () => ({
  StyledCardContainer: ({ children }: any) => <div>{children}</div>,
  StyledLeftContainer: ({ children }: any) => <div>{children}</div>,
  StyledRightContainer: ({ children }: any) => <div>{children}</div>,
  StyledTooltip: ({ children }: any) => <div>{children}</div>,
}));

describe('PerformanceTrend', () => {
  const defaultProps = {
    loading: false,
    error: null,
    yearPowerVsAc: {
      labels: ['2023', '2024'],
      values: [100, 200],
    },
    trendOverTime: {
      labels: ['Q1', 'Q2'],
      values: [50, 60],
    },
    legend: [] as any[],
  };

  it('should render the component', () => {
    render(<PerformanceTrend {...defaultProps} />);

    expect(screen.getAllByTestId('content-header')).toHaveLength(2);
  });

  it('should not render ContentHeaders when title is false', () => {
    render(<PerformanceTrend {...defaultProps} title={false} />);

    expect(screen.queryByTestId('content-header')).not.toBeInTheDocument();
  });

  it('should render PowerLegend when hasLegend is true (default)', () => {
    render(<PerformanceTrend {...defaultProps} />);

    expect(screen.getByTestId('power-legend')).toBeInTheDocument();
  });

  it('should not render PowerLegend when hasLegend is false', () => {
    render(<PerformanceTrend {...defaultProps} hasLegend={false} />);

    expect(screen.queryByTestId('power-legend')).not.toBeInTheDocument();
  });

  it('should pass loading state to PowerLegend', () => {
    render(<PerformanceTrend {...defaultProps} loading={true} />);

    expect(screen.getByTestId('power-legend')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('should render two DataStateHandlers', () => {
    render(<PerformanceTrend {...defaultProps} />);

    const handlers = screen.getAllByTestId('data-state-handler');
    expect(handlers).toHaveLength(2);
  });

  it('should pass loading state to DataStateHandlers', () => {
    render(<PerformanceTrend {...defaultProps} loading={true} />);

    const handlers = screen.getAllByTestId('data-state-handler');
    handlers.forEach((handler) => {
      expect(handler).toHaveAttribute('data-loading', 'true');
    });
  });

  it('should apply padding when title is true', () => {
    const { container } = render(
      <PerformanceTrend {...defaultProps} title={true} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ padding: '0px 24px' });
  });

  it('should apply no padding when title is false', () => {
    const { container } = render(
      <PerformanceTrend {...defaultProps} title={false} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ padding: '0px' });
  });

  it('should pass error state to DataStateHandlers', () => {
    render(
      <PerformanceTrend {...defaultProps} error={new Error('Test error')} />,
    );

    const handlers = screen.getAllByTestId('data-state-handler');
    handlers.forEach((handler) => {
      expect(handler).toHaveAttribute('data-error', 'true');
    });
  });

  it('should pass empty state for yearPowerVsAc', () => {
    const emptyYearPowerVsAc = { ...defaultProps.yearPowerVsAc, empty: true };

    render(
      <PerformanceTrend {...defaultProps} yearPowerVsAc={emptyYearPowerVsAc} />,
    );

    const handlers = screen.getAllByTestId('data-state-handler');
    expect(handlers[0]).toHaveAttribute('data-empty', 'true');
  });

  it('should pass empty state for trendOverTime', () => {
    const emptyTrendOverTime = { ...defaultProps.trendOverTime, empty: true };

    render(
      <PerformanceTrend {...defaultProps} trendOverTime={emptyTrendOverTime} />,
    );

    const handlers = screen.getAllByTestId('data-state-handler');
    expect(handlers[1]).toHaveAttribute('data-empty', 'true');
  });

  it('should render ContainerWithScroll with overflow prop', () => {
    render(<PerformanceTrend {...defaultProps} />);

    expect(mockContainerWithScroll).toHaveBeenCalled();
    const callArgs = mockContainerWithScroll.mock.calls[0][0];
    expect(callArgs).toHaveProperty('overflow');
  });

  describe('data-testid', () => {
    it('should render component with data-testid', () => {
      render(
        <PerformanceTrend {...defaultProps} dataTestId="performance-trend" />,
      );

      expect(screen.getByTestId('performance-trend')).toBeInTheDocument();
    });

    it('should render inner elements with correct suffixes', () => {
      render(
        <PerformanceTrend {...defaultProps} dataTestId="performance-trend" />,
      );

      expect(
        screen.getByTestId('performance-trend-year-power-vs-ac'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('performance-trend-trend-over-time'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('performance-trend-legend'),
      ).toBeInTheDocument();
    });

    it('should NOT render data-testid attributes if prop is not provided', () => {
      render(<PerformanceTrend {...defaultProps} />);

      expect(screen.queryByTestId('performance-trend')).not.toBeInTheDocument();

      const legend = screen.getByTestId('power-legend');
      expect(legend.getAttribute('data-testid')).toBe('power-legend');
    });
  });
});
