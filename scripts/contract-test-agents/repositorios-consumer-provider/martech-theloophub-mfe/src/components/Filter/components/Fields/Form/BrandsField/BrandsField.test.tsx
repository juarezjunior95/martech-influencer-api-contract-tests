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

jest.mock('hooks/useFilters/core/useFilterRules', () => ({
  useFilterRules: () => ({
    getFieldConfig: (_fieldKey: string, state: { country?: string }) => ({
      label: 'Brand',
      hidden: false,
      disabled: state?.country === 'ABI',
    }),
  }),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { BrandsField } from './BrandsField';

describe('BrandsField', () => {
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
      if (key === 'brands') return 'Brahma';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        brands: {
          values: {
            BR: {
              brands: mockOptions,
            },
          },
        },
      },
      defaults: {
        brands: 'Brahma',
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Brand')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('brands');
      expect(screen.getByLabelText('Brand')).toHaveValue('Brahma');
    });

    it('should get country value to determine options', () => {
      render(
        <BrandsField
          fieldKey="brands"
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
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      expect(select.querySelectorAll('option')).toHaveLength(4);
    });

    it('should use empty array when country has no brand options', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        if (key === 'brands') return '';
        return '';
      });

      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
        defaults: {},
      });

      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      fireEvent.change(select, { target: { value: 'Skol' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('brands', {
        value: 'Skol',
        label: 'Skol',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      fireEvent.change(select, { target: { value: 'Stella' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Brand Select',
        event_action: 'Select',
        event_label: 'Stella',
      });
    });
  });

  describe('disabled state', () => {
    it('should be disabled when country is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'ABI';
        if (key === 'brands') return '';
        return '';
      });

      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      expect(select).toBeDisabled();
    });

    it('should not be disabled when country is not ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands') return 'Brahma';
        return '';
      });

      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand');
      expect(select).not.toBeDisabled();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-brands')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <BrandsField
          fieldKey="brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brands"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
