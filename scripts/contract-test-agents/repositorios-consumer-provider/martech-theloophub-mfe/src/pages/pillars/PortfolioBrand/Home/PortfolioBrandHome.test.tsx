import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { PortfolioBrandHome } from './PortfolioBrandHome';

const messages = {
  'Pillars.sidebar.portfolioBrand': '3. Portfolio & Brand',
  'Pillars.pageName.portfolioBrand': 'Portfolio & Brand',
  'PortfolioBrand.Home.pageSubtitle':
    'Build iconic brands with clear, differentiated positioning',
};

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={messages} onError={() => undefined}>
      {ui}
    </IntlProvider>,
  );

jest.mock('hooks', () => ({
  useBffData: () => ({ data: null, loading: false, error: null }),
  useFeatureToggle: () => [true, false],
  usePageFilterApplied: () => ({
    applied: { zone: undefined, country: undefined },
  }),
}));

jest.mock('components', () => ({
  StickyScrollWithFilters: () => (
    <div>
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
  ),
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header data-testid="page-header">
      <span data-testid="page-title">{title}</span>
      <span data-testid="page-subtitle">{subtitle}</span>
    </header>
  ),
  PillarResources: ({ pillar }: { pillar: string }) => (
    <div data-testid="pillar-resources">{pillar}</div>
  ),
}));

jest.mock('./components/HowWeDoIt/HowWeDoIt', () => ({
  HowWeDoIt: () => <div data-testid="how-we-do-it" />,
}));

jest.mock('./components/IncreaseBrandPower/IncreaseBrandPower', () => ({
  IncreaseBrandPower: () => <div data-testid="increase-brand-power" />,
}));

describe('PortfolioBrandHome', () => {
  it('renders the page header with the localized title and subtitle, the filter shell and the pillar resources slot', () => {
    renderWithIntl(<PortfolioBrandHome />);

    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent(
      '3. Portfolio & Brand',
    );
    expect(screen.getByTestId('page-subtitle')).toHaveTextContent(
      'Build iconic brands with clear, differentiated positioning',
    );
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Portfolio & Brand',
    );
  });

  it('renders both home content sub-components when the feature toggle is enabled', () => {
    renderWithIntl(<PortfolioBrandHome />);

    expect(screen.getByTestId('increase-brand-power')).toBeInTheDocument();
    expect(screen.getByTestId('how-we-do-it')).toBeInTheDocument();
  });
});
