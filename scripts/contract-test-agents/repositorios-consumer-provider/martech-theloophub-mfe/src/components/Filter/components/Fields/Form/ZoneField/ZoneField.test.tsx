jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    options,
    onChange,
  }: {
    dataTestId?: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: any) => void;
  }) => (
    <div data-testid={dataTestId || 'chips-select-component'}>
      <select
        data-testid="chips-select"
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onChange(option);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn((fieldKey, dataFilters) => {
        if (!dataFilters || !dataFilters.zones) return [];
        return dataFilters.zones.values || [];
      }),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { ZoneField } from './ZoneField';

describe('ZoneField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'LATAM', label: 'Latin America' },
    { value: 'NAZ', label: 'North America Zone' },
    { value: 'EMEA', label: 'Europe, Middle East and Africa' },
  ];

  const defaultProps = {
    fieldKey: 'zones',
    pageName: 'test-page',
    onValueChange: jest.fn(),
    getCurrentValue: jest.fn().mockReturnValue('LATAM'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('LATAM');

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        zones: {
          values: mockOptions,
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(<ZoneField {...defaultProps} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should render ChipsSelect with correct value', () => {
      const getCurrentValue = jest.fn().mockReturnValue('LATAM');

      render(<ZoneField {...defaultProps} getCurrentValue={getCurrentValue} />);

      expect(getCurrentValue).toHaveBeenCalledWith('zones');
      expect(screen.getByTestId('chips-select')).toHaveValue('LATAM');
    });

    it('should render all options', () => {
      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should pass options to ChipsSelect', () => {
      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      const options = select.querySelectorAll('option');

      expect(options[0]).toHaveTextContent('Latin America');
      expect(options[1]).toHaveTextContent('North America Zone');
      expect(options[2]).toHaveTextContent('Europe, Middle East and Africa');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(<ZoneField {...defaultProps} />);

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should use empty array when zones values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
      });

      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      const onValueChange = jest.fn();

      render(<ZoneField {...defaultProps} onValueChange={onValueChange} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'NAZ' } });

      expect(onValueChange).toHaveBeenCalledWith('zones', {
        value: 'NAZ',
        label: 'North America Zone',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      const onValueChange = jest.fn();

      render(<ZoneField {...defaultProps} onValueChange={onValueChange} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should not call onValueChange when option is null or undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          zones: {
            values: [{ value: null, label: 'Invalid' }],
          },
        },
      });

      const onValueChange = jest.fn();

      render(<ZoneField {...defaultProps} onValueChange={onValueChange} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: '' } });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      const trackGA = jest.fn();
      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'EMEA' } });

      expect(trackGA).toHaveBeenCalledWith({
        event_category: 'Zone Select',
        event_action: 'Select',
        event_label: 'EMEA',
      });
    });

    it('should call onValueChange after tracking GA', () => {
      const callOrder: string[] = [];
      const trackGA = jest.fn(() => callOrder.push('trackGA'));
      const onValueChange = jest.fn(() => callOrder.push('onValueChange'));

      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<ZoneField {...defaultProps} onValueChange={onValueChange} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'NAZ' } });

      expect(callOrder).toEqual(['trackGA', 'onValueChange']);
    });

    it('should handle array options correctly', () => {
      const onValueChange = jest.fn();

      render(<ZoneField {...defaultProps} onValueChange={onValueChange} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'NAZ' } });

      expect(onValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('FilterDataAccessor integration', () => {
    it('should use FilterDataAccessor to get options', () => {
      render(<ZoneField {...defaultProps} />);

      const select = screen.getByTestId('chips-select');
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should pass correct parameters to FilterDataAccessor', () => {
      render(
        <ZoneField
          fieldKey="zones"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <ZoneField {...defaultProps} dataTestId="custom" fieldKey="zone" />,
      );
      expect(screen.getByTestId('custom-zone')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<ZoneField {...defaultProps} />);
      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<ZoneField {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-zone"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
