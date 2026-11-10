import styled from '@emotion/styled';

export const SelectContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Trigger = styled.button<{
  hasValue: boolean;
  isRequired: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  padding: var(--ai-chat-space-1, 4px) var(--ai-chat-space-3, 12px);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.08));
  border-radius: var(--ai-chat-radius-full, 9999px);
  background: var(--ai-chat-color-bg-default, #ffffff);
  color: ${({ hasValue }) =>
    hasValue
      ? 'var(--ai-chat-color-fg-default, #141414)'
      : 'var(--ai-chat-color-text-primary, #141414)'};
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-medium, 500);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  cursor: pointer;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: var(--ai-chat-color-bd-secondary, rgba(20, 20, 20, 0.16));
  }

  &:focus-visible {
    outline: 2px solid var(--ai-chat-color-focus, #2f74aa);
    outline-offset: 1px;
  }
`;

export const RequiredMark = styled.span`
  color: var(--ai-chat-color-text-negative, #e82727);
  margin-left: 2px;
`;

interface DropdownProps {
  align?: 'left' | 'right';
  dropDirection?: 'up' | 'down';
}

export const Dropdown = styled.div<DropdownProps>`
  position: absolute;
  ${({ dropDirection }) =>
    dropDirection === 'down'
      ? 'top: calc(100% + var(--ai-chat-space-1, 4px));'
      : 'bottom: calc(100% + var(--ai-chat-space-1, 4px));'}
  ${({ align }) => (align === 'right' ? 'right: 0;' : 'left: 0;')}
  min-width: 200px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  background: var(--ai-chat-color-bg-default, #ffffff);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.16));
  border-radius: var(--ai-chat-radius-md, 8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid
    var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.16));
`;

export const ClearButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-family: var(--ai-chat-font-family, 'Avantt', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: 20px;
  letter-spacing: 0;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--ai-chat-color-fg-disabled, rgba(0, 0, 0, 0.36));
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const CloseDropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-3, 12px);
  height: 36px;
  border-bottom: 1px solid
    var(--ai-chat-color-bd-tertiary, rgba(20, 20, 20, 0.08));
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0;
  border: none;
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  outline: none;
  line-height: var(--ai-chat-line-height-normal, 1.5);

  &::placeholder {
    color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  }
`;

export const OptionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: var(--ai-chat-space-1, 4px);
  gap: var(--ai-chat-space-1, 4px);
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: var(--ai-chat-radius-sm, 4px);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
`;

export const OptionItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ai-chat-space-2, 8px);
  padding: 0 var(--ai-chat-space-2, 8px);
  height: var(--ai-chat-sizing-lg, 32px);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
  font-weight: ${({ isSelected }) =>
    isSelected
      ? 'var(--ai-chat-font-weight-semibold, 600)'
      : 'var(--ai-chat-font-weight-regular, 400)'};
  color: var(--ai-chat-color-text-primary, #141414);
  cursor: pointer;
  background: transparent;

  &:hover {
    background: var(--ai-chat-color-bg-default-subtle, #fafafa);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ai-chat-space-3, 12px);
`;

export const NoResults = styled.div`
  padding: var(--ai-chat-space-3, 12px);
  text-align: center;
  color: var(--ai-chat-color-fg-disabled, rgba(20, 20, 20, 0.36));
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-md, 14px);
`;

export const ChevronIcon = styled.span<{ isOpen: boolean }>`
  display: inline-flex;
  transition: transform 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  color: var(--ai-chat-color-text-primary, #141414);
`;
