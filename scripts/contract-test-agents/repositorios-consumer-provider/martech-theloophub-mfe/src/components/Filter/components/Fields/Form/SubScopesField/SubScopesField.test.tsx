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
    onValueChange?: (option: any) => void;
    placeholder: string;
    disabled?: boolean;
  }) => (
    <div data-testid={dataTestId || 'select-component'}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          if (onValueChange) {
            const option = options.find((opt) => opt.value === e.target.value);
            onValueChange(option);
          }
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

import { SubScopesField } from './SubScopesField';

describe('SubScopesField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockPortfolioOptions = [
    { value: 'Core', label: 'Core' },
    { value: 'Core+', label: 'Core+' },
  ];

  const mockGlobalBrandsOptions = [
    { value: 'Budweiser', label: 'Budweiser' },
    { value: 'Corona', label: 'Corona' },
  ];

  const mockSegmentOptions = [
    { value: 'Premium', label: 'Premium' },
    { value: 'Mainstream', label: 'Mainstream' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key) => {
      if (key === 'scopes') return 'portfolio';
      if (key === 'sub_scopes') return 'Core';
      return '';
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        portfolio: { values: mockPortfolioOptions },
        global_brands: { values: mockGlobalBrandsOptions },
        segments: { values: mockSegmentOptions },
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should get scope value to determine options', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('scopes');
    });
  });

  describe('options based on scope', () => {
    it('should display portfolio options when scope is portfolio', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      const select = screen.getByLabelText('Portfolio');
      expect(select.querySelectorAll('option')).toHaveLength(2);
    });

    it('should display global brands options when scope is global_brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return 'global_brands';
        if (key === 'sub_scopes') return 'Budweiser';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Global Brands')).toBeInTheDocument();
      const select = screen.getByLabelText('Global Brands');
      expect(select.querySelectorAll('option')).toHaveLength(2);
    });

    it('should display segment options when scope is segment', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return 'segment';
        if (key === 'sub_scopes') return 'Premium';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Segment')).toBeInTheDocument();
      const select = screen.getByLabelText('Segment');
      expect(select.querySelectorAll('option')).toHaveLength(2);
    });

    it('should use empty array when dataFilters is null', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: null,
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Portfolio');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('dynamic labels and placeholders', () => {
    it('should show Portfolio label and placeholder when scope is portfolio', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      expect(screen.getByLabelText('Portfolio')).toHaveAttribute(
        'data-placeholder',
        'Select a Portfolio',
      );
    });

    it('should show Global Brands label and placeholder when scope is global_brands', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return 'global_brands';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Global Brands')).toBeInTheDocument();
      expect(screen.getByLabelText('Global Brands')).toHaveAttribute(
        'data-placeholder',
        'Select a Global Brands',
      );
    });

    it('should show Segment label and placeholder when scope is segment', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return 'segment';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Segment')).toBeInTheDocument();
      expect(screen.getByLabelText('Segment')).toHaveAttribute(
        'data-placeholder',
        'Select a Segment',
      );
    });
  });

  describe('disabled state', () => {
    it('should be disabled when no scope is selected', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return '';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub Scope');
      expect(select).toBeDisabled();
      expect(select).toHaveAttribute(
        'data-placeholder',
        'Select a scope first',
      );
    });

    it('should not be disabled when scope is selected', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return 'portfolio';
        if (key === 'sub_scopes') return 'Core';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Portfolio');
      expect(select).not.toBeDisabled();
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Portfolio');
      fireEvent.change(select, { target: { value: 'Core+' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('sub_scopes', {
        value: 'Core+',
        label: 'Core+',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Portfolio');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Portfolio');
      fireEvent.change(select, { target: { value: 'Core+' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Sub Scope Select',
        event_action: 'Select',
        event_label: 'Core+',
      });
    });

    it('should not trigger onValueChange when disabled', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'scopes') return '';
        return '';
      });

      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Sub Scope');
      fireEvent.change(select, { target: { value: 'Core' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('memoization', () => {
    it('should memoize options based on dataFilters and scope', () => {
      const { rerender } = render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const selectBefore = screen.getByLabelText('Portfolio');
      const optionsBefore = selectBefore.querySelectorAll('option').length;

      rerender(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const selectAfter = screen.getByLabelText('Portfolio');
      const optionsAfter = selectAfter.querySelectorAll('option').length;

      expect(optionsBefore).toBe(optionsAfter);
      expect(optionsBefore).toBe(2);
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-sub-scopes-sub_scopes'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <SubScopesField
          fieldKey="sub_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-sub-scopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
