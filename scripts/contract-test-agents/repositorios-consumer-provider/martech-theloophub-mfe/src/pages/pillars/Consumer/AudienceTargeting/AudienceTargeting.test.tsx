import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AudienceTargeting } from './AudienceTargeting';
import { AudienceTargetingError } from './constants';

const mockNavigate = jest.fn();
const mockOpenFilterModal = jest.fn();

type BffResult = {
  data: unknown;
  loading: boolean;
  error: Error | null;
};

const makeBff = (overrides: Partial<BffResult> = {}): BffResult => ({
  data: null,
  loading: false,
  error: null,
  ...overrides,
});

let mockBffByIndex: BffResult[] = [];
let mockBffCallIndex = 0;

let mockCountryOptions: Array<{ value: string; label: string }> = [
  { value: 'BRA', label: 'Brazil' },
  { value: 'ARG', label: 'Argentina' },
];

let mockApplied: Record<string, unknown> = {
  country: 'BRA',
  audience_targeting_brands: 'Corona',
  audience_targeting_brands_comp: 'Skol',
  kpis: 'p4w',
};

let mockDataFilters: Record<string, unknown> = {};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (
      { id }: { id: string },
      values?: Record<string, string | number | undefined>,
    ) => {
      if (values?.country) return `${id}:${values.country}`;
      return id;
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ tab: 'definition' }),
  useNavigate: () => mockNavigate,
}));

jest.mock('contexts', () => ({
  useScopedModal: () => ({ open: mockOpenFilterModal }),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  useBffData: () => {
    const current = mockBffByIndex[mockBffCallIndex] ?? makeBff();
    mockBffCallIndex += 1;
    return current;
  },
  useFeatureToggle: () => [true, false],
  usePageFilterApplied: () => ({
    applied: mockApplied,
  }),
  usePageFilterData: () => ({ dataFilters: mockDataFilters }),
  usePageFilterStatus: () => ({
    status: 'loaded',
    isLoading: false,
    isLoaded: true,
    isError: false,
  }),
  usePageFilterManagement: () => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  }),
  useCurrentPage: () => ({ currentPage: 'definition' }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getCountry: () => ({ label: 'Brazil' }),
      getCountryOptions: () => mockCountryOptions,
    }),
  },
}));

