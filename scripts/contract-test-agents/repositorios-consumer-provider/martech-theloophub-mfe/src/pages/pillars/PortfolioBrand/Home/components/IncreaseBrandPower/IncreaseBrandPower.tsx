import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import { BigNumberSparkLineCard } from 'pages/components';
import { AISummary } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

import {
  PORTFOLIO_BRAND_HOME_PAGE_NAME,
  PortfolioBrandHomeBigNumberCardData,
} from '../../PortfolioBrandHome';

export interface IncreaseBrandPowerProps {
  loading: boolean;
  error: Error | null;
  data: PortfolioBrandHomeBigNumberCardData;
}

export const IncreaseBrandPower: React.FC<IncreaseBrandPowerProps> = ({
  loading,
  error,
  data,
}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [
    aiSummaryIncreaseBrandPowerEnabled,
    aiSummaryIncreaseBrandPowerLoading,
  ] = useFeatureToggle(
    featureToggles.pillar.portfolioBrand.home.aiSummary.increaseBrandPower,
  );

  const aiSummarySubfilters = useMemo(
    () => ({
      scope: 'All',
    }),
    [],
  );
  return (
    <BigNumberSparkLineCard
      loading={loading}
      error={error}
      containerTitle={formatMessage({
        id: 'PortfolioBrand.Home.containerTitleIncreaseBrandPower',
      })}
      data={{
        chartTitle: data?.title,
        chartPeriod: data?.period,
        bigNumberData: data?.bigNumberData ?? [],
        chartLineData: data?.chartLineData,
      }}
      onClick={() => navigate('/portfolio-brand/brand-power-book/power-book')}
    >
      {aiSummaryIncreaseBrandPowerEnabled &&
        !aiSummaryIncreaseBrandPowerLoading && (
          <AISummary
            pageName={PORTFOLIO_BRAND_HOME_PAGE_NAME}
            summaryPageIdentifier={
              AI_SUMMARY_PAGE_IDENTIFIERS.BRAND_POWER_BOOK_OVERVIEW
            }
            kpiGroup="power"
            dataTestId="ai-summary-big-number-spark-line-card"
            hasExpandedAction={false}
            subFilters={aiSummarySubfilters}
          />
        )}
    </BigNumberSparkLineCard>
  );
};
