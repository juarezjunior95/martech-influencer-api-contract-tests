import { BigNumber, ChartHeader, NoDataYet } from 'components';
import { Bar, Line } from 'components/Chart';
import { ComparisonLine } from 'components/ComparisonLine';
import { StyledMultiChartContainer } from 'shared/Styles';
import { buildDataTestId } from 'utils';

import { BeesDistributionKpiData } from '../../types';
import * as S from './ChartItem.styles';

interface Props {
  dataTestId?: string;
  kpi?: BeesDistributionKpiData;
}

export const ChartItem = ({ kpi, dataTestId }: Props) => {
  const hasBarData = kpi?.barChart?.datasets?.[0]?.data?.length > 0;
  const hasLineData = kpi?.lineChart?.datasets?.[0]?.data?.length > 0;

  return (
    <S.StyledChartItemWrapper
      data-testid={buildDataTestId('chart-item', dataTestId)}
    >
      <S.StyledBeesDistributionCharContainer
        data-testid={buildDataTestId('chart-item-container', dataTestId)}
        isEmpty={!hasBarData && !hasLineData}
      >
        {kpi?.bigNumberData?.length > 0 && (
          <BigNumber
            dataTestId={buildDataTestId('', dataTestId, 'chart-item')}
            header={
              <ChartHeader
                dataTestId={buildDataTestId(
                  '',
                  dataTestId,
                  'chart-item-header',
                )}
                title={kpi?.header?.title}
                measure={kpi?.header?.measure}
                config={{
                  inline: 'horizontal',
                  type: 'large',
                }}
              />
            }
            data={kpi?.bigNumberData}
            asCard={false}
            size="medium"
          />
        )}

        <S.StyledDivider
          data-testid={buildDataTestId('chart-item-divider', dataTestId)}
        />

        <StyledMultiChartContainer type={2}>
          <S.StyledBeesDistributionChartContainer>
            {hasBarData ? (
              <>
                <Bar
                  dataTestId={buildDataTestId('', dataTestId, 'chart-item-bar')}
                  datasets={kpi?.barChart?.datasets}
                  labels={kpi?.barChart?.labels}
                  formattedData={kpi?.barChart?.formattedData}
                  options={{
                    layout: {
                      padding: {
                        top: 40,
                      },
                    },
                    scales: {
                      y: {
                        afterFit: (axis) => {
                          axis.width = 45;
                        },
                      },
                    },
                  }}
                  showDivider
                />
                <ComparisonLine
                  dataTestId={buildDataTestId(
                    '',
                    dataTestId,
                    'chart-item-comparison-line',
                  )}
                  data={kpi?.barChart?.comparisonLine?.data}
                  gridColumnsLength={kpi?.barChart?.datasets?.[0]?.data?.length}
                  gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
                  borderConfig={{ marginLeft: 40, marginRight: 5 }}
                />
              </>
            ) : (
              <S.StyledNoDataContainer
                data-testid={buildDataTestId('chart-item-no-data', dataTestId)}
                withBorder
              >
                <NoDataYet
                  dataTestId={buildDataTestId('', dataTestId, 'chart-item')}
                />
              </S.StyledNoDataContainer>
            )}
          </S.StyledBeesDistributionChartContainer>

          <S.StyledBeesDistributionChartContainer>
            {hasLineData ? (
              <>
                <Line
                  dataTestId={buildDataTestId(
                    '',
                    dataTestId,
                    'chart-item-line',
                  )}
                  datasets={kpi?.lineChart?.datasets}
                  labels={kpi?.lineChart?.labels}
                  formattedData={kpi?.lineChart?.formattedData}
                  options={{
                    layout: {
                      padding: {
                        top: 40,
                      },
                    },
                    scales: {
                      y: {
                        suggestedMin: kpi?.lineChart?.suggestedMin,
                        suggestedMax: kpi?.lineChart?.suggestedMax,
                        beginAtZero: false,
                        ticks: {
                          maxTicksLimit: 7,
                        },
                        afterFit: (axis) => {
                          axis.width = 45;
                        },
                      },
                    },
                  }}
                  showCustomGrid
                />
                <ComparisonLine
                  dataTestId={buildDataTestId(
                    '',
                    dataTestId,
                    'chart-item-comparison-line',
                  )}
                  data={kpi?.lineChart?.comparisonLine?.data}
                  gridColumnsLength={
                    kpi?.lineChart?.datasets?.[0]?.data?.length
                  }
                  gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
                  borderConfig={{ marginLeft: 40, marginRight: 16 }}
                />
              </>
            ) : (
              <S.StyledNoDataContainer
                data-testid={buildDataTestId('chart-item-no-data', dataTestId)}
              >
                <NoDataYet
                  dataTestId={buildDataTestId('', dataTestId, 'chart-item')}
                />
              </S.StyledNoDataContainer>
            )}
          </S.StyledBeesDistributionChartContainer>
        </StyledMultiChartContainer>
      </S.StyledBeesDistributionCharContainer>
    </S.StyledChartItemWrapper>
  );
};
