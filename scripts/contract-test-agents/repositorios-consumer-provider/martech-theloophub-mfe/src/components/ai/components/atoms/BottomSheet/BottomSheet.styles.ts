import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { Button } from '../Button';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

export const SheetContainer = styled.div<{ isClosing?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  max-height: min(413px, 100%);
  display: flex;
  flex-direction: column;
  background: var(--ai-chat-color-bg-default, #ffffff);
  z-index: 2;
  animation: ${({ isClosing }) => (isClosing ? slideDown : slideUp)} 0.25s
    ease-out forwards;
  overflow: hidden;
`;

export const SheetCloseButton = styled(Button)`
  display: flex;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-2, 8px);
  margin: 0 auto;
  border-radius: var(--ai-chat-radius-full, 9999px);
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
  color: var(--ai-chat-color-fg-default, #141414);

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const SheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
  padding: var(--ai-chat-space-4, 16px) var(--ai-chat-space-5, 20px) 0;
  position: relative;
  z-index: 2;
`;

export const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-4, 16px);
  padding: var(--ai-chat-space-5, 20px) 23px var(--ai-chat-space-6, 24px);
  overflow-y: auto;
  position: relative;
  z-index: 2;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: var(--ai-chat-radius-sm, 4px);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
`;
