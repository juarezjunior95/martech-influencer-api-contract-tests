import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Volume } from './Volume';

const mockKpiDrillDown = jest.fn();
jest.mock('../KpiDrillDown', () => ({
  KpiDrillDown: (props: any) => {
    mockKpiDrillDown(props);
    return <div data-testid="kpi-drill-down" />;
  },
}));

jest.mock('../../../config', () => ({
  volumeWaterfallConfig: { kpiName: 'volume' },
}));

const mockOnFilterChange = jest.fn();

describe('Volume', () => {
  it('should render KpiDrillDown component', () => {
    render(<Volume onFilterChange={mockOnFilterChange} />);

    expect(screen.getByTestId('kpi-drill-down')).toBeInTheDocument();
  });

  it('should pass onFilterChange and the full Volume config to KpiDrillDown', () => {
    render(<Volume onFilterChange={mockOnFilterChange} />);

    expect(mockKpiDrillDown).toHaveBeenCalledWith(
      expect.objectContaining({
        onFilterChange: mockOnFilterChange,
        config: expect.objectContaining({
          kpiSlug: 'volume',
          measure: '[ k hl ]',
          driversTitle: 'Volume Drivers',
          periodValues: ['YTD', 'L3M', 'MTD'],
          waterfallConfig: { kpiName: 'volume' },
        }),
      }),
    );
  });
});
