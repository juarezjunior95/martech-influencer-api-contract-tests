import { ReactNode } from 'react';

export const createTab = (
  id: string,
  label: string,
  content: ReactNode = null,
  disabled = false,
  filterConfig?: {
    pageName: string;
    filtersList?: string[];
    params?: Record<string, any>;
  },
) => ({
  id,
  label,
  content,
  disabled,
  filterConfig,
});
