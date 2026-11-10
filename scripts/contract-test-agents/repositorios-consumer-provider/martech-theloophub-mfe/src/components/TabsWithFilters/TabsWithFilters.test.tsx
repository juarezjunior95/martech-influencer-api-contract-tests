import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  ...jest.requireActual('@hexa-ui/components'),
  Grid: {
    Item: ({ children }: any) => <div data-testid="grid-item">{children}</div>,
  },
}));

jest.mock('components', () => ({
  StickyScrollWithFilters: ({
    filter,
    isResponsivePage,
  }: {
    filter: Record<string, unknown>;
    isResponsivePage?: boolean;
  }) => (
    <div
      data-testid="filter"
      data-page-name={filter.pageName}
      data-visible-fields={JSON.stringify(filter.visibleFields)}
      data-hidden={filter.hidden}
      data-is-responsive-page={String(!!isResponsivePage)}
    >
      Filter
    </div>
  ),
  RouteTabs: ({
    baseRoute,
    tabsInfos,
    onTabChange,
    maxWidth,
  }: {
    baseRoute: string;
    tabsInfos?: unknown[];
    onTabChange?: (id: string) => void;
    maxWidth?: string;
  }) => (
    <button
      data-testid="route-tabs"
      data-base-route={baseRoute}
      data-tabs-count={tabsInfos?.length}
      data-max-width={maxWidth ?? ''}
      onClick={() => onTabChange?.('test-tab')}
    >
      RouteTabs
    </button>
  ),
  CustomTooltip: ({ children, content, dataTestId }: any) => (
    <div data-testid={dataTestId}>
      {children}
      <span data-testid={`${dataTestId}-content`}>{content}</span>
    </div>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ 'data-testid': testId }: any) => (
    <span data-testid={testId}>icon</span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({
    children,
    isResponsivePage,
    css,
  }: {
    children: ReactNode;
    isResponsivePage?: boolean;
    css?: Record<string, unknown>;
  }) => {
    const isTitleSection = css !== undefined;
    return (
      <div
        data-testid={
          isTitleSection
            ? 'styled-grid-container-title'
            : 'styled-grid-container'
        }
        data-is-responsive-page={
          isTitleSection ? 'n/a' : String(!!isResponsivePage)
        }
      >
        {children}
      </div>
    );
  },
  StyledTitle: ({ children, size, ...props }: any) => (
    <h1 data-testid={props['data-testid']} data-size={size}>
      {children}
    </h1>
  ),
}));

jest.mock('./TabsWithFilters.styles', () => ({
  StyledContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  StyledContent: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  StyledPageTitleContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  StyledPageTitleRow: ({ children }: any) => <div>{children}</div>,
  StyledPageTitleContent: ({ children }: any) => <div>{children}</div>,
  StyledPageDescription: ({ children, ...props }: any) => (
    <p data-testid={props['data-testid']}>{children}</p>
  ),
}));

import { TabsWithFilters } from './TabsWithFilters';

