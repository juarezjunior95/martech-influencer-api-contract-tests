import styled from '@emotion/styled';

export const StyledInput = styled.input<{
  $hasError: boolean;
  $fullWidth: boolean;
}>`
  all: unset;
  display: ${({ $fullWidth }) => ($fullWidth ? 'block' : 'inline-flex')};
  align-items: center;
  box-sizing: border-box;
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  line-height: 140%;
  letter-spacing: 0;
  color: var(--ai-chat-color-fg-default, #141414);
  background: var(--ai-chat-color-bg-default-muted, #ffffff);
  border: 1px solid var(--ai-chat-color-fg-disabled, #1414145c);
  border-radius: var(--ai-chat-radius-xxxl, 64px);
  padding: 8px 16px;
  height: 37px;
  min-height: 37px;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:focus {
    border-color: var(--ai-chat-color-fg-disabled, #1414145c);
    color: var(--ai-chat-color-fg-default, #141414);
    outline: none;
    box-shadow: none;
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: var(--ai-chat-color-fg-disabled, #1414145c);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--ai-chat-color-bg-disabled, #f5f5f5);
  }

  &::placeholder {
    color: var(--ai-chat-color-fg-placeholder, #a0a0a0);
  }

  ${({ $hasError }) =>
    $hasError &&
    `
    border-color: var(--ai-chat-color-text-negative, #d62222);

    &:focus {
      border-color: var(--ai-chat-color-text-negative, #d62222);
    }
  `}
`;
