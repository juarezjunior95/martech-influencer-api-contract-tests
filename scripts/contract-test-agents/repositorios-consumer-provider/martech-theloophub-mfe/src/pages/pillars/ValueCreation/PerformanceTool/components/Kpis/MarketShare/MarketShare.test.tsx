import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { MarketShare } from './MarketShare';

const mockKpiDrillDown = jest.fn();
jest.mock('../KpiDrillDown', () => ({
  KpiDrillDown: (props: any) => {
    mockKpiDrillDown(props);
    return <div data-testid="kpi-drill-down" />;
  },
}));

jest.mock('../../../config', () => ({
  marketShareWaterfallConfig: { kpiName: 'market_share' },
}));

const mockOnFilterChange = jest.fn();

describe('MarketShare', () => {
  it('should render KpiDrillDown component', () => {
    render(<MarketShare onFilterChange={mockOnFilterChange} />);

    expect(screen.getByTestId('kpi-drill-down')).toBeInTheDocument();
  });

  it('should pass onFilterChange and the full MarketShare config to KpiDrillDown', () => {
    render(<MarketShare onFilterChange={mockOnFilterChange} />);

    expect(mockKpiDrillDown).toHaveBeenCalledWith(
      expect.objectContaining({
        onFilterChange: mockOnFilterChange,
        config: expect.objectContaining({
          kpiSlug: 'non-finance_market-share',
          measure: '[ % ]',
          driversTitle: 'Market Share Drivers',
          periodValues: ['YTD', 'L3M', 'MTD'],
          waterfallConfig: { kpiName: 'market_share' },
        }),
      }),
    );
  });
});
