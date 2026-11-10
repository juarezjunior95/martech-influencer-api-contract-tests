import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import {
  emptyBigNumbersMock,
  powerVsLqMock,
  powerVsLyMock,
} from '../../../../__mocks';
import { BigNumbers } from './BigNumbers';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

jest.mock('components', () => ({
  DataStateHandler: ({ loading, error, empty, children }: any) => (
    <div data-testid="data-state-handler">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">Error</div>}
      {empty && <div data-testid="empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock('components/deprecated', () => ({
  BigNumber: ({ data }: any) => (
    <div data-testid="big-number">
      <div data-testid="big-number-title">{data.title}</div>
      <div data-testid="big-number-tooltip">
        {data.tooltipContent?.[0]?.content}
      </div>
    </div>
  ),
}));

const defaultProps = {
  loading: false,
  error: null,
  powerVsLq: powerVsLqMock,
  powerVsLy: powerVsLyMock,
};

describe('BigNumbers', () => {
  it.each([
    {
      label: 'loading',
      props: { ...defaultProps, loading: true },
      expectedTestId: 'loading',
    },
    {
      label: 'error',
      props: { ...defaultProps, error: new Error('Test error') },
      expectedTestId: 'error',
    },
    {
      label: 'empty (any of the values has empty=true)',
      props: { ...defaultProps, powerVsLq: emptyBigNumbersMock },
      expectedTestId: 'empty',
    },
  ])(
    'forwards $label state to DataStateHandler',
    ({ props, expectedTestId }) => {
      renderWithIntl(<BigNumbers {...props} />);

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    },
  );

  it('renders both BigNumbers with their titles when data is valid', () => {
    renderWithIntl(<BigNumbers {...defaultProps} />);

    const titles = screen.getAllByTestId('big-number-title');
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveTextContent('Power vs LQ');
    expect(titles[1]).toHaveTextContent('Power vs LY');
  });

  it('renders the LQ and LY tooltip translation ids in each BigNumber', () => {
    renderWithIntl(<BigNumbers {...defaultProps} />);

    const tooltips = screen.getAllByTestId('big-number-tooltip');
    expect(tooltips[0]).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.BigNumbers.lq.tooltip',
    );
    expect(tooltips[1]).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.BigNumbers.ly.tooltip',
    );
  });
});
