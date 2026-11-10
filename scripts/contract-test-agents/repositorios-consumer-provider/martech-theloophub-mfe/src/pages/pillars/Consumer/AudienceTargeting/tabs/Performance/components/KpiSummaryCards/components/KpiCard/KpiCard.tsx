import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { BigNumber, ChartHeader, CustomTooltip } from 'components';
import { useMediaQuery } from 'hooks';

import { TooltipContent } from '../../../../../../components';
import { KpiCardProps } from '../../types';
import { getKpiConfig, transformBigNumberData } from '../../utils';
import {
  StyledIndexPillar,
  StyledIndexPillarContainer,
  StyledIndexPillarText,
} from './KpiCard.styles';

export const KpiCard = ({
  data,
  isSelected,
  onSelect,
  period,
}: KpiCardProps) => {
  const kpiConfig = getKpiConfig(data.id);
  const transformedData = useMemo(
    () => transformBigNumberData(data.bigNumberData),
    [data.bigNumberData],
  );
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const bigNumberSize = isDesktopLarge ? 'medium' : 'small';
  const { formatMessage } = useIntl();
  const kpiTitle = formatMessage({
    id: `Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.${data.id}.title`,
  });
  const hasPerformanceIndexValue =
    String(data.performanceIndex.value ?? '').trim() !== '';

  const handleClick = useCallback(() => {
    onSelect(data.id);
  }, [onSelect, data.id]);

  return (
    <BigNumber
      fullWidth
      onClick={handleClick}
      isSelected={isSelected}
      header={
        <ChartHeader
          title={kpiTitle}
          config={{ inline: 'horizontal', type: 'small' }}
          measure={`[${kpiConfig.measure}]`}
          period={period}
          tooltipSize="medium"
          info={
            <TooltipContent
              title={kpiTitle}
              subtitle={formatMessage({
                id: `Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.${data.id}.tooltip.subtitle`,
              })}
              text={formatMessage({
                id: `Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.${data.id}.tooltip.description`,
              })}
              paddingLeft={false}
            />
          }
        />
      }
      data={transformedData}
      size={bigNumberSize}
      asCard
      footer={
        hasPerformanceIndexValue ? (
          <StyledIndexPillarContainer>
            <StyledIndexPillarText>{`${kpiTitle} Index:`}</StyledIndexPillarText>
            <CustomTooltip
              title={formatMessage({
                id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title',
              })}
              text={formatMessage({
                id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text',
              })}
            >
              <StyledIndexPillar variation={data.performanceIndex.variation}>
                {data.performanceIndex.value}
              </StyledIndexPillar>
            </CustomTooltip>
          </StyledIndexPillarContainer>
        ) : null
      }
    />
  );
};
