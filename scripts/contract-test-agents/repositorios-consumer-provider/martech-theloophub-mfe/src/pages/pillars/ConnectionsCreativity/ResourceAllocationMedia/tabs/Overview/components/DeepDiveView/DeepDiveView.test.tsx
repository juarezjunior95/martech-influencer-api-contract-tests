import { fireEvent, render, screen } from '@testing-library/react';

import { VIEW_TYPES } from '../../constants';
import { DeepDiveView } from './DeepDiveView';

jest.mock('pages/constants', () => ({
  LEGEND_CONFIG: [
    { label: 'Megabrands', color: '#FFC107', fontWeight: 'bold' },
    { label: 'Expansion', color: '#E91E63', fontWeight: 'bold' },
    { label: 'Sustain', color: '#2196F3', fontWeight: 'bold' },
    { label: 'Tail', color: '#9C27B0', fontWeight: 'bold' },
  ],
}));

jest.mock('components', () => ({
  Expandable: {
    Item: ({
      id,
      headerCustomized,
      expandableChildren,
      'data-testid': dataTestId,
    }: any) => (
      <div data-testid={dataTestId || id}>
        {headerCustomized}
        {expandableChildren}
      </div>
    ),
  },
  Legend: ({ caption, legendPosition, dataTestId }: any) => (
    <div data-testid={dataTestId || 'legend'} data-position={legendPosition}>
      {caption.map((item: any, index: number) => (
        <span key={index}>{item.label}</span>
      ))}
    </div>
  ),
}));

jest.mock('../DeepDiveHeader/DeepDiveHeader', () => ({
  __esModule: true,
  default: ({
    selectedView,
    onViewChange,
    isBreakdownViewer,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'deep-dive-header'}
      data-selected-view={selectedView}
      data-is-breakdown-viewer={isBreakdownViewer}
    >
      <button
        data-testid="switch-to-breakdown"
        onClick={() => onViewChange('breakdown_toggle')}
      >
        Switch to Breakdown
      </button>
      <button
        data-testid="switch-to-ranking"
        onClick={() => onViewChange('ranking_toggle')}
      >
        Switch to Ranking
      </button>
    </div>
  ),
}));

jest.mock('../RankingView/RankingView', () => ({
  RankingView: ({ data, loadingRanking, selectedView, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'ranking-view'}
      data-loading={loadingRanking}
      data-selected-view={selectedView}
    >
      {JSON.stringify(data)}
    </div>
  ),
}));

jest.mock('../TableView/TableView', () => ({
  TableView: ({
    tableData,
    loadingTableBreakdown,
    selectedView,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'table-view'}
      data-loading={loadingTableBreakdown}
      data-selected-view={selectedView}
    >
      {JSON.stringify(tableData)}
    </div>
  ),
}));

const mockTrackGA = jest.fn();

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => mockTrackGA,
}));

