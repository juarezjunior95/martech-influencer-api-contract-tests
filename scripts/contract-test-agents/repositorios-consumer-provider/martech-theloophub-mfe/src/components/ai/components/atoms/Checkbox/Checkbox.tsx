import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Checkmark, HiddenInput, Label, Wrapper } from './Checkbox.styles';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  checked?: boolean;
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, label, className, onChange, ...props }, ref) => {
    return (
      <Wrapper className={className}>
        <HiddenInput
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <Checkmark>
          <svg
            width="8"
            height="6"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9.87519 0.169898C10.169 -0.0713117 10.6037 -0.0559649 10.8791 0.21775C11.1728 0.509816 11.1741 0.985555 10.882 1.27927L3.72285 8.47849C3.58207 8.62006 3.39026 8.70017 3.19062 8.70017C2.99099 8.70016 2.79915 8.62005 2.65839 8.47849L0.217963 6.02439L1.28242 4.96677L3.19062 6.88474L9.81855 0.220679L9.87519 0.169898ZM0.220893 4.96384C0.51461 4.67178 0.99035 4.67306 1.28242 4.96677L0.217963 6.02439C-0.0737613 5.73072 -0.0725164 5.25584 0.220893 4.96384Z"
              fill="#141414"
            />
          </svg>
        </Checkmark>
        {label && <Label>{label}</Label>}
      </Wrapper>
    );
  },
);

Checkbox.displayName = 'Checkbox';
