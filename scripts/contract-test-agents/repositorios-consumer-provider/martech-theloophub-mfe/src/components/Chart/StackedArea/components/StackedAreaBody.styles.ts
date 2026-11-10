import styled from '@emotion/styled';

import { AXIS_BORDER_GRID_COLOR } from '../constants';

export const StyledChartWrapper = styled.div`
  width: 100%;
  border-top: 1px solid ${AXIS_BORDER_GRID_COLOR};
  position: relative;
`;

export const StyledLegendWrapper = styled.div`
  position: absolute;
  top: 6px;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;

  & > div {
    max-width: 1100px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 0px 0px 12px;
  }
`;
