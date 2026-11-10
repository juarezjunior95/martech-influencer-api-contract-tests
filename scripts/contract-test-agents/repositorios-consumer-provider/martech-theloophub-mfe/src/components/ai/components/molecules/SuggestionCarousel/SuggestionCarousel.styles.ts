import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ai-chat-space-3, 12px);
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
  flex-shrink: 0;
`;

export const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--ai-chat-radius-full, 9999px);
  background: transparent;
  color: var(--ai-chat-color-fg-default, #141414);
  cursor: pointer;
  transition:
    color var(--ai-chat-transition-fast, 150ms ease),
    background-color var(--ai-chat-transition-fast, 150ms ease);

  &:hover:not(:disabled) {
    background: var(--ai-chat-color-bg-default-subtle, #fafafa);
  }

  &:disabled {
    color: var(--ai-chat-color-fg-disabled, rgba(20, 20, 20, 0.36));
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: 1px;
  }
`;

export const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-3, 12px);
  margin-top: var(--ai-chat-space-4, 16px);
`;
