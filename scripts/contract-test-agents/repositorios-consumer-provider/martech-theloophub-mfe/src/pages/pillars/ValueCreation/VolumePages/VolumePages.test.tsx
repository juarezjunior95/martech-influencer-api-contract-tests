import { useParams } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { VolumePages } from './VolumePages';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id ?? '',
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('pages', () => ({
  VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME:
    '/value-creation/volume-pages-country-ppr',
  VOLUME_PAGES_PAGE_NAME: '/value-creation/volume-pages',
}));

jest.mock('hooks/useFilters', () => ({
  usePageFilterApplied: jest.fn(() => ({
    applied: {},
    isGlobalZone: false,
  })),
}));

jest.mock('hooks', () => ({
  useFeatureToggle: jest.fn(),
}));

jest.mock('@hexa-ui/components', () => ({
  Grid: {
    Item: ({ children, style, ...props }: any) => (
      <div
        data-testid={props['data-testid'] ?? 'grid-item'}
        data-xs={props.xs}
        data-sm={props.sm}
        data-md={props.md}
        data-lg={props.lg}
        data-xl={props.xl}
        style={style}
      >
        {children}
      </div>
    ),
  },
}));

jest.mock('components', () => ({
  Breadcrumbs: ({ pageList }: { pageList: unknown[] }) => (
    <div data-testid="breadcrumbs" data-page-list={JSON.stringify(pageList)}>
      Breadcrumbs
    </div>
  ),
  RouteTabs: ({
    baseRoute,
    onTabChange,
    disableTabs,
    tabsInfos,
    dataTestId,
    ...props
  }: any) => (
    <div data-testid={dataTestId ?? 'route-tabs'}>
      <div data-testid="base-route">{baseRoute}</div>
      <div data-testid="disable-tabs">{String(disableTabs)}</div>
      {tabsInfos.map((tab: any) => (
        <div key={tab.id} data-testid={`tab-${tab.id}`}>
          <div data-testid={`tab-${tab.id}-label`}>{tab.label}</div>
          <div data-testid={`tab-${tab.id}-disabled`}>
            {String(tab.disabled)}
          </div>
          <button
            data-testid={`tab-${tab.id}-trigger`}
            onClick={() => onTabChange(tab.id)}
          >
            Change Tab
          </button>
          {tab.content}
        </div>
      ))}
    </div>
  ),
  StickyScrollWithFilters: (props: any) => (
    <div>
      <div
        data-testid={props.filter.dataTestId ?? 'filter'}
        data-page-name={props.filter.pageName}
        data-hidden={props.filter.hidden}
        {...props.filter}
      >
        <div data-testid="filters-list">
          {JSON.stringify(props.filter.visibleFields)}
        </div>
        <div data-testid="filter-params">
          {JSON.stringify(props.filter.params)}
        </div>
      </div>
      <div
        data-testid="breadcrumbs"
        data-page-list={JSON.stringify(props.breadcrumbs.pageList)}
      >
        Breadcrumbs
      </div>
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children, isExportPage, ...props }: any) => (
    <div
      data-testid={props['data-testid'] ?? 'grid-container'}
      data-is-in-pr-pages={isExportPage}
    >
      {children}
    </div>
  ),
  StyledGridItem: ({ children, style, ...props }: any) => (
    <div
      data-testid={props['data-testid'] ?? 'grid-item'}
      data-xs={props.xs}
      data-sm={props.sm}
      data-md={props.md}
      data-lg={props.lg}
      data-xl={props.xl}
      style={style}
    >
      {children}
    </div>
  ),
}));

jest.mock('./tabs', () => ({
  Global: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'global-tab'}>Global</div>
  ),
  Country: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'country-tab'}>Country</div>
  ),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseFeatureToggle = jest.requireMock('hooks')
  .useFeatureToggle as jest.Mock;

