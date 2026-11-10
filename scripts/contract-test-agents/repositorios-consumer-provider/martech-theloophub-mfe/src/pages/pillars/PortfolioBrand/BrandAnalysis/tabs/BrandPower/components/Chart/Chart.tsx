import { Skeleton } from 'components';
import { Bar } from 'components/deprecated';
import NoDataYet from 'components/NoDataYet/NoDataYet';
import { ChartWithCaption } from 'pages/components';
import { ChartData } from 'pages/components/ChartWithCaption/types';

import {
  StyledNoDataContainer,
  StyledQuarterChartsContainer,
  StyledYearChartContainer,
} from './Chart.styles';

interface ChartProps {
  loading: boolean;
  chartList: ChartData[];
  dataTestId?: string;
}

export const Chart = ({ loading, chartList, dataTestId }: ChartProps) => {
  if (loading)
    return (
      <Skeleton width="100%" height="330px" length={1} borderRadius="none" />
    );

  const firstChart = chartList?.[0] as
    (ChartData & { empty?: boolean; '#empty'?: boolean }) | undefined;
  const hasInvalidChartData = chartList.some(
    (chartData) => !chartData || !Array.isArray(chartData.datasets),
  );

  if (
    chartList.length === 0 ||
    hasInvalidChartData ||
    firstChart?.empty ||
    firstChart?.['#empty']
  )
    return (
      <StyledNoDataContainer>
        <NoDataYet />
      </StyledNoDataContainer>
    );

  const charts = chartList.map((chartData) => (
    <ChartWithCaption
      key={`${chartData.type}-${chartData.labels?.join('|') ?? ''}`}
      chartComponent={Bar}
      chartData={chartData}
      height="240px"
      barThickness="flex"
    />
  ));

  if (chartList.length > 1) {
    return (
      <StyledQuarterChartsContainer data-testid={dataTestId}>
        {charts}
      </StyledQuarterChartsContainer>
    );
  }

  return (
    <StyledYearChartContainer data-testid={dataTestId}>
      {charts}
    </StyledYearChartContainer>
  );
};
