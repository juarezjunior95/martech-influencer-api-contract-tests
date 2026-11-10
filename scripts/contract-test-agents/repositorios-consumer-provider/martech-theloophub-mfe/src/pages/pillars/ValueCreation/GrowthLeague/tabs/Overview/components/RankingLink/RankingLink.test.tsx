import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import { RankingLink } from './RankingLink';

jest.mock('@hexa-ui/icons', () => ({
  ArrowRight: ({
    size,
    'data-testid': dataTestId,
  }: {
    size: string;
    'data-testid'?: string;
  }) => (
    <span data-testid={dataTestId ?? 'arrow-right-icon'} data-size={size}>
      →
    </span>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    StyledBoxLink: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'styled-box-link'}>{children}</div>,
  }),
);

jest.mock('shared/Styles', () => ({
  StyledLinkA: ({
    children,
    href,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    href: string;
    'data-testid'?: string;
  }) => (
    <a data-testid={testId ?? 'styled-link'} href={href}>
      {children}
    </a>
  ),
}));

const messages = flattenObject(enUS);

const renderLink = (ui: React.ReactElement) =>
  render(
    <IntlProvider defaultLocale="en-US" locale="en-US" messages={messages}>
      {ui}
    </IntlProvider>,
  );

describe('RankingLink', () => {
  it('renders container, href, catalogue link text, and arrow icon', () => {
    renderLink(<RankingLink to="/rankings" />);

    expect(screen.getByTestId('styled-box-link')).toBeInTheDocument();
    const link = screen.getByTestId('styled-link');
    expect(link).toHaveAttribute('href', '/rankings');
    expect(screen.getByText('See full ranking')).toBeInTheDocument();

    const icon = screen.getByTestId('arrow-right-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', 'medium');
  });

  it.each([
    ['/', '/'],
    [
      '/value-creation/growth-league/rankings',
      '/value-creation/growth-league/rankings',
    ],
    ['/rankings?league=premier', '/rankings?league=premier'],
    ['https://example.com/rankings', 'https://example.com/rankings'],
  ] as const)('sets href to %s', (to, expectedHref) => {
    renderLink(<RankingLink to={to} />);

    expect(screen.getByTestId('styled-link')).toHaveAttribute(
      'href',
      expectedHref,
    );
  });

  describe('data-testid', () => {
    it('adds custom test ids when dataTestId is provided', () => {
      renderLink(<RankingLink to="/rankings" dataTestId="custom" />);

      expect(screen.getByTestId('ranking-link-custom')).toBeInTheDocument();
    });

    it('does not add custom test id when dataTestId is omitted', () => {
      renderLink(<RankingLink to="/rankings" />);

      expect(
        screen.queryByTestId('ranking-link-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
