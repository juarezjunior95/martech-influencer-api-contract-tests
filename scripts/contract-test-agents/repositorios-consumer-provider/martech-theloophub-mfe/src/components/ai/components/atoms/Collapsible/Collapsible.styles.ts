import styled from '@emotion/styled';

export const Root = styled.div`
  border-radius: var(--ai-chat-radius-sm, 4px);
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--ai-chat-space-2, 8px);
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ai-chat-focus-ring, 0 0 0 2px rgba(229, 182, 17, 0.4));
    border-radius: var(--ai-chat-radius-sm, 4px);
  }
`;

export const Chevron = styled.svg<{ open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  transition: transform var(--ai-chat-transition-normal, 200ms ease);
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Panel = styled.div<{ open: boolean }>`
  overflow: hidden;
  transition: max-height var(--ai-chat-transition-slow, 300ms ease);
  max-height: ${({ open }) => (open ? '2000px' : '0')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
