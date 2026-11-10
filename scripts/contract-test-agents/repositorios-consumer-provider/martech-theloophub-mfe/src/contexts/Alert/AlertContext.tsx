import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { styled } from '@hexa-ui/theme';
import { Alert } from 'components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastAction {
  onActionClick: () => void;
  actionMessage: string;
}

interface ToastPayload {
  title?: string;
  message: string | React.ReactNode;
  firstAction?: ToastAction;
  secondAction?: ToastAction;
}

interface ToastData extends ToastPayload {
  id: string;
  type: ToastType;
  isOpen: boolean;
}

interface ToastApi {
  info: (payload: ToastPayload) => void;
  success: (payload: ToastPayload) => void;
  warning: (payload: ToastPayload) => void;
  error: (payload: ToastPayload) => void;
}

interface AlertContextValue {
  toast: ToastApi;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

interface AlertProviderProps {
  children: React.ReactNode;
}

const TOAST_ANIMATION_DURATION_MS = 200;

const createToastData = (
  id: string,
  type: ToastType,
  payload: ToastPayload,
): ToastData => ({
  id,
  type,
  isOpen: false,
  ...payload,
});

const updateToastOpenState = (
  toasts: ToastData[],
  id: string,
  isOpen: boolean,
): ToastData[] =>
  toasts.map((toast) => (toast.id === id ? { ...toast, isOpen } : toast));

const removeToastById = (toasts: ToastData[], id: string): ToastData[] =>
  toasts.filter((toast) => toast.id !== id);

const ToastContainer = styled('div', {
  position: 'fixed',
  top: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '12px',
  zIndex: 500,
});

const ToastItem = styled('div', {
  opacity: 0,
  transform: 'translateY(-8px)',
  transition: 'opacity 200ms ease, transform 200ms ease',

  variants: {
    state: {
      open: {
        opacity: 1,
        transform: 'translateY(0)',
      },
      closed: {
        opacity: 0,
        transform: 'translateY(-8px)',
      },
    },
  },
});

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const enqueueToast = useCallback((type: ToastType, payload: ToastPayload) => {
    const id = `toast-${Date.now()}-${counterRef.current}`;
    counterRef.current += 1;

    setToasts((prev) => [...prev, createToastData(id, type, payload)]);

    setTimeout(() => {
      setToasts((prev) => updateToastOpenState(prev, id, true));
    }, 0);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => updateToastOpenState(prev, id, false));

    setTimeout(() => {
      setToasts((prev) => removeToastById(prev, id));
    }, TOAST_ANIMATION_DURATION_MS);
  }, []);

  const toast = useMemo<ToastApi>(
    () => ({
      info: (payload) => enqueueToast('info', payload),
      success: (payload) => enqueueToast('success', payload),
      warning: (payload) => enqueueToast('warning', payload),
      error: (payload) => enqueueToast('error', payload),
    }),
    [enqueueToast],
  );

  const value = useMemo<AlertContextValue>(() => ({ toast }), [toast]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer>
          {toasts.map(
            ({
              id,
              type,
              title,
              message,
              firstAction,
              secondAction,
              isOpen,
            }) => (
              <ToastItem key={id} state={isOpen ? 'open' : 'closed'}>
                <Alert
                  type={type}
                  title={title}
                  message={message}
                  firstAction={firstAction}
                  secondAction={secondAction}
                  onClose={() => closeToast(id)}
                  position="toast"
                />
              </ToastItem>
            ),
          )}
        </ToastContainer>
      )}
    </AlertContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useToast must be used within AlertProvider');
  }

  return context.toast;
};
