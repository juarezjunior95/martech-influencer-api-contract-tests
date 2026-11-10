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
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { AudienceTargetingBrandsCompField } from './AudienceTargetingBrandsCompField';

describe('AudienceTargetingBrandsCompField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockBrandsData = [
    {
      value: 'Brahma',
      label: 'Brahma',
      competitor: [
        { value: 'Heineken', label: 'Heineken' },
        { value: 'Budweiser', label: 'Budweiser' },
      ],
    },
    {
      value: 'Skol',
      label: 'Skol',
      competitor: [{ value: 'Corona', label: 'Corona' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'country') return 'BR';
      if (key === 'audience_targeting_brands') return 'Brahma';
      if (key === 'audience_targeting_brands_comp') return 'Heineken';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        audience_targeting_brands: {
          values: {
            BR: mockBrandsData,
          },
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Brand Competitor')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith(
        'audience_targeting_brands_comp',
      );
      expect(screen.getByLabelText('Brand Competitor')).toHaveValue('Heineken');
    });
  });

  describe('options based on country and brand', () => {
    it('should get country and brand values to determine options', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
      expect(mockGetCurrentValue).toHaveBeenCalledWith(
        'audience_targeting_brands',
      );
    });

    it('should display competitor options for selected brand', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select.querySelectorAll('option')).toHaveLength(2);
    });

    it('should use empty array when brand has no competitors', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'audience_targeting_brands') return 'UnknownBrand';
        return '';
      });

      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should display different competitors for different brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'audience_targeting_brands') return 'Skol';
        return '';
      });

      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select.querySelectorAll('option')).toHaveLength(1);
    });

    it('should use empty array when country has no brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        return '';
      });

      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      fireEvent.change(select, { target: { value: 'Budweiser' } });

      expect(mockOnValueChange).toHaveBeenCalledWith(
        'audience_targeting_brands_comp',
        {
          value: 'Budweiser',
          label: 'Budweiser',
        },
      );
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      fireEvent.change(select, { target: { value: 'Budweiser' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Brand Competitor Select',
        event_action: 'Select',
        event_label: 'Budweiser',
      });
    });

    it('should handle array options correctly', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      fireEvent.change(select, { target: { value: 'Budweiser' } });

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
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select).toBeDisabled();
    });

    it('should not be disabled when country is not ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'audience_targeting_brands') return 'Brahma';
        if (key === 'audience_targeting_brands_comp') return 'Heineken';
        return '';
      });

      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select).not.toBeDisabled();
    });
  });

  describe('placeholder', () => {
    it('should display correct placeholder', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Brand Competitor');
      expect(select).toHaveAttribute(
        'data-placeholder',
        'Select audience_targeting_brands_comp',
      );
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-audience_targeting_brands_comp'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <AudienceTargetingBrandsCompField
          fieldKey="audience_targeting_brands_comp"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-audience-targeting-brands-comp"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
