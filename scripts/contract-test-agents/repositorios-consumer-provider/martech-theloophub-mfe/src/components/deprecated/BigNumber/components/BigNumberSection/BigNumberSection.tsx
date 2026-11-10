import { BigNumberData } from 'components/deprecated';
import { formatNumber } from 'utils/format';
import { getVariationColor } from 'utils/getColor';

import {
  StyledBigNumberDivider,
  StyledBigNumberLine,
  StyledBigNumberText,
  StyledBigNumberTitle,
  StyledBigNumberVariationContainer,
} from '../../BigNumber.styles';

export const BigNumberSection = ({
  data,
  borderTop,
}: {
  data: BigNumberData;
  borderTop?: boolean;
}) => {
  const bigNumberColor = getVariationColor(data.bigNumberDirection);
  return (
    <StyledBigNumberLine borderTop={borderTop}>
      {data.bigNumber !== null && data.bigNumber !== undefined && (
        <StyledBigNumberTitle size="H2" style={{ color: bigNumberColor }}>
          {formatNumber(data.bigNumber)}
          {data.bigNumberUnit}
        </StyledBigNumberTitle>
      )}
      {(data.variation !== undefined || data.divider) && (
        <StyledBigNumberDivider orientation="vertical" />
      )}
      <StyledBigNumberVariationContainer>
        <StyledBigNumberText
          style={{ color: bigNumberColor }}
          weight="bold"
          data-testid="big-number-variation"
        >
          {data.variation !== undefined && formatNumber(data.variation)}
          {data.variationMeasure}
        </StyledBigNumberText>
        <StyledBigNumberText size="small" color="gray" weight="medium">
          {data.versus}
        </StyledBigNumberText>
      </StyledBigNumberVariationContainer>
    </StyledBigNumberLine>
  );
};
