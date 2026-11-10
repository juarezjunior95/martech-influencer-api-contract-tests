import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Option } from 'models/Filters';

import { PowerAwarenessFilter } from './PowerAwarenessFilter';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('@hexa-ui/icons2', () => ({
  BarChart2: { name: 'BarChart2' },
}));

jest.mock('components', () => ({
  Select: ({
    value,
    options,
    onValueChange,
  }: {
    value: string;
    options: Array<{ value: string; label: string; isDisabled?: boolean }>;
    onValueChange: (option: Option) => void;
  }) => (
    <div data-testid="select" data-value={value}>
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          onClick={() => onValueChange(option as Option)}
          disabled={option.isDisabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../../constants', () => ({
  unaidedAwarenessOptions: [
    { value: 'top_of_mind', label: 'Top of Mind', disabled: false },
    { value: 'spontaneous', label: 'Spontaneous', disabled: false },
    { value: 'total', label: 'Total', disabled: true },
  ],
}));

describe('PowerAwarenessFilter', () => {
  it('renders all options with the current value and disabled flags', () => {
    render(<PowerAwarenessFilter value="spontaneous" onChange={jest.fn()} />);

    expect(screen.getByTestId('select')).toHaveAttribute(
      'data-value',
      'spontaneous',
    );
    expect(screen.getByTestId('option-top_of_mind')).not.toBeDisabled();
    expect(screen.getByTestId('option-spontaneous')).not.toBeDisabled();
    expect(screen.getByTestId('option-total')).toBeDisabled();
  });

  it('calls onChange with the selected option object', async () => {
    const onChange = jest.fn();
    render(<PowerAwarenessFilter value="top_of_mind" onChange={onChange} />);

    await userEvent.click(screen.getByTestId('option-spontaneous'));

    expect(onChange).toHaveBeenCalledWith({
      value: 'spontaneous',
      label: 'Spontaneous',
      isDisabled: false,
    });
  });
});
