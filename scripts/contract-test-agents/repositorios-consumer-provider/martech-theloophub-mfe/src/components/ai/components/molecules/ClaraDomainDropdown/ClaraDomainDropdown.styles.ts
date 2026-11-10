import styled from '@emotion/styled';

export const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Trigger = styled.button<{ isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  height: 40px;
  max-width: 220px;
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-3, 12px);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.08));
  border-radius: var(--ai-chat-radius-3xl, 32px);
  background: var(--ai-chat-color-bg-default, #ffffff);
  color: var(--ai-chat-color-fg-default, #141414);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    background: var(--ai-chat-color-bg-default-subtle, #fafafa);
    border-color: var(--ai-chat-color-bd-secondary, rgba(20, 20, 20, 0.16));
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

export const TriggerLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Chevron = styled.span<{ isOpen: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  transition: transform 150ms ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const Menu = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--ai-chat-space-2, 8px));
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
  width: min(300px, calc(100vw - 32px));
  padding: var(--ai-chat-space-2, 8px);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.08));
  border-radius: var(--ai-chat-radius-lg, 12px);
  background: var(--ai-chat-color-bg-default, #ffffff);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  z-index: var(--ai-chat-z-popover, 1060);
`;

export const Option = styled.button<{ isSelected: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  gap: var(--ai-chat-space-2, 8px);
  width: 100%;
  padding: var(--ai-chat-space-3, 12px);
  border: none;
  border-radius: var(--ai-chat-radius-md, 8px);
  background: ${({ isSelected }) =>
    isSelected
      ? 'var(--ai-chat-color-bg-default-subtle, #ededed)'
      : 'transparent'};
  color: var(--ai-chat-color-text-primary, #141414);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover,
  &:focus-visible {
    background: var(--ai-chat-color-bg-default-subtle, #ededed);
  }

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: -2px;
  }
`;

export const OptionContent = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
`;

export const OptionTitle = styled.span`
  color: var(--ai-chat-color-text-primary, #141414);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-snug, 1.4);
`;

export const OptionDescription = styled.span`
  color: var(--ai-chat-color-text-secondary, #5c5c5c);
  font-size: var(--ai-chat-font-size-sm, 12px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
`;

export const CheckSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: var(--ai-chat-color-fg-default, #141414);
`;
