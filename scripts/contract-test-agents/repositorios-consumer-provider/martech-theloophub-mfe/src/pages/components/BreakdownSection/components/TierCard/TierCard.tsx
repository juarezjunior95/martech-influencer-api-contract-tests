import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { DataLabelContext } from 'components/Chart/Bar/Bar/types';
import { SimpleBarChart } from 'components/Chart/Bar/SimpleBarChart/SimpleBarChart';
import { ComparisonLine } from 'components/ComparisonLine/ComparisonLine';
import { CustomTooltip } from 'components/CustomTooltip';
import { NoDataYet } from 'components/NoDataYet';
import { StyledTooltipInfoIcon } from 'components/Shared/TooltipInfoIcon';

import {
  CHART_CONFIG,
  CHART_CONFIG_PLUGINS,
  COMPARISON_BORDER_CONFIG,
  COMPARISON_INNER_BORDER_CONFIG,
  COMPARISON_ROW_CONFIG,
  DATA_NOT_AVAILABLE,
} from '../../constants';
import { TierCardProps } from '../../types';
import {
  StyledChartWrapper,
  StyledMetricsSection,
  StyledNoDataContainer,
  StyledTierCard,
  StyledTierHeader,
  StyledTierName,
} from './TierCard.styles';
import {
  buildChartData,
  buildIndexData,
  buildYoYData,
  getSuggestedMax,
} from './utils';

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  showHalo,
  dataTestId,
  tooltipInfo,
}) => {
  const { tier_name, audiences } = tier;
  const gridColumns = showHalo ? 3 : 2;
  const { formatMessage } = useIntl();

  const sharedComparisonConfig = useMemo(
    () => ({
      size: 'small' as const,
      gridColumnsLength: gridColumns,
      borderConfig: COMPARISON_BORDER_CONFIG,
      rowConfig: COMPARISON_ROW_CONFIG,
      innerBorderConfig: COMPARISON_INNER_BORDER_CONFIG,
    }),
    [gridColumns],
  );

  const { chartData, naIndexes } = useMemo(
    () => buildChartData(tier, showHalo),
    [tier, showHalo],
  );
  const suggestedMax = useMemo(
    () => getSuggestedMax(chartData.values as number[]),
    [chartData.values],
  );

  const dataLabelsFormatter = useMemo(() => {
    if (!naIndexes?.length) return undefined;
    return (value: number, context: DataLabelContext) =>
      naIndexes.includes(context.dataIndex) ? 'N/A' : value;
  }, [naIndexes]);

  if (!audiences) {
    return (
      <StyledTierCard data-testid={dataTestId}>
        <StyledNoDataContainer
          data-testid={dataTestId ? `${dataTestId}-no-data` : undefined}
        >
          <NoDataYet description={DATA_NOT_AVAILABLE} />
        </StyledNoDataContainer>
      </StyledTierCard>
    );
  }

  return (
    <StyledTierCard data-testid={dataTestId}>
      <StyledTierHeader>
        <StyledTierName>{tier_name}</StyledTierName>
        {tooltipInfo && (
          <CustomTooltip
            title={tooltipInfo.title}
            subtitle={tooltipInfo.subtitle}
            text={tooltipInfo.text}
          >
            <StyledTooltipInfoIcon iconSize={22}>
              <Icon icon={Info} size="small" />
            </StyledTooltipInfoIcon>
          </CustomTooltip>
        )}
      </StyledTierHeader>
      <StyledChartWrapper
        data-testid={dataTestId ? `${dataTestId}-chart` : undefined}
      >
        <SimpleBarChart
          data={chartData}
          dataLabelsFormatter={dataLabelsFormatter}
          layoutPadding={CHART_CONFIG.padding}
          barTickness={
            showHalo
              ? CHART_CONFIG.barThicknessHaloOn
              : CHART_CONFIG.barThicknessHaloOff
          }
          pluginsOptions={CHART_CONFIG_PLUGINS}
          yStepSize={CHART_CONFIG.yStepSize}
          suggestedMax={suggestedMax}
          dataTestId={dataTestId ? `${dataTestId}-bar-chart` : undefined}
        />
      </StyledChartWrapper>

      <StyledMetricsSection>
        <ComparisonLine
          {...sharedComparisonConfig}
          dataTestId={dataTestId ? `${dataTestId}-yoy` : undefined}
          data={buildYoYData(audiences, showHalo)}
          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
          gap={22}
        />
        <ComparisonLine
          {...sharedComparisonConfig}
          dataTestId={dataTestId ? `${dataTestId}-indexes` : undefined}
          data={buildIndexData(audiences, showHalo, formatMessage)}
          gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
          gap={24}
        />
      </StyledMetricsSection>
    </StyledTierCard>
  );
};
