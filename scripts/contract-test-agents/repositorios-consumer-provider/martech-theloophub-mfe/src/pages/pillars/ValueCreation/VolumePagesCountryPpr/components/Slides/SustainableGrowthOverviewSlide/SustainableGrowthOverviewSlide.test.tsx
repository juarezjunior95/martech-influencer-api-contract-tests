import React from 'react';

import { render, screen } from '@testing-library/react';

import { SustainableGrowthOverviewSlide } from './SustainableGrowthOverviewSlide';

jest.mock('hooks', () => ({
  useMediaQuery: () => false,
}));

jest.mock('pages/pillars/ValueCreation/Home/utils', () => ({
  getKpiOverviewCardSkeletonProps: () => ({
    height: '1px',
    width: '1px',
    length: 1,
    hasContainer: false,
  }),
  getStrategyDriverCardSkeletonProps: () => ({
    height: '1px',
    width: '1px',
    length: 1,
    hasContainer: false,
  }),
  getGrowthLeverCardSkeletonProps: () => ({
    height: '1px',
    width: '1px',
    length: 1,
    hasContainer: false,
  }),
}));

jest.mock('components', () => {
  const {
    DataStateHandlerMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { DataStateHandler: DataStateHandlerMock };
});

jest.mock('pages/components/KpiOverviewCard', () => ({
  KpiOverviewCard: () => (
    <div data-testid="sustainable-overview-card">overview</div>
  ),
}));

jest.mock('pages/components/ValueCreation', () => ({
  StrategyDriverCard: () => (
    <div data-testid="strategy-driver-card">driver</div>
  ),
  GrowthLeverCard: () => <div data-testid="growth-lever-card">lever</div>,
}));

jest.mock('./SustainableGrowthOverviewSlide.styles', () => ({
  StyledSustainableGrowthSlideRoot: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={rest['data-testid'] ?? 'slide-root'}>{children}</div>,
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  StyledGrowthLeversContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="growth-levers-container">{children}</div>,
  StyledStrategyDriversGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="strategy-grid">{children}</div>
  ),
  StyledGrowthLeversGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="levers-grid">{children}</div>
  ),
}));

const baseData = {
  sustainableGrowthOverview: {},
  strategyDrivers: [
    {
      chartHeader: { title: 'ABI Lovers', period: "Q1'25" },
      bigNumberData: [],
    },
  ],
  growthLevers: {
    superiorCore: {
      title: 'Superior Core',
      rows: [],
    },
  },
};

describe('SustainableGrowthOverviewSlide', () => {
  it('renders cards when loaded', () => {
    render(
      <SustainableGrowthOverviewSlide
        loading={false}
        data={baseData}
        dataTestId="sg-slide"
      />,
    );

    expect(screen.getByTestId('sg-slide')).toBeInTheDocument();
    expect(screen.getAllByTestId('sustainable-overview-card')).toHaveLength(5);
    expect(screen.getByTestId('strategy-driver-card')).toBeInTheDocument();
    expect(screen.getByTestId('growth-lever-card')).toBeInTheDocument();
  });

  it('shows loading state for sustainable growth overview when loading is true', () => {
    render(
      <SustainableGrowthOverviewSlide
        loading
        data={baseData}
        dataTestId="sg-slide"
      />,
    );

    expect(
      screen.getByTestId('sg-slide-sustainable-growth-overview-loading'),
    ).toHaveTextContent('true');
  });

  it('propagates error to all three DataStateHandlers', () => {
    render(
      <SustainableGrowthOverviewSlide
        loading={false}
        error={new Error('boom')}
        data={baseData}
        dataTestId="sg-slide"
      />,
    );

    expect(
      screen.getByTestId('sg-slide-sustainable-growth-overview-error'),
    ).toHaveTextContent('true');
    expect(
      screen.getByTestId('sg-slide-strategy-drivers-error'),
    ).toHaveTextContent('true');
    expect(
      screen.getByTestId('sg-slide-growth-levers-error'),
    ).toHaveTextContent('true');
  });

  it('hides the growth levers grid when showGrowthLevers is false', () => {
    render(
      <SustainableGrowthOverviewSlide
        loading={false}
        data={baseData}
        dataTestId="sg-slide"
        showGrowthLevers={false}
      />,
    );

    expect(
      screen.queryByTestId('sg-slide-growth-levers'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('growth-lever-card')).not.toBeInTheDocument();
  });

  it('marks growth levers as empty when growthLevers is empty', () => {
    render(
      <SustainableGrowthOverviewSlide
        loading={false}
        data={{ ...baseData, growthLevers: {} }}
        dataTestId="sg-slide"
      />,
    );

    expect(
      screen.getByTestId('sg-slide-growth-levers-empty'),
    ).toHaveTextContent('true');
  });
});
