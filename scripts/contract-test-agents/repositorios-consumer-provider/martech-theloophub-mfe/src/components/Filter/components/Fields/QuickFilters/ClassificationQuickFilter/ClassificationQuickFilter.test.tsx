import { fireEvent, render, screen } from '@testing-library/react';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { Option } from 'models/Filters';

import { ClassificationQuickFilter } from './ClassificationQuickFilter';

jest.mock('components/Filter/hooks/useQuickFilter', () => ({
  useQuickFilter: jest.fn(),
}));

jest.mock('components/Form', () => ({
  Select: ({
    id,
    value,
    options,
    onValueChange,
    onClearSingle,
    placeholder,
    valueLabel,
  }: any) => (
    <div data-testid="select-component">
      <input
        data-testid={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onValueChange({ value: e.target.value, label: e.target.value })
        }
      />
      <button data-testid="clear-button" onClick={onClearSingle}>
        Clear
      </button>
      <span data-testid="value-label">{valueLabel}</span>
      <div data-testid="options">
        {options?.map((opt: Option) => (
          <div key={opt.value}>{opt.label}</div>
        ))}
      </div>
    </div>
  ),
}));

const mockOnValueChange = jest.fn();
const mockGetCurrentValue = jest.fn();
const mockHandleValueChange = jest.fn();
const mockHandleClear = jest.fn();

const mockOptions: Option[] = [
  { value: 'All', label: 'All' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Core', label: 'Core' },
];

const setupMocks = (overrides = {}) => {
  mockGetCurrentValue.mockReturnValue('BR');

  (useQuickFilter as jest.Mock).mockReturnValue({
    options: mockOptions,
    currentValue: 'All',
    handleValueChange: mockHandleValueChange,
    handleClear: mockHandleClear,
    showClearIcon: false,
    ...overrides,
  });
};

const buildProps = (fieldKey: string) => ({
  fieldKey,
  pageName: 'performance_tool',
  onValueChange: mockOnValueChange,
  getCurrentValue: mockGetCurrentValue,
});

describe('ClassificationQuickFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(['portfolios', 'beer_price_segment'])(
    'with fieldKey="%s"',
    (fieldKey) => {
      const testId = `${fieldKey}-select-quick-filter`;

      beforeEach(() => {
        setupMocks();
      });

      it('should render the select with correct id', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });

      it('should display "Classification" as value label', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        expect(screen.getByTestId('value-label')).toHaveTextContent(
          'Classification',
        );
      });

      it('should pass country and fieldKey to useQuickFilter', () => {
        mockGetCurrentValue.mockReturnValue('US');

        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        expect(useQuickFilter).toHaveBeenCalledWith({
          fieldKey,
          pageName: 'performance_tool',
          gaCategory: 'Classification Select',
          filterContext: { country: 'US' },
          onValueChange: mockOnValueChange,
          getCurrentValue: mockGetCurrentValue,
        });
      });

      it('should call handleValueChange when an option is selected', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        const input = screen.getByTestId(testId);
        fireEvent.change(input, { target: { value: 'Premium' } });

        expect(mockHandleValueChange).toHaveBeenCalledWith({
          value: 'Premium',
          label: 'Premium',
        });
      });

      it('should call handleClear when clear button is clicked', () => {
        setupMocks({ currentValue: 'Premium', showClearIcon: true });

        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        fireEvent.click(screen.getByTestId('clear-button'));

        expect(mockHandleClear).toHaveBeenCalled();
      });

      it('should display the correct options', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        const optionsContainer = screen.getByTestId('options');
        expect(optionsContainer).toHaveTextContent('All');
        expect(optionsContainer).toHaveTextContent('Premium');
        expect(optionsContainer).toHaveTextContent('Core');
      });

      it('should use currentValue from hook', () => {
        setupMocks({ currentValue: 'Premium', showClearIcon: true });

        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        const input = screen.getByTestId(testId) as HTMLInputElement;
        expect(input.value).toBe('Premium');
      });

      it('should set placeholder based on fieldKey', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        const input = screen.getByTestId(testId);
        expect(input).toHaveAttribute('placeholder', `Select ${fieldKey}`);
      });

      it('should handle different country values', () => {
        mockGetCurrentValue.mockReturnValue('ABI');

        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        expect(useQuickFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            filterContext: { country: 'ABI' },
          }),
        );
      });

      it('should render when showClearIcon is false', () => {
        render(<ClassificationQuickFilter {...buildProps(fieldKey)} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    },
  );
});
