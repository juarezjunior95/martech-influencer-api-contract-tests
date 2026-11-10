import styled from '@emotion/styled';

import { TABLE_COLORS } from './colors';

export const FONT_FAMILY = {
  heading: "'Barlow', sans-serif",
  paragraph: "'Work Sans', sans-serif",
};

export interface AlignProps {
  align?: 'left' | 'center' | 'right';
}

interface SortButtonProps {
  direction?: 'asc' | 'desc' | 'none';
}

export const StyledSortButton = styled.button<SortButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${TABLE_COLORS.background.transparent};
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${TABLE_COLORS.text.primary};

  &:focus {
    outline: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const StyledInfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: ${TABLE_COLORS.text.muted};

  &:hover {
    color: ${TABLE_COLORS.text.primary};
  }
`;
