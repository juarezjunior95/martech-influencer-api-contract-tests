import { Fragment } from 'react';
import { IntlFormatters } from 'react-intl';

import { ChartDataset } from 'chart.js';
import { Bar } from 'components/deprecated';
import { Expandable } from 'components/Expandable';
import { NoDataYet } from 'components/NoDataYet/NoDataYet';
import { ResourceAllocationOverview } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';

import {
  StyledEmptyState,
  StyledResourceAllocationCardsArea,
} from './MediaKpisCards.styles';

interface MediaKpiCardsProps {
  data: ResourceAllocationOverview;
  formatMessage: IntlFormatters['formatMessage'];
  minWidth?: string;
  dataTestId?: string;
}

export const MediaKpisCards = ({
  data,
  formatMessage,
  minWidth = '309',
  dataTestId,
}: MediaKpiCardsProps) => {
  if (!data) return null;

  return (
    <StyledResourceAllocationCardsArea
      data-testid={dataTestId ? `${dataTestId}-cards-area` : undefined}
    >
      <Expandable.Container
        dataTestId={dataTestId ? `${dataTestId}-kpis-cards` : undefined}
      >
        {Object.entries(data).map(([key, content]) => (
          <Fragment key={key}>
            <Expandable.Item
              id={key}
              data-testid={
                dataTestId ? `${dataTestId}-${key}-item-kpis-cards` : undefined
              }
              expand="none"
              gap="xs"
              bigNumberHeaderData={{
                title: formatMessage({
                  id: `ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.${key}.title`,
                }),
                titleSize: 'H4',
                totalMeasure: formatMessage({
                  id: `ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.${key}.measure`,
                }),
                targetViewMeasure: 'collapsed',
              }}
              minWidth={minWidth}
              colapsedChildren={
                <>
                  {content?.total_per_year_full ? (
                    <div
                      style={{ height: '270px' }}
                      data-testid={
                        dataTestId
                          ? `kpis-cards-item-bar-chart-${dataTestId}`
                          : undefined
                      }
                    >
                      <Bar
                        dataTestId={
                          dataTestId
                            ? `${dataTestId}-${key}-bar-chart`
                            : undefined
                        }
                        datasets={content.total_per_year_full.datasets.map(
                          (dataset) =>
                            ({
                              ...dataset,
                              barThickness: 32,
                              backgroundColor:
                                content.total_per_year_full.backgroundColor,
                            }) as ChartDataset<'bar'>,
                        )}
                        labels={content.total_per_year_full.labels}
                        roundedArrow={
                          content.total_per_year_full.comparison_data
                        }
                        datalabelWithVariation
                        offsetFirstTick
                      />
                    </div>
                  ) : (
                    <StyledEmptyState
                      data-testid={
                        dataTestId
                          ? `kpis-cards-item-empty-state-${dataTestId}`
                          : undefined
                      }
                    >
                      <NoDataYet
                        dataTestId={
                          dataTestId
                            ? `${dataTestId}-${key}-kpis-cards-empty-state`
                            : undefined
                        }
                      />
                    </StyledEmptyState>
                  )}
                </>
              }
            />
          </Fragment>
        ))}
      </Expandable.Container>
    </StyledResourceAllocationCardsArea>
  );
};
