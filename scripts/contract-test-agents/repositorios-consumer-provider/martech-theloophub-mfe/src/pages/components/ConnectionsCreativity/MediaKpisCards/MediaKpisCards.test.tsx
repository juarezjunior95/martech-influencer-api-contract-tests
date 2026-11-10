import { render, screen } from '@testing-library/react';
import { ResourceAllocationOverview } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';

import { MediaKpisCards } from './MediaKpisCards';

jest.mock('components/deprecated', () => ({
  Bar: jest.fn(({ dataTestId, labels, datasets }: any) => (
    <div
      data-testid={dataTestId ?? 'bar-chart'}
      data-labels={JSON.stringify(labels)}
      data-datasets={JSON.stringify(datasets)}
    />
  )),
  BigNumber: ({ data }: any) => (
    <div data-testid="big-number-mock">{data?.title}</div>
  ),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  NoDataYet: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'no-data-yet'} />
  ),
}));

jest.mock('./MediaKpisCards.styles', () => ({
  StyledEmptyState: ({ children, ...rest }: any) => (
    <div data-testid="styled-empty-state" {...rest}>
      {children}
    </div>
  ),
  StyledResourceAllocationCardsArea: ({ children, ...rest }: any) => (
    <div data-testid="styled-cards-area" {...rest}>
      {children}
    </div>
  ),
}));

const formatMessage = jest.fn(({ id }: { id: string }) => id);

const chartBlock = {
  type: 'bar' as const,
  labels: ['2023', '2024'],
  datasets: [
    {
      type: 'bar' as const,
      label: 'Series',
      data: [10, 20],
    },
  ],
  backgroundColor: ['#111'],
  comparison_data: { some: 'arrow' },
};

describe('MediaKpisCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when data is null', () => {
    const { container } = render(
      <MediaKpisCards
        data={null as unknown as ResourceAllocationOverview}
        formatMessage={formatMessage}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders cards area and expandable container when dataTestId is set', () => {
    const data: ResourceAllocationOverview = {
      mediaSpend: {},
    } as ResourceAllocationOverview;

    render(
      <MediaKpisCards
        data={data}
        formatMessage={formatMessage}
        dataTestId="overview-kpis"
      />,
    );

    expect(screen.getByTestId('overview-kpis-cards-area')).toBeInTheDocument();
    expect(screen.getByTestId('overview-kpis-kpis-cards')).toBeInTheDocument();
  });

  it('renders Bar when total_per_year_full is present', () => {
    const data: ResourceAllocationOverview = {
      mediaSpend: { total_per_year_full: chartBlock },
    } as unknown as ResourceAllocationOverview;

    render(
      <MediaKpisCards
        data={data}
        formatMessage={formatMessage}
        dataTestId="overview-kpis"
      />,
    );

    expect(
      screen.getByTestId('overview-kpis-mediaSpend-bar-chart'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('kpis-cards-item-bar-chart-overview-kpis'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('kpis-cards-item-empty-state-overview-kpis'),
    ).not.toBeInTheDocument();
  });

  it('renders NoDataYet when total_per_year_full is missing', () => {
    const data: ResourceAllocationOverview = {
      campaigns: {},
    } as ResourceAllocationOverview;

    render(
      <MediaKpisCards
        data={data}
        formatMessage={formatMessage}
        dataTestId="overview-kpis"
      />,
    );

    expect(
      screen.getByTestId('overview-kpis-campaigns-kpis-cards-empty-state'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('kpis-cards-item-empty-state-overview-kpis'),
    ).toBeInTheDocument();
  });

  it('calls formatMessage with SummaryBreakdown ids for each key', () => {
    const data: ResourceAllocationOverview = {
      mediaSpend: { total_per_year_full: chartBlock },
    } as unknown as ResourceAllocationOverview;

    render(<MediaKpisCards data={data} formatMessage={formatMessage} />);

    expect(formatMessage).toHaveBeenCalledWith({
      id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.mediaSpend.title',
    });
    expect(formatMessage).toHaveBeenCalledWith({
      id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.mediaSpend.measure',
    });
  });
});
