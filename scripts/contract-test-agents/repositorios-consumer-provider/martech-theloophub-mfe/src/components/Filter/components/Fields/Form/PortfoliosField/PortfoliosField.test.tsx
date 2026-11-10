jest.mock('components/Form', () => ({
  Select: ({
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: unknown) => void;
    placeholder: string;
  }) => (
    <div data-testid="select-component">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onValueChange(option);
        }}
        data-placeholder={placeholder}
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
      getOptions: jest.fn(() => []),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { PortfoliosField } from './PortfoliosField';

describe('PortfoliosField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'All', label: 'All' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Core', label: 'Core' },
  ];

  const getDefaultProps = () => ({
    fieldKey: 'portfolios',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'portfolios') return 'All';
      if (key === 'zone') return 'LATAM';
      if (key === 'country') return 'BR';
      if (key === 'brand_filter_groupings') return 'Portfolio';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
      defaults: { portfolios: 'All' },
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockOptions),
    });
  });

  describe('Basic rendering', () => {
    it('should render the Select component', () => {
      render(<PortfoliosField {...getDefaultProps()} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with label Portfolio', () => {
      render(<PortfoliosField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
    });

    it('should display current value from formValue', () => {
      render(<PortfoliosField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Portfolio')).toHaveValue('All');
    });

    it('should use default value when formValue is empty', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'portfolios') return undefined;
        if (key === 'zone') return 'LATAM';
        if (key === 'country') return 'BR';
        if (key === 'brand_filter_groupings') return 'Portfolio';
        return '';
      });

      render(<PortfoliosField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Portfolio')).toHaveValue('All');
    });
  });

  describe('Value change', () => {
    it('should call onValueChange for portfolios when value changes', () => {
      render(<PortfoliosField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Portfolio');
      fireEvent.change(select, { target: { value: 'Premium' } });

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(
        'portfolios',
        expect.objectContaining({ value: 'Premium', label: 'Premium' }),
      );
    });

    it('should track Google Analytics event when value changes', () => {
      render(<PortfoliosField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Portfolio');
      fireEvent.change(select, { target: { value: 'Premium' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Portfolios Select',
        event_action: 'Select',
        event_label: 'Premium',
      });
    });
  });

  describe('FilterDataAccessor', () => {
    it('should call getOptions with zone, country and brand_filter_groupings', () => {
      const mockGetOptions = jest.fn(() => mockOptions);
      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getOptions: mockGetOptions,
      });

      render(<PortfoliosField {...getDefaultProps()} />);

      expect(mockGetOptions).toHaveBeenCalledWith(
        'portfolios',
        {},
        {
          zone: 'LATAM',
          country: 'BR',
          brand_filter_groupings: 'Portfolio',
        },
      );
    });
  });
});