describe('VolumePages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({});
    mockUseFeatureToggle.mockReturnValue([false, false]);
  });

  describe('Basic Rendering', () => {
    it('should render main container', () => {
      render(<VolumePages />);

      const volumePagesRoot = screen
        .getAllByTestId('volume-pages')
        .find((el) => el.getAttribute('data-is-in-pr-pages') === 'true');
      expect(volumePagesRoot).toBeInTheDocument();
    });

    it('should render with isExportPage prop', () => {
      render(<VolumePages />);

      const volumePagesRoot = screen
        .getAllByTestId('volume-pages')
        .find((el) => el.getAttribute('data-is-in-pr-pages') === 'true');
      expect(volumePagesRoot).toHaveAttribute('data-is-in-pr-pages', 'true');
    });

    it('should render StyledGridItem', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-grid-item')).toBeInTheDocument();
    });

    it('should render StyledGridItem with correct responsive props', () => {
      render(<VolumePages />);

      const gridItem = screen.getByTestId('volume-pages-grid-item');
      expect(gridItem).toHaveAttribute('data-xs', '12');
      expect(gridItem).toHaveAttribute('data-sm', '12');
      expect(gridItem).toHaveAttribute('data-md', '12');
      expect(gridItem).toHaveAttribute('data-lg', '12');
      expect(gridItem).toHaveAttribute('data-xl', '12');
    });

    it('should render StyledGridItem with correct style', () => {
      render(<VolumePages />);

      const gridItem = screen.getByTestId('volume-pages-grid-item');
      expect(gridItem).toHaveStyle({ marginTop: '24px' });
    });

    it('should render RouteTabs', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-route-tabs')).toBeInTheDocument();
    });

    it('should render Filter', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toBeInTheDocument();
    });
  });

  describe('RouteTabs Props', () => {
    it('should pass correct baseRoute to RouteTabs', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('base-route').textContent).toBe(
        '/value-creation/volume-pages',
      );
    });

    it('should not pass disableTabs prop', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('disable-tabs').textContent).toBe('undefined');
    });

    it('should render all 2 tabs', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-global')).toBeInTheDocument();
      expect(screen.getByTestId('tab-country')).toBeInTheDocument();
    });

    it('should render correct labels for all tabs', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-global-label').textContent).toBe('Global');
      expect(screen.getByTestId('tab-country-label').textContent).toBe(
        'Country',
      );
    });

    it('should set all tabs as not disabled', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-global-disabled').textContent).toBe(
        'false',
      );
      expect(screen.getByTestId('tab-country-disabled').textContent).toBe(
        'false',
      );
    });
  });

  describe('Tab Content Components', () => {
    it('should render Global tab content', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-global')).toBeInTheDocument();
    });

    it('should render Country tab content', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-country')).toBeInTheDocument();
    });
  });

  describe('Filter Props', () => {
    it('should pass correct pageName to Filter', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-page-name',
        'value-creation_volume-pages',
      );
    });

    it('should always show Filter on Volume Pages', () => {
      render(<VolumePages />);
      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });

    it('should include product_scope when feature toggle is enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });
      mockUseFeatureToggle.mockReturnValue([true, false]);
      render(<VolumePages />);

      expect(screen.getByTestId('filters-list').textContent).toBe(
        JSON.stringify(['zone', 'country', 'product_scope']),
      );
    });
    it('should NOT include product_scope on Net Revenue Pages even with feature toggle enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<VolumePages kpi="nr" />);

      const fields = JSON.parse(
        screen.getByTestId('filters-list').textContent!,
      );
      expect(fields).not.toContain('product_scope');
    });

    it('should NOT include product_scope on Market Share Pages even with feature toggle enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<VolumePages kpi="market_share" />);

      const fields = JSON.parse(
        screen.getByTestId('filters-list').textContent!,
      );
      expect(fields).not.toContain('product_scope');
    });

    it('should still include product_scope on Volume Pages country tab with feature toggle enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<VolumePages kpi="volume" />);

      const fields = JSON.parse(
        screen.getByTestId('filters-list').textContent!,
      );
      expect(fields).toContain('product_scope');
    });
  });

  describe('useParams Hook', () => {
    it('should set activeTab to global when no tab param', () => {
      mockUseParams.mockReturnValue({});

      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });

    it('should set activeTab from URL param', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });

      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });

    it('should handle different tab params', () => {
      mockUseParams.mockReturnValue({ tab: 'global' });

      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });
  });

  describe('State Management - activeTab', () => {
    describe('State Management - filter visibility by KPI', () => {
      it('should keep Filter visible on Volume Pages when no tab param', () => {
        mockUseParams.mockReturnValue({});

        render(<VolumePages />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'false',
        );
      });

      it('should keep Filter visible on Volume Pages regardless of tab', () => {
        mockUseParams.mockReturnValue({ tab: 'global' });

        render(<VolumePages kpi="volume" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'false',
        );
      });

      it('should hide Filter on Net Revenue Pages outside Country tab', () => {
        mockUseParams.mockReturnValue({ tab: 'global' });

        render(<VolumePages kpi="nr" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'true',
        );
      });

      it('should show Filter on Net Revenue Pages Country tab', () => {
        mockUseParams.mockReturnValue({ tab: 'country' });

        render(<VolumePages kpi="nr" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'false',
        );
      });
    });
  });

  describe('State Management', () => {
    it('should render without isExporting state', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-route-tabs')).toBeInTheDocument();
    });
  });

  describe('Filter Conditional Rendering by KPI', () => {
    it('should show Filter on Volume Pages Country tab', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });

      render(<VolumePages kpi="volume" />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });

    it('should keep Filter visible on Volume Pages global tab', () => {
      mockUseParams.mockReturnValue({ tab: 'global' });

      render(<VolumePages kpi="volume" />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });

    it('should hide Filter on Net Revenue Pages global tab even when product_scope toggle is enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'global' });
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<VolumePages kpi="nr" />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'true',
      );
    });

    it('should hide Filter on Market Share Pages global tab even when product_scope toggle is enabled', () => {
      mockUseParams.mockReturnValue({ tab: 'global' });
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<VolumePages kpi="market_share" />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'true',
      );
    });

    it('should show Filter on Market Share Pages Country tab', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });

      render(<VolumePages kpi="market_share" />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
    });
  });

  describe('Tab Order', () => {
    it('should render tabs in correct order', () => {
      render(<VolumePages />);

      const tabs = ['global', 'country'];

      tabs.forEach((tabId) => {
        expect(screen.getByTestId(`tab-${tabId}`)).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('should have RouteTabs inside StyledGridItem', () => {
      render(<VolumePages />);

      const gridItem = screen.getByTestId('volume-pages-grid-item');
      expect(
        gridItem.querySelector('[data-testid="volume-pages-route-tabs"]'),
      ).toBeInTheDocument();
    });

    it('should have Filter', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toBeInTheDocument();
    });

    it('should render StyledGridItem inside StyledGridContainer', () => {
      render(<VolumePages />);

      const volumePagesRoot = screen
        .getAllByTestId('volume-pages')
        .find((el) =>
          el.querySelector('[data-testid="volume-pages-grid-item"]'),
        );
      expect(
        volumePagesRoot?.querySelector(
          '[data-testid="volume-pages-grid-item"]',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases - tab handling for Country-only KPIs', () => {
    it.each<[string, string | undefined]>([
      ['undefined', undefined],
      ['empty string', ''],
      ['unknown tab', 'unknown-tab'],
    ])(
      'should hide Filter on Net Revenue Pages when tab is %s',
      (_label, tab) => {
        mockUseParams.mockReturnValue({ tab });

        render(<VolumePages kpi="nr" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'true',
        );
      },
    );

    it.each<[string, string | undefined]>([
      ['undefined', undefined],
      ['empty string', ''],
      ['unknown tab', 'unknown-tab'],
    ])(
      'should keep Filter visible on Volume Pages when tab is %s',
      (_label, tab) => {
        mockUseParams.mockReturnValue({ tab });

        render(<VolumePages />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          'false',
        );
      },
    );
  });

  describe('Complex Scenarios', () => {
    it('should render all components together', () => {
      render(<VolumePages />);

      const volumePagesRoot = screen
        .getAllByTestId('volume-pages')
        .find((el) => el.getAttribute('data-is-in-pr-pages') === 'true');
      expect(volumePagesRoot).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-grid-item')).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-route-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-filter')).toBeInTheDocument();
      expect(screen.getByTestId('tab-global')).toBeInTheDocument();
      expect(screen.getByTestId('tab-country')).toBeInTheDocument();
    });

    it('should render all tab contents', () => {
      render(<VolumePages />);

      expect(screen.getByTestId('tab-global')).toBeInTheDocument();
      expect(screen.getByTestId('tab-country')).toBeInTheDocument();
    });

    it('should handle country tab with visible filter', () => {
      mockUseParams.mockReturnValue({ tab: 'country' });

      render(<VolumePages />);

      expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
        'data-hidden',
        'false',
      );
      expect(screen.getByTestId('tab-country')).toBeInTheDocument();
    });
  });

  describe('Filter Data-TestId Attribute', () => {
    it('should have data-testid attribute on Filter', () => {
      render(<VolumePages />);

      const filter = screen.getByTestId('volume-pages-filter');
      expect(filter).toHaveAttribute('data-testid', 'volume-pages-filter');
    });
  });

  describe('data-testid Rendering', () => {
    it('should render volume-pages data-testid on root and main children', () => {
      render(<VolumePages />);

      const volumePagesRoot = screen
        .getAllByTestId('volume-pages')
        .find((el) => el.getAttribute('data-is-in-pr-pages') === 'true');
      expect(volumePagesRoot).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-grid-item')).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-route-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('volume-pages-filter')).toBeInTheDocument();
    });

    it('should render tab contents with volume-pages data-testid', () => {
      render(<VolumePages />);

      const volumePagesElements = screen.getAllByTestId('volume-pages');
      expect(volumePagesElements.length).toBeGreaterThanOrEqual(1);
      const root = volumePagesElements.find((el) =>
        el.querySelector('[data-testid="volume-pages-grid-item"]'),
      );
      expect(root).toBeInTheDocument();
    });
  });

  describe('Filter visibility per KPI (ticket regression)', () => {
    describe.each<[string, 'global' | 'country', boolean]>([
      ['global', 'global', false],
      ['country', 'country', false],
    ])('Volume Pages — %s tab', (_label, tab, expectedHidden) => {
      it(`should render Filter with data-hidden="${expectedHidden}"`, () => {
        mockUseParams.mockReturnValue({ tab });

        render(<VolumePages kpi="volume" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          String(expectedHidden),
        );
      });
    });

    describe.each<[string, 'global' | 'country', boolean]>([
      ['global', 'global', true],
      ['country', 'country', false],
    ])('Net Revenue Pages — %s tab', (_label, tab, expectedHidden) => {
      it(`should render Filter with data-hidden="${expectedHidden}"`, () => {
        mockUseParams.mockReturnValue({ tab });

        render(<VolumePages kpi="nr" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          String(expectedHidden),
        );
      });
    });

    describe.each<[string, 'global' | 'country', boolean]>([
      ['global', 'global', true],
      ['country', 'country', false],
    ])('Market Share Pages — %s tab', (_label, tab, expectedHidden) => {
      it(`should render Filter with data-hidden="${expectedHidden}"`, () => {
        mockUseParams.mockReturnValue({ tab });

        render(<VolumePages kpi="market_share" />);

        expect(screen.getByTestId('volume-pages-filter')).toHaveAttribute(
          'data-hidden',
          String(expectedHidden),
        );
      });
    });
  });
});
