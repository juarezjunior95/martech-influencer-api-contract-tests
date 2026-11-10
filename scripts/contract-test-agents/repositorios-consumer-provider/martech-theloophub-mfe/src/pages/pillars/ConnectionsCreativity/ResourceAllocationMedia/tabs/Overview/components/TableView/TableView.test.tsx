import { useIntl } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { createGuidelineColumnConfig } from '../../config/tableConfig/tableConfig';
import { getDeepDiveHeaderMessage } from '../../utils';
import { TableView } from './TableView';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    isGlobalZone: false,
  })),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: { kpis: 'media_spend' },
  })),
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ id }) => id),
  })),
}));

jest.mock('components', () => ({
  Table: ({
    data,
    columnDefsConfig,
    headerHeight,
    rowHeight,
    style,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId ?? 'table'}
      data-data={JSON.stringify(data)}
      data-column-defs-config={JSON.stringify(columnDefsConfig)}
      data-header-height={headerHeight}
      data-row-height={rowHeight}
      data-style={JSON.stringify(style)}
    />
  ),
}));

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ length, width, height, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'skeleton-table'}
      data-length={length}
      data-width={width}
      data-height={height}
    />
  ),
}));

jest.mock('pages/components/ConnectionsCreativity', () => ({
  DeepDiveChartHeader: ({ title, measure, tooltip, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'deep-dive-chart-header'}
      data-title={title}
      data-measure={measure}
      data-tooltip={tooltip}
    />
  ),
}));

jest.mock('../../config/tableConfig/tableConfig', () => ({
  __esModule: true,
  default: {
    countries: { minWidth: 202 },
    brands: { minWidth: 202 },
    ly: { minWidth: 202 },
    bu: { minWidth: 202 },
    current_year_: { minWidth: 202 },
    previous_year_: { minWidth: 202 },
    guideline: { minWidth: 202 },
  },
  createGuidelineColumnConfig: jest.fn((shouldShowTooltip, tooltipMessage) => ({
    minWidth: 202,
    ...(shouldShowTooltip && {
      headerTooltip: tooltipMessage,
      headerComponentParams: {
        tooltip: true,
        tooltipHideIcon: false,
        tooltipCellStyle: 'dark',
        tooltipHeaderStyle: 'dark',
      },
    }),
  })),
}));

jest.mock('../../utils', () => ({
  getDeepDiveHeaderMessage: jest.fn(() => ({
    title: 'Mock Title',
    measure: 'Mock Measure',
    tooltip: 'Mock Tooltip',
    shouldShowGuidelineColumnTooltip: false,
    guidelineColumnTooltipMessage: '',
  })),
}));

