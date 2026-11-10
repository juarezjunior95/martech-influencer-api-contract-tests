import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BigNumbersKpiData } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/types';

import { BrandPowerBigNumbers } from './BrandPowerBigNumbers';

jest.mock('components', () => ({
  BigNumber: ({ header, data }: any) => (
    <div data-testid="big-number" data-rows={data?.length ?? 0}>
      <div data-testid="big-number-header">{header}</div>
    </div>
  ),
  ChartHeader: ({ title }: any) => (
    <div data-testid="chart-header">{title}</div>
  ),
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="loading">loading</div>;
    if (error) return <div data-testid="error">{error.message}</div>;
    if (empty) return <div data-testid="empty">empty</div>;
    return <div data-testid="content">{children}</div>;
  },
}));

const baseProps = {
  loading: false,
  error: null,
  empty: false,
  powerVsLy: {
    data: [{ bigNumber: { value: 10 } }],
    header: { title: 'VS LY' },
  } as BigNumbersKpiData,
  powerVsLq: {
    data: [{ bigNumber: { value: 20 } }],
    header: { title: 'VS LQ' },
  } as BigNumbersKpiData,
};

describe('BrandPowerBigNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both BigNumbers (LY then LQ) with their corresponding ChartHeader titles', () => {
    render(<BrandPowerBigNumbers {...baseProps} />);

    const headers = screen.getAllByTestId('chart-header');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('VS LY');
    expect(headers[1]).toHaveTextContent('VS LQ');
    expect(screen.getAllByTestId('big-number')).toHaveLength(2);
  });

  it.each([
    ['loading', { loading: true }, 'loading'],
    ['error', { error: new Error('boom') }, 'error'],
    ['empty', { empty: true }, 'empty'],
  ])(
    'shows %s state and skips BigNumbers',
    (_label, propsOverride, expectedTestId) => {
      render(<BrandPowerBigNumbers {...baseProps} {...propsOverride} />);

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
      expect(screen.queryByTestId('big-number')).not.toBeInTheDocument();
    },
  );

  it.each([
    ['powerVsLy', 'powerVsLy', 0],
    ['powerVsLq', 'powerVsLq', 1],
  ])(
    'renders an empty BigNumber when %s is undefined',
    (_label, propKey, bigNumberIndex) => {
      render(
        <BrandPowerBigNumbers {...baseProps} {...{ [propKey]: undefined }} />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers[bigNumberIndex]).toHaveAttribute('data-rows', '0');
    },
  );

  it('renders both BigNumbers with empty data when arrays are empty (not the empty state)', () => {
    render(
      <BrandPowerBigNumbers
        {...baseProps}
        powerVsLy={{ data: [], header: { title: 'VS LY' } }}
        powerVsLq={{ data: [], header: { title: 'VS LQ' } }}
      />,
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getAllByTestId('big-number')).toHaveLength(2);
  });
});
