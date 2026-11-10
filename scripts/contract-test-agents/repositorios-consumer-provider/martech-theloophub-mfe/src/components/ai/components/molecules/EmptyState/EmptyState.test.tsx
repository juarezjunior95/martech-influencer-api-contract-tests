import { fireEvent, render, screen } from '@testing-library/react';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  const mockIcon = <svg data-testid="test-icon" />;
  const mockTitle = 'Test Title';
  const mockDescription = 'Test description text';

  it('should render icon, title and description', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
      />,
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDescription)).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = jest.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onRetry={onRetry}
      />,
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
      />,
    );

    const retryButton = screen.queryByRole('button');
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when button is clicked', () => {
    const onRetry = jest.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onRetry={onRetry}
      />,
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should use custom retryLabel when provided', () => {
    const customLabel = 'Retry Now';
    const onRetry = jest.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onRetry={onRetry}
        retryLabel={customLabel}
      />,
    );

    const retryButton = screen.getByRole('button', { name: customLabel });
    expect(retryButton).toBeInTheDocument();
  });
});
