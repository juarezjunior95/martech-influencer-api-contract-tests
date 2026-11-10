import styled from '@emotion/styled';

import { theme } from '../../theme';

export const ToggleTrack = styled.button<{ 'data-state'?: string }>`
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  background: #14141429;
  padding: 0;
  transition: background 0.2s;

  &[data-state='checked'] {
    background: ${theme.colors.txt.positive};
    &:hover {
      background: ${theme.colors.txt.positive};
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &[data-state='checked']::after {
    transform: translateX(18px);
  }
`;
