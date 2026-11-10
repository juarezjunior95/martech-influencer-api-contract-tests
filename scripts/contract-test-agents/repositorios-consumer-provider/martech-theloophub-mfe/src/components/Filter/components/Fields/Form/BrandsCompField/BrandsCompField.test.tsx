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

import { BrandsCompField } from './BrandsCompField';

describe('BrandsCompField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'Heineken', label: 'Heineken' },
    { value: 'Budweiser', label: 'Budweiser' },
    { value: 'Corona', label: 'Corona' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'country') return 'BR';
      if (key === 'brands_abi') return 'Brahma';
      if (key === 'brands_comp') return 'Heineken';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        brands_comp: {
          values: {
            BR: mockOptions,
          },
        },
      },
    });
  });

  const defaultProps = {
    fieldKey: 'brands_comp',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  };

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText(/Brand Competitor/)).toBeInTheDocument();
    });

    it('should render as optional field', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(
        screen.getByLabelText('Brand Competitor (optional)'),
      ).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('brands_comp');
      expect(screen.getByLabelText(/Brand Competitor/)).toHaveValue('Heineken');
    });

    it('should get country value to determine options', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
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
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should use empty array when country has no brand options', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        if (key === 'brands_comp') return '';
        return '';
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      fireEvent.change(select, { target: { value: 'Budweiser' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('brands_comp', {
        value: 'Budweiser',
        label: 'Budweiser',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      fireEvent.change(select, { target: { value: 'Corona' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Brand Competitor Select',
        event_action: 'Select',
        event_label: 'Corona',
      });
    });
  });

  describe('disabled state', () => {
    it('should be disabled when country is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'ABI';
        return '';
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select).toBeDisabled();
    });

    it('should be disabled when brands_abi is "All"', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands_abi') return 'All';
        return '';
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select).toBeDisabled();
    });

    it('should not be disabled when country is not ABI and brands_abi is not "All"', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands_abi') return 'Brahma';
        if (key === 'brands_comp') return 'Heineken';
        return '';
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select).not.toBeDisabled();
    });
  });

  describe('placeholder', () => {
    it('should display "All" placeholder when country is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'ABI';
        return '';
      });

      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select).toHaveAttribute('data-placeholder', 'All');
    });

    it('should display "Select an option" placeholder when country is not ABI', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText(/Brand Competitor/);
      expect(select).toHaveAttribute('data-placeholder', 'Select an option');
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-brands_comp')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <BrandsCompField
          fieldKey="brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brands-comp"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
