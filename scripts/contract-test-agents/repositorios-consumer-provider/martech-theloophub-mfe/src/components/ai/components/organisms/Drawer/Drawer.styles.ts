import styled from '@emotion/styled';

import { Button } from '../../atoms/Button';

export const StyledOverlay = styled.div<{
  $visible: boolean;
  $contained: boolean;
}>`
  position: ${({ $contained }) => ($contained ? 'absolute' : 'fixed')};
  inset: 0;
  background-color: rgba(0, 0, 0, 0.08);
  z-index: var(--ai-chat-z-modal-backdrop, 1040);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`;

export const StyledWrapper = styled.div<{
  $open: boolean;
  $contained: boolean;
}>`
  position: ${({ $contained }) => ($contained ? 'absolute' : 'fixed')};
  top: 0;
  right: 0;
  height: 100%;
  z-index: ${({ $open }) => ($open ? 'var(--ai-chat-z-modal, 1050)' : '198')};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
  transition: ${({ $open }) =>
    $open
      ? 'transform 0.3s ease, z-index 0s 0s'
      : 'transform 0.3s ease, z-index 0s 0.3s'};
  display: flex;
`;

export const StyledDrawer = styled.div`
  flex: 1;
  height: 100%;
  background-color: var(--ai-chat-color-bg-default, #ffffff);
  box-shadow: -1px 0 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.15);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.25);
    }

    &::-webkit-scrollbar-button {
      display: none;
    }
  }
`;

export const StyledTrigger = styled.button`
  position: absolute;
  left: 0;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ai-chat-space-3, 12px);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: translateX(-100%) rotate(180deg);
  width: 64px;
  height: 218px;
  padding: var(--ai-chat-space-3, 12px) var(--ai-chat-space-4, 24px);
  background-color: var(--ai-chat-color-bg-brand-azure-muted, #f0f9ff);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
  border-left: none;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0 var(--ai-chat-radius-xl, 16px) var(--ai-chat-radius-xl, 16px)
    0;
  font-family: var(--ai-chat-font-family-header, 'Barlow');
  font-size: var(--ai-chat-font-size-header-h3, 20px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  letter-spacing: 0px;
  color: var(--ai-chat-color-text-primary, #141414);
  cursor: pointer;
  transition: background-color 400ms ease-out;

  &:hover {
    background-color: var(--ai-chat-color-bg-brand-azure-muted-hover, #e0f3ff);
  }
`;

export const StyledCustomTrigger = styled.div`
  position: absolute;
  left: 0;
  transform: translateX(-100%);
  pointer-events: auto;
`;

export const TriggerIcon = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 400ms ease-out;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  svg {
    color: var(--ai-chat-color-text-primary, #141414);
  }
`;

export const TriggerText = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
`;

export const DrawerCloseIconButton = styled(Button)`
  position: absolute;
  top: var(--ai-chat-space-4, 16px);
  right: var(--ai-chat-space-4, 16px);
  color: var(--ai-chat-color-text-secondary, rgba(20, 20, 20, 0.36));
  transition:
    background-color var(--ai-chat-transition-fast, 150ms),
    color var(--ai-chat-transition-fast, 150ms);

  &:hover:not(:disabled) {
    background-color: var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
    color: var(--ai-chat-color-text-primary, #141414);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ai-chat-space-4, 16px);
  border-bottom: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
`;

export const Title = styled.h2`
  font-family: var(--ai-chat-font-family-header, 'Barlow');
  font-size: var(--ai-chat-font-size-2xl, 20px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  color: var(--ai-chat-color-text-primary, #141414);
  margin: 0;
`;

export const Body = styled.div`
  flex: 1;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;
