import styled from '@emotion/styled';

export const PillButton = styled.button<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 40px;
  gap: var(--ai-chat-space-2, 8px);
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-3, 12px)
    var(--ai-chat-space-2, 8px) var(--ai-chat-space-2, 8px);
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? 'var(--ai-chat-color-bg-default-muted, #FFFFFF)'
        : 'var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.08))'};
  border-radius: var(--ai-chat-radius-3xl, 32px);
  background: ${({ isActive }) =>
    isActive ? '#EBEBEB' : 'var(--ai-chat-color-bg-default, #ffffff)'};
  color: var(--ai-chat-color-fg-default, #141414);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  cursor: pointer;
  white-space: nowrap;
  max-width: ${({ isActive }) => (isActive ? '218px' : '180px')};
  transition: all 300ms ease-in-out;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? '#EBEBEB' : 'var(--ai-chat-color-bg-default-subtle, #fafafa)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: 1px;
  }
`;

export const ActiveTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
`;

export const CloseIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--ai-chat-space-1, 4px);
  color: var(--ai-chat-color-fg-default, #141414);
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    opacity: 0.7;
  }
`;
