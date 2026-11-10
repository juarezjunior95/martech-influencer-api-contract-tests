import React from 'react';

import { ToggleTrack } from './Toggle.styles';

export interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export const Toggle = ({
  checked = false,
  onCheckedChange,
  disabled,
  ariaLabel,
  ariaLabelledBy,
}: ToggleProps): React.ReactElement => {
  return (
    <ToggleTrack
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onCheckedChange?.(!checked);
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!disabled) onCheckedChange?.(!checked);
        }
      }}
    />
  );
};
