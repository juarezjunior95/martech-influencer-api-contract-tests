import type { ReactNode } from 'react';

export interface StepperStep {
  id: string;
  label: string;
  description?: ReactNode;
  state?: 'pending' | 'current' | 'complete';
}

export interface StepperProps {
  steps: StepperStep[];
  currentIndex?: number;
  className?: string;
}
