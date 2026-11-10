jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
    disabled,
  }: {
    dataTestId?: string;
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: any) => void;
    placeholder: string;
    disabled?: boolean;
  }) => (
    <div data-testid={dataTestId || 'select-component'}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onValueChange(option);
        }}
        data-placeholder={placeholder}
        disabled={disabled}
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

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { CountryField } from './CountryField';

describe('CountryField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'BR', label: 'Brazil' },
    { value: 'AR', label: 'Argentina' },
    { value: 'MX', label: 'Mexico' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'zone') return 'LATAM';
      if (key === 'country') return 'BR';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        country: {
          values: {
            LATAM: mockOptions,
          },
        },
      },
    });
  });

  const defaultProps = {
    fieldKey: 'country',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  };

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
      expect(screen.getByLabelText('Country')).toHaveValue('BR');
    });

    it('should get zone value to determine options', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('zone');
    });
  });

  describe('options based on zone', () => {
    it('should display options for LATAM zone', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should use empty array when zone has no country options', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'zone') return 'NAZ';
        if (key === 'country') return '';
        return '';
      });

      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      fireEvent.change(select, { target: { value: 'AR' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('country', {
        value: 'AR',
        label: 'Argentina',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      fireEvent.change(select, { target: { value: 'MX' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Country Select',
        event_action: 'Select',
        event_label: 'MX',
      });
    });
  });

  describe('disabled state', () => {
    it('should not be disabled when country and zone are Global (ABI)', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'zone') return 'ABI';
        if (key === 'country') return 'ABI';
        if (key === 'kpis') return '';
        return '';
      });

      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Country');
      expect(select).not.toBeDisabled();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-country')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <CountryField
          fieldKey="country"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-country"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
