import { fireEvent, render, screen } from '@testing-library/react';

import { Sidebar } from './Sidebar';

const mockConversations = [
  { id: 'conv-1', title: 'First chat' },
  { id: 'conv-2', title: 'Second chat', hasError: true },
];

describe('Sidebar', () => {
  const defaultProps = {
    conversations: mockConversations,
    onClose: jest.fn(),
    onNewChat: jest.fn(),
    onConversationClick: jest.fn(),
  };

  it('should render the close button', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Sidebar {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close sidebar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render New Chat button', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('New Chat')).toBeInTheDocument();
  });

  it('should call onNewChat when New Chat is clicked', () => {
    const onNewChat = jest.fn();
    render(<Sidebar {...defaultProps} onNewChat={onNewChat} />);

    fireEvent.click(screen.getByText('New Chat'));
    expect(onNewChat).toHaveBeenCalledTimes(1);
  });

  it('should render conversation items', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('First chat')).toBeInTheDocument();
    expect(screen.getByText('Second chat')).toBeInTheDocument();
  });

  it('should render Conversations section title', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Conversations')).toBeInTheDocument();
  });

  it('should call onConversationClick when a conversation is clicked', () => {
    const onConversationClick = jest.fn();
    render(
      <Sidebar {...defaultProps} onConversationClick={onConversationClick} />,
    );

    fireEvent.click(screen.getByText('First chat'));
    expect(onConversationClick).toHaveBeenCalledWith(mockConversations[0]);
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Sidebar {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('Infinite Scroll', () => {
    it('should render loading indicator when loadingMore is true', () => {
      render(<Sidebar {...defaultProps} loadingMore />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('should not render loading indicator when loadingMore is false', () => {
      render(<Sidebar {...defaultProps} loadingMore={false} />);
      expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
    });

    it('should render sentinel when hasMore is true and not loading', () => {
      const { container } = render(
        <Sidebar {...defaultProps} hasMore loadingMore={false} />,
      );
      const sentinel =
        container.querySelector('[style*="height: 1px"]') ||
        container.querySelector('div:last-child > div:last-child');
      expect(sentinel).toBeInTheDocument();
    });

    it('should not render sentinel when hasMore is false', () => {
      render(<Sidebar {...defaultProps} hasMore={false} />);
      expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
    });

    it('should show empty state when conversations list is empty', () => {
      render(<Sidebar {...defaultProps} conversations={[]} hasHistoryError />);
      expect(screen.getByText('Unable to load history')).toBeInTheDocument();
    });

    it('should call onRetryLoadHistory from empty state', () => {
      const onRetryLoadHistory = jest.fn();
      render(
        <Sidebar
          {...defaultProps}
          conversations={[]}
          hasHistoryError
          onRetryLoadHistory={onRetryLoadHistory}
        />,
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetryLoadHistory).toHaveBeenCalledTimes(1);
    });
  });
});
