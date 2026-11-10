import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { Alert, ResponsiveBasicContainer, Toggle } from 'components';
import { DataStateHandler } from 'components/DataStateHandler';

import { TooltipContent } from '../../../../components';
import { useBrandLabel, useCompetitorLabel } from '../../hooks';
import {
  StyledTierGrid,
  StyledToggleContainer,
  StyledToggleText,
} from './Breakdown.styles';
import { TierCard } from './components/TierCard';
import { BREAKDOWN_CONFIG, CARD_BACKGROUND_COLOR } from './constants';
import { BreakdownSectionProps } from './types';
import { sortTiers } from './utils';

export const Breakdown: React.FC<BreakdownSectionProps> = ({
  variant,
  data = [],
  isLoading,
  error,
  dataTestId,
  competitorWithoutData = false,
}) => {
  const config = BREAKDOWN_CONFIG[variant] ?? BREAKDOWN_CONFIG['p4w'];
  const sortedTiers = useMemo(() => sortTiers(data), [data]);
  const isEmpty = !isLoading && !error && sortedTiers.length === 0;

  const [showHalo, setShowHalo] = useState<boolean>(false);

  const { formatMessage } = useIntl();
  const brandLabel = useBrandLabel();
  const competitorLabel = useCompetitorLabel();

  const getDisplayTierName = (
    tierLevel?: string,
    tierName?: string,
  ): string | undefined => {
    const normalizedTierName = tierName?.trim().toLowerCase();
    const isEmptyName = !normalizedTierName;

    if (
      tierLevel === 'brand' &&
      (isEmptyName || normalizedTierName === 'brand')
    ) {
      return brandLabel || tierName;
    }

    if (
      tierLevel === 'competitor' &&
      (isEmptyName || normalizedTierName === 'competitor')
    ) {
      return competitorLabel || tierName;
    }

    return tierName;
  };

  return (
    <ResponsiveBasicContainer
      dataTestId={dataTestId}
      header={{
        title: config.titleKey,
        titleSize: 'H2',
        measure: `[ ${config.metricLabel} ]`,
        tooltip: (
          <TooltipContent
            title={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.headerTitle.title`,
            })}
            subtitle={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.headerTitle.subtitle`,
            })}
            text={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.headerTitle.text`,
            })}
            paddingLeft={false}
          />
        ),
        tooltipSize: 'medium',
        rightContent:
          !isEmpty && !isLoading && !error ? (
            <StyledToggleContainer>
              <Toggle
                checked={showHalo}
                onCheckedChange={setShowHalo}
                ariaLabel={formatMessage({
                  id: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
                })}
              />
              <StyledToggleText>
                {formatMessage({
                  id: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
                })}
              </StyledToggleText>
            </StyledToggleContainer>
          ) : undefined,
      }}
      layout={{
        border: 'small',
        headerPadding: 'large',
        bodyPadding: true,
        background: CARD_BACKGROUND_COLOR,
      }}
    >
      {competitorWithoutData && (
        <Alert
          type="warning"
          emphasis="low"
          message={formatMessage(
            { id: 'Consumer.AudienceTargeting.Empty.competitorWithoutData' },
            { competitor: competitorLabel },
          )}
          dataTestId={
            dataTestId ? `${dataTestId}-competitor-without-data` : undefined
          }
        />
      )}
      <DataStateHandler
        loading={isLoading}
        error={error}
        empty={isEmpty}
        skeletonProps={{ width: '100%', height: '300px', length: 1 }}
        dataTestId={dataTestId ? `${dataTestId}-state` : undefined}
      >
        <StyledTierGrid
          columns={sortedTiers.length}
          data-testid={dataTestId ? `${dataTestId}-grid` : undefined}
        >
          {sortedTiers.map((tier, index) => {
            const displayTier = {
              ...tier,
              tier_name: getDisplayTierName(tier.tier_level, tier.tier_name),
            };

            return (
              <TierCard
                key={
                  tier.tier_level
                    ? `${tier.tier_level}-${tier.tier_name}`
                    : `empty-${index}`
                }
                tier={displayTier}
                showHalo={showHalo}
                tooltipInfo={
                  tier.tier_level
                    ? {
                        title: formatMessage({
                          id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.${tier.tier_level}.title`,
                        }),
                        subtitle: formatMessage({
                          id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.${tier.tier_level}.subtitle`,
                        }),
                        text: formatMessage({
                          id: `Consumer.AudienceTargeting.BreakdownTooltips.${config.i18nKey}.${tier.tier_level}.text`,
                        }),
                      }
                    : undefined
                }
                dataTestId={
                  dataTestId ? `${dataTestId}-tier-${index}` : undefined
                }
              />
            );
          })}
        </StyledTierGrid>
      </DataStateHandler>
    </ResponsiveBasicContainer>
  );
};
