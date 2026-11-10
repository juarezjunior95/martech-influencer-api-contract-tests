import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { BasicContainer } from 'components';
import { FilterRegistry } from 'domain/Filter';
import { usePageFilterApplied } from 'hooks';
import { buildDataTestId } from 'utils';

import {
  exploreFurtherBasicContainerBackground,
  StyledCardDescription,
  StyledCardFooter,
  StyledCardHeaderRow,
  StyledCardIcon,
  StyledCardTextColumn,
  StyledCardTitle,
  StyledCommercialResultsCard,
  StyledCommercialResultsLink,
  StyledCommercialResultsLinkLabel,
  StyledExploreFurtherBody,
  StyledExploreFurtherCards,
  StyledExploreFurtherLinkArrow,
  StyledExploreFurtherRoot,
  StyledExploreFurtherSubtitle,
  StyledWatchTowerBody,
} from './ExploreFurther.styles';
import type { ExploreFurtherProps } from './types';

function locationSearchHasFilterParams(search: string): boolean {
  const qs = search.startsWith('?') ? search.slice(1) : search;
  if (!qs) {
    return false;
  }
  const params = new URLSearchParams(qs);
  for (const key of params.keys()) {
    if (key.startsWith('filter_')) {
      return true;
    }
  }
  return false;
}

export const ExploreFurther = ({
  filterPageName,
  cards,
  dataTestId,
}: ExploreFurtherProps) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { applied } = usePageFilterApplied(filterPageName);
  const exploreFurtherDataTestId = buildDataTestId(
    'explore-further',
    dataTestId,
  );
  const cardsWithHrefs = useMemo(
    () =>
      cards.map((card) => {
        const sourceSearch = locationSearchHasFilterParams(location.search)
          ? location.search
          : FilterRegistry.buildFilterQueryString(applied);

        return {
          ...card,
          href: FilterRegistry.mergeFilterParamsIntoHref(
            card.linkHref,
            sourceSearch,
          ),
        };
      }),
    [cards, applied, location.search],
  );

  const renderCards = () => {
    return cardsWithHrefs.map((card) => {
      return (
        <StyledCommercialResultsLink
          to={card.href}
          data-testid={buildDataTestId('explore-further', dataTestId, 'link')}
          key={card.title + card.description + card.linkLabel}
          interactive={card.enabled}
        >
          <StyledCommercialResultsCard
            border="medium"
            elevated="minimal"
            data-testid={buildDataTestId('explore-further', dataTestId, 'card')}
            interactive={card.enabled}
          >
            <StyledWatchTowerBody>
              <StyledCardHeaderRow>
                <StyledCardIcon
                  tone={card.enabled ? 'active' : 'muted'}
                  aria-hidden
                >
                  {card.abbreviation}
                </StyledCardIcon>
                <StyledCardTextColumn>
                  <StyledCardTitle size="H5" muted={!card.enabled}>
                    {card.title}
                  </StyledCardTitle>
                  <StyledCardDescription muted={!card.enabled}>
                    {card.description}
                  </StyledCardDescription>
                </StyledCardTextColumn>
              </StyledCardHeaderRow>
              <StyledCardFooter>
                <StyledCommercialResultsLinkLabel disabled={!card.enabled}>
                  {card.linkLabel}
                  <StyledExploreFurtherLinkArrow aria-hidden size="medium" />
                </StyledCommercialResultsLinkLabel>
              </StyledCardFooter>
            </StyledWatchTowerBody>
          </StyledCommercialResultsCard>
        </StyledCommercialResultsLink>
      );
    });
  };

  return (
    <StyledExploreFurtherRoot dataTestId={exploreFurtherDataTestId}>
      <BasicContainer
        dataTestId={exploreFurtherDataTestId}
        layout={{
          bodyPadding: false,
          background: exploreFurtherBasicContainerBackground,
        }}
        header={{
          title: formatMessage({
            id: 'ExploreFurther.title',
          }),
          tooltip: {
            text: formatMessage({
              id: 'ExploreFurther.tooltip',
            }),
          },
        }}
      >
        <StyledExploreFurtherBody>
          <StyledExploreFurtherSubtitle
            data-testid={buildDataTestId(
              'explore-further',
              dataTestId,
              'subtitle',
            )}
          >
            {formatMessage({
              id: 'ExploreFurther.subtitle',
            })}
          </StyledExploreFurtherSubtitle>
          <StyledExploreFurtherCards>{renderCards()}</StyledExploreFurtherCards>
        </StyledExploreFurtherBody>
      </BasicContainer>
    </StyledExploreFurtherRoot>
  );
};
