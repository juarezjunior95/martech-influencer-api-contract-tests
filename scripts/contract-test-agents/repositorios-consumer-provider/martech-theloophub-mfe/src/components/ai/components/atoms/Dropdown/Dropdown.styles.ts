import styled from '@emotion/styled';

export const DROPDOWN_WIDTH = 145;
export const DROPDOWN_MIN_HEIGHT = 56;
export const DROPDOWN_MAX_HEIGHT = 264;
export const DROPDOWN_PADDING = 4;
export const DROPDOWN_OFFSET = 4;
export const VIEWPORT_PADDING = 8;

export const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Menu = styled.div<{ visible: boolean }>`
  position: fixed;
  display: flex;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity var(--ai-chat-transition-fast, 150ms ease);
  flex-direction: column;
  gap: ${DROPDOWN_PADDING}px;
  width: ${DROPDOWN_WIDTH}px;
  min-height: ${DROPDOWN_MIN_HEIGHT}px;
  max-height: ${DROPDOWN_MAX_HEIGHT}px;
  overflow-y: auto;
  padding: ${DROPDOWN_PADDING}px;
  border-radius: var(--ai-chat-radius-md, 8px);
  border: var(--ai-chat-border-width-sm, 1px) solid
    var(--ai-chat-color-bd-neutral-tertiary, #14141414);
  background: var(--color-bg-surface_primary, #ffffff);
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  z-index: var(--ai-chat-z-popover, 1060);
`;

export const Item = styled.button<{ destructive?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
  width: 100%;
  padding: var(--ai-chat-space-3, 12px);
  border: none;
  border-radius: var(--ai-chat-radius-md, 8px);
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-chat-font-family, 'Avantt', sans-serif);
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  color: ${({ destructive }) =>
    destructive
      ? 'var(--color-fg-negative-default, #D62222)'
      : 'var(--color-fg-neutral_primary, #141414)'};
  transition: background-color var(--ai-chat-transition-fast, 150ms ease);

  &:hover {
    background-color: var(
      --ai-chat-color-component-dropdown-item-hover,
      #fff8e0
    );
  }

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: -2px;
    background-color: var(--ai-chat-color-bg-secondary, #f3f3f3);
  }
`;
