import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/deprecated';

import { BigNumberItem } from './BigNumberItem';

jest.mock('components/deprecated', () => ({
  BigNumber: ({
    data,
    dataTestId,
  }: {
    data: BigNumberData & {
      tooltipContent?: Array<{ content: React.ReactNode }>;
    };
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ?? 'big-number'} data-title={data.title}>
      {data.tooltipContent?.[0]?.content}
    </div>
  ),
  BigNumberData: {},
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({
    children,
    size,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    size: string;
    'data-testid'?: string;
  }) => (
    <span data-testid={testId ?? 'styled-tooltip'} data-size={size}>
      {children}
    </span>
  ),
}));

const createMockBigNumberData = (
  overrides: Partial<BigNumberData> = {},
): BigNumberData => ({
  title: 'volume',
  bigNumber: 100,
  variation: 5,
  ...overrides,
});

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}} onError={() => undefined}>
      {component}
    </IntlProvider>,
  );

describe('BigNumberItem', () => {
  it('renders the BigNumber with the item data and a small tooltip wrapped around it', () => {
    renderWithIntl(<BigNumberItem item={createMockBigNumberData()} />);

    expect(screen.getByTestId('big-number')).toBeInTheDocument();
    expect(screen.getByTestId('styled-tooltip')).toHaveAttribute(
      'data-size',
      'small',
    );
  });

  it.each(['volume', 'maco', 'nr', 'market_share'])(
    'forwards the item title "%s" to the BigNumber data',
    (title) => {
      renderWithIntl(
        <BigNumberItem item={createMockBigNumberData({ title })} />,
      );

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-title',
        title,
      );
    },
  );

  it('exposes a custom dataTestId by namespacing the BigNumber and tooltip element ids', () => {
    renderWithIntl(
      <BigNumberItem item={createMockBigNumberData()} dataTestId="custom" />,
    );

    expect(screen.getByTestId('custom-big-number-item')).toBeInTheDocument();
    expect(
      screen.getByTestId('big-number-item-tooltip-custom'),
    ).toBeInTheDocument();
  });
});
