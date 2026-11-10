import styled from '@emotion/styled';

export const Container = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2, 8px);
  font-family: var(--ai-chat-font-family-body, 'Work Sans');
`;

export const StepItem = styled.li<{
  $state: 'pending' | 'current' | 'complete';
}>`
  display: flex;
  gap: var(--ai-chat-space-4, 16px);
  align-items: stretch;
  position: relative;
`;

export const ProgressColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ai-chat-space-1, 4px);
  flex-shrink: 0;
  align-self: stretch;
`;

export const StepNumber = styled.div<{
  $state: 'pending' | 'current' | 'complete';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--ai-chat-radius-component-button-md, 512px);
  outline: ${({ $state }) => {
    switch ($state) {
      case 'complete':
        return 'none';
      case 'pending':
        return 'none';
      case 'current':
        return '2px solid var(--ai-chat-color-text-primary, #141414)';
      default:
        return '2px solid var(--ai-chat-color-text-primary, #141414)';
    }
  }};
  background-color: ${({ $state }) => {
    switch ($state) {
      case 'complete':
      case 'current':
        return 'var(--ai-chat-color-primary, #e5b611)';
      case 'pending':
      default:
        return 'var(--ai-chat-color-bg-default, #ffffff)';
    }
  }};
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  font-family: var(--ai-chat-font-family-body, 'Work Sans');
  color: ${({ $state }) => {
    switch ($state) {
      case 'complete':
      case 'current':
        return 'var(--ai-chat-color-text-primary, #141414)';
      case 'pending':
      default:
        return 'var(--ai-chat-color-fg-tertiary, #adadad)';
    }
  }};
  z-index: 1;
`;

export const VerticalTrack = styled.div<{ $isLast: boolean }>`
  flex: 1;
  width: var(--ai-chat-border-width-medium, 2px);
  min-height: 0;
  background-color: var(--ai-chat-color-text-primary, #141414);
  border-radius: var(--ai-chat-radius-component-button-md, 512px);
  max-height: ${({ $isLast }) => ($isLast ? '0%' : '100%')};
  transition: all var(--ai-chat-transition-normal);
`;

export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
  padding-top: 0;
  padding-bottom: var(--ai-chat-space-2, 8px);
  flex: 1;
`;

export const Label = styled.h4`
  margin: 0;
  padding: 0;
  font-family: var(--ai-chat-font-family-header);
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  color: var(--ai-chat-color-text-primary, #141414);
`;

export const Description = styled.div`
  margin: 0;
  padding: 0;
  font-family: var(--ai-chat-font-family-body, 'Work Sans');
  font-size: var(--ai-chat-font-size-sm, 12px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);

  strong {
    font-weight: var(--ai-chat-font-weight-bold, 700);
  }
  p,
  strong,
  li,
  code,
  pre,
  table {
    font-size: var(--ai-chat-font-size-sm, 12px);
  }
`;
