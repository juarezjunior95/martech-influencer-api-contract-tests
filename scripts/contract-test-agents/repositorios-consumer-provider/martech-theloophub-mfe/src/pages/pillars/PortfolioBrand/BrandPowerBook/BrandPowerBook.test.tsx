import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { brandPowerBookVisibleFilters } from 'pages/constants';

import { BRAND_POWER_BOOK_PAGE_NAME, BrandPowerBook } from './BrandPowerBook';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

jest.mock('components', () => ({
  TabsWithFilters: ({ filter, tabConfig }: any) => (
    <div
      data-testid="tabs-with-filters"
      data-page-name={filter.pageName}
      data-base-route={tabConfig.baseRoute}
      data-visible-fields={filter.visibleFields?.join(',')}
    >
      {tabConfig.tabs.map((tab: any) => (
        <div
          key={tab.id}
          data-testid={`tab-${tab.id}`}
          data-disabled={String(tab.disabled)}
          data-label={tab.label}
        >
          {tab.content}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('./tabs', () => ({
  PowerBook: () => <div data-testid="power-book-content">PowerBook</div>,
}));

jest.mock('pages/constants', () => ({
  brandPowerBookVisibleFilters: ['zone', 'country', 'scopes', 'sub_scopes'],
}));

describe('BrandPowerBook', () => {
  it('wires TabsWithFilters with the page name, route and visible filters', () => {
    renderWithIntl(<BrandPowerBook />);

    const tabs = screen.getByTestId('tabs-with-filters');
    expect(tabs).toHaveAttribute('data-page-name', BRAND_POWER_BOOK_PAGE_NAME);
    expect(tabs).toHaveAttribute(
      'data-base-route',
      '/portfolio-brand/brand-power-book',
    );
    expect(tabs).toHaveAttribute(
      'data-visible-fields',
      brandPowerBookVisibleFilters.join(','),
    );
  });

  it('declares a single enabled "power-book" tab labelled "Overview" rendering PowerBook', () => {
    renderWithIntl(<BrandPowerBook />);

    const tab = screen.getByTestId('tab-power-book');
    expect(tab).toHaveAttribute('data-label', 'Overview');
    expect(tab).toHaveAttribute('data-disabled', 'false');
    expect(screen.getByTestId('power-book-content')).toBeInTheDocument();
  });
});
