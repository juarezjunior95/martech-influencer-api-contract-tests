import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { ModalProvider, useModalContext, useScopedModal } from './ModalContext';

const TestConsumer: React.FC<{ modalId: string }> = ({ modalId }) => {
  const { isModalOpen, openModal, closeModal, toggleModal, getModalData } =
    useModalContext();

  return (
    <div>
      <div data-testid="is-open">{String(isModalOpen(modalId))}</div>
      <div data-testid="modal-data">
        {String(getModalData(modalId) ?? 'undefined')}
      </div>
      <button
        data-testid="btn-open"
        onClick={() => openModal(modalId, { value: 'test-data' })}
      >
        Open
      </button>
      <button data-testid="btn-close" onClick={() => closeModal(modalId)}>
        Close
      </button>
      <button data-testid="btn-toggle" onClick={() => toggleModal(modalId)}>
        Toggle
      </button>
    </div>
  );
};

describe('ModalContext', () => {
  describe('ModalProvider', () => {
    it('should render children', () => {
      render(
        <ModalProvider>
          <div data-testid="child">Hello</div>
        </ModalProvider>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('useModalContext', () => {
    it('should throw when used outside ModalProvider', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const { result } = renderHook(() => {
        try {
          return useModalContext();
        } catch (e) {
          return e as Error;
        }
      });

      expect((result.current as Error).message).toBe(
        'useModalContext must be used within ModalProvider',
      );

      console.error = originalConsoleError;
    });

    it('should return false for isModalOpen when modal not opened', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    });

    it('should open a modal and return true for isModalOpen', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-open'));

      expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    });

    it('should close a modal after opening it', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-open'));
      fireEvent.click(screen.getByTestId('btn-close'));

      expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    });

    it('should toggle modal state', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-toggle'));

      expect(screen.getByTestId('is-open')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('btn-toggle'));

      expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    });

    it('should store and return modal data when opened', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('btn-open'));

      expect(screen.getByTestId('modal-data')).toHaveTextContent(
        '[object Object]',
      );
    });

    it('should not throw when closing a modal that was never opened', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('btn-close'));
      }).not.toThrow();
    });

    it('should return undefined for getModalData when modal not opened', () => {
      render(
        <ModalProvider>
          <TestConsumer modalId="test-modal" />
        </ModalProvider>,
      );

      expect(screen.getByTestId('modal-data')).toHaveTextContent('undefined');
    });
  });

  describe('useScopedModal', () => {
    it('should throw when used outside ModalProvider', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const { result } = renderHook(() => {
        try {
          return useScopedModal('test-modal');
        } catch (e) {
          return e as Error;
        }
      });

      expect((result.current as Error).message).toBe(
        'useModalContext must be used within ModalProvider',
      );

      console.error = originalConsoleError;
    });

    const ScopedConsumer: React.FC<{ modalId: string }> = ({ modalId }) => {
      const { isOpen, open, close, toggle, data } = useScopedModal(modalId);

      return (
        <div>
          <div data-testid="scoped-is-open">{String(isOpen)}</div>
          <div data-testid="scoped-data">{String(data ?? 'undefined')}</div>
          <button data-testid="scoped-open" onClick={() => open('my-data')}>
            Open
          </button>
          <button data-testid="scoped-close" onClick={() => close()}>
            Close
          </button>
          <button data-testid="scoped-toggle" onClick={() => toggle()}>
            Toggle
          </button>
        </div>
      );
    };

    it('should have isOpen false initially', () => {
      render(
        <ModalProvider>
          <ScopedConsumer modalId="scoped-modal" />
        </ModalProvider>,
      );

      expect(screen.getByTestId('scoped-is-open')).toHaveTextContent('false');
    });

    it('should open modal via scoped open', () => {
      render(
        <ModalProvider>
          <ScopedConsumer modalId="scoped-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('scoped-open'));

      expect(screen.getByTestId('scoped-is-open')).toHaveTextContent('true');
    });

    it('should close modal via scoped close', () => {
      render(
        <ModalProvider>
          <ScopedConsumer modalId="scoped-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('scoped-open'));
      fireEvent.click(screen.getByTestId('scoped-close'));

      expect(screen.getByTestId('scoped-is-open')).toHaveTextContent('false');
    });

    it('should toggle modal via scoped toggle', () => {
      render(
        <ModalProvider>
          <ScopedConsumer modalId="scoped-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('scoped-toggle'));

      expect(screen.getByTestId('scoped-is-open')).toHaveTextContent('true');
    });

    it('should store data via scoped open', () => {
      render(
        <ModalProvider>
          <ScopedConsumer modalId="scoped-modal" />
        </ModalProvider>,
      );

      fireEvent.click(screen.getByTestId('scoped-open'));

      expect(screen.getByTestId('scoped-data')).toHaveTextContent('my-data');
    });
  });
});
