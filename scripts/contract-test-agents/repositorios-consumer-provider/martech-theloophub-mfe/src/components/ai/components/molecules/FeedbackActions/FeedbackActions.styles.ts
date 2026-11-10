import styled from '@emotion/styled';

import { Button } from '../../atoms/Button';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
  padding-top: var(--ai-chat-space-3, 12px);
`;

export const FeedbackIconButton = styled(Button)`
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  font-weight: var(--ai-chat-font-weight-regular, 400);

  &:hover:not(:disabled) {
    color: var(--ai-chat-color-fg-default, #0a0a0a);
    background: transparent;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: transparent;
    pointer-events: none;
  }
`;
