import styled from '@emotion/styled';

/** Pushes messages to bottom when few */
export const Spacer = styled.div`
  flex: 1;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-4, 16px);
`;

export const Row = styled.div<{ position: 'user' | 'assistant' }>`
  display: flex;
  width: 100%;
  justify-content: ${({ position }) =>
    position === 'user' ? 'flex-end' : 'flex-start'};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FeedbackActionsWrapper = styled.div`
  padding-left: var(--ai-chat-space-6, 24px);
`;
