import { Heading } from '@hexa-ui/components';
import { BigNumber } from 'components/BigNumber';
import { BigNumberData } from 'components/BigNumber/types';

import { GrowthLeversItemProps } from './interface';
import {
  StyledBigNumberContainer,
  StyledGrowthLeversItem,
  StyledSmallText,
  StyledVariationText,
} from './styles';

export const GrowthLeversItem = ({
  cardTitle,
  type = 'single',
  alignItems = 'default',
  growthLeversNumber,
  variation,
  comparison,
  dataTestId,
}: GrowthLeversItemProps) => {
  if (type === 'single' && cardTitle) {
    return (
      <StyledGrowthLeversItem data-testid={dataTestId}>
        <Heading
          size="H5"
          data-testid={dataTestId ? `${dataTestId}-title` : undefined}
        >
          {cardTitle}
        </Heading>
      </StyledGrowthLeversItem>
    );
  }

  const variationText = `${variation?.value}${variation?.measure}`;
  const comparisonText = `${comparison?.value} ${comparison?.measure}`;

  const bigNumberData: BigNumberData[] = growthLeversNumber
    ? [
        {
          bigNumber: {
            value: growthLeversNumber.value,
            measure: growthLeversNumber.measure,
          },
        },
      ]
    : [];

  return (
    <StyledGrowthLeversItem data-testid={dataTestId} alignItems={alignItems}>
      <StyledSmallText
        size="xsmall"
        data-testid={dataTestId ? `${dataTestId}-title` : undefined}
      >
        {cardTitle}
      </StyledSmallText>
      <StyledBigNumberContainer>
        {growthLeversNumber && (
          <BigNumber
            data={bigNumberData}
            size="xxsmall"
            asCard={false}
            orientation="none"
            enableTruncation
            spacing="cozy"
            style={{ minWidth: 0, height: 'auto' }}
          />
        )}
        {variation && (
          <StyledVariationText
            size="xsmall"
            data-testid={dataTestId ? `${dataTestId}-variation` : undefined}
            css={variation?.color ? { color: variation?.color } : undefined}
          >
            {variationText}
          </StyledVariationText>
        )}
        {comparison && (
          <StyledSmallText
            size="xsmall"
            data-testid={dataTestId ? `${dataTestId}-comparison` : undefined}
          >
            {comparisonText}
          </StyledSmallText>
        )}
      </StyledBigNumberContainer>
    </StyledGrowthLeversItem>
  );
};
