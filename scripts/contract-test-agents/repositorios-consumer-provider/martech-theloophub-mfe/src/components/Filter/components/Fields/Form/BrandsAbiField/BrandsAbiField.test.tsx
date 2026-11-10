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
    optional,
  }: {
    dataTestId?: string;
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: any) => void;
    placeholder: string;
    disabled?: boolean;
    optional?: boolean;
  }) => (
    <div data-testid={dataTestId || 'select-component'}>
      <label htmlFor={id}>
        {label}
        {optional && ' (optional)'}
      </label>
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

import { BrandsAbiField } from './BrandsAbiField';

describe('BrandsAbiField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'Brahma', label: 'Brahma' },
    { value: 'Skol', label: 'Skol' },
    { value: 'Stella', label: 'Stella Artois' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'country') return 'BR';
      if (key === 'brands_abi') return 'Brahma';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        brands_abi: {
          values: {
            BR: mockOptions,
          },
        },
      },
    });
  });

  const defaultProps = {
    fieldKey: 'brands_abi',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  };

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText(/Brand ABI/)).toBeInTheDocument();
    });

    it('should render as optional field', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Brand ABI (optional)')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('brands_abi');
      expect(screen.getByLabelText(/Brand ABI/)).toHaveValue('Brahma');
    });

    it('should get country value to determine options', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
    });
  });

  describe('options based on country', () => {
    it('should display options for BR country', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should use empty array when country has no brand options', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        if (key === 'brands_abi') return '';
        return '';
      });

      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      fireEvent.change(select, { target: { value: 'Skol' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('brands_abi', {
        value: 'Skol',
        label: 'Skol',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      fireEvent.change(select, { target: { value: 'Stella' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Brand ABI Select',
        event_action: 'Select',
        event_label: 'Stella',
      });
    });
  });

  describe('disabled state', () => {
    it('should be disabled when country is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'ABI';
        if (key === 'brands_abi') return '';
        return '';
      });

      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      expect(select).toBeDisabled();
    });

    it('should not be disabled when country is not ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands_abi') return 'Brahma';
        return '';
      });

      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand ABI/);
      expect(select).not.toBeDisabled();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-brands_abi')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <BrandsAbiField
          fieldKey="brands_abi"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brands-abi"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
