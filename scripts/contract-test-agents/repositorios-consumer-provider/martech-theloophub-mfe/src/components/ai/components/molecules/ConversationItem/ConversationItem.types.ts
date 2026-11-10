import type { HTMLAttributes } from 'react';

export interface ConversationItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  id: string;
  title: string;
  hasError?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  className?: string;
}
