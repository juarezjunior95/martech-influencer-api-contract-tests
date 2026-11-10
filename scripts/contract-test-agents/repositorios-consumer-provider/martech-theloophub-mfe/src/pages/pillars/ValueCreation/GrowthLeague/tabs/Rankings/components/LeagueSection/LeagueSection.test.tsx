import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import * as useKpiRequestsModule from '../../hooks/useKpiRequests';
import { LeagueSection } from './LeagueSection';

jest.mock('../../hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(),
}));

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    options,
    value,
    onValueChange,
    'data-testid': dataTestId,
  }: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onValueChange: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'segmented-control'} data-value={value}>
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../LoadingTableSkeleton/LoadingTableSkeleton', () => ({
  LoadingTableSkeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div
      data-testid={
        dataTestId
          ? `loading-table-skeleton-${dataTestId}`
          : 'loading-table-skeleton'
      }
    >
      Loading...
    </div>
  ),
}));

jest.mock('../GridTable/GridTable', () => ({
  GridTable: ({ data, leagueType }: { data: unknown; leagueType: string }) => (
    <div
      data-testid="grid-table"
      data-league-type={leagueType}
      data-has-data={!!data}
    >
      GridTable
    </div>
  ),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: () => <div data-testid="no-data-yet">No data available</div>,
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    StyledSection: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'styled-section'}>{children}</div>,
  }),
);

jest.mock('utils/container', () => ({
  ContainerWithScroll: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'container-scroll'}>{children}</div>,
}));

jest.mock('./LeagueSection.styles', () => ({
  StyledEmptyContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-container">{children}</div>
  ),
}));

const messages = flattenObject(enUS);

const mockUseKpiRequests = useKpiRequestsModule.useKpiRequests as jest.Mock;

const mockSetLeagueType = jest.fn();

const defaultProps = {
  leagueType: 'super-league',
  setLeagueType: mockSetLeagueType,
};

const mockLoadingLeague = { kpiData: null, loading: true, error: null };
const mockDataLeague = {
  kpiData: { table: { header: [], rows: [] }, empty: false },
  loading: false,
  error: null,
};
const mockEmptyLeague = {
  kpiData: { table: null as any, empty: true },
  loading: false,
  error: null,
};
const mockAgGridLeague = {
  kpiData: {
    table: { columnDefs: [{ field: 'rank' }], rowData: [] },
    empty: false,
  },
  loading: false,
  error: null,
};

type LeagueMock = {
  kpiData: { table: Record<string, unknown> | null; empty: boolean } | null;
  loading: boolean;
  error: unknown;
};

const createMockReturn = (
  superLeague: LeagueMock = mockDataLeague,
  premierLeague: LeagueMock = mockDataLeague,
) => ({
  leagues: { superLeague, premierLeague },
  loading: superLeague.loading || premierLeague.loading,
});

const renderSection = (
  props?: Partial<typeof defaultProps & { dataTestId?: string }>,
) =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <LeagueSection {...defaultProps} {...props} />
    </IntlProvider>,
  );

describe('LeagueSection (Rankings)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseKpiRequests.mockReturnValue(createMockReturn());
  });

  describe('Rendering', () => {
    it('renders LeagueSelector with real i18n labels, styled section and scroll container', () => {
      renderSection();

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByText('Super League')).toBeInTheDocument();
      expect(screen.getByText('Premier League')).toBeInTheDocument();
      expect(screen.getByTestId('styled-section')).toBeInTheDocument();
      expect(screen.getByTestId('container-scroll')).toBeInTheDocument();
    });

    it('passes leagueType to LeagueSelector', () => {
      renderSection({ leagueType: 'premier-league' });

      const control = screen.getByTestId('segmented-control');
      expect(control).toHaveAttribute('data-value', 'premier-league');
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton (via dataTestId) and hides GridTable when loading', () => {
      mockUseKpiRequests.mockReturnValue(
        createMockReturn(mockLoadingLeague, mockLoadingLeague),
      );

      renderSection({ dataTestId: 'test' });

      expect(
        screen.getByTestId('loading-table-skeleton-test-league-section'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('grid-table')).not.toBeInTheDocument();
    });

    it('renders GridTable and no loading skeleton when not loading', () => {
      renderSection();

      expect(screen.getByTestId('grid-table')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders NoDataYet and empty container when data is empty', () => {
      mockUseKpiRequests.mockReturnValue(
        createMockReturn(mockEmptyLeague, mockEmptyLeague),
      );

      renderSection();

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
      expect(screen.getByTestId('empty-container')).toBeInTheDocument();
      expect(screen.queryByTestId('grid-table')).not.toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('renders GridTable for super-league with correct leagueType prop', () => {
      renderSection({ leagueType: 'super-league' });

      expect(screen.getByTestId('grid-table')).toBeInTheDocument();
      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-league-type',
        'super-league',
      );
    });

    it('renders GridTable for premier-league with correct leagueType prop', () => {
      renderSection({ leagueType: 'premier-league' });

      expect(screen.getByTestId('grid-table')).toBeInTheDocument();
      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-league-type',
        'premier-league',
      );
    });

    it('renders GridTable when table has columnDefs (AgGrid format) instead of header', () => {
      mockUseKpiRequests.mockReturnValue(
        createMockReturn(mockAgGridLeague, mockAgGridLeague),
      );

      renderSection({ leagueType: 'super-league' });

      expect(screen.getByTestId('grid-table')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = renderSection({ dataTestId: 'custom' });
      expect(screen.getByTestId('league-section-custom')).toBeInTheDocument();

      rerender(
        <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
          <LeagueSection {...defaultProps} />
        </IntlProvider>,
      );
      expect(
        screen.queryByTestId('league-section-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
