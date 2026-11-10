import React from 'react';

import { render, screen } from '@testing-library/react';

import { ExploreFurther } from './ExploreFurther';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockBuildFilterQueryString = jest.fn(() => 'filter_zone=SAZ');
const mockMergeFilterParamsIntoHref = jest.fn((href: string) => href);

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({ search: '' })),
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
    [k: string]: unknown;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    applied: { zone: 'SAZ', country: 'ARG' },
  })),
}));

jest.mock('domain/Filter', () => ({
  FilterRegistry: {
    buildFilterQueryString: (...args: unknown[]) =>
      mockBuildFilterQueryString(
        ...(args as Parameters<typeof mockBuildFilterQueryString>),
      ),
    mergeFilterParamsIntoHref: (...args: unknown[]) =>
      mockMergeFilterParamsIntoHref(
        ...(args as Parameters<typeof mockMergeFilterParamsIntoHref>),
      ),
  },
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
    dataTestId,
  }: {
    children: React.ReactNode;
    header: { title: string };
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId} data-title={header.title}>
      {children}
    </div>
  ),
}));

jest.mock('./ExploreFurther.styles', () => ({
  exploreFurtherBasicContainerBackground: '#F9F9F9',
  StyledExploreFurtherRoot: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledExploreFurtherBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledExploreFurtherSubtitle: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [k: string]: unknown;
  }) => <p {...rest}>{children}</p>,
  StyledExploreFurtherCards: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCommercialResultsLink: ({
    to,
    children,
    interactive,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
    interactive?: boolean;
    [k: string]: unknown;
  }) => (
    <a href={to} {...rest} data-interactive={String(interactive)}>
      {children}
    </a>
  ),
  StyledCommercialResultsCard: ({
    children,
    interactive,
    ...rest
  }: {
    children: React.ReactNode;
    interactive?: boolean;
    [k: string]: unknown;
  }) => (
    <div {...rest} data-interactive={String(interactive)}>
      {children}
    </div>
  ),
  StyledWatchTowerBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCardHeaderRow: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCardIcon: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [k: string]: unknown;
  }) => <span {...rest}>{children}</span>,
  StyledCardTextColumn: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCardTitle: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [k: string]: unknown;
  }) => <h5 {...rest}>{children}</h5>,
  StyledCardDescription: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [k: string]: unknown;
  }) => <p {...rest}>{children}</p>,
  StyledCardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCommercialResultsLinkLabel: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [k: string]: unknown;
  }) => <span {...rest}>{children}</span>,
  StyledExploreFurtherLinkArrow: () => <svg data-testid="link-arrow" />,
}));

const { useLocation } = jest.requireMock('react-router-dom');
const { usePageFilterApplied } = jest.requireMock('hooks');

const enabledCard = {
  title: 'Commercial Results',
  description: 'Analyze your commercial data',
  linkLabel: 'Go to Commercial Results',
  linkHref: '/commercial-results',
  abbreviation: 'CR',
  enabled: true,
};

const disabledCard = {
  title: 'Waterfall',
  description: 'Analyze waterfall data',
  linkLabel: 'Coming soon',
  linkHref: '/waterfall',
  abbreviation: 'WF',
  enabled: false,
};

function renderExploreFurther(
  overrides: Partial<{
    cards: (typeof enabledCard)[];
    filterPageName: string;
    dataTestId: string;
  }> = {},
) {
  const {
    cards = [enabledCard],
    filterPageName = 'performance-tool',
    dataTestId = 'performance-tool',
  } = overrides;
  return render(
    <ExploreFurther
      filterPageName={filterPageName}
      cards={cards}
      dataTestId={dataTestId}
    />,
  );
}

