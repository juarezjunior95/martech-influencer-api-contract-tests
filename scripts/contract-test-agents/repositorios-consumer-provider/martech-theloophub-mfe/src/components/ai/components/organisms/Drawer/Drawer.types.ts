import type { ReactNode } from 'react';

export interface DrawerContextValue {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  contentId: string;
}

export interface DrawerRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export interface DrawerTriggerProps {
  children: ReactNode;
  className?: string;
  top?: string | number;
  asChild?: boolean;
}

export interface DrawerContentProps {
  children: ReactNode;
  width?: string | number;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  contained?: boolean;
  className?: string;
}

export interface DrawerHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface DrawerTitleProps {
  children: ReactNode;
  className?: string;
}

export interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export interface DrawerCloseProps {
  children?: ReactNode;
  className?: string;
}
