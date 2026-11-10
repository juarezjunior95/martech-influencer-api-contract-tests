import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import type { ButtonSize, ButtonVariant } from './Button.types';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
  $iconMode: boolean;
}

const bodyTypography = css`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  font-size: var(--ai-chat-font-size-body-md, 16px);
  line-height: 140%;
  letter-spacing: 0px;
`;

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: linear-gradient(90deg, #141414 0%, #141414 100%);
    color: var(--ai-chat-color-component-button-primary-fg, #ffffff);
    border-radius: var(--ai-chat-radius-component-button-md, 512px);
    padding: 9px var(--ai-chat-space-4, 16px);
    height: 40px;
    ${bodyTypography}

    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #2a2a2a 0%, #2a2a2a 100%);
    }
  `,
  secondary: css`
    background-color: var(--ai-chat-color-bg-tertiary);
    color: var(--ai-chat-color-text-primary);
    border-radius: var(--ai-chat-radius-component-button-md, 512px);
    padding: 9px var(--ai-chat-space-4, 16px);
    height: 40px;

    &:hover:not(:disabled) {
      background-color: var(--ai-chat-color-border-strong);
    }
  `,
  tertiary: css`
    background-color: var(--ai-chat-color-component-button-tertiary-bg);
    color: var(--ai-chat-color-component-button-tertiary-fg);
    border: none;
    border-radius: var(--ai-chat-radius-component-button-sm);
    padding: 9px var(--ai-chat-space-4, 16px);
    height: var(--ai-chat-sizing-lg);

    &:hover:not(:disabled) {
      background-color: rgba(20, 20, 20, 0.08);
    }
  `,
  transparent: css`
    background-color: transparent;
    color: var(--ai-chat-color-text-primary, #141414);
    border-radius: 50px;
    padding: 9px var(--ai-chat-space-4, 16px);
    font-weight: var(--ai-chat-font-weight-semibold);

    &:hover:not(:disabled) {
      background-color: rgba(20, 20, 20, 0.05);
    }
  `,
  destructive: css`
    background-color: var(
      --ai-chat-color-component-button-destructive-bg,
      #d62222
    );
    color: var(--ai-chat-color-component-button-primary-fg, #ffffff);
    border-radius: var(--ai-chat-radius-component-button-md, 512px);
    padding: 9px var(--ai-chat-space-4, 16px);
    height: 40px;
    ${bodyTypography}

    &:hover:not(:disabled) {
      background-color: #b91c1c;
    }
  `,
  outline: css`
    background-color: transparent;
    color: var(--ai-chat-color-component-button-secondary-fg, #141414);
    border: 1px solid
      var(--ai-chat-color-component-button-secondary-bd, #141414);
    border-radius: var(--ai-chat-radius-component-button-md, 512px);
    padding: 9px var(--ai-chat-space-4, 16px);
    height: 40px;
    ${bodyTypography}

    &:hover:not(:disabled) {
      background-color: rgba(20, 20, 20, 0.05);
    }
  `,
  action: css`
    background-color: var(--ai-chat-color-action-bg, #edcd20);
    color: var(--ai-chat-color-text-primary, #141414);
    font-weight: var(--ai-chat-font-weight-semibold, 600);
    font-size: var(--ai-chat-font-size-body-md, 16px);
    border-radius: var(--ai-chat-radius-component-button-md, 512px);
    height: 40px;
    padding: var(--ai-chat-space-1, 4px) var(--ai-chat-space-3, 12px);
    gap: var(--ai-chat-space-1, 4px);
    justify-content: flex-start;
    transition:
      background-color 300ms ease-in-out,
      color 300ms ease-in-out;

    &:hover:not(:disabled) {
      background-color: var(--ai-chat-color-action-bg-hover, #d4b81c);
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  small: css`
    padding: 2px 4px;
    font-size: var(--ai-chat-font-size-sm);
    line-height: 16px;
    height: 24px;
  `,
  medium: css``,
  large: css`
    padding: 8px 16px;
    font-size: var(--ai-chat-font-size-lg);
    line-height: 24px;
    height: 40px;
  `,
};

const iconModeSizes: Record<ButtonSize, ReturnType<typeof css>> = {
  small: css`
    width: 24px;
    height: 24px;
  `,
  medium: css`
    width: 32px;
    height: 32px;
  `,
  large: css`
    width: 40px;
    height: 40px;
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  font-family: var(--ai-chat-font-family);
  font-weight: var(--ai-chat-font-weight-regular);
  font-size: var(--ai-chat-font-size-md, 14px);
  border-radius: 6px;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: 2px;
  }

  &:disabled {
    background: var(--ai-chat-color-bg-surface-disabled, #14141414);
    color: var(--ai-chat-color-fg-disabled, #1414145c);
    ${bodyTypography}
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
      cursor: default;
    `}
  ${({ $iconMode, $size }) =>
    $iconMode &&
    css`
      padding: 0;
      justify-content: center;
      ${iconModeSizes[$size]}
    `}
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const spinnerSizes: Record<ButtonSize, string> = {
  small: '12px',
  medium: '16px',
  large: '18px',
};

export const Spinner = styled.span<{ $size: ButtonSize }>`
  width: ${({ $size }) => spinnerSizes[$size]};
  height: ${({ $size }) => spinnerSizes[$size]};
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

export const Content = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-1);
`;

export const StartIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const EndIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 1;
`;
