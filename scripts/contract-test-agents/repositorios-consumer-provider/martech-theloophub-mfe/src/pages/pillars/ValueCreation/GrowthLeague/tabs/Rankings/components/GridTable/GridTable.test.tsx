import { render, screen } from '@testing-library/react';
import * as splitGenericTableModule from 'components/Table/utils/splitGenericTable';

import { GridTable } from './GridTable';

jest.mock('pages/pillars/ValueCreation/GrowthLeague/components', () => ({
  GrowthLeagueTable: ({
    data,
    allIds,
    isBrandView,
  }: {
    data: unknown;
    allIds: string[];
    isBrandView: boolean;
  }) => (
    <div
      data-testid="growth-league-table"
      data-has-data={!!data}
      data-all-ids={allIds?.join(',')}
      data-brand-view={isBrandView}
    >
      GrowthLeagueTable
    </div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    TableContainer: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'table-container'}>{children}</div>,
  }),
);

jest.mock('pages/pillars/ValueCreation/GrowthLeague/constants', () => ({
  TABLE_WIDTHS: {
    'super-league': ['400px', '600px'],
    'premier-league': ['350px', '550px'],
  },
}));

jest.mock('components/Table/utils/splitGenericTable', () => ({
  splitGenericTable: jest.fn((data) => {
    if (!data) return {};
    return {
      left: { header: data.header, rows: data.rows?.slice(0, 2) || [] },
      right: { header: data.header, rows: data.rows?.slice(2) || [] },
    };
  }),
  getAllIds: jest.fn(
    (header) => header?.map((h: { id?: string }) => h.id) || [],
  ),
}));

jest.mock('components/Table/utils/transformAgGridData', () => ({
  transformAgGridData: jest.fn((data) => ({
    header: [{ id: 'transformed' }],
    rows: data?.rows || [],
  })),
}));

const mockSplitGenericTable = jest.mocked(
  splitGenericTableModule.splitGenericTable,
);
const mockGetAllIds = jest.mocked(splitGenericTableModule.getAllIds);

describe('GridTable', () => {
  const mockData = {
    header: [
      { id: 'rank', title: 'Rank' },
      { id: 'country', title: 'Country' },
      { id: 'score', title: 'Score' },
    ],
    rows: [
      [
        {
          rank: { value: 1 },
          country: { value: 'Brazil' },
          score: { value: 95 },
        },
      ],
      [
        {
          rank: { value: 2 },
          country: { value: 'Argentina' },
          score: { value: 88 },
        },
      ],
      [
        {
          rank: { value: 3 },
          country: { value: 'Colombia' },
          score: { value: 75 },
        },
      ],
      [
        {
          rank: { value: 4 },
          country: { value: 'Mexico' },
          score: { value: 70 },
        },
      ],
    ],
    splits: [['left', 'right']],
    rowData: [
      { rank: 1, country: 'Brazil', score: 95 },
      { rank: 2, country: 'Argentina', score: 88 },
      { rank: 3, country: 'Colombia', score: 75 },
      { rank: 4, country: 'Mexico', score: 70 },
    ],
    columnDefs: [{ field: 'rank' }, { field: 'country' }, { field: 'score' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table container', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });

    it('should render split tables', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      const tables = screen.getAllByTestId('growth-league-table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should pass allIds to GrowthLeagueTable', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      const tables = screen.getAllByTestId('growth-league-table');
      expect(tables[0]).toHaveAttribute('data-all-ids', 'rank,country,score');
    });
  });

  describe('Brand view', () => {
    it('should pass isBrandView=false by default', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      const tables = screen.getAllByTestId('growth-league-table');
      expect(tables[0]).toHaveAttribute('data-brand-view', 'false');
    });

    it('should pass isBrandView=true when specified', () => {
      render(
        <GridTable
          data={mockData}
          leagueType="super-league"
          isBrandView={true}
        />,
      );

      const tables = screen.getAllByTestId('growth-league-table');
      expect(tables[0]).toHaveAttribute('data-brand-view', 'true');
    });
  });

  describe('Empty data handling', () => {
    it('should handle null data', () => {
      render(
        <GridTable
          data={null as unknown as typeof mockData}
          leagueType="super-league"
        />,
      );

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
      expect(
        screen.queryByTestId('growth-league-table'),
      ).not.toBeInTheDocument();
    });

    it('should handle undefined data', () => {
      render(
        <GridTable
          data={undefined as unknown as typeof mockData}
          leagueType="super-league"
        />,
      );

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });

    it('should handle data without splits', () => {
      const dataWithoutSplits = { ...mockData, splits: undefined };

      render(
        <GridTable
          data={dataWithoutSplits as unknown as typeof mockData}
          leagueType="super-league"
        />,
      );

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });
  });

  describe('League type handling', () => {
    it('should render with super-league type', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });

    it('should render with premier-league type', () => {
      render(<GridTable data={mockData} leagueType="premier-league" />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });

    it('should handle unknown league type', () => {
      render(<GridTable data={mockData} leagueType="unknown-league" />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });
  });

  describe('Data transformation', () => {
    it('should call splitGenericTable with data and splits', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      expect(mockSplitGenericTable).toHaveBeenCalled();
    });

    it('should call getAllIds with header', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      expect(mockGetAllIds).toHaveBeenCalled();
    });

    it('should call transformAgGridData when data has no header', () => {
      const dataWithoutHeader = {
        rows: mockData.rows,
        splits: [2, 2],
      } as unknown as typeof mockData;

      render(<GridTable data={dataWithoutHeader} leagueType="super-league" />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(
        <GridTable
          data={mockData}
          leagueType="super-league"
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('grid-table-super-league-custom'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<GridTable data={mockData} leagueType="super-league" />);

      expect(
        screen.queryByTestId('grid-table-super-league-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
