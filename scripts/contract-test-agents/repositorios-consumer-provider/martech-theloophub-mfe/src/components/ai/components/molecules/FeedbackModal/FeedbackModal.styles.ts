import styled from '@emotion/styled';

export const Title = styled.h3`
  font-family: var(--ai-chat-font-family-header, 'Barlow', sans-serif);
  font-size: var(--ai-chat-font-size-3xl, 24px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 120%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-text-primary, #141414);
  margin: 0;
`;

export const Subheader = styled.p`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 140%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-text-primary, #141414);
  margin: 0;
`;

export const SubtitleOptional = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
`;

export const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2, 8px);
  margin-top: var(--ai-chat-space-4, 16px);
`;

export const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-4, 16px);
`;

export const OptionItem = styled.div`
  display: flex;
  align-items: flex-start;

  > label {
    display: flex;
    width: 100%;
    align-items: center;
    min-height: inherit;

    > span:last-of-type {
      flex: 1;
    }
  }

  &:last-child > label {
    align-items: flex-start;

    > span:first-of-type {
      margin-top: 10px;
    }
  }
`;

export const OptionContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
`;

export const OptionLabelText = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-text-primary, #141414);
`;

export const OptionDescription = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-fg-secondary, #67665f);
`;

export const OtherContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--ai-chat-space-2, 8px);
  width: 100%;

  > span:first-of-type {
    padding-top: 10px;
    flex-shrink: 0;
  }
`;

export const OtherInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--ai-chat-space-1, 4px);
`;

export const OtherInput = styled.input`
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-fg-default, #141414);
  background: var(--ai-chat-color-component-input-bg, #ffffff);
  border: 1px solid var(--ai-chat-color-component-input-bd, #14141429);
  border-radius: var(--ai-chat-radius-component-input, 8px);
  padding: 0 var(--ai-chat-padding-md, 12px);
  outline: none;

  &::placeholder {
    font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
    font-size: var(--ai-chat-font-size-body-md, 16px);
    font-weight: var(--ai-chat-font-weight-regular, 400);
    line-height: 140%;
    letter-spacing: 0px;
    color: var(--ai-chat-color-fg-tertiary, #adadad);
  }

  &:focus {
    border-color: var(--ai-chat-color-fg-disabled, #1414145c);
  }
`;

export const CharCount = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-xs, 12px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: 140%;
  letter-spacing: 0px;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  text-align: right;
`;

export const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-1, 4px);
  margin-top: var(--ai-chat-space-4, 16px);
`;

export const CommentsTextarea = styled.textarea`
  width: 100%;
  min-height: 101px;
  padding: var(--ai-chat-padding-md, 12px);
  border: 1px solid var(--ai-chat-color-component-input-bd, #14141429);
  border-radius: var(--ai-chat-radius-component-input, 8px);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-sm, 12px);
  color: var(--ai-chat-color-fg-default, #0a0a0a);
  background: var(--ai-chat-color-component-input-bg, #ffffff);
  resize: vertical;
  outline: none;
  transition: border-color var(--ai-chat-transition-fast, 150ms ease);
  box-sizing: border-box;

  &::placeholder {
    font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
    font-size: var(--ai-chat-font-size-body-md, 16px);
    font-weight: var(--ai-chat-font-weight-regular, 400);
    line-height: 140%;
    letter-spacing: 0px;
    color: var(--ai-chat-color-fg-tertiary, #adadad);
  }

  &:focus {
    border-color: var(--ai-chat-color-fg-disabled, #1414145c);
  }
`;
