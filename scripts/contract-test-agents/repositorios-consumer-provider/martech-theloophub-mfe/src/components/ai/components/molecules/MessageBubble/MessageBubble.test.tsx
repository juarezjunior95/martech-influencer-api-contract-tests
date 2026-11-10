import { render, screen } from '@testing-library/react';

import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  describe('User position', () => {
    it('renders user message with default status', () => {
      render(<MessageBubble position="user">Test message</MessageBubble>);
      expect(screen.getByTestId('message-bubble-default')).toBeInTheDocument();
    });

    it('renders user message with failed status and alert icon', () => {
      render(
        <MessageBubble position="user" status="failed">
          Failed message
        </MessageBubble>,
      );
      expect(screen.getByTestId('failed-message')).toBeInTheDocument();
    });
  });

  describe('Assistant position', () => {
    it('renders assistant message with default status', () => {
      render(
        <MessageBubble position="assistant">Assistant response</MessageBubble>,
      );
      expect(screen.getByTestId('message-bubble-default')).toBeInTheDocument();
    });

    it('renders thinking state with loading text', () => {
      render(<MessageBubble position="assistant" status="thinking" />);
      expect(screen.getByTestId('thinking-text')).toBeInTheDocument();
    });

    it('renders error state with default message', () => {
      render(<MessageBubble position="assistant" status="error" />);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('renders error state with custom message', () => {
      render(
        <MessageBubble
          position="assistant"
          status="error"
          errorMessage="Custom error message"
        />,
      );
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      const onRetry = jest.fn();
      render(
        <MessageBubble position="assistant" status="error" onRetry={onRetry} />,
      );

      expect(
        screen.getByRole('button', { name: /try again/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<MessageBubble position="assistant" status="error" />);

      expect(
        screen.queryByRole('button', { name: /try again/i }),
      ).not.toBeInTheDocument();
    });

    it('renders abandoned state with default message', () => {
      render(<MessageBubble position="assistant" status="abandoned" />);
      expect(screen.getByTestId('abandoned-message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label for loading state', () => {
      render(<MessageBubble position="assistant" status="thinking" />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });
});
