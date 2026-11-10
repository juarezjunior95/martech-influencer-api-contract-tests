import { type FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { DataLabelContext } from 'components/Chart/Bar/Bar/types';
import { SimpleBarChart } from 'components/Chart/Bar/SimpleBarChart/SimpleBarChart';
import { ComparisonLine } from 'components/ComparisonLine/ComparisonLine';
import { CustomTooltip } from 'components/CustomTooltip';
import { StyledTooltipInfoIcon } from 'components/Shared/TooltipInfoIcon';

import {
  CHART_CONFIG,
  CHART_CONFIG_PLUGINS,
  COMPARISON_BORDER_CONFIG,
  COMPARISON_INNER_BORDER_CONFIG,
  COMPARISON_ROW_CONFIG,
  NULL_TIER_AUDIENCES,
  TIER_CARD_INDEXES_GAP,
  TIER_CARD_TOOLTIP_ICON_SIZE,
  TIER_CARD_YOY_GAP,
} from '../../constants';
import { TierCardProps } from '../../types';
import {
  StyledChartWrapper,
  StyledMetricsSection,
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

export const TierCard: FC<TierCardProps> = ({
  tier,
  showHalo,
  dataTestId,
  tooltipInfo,
}) => {
  const { tier_name } = tier;
  const { formatMessage } = useIntl();
  const gridColumns = showHalo ? 3 : 2;

  const audiences = useMemo(
    () => tier.audiences ?? NULL_TIER_AUDIENCES,
    [tier.audiences],
  );

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

  const { chartData, naIndexes, missingDataBarColor } = useMemo(
    () => buildChartData({ ...tier, audiences }, showHalo),
    [tier, audiences, showHalo],
  );
  const suggestedMax = useMemo(
    () => getSuggestedMax(chartData.values as (number | null)[]),
    [chartData.values],
  );

  const dataLabelsFormatter = useMemo(
    () => (value: number | null, context: DataLabelContext) => {
      if (naIndexes.includes(context.dataIndex) || value == null) return 'N/A';
      return value.toFixed(1);
    },
    [naIndexes],
  );

  const chartPluginsOptions = useMemo(
    () => ({
      ...CHART_CONFIG_PLUGINS,
      ...(naIndexes.length > 0 && {
        missingDataBar: { naIndexes, color: missingDataBarColor },
      }),
    }),
    [naIndexes, missingDataBarColor],
  );

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
            <StyledTooltipInfoIcon iconSize={TIER_CARD_TOOLTIP_ICON_SIZE}>
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
          pluginsOptions={chartPluginsOptions}
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
          gap={TIER_CARD_YOY_GAP}
        />
        <ComparisonLine
          {...sharedComparisonConfig}
          dataTestId={dataTestId ? `${dataTestId}-indexes` : undefined}
          data={buildIndexData(audiences, showHalo, formatMessage)}
          gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
          gap={TIER_CARD_INDEXES_GAP}
        />
      </StyledMetricsSection>
    </StyledTierCard>
  );
};
