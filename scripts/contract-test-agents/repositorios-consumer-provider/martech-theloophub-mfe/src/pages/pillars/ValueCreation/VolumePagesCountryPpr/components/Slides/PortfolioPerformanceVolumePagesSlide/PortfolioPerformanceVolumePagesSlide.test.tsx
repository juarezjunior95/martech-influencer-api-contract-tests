import React from 'react';

import { render, screen } from '@testing-library/react';
import { PortfolioPerformance } from 'pages/components';

import { PortfolioPerformanceVolumePagesSlide } from './PortfolioPerformanceVolumePagesSlide';

jest.mock('pages/components', () => ({
  PortfolioPerformance: jest.fn(
    ({ dataTestId, loading }: { dataTestId?: string; loading: boolean }) => (
      <div data-testid={dataTestId}>
        <span data-testid="pp-loading">{String(loading)}</span>
      </div>
    ),
  ),
}));

jest.mock('./PortfolioPerformanceVolumePagesSlide.styles', () => ({
  StyledPortfolioPerformanceVolumePagesSlideRoot: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="portfolio-performance-volume-slide-root">{children}</div>
  ),
}));

describe('PortfolioPerformanceVolumePagesSlide', () => {
  it('should render PortfolioPerformance export content', () => {
    render(
      <PortfolioPerformanceVolumePagesSlide
        data={{ empty: true }}
        error={null}
        loading={false}
        dataTestId="portfolio-performance-slide"
      />,
    );

    expect(
      screen.getByTestId('portfolio-performance-volume-slide-root'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('portfolio-performance-slide'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pp-loading')).toHaveTextContent('false');
    const [[portfolioPerformanceProps]] = (PortfolioPerformance as jest.Mock)
      .mock.calls;
    expect(portfolioPerformanceProps).toEqual(
      expect.objectContaining({
        data: { empty: true },
        error: null,
        loading: false,
        dataTestId: 'portfolio-performance-slide',
        tableWidths: ['238px', '320px', '418px', '194px', '322px'],
        headerHeight: 64,
        rowHeight: 115,
      }),
    );
  });

  it('propagates loading=true to PortfolioPerformance', () => {
    render(
      <PortfolioPerformanceVolumePagesSlide
        data={{ empty: true }}
        error={null}
        loading
        dataTestId="portfolio-performance-slide"
      />,
    );

    expect(screen.getByTestId('pp-loading')).toHaveTextContent('true');
  });
});
