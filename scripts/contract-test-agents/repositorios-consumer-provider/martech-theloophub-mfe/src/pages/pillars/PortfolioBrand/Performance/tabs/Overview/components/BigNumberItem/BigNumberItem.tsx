import { useIntl } from 'react-intl';

import { BigNumber, BigNumberData } from 'components/deprecated';
import { StyledTooltip } from 'shared/Styles';

export const BigNumberItem: React.FC<{
  item: BigNumberData;
  dataTestId?: string;
}> = ({ item, dataTestId }) => {
  const { formatMessage } = useIntl();

  return (
    <BigNumber
      dataTestId={dataTestId ? `${dataTestId}-big-number-item` : undefined}
      data={{
        ...item,
        tooltipContent: [
          {
            iconType: 'none',
            content: [
              <StyledTooltip
                data-testid={
                  dataTestId
                    ? `big-number-item-tooltip-${dataTestId}`
                    : undefined
                }
                size="small"
                key={item.title}
              >
                {formatMessage({
                  id: `PortfolioBrand.PortfolioPerformance.TotalCountryResults.Kpi.tooltip.${item.title}`,
                  defaultMessage: '',
                })}
              </StyledTooltip>,
            ],
          },
        ],
      }}
    />
  );
};
