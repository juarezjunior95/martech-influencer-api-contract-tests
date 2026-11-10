import styled from '@emotion/styled';

export const StyledPanelContainer = styled.div<{ $scrollActive: boolean }>`
  overflow-x: hidden;
  white-space: nowrap;
  ${({ $scrollActive }) => $scrollActive && 'margin-right: 24px;'}
`;

export const StyledPanelRadios = styled.div`
  display: flex;
  padding: 32px 0 32px 24px;
`;

export const StyledLegendRow = styled.div<{ $scrollActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  margin-right: ${({ $scrollActive }) => ($scrollActive ? '-32px' : '-16px')};
`;

export const StyledPanelNoDataYet = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 40vh;
`;
