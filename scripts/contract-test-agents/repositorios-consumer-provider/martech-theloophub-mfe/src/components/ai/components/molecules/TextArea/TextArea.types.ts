import type { ReactNode, TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children' | 'onSubmit'
> {
  placeholder?: string;
  singleLine?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  topContent?: ReactNode;
  showSubmit?: boolean;
  onSubmit?: (value: string) => void;
  submitDisabled?: boolean;
}
