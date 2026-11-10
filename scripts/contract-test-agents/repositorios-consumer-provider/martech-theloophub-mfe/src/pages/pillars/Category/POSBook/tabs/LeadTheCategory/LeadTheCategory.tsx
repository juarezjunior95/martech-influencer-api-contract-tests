import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { CalendarClock } from '@hexa-ui/icons';
import { Alert, BasicContainer, CountryFlag, Tag } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import {
  useMultiplesFeatureToggles,
  usePageFilterApplied,
  useSubFilters,
} from 'hooks';
import { AISummary } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import {
  lastDataRefreshByTimePeriod,
  vsLastYearByTimePeriod,
} from 'utils/timePeriod';

import { POS_BOOK_PAGE_NAME } from '../../POSBook';
import { BrandParticipation, Manufacture } from './components';
import { PRICE_SEGMENTS_KEY_MANUFACTURE } from './constants';
import { LeadTheCategoryContainer } from './LeadTheCategory.styles';

interface LeadTheCategoryProps {
  dataTestId?: string;
}

export const LeadTheCategory: React.FC<LeadTheCategoryProps> = ({
  dataTestId,
}) => {
  useDataRefreshForTab('POS Book - Lead the Category');
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const timePeriod = applied?.pos_periods;
  const lastDataRefresh = lastDataRefreshByTimePeriod(
    lastDataRefreshKpisDate?.pos,
    timePeriod,
  );
  const vsLastYearDataRefresh = vsLastYearByTimePeriod(
    lastDataRefreshKpisDate?.pos,
    timePeriod,
  );
  const { activeSubFilters } = useSubFilters();
  const aiSummarySubfilters = useMemo(() => {
    if (
      !activeSubFilters?.[PRICE_SEGMENTS_KEY_MANUFACTURE] ||
      !activeSubFilters?.cohorts
    )
      return {};

    return {
      price_segment: activeSubFilters?.[PRICE_SEGMENTS_KEY_MANUFACTURE],
      cohort: activeSubFilters?.cohorts,
    };
  }, [activeSubFilters]);

  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.category.submenus.posBook.tab.leadCategory.sections
        .manufactureLead,
      featureToggles.pillar.category.submenus.posBook.tab.leadCategory.sections
        .brandParticipation,
      featureToggles.pillar.category.submenus.posBook.tab.leadCategory
        .aiSummary,
      featureToggles.pillar.category.submenus.posBook.usaAlert,
    ]);

  const isAiSummaryEnabled =
    tabToggles[
      featureToggles.pillar.category.submenus.posBook.tab.leadCategory.aiSummary
    ];

  const isUsaAlertEnabled =
    tabToggles[featureToggles.pillar.category.submenus.posBook.usaAlert];

  const manufacture = useMemo(() => {
    return (
      <>
        {tabToggles[
          featureToggles.pillar.category.submenus.posBook.tab.leadCategory
            .sections.manufactureLead
        ] && (
          <Manufacture
            formatMessage={formatMessage}
            lastDataRefresh={vsLastYearDataRefresh}
            dataTestId={dataTestId ? `${dataTestId}-manufacture` : undefined}
          />
        )}
      </>
    );
  }, [tabToggles, formatMessage, vsLastYearDataRefresh, dataTestId]);

  const brandParticipation = useMemo(() => {
    return (
      <>
        {tabToggles[
          featureToggles.pillar.category.submenus.posBook.tab.leadCategory
            .sections.brandParticipation
        ] && (
          <BrandParticipation
            formatMessage={formatMessage}
            lastDataRefresh={vsLastYearDataRefresh}
            dataTestId={
              dataTestId ? `${dataTestId}-brand-participation` : undefined
            }
          />
        )}
      </>
    );
  }, [tabToggles, formatMessage, vsLastYearDataRefresh, dataTestId]);

  return (
    <BasicContainer
      dataTestId={dataTestId}
      header={{
        title: formatMessage({
          id: `Category.POSBook.LeadTheCategory.title`,
        }),
        titleSize: 'H2',
        tooltip: (
          <StyledTooltip
            id="tooltip"
            size="small"
            data-testid={dataTestId ? `tooltip-${dataTestId}` : undefined}
          >
            {formatMessage({
              id: `Category.POSBook.LeadTheCategory.tooltip`,
            })}
          </StyledTooltip>
        ),
        rightContent: <CountryFlag />,
        bottomTag: lastDataRefresh ? (
          <Tag
            Icon={CalendarClock}
            text={`: ${lastDataRefresh}`}
            dataTestId={dataTestId ? `${dataTestId}-last-refresh` : undefined}
          />
        ) : null,
      }}
    >
      {isUsaAlertEnabled && togglesReady && (
        <div
          style={{ marginBottom: '30px', marginTop: '-16px' }}
          data-testid={dataTestId ? `alert-container-${dataTestId}` : undefined}
        >
          <Alert
            type="warning"
            title={formatMessage({
              id: 'Category.POSBook.USA.alert.title',
            })}
            message={formatMessage({
              id: 'Category.POSBook.USA.alert.message',
            })}
            dataTestId={dataTestId ? `${dataTestId}-usa-alert` : undefined}
          />
        </div>
      )}
      {isAiSummaryEnabled && togglesReady && (
        <div
          style={{ marginTop: '-16px', marginBottom: '24px' }}
          data-testid={
            dataTestId ? `ai-summary-container-${dataTestId}` : undefined
          }
        >
          <AISummary
            pageName={POS_BOOK_PAGE_NAME}
            kpiGroup="pos"
            dataTestId={`ai-summary-${dataTestId}`}
            subFilters={aiSummarySubfilters}
            summaryPageIdentifier={
              AI_SUMMARY_PAGE_IDENTIFIERS.LEAD_THE_CATEGORY
            }
          />
        </div>
      )}
      <LeadTheCategoryContainer
        data-testid={dataTestId ? `container-${dataTestId}` : undefined}
      >
        {manufacture}
        {brandParticipation}
      </LeadTheCategoryContainer>
    </BasicContainer>
  );
};
