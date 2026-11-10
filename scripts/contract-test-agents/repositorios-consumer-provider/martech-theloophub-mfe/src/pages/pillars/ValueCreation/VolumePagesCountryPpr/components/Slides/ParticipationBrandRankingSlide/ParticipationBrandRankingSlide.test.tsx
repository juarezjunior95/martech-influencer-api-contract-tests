import React from 'react';

import { render, screen } from '@testing-library/react';

import { ParticipationBrandRankingSlide } from './ParticipationBrandRankingSlide';

jest.mock('components', () => {
  const {
    DataStateHandlerMock,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../mocks/sharedExportMocks');
  return { DataStateHandler: DataStateHandlerMock };
});

jest.mock('pages/components/BrandRanking/BrandRanking', () => ({
  BrandRanking: ({ dataTestId }: { dataTestId?: string }) => (
    <div
      data-testid={dataTestId ? `brand-ranking-${dataTestId}` : 'brand-ranking'}
    >
      BrandRanking
    </div>
  ),
}));

jest.mock('./ParticipationBrandRankingSlide.styles', () => ({
  StyledParticipationBrandRankingSlideRoot: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={rest['data-testid'] ?? 'slide-root'}>{children}</div>,
  StyledParticipationBrandRankingChartPanel: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="chart-panel">{children}</div>,
}));

const baseRanking = {
  labels: [['A', 'B']] as [string, string][],
  datasets: [
    {
      data: [1, 2],
      source: ['abi', 'comp'],
      unitMeasure: ['%', '%'],
    },
  ],
};

describe('ParticipationBrandRankingSlide', () => {
  it('renders BrandRanking when not loading, without error, and not empty', () => {
    render(
      <ParticipationBrandRankingSlide
        loading={false}
        error={null}
        empty={false}
        ranking={baseRanking}
        dataTestId="chart-test"
      />,
    );

    expect(screen.getByTestId('chart-test')).toBeInTheDocument();
    expect(screen.getByTestId('brand-ranking-chart-test')).toBeInTheDocument();
  });

  it('does not render BrandRanking while loading', () => {
    render(
      <ParticipationBrandRankingSlide
        loading
        error={null}
        empty={false}
        ranking={baseRanking}
        dataTestId="loading-chart"
      />,
    );

    expect(
      screen.queryByTestId('brand-ranking-loading-chart'),
    ).not.toBeInTheDocument();
    // shared mock exposes `${id}-loading`; for ParticipationBrandRanking the
    // SUT does not pass dataTestId to DataStateHandler so we fall back to
    // 'data-state-handler'.
    expect(screen.getByTestId('data-state-handler-loading')).toHaveTextContent(
      'true',
    );
  });
});
