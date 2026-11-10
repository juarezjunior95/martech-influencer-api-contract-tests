import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { useId } from 'hooks/useId';

import { ChevronRight, Close } from '../../atoms/Icon';
import {
  Body,
  DrawerCloseIconButton,
  Header,
  StyledCustomTrigger,
  StyledDrawer,
  StyledOverlay,
  StyledTrigger,
  StyledWrapper,
  Title,
  TriggerIcon,
  TriggerText,
} from './Drawer.styles';
import type {
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerContextValue,
  DrawerHeaderProps,
  DrawerRootProps,
  DrawerTitleProps,
  DrawerTriggerProps,
} from './Drawer.types';
import { DrawerContext, useDrawerContext } from './DrawerContext';

function DrawerRoot({
  open,
  onOpenChange,
  children,
}: Readonly<DrawerRootProps>) {
  const contentId = useId('drawer');

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      open,
      onOpen: () => onOpenChange(true),
      onClose: () => onOpenChange(false),
      onToggle: () => onOpenChange(!open),
      contentId,
    }),
    [open, onOpenChange, contentId],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  children,
  className,
  top = 170,
  asChild,
}: Readonly<DrawerTriggerProps>) {
  const { open, onToggle } = useDrawerContext();
  const topValue = typeof top === 'number' ? `calc(50% - ${top}px)` : top;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle],
  );

  if (asChild) {
    return (
      <StyledCustomTrigger
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className={className}
        style={{ top: topValue }}
      >
        {children}
      </StyledCustomTrigger>
    );
  }

  return (
    <StyledTrigger
      type="button"
      className={className}
      style={{ top: topValue }}
      onClick={onToggle}
      aria-label={open ? 'Close drawer' : 'Open drawer'}
      aria-expanded={open}
    >
      <TriggerText>{children}</TriggerText>
      <TriggerIcon $open={open}>
        <ChevronRight size={24} />
      </TriggerIcon>
    </StyledTrigger>
  );
}

function DrawerContent({
  children,
  width = 420,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  contained = false,
  className,
}: Readonly<DrawerContentProps>) {
  const { open, onClose, contentId } = useDrawerContext();
  const drawerWidth = typeof width === 'number' ? `${width}px` : width;

  useEffect(() => {
    if (!closeOnEscape || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, open, onClose]);

  useEffect(() => {
    if (contained) return;

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, contained]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  const triggers: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DrawerTrigger) {
      triggers.push(child);
    } else {
      content.push(child);
    }
  });

  return (
    <>
      {showOverlay && (
        <StyledOverlay
          $visible={open}
          $contained={contained}
          onClick={handleOverlayClick}
          aria-hidden="true"
          data-testid="drawer-overlay"
        />
      )}

      <StyledWrapper
        id={contentId}
        $open={open}
        $contained={contained}
        style={{ width: drawerWidth }}
        data-testid="drawer-wrapper"
      >
        {triggers}

        <StyledDrawer
          className={className}
          role="dialog"
          aria-modal="true"
          aria-hidden={open ? undefined : 'true'}
        >
          {content}
        </StyledDrawer>
      </StyledWrapper>
    </>
  );
}

function DrawerHeader({ children, className }: Readonly<DrawerHeaderProps>) {
  return (
    <Header className={className} data-testid="drawer-header">
      {children}
    </Header>
  );
}

function DrawerTitle({ children, className }: Readonly<DrawerTitleProps>) {
  return <Title className={className}>{children}</Title>;
}

function DrawerBody({ children, className }: Readonly<DrawerBodyProps>) {
  return <Body className={className}>{children}</Body>;
}

function DrawerClose({ children, className }: Readonly<DrawerCloseProps>) {
  const { onClose } = useDrawerContext();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  if (children) {
    return (
      <button
        tabIndex={0}
        onClick={onClose}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <DrawerCloseIconButton
      type="button"
      variant="transparent"
      size="medium"
      iconMode
      className={className}
      onClick={onClose}
      aria-label="Close drawer"
      startContent={<Close size={20} />}
    />
  );
}

DrawerRoot.displayName = 'Drawer';
DrawerTrigger.displayName = 'DrawerTrigger';
DrawerContent.displayName = 'DrawerContent';
DrawerHeader.displayName = 'DrawerHeader';
DrawerTitle.displayName = 'DrawerTitle';
DrawerBody.displayName = 'DrawerBody';
DrawerClose.displayName = 'DrawerClose';

export {
  DrawerRoot as Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
};
