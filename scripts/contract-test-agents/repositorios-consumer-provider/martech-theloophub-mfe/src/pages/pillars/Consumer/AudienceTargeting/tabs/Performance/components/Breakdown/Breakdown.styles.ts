import styled from '@emotion/styled';
import { theme } from 'theme';

interface StyledTierGridProps {
  columns: number;
}

export const StyledToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledToggleText = styled.span`
  font: ${theme.fonts.body.large};
  color: ${theme.colors.txt.default};
`;

export const StyledTierGrid = styled.div<StyledTierGridProps>`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
