import type { HTMLAttributes, ReactNode } from 'react';

export interface ChatHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void;
  actionButton?: ReactNode;
  className?: string;
}
