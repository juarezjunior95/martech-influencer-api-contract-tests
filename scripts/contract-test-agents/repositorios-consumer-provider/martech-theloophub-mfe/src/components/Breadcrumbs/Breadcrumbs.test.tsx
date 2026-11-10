import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { useBreadcrumbs } from 'components/Breadcrumbs/hooks/useBreadcrumbs';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';

jest.mock('components/Breadcrumbs/hooks/useBreadcrumbs', () => ({
  useBreadcrumbs: jest.fn(),
}));
jest.mock('@hexa-ui/icons', () => ({
  Home: () => <i data-testid="home-icon">Home Icon</i>,
}));

const mockUseBreadcrumbs = useBreadcrumbs as jest.MockedFunction<
  typeof useBreadcrumbs
>;

const renderWithRouter = (
  component: ReactElement,
  initialEntries: string[] = ['/'],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

const mockSetIsExpanded = jest.fn();
const mockContainerRef = { current: null };

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic render', () => {
    it('should be able to render the breadcrumb component without errors', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(screen.getByText('Página 1')).toBeInTheDocument();
    });

    it('should be able to render the home icon when showIcon is true', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={true} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('should not be able to render the home icon when showIcon is false', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument();
    });
  });

  describe('Render with one page', () => {
    it('should be able to render one page without link', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(1);
      const pageElement = screen.getByText('Página 1');
      expect(pageElement).toBeInTheDocument();
      expect(pageElement.tagName).not.toBe('A');
    });
  });

  describe('Render with two pages', () => {
    it('should be able to render two pages, where the first is a link and the last is not', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(2);
      const page1Link = screen.getByRole('link', { name: 'Página 1' });
      expect(page1Link).toBeInTheDocument();
      expect(page1Link).toHaveAttribute('href', '/page-1');

      const page2Text = screen.getByText('Página 2');
      expect(page2Text).toBeInTheDocument();
      expect(page2Text.tagName).not.toBe('A');
    });
  });

  describe('Render with three pages without collapse', () => {
    it('should be able to render three pages without collapse', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(3);
      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 2' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Página 3')).toBeInTheDocument();
      expect(screen.getByText('Página 3').tagName).not.toBe('A');
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Render with more than three pages with collapse', () => {
    it('should be able to render with ellipsis when shouldCollapse is true', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const visibleItems = [pageList[0], pageList[2], pageList[3]];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: visibleItems,
        hiddenItemsCount: 1,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(4);
      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 3' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Página 4')).toBeInTheDocument();
      expect(screen.queryByText('Página 2')).not.toBeInTheDocument();
    });

    it('should call setIsExpanded(true) when the ellipsis is clicked', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const visibleItems = [pageList[0], pageList[2], pageList[3]];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: visibleItems,
        hiddenItemsCount: 1,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      const ellipsisButton = screen.getByText('...');
      fireEvent.click(ellipsisButton);

      expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
      expect(mockSetIsExpanded).toHaveBeenCalledTimes(1);
    });

    it('should not render ellipsis when hiddenItemsCount is 0', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(4);
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Expanded mode', () => {
    it('should be able to render all pages when shouldCollapse is false', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
        { href: '/page-5', pageName: 'Página 5' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 2' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 3' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 4' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Página 5')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Navigation links', () => {
    it('should have the correct href in the links', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/home', pageName: 'Home' },
        { href: '/products', pageName: 'Produtos' },
        { href: '/products/123', pageName: 'Produto 123' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(3);
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'href',
        '/home',
      );
      expect(screen.getByRole('link', { name: 'Produtos' })).toHaveAttribute(
        'href',
        '/products',
      );
      expect(screen.getByText('Produto 123').tagName).not.toBe('A');
      expect(screen.getByText('Produto 123').tagName).toBe('P');
    });
  });

  describe('Combination of showIcon and breadcrumbs', () => {
    it('should be able to render the home icon and breadcrumbs together', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={true} />);

      expect(pageList).toHaveLength(2);
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Página 2')).toBeInTheDocument();
    });
  });

  describe('Extreme cases', () => {
    it('should be able to render correctly with empty list', () => {
      const pageList: BreadcrumbsProps['pageList'] = [];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: [],
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      const { container } = renderWithRouter(
        <Breadcrumbs pageList={pageList} showIcon={false} />,
      );

      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(pageList).toHaveLength(0);
    });

    it('should be able to render correctly with many pages', () => {
      const pageList: BreadcrumbsProps['pageList'] = Array.from(
        { length: 10 },
        (_, idx) => ({
          href: `/page-${idx + 1}`,
          pageName: `Página ${idx + 1}`,
        }),
      );

      const visibleItems = [pageList[0], pageList[8], pageList[9]];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: visibleItems,
        hiddenItemsCount: 7,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 9' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Página 10')).toBeInTheDocument();
    });

    it('should be able to render correctly when visibleItems is empty but shouldCollapse is true', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: [],
        hiddenItemsCount: 1,
        containerRef: mockContainerRef,
      });

      const { container } = renderWithRouter(
        <Breadcrumbs pageList={pageList} showIcon={false} />,
      );

      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(pageList).toHaveLength(1);
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Last page identification', () => {
    it('should be able to identify the last page when shouldCollapse is true', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
        { href: '/page-4', pageName: 'Página 4' },
      ];

      const visibleItems = [pageList[0], pageList[2], pageList[3]];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: true,
        visibleItems: visibleItems,
        hiddenItemsCount: 1,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(4);

      const page4 = screen.getByText('Página 4');
      expect(page4.closest('a')).toBeNull();

      const page3Link = screen.getByRole('link', { name: 'Página 3' });
      expect(page3Link).toBeInTheDocument();
    });

    it('should be able to identify the last page when shouldCollapse is false', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
        { href: '/page-3', pageName: 'Página 3' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />);

      expect(pageList).toHaveLength(3);

      const page3 = screen.getByText('Página 3');
      expect(page3.closest('a')).toBeNull();

      expect(
        screen.getByRole('link', { name: 'Página 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Página 2' }),
      ).toBeInTheDocument();
    });
  });

  describe('Home icon link', () => {
    it('should have the correct link for the home icon', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={true} />);

      expect(pageList).toHaveLength(1);
      const homeIcon = screen.getByTestId('home-icon');
      const homeLink = homeIcon.closest('a');

      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute(
        'href',
        'https://one.martech.uat.bees-platform.dev',
      );
    });
  });

  describe('Data-testid support', () => {
    it('should render data-testid attributes when dataTestId is provided', () => {
      const pageList: BreadcrumbsProps['pageList'] = [
        { href: '/page-1', pageName: 'Página 1' },
        { href: '/page-2', pageName: 'Página 2' },
      ];

      mockUseBreadcrumbs.mockReturnValue({
        setIsExpanded: mockSetIsExpanded,
        shouldCollapse: false,
        visibleItems: pageList,
        hiddenItemsCount: 0,
        containerRef: mockContainerRef,
      });

      renderWithRouter(
        <Breadcrumbs pageList={pageList} showIcon={true} dataTestId="test" />,
      );

      expect(screen.getByTestId('breadcrumbs-test')).toBeInTheDocument();
      expect(
        screen.getByTestId('breadcrumbs-icon-home-test'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs-link-0-test')).toBeInTheDocument();
      expect(
        screen.getByTestId('breadcrumbs-separator-0-test'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('breadcrumbs-current-test'),
      ).toBeInTheDocument();
    });
  });
});

describe('Filter params propagation', () => {
  const CURRENT_URL =
    '/category/category-health/drill-down?filter_zone=SAZ&filter_country=ARG&filter_years=2025&filter_segments=Beer&overtime_performance=volume';

  it('propagates filter_* from current URL to internal breadcrumb links without their own filters', () => {
    const pageList: BreadcrumbsProps['pageList'] = [
      { href: '/category', pageName: 'Category' },
      { href: '/category/category-health', pageName: 'Category Health' },
    ];

    mockUseBreadcrumbs.mockReturnValue({
      setIsExpanded: mockSetIsExpanded,
      shouldCollapse: false,
      visibleItems: pageList,
      hiddenItemsCount: 0,
      containerRef: mockContainerRef,
    });

    renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />, [
      CURRENT_URL,
    ]);

    expect(screen.getByRole('link', { name: 'Category' })).toHaveAttribute(
      'href',
      '/category?filter_zone=SAZ&filter_country=ARG&filter_years=2025&filter_segments=Beer',
    );
  });

  it('does not propagate non-filter params (e.g. overtime_performance)', () => {
    const pageList: BreadcrumbsProps['pageList'] = [
      { href: '/category', pageName: 'Category' },
      { href: '/category/category-health', pageName: 'Category Health' },
    ];

    mockUseBreadcrumbs.mockReturnValue({
      setIsExpanded: mockSetIsExpanded,
      shouldCollapse: false,
      visibleItems: pageList,
      hiddenItemsCount: 0,
      containerRef: mockContainerRef,
    });

    renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />, [
      CURRENT_URL,
    ]);

    const link = screen.getByRole('link', { name: 'Category' });
    expect(link.getAttribute('href')).not.toContain('overtime_performance');
  });

  it('preserves filter_* declared inside the href (caller wins)', () => {
    const pageList: BreadcrumbsProps['pageList'] = [
      { href: '/category', pageName: 'Category' },
      {
        href: '/category/category-health/overview?filter_zone=ABI&filter_country=ABI',
        pageName: 'Category Health',
      },
      { href: '', pageName: 'Drill Down' },
    ];

    mockUseBreadcrumbs.mockReturnValue({
      setIsExpanded: mockSetIsExpanded,
      shouldCollapse: false,
      visibleItems: pageList,
      hiddenItemsCount: 0,
      containerRef: mockContainerRef,
    });

    renderWithRouter(<Breadcrumbs pageList={pageList} showIcon={false} />, [
      CURRENT_URL,
    ]);

    const link = screen.getByRole('link', { name: 'Category Health' });
    expect(link).toHaveAttribute(
      'href',
      '/category/category-health/overview?filter_zone=ABI&filter_country=ABI&filter_years=2025&filter_segments=Beer',
    );
  });

  it('does not modify the home icon link (external URL)', () => {
    const pageList: BreadcrumbsProps['pageList'] = [
      { href: '/category', pageName: 'Category' },
      { href: '/category/category-health', pageName: 'Category Health' },
    ];

    mockUseBreadcrumbs.mockReturnValue({
      setIsExpanded: mockSetIsExpanded,
      shouldCollapse: false,
      visibleItems: pageList,
      hiddenItemsCount: 0,
      containerRef: mockContainerRef,
    });

    renderWithRouter(<Breadcrumbs pageList={pageList} showIcon />, [
      CURRENT_URL,
    ]);

    const homeLink = screen.getByTestId('home-icon').closest('a');
    expect(homeLink).toHaveAttribute(
      'href',
      'https://one.martech.uat.bees-platform.dev',
    );
  });
});