describe('ExploreFurther', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({ search: '' });
    usePageFilterApplied.mockReturnValue({
      applied: { zone: 'SAZ', country: 'ARG' },
    });
    mockMergeFilterParamsIntoHref.mockImplementation((href: string) => href);
    mockBuildFilterQueryString.mockReturnValue('filter_zone=SAZ');
  });

  describe('rendering', () => {
    it('should render the Explore Further component', () => {
      renderExploreFurther();

      expect(
        screen.getByTestId('explore-further-performance-tool'),
      ).toBeInTheDocument();
    });

    it('renders one card per entry in the cards prop', () => {
      renderExploreFurther({
        cards: [enabledCard, disabledCard],
        dataTestId: 'perf',
      });

      expect(screen.getAllByTestId('explore-further-perf-card')).toHaveLength(
        2,
      );
    });

    it('renders card title, description and linkLabel', () => {
      renderExploreFurther();

      expect(screen.getByText(enabledCard.title)).toBeInTheDocument();
      expect(screen.getByText(enabledCard.description)).toBeInTheDocument();
      expect(screen.getByText(enabledCard.linkLabel)).toBeInTheDocument();
    });

    it('renders the abbreviation inside the card icon', () => {
      renderExploreFurther();

      expect(screen.getByText(enabledCard.abbreviation)).toBeInTheDocument();
    });

    it('renders one arrow icon per card', () => {
      renderExploreFurther({ cards: [enabledCard, disabledCard] });

      expect(screen.getAllByTestId('link-arrow')).toHaveLength(2);
    });
  });

  describe('card enabled/disabled state', () => {
    it('sets interactive={true} and tone="active" for an enabled card', () => {
      renderExploreFurther({ cards: [enabledCard], dataTestId: 'perf' });

      expect(screen.getByTestId('explore-further-perf-link')).toHaveAttribute(
        'data-interactive',
        'true',
      );
      expect(screen.getByTestId('explore-further-perf-card')).toHaveAttribute(
        'data-interactive',
        'true',
      );
      expect(screen.getByText(enabledCard.abbreviation)).toHaveAttribute(
        'tone',
        'active',
      );
    });

    it('sets interactive={false} and tone="muted" for a disabled card', () => {
      renderExploreFurther({ cards: [disabledCard], dataTestId: 'perf' });

      expect(screen.getByTestId('explore-further-perf-link')).toHaveAttribute(
        'data-interactive',
        'false',
      );
      expect(screen.getByTestId('explore-further-perf-card')).toHaveAttribute(
        'data-interactive',
        'false',
      );
      expect(screen.getByText(disabledCard.abbreviation)).toHaveAttribute(
        'tone',
        'muted',
      );
    });
  });

  describe('href construction via FilterRegistry', () => {
    it('calls buildFilterQueryString with applied filters when location.search has no filter_ params', () => {
      useLocation.mockReturnValue({ search: '' });
      renderExploreFurther();

      expect(mockBuildFilterQueryString).toHaveBeenCalledWith({
        zone: 'SAZ',
        country: 'ARG',
      });
    });

    it('does NOT call buildFilterQueryString when location.search already has filter_ params', () => {
      useLocation.mockReturnValue({ search: '?filter_zone=SAZ' });
      renderExploreFurther();

      expect(mockBuildFilterQueryString).not.toHaveBeenCalled();
    });

    it('calls mergeFilterParamsIntoHref with card.linkHref and the built query string', () => {
      renderExploreFurther();

      expect(mockMergeFilterParamsIntoHref).toHaveBeenCalledWith(
        enabledCard.linkHref,
        'filter_zone=SAZ',
      );
    });

    it('passes location.search directly to mergeFilterParamsIntoHref when it has filter_ params', () => {
      const search = '?filter_zone=SAZ&filter_country=ARG';
      useLocation.mockReturnValue({ search });
      renderExploreFurther();

      expect(mockMergeFilterParamsIntoHref).toHaveBeenCalledWith(
        enabledCard.linkHref,
        search,
      );
    });

    it('renders the href returned by mergeFilterParamsIntoHref as the link href', () => {
      mockMergeFilterParamsIntoHref.mockReturnValue(
        '/commercial-results?filter_zone=SAZ',
      );
      renderExploreFurther({ dataTestId: 'perf' });

      expect(screen.getByTestId('explore-further-perf-link')).toHaveAttribute(
        'href',
        '/commercial-results?filter_zone=SAZ',
      );
    });

    it('calls mergeFilterParamsIntoHref once per card', () => {
      renderExploreFurther({ cards: [enabledCard, disabledCard] });

      expect(mockMergeFilterParamsIntoHref).toHaveBeenCalledTimes(2);
    });
  });

  describe('locationSearchHasFilterParams', () => {
    it('uses buildFilterQueryString when search has non-filter_ params only', () => {
      useLocation.mockReturnValue({ search: '?tab=overview' });
      renderExploreFurther();

      expect(mockBuildFilterQueryString).toHaveBeenCalled();
    });

    it('skips buildFilterQueryString when search has a filter_ param without leading "?"', () => {
      useLocation.mockReturnValue({ search: 'filter_zone=ABI' });
      renderExploreFurther();

      expect(mockBuildFilterQueryString).not.toHaveBeenCalled();
    });
  });

  describe('usePageFilterApplied', () => {
    it('calls usePageFilterApplied with the filterPageName prop', () => {
      renderExploreFurther({ filterPageName: 'my-custom-page' });

      expect(usePageFilterApplied).toHaveBeenCalledWith('my-custom-page');
    });
  });
});
