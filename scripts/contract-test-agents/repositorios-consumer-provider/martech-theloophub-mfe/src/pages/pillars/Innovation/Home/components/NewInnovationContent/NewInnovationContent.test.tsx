import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../__mocks', () => {
  const actual = jest.requireActual('../../__mocks');
  return {
    ...actual,
    getInnovationHomeFourCardTrendMockData: jest.fn(() =>
      actual.getInnovationHomeFourCardTrendMockData(),
    ),
  };
});

import type { UseBffDataResponse } from 'hooks';

import * as innovationHomeMocks from '../../__mocks';
import type { NewInnovationContentProps } from './NewInnovationContent';
import { NewInnovationContent } from './NewInnovationContent';

const { INNOVATION_HOME_FOUR_CARD_TREND_MOCK } = innovationHomeMocks;

const messages: Record<string, string> = {
  'Innovation.Home.breadcrumbPageName': 'Value Creation',
  'Innovation.Home.newInnovationHomeTitle': 'Innovation',
  'Innovation.Home.pageSubtitle': 'Subtitle copy',
  'Innovation.Home.globalOvertimePerformance': 'Global Overtime Performance',
  'Innovation.Home.howWeDoIt': 'How We Do It',
  'Innovation.Home.increaseVolume': 'Increase Volume',
  'Innovation.Home.increaseRevenue': 'Increase Revenue',
  'Innovation.Home.performanceKpiMaco': 'MACO',
  'Innovation.Home.performanceKpiMacoMargin': 'MACO Margin',
  'Pillars.pageName.innovation': 'Innovation',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => messages[id] ?? id,
  }),
}));

jest.mock('components', () => ({
  PillarResources: ({ pillar }: { pillar: string }) => (
    <div data-testid="pillar-resources">{pillar}</div>
  ),
  StickyScrollWithFilters: () => (
    <div>
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
  ),
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string; titleSize?: string };
  }) => (
    <div
      data-testid="basic-container"
      data-header-title-size={header?.titleSize ?? ''}
    >
      {header?.title ? (
        <h2 data-testid="section-heading">{header.title}</h2>
      ) : null}
      {children}
    </div>
  ),
  PageHeader: ({ title }: { title: string }) => (
    <header data-testid="page-header">{title}</header>
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

jest.mock('./NewInnovationContent.styles', () => ({
  StyledNewInnovationKpiGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="innovation-home-four-cards-grid">{children}</div>
  ),
  StyledHowWeDoItHandoffSection: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="how-we-do-it-handoff-section">{children}</div>,
  StyledHowWeDoItCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
}));

jest.mock('../PerformanceKpiCard/PerformanceKpiCard', () => ({
  PerformanceKpiCard: ({
    containerTitle,
    dataTestId,
    data,
    onClick,
  }: {
    containerTitle: string;
    dataTestId?: string;
    data: unknown;
    onClick?: () => void;
  }) => (
    <div
      data-testid="performance-kpi-stub"
      data-title={containerTitle}
      data-instance-testid={dataTestId ?? ''}
      data-card-data={data == null ? 'null' : 'present'}
    >
      {onClick ? (
        <button type="button" onClick={onClick}>
          open
        </button>
      ) : null}
    </div>
  ),
}));

