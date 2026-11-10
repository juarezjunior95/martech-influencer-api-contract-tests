import { FC, useMemo } from 'react';

import { Cover } from 'components';
import { useLastDataRefresh } from 'contexts';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import { useVolumePagesKpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { COUNTRIES } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/countries';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/sections';
import { useGlobalPeriod } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/hooks';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { CountrySlideWrapper } from '../CountrySlideWrapper';
import { KeyMarketsSectionProps } from './types';

export const KeyMarketsSection: FC<KeyMarketsSectionProps> = ({
  dataTestId,
  getPageByName,
}) => {
  const { kpi } = useVolumePagesKpi();
  const { period } = useGlobalPeriod(kpi);
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();

  const refreshKpiGroup = useMemo(() => KPI_CONFIGS[kpi].kpiGroup, [kpi]);

  const eurSubFilters = useMemo(() => {
    const dtEndMonthYear = lastDataRefreshKpisDateMonthYear?.[refreshKpiGroup];

    if (!dtEndMonthYear) return COUNTRIES.EUR.subFilters;

    return {
      ...COUNTRIES.EUR.subFilters,
      bigNumbers: { country: 'ABI', zone: 'EUR', dt_end: dtEndMonthYear, kpi },
      kpi,
    };
  }, [lastDataRefreshKpisDateMonthYear, refreshKpiGroup, kpi]);

  return (
    <>
      <StyledExportPageSection
        data-page-name={pageSections.mustWinMarketsCover}
      >
        <Cover
          category="One Way Reports"
          name="Key Markets"
          loading={false}
          showLogo
          centerLogo
          centerText
          showLink={false}
          dataTestId={
            dataTestId ? `${dataTestId}-key-markets-cover` : undefined
          }
        />
      </StyledExportPageSection>

      {Object.entries(COUNTRIES).map(([countryCode, config]) => {
        const subFilters =
          countryCode === 'EUR' ? eurSubFilters : config.subFilters;

        return (
          <CountrySlideWrapper
            key={countryCode}
            countryCode={countryCode}
            config={config}
            subFilters={{ ...subFilters, kpi }}
            period={period}
            getPageByName={getPageByName}
            dataTestId={dataTestId}
          />
        );
      })}
    </>
  );
};
