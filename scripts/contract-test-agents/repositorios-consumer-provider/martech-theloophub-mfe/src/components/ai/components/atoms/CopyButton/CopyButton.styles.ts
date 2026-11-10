import styled from '@emotion/styled';

import { Button } from '../Button';

export const StyledCopyButton = styled(Button)<{ $copied: boolean }>`
  color: ${({ $copied }) =>
    $copied ? '#50A5E2' : 'var(--ai-chat-color-fg-secondary, #5c5c5c)'};
  font-weight: var(--ai-chat-font-weight-regular, 400);

  &:hover:not(:disabled) {
    color: ${({ $copied }) =>
      $copied ? '#50A5E2' : 'var(--ai-chat-color-fg-default, #0a0a0a)'};
    background: transparent;
  }
  ${({ $copied }) => $copied && `cursor: default;`}
`;
