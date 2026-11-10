import type { ReactNode } from 'react';

export interface BottomBarProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  className?: string;
  showDiagnosis?: boolean;
  diagnosisContent?: ReactNode;
  smartFlowButton?: ReactNode;
  claraDomainDropdown?: ReactNode;
  canSubmit?: boolean;
  isDisabled?: boolean;
  onNewChat?: () => void;
}
