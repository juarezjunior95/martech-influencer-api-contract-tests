jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(),
  usePageFilterData: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(),
    })),
  },
}));

jest.mock('components/Form', () => ({
  ChipsSelect: jest.fn(({ value, onChange, options, dataTestId }) => (
    <div data-testid={dataTestId || 'chips-select'}>
      <div
        data-testid={
          dataTestId ? `${dataTestId}-current-value` : 'current-value'
        }
      >
        {value}
      </div>
      {options?.map((opt: any) => (
        <button
          key={opt.value}
          data-testid={`option-${opt.value}`}
          onClick={() => onChange(opt)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { DistributionScopesField } from './DistributionScopesField';

describe('DistributionScopesField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;
  let mockGetOptions: jest.Mock;

  const mockOptions = [
    { value: 'on_trade', label: 'On Trade' },
    { value: 'off_trade', label: 'Off Trade' },
    { value: 'total', label: 'Total' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('on_trade');
    mockGetOptions = jest.fn().mockReturnValue(mockOptions);

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        distribution_scopes: {
          values: mockOptions,
        },
      },
    });

    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: mockGetOptions,
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByText('Distribution Scope')).toBeInTheDocument();
      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should display options from FilterDataAccessor', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetOptions).toHaveBeenCalledWith(
        'distribution_scopes',
        {
          distribution_scopes: {
            values: mockOptions,
          },
        },
        {},
      );
    });

    it('should show current value', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('distribution_scopes');
    });

    it('should render all options as buttons', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('option-on_trade')).toBeInTheDocument();
      expect(screen.getByTestId('option-off_trade')).toBeInTheDocument();
      expect(screen.getByTestId('option-total')).toBeInTheDocument();
    });
  });

  describe('value change', () => {
    it('should call onValueChange when option is selected', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const offTradeButton = screen.getByTestId('option-off_trade');
      fireEvent.click(offTradeButton);

      expect(mockOnValueChange).toHaveBeenCalledWith('distribution_scopes', {
        value: 'off_trade',
        label: 'Off Trade',
      });
    });

    it('should track Google Analytics event on value change', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const totalButton = screen.getByTestId('option-total');
      fireEvent.click(totalButton);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Distribution Scope Select',
        event_action: 'Select',
        event_label: 'total',
      });
    });

    it('should not call onValueChange if option value is empty', () => {
      mockGetOptions.mockReturnValue([{ value: '', label: 'Empty' }]);

      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const emptyButton = screen.getByTestId('option-');
      fireEvent.click(emptyButton);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should render ChipsSelect with correct value', () => {
      mockGetCurrentValue.mockReturnValue('off_trade');

      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('distribution_scopes');
      expect(screen.getByTestId('current-value')).toHaveTextContent(
        'off_trade',
      );
    });
  });

  describe('hooks integration', () => {
    it('should use usePageFilterData with correct pageName', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should use useGoogleAnalytics hook', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(useGoogleAnalytics).toHaveBeenCalled();
    });
  });

  describe('options memoization', () => {
    it('should memoize options based on fieldKey and dataFilters', () => {
      const { rerender } = render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const initialCallCount = mockGetOptions.mock.calls.length;

      rerender(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetOptions).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should recalculate options when dataFilters change', () => {
      const { rerender } = render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const newOptions = [{ value: 'new_option', label: 'New Option' }];

      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          distribution_scopes: {
            values: newOptions,
          },
        },
      });

      rerender(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetOptions).toHaveBeenCalledWith(
        'distribution_scopes',
        {
          distribution_scopes: {
            values: newOptions,
          },
        },
        {},
      );
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-distribution_scopes'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <DistributionScopesField
          fieldKey="distribution_scopes"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-distribution-scopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
