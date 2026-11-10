jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
  }: {
    dataTestId?: string;
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: any) => void;
    placeholder: string;
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

import { ScopesField } from './ScopesField';

describe('ScopesField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'global_brands', label: 'Global Brands' },
    { value: 'segment', label: 'Segment' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('portfolio');

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        brand_power_book_scopes: {
          values: mockOptions,
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render Select component', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with correct label', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByLabelText('Scope')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('scopes');
      expect(screen.getByLabelText('Scope')).toHaveValue('portfolio');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should use empty array when scopes values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
      });

      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('options filtering based on zone', () => {
    it('should filter out global_brands when zone is not ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'zone') return 'LATAM';
        if (key === 'scopes') return 'portfolio';
        return '';
      });

      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      const optionValues = Array.from(select.querySelectorAll('option')).map(
        (opt: HTMLOptionElement) => opt.value,
      );

      expect(optionValues).not.toContain('global_brands');
      expect(optionValues).toContain('portfolio');
      expect(optionValues).toContain('segment');
    });

    it('should include global_brands when zone is ABI', () => {
      mockGetCurrentValue.mockImplementation((key) => {
        if (key === 'zone') return 'ABI';
        if (key === 'scopes') return 'global_brands';
        return '';
      });

      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      const optionValues = Array.from(select.querySelectorAll('option')).map(
        (opt: HTMLOptionElement) => opt.value,
      );

      expect(optionValues).toContain('global_brands');
      expect(optionValues).toContain('portfolio');
      expect(optionValues).toContain('segment');
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      fireEvent.change(select, { target: { value: 'segment' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('scopes', {
        value: 'segment',
        label: 'Segment',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByLabelText('Scope');
      fireEvent.change(select, { target: { value: 'segment' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Scope Select',
        event_action: 'Select',
        event_label: 'segment',
      });
    });
  });

  describe('memoization', () => {
    it('should memoize options based on dataFilters', () => {
      const { rerender } = render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const selectBefore = screen.getByLabelText('Scope');
      const optionsBefore = selectBefore.querySelectorAll('option').length;

      rerender(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const selectAfter = screen.getByLabelText('Scope');
      const optionsAfter = selectAfter.querySelectorAll('option').length;

      expect(optionsBefore).toBe(optionsAfter);
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-scopes')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <ScopesField
          fieldKey="scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-scopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
