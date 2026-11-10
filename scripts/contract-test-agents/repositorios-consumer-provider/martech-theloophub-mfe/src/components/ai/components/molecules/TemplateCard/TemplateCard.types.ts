import type { HTMLAttributes } from 'react';

export interface TemplateCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: string;
  description: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'clean';
}
