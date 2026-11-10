import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { PERFORMANCE_PAGE_NAME } from 'pages/pillars/PortfolioBrand/Performance/Performance';

import { PnlPage } from './PnlPage';

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}} onError={() => undefined}>
      {component}
    </IntlProvider>,
  );

jest.mock('components', () => ({
  StickyScrollWithFilters: ({
    filter,
    dataTestId,
  }: {
    filter: { pageName: string; visibleFields: string[] };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'sticky-scroll-with-filters'}
      data-preset-id={filter.pageName}
      data-visible-fields={filter.visibleFields?.join(',')}
    />
  ),
}));

jest.mock('@hexa-ui/components', () => ({
  Grid: {
    Item: ({ children }: any) => <div>{children}</div>,
  },
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./components', () => ({
  Pnl: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'pnl-content'} />
  ),
}));

jest.mock('pages/pillars/PortfolioBrand/Performance/Performance', () => ({
  PERFORMANCE_PAGE_NAME: 'portfolio-brand_portfolio-performance',
}));

describe('PnlPage', () => {
  it('exports the page-name constant used as the bff/preset key', () => {
    expect(PERFORMANCE_PAGE_NAME).toBe('portfolio-brand_portfolio-performance');
  });

  it('renders StickyScrollWithFilters with the correct page name and visible filter fields', () => {
    renderWithIntl(<PnlPage />);

    const root = screen.getByTestId('pnl-page');
    expect(root).toHaveAttribute(
      'data-preset-id',
      'portfolio-brand_portfolio-performance',
    );
    expect(root).toHaveAttribute(
      'data-visible-fields',
      'zone,country,ytd-month,time_frame',
    );
  });

  it('renders the Pnl component as the page content', () => {
    renderWithIntl(<PnlPage />);

    expect(screen.getByTestId('pnl-content')).toBeInTheDocument();
  });

  it('honors a custom dataTestId by forwarding it to StickyScrollWithFilters', () => {
    renderWithIntl(<PnlPage dataTestId="custom" />);

    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});
