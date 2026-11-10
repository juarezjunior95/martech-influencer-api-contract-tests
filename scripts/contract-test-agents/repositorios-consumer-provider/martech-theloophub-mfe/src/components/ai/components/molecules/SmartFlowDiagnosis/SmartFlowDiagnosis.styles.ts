import styled from '@emotion/styled';

export const DiagnosisContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ai-chat-space-1, 4px);
  line-height: var(--ai-chat-line-height-snug, 1.4);
`;

export const TextSpan = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans');
  font-size: var(--ai-chat-font-size-xl, 18px);
  color: var(--ai-chat-color-text-primary, #141414);
  font-weight: var(--ai-chat-font-weight-regular, 400);
`;
