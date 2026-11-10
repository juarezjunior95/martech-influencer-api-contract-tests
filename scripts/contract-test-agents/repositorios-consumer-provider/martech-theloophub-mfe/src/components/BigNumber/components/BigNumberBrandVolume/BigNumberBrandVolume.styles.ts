import styled from '@emotion/styled';

const BRAND_VOLUME_VALUE_FONT_SIZE_PX = 40;

const BRAND_VOLUME_LABEL_FONT_SIZE_PX = 14;
const BRAND_VOLUME_LABEL_COLOR = '#5c5c5c';

export const StyledDivider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #e5e7eb;
  min-height: 60px;
  align-self: stretch;
`;

export const StyledBrandVolumeTooltipFit = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  & .tooltip-trigger {
    height: auto !important;
    min-height: 0;
  }
`;

export const StyledBrandVolumeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

export const StyledBrandVolumeValue = styled.div`
  font-size: ${BRAND_VOLUME_VALUE_FONT_SIZE_PX}px;
  font-weight: 600;
  line-height: 1;
  font-family: 'Inter', sans-serif;
  color: #141414;
`;

export const StyledBrandVolumeLabel = styled.div`
  font-size: ${BRAND_VOLUME_LABEL_FONT_SIZE_PX}px;
  font-weight: 400;
  line-height: 1.2;
  margin-top: 0;
  color: ${BRAND_VOLUME_LABEL_COLOR};
  font-family: 'Inter', sans-serif;
  text-align: center;
  max-width: 120px;
`;

export const StyledBrandVolumeEmptyState = styled.div`
  font-size: ${BRAND_VOLUME_LABEL_FONT_SIZE_PX}px;
  font-weight: 400;
  line-height: 1.2;
  color: ${BRAND_VOLUME_LABEL_COLOR};
  font-family: 'Inter', sans-serif;
  text-align: center;
  max-width: 140px;
`;
