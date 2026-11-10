import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useId } from 'hooks/useId';

import { Close } from '../../atoms/Icon';
import type { ModalSize } from './Modal.styles';
import {
  BodyContainer,
  ContentBox,
  FooterContainer,
  HeaderContainer,
  ModalCloseButton,
  Overlay,
  Wrapper,
} from './Modal.styles';
import { ModalContext, useModalContext } from './ModalContext';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  fullscreen?: boolean;
}

function ModalRoot({
  open,
  onOpenChange,
  children,
  fullscreen = true,
}: Readonly<ModalProps>) {
  const contentId = useId('modal');

  const contextValue = useMemo(
    () => ({
      open,
      onClose: () => onOpenChange(false),
      contentId,
      fullscreen,
    }),
    [open, onOpenChange, contentId, fullscreen],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

interface ModalOverlayProps {
  className?: string;
  closeOnClick?: boolean;
  variant?: 'light' | 'dark';
}

function ModalOverlay({
  className,
  closeOnClick = true,
  variant = 'light',
}: Readonly<ModalOverlayProps>) {
  const { open, onClose, fullscreen } = useModalContext();

  const handleClick = useCallback(() => {
    if (closeOnClick) onClose();
  }, [closeOnClick, onClose]);

  const overlay = (
    <Overlay
      visible={open}
      variant={variant}
      fullscreen={fullscreen}
      className={className}
      onClick={handleClick}
      aria-hidden="true"
      data-testid="modal-overlay"
    />
  );

  if (fullscreen && typeof document !== 'undefined') {
    return createPortal(overlay, document.body);
  }

  return overlay;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
  closeOnEscape?: boolean;
  size?: ModalSize;
}

function ModalContent({
  children,
  className,
  closeOnEscape = true,
  size = 'md',
}: Readonly<ModalContentProps>) {
  const { open, onClose, contentId, fullscreen } = useModalContext();

  useEffect(() => {
    if (!closeOnEscape || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, open, onClose]);

  if (!open) return null;

  const content = (
    <Wrapper visible={open} fullscreen={fullscreen}>
      <ContentBox
        id={contentId}
        className={className}
        size={size}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </ContentBox>
    </Wrapper>
  );

  if (fullscreen && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

function ModalHeader({ children, className }: Readonly<ModalHeaderProps>) {
  return <HeaderContainer className={className}>{children}</HeaderContainer>;
}

interface ModalCloseProps {
  children?: ReactNode;
  className?: string;
}

function ModalClose({ children, className }: Readonly<ModalCloseProps>) {
  const { onClose } = useModalContext();
  const hasCustomChildren = children != null;

  return (
    <ModalCloseButton
      type="button"
      variant="tertiary"
      size="medium"
      iconMode={!hasCustomChildren}
      className={className}
      onClick={onClose}
      aria-label="Close modal"
      startContent={hasCustomChildren ? undefined : <Close size={16} />}
    >
      {hasCustomChildren ? children : undefined}
    </ModalCloseButton>
  );
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

function ModalBody({ children, className }: Readonly<ModalBodyProps>) {
  return <BodyContainer className={className}>{children}</BodyContainer>;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: Readonly<ModalFooterProps>) {
  return <FooterContainer className={className}>{children}</FooterContainer>;
}

export const Modal = Object.assign(ModalRoot, {
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Close: ModalClose,
  Body: ModalBody,
  Footer: ModalFooter,
});
