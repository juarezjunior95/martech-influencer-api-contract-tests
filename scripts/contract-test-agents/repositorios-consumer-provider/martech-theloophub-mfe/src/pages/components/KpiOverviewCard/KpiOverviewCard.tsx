import {
  Bar,
  BigNumber,
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  NoDataYet,
} from 'components';
import { getConnectorData } from 'components/Chart/utils';
import { useMediaQuery } from 'hooks';
import { getBigNumberSize } from 'utils/getBigNumberSize';

import { DEFAULT_CHART_COLORS } from './constants';
import {
  StyledChartContainer,
  StyledKpiOverviewCardContent,
  StyledNoticeBodyBlock,
  StyledNoticeDivider,
  StyledNoticeHeaderBlock,
  StyledNoticeMessageContainer,
} from './KpiOverviewCard.styles';
import type { KpiOverviewCardProps } from './types';
import {
  getBarChartDatasetsWithColors,
  getKpiOverviewBarChartOptions,
} from './utils';

type KpiChartHeaderConfig = {
  inline: 'horizontal';
  type: 'large' | 'small';
  alignment: 'left';
};

const getKpiChartHeaderConfig = (
  isDesktopLarge: boolean,
): KpiChartHeaderConfig => ({
  inline: 'horizontal',
  type: isDesktopLarge ? 'large' : 'small',
  alignment: 'left',
});

export const KpiOverviewCard = ({
  data,
  dataTestId,
  tooltip,
  onClick,
  variation,
  chartColors = DEFAULT_CHART_COLORS,
}: KpiOverviewCardProps) => {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');
  const hasCharts = data?.barChart || data?.comparisonLine;

  const barChartOptions = getKpiOverviewBarChartOptions(data?.barChart);

  const chartHeader = (
    <ChartHeader
      title={data?.chartHeader?.title}
      measure={data?.chartHeader?.measure}
      period={data?.chartHeader?.period}
      info={tooltip}
      config={getKpiChartHeaderConfig(isDesktopLarge)}
    />
  );

  if (!data || data?.noticeMessage) {
    return (
      <ChartWrapper dataTestId={dataTestId} onClick={onClick}>
        <StyledKpiOverviewCardContent
          variation={variation}
          css={{ flex: 1, minHeight: 0 }}
        >
          <StyledNoticeMessageContainer>
            <StyledNoticeHeaderBlock>{chartHeader}</StyledNoticeHeaderBlock>
            <StyledNoticeDivider />
            <StyledNoticeBodyBlock>
              <StyledChartContainer hasNoticeMessage variation={variation}>
                <NoDataYet
                  description={data?.noticeMessage}
                  size="auto"
                  illustration="noDataAvailable"
                />
              </StyledChartContainer>
            </StyledNoticeBodyBlock>
          </StyledNoticeMessageContainer>
        </StyledKpiOverviewCardContent>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper dataTestId={dataTestId} onClick={onClick}>
      <StyledKpiOverviewCardContent variation={variation}>
        <BigNumber
          header={chartHeader}
          data={data?.bigNumberData || []}
          size={getBigNumberSize(
            isDesktopXLarge,
            isDesktopLarge,
            variation === 'export',
          )}
          enableTruncation
        />

        {hasCharts && (
          <div style={{ paddingBottom: `16px` }}>
            <StyledChartContainer
              hasNoticeMessage={!!data?.noticeMessage}
              variation={variation}
            >
              {data?.barChart && (
                <Bar
                  size={isDesktopXLarge ? 'small' : 'xsmall'}
                  maxSize="none"
                  alwaysShowDataLabels
                  stripedIndexes={data.barChart.stripedIndexes}
                  highlightLabels={data.barChart.highlightLabels}
                  labels={data.barChart.labels ?? []}
                  datasets={getBarChartDatasetsWithColors(
                    data.barChart,
                    chartColors,
                  )}
                  formattedData={data.barChart.formattedData}
                  connector={getConnectorData(data?.barChart)}
                  axisType="none"
                  showGrid={false}
                  options={barChartOptions}
                />
              )}
            </StyledChartContainer>
            {data?.comparisonLine && (
              <ComparisonLine
                data={data?.comparisonLine.data}
                gridColumnsLength={
                  data?.barChart?.labels?.length ||
                  data?.comparisonLine.data?.[0]?.data?.length
                }
                gridConfig={{ paddingLeft: 8, paddingRight: 8 }}
                borderConfig={{ marginLeft: 8, marginRight: 8 }}
              />
            )}
          </div>
        )}
      </StyledKpiOverviewCardContent>
    </ChartWrapper>
  );
};
