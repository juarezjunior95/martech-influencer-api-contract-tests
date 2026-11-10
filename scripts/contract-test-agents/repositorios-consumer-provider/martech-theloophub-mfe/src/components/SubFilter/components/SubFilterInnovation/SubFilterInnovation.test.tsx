import { fireEvent, render, screen } from '@testing-library/react';

import { SubFilterInnovation } from './SubFilterInnovation';

jest.mock('components/Form/components/Select/Select', () => ({
  Select: ({ value, onValueChange, options }) => (
    <div>
      <button
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (options && options.length) onValueChange(options[0].value);
          }
        }}
        data-testid="mock-select-trigger"
        onClick={(e) => {
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        {value}
      </button>
      <div data-testid="mock-select-options">
        {options.map((opt) => (
          <button
            tabIndex={0}
            onKeyDown={() => onValueChange(opt.value)}
            key={opt.value}
            data-testid={`mock-option-${opt.value}`}
            onClick={() => onValueChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

const mockSetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  useSearchParams: () => {
    const params = new URLSearchParams(mockUrlSearch);
    return [params, mockSetSearchParams];
  },
}));

let mockUrlSearch = '';
describe('SubFilterInnovation', () => {
  beforeEach(() => {
    mockSetSearchParams.mockClear();
    mockUrlSearch = '';
  });

  it('It should use the URL value when a KPI is present.', () => {
    mockUrlSearch = 'kpi=netRevenue';
    render(<SubFilterInnovation stateKey="subfilter-test" />);
    expect(screen.getByTestId('mock-select-trigger')).toHaveTextContent(
      'netRevenue',
    );
  });

  it('It should use the first value (Volume) when the URL does not have a KPI', () => {
    mockUrlSearch = '';
    render(<SubFilterInnovation stateKey="subfilter-test" />);

    expect(screen.getByTestId('mock-select-trigger')).toHaveTextContent(
      'volume',
    );
    expect(mockSetSearchParams).toHaveBeenCalled();
  });
  it('It must send a new value to the URL when selecting new option', () => {
    mockUrlSearch = 'kpi=volume';
    render(<SubFilterInnovation stateKey="subfilter-test" />);
    const option = screen.getByTestId('mock-option-maco');
    fireEvent.click(option);
    expect(mockSetSearchParams).toHaveBeenCalled();
    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.get('kpi')).toBe('maco');
  });

  it('It should render all options', () => {
    mockUrlSearch = 'kpi=volume';
    render(<SubFilterInnovation stateKey="subfilter-test" />);
    expect(screen.getByTestId('mock-option-volume')).toBeInTheDocument();
    expect(screen.getByTestId('mock-option-volumeMix')).toBeInTheDocument();
    expect(screen.getByTestId('mock-option-netRevenue')).toBeInTheDocument();
    expect(screen.getByTestId('mock-option-maco')).toBeInTheDocument();
  });
});
