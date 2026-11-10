import styled from '@emotion/styled';
import { theme } from 'theme';

interface StyledTierGridProps {
  columns: number;
}

export const StyledBreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const StyledHeaderRow = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledToggleText = styled.span`
  font: ${theme.fonts.body.large};
  color: ${theme.colors.txt.default};
`;

export const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;

  font: 600 32px ${theme.fonts.heading};
  color: ${theme.colors.txt.default};
`;

export const StyledHeaderTitleMetric = styled.span`
  color: ${theme.colors.txt.secondary};
  font: ${theme.fonts.body.medium};
  font-size: 18px;
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
