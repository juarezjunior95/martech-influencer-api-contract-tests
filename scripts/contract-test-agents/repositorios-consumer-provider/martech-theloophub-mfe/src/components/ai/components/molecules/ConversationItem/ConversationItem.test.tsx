import { fireEvent, render, screen } from '@testing-library/react';

import { ConversationItem } from './ConversationItem';

describe('ConversationItem', () => {
  const defaultProps = {
    id: 'conv-1',
    title: 'Test Conversation',
  };

  const getItemButton = () =>
    screen.getByRole('button', { name: /Test Conversation/i });

  it('should render the title', () => {
    render(<ConversationItem {...defaultProps} />);
    expect(screen.getByText('Test Conversation')).toBeInTheDocument();
  });

  it('should set data-conversation-id attribute', () => {
    const { container } = render(<ConversationItem {...defaultProps} />);
    expect(
      container.querySelector('[data-conversation-id="conv-1"]'),
    ).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ConversationItem {...defaultProps} onClick={onClick} />);

    fireEvent.click(getItemButton());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick on Enter key', () => {
    const onClick = jest.fn();
    render(<ConversationItem {...defaultProps} onClick={onClick} />);

    fireEvent.keyDown(getItemButton(), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick on Space key', () => {
    const onClick = jest.fn();
    render(<ConversationItem {...defaultProps} onClick={onClick} />);

    fireEvent.keyDown(getItemButton(), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not show error icon by default', () => {
    render(<ConversationItem {...defaultProps} />);
    expect(screen.queryByTestId('error-icon')).not.toBeInTheDocument();
  });

  it('should show error icon when hasError is true', () => {
    render(<ConversationItem {...defaultProps} hasError />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<ConversationItem {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
