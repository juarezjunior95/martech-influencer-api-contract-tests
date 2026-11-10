import { forwardRef } from 'react';

import {
  Content,
  EndIcon,
  Label,
  Spinner,
  StartIcon,
  StyledButton,
} from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      fullWidth = false,
      startContent,
      endContent,
      iconMode = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const effectiveVariant = variant;

    return (
      <StyledButton
        ref={ref}
        $variant={effectiveVariant}
        $size={size}
        $fullWidth={fullWidth}
        $loading={loading}
        $iconMode={iconMode}
        className={className}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        <Content>
          {startContent && <StartIcon>{startContent}</StartIcon>}
          {!iconMode && children && <Label>{children}</Label>}
          {endContent && <EndIcon>{endContent}</EndIcon>}
          {loading && (
            <EndIcon>
              <Spinner $size={size} aria-hidden="true" />
            </EndIcon>
          )}
        </Content>
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
