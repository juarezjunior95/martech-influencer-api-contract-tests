import { fireEvent, render, screen } from '@testing-library/react';

import { ChatHeader } from './ChatHeader';

describe('ChatHeader', () => {
  it('should render the header', () => {
    render(<ChatHeader />);
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
  });

  it('should render the menu button', () => {
    render(<ChatHeader />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('should call onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();
    render(<ChatHeader onMenuClick={onMenuClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('should render actionButton when provided', () => {
    render(
      <ChatHeader
        actionButton={<button data-testid="action">Action</button>}
      />,
    );
    expect(screen.getByTestId('chat-header-action-slot')).toBeInTheDocument();
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  it('should not render action slot when actionButton is not provided', () => {
    render(<ChatHeader />);
    expect(
      screen.queryByTestId('chat-header-action-slot'),
    ).not.toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<ChatHeader ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
