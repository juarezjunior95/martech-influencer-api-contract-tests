import styled from '@emotion/styled';

import { CAPTION_COLUMN_WIDTH_PX } from '../../constants';

export const StyledChartContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 124px;

  & > .caption-with-flag {
    width: ${CAPTION_COLUMN_WIDTH_PX}px;
    min-width: ${CAPTION_COLUMN_WIDTH_PX}px;
    flex-shrink: 0;
    justify-content: center;
  }
`;

export const StyledChartInner = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

export const StyledInteractiveWrapper = styled.div<{ $clickable?: boolean }>`
  position: relative;
  box-sizing: border-box;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  outline: none;
  min-width: 0;
  transition: padding 0.4s ease;
  margin: 0 24px;
  border-radius: 6px;

  &:hover {
    background-color: #fefbf1;
    box-shadow: 0px 0px 4px 0px rgba(85, 73, 52, 0.24);
    padding: 0 16px 0 24px;
  }
`;
