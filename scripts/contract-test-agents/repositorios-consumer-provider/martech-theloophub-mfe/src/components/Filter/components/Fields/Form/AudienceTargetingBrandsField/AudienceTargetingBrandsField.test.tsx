jest.mock('components/Form', () => ({
  Select: ({
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
    disabled,
    dataTestId,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: any) => void;
    placeholder: string;
    disabled?: boolean;
    dataTestId?: string;
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
  ChipsSelect: ({
    options,
    value,
    onChange,
    dataTestId,
  }: {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: () => void;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'chips-select-component'}>
      {options.map((opt) => (
        <button
          key={opt.value}
          data-testid={`chip-${opt.value}`}
          data-selected={value === opt.value}
          onClick={onChange}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { AudienceTargetingBrandsField } from './AudienceTargetingBrandsField';

describe('AudienceTargetingBrandsField', () => {
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
      if (key === 'audience_targeting_brands') return 'Brahma';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        audience_targeting_brands: {
          values: {
            BR: mockOptions,
          },
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render All Brands chip', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
      expect(screen.getByText('All Brands')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Brand ABI')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith(
        'audience_targeting_brands',
      );
      expect(screen.getByLabelText('Brand ABI')).toHaveValue('Brahma');
    });

    it('should get country value to determine options', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
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
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should use empty array when country has no brand options', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        if (key === 'audience_targeting_brands') return '';
        return '';
      });

      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          audience_targeting_brands: {},
        },
      });

      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      fireEvent.change(select, { target: { value: 'Skol' } });

      expect(mockOnValueChange).toHaveBeenCalledWith(
        'audience_targeting_brands',
        {
          value: 'Skol',
          label: 'Skol',
        },
      );
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      fireEvent.change(select, { target: { value: 'Stella' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Brand ABI Select',
        event_action: 'Select',
        event_label: 'Stella',
      });
    });

    it('should handle array options correctly', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      fireEvent.change(select, { target: { value: 'Skol' } });

      expect(mockOnValueChange).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when country is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'ABI';
        return '';
      });

      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select).toBeDisabled();
    });

    it('should not be disabled when country is not ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'audience_targeting_brands') return 'Brahma';
        return '';
      });

      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select).not.toBeDisabled();
    });
  });

  describe('All Brands chip', () => {
    it('should always render chip as selected', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      const chip = screen.getByTestId('chip-all_brands');
      expect(chip).toHaveAttribute('data-selected', 'true');
    });

    it('should not call onValueChange when chip is clicked', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      fireEvent.click(screen.getByText('All Brands'));

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('placeholder', () => {
    it('should display correct placeholder', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand ABI');
      expect(select).toHaveAttribute(
        'data-placeholder',
        'Select audience_targeting_brands',
      );
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-audience_targeting_brands'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <AudienceTargetingBrandsField
          fieldKey="audience_targeting_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-audience-targeting-brands"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
