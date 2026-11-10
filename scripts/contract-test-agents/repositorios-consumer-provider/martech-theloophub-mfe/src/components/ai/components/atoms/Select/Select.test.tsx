import { fireEvent, render, screen } from '@testing-library/react';

import { Select } from './Select';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('Select', () => {
  it('renders with placeholder', () => {
    render(
      <Select
        options={options}
        selected={[]}
        onChange={jest.fn()}
        placeholder="Pick one"
      />,
    );
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('shows selected value', () => {
    render(
      <Select
        options={options}
        selected={[{ label: 'Option A', value: 'a' }]}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<Select options={options} selected={[]} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('calls onChange on single select', () => {
    const onChange = jest.fn();
    render(<Select options={options} selected={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith([{ label: 'Option B', value: 'b' }]);
  });

  it('supports multi-select toggle', () => {
    const onChange = jest.fn();
    render(
      <Select
        options={options}
        selected={[{ label: 'Option A', value: 'a' }]}
        onChange={onChange}
        allowMultiSelect
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith([
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ]);
  });

  it('shows required indicator', () => {
    render(
      <Select options={options} selected={[]} onChange={jest.fn()} required />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Select options={[]} selected={[]} onChange={jest.fn()} loading />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
