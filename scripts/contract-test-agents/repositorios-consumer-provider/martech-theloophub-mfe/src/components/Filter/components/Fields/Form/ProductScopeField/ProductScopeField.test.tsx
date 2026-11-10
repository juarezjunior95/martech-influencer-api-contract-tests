import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';

import { ProductScopeField } from './ProductScopeField';

jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    options,
    onChange,
  }: {
    dataTestId?: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: { value: string; label: string }) => void;
  }) => (
    <div data-testid={dataTestId || 'chips-select'} data-value={value}>
      {options.map((opt) => (
        <button
          key={opt.value}
          data-testid={`option-${opt.value}`}
          onClick={() => onChange(opt)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  usePageFilterData: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(),
    })),
  },
}));

describe('ProductScopeField', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn().mockReturnValue('Beer + Adjacencies');
  const mockGetOptions = jest.fn().mockReturnValue([
    { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
    { value: 'Total ABI', label: 'Total ABI' },
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        product_scope: {
          values: [
            { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
            { value: 'Total ABI', label: 'Total ABI' },
          ],
        },
      },
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: mockGetOptions,
    });
  });

  it('renders ProductScope chips select', () => {
    render(
      <ProductScopeField
        fieldKey="product_scope"
        pageName="value-creation_volume-pages"
        onValueChange={mockOnValueChange}
        getCurrentValue={mockGetCurrentValue}
      />,
    );

    expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    expect(screen.getByTestId('option-Beer + Adjacencies')).toBeInTheDocument();
    expect(screen.getByTestId('option-Total ABI')).toBeInTheDocument();
  });

  it('calls onValueChange with selected option', () => {
    render(
      <ProductScopeField
        fieldKey="product_scope"
        pageName="value-creation_volume-pages"
        onValueChange={mockOnValueChange}
        getCurrentValue={mockGetCurrentValue}
      />,
    );

    fireEvent.click(screen.getByTestId('option-Total ABI'));

    expect(mockOnValueChange).toHaveBeenCalledWith('product_scope', {
      value: 'Total ABI',
      label: 'Total ABI',
    });
  });

  it('loads options using FilterDataAccessor', () => {
    render(
      <ProductScopeField
        fieldKey="product_scope"
        pageName="value-creation_volume-pages"
        onValueChange={mockOnValueChange}
        getCurrentValue={mockGetCurrentValue}
      />,
    );

    expect(mockGetOptions).toHaveBeenCalledWith(
      'product_scope',
      {
        product_scope: {
          values: [
            { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
            { value: 'Total ABI', label: 'Total ABI' },
          ],
        },
      },
      {},
    );
  });
});
