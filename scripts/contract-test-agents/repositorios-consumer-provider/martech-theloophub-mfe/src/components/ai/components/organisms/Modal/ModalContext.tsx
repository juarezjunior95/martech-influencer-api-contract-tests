import { createContext, useContext } from 'react';

export interface ModalContextValue {
  open: boolean;
  onClose: () => void;
  contentId: string;
  fullscreen: boolean;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within <Modal>');
  }
  return context;
}
