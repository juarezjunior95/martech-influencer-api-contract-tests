import styled from '@emotion/styled';

export const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--ai-chat-space-3, 12px);
  cursor: pointer;
  position: relative;
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
`;

export const Checkmark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: var(--ai-chat-border-width-thin, 1px) solid
    var(--ai-chat-color-component-checkbox-bd-inactive, rgba(0, 0, 0, 0.24));
  border-radius: var(--ai-chat-radius-sm, 4px);
  background-color: transparent;
  transition:
    background-color var(--ai-chat-transition-fast, 150ms ease),
    border-color var(--ai-chat-transition-fast, 150ms ease);

  svg {
    display: none;
  }

  input:checked + & {
    background-color: var(
      --ai-chat-color-component-checkbox-bg-selected,
      #e5b611
    );
    border-color: var(--ai-chat-color-component-checkbox-bg-selected, #e5b611);

    svg {
      display: block;
    }
  }

  input:disabled + & {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Label = styled.span`
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  color: var(--ai-chat-color-fg-default, #0a0a0a);
  line-height: var(--ai-chat-line-height-normal, 1.5);
  user-select: none;
`;
