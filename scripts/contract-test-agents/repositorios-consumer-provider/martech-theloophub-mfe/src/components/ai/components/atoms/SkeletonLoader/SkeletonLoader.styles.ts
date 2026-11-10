import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shine = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Block = styled.div`
  margin-bottom: var(--ai-chat-space-4, 16px);
  position: relative;
  padding: 0 4px;
`;

export const HeaderRow = styled.div`
  display: flex;
  margin-bottom: var(--ai-chat-space-2, 8px);
  gap: var(--ai-chat-space-3, 12px);
  align-items: flex-start;
`;

export const Avatar = styled.div`
  background-color: var(--ai-chat-color-bg-tertiary, #e2e2e2);
  width: 21px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const Bar = styled.div<{
  width: 'short' | 'full';
  size: 'sm' | 'md';
}>`
  border-radius: var(--ai-chat-radius-sm, 4px);
  animation: ${shine} 1.5s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    var(--ai-chat-color-bg-tertiary, #e2e2e2) 25%,
    var(--ai-chat-color-bg-secondary, #f3f3f3) 50%,
    var(--ai-chat-color-bg-tertiary, #e2e2e2) 75%
  );
  background-size: 200% 100%;
  width: ${({ width }) => (width === 'short' ? '20%' : '100%')};
  height: ${({ size }) => (size === 'sm' ? '12px' : '16px')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Lines = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2, 8px);
  width: 100%;
`;
