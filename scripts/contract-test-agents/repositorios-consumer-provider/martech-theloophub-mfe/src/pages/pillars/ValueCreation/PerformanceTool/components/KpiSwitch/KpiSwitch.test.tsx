import { render, screen } from '@testing-library/react';

import { KpiSwitch } from './KpiSwitch';

jest.mock('../Kpis', () => ({
  Power: ({}: any) => <div data-testid="power-component">Power</div>,
  Volume: ({}: any) => <div data-testid="volume-component">Volume</div>,
}));

const mockOnFilterChange = jest.fn();

describe('KpiSwitch', () => {
  it('should render Volume component (and not Power) when kpi is volume', () => {
    render(<KpiSwitch kpi="volume" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByTestId('volume-component')).toBeInTheDocument();
    expect(screen.queryByTestId('power-component')).not.toBeInTheDocument();
  });

  it('should render Power component (and not Volume) when kpi is power', () => {
    render(<KpiSwitch kpi="power" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByTestId('power-component')).toBeInTheDocument();
    expect(screen.queryByTestId('volume-component')).not.toBeInTheDocument();
  });

  it('should render null for unknown kpi value', () => {
    const { container } = render(
      <KpiSwitch kpi="unknown" onFilterChange={mockOnFilterChange} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
