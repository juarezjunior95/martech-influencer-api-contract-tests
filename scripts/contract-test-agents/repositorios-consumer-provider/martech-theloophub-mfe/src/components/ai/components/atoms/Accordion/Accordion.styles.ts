import styled from '@emotion/styled';

import { ChevronRight } from '../Icon/ChevronRight';

export const Details = styled.details`
  border: none;
  background: transparent;
  border-radius: var(--ai-chat-radius-md, 8px);
  padding: 0;
  margin: var(--ai-chat-space-2, 8px) 0;
  overflow: hidden;
  transition: background 0.2s ease;
`;

export const Summary = styled.summary`
  padding: var(--ai-chat-space-4, 16px);
  min-height: 72px;
  cursor: pointer;
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  font-size: var(--ai-chat-font-size-md, 14px);
  list-style: none;
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  user-select: none;
  color: var(--ai-chat-color-fg-primary, #1a1a1a);
  border-radius: var(--ai-chat-space-2, 8px);
  transition: background 0.2s ease;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background: var(--ai-chat-color-hover, rgba(0, 0, 0, 0.04));
  }
`;

export const ChevronIcon = styled(ChevronRight, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(-90deg)' : 'rotate(90deg)')};
  color: var(--ai-chat-color-fg-secondary, #666666);
`;

export const SummaryText = styled.span`
  flex: 1;
  font-size: var(--ai-chat-font-size-2xl, 20px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
`;

export const Content = styled.div`
  padding: 0 var(--ai-chat-space-4, 16px) var(--ai-chat-space-4, 16px)
    var(--ai-chat-space-4, 16px);
  font-size: var(--ai-chat-font-size-md, 14px);
  line-height: var(--ai-chat-line-height-relaxed, 1.75);
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
`;
