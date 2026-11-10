import { render, screen } from '@testing-library/react';

import * as configModule from './config';
import { GrowthLeagueTable } from './GrowthLeagueTable';

jest.mock('components', () => ({
  Table: ({
    dataTestId,
    data,
    rowHeight,
    headerHeight,
    columnDefsConfig,
    getRowHeight,
  }: {
    dataTestId?: string;
    data: unknown;
    rowHeight: number;
    headerHeight: number;
    columnDefsConfig: unknown;
    getRowHeight?: () => number;
  }) => {
    const dynamicHeight = getRowHeight?.();
    return (
      <div
        data-testid={dataTestId || 'table'}
        data-row-height={rowHeight}
        data-header-height={headerHeight}
        data-has-config={!!columnDefsConfig}
        data-has-data={!!data}
        data-dynamic-height={dynamicHeight}
      >
        Table Component
      </div>
    );
  },
}));

jest.mock('./config', () => ({
  tableConfig: jest.fn((allIds, isBrandView) => ({
    mockConfig: true,
    allIds,
    isBrandView,
  })),
}));

jest.mock('./GrowthLeagueTable.styles', () => ({
  StyledGrowthLeagueTable: { background: 'white' },
}));

const mockTableConfig = jest.mocked(configModule.tableConfig);

describe('GrowthLeagueTable', () => {
  const mockData = {
    header: [
      { id: 'rank', title: 'Rank' },
      { id: 'country', title: 'Country' },
    ],
    rows: [[{ rank: { value: 1 }, country: { value: 'Brazil' } }]],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the Table with data and column config', () => {
      render(<GrowthLeagueTable data={mockData} />);

      const table = screen.getByTestId('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-has-data', 'true');
      expect(table).toHaveAttribute('data-has-config', 'true');
    });

    it('renders with empty data', () => {
      render(<GrowthLeagueTable data={{ header: [], rows: [] }} />);

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('Table configuration', () => {
    it('passes rowHeight=52, headerHeight=59 and getRowHeight returning 52', () => {
      render(<GrowthLeagueTable data={mockData} />);

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-row-height', '52');
      expect(table).toHaveAttribute('data-header-height', '59');
      expect(table).toHaveAttribute('data-dynamic-height', '52');
    });
  });

  describe('Props forwarding to tableConfig', () => {
    it('passes allIds to tableConfig', () => {
      const allIds = ['score', 'points'];

      render(<GrowthLeagueTable data={mockData} allIds={allIds} />);

      expect(mockTableConfig).toHaveBeenCalledWith(allIds, undefined);
    });

    it('passes isBrandView to tableConfig', () => {
      render(<GrowthLeagueTable data={mockData} isBrandView={true} />);

      expect(mockTableConfig).toHaveBeenCalledWith(undefined, true);
    });

    it('passes both allIds and isBrandView to tableConfig', () => {
      const allIds = ['metric1', 'metric2'];

      render(
        <GrowthLeagueTable
          data={mockData}
          allIds={allIds}
          isBrandView={true}
        />,
      );

      expect(mockTableConfig).toHaveBeenCalledWith(allIds, true);
    });
  });

  describe('data-testid handling', () => {
    it('uses prefixed testid when dataTestId is provided', () => {
      render(<GrowthLeagueTable data={mockData} dataTestId="custom" />);

      expect(screen.getByTestId('custom-growth-league')).toBeInTheDocument();
    });

    it('renders no custom-prefixed testid when dataTestId is not provided', () => {
      const { container } = render(<GrowthLeagueTable data={mockData} />);

      expect(
        container.querySelectorAll('[data-testid^="custom-"]'),
      ).toHaveLength(0);
    });
  });
});
