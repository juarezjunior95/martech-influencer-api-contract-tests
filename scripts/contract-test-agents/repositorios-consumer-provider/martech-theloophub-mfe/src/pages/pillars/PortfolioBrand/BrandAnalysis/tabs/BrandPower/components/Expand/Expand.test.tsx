import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Expand } from './Expand';

jest.mock('./Expand.styles', () => ({
  StyledButton: ({
    onClick,
    isExpanded,
    children,
  }: {
    onClick: () => void;
    isExpanded: boolean;
    children: React.ReactNode;
  }) => (
    <button
      data-testid="styled-button"
      data-is-expanded={String(isExpanded)}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock('assets/icons/sort-descending-3.svg', () => 'sort-icon.svg');

describe('Expand', () => {
  it.each([
    [false, true],
    [true, false],
  ])('toggles from %s to %s on click', async (initial, expected) => {
    const onValueChange = jest.fn();
    render(<Expand value={initial} onValueChange={onValueChange} />);

    expect(screen.getByTestId('styled-button')).toHaveAttribute(
      'data-is-expanded',
      String(initial),
    );

    await userEvent.click(screen.getByTestId('styled-button'));

    expect(onValueChange).toHaveBeenCalledWith(expected);
  });
});
