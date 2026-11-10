import { render, screen } from '@testing-library/react';
import { useCurrentPage, useFeatureToggle } from 'hooks';

import { ResourceAllocationOverview } from '../../types';
import { SummaryView } from './SummaryView';

const mockUseFeatureToggle = jest.mocked(useFeatureToggle);
const mockUseCurrentPage = jest.mocked(useCurrentPage);

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ id }) => id),
  })),
}));

jest.mock('hooks', () => ({
  useFeatureToggle: jest.fn(() => [false, false]),
  useCurrentPage: jest.fn(() => ({ currentPage: 'resource-allocation-media' })),
  useSubFilters: jest.fn(() => ({ activeSubFilters: {} })),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      connectionsAndCreativity: {
        submenus: {
          resourceAllocationMedia: {
            tab: {
              overview: {
                aiSummary: 'ai_summary_resource_allocation_overview',
                sections: {
                  breakdownTable: 'breakdown_table_toggle',
                  breakdownCharts: 'breakdown_charts_toggle',
                  ranking: 'ranking_toggle',
                },
              },
            },
          },
        },
      },
    },
    developmentViewer: 'development_viewer_toggle',
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummaryAlert: ({ pageName, dataTestId, kpiGroup }: any) => (
    <div
      data-testid={dataTestId ? `${dataTestId}-ai-summary` : 'ai-summary'}
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
    />
  ),
}));

jest.mock('components', () => ({
  Expandable: {
    Item: ({ headerCustomized, expandableChildren, dataTestId }: any) => (
      <div data-testid={dataTestId ?? 'summary-view-item'}>
        <div data-testid="header-customized">{headerCustomized}</div>
        <div data-testid="expandable-children">{expandableChildren}</div>
      </div>
    ),
  },
}));

jest.mock('../SummaryHeader/SummaryHeader', () => ({
  SummaryHeader: ({ formatMessage, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'summary-header'}
      data-format-message={!!formatMessage}
    />
  ),
}));

jest.mock('../ChartsView/ChartsView', () => ({
  ChartsView: ({ data, formatMessage, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'charts-view'}
      data-data={JSON.stringify(data)}
      data-format-message={!!formatMessage}
    />
  ),
}));

jest.mock('../CustomSkeletonLoader/CustomSkeletonLoader', () => ({
  CustomSkeletonLoader: ({ type, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'custom-skeleton-loader'}
      data-type={type}
    />
  ),
}));

jest.mock('./SummaryView.styles', () => ({
  StyledSummaryViewContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
}));

describe('SummaryView', () => {
  const mockData: ResourceAllocationOverview = {
    mediaSpend: {
      total_per_year_full: {
        labels: ['2023', '2024'],
        datasets: [{ data: [100, 200] }],
      },
    },
  } as unknown as ResourceAllocationOverview;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Expandable.Item with SummaryHeader', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
      />,
    );

    screen.getByTestId('summary-view-item');
    const header = screen.getByTestId('summary-header');
    expect(header).toHaveAttribute('data-format-message', 'true');
  });

  it('renders CustomSkeletonLoader when charts are loading', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: true, available: true }}
      />,
    );

    const skeleton = screen.getByTestId('custom-skeleton-loader');
    expect(skeleton).toHaveAttribute('data-type', 'charts');
    expect(screen.queryByTestId('charts-view')).not.toBeInTheDocument();
  });

  it('renders ChartsView when charts are available and not loading', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
      />,
    );

    const chartsView = screen.getByTestId('charts-view');
    expect(chartsView).toHaveAttribute('data-data', JSON.stringify(mockData));
    expect(chartsView).toHaveAttribute('data-format-message', 'true');
    expect(
      screen.queryByTestId('custom-skeleton-loader'),
    ).not.toBeInTheDocument();
  });

  it.each([
    ['empty object', {} as ResourceAllocationOverview],
    [
      'multiple keys',
      {
        mediaSpend: { total_per_year_full: {} },
        campaigns: { total_per_year_full: {} },
        megaBrands: { total_per_year_full: {} },
      } as unknown as ResourceAllocationOverview,
    ],
  ])('handles data: %s', (_, data) => {
    render(<SummaryView charts={{ data, loading: false, available: true }} />);

    const chartsView = screen.getByTestId('charts-view');
    expect(chartsView).toHaveAttribute('data-data', JSON.stringify(data));
  });

  it('does not render charts when not available', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: true, available: false }}
      />,
    );

    expect(
      screen.queryByTestId('custom-skeleton-loader'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('charts-view')).not.toBeInTheDocument();
  });

  it('calls useFeatureToggle with correct toggle name', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
      />,
    );

    expect(mockUseFeatureToggle).toHaveBeenCalledWith(
      'ai_summary_resource_allocation_overview',
    );
  });

  it.each([
    ['enabled and not loading', true, false, true],
    ['disabled', false, false, false],
    ['enabled but loading', true, true, false],
    ['undefined and loading', undefined, true, false],
    ['disabled and loading', false, true, false],
    ['undefined and not loading', undefined, false, false],
  ])(
    'handles AISummary when toggle is %s',
    (_, isEnabled, isLoading, shouldRender) => {
      mockUseFeatureToggle.mockReturnValue([isEnabled, isLoading]);

      render(
        <SummaryView
          charts={{ data: mockData, loading: false, available: true }}
        />,
      );

      if (shouldRender) {
        screen.getByTestId('ai-summary');
      } else {
        expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
      }
    },
  );

  it('passes correct props to AISummary', () => {
    mockUseFeatureToggle.mockReturnValue([true, false]);
    mockUseCurrentPage.mockReturnValue({
      currentPage: 'custom-page-name',
    } as any);

    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
      />,
    );

    const aiSummary = screen.getByTestId('ai-summary');
    expect(aiSummary).toHaveAttribute('data-page-name', 'custom-page-name');
    expect(aiSummary).toHaveAttribute('data-kpi-group', 'media');
  });

  it('passes custom dataTestId to AISummary', () => {
    mockUseFeatureToggle.mockReturnValue([true, false]);

    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
        dataTestId="test"
      />,
    );

    const aiSummary = screen.getByTestId('test-ai-summary');
    expect(aiSummary).toBeInTheDocument();
  });

  it('renders with custom dataTestId for all components', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
        dataTestId="test"
      />,
    );

    const expandableItem = screen.getByTestId('test-summary-view');
    const header = screen.getByTestId('test-summary-view-header');
    const container = screen.getByTestId('test-summary-view-container');
    const chartsView = screen.getByTestId('test-summary-view-charts');

    expect(expandableItem).toContainElement(container);
    expect(container).toContainElement(chartsView);
    expect(expandableItem).toContainElement(header);
  });

  it('renders with custom dataTestId for skeleton when loading', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: true, available: true }}
        dataTestId="test"
      />,
    );

    expect(
      screen.getByTestId('test-summary-view-skeleton'),
    ).toBeInTheDocument();
  });

  it('renders without custom dataTestId', () => {
    render(
      <SummaryView
        charts={{ data: mockData, loading: false, available: true }}
      />,
    );

    screen.getByTestId('summary-view-item');
    screen.getByTestId('summary-header');
    expect(screen.queryByTestId('test-summary-view')).not.toBeInTheDocument();
  });
});
