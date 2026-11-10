import styled from '@emotion/styled';

import { CAPTION_COLUMN_WIDTH_PX } from '../../constants';

export const StyledSkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 24px 20px 24px;
`;

export const StyledSkeletonContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-height: 124px;
`;

export const StyledSkeletonLabelCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: ${CAPTION_COLUMN_WIDTH_PX}px;
  min-width: ${CAPTION_COLUMN_WIDTH_PX}px;
  flex-shrink: 0;
`;

export const StyledSkeletonBarsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;
