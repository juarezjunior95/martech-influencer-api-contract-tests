import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
} from 'components';
import { BigNumberData } from 'components/BigNumber/types';
import { featureToggles } from 'config/featureToggle';
import { useBffData, useFeatureToggle, usePageFilterApplied } from 'hooks';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
} from 'shared/Styles/layout.styles';

import { HowWeDoIt } from './components/HowWeDoIt/HowWeDoIt';
import { IncreaseBrandPower } from './components/IncreaseBrandPower/IncreaseBrandPower';

export interface PortfolioBrandHomeBigNumberCardData {
  title: string;
  period: string;
  bigNumberData: BigNumberData[];
  chartLineData?: number[];
}
export const PORTFOLIO_BRAND_HOME_PAGE_NAME = 'portfolio-brand_home';
export const PortfolioBrandHome = () => {
  const { applied } = usePageFilterApplied(PORTFOLIO_BRAND_HOME_PAGE_NAME);
  const { formatMessage } = useIntl();
  const [portfolioBrandHomeContentEnabled, portfolioBrandHomeContentLoading] =
    useFeatureToggle(
      featureToggles.pillar.portfolioBrand.portfolio_brand_home_content,
    );

  const pageData = useBffData({
    id: 'portfolio-brand_home_home',
    kpiGroup: 'power',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
      page_filter: 'All',
      timeperiod: 'YTD',
      timeframe: 'YTD',
    },
  });

  const increaseBrandPowerData = pageData?.data?.[
    'increase-brand-power'
  ] as PortfolioBrandHomeBigNumberCardData;
  const portfolioStrategyData = pageData?.data?.[
    'portfolio-strategy'
  ] as PortfolioBrandHomeBigNumberCardData[];
  const targetAudiencesData = pageData?.data?.[
    'target-audiences'
  ] as PortfolioBrandHomeBigNumberCardData;

  const isPortfolioBrandHomeContentEnabled = useMemo(() => {
    return (
      portfolioBrandHomeContentEnabled && !portfolioBrandHomeContentLoading
    );
  }, [portfolioBrandHomeContentEnabled, portfolioBrandHomeContentLoading]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: PORTFOLIO_BRAND_HOME_PAGE_NAME,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isPortfolioBrandHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/portfolio-brand',
              pageName: formatMessage({
                id: 'Pillars.pageName.portfolioBrand',
              }),
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
      />

      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <StyledHomeHeaderContainer>
            <PageHeader
              title={formatMessage({ id: 'Pillars.sidebar.portfolioBrand' })}
              subtitle={formatMessage({
                id: 'PortfolioBrand.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          {isPortfolioBrandHomeContentEnabled && (
            <>
              <IncreaseBrandPower
                loading={pageData?.loading ?? false}
                error={pageData?.error ?? null}
                data={increaseBrandPowerData}
              />
              <HowWeDoIt
                loading={pageData?.loading ?? false}
                error={pageData?.error ?? null}
                targetAudiencesData={targetAudiencesData}
                portfolioStrategyData={portfolioStrategyData}
              />
            </>
          )}
          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.portfolioBrand' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
