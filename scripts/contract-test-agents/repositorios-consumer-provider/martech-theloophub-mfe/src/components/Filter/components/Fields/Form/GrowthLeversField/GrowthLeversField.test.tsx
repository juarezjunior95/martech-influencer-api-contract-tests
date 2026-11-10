jest.mock('components/Form', () => ({
  ChipsSelect: ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: { value: string; label: string }) => void;
  }) => (
    <div data-testid="chips-select-component">
      <select
        data-testid="chips-select"
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          if (option) onChange(option);
        }}
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
      getOptions: jest.fn(
        (
          _fieldKey: string,
          dataFilters: unknown,
          _applied: Record<string, unknown>,
        ) => {
          if (
            !dataFilters ||
            !(dataFilters as { growth_levers?: { values?: unknown[] } })
              .growth_levers
          )
            return [];
          const values =
            (
              dataFilters as {
                growth_levers: {
                  values: Array<{ value: string; label: string }>;
                };
              }
            ).growth_levers.values || [];
          return values;
        },
      ),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import * as FilterDataAccessorModule from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { GrowthLeversField } from './GrowthLeversField';

describe('GrowthLeversField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'All', label: 'All' },
    { value: 'Lead Premium', label: 'Lead Premium' },
    { value: 'Superior Core', label: 'Superior Core' },
    { value: 'Balanced Choices', label: 'Balanced Choices' },
    { value: 'Beyond Beer', label: 'Beyond Beer' },
  ];

  const defaultProps = {
    fieldKey: 'growth_levers',
    pageName: 'test-page',
    onValueChange: jest.fn(),
    getCurrentValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'zone') return 'LATAM';
      if (key === 'country') return 'BRA';
      if (key === 'growth_levers') return 'All';
      return null;
    });

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        growth_levers: {
          values: mockOptions,
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should render ChipsSelect with correct value', () => {
      const getCurrentValue = jest.fn((key: string) => {
        if (key === 'zone') return 'LATAM';
        if (key === 'country') return 'BRA';
        if (key === 'growth_levers') return 'Lead Premium';
        return null;
      });

      render(
        <GrowthLeversField
          {...defaultProps}
          getCurrentValue={getCurrentValue}
        />,
      );

      expect(getCurrentValue).toHaveBeenCalledWith('zone');
      expect(getCurrentValue).toHaveBeenCalledWith('country');
      expect(getCurrentValue).toHaveBeenCalledWith('growth_levers');
      expect(screen.getByTestId('chips-select')).toHaveValue('Lead Premium');
    });

    it('should filter out All option from options', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      const options = select.querySelectorAll('option');
      const optionValues = Array.from(options).map((o) =>
        o.getAttribute('value'),
      );

      expect(optionValues).not.toContain('All');
      expect(options).toHaveLength(4);
    });

    it('should pass options without All to ChipsSelect', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      expect(
        select.querySelector('option[value="Lead Premium"]'),
      ).toHaveTextContent('Lead Premium');
      expect(
        select.querySelector('option[value="Superior Core"]'),
      ).toHaveTextContent('Superior Core');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should call getCurrentValue for zone and country', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('zone');
      expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
      expect(mockGetCurrentValue).toHaveBeenCalledWith('growth_levers');
    });

    it('should use empty array when growth_levers values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
      });

      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'Lead Premium' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('growth_levers', {
        value: 'Lead Premium',
        label: 'Lead Premium',
      });
    });

    it('should call onValueChange with All when selecting same value as current', () => {
      const getCurrentValue = jest.fn((key: string) => {
        if (key === 'zone') return 'LATAM';
        if (key === 'country') return 'BRA';
        if (key === 'growth_levers') return 'Lead Premium';
        return null;
      });

      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={getCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'Lead Premium' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('growth_levers', {
        value: 'All',
        label: 'All',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'INVALID' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'Superior Core' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Growth Levers Select',
        event_action: 'Select',
        event_label: 'Superior Core',
      });
    });

    it('should call onValueChange after tracking GA', () => {
      const callOrder: string[] = [];
      const trackGA = jest.fn(() => callOrder.push('trackGA'));
      const onValueChange = jest.fn(() => callOrder.push('onValueChange'));

      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={onValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'Beyond Beer' } });

      expect(callOrder).toEqual(['trackGA', 'onValueChange']);
    });
  });

  describe('FilterDataAccessor integration', () => {
    it('should use FilterDataAccessor to get options with zone and country', () => {
      const getOptions = jest.fn().mockReturnValue(mockOptions);

      (
        FilterDataAccessorModule.FilterDataAccessor.getInstance as jest.Mock
      ).mockReturnValue({ getOptions });

      render(
        <GrowthLeversField
          {...defaultProps}
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(getOptions).toHaveBeenCalledWith(
        'growth_levers',
        expect.any(Object),
        { zone: 'LATAM', country: 'BRA' },
      );
    });
  });
});