jest.mock('components', () => ({
  RouteTabs: ({
    tabsInfos,
  }: {
    tabsInfos?: Array<{ content: React.ReactNode }>;
  }) => <div data-testid="route-tabs">{tabsInfos?.[0]?.content}</div>,
  StickyScrollWithFilters: () => (
    <div data-testid="sticky-scroll-with-filters" />
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledHomeContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledTitle: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <h1 data-testid={testId}>{children}</h1>,
}));

jest.mock('components/TabsWithFilters/TabsWithFilters.styles', () => ({
  StyledContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
  StyledContent: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
  StyledPageDescription: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <p data-testid={testId}>{children}</p>,
  StyledPageTitleContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
  StyledPageTitleContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledPageTitleRow: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('components/Filter', () => ({
  FILTER_MODAL_NAME: 'filter-modal',
}));

jest.mock('utils/tab', () => ({
  createTab: (id: string, label: string, content: React.ReactNode) => ({
    id,
    label,
    content,
  }),
}));

jest.mock('./tabs', () => ({
  Definition: () => <div data-testid="definition-tab" />,
  Performance: () => <div data-testid="performance-tab" />,
}));

jest.mock('./components', () => ({
  NoDataAvailable: ({
    dataTestId,
    title,
    actions = [],
  }: {
    dataTestId?: string;
    title?: string;
    actions?: Array<{ id: string; label: string; onClick: () => void }>;
  }) => (
    <div data-testid={dataTestId}>
      {title && <p>{title}</p>}
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          data-testid={`${dataTestId}-action-${a.id}`}
          onClick={a.onClick}
        >
          {a.label}
        </button>
      ))}
    </div>
  ),
}));

const setBffResults = (results: BffResult[]) => {
  mockBffByIndex = results;
  mockBffCallIndex = 0;
};

describe('AudienceTargeting global edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBffCallIndex = 0;
    mockCountryOptions = [
      { value: 'BRA', label: 'Brazil' },
      { value: 'ARG', label: 'Argentina' },
    ];
    mockApplied = {
      country: 'BRA',
      audience_targeting_brands: 'Corona',
      audience_targeting_brands_comp: 'Skol',
      kpis: 'p4w',
    };
    mockDataFilters = {};
  });

  test('should renders TabsWithFilters when no global edge state matches', () => {
    setBffResults([
      makeBff({ data: { 'audience-cards': [{}] } }),
      makeBff({ data: { 'core-audience-performance': [{}] } }),
      makeBff({ data: { breakdown: [{}] } }),
    ]);

    render(<AudienceTargeting />);

    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    expect(
      screen.queryByTestId('audience-targeting-data-refresh-fail'),
    ).not.toBeInTheDocument();
  });

  test('should does not render global empty state while any view is loading', () => {
    setBffResults([
      makeBff({ loading: true }),
      makeBff({
        error: new Error(AudienceTargetingError.DataRefreshFail),
      }),
      makeBff({
        error: new Error(AudienceTargetingError.DataRefreshFail),
      }),
    ]);

    render(<AudienceTargeting />);

    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    expect(
      screen.queryByTestId('audience-targeting-data-refresh-fail'),
    ).not.toBeInTheDocument();
  });

  test('should renders global data refresh fail empty state when all views fail with DataRefreshFail', () => {
    const err = new Error(AudienceTargetingError.DataRefreshFail);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-data-refresh-fail'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    expect(screen.getByTestId('audience-targeting-title')).toBeInTheDocument();
  });

  test('should does not render global data refresh fail when only some views fail', () => {
    const err = new Error(AudienceTargetingError.DataRefreshFail);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ data: { 'core-audience-performance': [{}] } }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    expect(
      screen.queryByTestId('audience-targeting-data-refresh-fail'),
    ).not.toBeInTheDocument();
  });

  test('should renders permission required with resetFilters when user has access to other countries', async () => {
    const user = userEvent.setup();
    const err = new Error(AudienceTargetingError.PermissionRequired);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-permission-required'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'audience-targeting-permission-required-action-reset-filters',
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId(
        'audience-targeting-permission-required-action-reset-filters',
      ),
    );
    expect(mockOpenFilterModal).toHaveBeenCalledTimes(1);
  });

  test('should renders permission required without resetFilters when user has no other country access', () => {
    mockCountryOptions = [{ value: 'BRA', label: 'Brazil' }];
    const err = new Error(AudienceTargetingError.PermissionRequired);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-permission-required'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        'audience-targeting-permission-required-action-reset-filters',
      ),
    ).not.toBeInTheDocument();
  });

  test('should renders no country data empty state when all views return empty and country is selected', () => {
    setBffResults([
      makeBff({
        data: {
          'audience-cards': [],
          'participation-breakdown': null,
        },
      }),
      makeBff({ data: { 'core-audience-performance': [] } }),
      makeBff({ data: { breakdown: [] } }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-no-country-data'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    expect(screen.queryByTestId('definition-tab')).not.toBeInTheDocument();
  });

  test('should navigates to /consumer when returnToHome is clicked on global empty state', async () => {
    const user = userEvent.setup();
    setBffResults([
      makeBff({ data: {} }),
      makeBff({ data: {} }),
      makeBff({ data: {} }),
    ]);

    render(<AudienceTargeting />);

    await user.click(
      screen.getByTestId(
        'audience-targeting-no-country-data-action-return-to-home',
      ),
    );

    expect(mockNavigate).toHaveBeenCalledWith('/consumer');
  });

  test('should data refresh fail takes priority over empty data', () => {
    const err = new Error(AudienceTargetingError.DataRefreshFail);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-data-refresh-fail'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('audience-targeting-no-country-data'),
    ).not.toBeInTheDocument();
  });

  test('should renders permissionRequiredNoOtherAccess when all views fail with PermissionRequiredNoOtherAccess', () => {
    mockCountryOptions = [{ value: 'BRA', label: 'Brazil' }];
    const err = new Error(
      AudienceTargetingError.PermissionRequiredNoOtherAccess,
    );
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-permission-required'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        'audience-targeting-permission-required-action-reset-filters',
      ),
    ).not.toBeInTheDocument();
  });

  test('should dataRefreshFail does NOT hide tabs (tabs remain visible)', () => {
    const err = new Error(AudienceTargetingError.DataRefreshFail);
    setBffResults([
      makeBff({ error: err }),
      makeBff({ error: err }),
      makeBff({ error: err }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-data-refresh-fail'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
  });

  test('renders noCountryData empty state when applied country has no audience_targeting_brands (Global Viewer with VN default)', () => {
    mockApplied = {
      country: 'VN',
      audience_targeting_brands: null,
      audience_targeting_brands_comp: null,
    };
    mockDataFilters = {
      audience_targeting_brands: {
        values: {
          BRA: [{ value: 'Corona', label: 'Corona' }],
        },
      },
    };
    setBffResults([makeBff({ loading: true }), makeBff({ loading: true })]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-no-country-data'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('tabs-with-filters')).not.toBeInTheDocument();
  });

  test('renders noCountryData empty state when filters loaded but no country is resolvable (Global Viewer out-of-scope)', () => {
    mockApplied = {};
    mockCountryOptions = [];
    setBffResults([makeBff({ loading: true }), makeBff({ loading: true })]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-no-country-data'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('tabs-with-filters')).not.toBeInTheDocument();
  });

  test('noCountryData hides tabs (RouteTabs not rendered)', () => {
    setBffResults([
      makeBff({ data: { 'audience-cards': [] } }),
      makeBff({ data: { 'core-audience-performance': [] } }),
      makeBff({ data: { breakdown: [] } }),
    ]);

    render(<AudienceTargeting />);

    expect(
      screen.getByTestId('audience-targeting-no-country-data'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('route-tabs')).not.toBeInTheDocument();
  });
});
