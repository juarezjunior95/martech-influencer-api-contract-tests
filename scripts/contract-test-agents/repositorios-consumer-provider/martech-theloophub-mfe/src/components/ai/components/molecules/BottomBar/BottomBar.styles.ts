import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  padding: var(--ai-chat-space-3, 12px) var(--ai-chat-space-3, 12px)
    var(--ai-chat-space-4, 16px);
  margin: 0 var(--ai-chat-space-4, 16px);
  background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
  border-top-left-radius: var(--ai-chat-radius-xl, 16px);
  border-top-right-radius: var(--ai-chat-radius-xl, 16px);
`;

export const HintText = styled.span`
  color: var(--color-fg-disabled, #0000005c);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-sm, 12px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  text-align: center;
`;

export const Disclaimer = styled.span`
  color: var(--color-fg-disabled, #0000005c);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-xs, 10px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  line-height: 140%;
  text-align: center;
`;
