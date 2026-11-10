import { render, screen, within } from '@testing-library/react';
import { useMultiplesFeatureToggles } from 'hooks';

import { POSBook } from './POSBook';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id ?? '',
  }),
}));

let mockFeaturesListByToggleName: Record<string, boolean | undefined> = {};
let mockTogglesReady = true;

jest.mock('hooks', () => ({
  useMultiplesFeatureToggles: jest.fn(() => ({
    featuresListByToggleName: mockFeaturesListByToggleName,
    togglesReady: mockTogglesReady,
  })),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        submenus: {
          posBook: {
            tab: {
              growCategory: { id: 'pos_book_grow_category' },
              leadCategory: { id: 'pos_book_lead_category' },
            },
          },
        },
      },
    },
  },
}));

jest.mock('components', () => ({
  TabsWithFilters: ({
    breadcrumbsList,
    filter,
    tabConfig,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || filter.pageName}
      data-preset-id={filter.pageName}
      data-base-route={tabConfig.baseRoute}
      data-custom-testid={dataTestId}
    >
      <div data-testid="visible-fields">
        {filter.visibleFields?.join(',') || ''}
      </div>
      <div data-testid="breadcrumbs">
        {breadcrumbsList?.map((breadcrumb: any) => (
          <a
            key={breadcrumb.href}
            data-testid={`breadcrumb-${breadcrumb.href}`}
            href={breadcrumb.href}
          >
            {breadcrumb.pageName}
          </a>
        ))}
      </div>
      <div data-testid="tabs-container">
        {tabConfig.tabs.map((tab: any) => (
          <section
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-disabled={tab.disabled}
            data-label={tab.label}
          >
            <span>{tab.label}</span>
            {tab.content}
          </section>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('./tabs', () => ({
  GrowTheCategory: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId}>Grow the Category content</div>
  ),
  LeadTheCategory: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId}>Lead the Category content</div>
  ),
}));

jest.mock('utils/tab', () => ({
  createTab: (
    id: string,
    label: string,
    content: React.ReactNode,
    disabled: boolean,
  ) => ({
    id,
    label,
    content,
    disabled,
  }),
}));

const useMultiplesFeatureTogglesMock = useMultiplesFeatureToggles as jest.Mock;

const setTabToggles = ({
  grow = true,
  lead = true,
}: {
  grow?: boolean;
  lead?: boolean;
}) => {
  mockFeaturesListByToggleName = {
    pos_book_grow_category: grow,
    pos_book_lead_category: lead,
  };
};

const expectTabDisabledState = (tabId: string, disabled: boolean) => {
  expect(screen.getByTestId(tabId)).toHaveAttribute(
    'data-disabled',
    String(disabled),
  );
};

describe('POSBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTogglesReady = true;
    setTabToggles({});
  });

  it('does not render the POS Book tabs while feature toggles are loading', () => {
    mockTogglesReady = false;

    const { container } = render(<POSBook />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('pos-book')).not.toBeInTheDocument();
  });

  it('requests the Grow and Lead tab feature toggles', () => {
    render(<POSBook />);

    expect(useMultiplesFeatureTogglesMock).toHaveBeenCalledWith([
      'pos_book_grow_category',
      'pos_book_lead_category',
    ]);
  });

  it('passes the POS Book page contract to TabsWithFilters', () => {
    render(<POSBook />);

    const posBookPage = screen.getByTestId('pos-book');

    expect(posBookPage).toHaveAttribute(
      'data-preset-id',
      'category_pos-results',
    );
    expect(posBookPage).toHaveAttribute('data-base-route', '/category/pos');
    expect(posBookPage).toHaveAttribute('data-custom-testid', 'pos-book');
    expect(screen.getByTestId('visible-fields')).toHaveTextContent(
      'zone,country,pos_periods,time_frame',
    );
  });

  it('passes category and POS Book breadcrumbs to the filters header', () => {
    render(<POSBook />);

    const breadcrumbs = screen.getByTestId('breadcrumbs');

    expect(
      within(breadcrumbs).getByRole('link', {
        name: 'Pillars.pageName.category',
      }),
    ).toHaveAttribute('href', '/category');
    expect(
      within(breadcrumbs).getByRole('link', {
        name: 'Sidebar.posBook',
      }),
    ).toHaveAttribute('href', '/category/pos-book');
  });

  it('renders the Grow and Lead tabs in order with their tab panels', () => {
    render(<POSBook />);

    const tabs = screen.getAllByTestId(/^tab-/);

    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute('data-testid', 'tab-grow');
    expect(tabs[0]).toHaveAttribute('data-label', 'Grow the Category');
    expect(
      within(tabs[0]).getByTestId('tabpanel-grow-the-category'),
    ).toHaveTextContent('Grow the Category content');
    expect(tabs[1]).toHaveAttribute('data-testid', 'tab-lead');
    expect(tabs[1]).toHaveAttribute('data-label', 'Lead the Category');
    expect(
      within(tabs[1]).getByTestId('tabpanel-lead-the-category'),
    ).toHaveTextContent('Lead the Category content');
  });

  it('keeps both POS Book tabs enabled when both feature toggles are enabled', () => {
    setTabToggles({ grow: true, lead: true });

    render(<POSBook />);

    expectTabDisabledState('tab-grow', false);
    expectTabDisabledState('tab-lead', false);
  });

  it('disables only Grow the Category when its feature toggle is off', () => {
    setTabToggles({ grow: false, lead: true });

    render(<POSBook />);

    expectTabDisabledState('tab-grow', true);
    expectTabDisabledState('tab-lead', false);
  });

  it('disables only Lead the Category when its feature toggle is off', () => {
    setTabToggles({ grow: true, lead: false });

    render(<POSBook />);

    expectTabDisabledState('tab-grow', false);
    expectTabDisabledState('tab-lead', true);
  });

  it('treats missing tab feature toggles as disabled', () => {
    mockFeaturesListByToggleName = {};

    render(<POSBook />);

    expectTabDisabledState('tab-grow', true);
    expectTabDisabledState('tab-lead', true);
  });

  it('updates tab disabled state when the feature toggle map reference changes', () => {
    const { rerender } = render(<POSBook />);

    expectTabDisabledState('tab-grow', false);

    mockFeaturesListByToggleName = {
      pos_book_grow_category: false,
      pos_book_lead_category: true,
    };

    rerender(<POSBook />);

    expectTabDisabledState('tab-grow', true);
    expectTabDisabledState('tab-lead', false);
  });
});
