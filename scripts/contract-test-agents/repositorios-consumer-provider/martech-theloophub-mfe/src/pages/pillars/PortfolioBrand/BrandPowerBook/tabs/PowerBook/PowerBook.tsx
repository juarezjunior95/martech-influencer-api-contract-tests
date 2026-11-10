import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Calendar } from '@hexa-ui/icons2';
import { BasicContainer, CountryBrandFlag } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useFeatureToggle, usePageFilterApplied } from 'hooks';
import { PerformanceTrend } from 'pages/components';
import { AISummaryAlert } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import { formatDateToQuarterYear } from 'utils/format';

import { BRAND_POWER_BOOK_PAGE_NAME } from '../../BrandPowerBook';
import {
  BigNumbers,
  CountryContribution,
  SummaryForPower,
  ZoneMaturity,
} from './components';
import { usePowerBookOverviewData } from './hooks/usePowerBookOverviewData';
import { PowerBookContainer } from './PowerBook.styles';

const CalendarIcon = () => <Calendar />;

export interface PowerBookProps {
  dataTestId?: string;
}

export const PowerBook: React.FC<PowerBookProps> = ({ dataTestId }) => {
  useDataRefreshForTab('Brand Power Book - Power Book');
  const { formatMessage } = useIntl();
  const { isGlobalZone, applied } = usePageFilterApplied(
    BRAND_POWER_BOOK_PAGE_NAME,
  );
  const { lastDataRefreshKpisDate } = useLastDataRefresh();

  const isAllGlobalBrandsFlagHidden =
    applied?.sub_scopes !== 'All Global Brands';

  const subScopeFilter = String(applied?.sub_scopes || 'All');
  const [aiSummaryEnabled, isAiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.aiSummary,
  );
  const {
    bigNumbers: biNumbersRequest,
    performanceTrend: performanceTrendRequest,
  } = usePowerBookOverviewData(subScopeFilter);
  const aiSummarySubfilters = useMemo(() => {
    return {
      scope: subScopeFilter,
    };
  }, [subScopeFilter]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.BrandPowerBook.PowerBook.title',
        }),
        titleSize: 'H2',
        tooltip: (
          <StyledTooltip>
            {formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.tooltip',
            })}
          </StyledTooltip>
        ),
        tags: [
          {
            icon: CalendarIcon,
            text: formatDateToQuarterYear(
              lastDataRefreshKpisDate?.power,
              ' - ',
              0,
            ),
          },
        ],
        rightContent: (
          <CountryBrandFlag brandFlagHidden={isAllGlobalBrandsFlagHidden} />
        ),
      }}
      layout={{ bodyPadding: false }}
      dataTestId={dataTestId}
    >
      <PowerBookContainer>
        <BigNumbers
          loading={biNumbersRequest.loading}
          error={biNumbersRequest.error}
          powerVsLq={biNumbersRequest.data?.powerVsLq || {}}
          powerVsLy={biNumbersRequest.data?.powerVsLy || {}}
          dataTestId={dataTestId ? `${dataTestId}-big-numbers` : undefined}
        />
        {aiSummaryEnabled && !isAiSummaryLoading && (
          <div style={{ marginTop: '8px', marginBottom: '8px' }}>
            <AISummaryAlert
              pageName={BRAND_POWER_BOOK_PAGE_NAME}
              dataTestId={dataTestId}
              kpiGroup="power"
              summaryPageIdentifier={
                AI_SUMMARY_PAGE_IDENTIFIERS.BRAND_POWER_BOOK_OVERVIEW
              }
              subFilters={aiSummarySubfilters}
            />
          </div>
        )}
        <BasicContainer
          header={{
            title: formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.title',
            }),
            titleSize: 'H3',
          }}
          layout={{
            bodyPadding: false,
          }}
          dataTestId={
            dataTestId ? `${dataTestId}-performance-trend` : undefined
          }
        >
          <PerformanceTrend
            loading={performanceTrendRequest.loading}
            error={performanceTrendRequest.error}
            trendOverTime={performanceTrendRequest.data?.trendOverTime}
            yearPowerVsAc={performanceTrendRequest.data?.yearPowerVsAc}
            legend={performanceTrendRequest.data?.legend || []}
          />
        </BasicContainer>

        {applied.zone &&
          (isGlobalZone ? (
            <ZoneMaturity
              dataTestId={
                dataTestId ? `${dataTestId}-zone-maturity` : undefined
              }
            />
          ) : (
            <SummaryForPower
              dataTestId={
                dataTestId ? `${dataTestId}-summary-power` : undefined
              }
            />
          ))}

        {applied.zone && isGlobalZone && (
          <CountryContribution
            dataTestId={
              dataTestId ? `${dataTestId}-country-contribution` : undefined
            }
          />
        )}
      </PowerBookContainer>
    </BasicContainer>
  );
};