describe('DeepDiveView', () => {
  const mockTableData = {
    kpis: { rowData: [{ id: 1 }], columnDefs: [] },
    other: { rowData: [{ id: 2 }], columnDefs: [] },
  };

  const mockRankingData = {
    kpis: {
      datasets: [{ data: [1, 2, 3], baseChartColor: ['#000'] }],
      labels: ['A', 'B', 'C'],
    },
    other: {
      datasets: [{ data: [4, 5, 6] }],
      labels: ['D', 'E', 'F'],
    },
  };

  const mockDataSource = {
    charts: {
      data: {},
      loading: false,
      available: true,
    },
    table: {
      data: mockTableData,
      loading: false,
      available: true,
    },
    ranking: {
      data: mockRankingData,
      loading: false,
      available: true,
    },
  } as any;

  const defaultProps = {
    dataSource: mockDataSource,
    activeDeepDiveSubfilter: 'kpis',
    isBreakdownViewer: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<DeepDiveView {...defaultProps} {...overrideProps} />);
  };

  it('renders Expandable.Item and DeepDiveHeader with correct initial state', () => {
    renderComponent({ isBreakdownViewer: false });

    screen.getByTestId('overview-deep-dive');
    const header = screen.getByTestId('deep-dive-header');
    expect(header).toHaveAttribute('data-is-breakdown-viewer', 'false');
    expect(header).toHaveAttribute('data-selected-view', VIEW_TYPES.RANKING);
  });

  it('renders DeepDiveHeader with breakdown state when isBreakdownViewer is true', () => {
    renderComponent({ isBreakdownViewer: true });

    const header = screen.getByTestId('deep-dive-header');
    expect(header).toHaveAttribute('data-is-breakdown-viewer', 'true');
    expect(header).toHaveAttribute('data-selected-view', VIEW_TYPES.BREAKDOWN);
  });

  it.each([
    {
      isBreakdownViewer: false,
      expectedView: 'ranking-view',
      notExpectedView: 'table-view',
      viewType: VIEW_TYPES.RANKING,
    },
    {
      isBreakdownViewer: true,
      expectedView: 'table-view',
      notExpectedView: 'ranking-view',
      viewType: VIEW_TYPES.BREAKDOWN,
    },
  ])(
    'renders $expectedView when isBreakdownViewer is $isBreakdownViewer',
    ({ isBreakdownViewer, expectedView, notExpectedView, viewType }) => {
      renderComponent({ isBreakdownViewer });

      screen.getByTestId(expectedView);
      expect(screen.queryByTestId(notExpectedView)).not.toBeInTheDocument();
      expect(screen.getByTestId(expectedView)).toHaveAttribute(
        'data-selected-view',
        viewType,
      );
    },
  );

  it.each([
    {
      initialView: false,
      buttonTestId: 'switch-to-breakdown',
      initialTestId: 'ranking-view',
      finalTestId: 'table-view',
      gaLabel: 'breakdown_toggle',
      finalViewType: VIEW_TYPES.BREAKDOWN,
    },
    {
      initialView: true,
      buttonTestId: 'switch-to-ranking',
      initialTestId: 'table-view',
      finalTestId: 'ranking-view',
      gaLabel: 'ranking_toggle',
      finalViewType: VIEW_TYPES.RANKING,
    },
  ])(
    'switches view and tracks GA when clicking $buttonTestId',
    ({
      initialView,
      buttonTestId,
      initialTestId,
      finalTestId,
      gaLabel,
      finalViewType,
    }) => {
      renderComponent({ isBreakdownViewer: initialView });

      screen.getByTestId(initialTestId);
      expect(screen.queryByTestId(finalTestId)).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(buttonTestId));

      screen.getByTestId(finalTestId);
      expect(screen.queryByTestId(initialTestId)).not.toBeInTheDocument();
      expect(screen.getByTestId('deep-dive-header')).toHaveAttribute(
        'data-selected-view',
        finalViewType,
      );
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Deep Dive View Select',
        event_action: 'Select',
        event_label: gaLabel,
      });
    },
  );

  it.each([
    {
      subfilter: 'kpis',
      isBreakdownViewer: false,
      testId: 'ranking-view',
      expectedData: mockRankingData.kpis,
    },
    {
      subfilter: 'other',
      isBreakdownViewer: false,
      testId: 'ranking-view',
      expectedData: mockRankingData.other,
    },
    {
      subfilter: 'kpis',
      isBreakdownViewer: true,
      testId: 'table-view',
      expectedData: mockTableData.kpis,
    },
    {
      subfilter: 'other',
      isBreakdownViewer: true,
      testId: 'table-view',
      expectedData: mockTableData.other,
    },
  ])(
    'passes correct data to view based on activeDeepDiveSubfilter=$subfilter and isBreakdownViewer=$isBreakdownViewer',
    ({ subfilter, isBreakdownViewer, testId, expectedData }) => {
      renderComponent({
        activeDeepDiveSubfilter: subfilter,
        isBreakdownViewer,
      });

      expect(screen.getByTestId(testId)).toHaveTextContent(
        JSON.stringify(expectedData),
      );
    },
  );

  it.each([
    {
      isBreakdownViewer: false,
      dataSourceKey: 'ranking',
      testId: 'ranking-view',
    },
    { isBreakdownViewer: true, dataSourceKey: 'table', testId: 'table-view' },
  ])(
    'passes loading state to $testId',
    ({ isBreakdownViewer, dataSourceKey, testId }) => {
      const loadingDataSource = {
        ...mockDataSource,
        [dataSourceKey]: { ...mockDataSource[dataSourceKey], loading: true },
      } as any;
      renderComponent({
        dataSource: loadingDataSource,
        isBreakdownViewer,
      });

      expect(screen.getByTestId(testId)).toHaveAttribute(
        'data-loading',
        'true',
      );
    },
  );

  it('renders Legend when ranking data has baseChartColor', () => {
    renderComponent({ isBreakdownViewer: false });

    const legend = screen.getByTestId('legend');
    expect(legend).toHaveAttribute('data-position', 'left');
  });

  it('does not render Legend when ranking data does not have baseChartColor', () => {
    const noColorDataSource = {
      ...mockDataSource,
      ranking: {
        ...mockDataSource.ranking,
        data: {
          kpis: {
            datasets: [{ data: [1, 2, 3] }],
            labels: ['A', 'B', 'C'],
          },
        },
      },
    } as any;
    renderComponent({
      dataSource: noColorDataSource,
      isBreakdownViewer: false,
    });

    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('extracts chart data from nested object when ranking data does not have datasets directly', () => {
    const nestedDataSource = {
      ...mockDataSource,
      ranking: {
        ...mockDataSource.ranking,
        data: {
          kpis: {
            nestedKey: {
              datasets: [{ data: [1, 2, 3], baseChartColor: ['#fff'] }],
              labels: ['X', 'Y', 'Z'],
            },
          },
        },
      },
    } as any;
    renderComponent({ dataSource: nestedDataSource, isBreakdownViewer: false });

    const legend = screen.getByTestId('legend');
    expect(legend).toBeInTheDocument();
  });

  it('handles invalid ranking data without datasets', () => {
    const invalidDataSource = {
      ...mockDataSource,
      ranking: {
        ...mockDataSource.ranking,
        data: {
          kpis: null,
        },
      },
    } as any;
    renderComponent({
      dataSource: invalidDataSource,
      isBreakdownViewer: false,
    });

    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('handles GA tracking error gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockTrackGA.mockImplementation(() => {
      throw new Error('GA tracking error');
    });

    renderComponent({ isBreakdownViewer: false });

    fireEvent.click(screen.getByTestId('switch-to-breakdown'));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to track Google Analytics event:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  describe('Custom dataTestId', () => {
    it('renders custom dataTestId for all components in ranking view', () => {
      renderComponent({ dataTestId: 'custom', isBreakdownViewer: false });

      expect(screen.getByTestId('custom-deep-dive-view')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-ranking'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-ranking-chart'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-ranking-legend-wrapper'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-ranking-legend'),
      ).toBeInTheDocument();
    });

    it('renders custom dataTestId for breakdown view', () => {
      renderComponent({ dataTestId: 'custom', isBreakdownViewer: true });

      expect(screen.getByTestId('custom-deep-dive-view')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-breakdown'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-deep-dive-view-breakdown-table'),
      ).toBeInTheDocument();
    });
  });

  describe('Data extraction edge cases', () => {
    it('passes undefined to TableView when table data is null', () => {
      const nullTableDataSource = {
        ...mockDataSource,
        table: { ...mockDataSource.table, data: null },
      } as any;
      renderComponent({
        dataSource: nullTableDataSource,
        isBreakdownViewer: true,
      });

      const tableView = screen.getByTestId('table-view');
      expect(tableView).toHaveTextContent('');
    });

    it('passes undefined to RankingView when ranking data is null', () => {
      const nullRankingDataSource = {
        ...mockDataSource,
        ranking: { ...mockDataSource.ranking, data: null },
      } as any;
      renderComponent({
        dataSource: nullRankingDataSource,
        isBreakdownViewer: false,
      });

      const rankingView = screen.getByTestId('ranking-view');
      expect(rankingView).toHaveTextContent('');
    });

    it('passes undefined when activeDeepDiveSubfilter is null', () => {
      renderComponent({
        activeDeepDiveSubfilter: null as any,
        isBreakdownViewer: false,
      });

      const rankingView = screen.getByTestId('ranking-view');
      expect(rankingView).toHaveTextContent('');
    });

    it('passes undefined to TableView when activeDeepDiveSubfilter is null', () => {
      renderComponent({
        activeDeepDiveSubfilter: null as any,
        isBreakdownViewer: true,
      });

      const tableView = screen.getByTestId('table-view');
      expect(tableView).toHaveTextContent('');
    });
  });
});
