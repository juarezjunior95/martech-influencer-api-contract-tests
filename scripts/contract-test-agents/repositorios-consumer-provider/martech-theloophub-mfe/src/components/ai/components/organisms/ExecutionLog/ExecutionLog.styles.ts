import styled from '@emotion/styled';

export const Root = styled.div`
  width: 100%;
  font-family: var(--ai-chat-font-family, 'Avantt', sans-serif);
`;

export const ProgressLabel = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  min-height: 20px;
`;

export const ScrollContainer = styled.div<{ faded?: boolean }>`
  overscroll-behavior: contain;
  opacity: ${({ faded }) => (faded ? 0.7 : 1)};
  transition: opacity var(--ai-chat-transition-normal, 200ms ease);
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-2, 8px)
    var(--ai-chat-space-2, 8px) 0;
`;

export const EmptyState = styled.div`
  font-size: var(--ai-chat-font-size-sm, 12px);
  color: var(--ai-chat-color-fg-tertiary, #8a8a8a);
  padding: var(--ai-chat-space-2, 8px);
`;

export const AccordionTitle = styled.span`
  font-size: var(--ai-chat-font-size-sm, 12px);
  color: var(--ai-chat-color-fg-tertiary, #8a8a8a);
`;

// Timeline Item

export const ItemRow = styled.div`
  display: flex;
  gap: var(--ai-chat-space-2, 8px);
  position: relative;
  isolation: isolate;
  content-visibility: auto;
  contain-intrinsic-size: auto 80px;
`;

export const Gutter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
`;

export const Marker = styled.div`
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid var(--ai-chat-color-bd-tertiary, #e0e0e0);
  background-color: var(--ai-chat-color-fg-tertiary, #8a8a8a);
  z-index: 1;
  box-shadow:
    0 4px 4px 0 rgba(255, 173, 13, 0.2) inset,
    0 14px 30px -4px rgba(255, 173, 13, 0.1);
`;

export const Connector = styled.div`
  width: var(--ai-chat-border-width-medium, 2px);
  background-color: var(--ai-chat-color-bd-tertiary, #e0e0e0);
  flex-grow: 1;
  margin-top: 4px;
  min-height: 20px;
`;

export const ItemContent = styled.div`
  flex: 1;
  margin-top: 4px;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  padding-bottom: var(--ai-chat-space-1, 4px);

  p {
    margin: 0;
    font-size: var(--ai-chat-font-size-sm, 12px);
    line-height: var(--ai-chat-line-height-snug, 1.4);
  }

  li {
    font-size: var(--ai-chat-font-size-sm, 12px);
    margin-top: 0;
  }

  code {
    font-size: var(--ai-chat-font-size-sm, 12px);
  }

  hr {
    margin: var(--ai-chat-space-3, 12px) 0;
  }
`;

export const SkeletonWrapper = styled.div`
  margin-top: var(--ai-chat-space-2, 8px);
`;
