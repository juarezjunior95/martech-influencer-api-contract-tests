import type { CSSProperties, ReactNode } from 'react';

export type SandboxBackground =
  'light' | 'dark' | 'grid' | 'dots' | 'transparent';

export type SandboxDevice = 'desktop' | 'tablet' | 'mobile' | 'auto';

export interface SandboxProps {
  children: ReactNode;
  title?: string;
  description?: string;
  background?: SandboxBackground;
  device?: SandboxDevice;
  height?: number | string;
  width?: number | string;
  padding?: number | string;
  showFrame?: boolean;
  className?: string;
  style?: CSSProperties;
}
