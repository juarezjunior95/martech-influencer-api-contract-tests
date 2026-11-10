import {
  StyledComparison,
  StyledComparisonNumber,
} from 'components/BigNumber/BigNumber.styles';
import { BigNumberData, BigNumberSize } from 'components/BigNumber/types';

import { StyledBigNumberComparisonContainer } from '../BigNumberContent/BigNumberContent.styles';

interface BigNumberComparisonProps {
  item: BigNumberData;
  size?: BigNumberSize;
  dataTestId?: string;
  preserveSpace?: boolean;
}

export const BigNumberComparison = ({
  item,
  size,
  dataTestId,
  preserveSpace = false,
}: BigNumberComparisonProps) => {
  const hasComparison = !!item.comparison?.value;

  if (!preserveSpace && !hasComparison) return null;

  return (
    <StyledBigNumberComparisonContainer
      data-testid={dataTestId}
      preserveSpace={preserveSpace && !hasComparison}
    >
      {hasComparison && (
        <>
          {item.comparison.number?.value ? (
            <StyledComparisonNumber
              size={size}
              style={{
                color: item.comparison.number.color || '#141414',
              }}
            >
              {item.comparison.number.value}
              {item.comparison.number.measure}
            </StyledComparisonNumber>
          ) : (
            <StyledComparison size={size} style={{ fontWeight: '400' }}>
              {item.comparison.label}
            </StyledComparison>
          )}
          <StyledComparison size={size} style={{ fontWeight: '500' }}>
            {item.comparison.number?.value && (
              <StyledComparison size={size} style={{ fontWeight: '400' }}>
                {item.comparison.label}
              </StyledComparison>
            )}{' '}
            {item.comparison.value}
          </StyledComparison>
        </>
      )}
    </StyledBigNumberComparisonContainer>
  );
};
