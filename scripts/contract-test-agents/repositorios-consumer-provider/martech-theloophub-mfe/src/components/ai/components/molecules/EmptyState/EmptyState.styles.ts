import styled from '@emotion/styled';

import type { EmptyStateVariant } from './EmptyState';

export const Container = styled.div<{ variant?: EmptyStateVariant }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ variant }) =>
    variant === 'compact' ? '4px' : 'var(--ai-chat-space-4, 16px)'};
  padding: ${({ variant }) =>
    variant === 'compact' ? '16px' : 'var(--ai-chat-space-8, 32px)'};
  height: 100%;
  min-height: ${({ variant }) => (variant === 'compact' ? '218px' : '400px')};
  text-align: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--ai-chat-space-2, 8px);
`;

export const Title = styled.h2<{ variant: EmptyStateVariant }>`
  margin: 0;
  font-family: var(
    --ai-chat-font-family-${({ variant }) =>
      variant === 'compact' ? 'body' : 'header'},
    ${({ variant }) => (variant === 'compact' ? "'Work Sans'" : "'Barlow'")},
    sans-serif
  );
  font-size: ${({ variant }) =>
    variant === 'compact' ? '14px' : 'var(--ai-chat-font-size-3xl, 24px)'};
  font-weight: ${({ variant }) =>
    variant === 'compact' ? '400' : 'var(--ai-chat-font-weight-semibold, 600)'};
  font-style: normal;
  line-height: ${({ variant }) => (variant === 'compact' ? '20px' : '120%')};
  letter-spacing: ${({ variant }) =>
    variant === 'compact' ? '0px' : 'normal'};
  color: var(--ai-chat-color-text-primary, #141414);
  text-align: center;
`;

export const Description = styled.p`
  margin: 0;
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: var(--ai-chat-color-text-primary, #141414);
  max-width: 400px;
  text-align: center;
`;

export const ButtonWrapper = styled.div<{ variant?: EmptyStateVariant }>`
  margin-top: ${({ variant }) => (variant === 'compact' ? '16px' : '0')};
`;
