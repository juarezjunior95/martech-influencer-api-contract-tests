import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { Performance, PERFORMANCE_PAGE_NAME } from './Performance';

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

jest.mock('./tabs', () => ({
  Overview: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'overview-content'} />
  ),
}));

describe('Performance', () => {
  it('exports the page-name constant used as the bff/preset key', () => {
    expect(PERFORMANCE_PAGE_NAME).toBe('portfolio-brand_portfolio-performance');
  });

  it('renders StickyScrollWithFilters with the correct page name and visible filter fields', () => {
    renderWithIntl(<Performance />);

    const root = screen.getByTestId('performance');
    expect(root).toHaveAttribute(
      'data-preset-id',
      'portfolio-brand_portfolio-performance',
    );
    expect(root).toHaveAttribute(
      'data-visible-fields',
      'zone,country,ytd-month,time_frame',
    );
  });

  it('renders the Overview component as the page content', () => {
    renderWithIntl(<Performance />);

    expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
  });

  it('honors a custom dataTestId by forwarding it to StickyScrollWithFilters', () => {
    renderWithIntl(<Performance dataTestId="custom" />);

    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});
