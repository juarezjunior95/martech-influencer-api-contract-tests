import styled from '@emotion/styled';

import { Modal } from '../../organisms/Modal';

export const StyledModalContent = styled(Modal.Content)`
  max-width: 800px;
  max-height: 860px;
  width: 100%;
  border-radius: var(--ai-chat-radius-lg, 12px);
  padding: var(--ai-chat-padding-xl, 24px);
  border-top: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.16);
`;

export const ModalTitle = styled.h2`
  font-size: var(--ai-chat-font-size-3xl, 24px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  font-family: var(--ai-chat-font-family-header);
  color: var(--ai-chat-color-text-primary, #141414);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  margin: 0;
`;

export const StyledModalHeader = styled(Modal.Header)`
  align-items: flex-start;
  padding-left: var(--ai-chat-space-3, 12px);
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-4, 16px);
`;

export const StyledModalBody = styled(Modal.Body)`
  max-width: 100%;
  max-height: 100%;
  flex: 1;
  overflow-y: auto;
  padding: var(--ai-chat-space-4, 16px) var(--ai-chat-space-3, 12px);
`;

export const BodyContent = styled.div`
  font-size: var(--ai-chat-font-size-md, 14px);
  color: var(--ai-chat-color-text-primary, #141414);
  font-family: inherit;
  line-height: var(--ai-chat-line-height-normal, 1.5);

  table {
    position: relative;
    width: 100%;
    overflow-x: auto;
    display: block;
  }
`;

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ai-chat-space-10, 40px) var(--ai-chat-space-5, 20px);
  font-family: var(--ai-chat-font-family);
  font-size: var(--ai-chat-font-size-lg, 16px);
  color: var(--ai-chat-color-fg-negative, #d62222);
`;

export const CopyTooltipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const StyledCopyButton = styled.button<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color var(--ai-chat-transition-fast, 150ms ease);
  color: ${({ $copied }) =>
    $copied ? '#50A5E2' : 'var(--ai-chat-color-fg-secondary, #5c5c5c)'};

  &:hover:not(:disabled) {
    color: ${({ $copied }) =>
      $copied ? '#50A5E2' : 'var(--ai-chat-color-fg-default, #0a0a0a)'};
  }
`;
