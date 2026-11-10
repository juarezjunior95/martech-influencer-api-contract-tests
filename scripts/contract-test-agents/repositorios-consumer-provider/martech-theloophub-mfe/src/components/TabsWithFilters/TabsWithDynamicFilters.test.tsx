import { render, screen } from '@testing-library/react';

const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}));

jest.mock('@hexa-ui/components', () => ({
  Grid: {
    Item: ({ children }: any) => <div data-testid="grid-item">{children}</div>,
  },
}));

jest.mock('components', () => ({
  StickyScrollWithFilters: ({ filter }: any) => (
    <div
      data-testid="filter"
      data-page-name={filter.pageName}
      data-visible-fields={JSON.stringify(filter.visibleFields)}
      data-hidden={filter.hidden}
    >
      Filter
    </div>
  ),
  RouteTabs: ({ baseRoute, tabsInfos }: any) => (
    <div
      data-testid="route-tabs"
      data-base-route={baseRoute}
      data-tabs-count={tabsInfos?.length}
    >
      RouteTabs
    </div>
  ),
  TabConfiguration: {},
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: any) => (
    <div data-testid="styled-grid-container">{children}</div>
  ),
}));

jest.mock('./TabsWithFilters.styles', () => ({
  StyledContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  StyledContent: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
}));

import { TabsWithDynamicFilters } from './TabsWithDynamicFilters';

describe('TabsWithDynamicFilters', () => {
  const mockBaseFilter = {
    pageName: 'base-page',
    visibleFields: ['baseField1', 'baseField2'],
  };

  const mockTabConfig = {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ],
    baseRoute: '/test-route',
  };

  const mockTabFilterOverrides = {
    tab1: {
      pageName: 'tab1-page',
      visibleFields: ['tab1Field1'],
    },
    tab2: {
      pageName: 'tab2-page',
      visibleFields: ['tab2Field1', 'tab2Field2'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ tab: undefined });
  });

  it('should render StyledGridContainer', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    expect(screen.getByTestId('styled-grid-container')).toBeInTheDocument();
  });

  it('should render Grid.Item', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('should render StyledContainer with baseFilter.pageName as testid', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    expect(screen.getByTestId('base-page')).toBeInTheDocument();
  });

  it('should render StyledContainer with custom testid', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        dataTestId="custom-testid"
      />,
    );

    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });

  it('should render StyledContent with pageName-content as testid', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    expect(screen.getByTestId('base-page-content')).toBeInTheDocument();
  });

  it('should render RouteTabs with correct props', () => {
    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    const routeTabs = screen.getByTestId('route-tabs');
    expect(routeTabs).toBeInTheDocument();
    expect(routeTabs).toHaveAttribute('data-base-route', '/test-route');
    expect(routeTabs).toHaveAttribute('data-tabs-count', '2');
  });

  it('should render Filter with baseFilter when no tab override', () => {
    mockUseParams.mockReturnValue({ tab: undefined });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        tabFilterOverrides={mockTabFilterOverrides}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-page-name', 'base-page');
    expect(filter).toHaveAttribute(
      'data-visible-fields',
      JSON.stringify(['baseField1', 'baseField2']),
    );
  });

  it('should render Filter with tab1 override when tab is tab1', () => {
    mockUseParams.mockReturnValue({ tab: 'tab1' });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        tabFilterOverrides={mockTabFilterOverrides}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-page-name', 'tab1-page');
    expect(filter).toHaveAttribute(
      'data-visible-fields',
      JSON.stringify(['tab1Field1']),
    );
  });

  it('should render Filter with tab2 override when tab is tab2', () => {
    mockUseParams.mockReturnValue({ tab: 'tab2' });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        tabFilterOverrides={mockTabFilterOverrides}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-page-name', 'tab2-page');
    expect(filter).toHaveAttribute(
      'data-visible-fields',
      JSON.stringify(['tab2Field1', 'tab2Field2']),
    );
  });

  it('should render Filter with baseFilter when tab has no override', () => {
    mockUseParams.mockReturnValue({ tab: 'unknown-tab' });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        tabFilterOverrides={mockTabFilterOverrides}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-page-name', 'base-page');
  });

  it('should render Filter with baseFilter when tabFilterOverrides is undefined', () => {
    mockUseParams.mockReturnValue({ tab: 'tab1' });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-page-name', 'base-page');
  });

  it('should pass visibleFields correctly from tab override', () => {
    mockUseParams.mockReturnValue({ tab: 'tab2' });

    render(
      <TabsWithDynamicFilters
        baseFilter={mockBaseFilter}
        tabConfig={mockTabConfig}
        tabFilterOverrides={mockTabFilterOverrides}
      />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute(
      'data-visible-fields',
      JSON.stringify(['tab2Field1', 'tab2Field2']),
    );
  });
});
