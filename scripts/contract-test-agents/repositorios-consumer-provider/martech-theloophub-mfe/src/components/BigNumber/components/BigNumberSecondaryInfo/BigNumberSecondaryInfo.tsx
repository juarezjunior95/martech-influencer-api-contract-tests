import {
  StyledMeasure,
  StyledPeriodLabel,
  StyledPeriodValue,
  StyledSecondaryValue,
} from 'components/BigNumber/BigNumber.styles';
import { BigNumberData, BigNumberSize } from 'components/BigNumber/types';

import {
  StyledBigNumberSecondaryInfoContainer,
  StyledBigNumberSecondaryInfoValue,
} from '../BigNumberContent/BigNumberContent.styles';

interface BigNumberSecondaryInfoProps {
  item: BigNumberData;
  size?: BigNumberSize;
  dataTestId?: string;
}

export const BigNumberSecondaryInfo = ({
  item,
  size,
  dataTestId,
}: BigNumberSecondaryInfoProps) => {
  if (!item.secondaryInfo) return null;

  return (
    <StyledBigNumberSecondaryInfoContainer data-testid={dataTestId}>
      <StyledBigNumberSecondaryInfoValue
        data-testid={dataTestId}
        hasValue={!!item.secondaryInfo.value}
      >
        <StyledSecondaryValue size={size}>
          {item.secondaryInfo.value}
          {item.secondaryInfo.measure}
        </StyledSecondaryValue>
        <StyledMeasure size={size} style={{ color: '#5C5C5C' }}>
          {item.secondaryInfo.label}
        </StyledMeasure>
      </StyledBigNumberSecondaryInfoValue>
      {item.secondaryInfo.period && (
        <div>
          <StyledPeriodLabel>
            {item.secondaryInfo.period.label}:{' '}
          </StyledPeriodLabel>
          <StyledPeriodValue>
            {item.secondaryInfo.period.value}
          </StyledPeriodValue>
        </div>
      )}
    </StyledBigNumberSecondaryInfoContainer>
  );
};
