import { BigNumberData } from 'components/deprecated';
import { formatNumber } from 'utils/format';

import {
  StyledBigNumberLine,
  StyledBigNumberText,
} from '../../BigNumber.styles';

export const BigNumberTotalSection = ({ data }: { data: BigNumberData }) => {
  if (
    data.total === undefined &&
    !data.totalPrefix &&
    !data.totalMeasure &&
    !data.totalLabel &&
    !data.totalUnitOfMeasureLabel
  )
    return null;
  return (
    <StyledBigNumberLine>
      {(data.totalPrefix || data.total !== undefined) && (
        <StyledBigNumberText size="medium" color="gray" weight="bold">
          {data.totalPrefix && `${data.totalPrefix} `}
          {data.total !== undefined && formatNumber(data.total)}{' '}
        </StyledBigNumberText>
      )}

      <StyledBigNumberText size="small" color="gray">
        {data.totalMeasure} {data.totalLabel}
        {data.totalUnitOfMeasureLabel}
      </StyledBigNumberText>
    </StyledBigNumberLine>
  );
};
