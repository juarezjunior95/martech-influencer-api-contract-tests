import { useIntl } from 'react-intl';

import { BigNumber } from 'components';

import { BigNumbersItem } from '../../types';
import {
  StyledPortfolioHealthBigNumberItem,
  StyledPortfolioHealthBigNumbersContainer,
} from './PortfolioHealthBigNumbers.styles';
import {
  BIG_NUMBER_LABELS,
  BORDER_COLORS,
  enrichDataItemWithLabelAndColor,
} from './PortfolioHealthBigNumbers.utils';

interface PortfolioHealthBigNumbersProps {
  data: BigNumbersItem[];
  dataTestId?: string;
}

export const PortfolioHealthBigNumbers: React.FC<
  PortfolioHealthBigNumbersProps
> = ({ data, dataTestId }) => {
  const { formatMessage } = useIntl();

  const getLabel = (index: number) => {
    const labelKey = BIG_NUMBER_LABELS[index];
    return formatMessage({
      id: `Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.${labelKey}.label`,
    });
  };

  return (
    <StyledPortfolioHealthBigNumbersContainer
      data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      className="big-numbers-container"
    >
      {data.map((item, index) => {
        const label = getLabel(index);
        const borderColor = BORDER_COLORS[index];
        const itemKey = BIG_NUMBER_LABELS[index] ?? `item-${index}`;

        const dataWithLabelAndColor = item.data.map((dataItem) =>
          enrichDataItemWithLabelAndColor(dataItem, label),
        );

        return (
          <StyledPortfolioHealthBigNumberItem
            key={itemKey}
            className="big-number-item"
            data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
            style={{
              borderLeft: borderColor ? `6px solid ${borderColor}` : 'none',
            }}
          >
            <BigNumber
              data={dataWithLabelAndColor}
              asCard={false}
              alignment="left"
              size="medium"
              orientation="center"
              fullWidth
              preserveComparisonSpace
              dataTestId={
                dataTestId ? `${dataTestId}-big-number-${index}` : undefined
              }
            />
          </StyledPortfolioHealthBigNumberItem>
        );
      })}
    </StyledPortfolioHealthBigNumbersContainer>
  );
};
