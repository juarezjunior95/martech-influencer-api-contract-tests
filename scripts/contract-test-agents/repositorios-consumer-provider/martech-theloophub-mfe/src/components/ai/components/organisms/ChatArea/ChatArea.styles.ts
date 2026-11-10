import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

export const ContentArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const MessagesArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ai-chat-space-3, 12px) var(--ai-chat-space-4, 16px)
    var(--ai-chat-space-2, 8px);
`;

export const FAQSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--ai-chat-space-6, 24px);
`;

export const FAQContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 394px;
`;

export const FAQHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
`;

export const FAQTitle = styled.h3`
  font-family: var(--ai-chat-font-family-header, 'Barlow', sans-serif);
  font-size: var(--ai-chat-font-size-2xl, 20px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 120%;
  color: var(--ai-chat-color-text-primary, #141414);
  margin: 0;
`;

export const FAQGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-3, 12px);
  margin-top: var(--ai-chat-space-4, 16px);
`;

export const SmartFlowSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--ai-chat-space-10, 40px);
`;

export const SmartFlowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SmartFlowHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
`;

export const SmartFlowTitle = styled.h3`
  font-family: var(--ai-chat-font-family-header, 'Barlow', sans-serif);
  font-size: var(--ai-chat-font-size-2xl, 20px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 130%;
  color: var(--ai-chat-color-text-primary, #141414);
  margin: 0;
`;

export const SmartFlowGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-3, 12px);
  margin-top: var(--ai-chat-space-4, 16px);
`;
