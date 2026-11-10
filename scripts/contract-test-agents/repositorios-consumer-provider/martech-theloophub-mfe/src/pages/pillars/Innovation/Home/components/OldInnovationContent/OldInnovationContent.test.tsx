import React from 'react';

import { render, screen, within } from '@testing-library/react';

import type { OldInnovationContentProps } from './OldInnovationContent';
import { OldInnovationContent } from './OldInnovationContent';

const messages: Record<string, string> = {
  'Pillars.sidebar.innovation': '4. Innovation',
  'Pillars.pageName.innovation': 'Innovation',
  'Innovation.Home.pageSubtitle': 'Subtitle',
  'Innovation.Home.breadcrumbPageName': 'Value Creation',
  'Innovation.Home.howWeDoIt': 'How We Do It',
  'Innovation.Home.increaseVolume': 'Increase Volume',
  'Innovation.Home.increaseRevenue': 'Increase Revenue',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => messages[id] ?? id,
  }),
}));

jest.mock('hooks', () => {
  const { featureToggles: ft } = jest.requireActual(
    'config/featureToggle',
  ) as typeof import('config/featureToggle');

  return {
    useMultiplesFeatureToggles: () => ({
      featuresListByToggleName: {
        [ft.pillar.innovation.home.aiSummary.volume]: false,
        [ft.pillar.innovation.home.aiSummary.nr]: false,
      },
      togglesReady: true,
    }),
  };
});

jest.mock('pages/components/AISummary', () => ({
  AISummary: () => null,
}));

jest.mock('pages/components', () => ({
  BigNumberSparkLineCard: ({
    children,
    containerTitle,
    onClick,
  }: {
    children?: React.ReactNode;
    containerTitle: string;
    onClick?: () => void;
  }) => (
    <div
      data-testid="big-number-sparkline-card"
      data-variant="stub"
      data-title={containerTitle}
    >
      {onClick ? (
        <button type="button" onClick={onClick}>
          open
        </button>
      ) : null}
      {children}
    </div>
  ),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string };
  }) => (
    <div data-testid="basic-container">
      {header?.title && <h2 data-testid="section-title">{header.title}</h2>}
      {children}
    </div>
  ),
  StickyScrollWithFilters: () => (
    <div>
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
  ),
  PageHeader: ({ title }: { title: string }) => (
    <header data-testid="page-header">{title}</header>
  ),
  PillarResources: ({ pillar }: { pillar: string }) => (
    <div data-testid="pillar-resources">{pillar}</div>
  ),
}));

jest.mock('shared/Styles/layout.styles', () => ({
  StyledGridContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-container">{children}</div>
  ),
  StyledHomeContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-container">{children}</div>
  ),
  StyledHomeHeaderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-header-container">{children}</div>
  ),
}));

jest.mock('./OldInnovationContent.styles', () => ({
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="innovation-home-legacy-main-cards-grid">{children}</div>
  ),
}));

jest.mock('../../InnovationHome.styles', () => ({
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
}));

jest.mock('../HowWeDoItCard', () => ({
  HowWeDoItCard: () => <div data-testid="sub-pillar-card" />,
}));

function defaultProps(
  overrides: Partial<OldInnovationContentProps> = {},
): OldInnovationContentProps {
  return {
    innovationHomeContentToggle: [true, false],
    innovationHomeNewPageExperienceToggle: [false, false],
    isDesktopLarge: false,
    pageData: {
      loading: false,
      error: null,
      data: {},
      refetch: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
    },
    mainCardsData: {
      innovationVolume: null,
      innovationNetRevenue: null,
    },
    howWeDoItCardsData: null,
    onKpiClick: jest.fn(),
    ...overrides,
  };
}

describe('OldInnovationContent', () => {
  it('renders header, shell, filters, and pillar resources', () => {
    render(<OldInnovationContent {...defaultProps()} />);

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('page-header')).toHaveTextContent(
      '4. Innovation',
    );
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Innovation',
    );
  });

  it('renders legacy two-card grid when content toggle is on', () => {
    render(
      <OldInnovationContent
        {...defaultProps({
          innovationHomeContentToggle: [true, false],
        })}
      />,
    );

    expect(
      screen.getByTestId('innovation-home-legacy-main-cards-grid'),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('big-number-sparkline-card')).toHaveLength(2);
  });

  it('renders How We Do It when content toggle is on', () => {
    render(
      <OldInnovationContent
        {...defaultProps({
          innovationHomeContentToggle: [true, false],
        })}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'How We Do It' }),
    ).toBeInTheDocument();
    const grid = screen.getByTestId('sub-pillar-cards-grid');
    expect(within(grid).getAllByTestId('sub-pillar-card')).toHaveLength(4);
  });

  it('hides main body sections when content toggle is off', () => {
    render(
      <OldInnovationContent
        {...defaultProps({
          innovationHomeContentToggle: [false, false],
        })}
      />,
    );

    expect(
      screen.queryByTestId('innovation-home-legacy-main-cards-grid'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'How We Do It' }),
    ).not.toBeInTheDocument();
  });

  it('hides legacy main cards when new page experience toggle is on (defensive guard)', () => {
    render(
      <OldInnovationContent
        {...defaultProps({
          innovationHomeContentToggle: [true, false],
          innovationHomeNewPageExperienceToggle: [true, false],
        })}
      />,
    );

    expect(
      screen.queryByTestId('innovation-home-legacy-main-cards-grid'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'How We Do It' }),
    ).not.toBeInTheDocument();
  });
});
