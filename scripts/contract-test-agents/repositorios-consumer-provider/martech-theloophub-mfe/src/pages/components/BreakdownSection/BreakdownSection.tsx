import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip, Toggle } from 'components';
import { DataStateHandler } from 'components/DataStateHandler';
import { StyledTooltipInfoIcon } from 'components/Shared/TooltipInfoIcon';

import {
  StyledBreakdownContainer,
  StyledHeaderLeft,
  StyledHeaderRow,
  StyledHeaderTitle,
  StyledHeaderTitleMetric,
  StyledTierGrid,
  StyledToggleContainer,
  StyledToggleText,
} from './BreakdownSection.styles';
import { TierCard } from './components/TierCard';
import { BREAKDOWN_CONFIG } from './constants';
import { BreakdownSectionProps } from './types';
import { sortTiers } from './utils';

export const BreakdownSection: React.FC<BreakdownSectionProps> = ({
  variant,
  tiers,
  loading,
  error,
  headerRight,
  dataTestId,
}) => {
  const config = BREAKDOWN_CONFIG[variant];
  const sortedTiers = useMemo(() => sortTiers(tiers), [tiers]);
  const isEmpty = !loading && !error && sortedTiers.length === 0;

  const [showHalo, setShowHalo] = useState<boolean>(false);

  const { formatMessage } = useIntl();

  return (
    <StyledBreakdownContainer data-testid={dataTestId}>
      <StyledHeaderRow>
        <StyledHeaderLeft>
          <StyledHeaderTitle>
            {config.titleKey}
            <StyledHeaderTitleMetric>
              [ {config.metricLabel} ]
            </StyledHeaderTitleMetric>
          </StyledHeaderTitle>
          <CustomTooltip
            title={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.headerTitle.title`,
            })}
            subtitle={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.headerTitle.subtitle`,
            })}
            text={formatMessage({
              id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.headerTitle.text`,
            })}
          >
            <StyledTooltipInfoIcon iconSize={26}>
              <Icon icon={Info} size="small" />
            </StyledTooltipInfoIcon>
          </CustomTooltip>
        </StyledHeaderLeft>
        {headerRight}

        <StyledToggleContainer>
          <Toggle
            checked={showHalo}
            onCheckedChange={setShowHalo}
            ariaLabel="Show Halo Audience"
          />
          <StyledToggleText>
            {formatMessage({
              id: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
            })}
          </StyledToggleText>
        </StyledToggleContainer>
      </StyledHeaderRow>

      <DataStateHandler
        loading={loading}
        error={error}
        empty={isEmpty}
        skeletonProps={{ width: '100%', height: '300px', length: 1 }}
        dataTestId={dataTestId ? `${dataTestId}-state` : undefined}
      >
        <StyledTierGrid
          columns={sortedTiers.length}
          data-testid={dataTestId ? `${dataTestId}-grid` : undefined}
        >
          {sortedTiers.map((tier, index) => (
            <TierCard
              key={`${tier.tier_level}-${tier.tier_name}`}
              tier={tier}
              showHalo={showHalo}
              tooltipInfo={{
                title: formatMessage({
                  id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.${tier.tier_level}.title`,
                }),
                subtitle: formatMessage({
                  id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.${tier.tier_level}.subtitle`,
                }),
                text: formatMessage({
                  id: `Consumer.AudienceTargeting.BreakdownTooltips.${variant}.${tier.tier_level}.text`,
                }),
              }}
              dataTestId={
                dataTestId ? `${dataTestId}-tier-${index}` : undefined
              }
            />
          ))}
        </StyledTierGrid>
      </DataStateHandler>
    </StyledBreakdownContainer>
  );
};
