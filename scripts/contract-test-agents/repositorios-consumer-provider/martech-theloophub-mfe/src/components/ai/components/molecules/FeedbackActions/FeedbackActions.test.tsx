import { fireEvent, render, screen } from '@testing-library/react';

import { FeedbackActions } from './FeedbackActions';
import type { FeedbackActionsProps } from './FeedbackActions.types';

jest.mock('../../atoms/CopyButton', () => ({
  CopyButton: ({ content, ariaLabelCopy }: any) => (
    <button data-testid="copy-button" data-content={content}>
      {ariaLabelCopy ?? 'Copy'}
    </button>
  ),
}));

describe('FeedbackActions', () => {
  const defaultProps: FeedbackActionsProps = {
    activeSentiment: null,
    onThumbUp: jest.fn(),
    onThumbDown: jest.fn(),
    copyContent: 'message text',
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders three action buttons', () => {
    render(<FeedbackActions {...defaultProps} />);

    expect(screen.getByRole('button', { name: /^like$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^dislike$/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
  });

  it('calls onThumbUp when like button is clicked', () => {
    render(<FeedbackActions {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /^like$/i }));
    expect(defaultProps.onThumbUp).toHaveBeenCalledTimes(1);
  });

  it('calls onThumbDown when dislike button is clicked', () => {
    render(<FeedbackActions {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /^dislike$/i }));
    expect(defaultProps.onThumbDown).toHaveBeenCalledTimes(1);
  });

  it('passes copyContent to CopyButton', () => {
    render(<FeedbackActions {...defaultProps} />);
    expect(screen.getByTestId('copy-button')).toHaveAttribute(
      'data-content',
      'message text',
    );
  });

  it('marks thumb up as active when sentiment is positive', () => {
    render(<FeedbackActions {...defaultProps} activeSentiment="positive" />);

    const likeBtn = screen.getByRole('button', { name: /^like$/i });
    expect(likeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks thumb down as active when sentiment is negative', () => {
    render(<FeedbackActions {...defaultProps} activeSentiment="negative" />);

    const dislikeBtn = screen.getByRole('button', { name: /^dislike$/i });
    expect(dislikeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no active buttons when sentiment is null', () => {
    render(<FeedbackActions {...defaultProps} />);

    const likeBtn = screen.getByRole('button', { name: /^like$/i });
    const dislikeBtn = screen.getByRole('button', { name: /^dislike$/i });
    expect(likeBtn).toHaveAttribute('aria-pressed', 'false');
    expect(dislikeBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('disables thumb buttons when feedback is locked', () => {
    render(<FeedbackActions {...defaultProps} activeSentiment="positive" />);

    const likeBtn = screen.getByRole('button', { name: /^like$/i });
    const dislikeBtn = screen.getByRole('button', { name: /^dislike$/i });
    expect(likeBtn).toBeDisabled();
    expect(dislikeBtn).toBeDisabled();
  });
});
