import styled from '@emotion/styled';
import { theme } from 'theme';

export const StyledIndexPillarContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  font: ${theme.fonts.body.medium};
  justify-content: center;
  align-items: center;
  margin: 12px 0 0 0;
  cursor: pointer;
`;
export const StyledIndexPillarText = styled.span`
  color: #5c5c5c;
`;

export const StyledIndexPillar = styled.div<{
  variation: 'up' | 'down' | 'neutral';
}>`
  padding: 4px 12px;
  border-radius: 4px;
  background-color: ${({ variation }) => {
    if (variation === 'up') return '#E6F9E6';
    if (variation === 'down') return '#FFE6E6';
    return '#F2F2F2';
  }};
  color: ${({ variation }) => {
    if (variation === 'up') return '#007800';
    if (variation === 'down') return '#BA0B0B';
    return '#3D3D3D';
  }};
`;
