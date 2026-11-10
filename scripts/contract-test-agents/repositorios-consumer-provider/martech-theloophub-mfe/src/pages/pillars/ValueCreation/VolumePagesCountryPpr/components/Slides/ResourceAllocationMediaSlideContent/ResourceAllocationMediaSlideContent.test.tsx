import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ResourceAllocationMediaSlideContent } from './ResourceAllocationMediaSlideContent';

const mockMediaKpisCards = jest.fn((_props: Record<string, unknown>) => (
  <div data-testid="mock-kpis-cards">kpis</div>
));
const mockMediaRankingSection = jest.fn((_props: Record<string, unknown>) => (
  <div data-testid="mock-ranking">ranking</div>
));

jest.mock('pages/components/ConnectionsCreativity', () => ({
  MediaKpisCards: (props: Record<string, unknown>) => mockMediaKpisCards(props),
  MediaRankingSection: (props: Record<string, unknown>) =>
    mockMediaRankingSection(props),
}));

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId}>skeleton</div>
  ),
}));

const mockNoDataYet = jest.fn(() => (
  <div data-testid="mock-no-data-yet">no data</div>
));

jest.mock('components', () => ({
  NoDataYet: () => mockNoDataYet(),
}));

jest.mock('./ResourceAllocationMediaSlideContent.styles', () => ({
  StyledResourceAllocationSlideRoot: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={rest['data-testid']}>{children}</div>,
}));

const mockFormatMessage = ({ id }: { id: string }) => id;

const emptyMegabrandsRankingData = {
  megabrands: {
    'owr_resource-allocation_overview_ranking-chart_megabrands': {
      datasets: [],
    },
  },
};

describe('ResourceAllocationMediaSlideContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton for overview while loading', () => {
    render(
      <ResourceAllocationMediaSlideContent
        overviewData={null}
        overviewLoading
        rankingKpiData={null}
        rankingLoading={false}
        activeRankingSubfilter="media_spend"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
        dataTestId="ra-slide"
      />,
    );

    expect(
      screen.getByTestId('ra-slide-overview-skeleton'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-ranking')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-kpis-cards')).not.toBeInTheDocument();

    expect(mockMediaKpisCards).not.toHaveBeenCalled();
    expect(mockMediaRankingSection).toHaveBeenCalledWith(
      expect.objectContaining({
        showLegend: false,
        chartHeight: '286px',
        rankingKpiData: null,
        loadingRanking: false,
        activeRankingSubfilter: 'media_spend',
        isGlobalZone: false,
        formatMessage: mockFormatMessage,
        dataTestId: 'ra-slide-ranking',
      }),
    );
  });

  it('renders KPI cards when overview is ready', () => {
    render(
      <ResourceAllocationMediaSlideContent
        overviewData={{ media_spend: {} }}
        overviewLoading={false}
        rankingKpiData={null}
        rankingLoading={false}
        activeRankingSubfilter="media_spend"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
        dataTestId="ra-slide"
      />,
    );

    expect(screen.getByTestId('mock-kpis-cards')).toBeInTheDocument();
    expect(mockMediaKpisCards).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { media_spend: {} },
        formatMessage: mockFormatMessage,
        dataTestId: 'ra-slide-kpis',
        minWidth: '400',
      }),
    );
  });

  it('renders NoDataYet when megabrands ranking datasets are empty', () => {
    render(
      <ResourceAllocationMediaSlideContent
        overviewData={{ media_spend: {} }}
        overviewLoading={false}
        rankingKpiData={emptyMegabrandsRankingData}
        rankingLoading={false}
        activeRankingSubfilter="media_spend"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
        dataTestId="ra-slide"
      />,
    );

    expect(screen.getByTestId('mock-no-data-yet')).toBeInTheDocument();
    expect(mockNoDataYet).toHaveBeenCalled();
    expect(mockMediaRankingSection).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-ranking')).not.toBeInTheDocument();
  });

  it('renders NoDataYet when ranking dataset is empty', () => {
    render(
      <ResourceAllocationMediaSlideContent
        overviewData={null}
        overviewLoading={false}
        rankingKpiData={{
          megabrands: {
            'owr_resource-allocation_overview_ranking-chart_megabrands': {
              datasets: [],
            },
          },
        }}
        rankingLoading={false}
        activeRankingSubfilter="media_spend"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
        dataTestId="ra-slide"
      />,
    );

    expect(screen.getByTestId('mock-no-data-yet')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-ranking')).not.toBeInTheDocument();
  });

  it('falls back to undefined dataTestId branches without crashing', () => {
    const { container } = render(
      <ResourceAllocationMediaSlideContent
        overviewData={{ media_spend: {} }}
        overviewLoading={false}
        rankingKpiData={null}
        rankingLoading={false}
        activeRankingSubfilter="media_spend"
        isGlobalZone={false}
        formatMessage={mockFormatMessage}
      />,
    );

    expect(screen.getByTestId('mock-kpis-cards')).toBeInTheDocument();
    expect(container.querySelector('[data-testid$="-root"]')).toBeNull();
  });
});
