import { fireEvent, render, screen } from '@testing-library/react';

import { ExpandButtonWithImg } from './ExpandButtonWithImg';

jest.mock('assets/icons/sort-descending-3.svg', () => 'sort-icon-stub');

describe('ExpandButtonWithImg', () => {
  let mockOnValueChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnValueChange = jest.fn();
  });

  it('should render correctly', () => {
    render(
      <ExpandButtonWithImg value={false} onValueChange={mockOnValueChange} />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onValueChange with correct value when clicked', () => {
    render(
      <ExpandButtonWithImg value={false} onValueChange={mockOnValueChange} />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('should render with the correct data-testid prefix when prop is provided', () => {
    render(
      <ExpandButtonWithImg
        value={false}
        onValueChange={mockOnValueChange}
        dataTestId="my-test-id"
      />,
    );

    expect(screen.getByTestId('button-my-test-id')).toBeInTheDocument();
  });

  it('should not render data-testid attribute if prop is not provided', () => {
    render(
      <ExpandButtonWithImg value={false} onValueChange={mockOnValueChange} />,
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('data-testid');
  });
});
