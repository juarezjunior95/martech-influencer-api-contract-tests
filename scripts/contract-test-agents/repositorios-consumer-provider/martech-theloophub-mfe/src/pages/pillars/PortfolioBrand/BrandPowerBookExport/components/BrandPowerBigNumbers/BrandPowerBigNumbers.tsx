import { BigNumber, ChartHeader, DataStateHandler } from 'components';
import { BigNumbersKpiData } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/types';

interface BigNumbersProps {
  loading: boolean;
  error: Error | null;
  empty?: boolean;
  powerVsLq?: BigNumbersKpiData;
  powerVsLy?: BigNumbersKpiData;
  dataTestId?: string;
}

export const BrandPowerBigNumbers = ({
  loading,
  error,
  empty = false,
  powerVsLq,
  powerVsLy,
  dataTestId,
}: BigNumbersProps) => {
  return (
    <div style={{ display: 'flex', gap: '16px' }} data-testid={dataTestId}>
      <DataStateHandler
        loading={loading}
        error={error}
        skeletonProps={{ height: '136px', width: '100%', length: 2 }}
        empty={empty}
      >
        <BigNumber
          data={powerVsLy?.data || []}
          header={
            <ChartHeader
              title={powerVsLy?.header?.title}
              config={{ inline: 'vertical', type: 'small' }}
            />
          }
          asCard
          fullWidth
        />
        <BigNumber
          data={powerVsLq?.data || []}
          header={
            <ChartHeader
              title={powerVsLq?.header?.title}
              config={{ inline: 'vertical', type: 'small' }}
            />
          }
          asCard
          fullWidth
        />
      </DataStateHandler>
    </div>
  );
};
