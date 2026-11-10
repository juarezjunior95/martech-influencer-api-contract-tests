import styled from '@emotion/styled';

export const Root = styled.div<{
  $error: boolean;
  $fullWidth: boolean;
  $disabledMuted: boolean;
}>`
  display: flex;
  align-items: flex-start;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: 104px;
  padding: var(--ai-chat-space-3) var(--ai-chat-space-4);
  background-color: var(--ai-chat-color-bg-default-muted);
  border: 1px solid var(--ai-chat-color-bd-secondary);
  border-radius: var(--ai-chat-radius-2xl, 24px);
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:focus-within {
    border-color: var(--ai-chat-color-bd-primary);
    outline: none;
  }

  ${({ $error }) =>
    $error && `border-color: var(--ai-chat-color-text-negative);`}

  ${({ $disabledMuted }) =>
    $disabledMuted &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--ai-chat-color-bg-secondary);
  `}
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--ai-chat-space-2);
  min-height: 100%;
`;

export const TextInput = styled.textarea<{ $singleLine: boolean }>`
  all: unset;
  flex: 1;
  width: 100%;
  min-height: 24px;
  font-family: var(--ai-chat-font-family);
  font-size: var(--ai-chat-font-size-lg);
  font-weight: var(--ai-chat-font-weight-regular);
  line-height: var(--ai-chat-line-height-normal);
  color: var(--ai-chat-color-text-primary);
  resize: none;
  box-sizing: border-box;

  &::placeholder {
    color: var(--ai-chat-color-text-secondary);
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ $singleLine }) =>
    $singleLine &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

export const TopContent = styled.div`
  flex: 1;
  min-height: 24px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ai-chat-space-2);
`;

export const StartContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2);
`;

export const EndContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2);
  margin-left: auto;
`;

export const SubmitButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: var(--ai-chat-radius-full);
  cursor: pointer;
  color: ${({ $active }) =>
    $active
      ? 'var(--ai-chat-color-primary)'
      : 'var(--ai-chat-color-text-secondary)'};
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ $active }) =>
      $active
        ? 'var(--ai-chat-color-primary-hover)'
        : 'var(--ai-chat-color-text-primary)'};
    background-color: var(--ai-chat-color-bd-tertiary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
