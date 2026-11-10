import styled from '@emotion/styled';

import { Button } from '../../atoms/Button';

export const Overlay = styled.div<{
  visible: boolean;
  variant: 'light' | 'dark';
  fullscreen?: boolean;
}>`
  position: ${({ fullscreen }) => (fullscreen ? 'fixed' : 'absolute')};
  inset: 0;
  background: ${({ variant }) =>
    variant === 'dark'
      ? 'var(--color-bg-surface_inverted, #141414)'
      : '#ffffff'};
  opacity: ${({ visible, variant }) => {
    if (!visible) return 0;
    return variant === 'dark' ? 0.16 : 0.8;
  }};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity var(--ai-chat-transition-normal, 200ms ease);
  z-index: ${({ fullscreen }) =>
    fullscreen ? 9999 : 'var(--ai-chat-z-modal-backdrop, 1040)'};
`;

export const Wrapper = styled.div<{ visible: boolean; fullscreen?: boolean }>`
  position: ${({ fullscreen }) => (fullscreen ? 'fixed' : 'absolute')};
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity var(--ai-chat-transition-normal, 200ms ease);
  z-index: ${({ fullscreen }) =>
    fullscreen ? 10000 : 'var(--ai-chat-z-modal, 1050)'};
`;

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const MODAL_WIDTHS: Record<ModalSize, string> = {
  xs: '288px',
  sm: '400px',
  md: '522px',
  lg: '640px',
  xl: '800px',
};

export const ContentBox = styled.div<{ size: ModalSize }>`
  width: ${({ size }) => MODAL_WIDTHS[size]};
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-4, 16px);
  border-radius: var(--ai-chat-radius-2xl, 24px);
  padding: var(--ai-chat-space-6, 24px);
  background: var(--ai-chat-color-bg-default, #ffffff);
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.16);
  overflow-y: auto;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ai-chat-space-2, 8px);
`;

export const ModalCloseButton = styled(Button)`
  flex-shrink: 0;
  border-radius: var(--ai-chat-radius-full, 9999px);
  transition: background-color var(--ai-chat-transition-fast, 150ms ease);

  &:hover:not(:disabled) {
    background-color: var(--ai-chat-color-bg-secondary, #f3f3f3);
  }
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
  flex: 1;
`;

export const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ai-chat-space-3, 12px);
  padding-top: var(--ai-chat-space-2, 8px);
`;
