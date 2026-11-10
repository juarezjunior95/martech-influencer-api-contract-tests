import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import NoDataAvailableIcon from 'assets/NoDataAvailable.svg';
import { Alert, ResponsiveBasicContainer, Skeleton } from 'components';
import {
  DataTable,
  type HighlightStyle,
  type TableDataType,
} from 'components/TableComponent';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterApplied, usePageFilterData } from 'hooks';
import { theme } from 'theme';

import { NoDataAvailable, TooltipContent } from '../../../../components';
import {
  AudienceTargetingError,
  FILTER_CONFIG_DEFINITION,
} from '../../../../constants';
import {
  PARTICIPATION_BREAKDOWN_CONTENT_HEIGHT,
  PARTICIPATION_BREAKDOWN_TABLE_TEST_ID,
  StyledOverviewContainer,
} from './ParticipationBreakdown.styles';
import { applyBrandColumnColors } from './utils';

interface ParticipationBreakdownProps {
  dataTestId?: string;
  data: TableDataType | null;
  isLoading?: boolean;
  highlightedItems: (string | number)[];
  error?: Error | null;
}

const PARTICIPATION_BREAKDOWN_HIGHLIGHT_STYLE: HighlightStyle = {
  backgroundColor: 'rgba(229, 182, 17, 0.16)',
};

export const ParticipationBreakdown = ({
  dataTestId,
  data = null,
  isLoading = false,
  highlightedItems,
  error = null,
}: ParticipationBreakdownProps) => {
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(FILTER_CONFIG_DEFINITION.pageName);
  const { dataFilters } = usePageFilterData(FILTER_CONFIG_DEFINITION.pageName);

  const competitorLabel = useMemo(() => {
    if (!dataFilters || !applied) return '';

    const options = FilterDataAccessor.getInstance().getOptions(
      'audience_targeting_brands_comp',
      dataFilters,
      applied,
    ) as { value: string | null; label: string | null }[];
    const match = options.find(
      (opt) => opt.value === applied.audience_targeting_brands_comp,
    );

    return String(
      match?.label ?? applied?.audience_targeting_brands_comp ?? '',
    );
  }, [dataFilters, applied]);

  const isCompetitorWithoutData =
    error?.message === AudienceTargetingError.CompetitorWithoutData;
  const shouldRenderNoData = !isLoading && !error && data === null;

  const tableData = useMemo(
    () => (data ? applyBrandColumnColors(data) : null),
    [data],
  );

  if (shouldRenderNoData) {
    return (
      <NoDataAvailable
        dataTestId={dataTestId}
        icon={<img src={NoDataAvailableIcon} alt="No data available" />}
        title={formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.emptyMessage.title',
        })}
        description={formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.emptyMessage.description',
        })}
      />
    );
  }

  return (
    <ResponsiveBasicContainer
      dataTestId={dataTestId}
      header={{
        title: formatMessage({
          id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.title',
        }),
        titleSize: 'H2',
        tooltip: (
          <TooltipContent
            title={formatMessage({
              id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.tooltip.title',
            })}
            subtitle={formatMessage({
              id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.tooltip.subtitle',
            })}
            text={formatMessage({
              id: 'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.tooltip.description',
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
      <StyledOverviewContainer>
        {isCompetitorWithoutData && (
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
        {(() => {
          if (isLoading) {
            return (
              <Skeleton
                width="100%"
                height={PARTICIPATION_BREAKDOWN_CONTENT_HEIGHT}
                length={1}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-table-loading-skeleton`
                    : 'loading-skeleton-participation-breakdown'
                }
              />
            );
          }
          if (tableData) {
            return (
              <DataTable
                data={tableData}
                showAxis
                hideEmptyAxisHeader
                rowGroupLabel="vertical"
                useCustomHeaderTooltip={false}
                subHeaderFullCellTooltip
                highlightedItems={highlightedItems}
                highlightField="segment"
                highlightStyle={PARTICIPATION_BREAKDOWN_HIGHLIGHT_STYLE}
                headerGap
                headerColumnGap
                headerOnlyColumnBorder
                groupBorder
                rowBorder={false}
                dataTestId={PARTICIPATION_BREAKDOWN_TABLE_TEST_ID}
              />
            );
          }
          return null;
        })()}
      </StyledOverviewContainer>
    </ResponsiveBasicContainer>
  );
};
