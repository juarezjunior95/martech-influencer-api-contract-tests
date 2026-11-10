import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import NoDataAvailableIcon from 'assets/NoDataAvailable.svg';
import { ResponsiveBasicContainer, Skeleton } from 'components';
import { BigNumber } from 'components/BigNumber';
import { CustomTooltip } from 'components/CustomTooltip/CustomTooltip';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { theme } from 'theme';

import { NoDataAvailable, TooltipContent } from '../../../../components';
import { useAudienceTargetingKpiQuarterTags } from '../../../../hooks';
import {
  StyledAudienceGrid,
  StyledBrandAudienceCardShell,
  StyledCardHeaderInfoIcon,
  StyledCardHeaderSubtitle,
  StyledCardHeaderTitle,
  StyledCardHeaderTitleRow,
} from './BrandAudience.styles';
import { AUDIENCE_TOOLTIP_KEYS } from './constants';
import { BrandAudiencesTargetingCardModel } from './types';
import {
  getHighlightSegmentsFromBrandAudienceCard,
  normalizeDefinitionBrandAudienceCards,
  stripBrandVolumeFromCards,
} from './utils';

interface BrandAudienceProps {
  data?: BrandAudiencesTargetingCardModel[];
  isLoading: boolean;
  setHighlightedSegments: (segments: string[]) => void;
  dataTestId?: string;
  error: Error | null;
}

export const BrandAudience = ({
  data = [],
  isLoading,
  setHighlightedSegments,
  dataTestId,
  error,
}: BrandAudienceProps) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const [bigNumberSelected, setBigNumberSelected] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setBigNumberSelected(null);
    setHighlightedSegments([]);
  }, [data, setHighlightedSegments]);

  const rawCards = useMemo(
    () =>
      stripBrandVolumeFromCards(normalizeDefinitionBrandAudienceCards(data)),
    [data],
  );

  const cards = useMemo(
    () =>
      rawCards.map((card): BrandAudiencesTargetingCardModel => {
        const isHalo = /halo/i.test(card.header.title ?? '');
        const isEmpty = !Array.isArray(card.data) || card.data.length === 0;

        if (isHalo && isEmpty && !card.header.emptyMessage) {
          return {
            ...card,
            header: {
              ...card.header,
              emptyMessage: formatMessage(
                {
                  id: 'Consumer.AudienceTargeting.Definition.BrandAudience.haloAudience.emptyMessage',
                },
                { brand: applied?.audience_targeting_brands ?? '' },
              ),
              emptyStateConfig: { inline: true },
            },
          };
        }

        return card;
      }),
    [rawCards, formatMessage, applied?.audience_targeting_brands],
  );

  const handleCardClick = useCallback(
    (index: number, segments: string[]) => {
      if (bigNumberSelected === index) {
        setBigNumberSelected(null);
        setHighlightedSegments([]);
      } else {
        setBigNumberSelected(index);
        setHighlightedSegments(segments);
      }
    },
    [bigNumberSelected, setHighlightedSegments],
  );

  const cardClickHandlers = useMemo(
    () =>
      cards.map((card, index) => {
        const segments = getHighlightSegmentsFromBrandAudienceCard(card);
        if (!segments.length) return undefined;
        return () => handleCardClick(index, segments);
      }),
    [cards, handleCardClick],
  );

  const shouldRenderNoData = !isLoading && (error || data?.length === 0);

  const kpiQuarterTags = useAudienceTargetingKpiQuarterTags();

  if (shouldRenderNoData) {
    return (
      <NoDataAvailable
        dataTestId={dataTestId}
        icon={<img src={NoDataAvailableIcon} alt="No data available" />}
        title={formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.BrandAudience.emptyMessage.title',
        })}
        description={formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.BrandAudience.emptyMessage.description',
        })}
      />
    );
  }

  return (
    <ResponsiveBasicContainer
      dataTestId={dataTestId}
      header={{
        title: `${applied?.audience_targeting_brands ?? ''} ${formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.BrandAudience.title',
        })}`,
        tags: kpiQuarterTags,
        titleSize: 'H2',
        tooltip: (
          <TooltipContent
            title={formatMessage({
              id: 'Consumer.AudienceTargeting.Definition.BrandAudience.tooltip.title',
            })}
            text={formatMessage({
              id: 'Consumer.AudienceTargeting.Definition.BrandAudience.tooltip.description',
            })}
            paddingLeft={false}
          />
        ),
        tooltipSize: 'medium',
      }}
      layout={{
        border: 'small',
        headerPadding: 'large',
        bodyPadding: true,
        background: theme.colors.specificProperty.noDataBackground,
      }}
    >
      {isLoading ? (
        <Skeleton
          height="160px"
          width="394px"
          length={2}
          dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
        />
      ) : (
        <StyledAudienceGrid>
          {cards.map((card, index) => {
            const isSelected = bigNumberSelected === index;

            return (
              <StyledBrandAudienceCardShell key={card.header.title}>
                <BigNumber
                  header={
                    <>
                      <StyledCardHeaderTitleRow>
                        <StyledCardHeaderTitle>
                          {card.header.title}
                        </StyledCardHeaderTitle>
                        {AUDIENCE_TOOLTIP_KEYS[card.header.title ?? ''] && (
                          <CustomTooltip
                            title={formatMessage({
                              id: AUDIENCE_TOOLTIP_KEYS[card.header.title ?? '']
                                .title,
                            })}
                            subtitle={formatMessage({
                              id: AUDIENCE_TOOLTIP_KEYS[card.header.title ?? '']
                                .subtitle,
                            })}
                            text={formatMessage({
                              id: AUDIENCE_TOOLTIP_KEYS[card.header.title ?? '']
                                .text,
                            })}
                          >
                            <StyledCardHeaderInfoIcon>
                              <Icon icon={Info} size="small" />
                            </StyledCardHeaderInfoIcon>
                          </CustomTooltip>
                        )}
                      </StyledCardHeaderTitleRow>
                      {card.header.subtitle && (
                        <StyledCardHeaderSubtitle>
                          {card.header.subtitle}
                        </StyledCardHeaderSubtitle>
                      )}
                    </>
                  }
                  data={card.data}
                  size="small"
                  asCard
                  isSelected={isSelected}
                  spacing="loose"
                  onClick={cardClickHandlers[index]}
                  emptyStateMessage={card.header.emptyMessage}
                  emptyStateConfig={card.header.emptyStateConfig}
                  dataTestId={
                    dataTestId ? `${dataTestId}-card-${index}` : undefined
                  }
                />
              </StyledBrandAudienceCardShell>
            );
          })}
        </StyledAudienceGrid>
      )}
    </ResponsiveBasicContainer>
  );
};
