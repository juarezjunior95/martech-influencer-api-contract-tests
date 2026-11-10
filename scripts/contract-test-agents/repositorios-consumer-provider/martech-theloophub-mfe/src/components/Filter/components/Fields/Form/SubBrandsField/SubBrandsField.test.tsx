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
    onValueChange: (
      option: { value: string; label: string } | undefined,
    ) => void;
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

import { SubBrandsField } from './SubBrandsField';

describe('SubBrandsField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockSubBrandsOptions = [
    { value: 'Brahma Extra', label: 'Brahma Extra' },
    { value: 'Brahma Duplo Malte', label: 'Brahma Duplo Malte' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'country') return 'BR';
      if (key === 'brands') return 'Brahma';
      if (key === 'sub_brands') return 'Brahma Extra';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        brands: {
          values: {
            BR: {
              brands: [
                {
                  value: 'Brahma',
                  label: 'Brahma',
                  sub_brands: mockSubBrandsOptions,
                },
                {
                  value: 'Skol',
                  label: 'Skol',
                  sub_brands: [],
                },
              ],
            },
          },
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Sub-Brand')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('sub_brands');
      expect(screen.getByLabelText('Sub-Brand')).toHaveValue('Brahma Extra');
    });
  });

  describe('options based on country and brand', () => {
    it('should get country and brand values to determine options', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
      expect(mockGetCurrentValue).toHaveBeenCalledWith('brands');
    });

    it('should display sub-brands for selected brand', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select.querySelectorAll('option')).toHaveLength(2);
    });

    it('should use empty array when brand has no sub-brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands') return 'Skol';
        if (key === 'sub_brands') return '';
        return '';
      });

      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when country has no brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'US';
        return '';
      });

      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      fireEvent.change(select, { target: { value: 'Brahma Duplo Malte' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('sub_brands', {
        value: 'Brahma Duplo Malte',
        label: 'Brahma Duplo Malte',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      fireEvent.change(select, { target: { value: 'Brahma Duplo Malte' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Sub Brand Select',
        event_action: 'Select',
        event_label: 'Brahma Duplo Malte',
      });
    });
  });

  describe('disabled state', () => {
    it('should be disabled when brands is "All"', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'brands') return 'All';
        return '';
      });

      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select).toBeDisabled();
    });

    it('should not be disabled when brands is not "All"', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'country') return 'BR';
        if (key === 'brands') return 'Brahma';
        if (key === 'sub_brands') return 'Brahma Extra';
        return '';
      });

      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub-Brand');
      expect(select).not.toBeDisabled();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-sub_brands')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <SubBrandsField
          fieldKey="sub_brands"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-sub-brands"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
