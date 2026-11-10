import styled from '@emotion/styled';

import { Dropdown } from '../../atoms/Dropdown/Dropdown';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--ai-chat-space-1, 4px);
  justify-content: space-between;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-3, 12px);
  background-color: transparent;
  border-radius: var(--ai-chat-radius-full);
  cursor: pointer;
  transition: background-color var(--ai-chat-transition-fast, 150ms ease);
  box-sizing: border-box;
  outline: none;

  &:has(input) {
    padding: 0;
    background-color: transparent;
    cursor: default;
  }

  &:hover:not(:has(input)) {
    background-color: rgba(20, 20, 20, 0.05);
  }

  svg {
    flex-shrink: 0;
    margin-left: var(--ai-chat-space-2, 8px);
  }
`;

export const Title = styled.span<{ $active: boolean }>`
  position: relative;
  font-family: var(--ai-chat-font-family, 'Avantt');
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  letter-spacing: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;

  ${({ $active }) =>
    $active &&
    `
    color: var(--ai-chat-color-text-primary, #141414);
  `}
`;

export const InputWrapper = styled.div`
  width: 100%;
  max-width: 302px;
`;

export const ActionsWrap = styled.div`
  flex-shrink: 0;
`;

export const DropdownTrigger = styled(Dropdown.Trigger)`
  width: var(--ai-chat-sizing-lg, 32px);
  height: var(--ai-chat-sizing-lg, 32px);
  padding: 0;
`;
