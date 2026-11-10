import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProductScopeQuickFilter } from './ProductScopeQuickFilter';

const mockHandleValueChange = jest.fn();
const mockHandleClear = jest.fn();

jest.mock('components/Filter/hooks/useQuickFilter', () => ({
  useQuickFilter: jest.fn(() => ({
    options: [
      { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
      { value: 'Total ABI', label: 'Total ABI' },
    ],
    currentValue: { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
    handleValueChange: mockHandleValueChange,
    handleClear: mockHandleClear,
    showClearIcon: true,
  })),
}));

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    options,
    onValueChange,
    onClearSingle,
  }: {
    dataTestId?: string;
    id: string;
    value: { value: string; label: string };
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: { value: string; label: string }) => void;
    onClearSingle?: () => void;
  }) => (
    <div>
      <select
        data-testid={dataTestId || id}
        value={value?.value}
        onChange={(e) =>
          onValueChange({ value: e.target.value, label: e.target.value })
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        data-testid={`${dataTestId || id}-clear`}
        onClick={onClearSingle}
      />
    </div>
  ),
}));

describe('ProductScopeQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'Beer + Adjacencies',
    label: 'Beer + Adjacencies',
  }));

  const defaultProps = {
    fieldKey: 'product_scope',
    pageName: 'value-creation_volume-pages',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders select for product_scope quick filter', () => {
    render(<ProductScopeQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('product_scope-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('calls handleValueChange when selection changes', async () => {
    const user = userEvent.setup();
    render(<ProductScopeQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('product_scope-select-quick-filter');
    await user.selectOptions(select, 'Total ABI');

    expect(mockHandleValueChange).toHaveBeenCalledWith({
      value: 'Total ABI',
      label: 'Total ABI',
    });
  });

  it('calls handleClear when clear action is triggered', async () => {
    const user = userEvent.setup();
    render(<ProductScopeQuickFilter {...defaultProps} />);

    await user.click(
      screen.getByTestId('product_scope-select-quick-filter-clear'),
    );

    expect(mockHandleClear).toHaveBeenCalled();
  });
});