jest.mock('../HowWeDoItCard/HowWeDoItCard', () => ({
  HowWeDoItCard: ({
    titleId,
    dataTestId,
  }: {
    titleId: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid="new-how-we-do-it-card"
      data-title-id={titleId}
      data-instance-testid={dataTestId ?? ''}
    />
  ),
}));

function mockPageData(
  overrides: Partial<UseBffDataResponse> = {},
): UseBffDataResponse {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function bundle(
  overrides: Partial<NewInnovationContentProps> = {},
): NewInnovationContentProps {
  return {
    innovationHomeContentToggle: [true, false],
    isDesktopLarge: false,
    pageData: undefined,
    mainCardsData: {
      innovationVolume: null,
      innovationNetRevenue: null,
    },
    howWeDoItCardsData: null,
    onKpiClick: jest.fn(),
    ...overrides,
  };
}

describe('NewInnovationContent', () => {
  it('renders page header, global performance section, four KPI slots, and How We Do It', () => {
    render(
      <NewInnovationContent
        {...bundle({
          pageData: mockPageData({
            data: {
              'innovation-home-big-numbers-trend':
                INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
            },
          }),
        })}
      />,
    );

    expect(screen.getByTestId('page-header')).toHaveTextContent('Innovation');
    expect(
      screen.getByRole('heading', { name: 'Global Overtime Performance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('innovation-home-four-cards-grid'),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('performance-kpi-stub')).toHaveLength(4);
    expect(screen.getAllByTestId('performance-kpi-stub')[0]).toHaveAttribute(
      'data-instance-testid',
      'innovation-home-performance-kpi-volume',
    );
    expect(screen.getAllByTestId('performance-kpi-stub')[1]).toHaveAttribute(
      'data-instance-testid',
      'innovation-home-performance-kpi-nr',
    );
    const kpiSection = screen
      .getByTestId('innovation-home-four-cards-grid')
      .closest('[data-testid="basic-container"]');
    expect(kpiSection).toHaveAttribute('data-header-title-size', 'H3');
    const stubs = screen.getAllByTestId('performance-kpi-stub');
    stubs.forEach((el) => {
      expect(el).toHaveAttribute('data-card-data', 'present');
    });
    expect(
      screen.getByRole('heading', { name: 'How We Do It' }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('new-how-we-do-it-card')).toHaveLength(4);
  });

  it('uses H2 header title size on large desktop for KPI and How We Do It sections', () => {
    render(
      <NewInnovationContent
        {...bundle({
          isDesktopLarge: true,
          pageData: mockPageData({
            data: {
              'innovation-home-big-numbers-trend':
                INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
            },
          }),
        })}
      />,
    );

    const containers = screen.getAllByTestId('basic-container');
    const titled = containers.filter((c) =>
      c.querySelector('[data-testid="section-heading"]'),
    );
    titled.forEach((c) => {
      expect(c).toHaveAttribute('data-header-title-size', 'H2');
    });
  });

  it('uses BFF slice when at least four trend cards are returned', () => {
    (
      innovationHomeMocks.getInnovationHomeFourCardTrendMockData as jest.Mock
    ).mockClear();

    render(
      <NewInnovationContent
        {...bundle({
          pageData: mockPageData({
            data: {
              'innovation-home-big-numbers-trend': [
                ...INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
                ...INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
              ],
            },
          }),
        })}
      />,
    );

    expect(
      innovationHomeMocks.getInnovationHomeFourCardTrendMockData,
    ).not.toHaveBeenCalled();
    expect(screen.getAllByTestId('performance-kpi-stub')).toHaveLength(4);
  });

  it('falls back to mock trend data when API trend is missing, invalid, or has fewer than four items', () => {
    (
      innovationHomeMocks.getInnovationHomeFourCardTrendMockData as jest.Mock
    ).mockImplementationOnce(() =>
      INNOVATION_HOME_FOUR_CARD_TREND_MOCK.slice(0, 2),
    );

    render(
      <NewInnovationContent
        {...bundle({
          pageData: mockPageData({
            data: { 'innovation-home-big-numbers-trend': [] },
          }),
        })}
      />,
    );

    expect(
      innovationHomeMocks.getInnovationHomeFourCardTrendMockData,
    ).toHaveBeenCalled();
    const stubs = screen.getAllByTestId('performance-kpi-stub');
    expect(stubs[0]).toHaveAttribute('data-card-data', 'present');
    expect(stubs[1]).toHaveAttribute('data-card-data', 'present');
    expect(stubs[2]).toHaveAttribute('data-card-data', 'null');
    expect(stubs[3]).toHaveAttribute('data-card-data', 'null');
  });

  it('falls back when BFF trend is not an array', () => {
    render(
      <NewInnovationContent
        {...bundle({
          pageData: mockPageData({
            data: {
              'innovation-home-big-numbers-trend':
                'invalid' as unknown as typeof INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
            },
          }),
        })}
      />,
    );

    expect(
      innovationHomeMocks.getInnovationHomeFourCardTrendMockData,
    ).toHaveBeenCalled();
    expect(screen.getAllByTestId('performance-kpi-stub')).toHaveLength(4);
  });

  it('calls onKpiClick with the volume kpi when the first card triggers', async () => {
    const onKpiClick = jest.fn();
    const user = userEvent.setup();

    render(
      <NewInnovationContent
        {...bundle({
          onKpiClick,
          pageData: mockPageData({
            data: {
              'innovation-home-big-numbers-trend':
                INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
            },
          }),
        })}
      />,
    );

    const buttons = screen.getAllByRole('button', { name: 'open' });
    await user.click(buttons[0]);

    expect(onKpiClick).toHaveBeenCalledTimes(1);
    expect(onKpiClick).toHaveBeenCalledWith('volume');
  });
});
