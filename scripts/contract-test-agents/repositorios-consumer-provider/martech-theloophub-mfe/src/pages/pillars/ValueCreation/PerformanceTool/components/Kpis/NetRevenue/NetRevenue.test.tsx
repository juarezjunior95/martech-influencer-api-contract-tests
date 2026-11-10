import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { NetRevenue } from './NetRevenue';

const mockKpiDrillDown = jest.fn();
jest.mock('../KpiDrillDown', () => ({
  KpiDrillDown: (props: any) => {
    mockKpiDrillDown(props);
    return <div data-testid="kpi-drill-down" />;
  },
}));

jest.mock('../../../config', () => ({
  netRevenueWaterfallConfig: { kpiName: 'nr' },
}));

const mockOnFilterChange = jest.fn();

describe('NetRevenue', () => {
  it('should render KpiDrillDown component', () => {
    render(<NetRevenue onFilterChange={mockOnFilterChange} />);

    expect(screen.getByTestId('kpi-drill-down')).toBeInTheDocument();
  });

  it('should pass onFilterChange and the full NetRevenue config to KpiDrillDown', () => {
    render(<NetRevenue onFilterChange={mockOnFilterChange} />);

    expect(mockKpiDrillDown).toHaveBeenCalledWith(
      expect.objectContaining({
        onFilterChange: mockOnFilterChange,
        config: expect.objectContaining({
          kpiSlug: 'net-revenue',
          kpiGroup: 'finance',
          measure: '[ $Mio ]',
          driversTitle: 'Net Revenue Drivers',
          periodValues: ['YTD', 'L3M', 'MTD'],
          waterfallConfig: { kpiName: 'nr' },
        }),
      }),
    );
  });
});
