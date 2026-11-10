import { useIntl } from 'react-intl';

import { DataStateHandler } from 'components';
import { BigNumber, BigNumberData } from 'components/deprecated';

import { StyledBigNumbers } from './BigNumbers.styles';

export interface PowerBigNumbers {
  powerVsLq: BigNumberData;
  powerVsLy: BigNumberData;
}

export interface BigNumbersProps {
  loading: boolean;
  error: Error | null;
  powerVsLq: BigNumberData;
  powerVsLy: BigNumberData;
  dataTestId?: string;
}
export const BigNumbers = ({
  loading,
  error,
  powerVsLq,
  powerVsLy,
  dataTestId,
}: BigNumbersProps) => {
  const { formatMessage } = useIntl();

  return (
    <StyledBigNumbers data-testid={dataTestId}>
      <DataStateHandler
        loading={loading}
        error={error}
        empty={powerVsLq?.empty || powerVsLy?.empty}
        skeletonProps={{
          length: 2,
          width: '236px',
          height: '133px',
          borderRadius: 'none',
        }}
      >
        <BigNumber
          data={{
            ...powerVsLq,
            tooltipContent: [
              {
                content: [
                  <span key="1">
                    {formatMessage({
                      id: 'PortfolioBrand.BrandPowerBook.PowerBook.BigNumbers.lq.tooltip',
                    })}
                  </span>,
                ],
              },
            ],
          }}
        />
        <BigNumber
          data={{
            ...powerVsLy,
            tooltipContent: [
              {
                content: [
                  <span key="1">
                    {formatMessage({
                      id: 'PortfolioBrand.BrandPowerBook.PowerBook.BigNumbers.ly.tooltip',
                    })}
                  </span>,
                ],
              },
            ],
          }}
        />
      </DataStateHandler>
    </StyledBigNumbers>
  );
};