describe('TableView', () => {
  const mockTableData: TableDataType = {
    header: [{ field: 'countries', headerName: 'Countries' }],
    rows: [{ countries: 'Brazil' }],
  } as unknown as TableDataType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Skeleton when loading', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={true}
        selectedView="breakdown_toggle"
      />,
    );

    const skeleton = screen.getByTestId('skeleton-table');
    expect(skeleton).toHaveAttribute('data-length', '1');
    expect(skeleton).toHaveAttribute('data-width', '100%');
    expect(skeleton).toHaveAttribute('data-height', '500px');
    expect(
      screen.queryByTestId('deep-dive-chart-header'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
  });

  it('renders DeepDiveChartHeader and Table when not loading', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    const header = screen.getByTestId('deep-dive-chart-header');
    expect(header).toHaveAttribute('data-title', 'Mock Title');
    expect(header).toHaveAttribute('data-measure', 'Mock Measure');
    expect(header).toHaveAttribute('data-tooltip', 'Mock Tooltip');

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-data', JSON.stringify(mockTableData));
    expect(table).toHaveAttribute('data-header-height', '36');
    expect(table).toHaveAttribute('data-row-height', '36');
    expect(screen.queryByTestId('skeleton-table')).not.toBeInTheDocument();
  });

  it('calls getDeepDiveHeaderMessage with correct params', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    expect(getDeepDiveHeaderMessage).toHaveBeenCalledWith({
      activeSubFilters: { kpis: 'media_spend' },
      isGlobalZone: false,
      data: mockTableData,
      formatMessage: expect.any(Function),
      selectedView: 'breakdown_toggle',
    });
  });

  it.each([
    ['breakdown_toggle', 'breakdown_toggle'],
    ['ranking_toggle', 'ranking_toggle'],
    [undefined, undefined],
  ])('handles selectedView: %s', (selectedView, expected) => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView={selectedView}
      />,
    );

    expect(getDeepDiveHeaderMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedView: expected,
      }),
    );
  });

  it.each([
    ['default config', false, ''],
    ['with tooltip', true, 'Guideline Tooltip Message'],
  ])(
    'calls createGuidelineColumnConfig: %s',
    (_, shouldShow, tooltipMessage) => {
      (getDeepDiveHeaderMessage as jest.Mock).mockReturnValue({
        title: 'Mock Title',
        measure: 'Mock Measure',
        tooltip: 'Mock Tooltip',
        shouldShowGuidelineColumnTooltip: shouldShow,
        guidelineColumnTooltipMessage: tooltipMessage,
      });

      render(
        <TableView
          tableData={mockTableData}
          loadingTableBreakdown={false}
          selectedView="breakdown_toggle"
        />,
      );

      expect(createGuidelineColumnConfig).toHaveBeenCalledWith(
        shouldShow,
        tooltipMessage,
      );
    },
  );

  it.each([
    ['usePageFilterApplied', usePageFilterApplied],
    ['useSubFilters', useSubFilters],
    ['useIntl', useIntl],
  ])('uses %s hook', (_, hookMock) => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    expect(hookMock).toHaveBeenCalled();
  });

  it.each([
    ['empty object', {} as TableDataType, true, JSON.stringify({})],
    ['null', null, false, ''],
    [
      'complex data',
      {
        header: [
          { field: 'countries', headerName: 'Countries' },
          { field: 'brands', headerName: 'Brands' },
          { field: 'ly', headerName: 'LY' },
        ],
        rows: [
          { countries: 'Brazil', brands: 'Brand A', ly: 100 },
          { countries: 'Mexico', brands: 'Brand B', ly: 200 },
        ],
      } as unknown as TableDataType,
      true,
      JSON.stringify({
        header: [
          { field: 'countries', headerName: 'Countries' },
          { field: 'brands', headerName: 'Brands' },
          { field: 'ly', headerName: 'LY' },
        ],
        rows: [
          { countries: 'Brazil', brands: 'Brand A', ly: 100 },
          { countries: 'Mexico', brands: 'Brand B', ly: 200 },
        ],
      }),
    ],
  ])('handles tableData: %s', (_, tableData, shouldRender, expectedData) => {
    render(
      <TableView
        tableData={tableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    screen.getByTestId('deep-dive-chart-header');

    if (shouldRender) {
      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-data', expectedData);
    } else {
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    }
  });

  it.each([
    ['isGlobalZone true', { isGlobalZone: true }, undefined],
    [
      'different activeSubFilters',
      undefined,
      { activeSubFilters: { kpis: 'campaigns' } },
    ],
  ])('works with %s', (_, pageFilterValue, subFiltersValue) => {
    if (pageFilterValue) {
      (usePageFilterApplied as jest.Mock).mockReturnValue(pageFilterValue);
    }
    if (subFiltersValue) {
      (useSubFilters as jest.Mock).mockReturnValue(subFiltersValue);
    }

    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    screen.getByTestId('deep-dive-chart-header');
  });

  it('renders with custom dataTestId for Skeleton when loading', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={true}
        selectedView="breakdown_toggle"
        dataTestId="test"
      />,
    );

    expect(screen.getByTestId('skeleton-stest-table-view')).toBeInTheDocument();
  });

  it('renders with custom dataTestId for all components', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
        dataTestId="test"
      />,
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test-table-view')).toBeInTheDocument();
  });

  it('renders without custom dataTestId', () => {
    render(
      <TableView
        tableData={mockTableData}
        loadingTableBreakdown={false}
        selectedView="breakdown_toggle"
      />,
    );

    screen.getByTestId('deep-dive-chart-header');
    screen.getByTestId('table');
    expect(screen.queryByTestId('test')).not.toBeInTheDocument();
  });
});
