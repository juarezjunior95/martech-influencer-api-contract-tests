import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons2';
import { Alert, BasicContainer, CountryFlag, Tag } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useFeatureToggle, usePageFilterApplied, useSubFilters } from 'hooks';
import { AISummary } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { StyledFlag, StyledTooltip } from 'shared/Styles';
import { getCountryAssetImageUrl } from 'utils';
import { lastDataRefreshByTimePeriod } from 'utils/timePeriod';

import { POS_BOOK_PAGE_NAME } from '../../POSBook';
import { ParticipationTable } from './components';
import { COHORTS_KEY, POS_KPI_KEY } from './constants';
import { StyledHeaderRightContent } from './GrowTheCategory.styles';

interface GrowTheCategoryProps {
  dataTestId?: string;
}

export const GrowTheCategory: React.FC<GrowTheCategoryProps> = ({
  dataTestId,
}) => {
  useDataRefreshForTab('POS Book - Grow the Category');
  const { formatMessage } = useIntl();
  const [selectedView, setSelectedView] = useState('country');
  const { applied } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const [abiFlagImageUrl, setAbiFlagImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCountryAssetImageUrl('ABI').then((url) => {
      if (!cancelled) setAbiFlagImageUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, []);
  const timePeriod = applied?.pos_periods;
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshByTimePeriod(
    lastDataRefreshKpisFormated?.pos,
    timePeriod,
  );
  const handleViewChange = (value: string) => {
    setSelectedView(value);
  };

  const [isUsaAlertEnabled, isUsaAlertLoading] = useFeatureToggle(
    featureToggles.pillar.category.submenus.posBook.usaAlert,
  );

  const [isAiSummaryEnabled, isAiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.category.submenus.posBook.tab.growCategory.aiSummary,
  );
  const { activeSubFilters } = useSubFilters();
  const aiSummarySubfilters = useMemo(() => {
    if (!activeSubFilters?.[POS_KPI_KEY] || !activeSubFilters?.[COHORTS_KEY])
      return {};

    return {
      pos_kpi: activeSubFilters?.[POS_KPI_KEY],
      cohort: activeSubFilters?.[COHORTS_KEY],
    };
  }, [activeSubFilters]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'Category.POSBook.GrowTheCategory.title',
        }),
        titleSize: 'H2',
        tooltip: (
          <StyledTooltip id="tooltip" size="small">
            {formatMessage({
              id: 'Category.POSBook.GrowTheCategory.tooltip',
            })}
          </StyledTooltip>
        ),
        rightContent: (
          <StyledHeaderRightContent
            data-testid={
              dataTestId ? `header-right-content-${dataTestId}` : undefined
            }
          >
            <SegmentedControl
              options={[
                { label: 'Country', value: 'country' },
                { label: 'Zone/Maturity', value: 'maturity-zone' },
                { label: 'Cohort', value: 'cohort' },
              ]}
              onValueChange={handleViewChange}
              value={selectedView}
            />
            {selectedView === 'cohort' ? (
              <CountryFlag />
            ) : (
              <StyledFlag src={abiFlagImageUrl || ''} alt="ABI" />
            )}
          </StyledHeaderRightContent>
        ),
        bottomTag: lastDataRefresh ? (
          <Tag
            Icon={CalendarClock}
            text={`: ${lastDataRefresh}`}
            dataTestId={dataTestId ? `${dataTestId}-last-refresh` : undefined}
          />
        ) : null,
      }}
      dataTestId={dataTestId}
    >
      {isUsaAlertEnabled && !isUsaAlertLoading && (
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
      {isAiSummaryEnabled && !isAiSummaryLoading && (
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
            summaryPageIdentifier={
              AI_SUMMARY_PAGE_IDENTIFIERS.GROW_THE_CATEGORY
            }
            subFilters={aiSummarySubfilters}
          />
        </div>
      )}
      <ParticipationTable
        selectedView={selectedView}
        hasPosKpi
        dataTestId={dataTestId}
      />
    </BasicContainer>
  );
};
