import styled from '@emotion/styled';

export const Card = styled.div<{ $clean: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ai-chat-space-2, 8px);
  width: 100%;
  min-width: 298px;
  min-height: 64px;
  padding: var(--ai-chat-space-3, 12px);
  border: 1px solid var(--ai-chat-color-bd-tertiary, #14141414);
  border-radius: var(--ai-chat-radius-md, 8px);
  background-color: var(--ai-chat-color-bg-default, #ffffff);
  cursor: pointer;
  transition:
    border-color var(--ai-chat-transition-fast, 150ms ease),
    background-color var(--ai-chat-transition-fast, 150ms ease);
  box-sizing: border-box;

  &:hover {
    border-color: var(--ai-chat-color-bd-secondary, rgba(0, 0, 0, 0.16));
    background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
  }

  ${({ $clean }) =>
    $clean &&
    `
    border: none;
    border-radius: 0;
    background-color: transparent;
    padding: var(--ai-chat-space-3, 12px) 0;

    &:hover {
      border-color: transparent;
      background-color: transparent;
    }
  `}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
  flex: 1;
  min-width: 0;
`;

export const TitleText = styled.h4`
  font-family: var(--ai-chat-font-family, 'Avantt', sans-serif);
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 100%;
  letter-spacing: 0.01em;
  color: var(--ai-chat-color-fg-default, #0a0a0a);
  margin: 0;
`;

export const DescSmall = styled.p`
  font-family: var(--ai-chat-font-family, 'Avantt', sans-serif);
  font-size: var(--ai-chat-font-size-sm, 12px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  margin: 0;
`;

export const DescLarge = styled.p`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  margin: 0;
`;

export const Arrow = styled.span`
  flex-shrink: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
`;
