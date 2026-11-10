import { act, fireEvent, render } from '@testing-library/react';

import { Toast } from './Toast';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('Toast', () => {
  it('should render the message', () => {
    const { getByText } = render(<Toast message="Hello" onClose={jest.fn()} />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('should render with role="alert"', () => {
    const { getByRole } = render(<Toast message="Hello" onClose={jest.fn()} />);
    expect(getByRole('alert')).toBeInTheDocument();
  });

  it('should auto-dismiss after duration', () => {
    const onClose = jest.fn();
    render(<Toast message="Auto" duration={3000} onClose={onClose} />);

    act(() => jest.advanceTimersByTime(3000));
    act(() => jest.advanceTimersByTime(300));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not auto-dismiss when duration is 0', () => {
    const onClose = jest.fn();
    render(<Toast message="Stay" duration={0} onClose={onClose} />);

    act(() => jest.advanceTimersByTime(10000));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Toast message="Close me" onClose={onClose} />,
    );

    fireEvent.click(getByLabelText('Close'));
    act(() => jest.advanceTimersByTime(300));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should clean up timers on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <Toast message="Cleanup" duration={3000} onClose={onClose} />,
    );

    unmount();
    act(() => jest.advanceTimersByTime(5000));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should clean up close animation timer on unmount', () => {
    const onClose = jest.fn();
    const { getByLabelText, unmount } = render(
      <Toast message="Cleanup" onClose={onClose} />,
    );

    fireEvent.click(getByLabelText('Close'));
    unmount();
    act(() => jest.advanceTimersByTime(300));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should not show action button when enableRetry is false', () => {
    const { queryByText } = render(
      <Toast
        message="Error"
        type="error"
        onClose={jest.fn()}
        action={{ label: 'Try again', onClick: jest.fn() }}
      />,
    );
    expect(queryByText('Try again')).not.toBeInTheDocument();
  });

  it('should show action button when enableRetry is true', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Toast
        message="Error"
        type="error"
        onClose={jest.fn()}
        enableRetry
        action={{ label: 'Try again', onClick }}
      />,
    );

    fireEvent.click(getByText('Try again'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
