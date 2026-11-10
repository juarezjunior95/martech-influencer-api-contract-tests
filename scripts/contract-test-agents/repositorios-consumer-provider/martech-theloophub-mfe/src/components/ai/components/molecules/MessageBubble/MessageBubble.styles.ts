import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { chatMessageBodyTypography } from '../../shared/typography';
import type { MessageBubblePosition } from './MessageBubble.types';

const positionStyles: Record<MessageBubblePosition, ReturnType<typeof css>> = {
  user: css`
    max-width: 342px;
    background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
    padding: var(--ai-chat-space-4, 16px) var(--ai-chat-space-6, 24px);
    border-radius: var(--ai-chat-radius-3xl) var(--ai-chat-radius-sm)
      var(--ai-chat-radius-3xl) var(--ai-chat-radius-3xl);
  `,
  assistant: css`
    max-width: 482px;
    background-color: var(--ai-chat-color-bg-default, #ffffff);
    padding: var(--ai-chat-space-4, 16px) var(--ai-chat-space-6, 24px);
    border-radius: var(--ai-chat-radius-sm) var(--ai-chat-radius-3xl)
      var(--ai-chat-radius-2xl) var(--ai-chat-radius-2xl);

    &:has([data-error-content]) {
      width: 482px;
    }

    &:has([data-charts]) {
      width: 520px;
      max-width: 520px;
    }

    &:has([data-testid='execution-log']) {
      width: 482px;
    }
  `,
};

export const Bubble = styled.div<{
  $position: MessageBubblePosition;
}>`
  display: inline-flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2);
  max-width: 522px;
  border-width: var(--ai-chat-border-width-medium);
  border-style: solid;
  border-color: var(--ai-chat-color-bd-tertiary);
  ${chatMessageBodyTypography}
  ${({ $position }) => positionStyles[$position]}
`;

export const ThinkingBubble = styled(Bubble)`
  flex-direction: row;
  align-items: center;
  width: 482px;
  min-height: 52px;
`;

export const ThinkingText = styled.span`
  font-weight: var(--ai-chat-font-weight-medium);
  color: var(--ai-chat-color-fg-secondary);
`;

export const FailedBubble = styled(Bubble)`
  border-color: var(--ai-chat-color-bd-negative-secondary);
`;

export const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--ai-chat-space-1);
`;

export const AlertIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
  transform: rotate(-180deg);
  color: var(--ai-chat-color-fg-negative);
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ai-chat-space-2);
`;

export const ErrorMessage = styled.span`
  font-weight: var(--ai-chat-font-weight-medium);
  color: var(--ai-chat-color-fg-secondary);
`;

export const AbandonedBubble = styled(Bubble)`
  border-color: var(--ai-chat-color-bd-tertiary);
  background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
`;

export const AbandonedMessage = styled.span`
  font-weight: var(--ai-chat-font-weight-medium);
  color: var(--ai-chat-color-fg-secondary);
`;
