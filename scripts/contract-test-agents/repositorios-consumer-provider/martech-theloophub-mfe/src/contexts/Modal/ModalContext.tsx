import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

interface ModalContextValue {
  isModalOpen: (modalId: string) => boolean;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  getModalData: <T = unknown>(modalId: string) => T | undefined;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Map<string, ModalState>>(new Map());

  const isModalOpen = useCallback(
    (modalId: string): boolean => {
      return modals.get(modalId)?.isOpen ?? false;
    },
    [modals],
  );

  const openModal = useCallback((modalId: string, data?: unknown) => {
    setModals((prev) => {
      const next = new Map(prev);
      next.set(modalId, { isOpen: true, data });
      return next;
    });
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      const current = next.get(modalId);
      if (current) {
        next.set(modalId, { ...current, isOpen: false });
      }
      return next;
    });
  }, []);

  const toggleModal = useCallback((modalId: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      const current = next.get(modalId);
      next.set(modalId, {
        isOpen: !current?.isOpen,
        data: current?.data,
      });
      return next;
    });
  }, []);

  const getModalData = useCallback(
    <T = unknown,>(modalId: string): T | undefined => {
      return modals.get(modalId)?.data as T | undefined;
    },
    [modals],
  );

  const value = useMemo<ModalContextValue>(
    () => ({
      isModalOpen,
      openModal,
      closeModal,
      toggleModal,
      getModalData,
    }),
    [isModalOpen, openModal, closeModal, toggleModal, getModalData],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }

  return context;
};

export const useScopedModal = <T = unknown,>(modalId: string) => {
  const context = useModalContext();

  return useMemo(
    () => ({
      isOpen: context.isModalOpen(modalId),
      open: (data?: T) => context.openModal(modalId, data),
      close: () => context.closeModal(modalId),
      toggle: () => context.toggleModal(modalId),
      data: context.getModalData<T>(modalId),
    }),
    [context, modalId],
  );
};
