import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { Button } from '../Button';

const slideIn = keyframes`
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
`;

const typeStyles = {
  success: css`
    min-width: 352px;
    background-color: var(--ai-chat-color-bg-positive-subtle, #e6f9e6);
    border: var(--ai-chat-border-width-sm, 1px) solid
      var(--ai-chat-color-bd-positive-subtle, #99e699);
    color: var(--ai-chat-color-fg-positive, #198038);
  `,
  error: css`
    min-width: 414px;
    background-color: var(--ai-chat-color-bg-negative-subtle, #fee2e2);
    border: var(--ai-chat-border-width-sm, 1px) solid
      var(--ai-chat-color-bd-negative-subtle, #fca5a5);
    color: var(--ai-chat-color-fg-negative-icon, #b91c1c);
  `,
};

export const Container = styled.div<{
  type: 'success' | 'error';
  closing: boolean;
}>`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--ai-chat-z-tooltip, 1070);
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  padding: 16px;
  border-radius: var(--ai-chat-radius-component-alert, 12px);
  white-space: nowrap;
  box-shadow: var(--ai-chat-shadow-alert, 0px 0px 4px 0px rgba(0, 0, 0, 0.16));
  animation: ${({ closing }) => (closing ? slideOut : slideIn)} 0.3s ease
    forwards;
  ${({ type }) => typeStyles[type]}
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Message = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-body-sm, 14px);
  color: var(--ai-chat-color-text-primary, #141414);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  margin: 0;
`;

export const ToastRetryButton = styled(Button)`
  flex-shrink: 0;
  min-height: unset;
  height: auto;
  padding: var(--ai-chat-space-1, 4px) var(--ai-chat-space-2, 8px);
  border-radius: var(--ai-chat-radius-full, 9999px);
  border-color: var(--ai-chat-color-fg-negative, #d62222);
  color: var(--ai-chat-color-fg-negative, #d62222);
  background-color: var(--ai-chat-color-bg-default, #ffffff);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  white-space: nowrap;

  &:hover:not(:disabled) {
    opacity: 0.8;
    background-color: var(--ai-chat-color-bg-default, #ffffff);
  }
`;

export const ToastCloseButton = styled(Button)`
  flex-shrink: 0;
  background-color: var(--ai-chat-color-bg-surface-tertiary, #1414141a);
  color: var(--ai-chat-color-fg-dark, #222222);

  &:hover:not(:disabled) {
    background-color: var(--ai-chat-color-bd-primary, rgba(0, 0, 0, 0.24));
  }
`;