describe('TabsWithFilters', () => {
  const mockFilter = {
    pageName: 'test-page',
    visibleFields: ['field1', 'field2'],
    hidden: false,
  };

  const mockTabConfig = {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ],
    baseRoute: '/test-route',
    onTabChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render StyledGridContainer', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    expect(screen.getByTestId('styled-grid-container')).toBeInTheDocument();
  });

  it('should render Grid.Item', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('should render two Grid.Item when title is provided', () => {
    render(
      <TabsWithFilters
        filter={mockFilter}
        tabConfig={mockTabConfig}
        title={{
          title: 'Test Page Title',
          dataTestId: 'test-title',
        }}
        dataTestId="custom-testid"
      />,
    );

    expect(screen.getAllByTestId('grid-item')).toHaveLength(2);
  });

  it('should render StyledContainer with pageName as testid', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    expect(screen.getByTestId('test-page')).toBeInTheDocument();
  });

  it('should render StyledContainer with custom testid', () => {
    render(
      <TabsWithFilters
        filter={mockFilter}
        tabConfig={mockTabConfig}
        dataTestId="custom-testid"
      />,
    );

    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });

  it('should render StyledContent with pageName-content as testid', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    expect(screen.getByTestId('test-page-content')).toBeInTheDocument();
  });

  it('should render StyledContent with custom testid-content', () => {
    render(
      <TabsWithFilters
        filter={mockFilter}
        tabConfig={mockTabConfig}
        dataTestId="custom-testid"
      />,
    );

    expect(screen.getByTestId('custom-testid-content')).toBeInTheDocument();
  });

  it('should render RouteTabs with correct props', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    const routeTabs = screen.getByTestId('route-tabs');
    expect(routeTabs).toBeInTheDocument();
    expect(routeTabs).toHaveAttribute('data-base-route', '/test-route');
    expect(routeTabs).toHaveAttribute('data-tabs-count', '2');
    expect(routeTabs).toHaveAttribute('data-max-width', '1328px');
  });

  it('should pass isResponsivePage to StickyScrollWithFilters and use full-width RouteTabs when true', () => {
    render(
      <TabsWithFilters
        filter={mockFilter}
        tabConfig={mockTabConfig}
        isResponsivePage
      />,
    );

    expect(screen.getByTestId('filter')).toHaveAttribute(
      'data-is-responsive-page',
      'true',
    );
    expect(screen.getByTestId('route-tabs')).toHaveAttribute(
      'data-max-width',
      '100%',
    );
    expect(screen.getByTestId('styled-grid-container')).toHaveAttribute(
      'data-is-responsive-page',
      'true',
    );
  });

  it('should default isResponsivePage to false for tab layout and RouteTabs max width', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    expect(screen.getByTestId('filter')).toHaveAttribute(
      'data-is-responsive-page',
      'false',
    );
    expect(screen.getByTestId('styled-grid-container')).toHaveAttribute(
      'data-is-responsive-page',
      'false',
    );
  });

  it('should render Filter with correct props', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    const filter = screen.getByTestId('filter');
    expect(filter).toBeInTheDocument();
    expect(filter).toHaveAttribute('data-page-name', 'test-page');
    expect(filter).toHaveAttribute(
      'data-visible-fields',
      JSON.stringify(['field1', 'field2']),
    );
    expect(filter).toHaveAttribute('data-hidden', 'false');
  });

  it('should pass hidden prop to Filter', () => {
    const filterWithHidden = { ...mockFilter, hidden: true };

    render(
      <TabsWithFilters filter={filterWithHidden} tabConfig={mockTabConfig} />,
    );

    const filter = screen.getByTestId('filter');
    expect(filter).toHaveAttribute('data-hidden', 'true');
  });

  it('should call onTabChange when tab is clicked', () => {
    render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

    const routeTabs = screen.getByTestId('route-tabs');
    routeTabs.click();

    expect(mockTabConfig.onTabChange).toHaveBeenCalledWith('test-tab');
  });

  it('should render without onTabChange', () => {
    const tabConfigWithoutOnChange = {
      tabs: mockTabConfig.tabs,
      baseRoute: mockTabConfig.baseRoute,
    };

    render(
      <TabsWithFilters
        filter={mockFilter}
        tabConfig={tabConfigWithoutOnChange}
      />,
    );

    expect(screen.getByTestId('route-tabs')).toBeInTheDocument();
  });

  describe('Title Feature', () => {
    const mockTitle = {
      title: 'Test Page Title',
      description: 'Test page description',
      dataTestId: 'test-title',
    };

    it('should not render title section when title prop is not provided', () => {
      render(<TabsWithFilters filter={mockFilter} tabConfig={mockTabConfig} />);

      expect(
        screen.queryByTestId('page-title-custom-testid'),
      ).not.toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(
        <TabsWithFilters
          filter={mockFilter}
          tabConfig={mockTabConfig}
          title={mockTitle}
          dataTestId="custom-testid"
        />,
      );

      expect(
        screen.getByTestId('page-title-custom-testid'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    });

    it('should render description when provided in title', () => {
      render(
        <TabsWithFilters
          filter={mockFilter}
          tabConfig={mockTabConfig}
          title={mockTitle}
          dataTestId="custom-testid"
        />,
      );

      expect(
        screen.getByTestId('page-title-description-custom-testid'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test page description')).toBeInTheDocument();
    });

    it('should not render description when not provided in title', () => {
      const titleWithoutDescription = {
        title: 'Test Page Title',
        dataTestId: 'test-title',
      };

      render(
        <TabsWithFilters
          filter={mockFilter}
          tabConfig={mockTabConfig}
          title={titleWithoutDescription}
          dataTestId="custom-testid"
        />,
      );

      expect(
        screen.queryByTestId('page-title-description-custom-testid'),
      ).not.toBeInTheDocument();
    });

    it('should render tooltip when provided in title', () => {
      const titleWithTooltip = {
        ...mockTitle,
        tooltip: <span>Tooltip content</span>,
      };

      render(
        <TabsWithFilters
          filter={mockFilter}
          tabConfig={mockTabConfig}
          title={titleWithTooltip}
          dataTestId="custom-testid"
        />,
      );

      expect(
        screen.getByTestId('page-title-tooltip-custom-testid'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('page-title-tooltip-icon-custom-testid'),
      ).toBeInTheDocument();
    });

    it('should not render tooltip when not provided in title', () => {
      render(
        <TabsWithFilters
          filter={mockFilter}
          tabConfig={mockTabConfig}
          title={mockTitle}
          dataTestId="custom-testid"
        />,
      );

      expect(
        screen.queryByTestId('page-title-tooltip-custom-testid'),
      ).not.toBeInTheDocument();
    });
  });
});
