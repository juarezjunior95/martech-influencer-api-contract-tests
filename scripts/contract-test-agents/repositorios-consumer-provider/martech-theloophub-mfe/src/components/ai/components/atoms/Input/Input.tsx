import { forwardRef } from 'react';

import { cn } from '../../../utils/cn';
import { StyledInput } from './Input.styles';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      hasError = false,
      fullWidth = false,
      type = 'text',
      disabled = false,
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(e);
      }
    };

    return (
      <StyledInput
        ref={ref}
        type={type}
        disabled={disabled}
        $hasError={hasError}
        $fullWidth={fullWidth}
        className={cn(className)}
        data-variant={variant}
        data-has-error={hasError ? 'true' : undefined}
        data-full-width={fullWidth ? 'true' : undefined}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
