import { BigNumberOptionalData } from 'components/deprecated';
import {
  StyledBigNumberLine,
  StyledBigNumberText,
} from 'components/deprecated/BigNumber/BigNumber.styles';

export const BigNumberPeriodSection = ({
  period,
}: Pick<BigNumberOptionalData, 'period'>) => {
  if (!period) return null;
  return (
    <StyledBigNumberLine>
      <StyledBigNumberText size="small">Period:</StyledBigNumberText>
      <StyledBigNumberText size="small" weight="bold">
        {period}
      </StyledBigNumberText>
    </StyledBigNumberLine>
  );
};
