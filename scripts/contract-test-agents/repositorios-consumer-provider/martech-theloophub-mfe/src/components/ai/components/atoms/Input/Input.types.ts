import type { InputHTMLAttributes } from 'react';

export type InputVariant = 'default' | 'rounded';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Variante do input
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Estado de erro
   * @default false
   */
  hasError?: boolean;

  /**
   * Largura total
   * @default false
   */
  fullWidth?: boolean;
}
