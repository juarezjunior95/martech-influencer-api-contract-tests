import { act, fireEvent, render, screen } from '@testing-library/react';

import { copyToClipboard } from '../../../utils/copyToClipboard';
import { CopyButton } from './CopyButton';

jest.mock('../../../utils/copyToClipboard', () => ({
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
}));

const mockCopyToClipboard = copyToClipboard as jest.Mock;

async function settleClipboardPromise() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe('CopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with default aria-label', () => {
    render(<CopyButton content="test" />);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should call copyToClipboard with content on click', async () => {
    render(<CopyButton content="hello world" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(mockCopyToClipboard).toHaveBeenCalledWith('hello world');
    await settleClipboardPromise();
  });

  it('should switch aria-label to copied state after click', async () => {
    render(<CopyButton content="test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await settleClipboardPromise();
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('should revert to default state after 2000ms', async () => {
    render(<CopyButton content="test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await settleClipboardPromise();

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should support custom aria labels', async () => {
    render(
      <CopyButton
        content="test"
        ariaLabelCopy="Copy message"
        ariaLabelCopied="Message copied"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Copy message' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy message' }));
    await settleClipboardPromise();
    expect(
      screen.getByRole('button', { name: 'Message copied' }),
    ).toBeInTheDocument();
  });

  it('should ignore clicks while copied until timeout', async () => {
    render(<CopyButton content="test" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await settleClipboardPromise();
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copied' }));
    await settleClipboardPromise();
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await settleClipboardPromise();
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(2);
  });

  it('should clear timer on unmount', async () => {
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(<CopyButton content="test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await settleClipboardPromise();
    unmount();
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should pass className to the button', () => {
    const { container } = render(
      <CopyButton content="test" className="custom-class" />,
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
