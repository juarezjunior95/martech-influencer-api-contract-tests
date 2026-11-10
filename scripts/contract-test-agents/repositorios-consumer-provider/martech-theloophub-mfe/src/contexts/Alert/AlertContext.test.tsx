import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { AlertProvider, useToast } from './AlertContext';

jest.mock('@hexa-ui/theme', () => ({
  styled: (component: any) => {
    return ({ children, state, ...props }: any) => {
      const Component = typeof component === 'string' ? component : 'div';

      return (
        <Component data-state={state} {...props}>
          {children}
        </Component>
      );
    };
  },
}));

jest.mock('components', () => ({
  Alert: ({ type, title, message, onClose, position }: any) => (
    <div data-testid={`alert-${type}`} data-position={position}>
      {title && <span>{title}</span>}
      <span>{message}</span>
      {onClose && <button onClick={onClose}>close</button>}
    </div>
  ),
}));

const ToastTrigger = () => {
  const toast = useToast();

  return (
    <>
      <button
        onClick={() =>
          toast.info({
            title: 'Info title',
            message: 'Info message',
          })
        }
      >
        open-info
      </button>
      <button
        onClick={() =>
          toast.error({
            title: 'Error title',
            message: 'Error message',
          })
        }
      >
        open-error
      </button>
    </>
  );
};

describe('AlertContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('throws when useToast is used outside provider', () => {
    const BrokenComponent = () => {
      useToast();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useToast must be used within AlertProvider',
    );
  });

  it('renders a toast and removes it after close animation', () => {
    render(
      <AlertProvider>
        <ToastTrigger />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('open-info'));

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();
    expect(screen.getByText('Info title')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));

    act(() => {
      jest.advanceTimersByTime(199);
    });

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
  });

  it('supports multiple toasts in the queue', () => {
    render(
      <AlertProvider>
        <ToastTrigger />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('open-info'));
    fireEvent.click(screen.getByText('open-error'));

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
  });

  it('removes only the closed toast when multiple toasts are visible', () => {
    render(
      <AlertProvider>
        <ToastTrigger />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText('open-info'));
    fireEvent.click(screen.getByText('open-error'));

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('close')[0]);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.queryByTestId('alert-info')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
  });
});
