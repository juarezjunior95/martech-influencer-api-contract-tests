import { FC, Fragment, useMemo, useRef } from 'react';

import { Cover } from 'components';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { FilterRegistry } from 'domain/Filter';
import { usePageIndexes } from 'hooks';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import { useVolumePagesKpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { GlobalMovesSection } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GlobalMovesSection';
import { GlobalResultsSection } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GlobalResultsSection';
import { GrowthLeverSection } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GrowthLeverSection';
import { KeyMarketsSection } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/KeyMarketsSection';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/sections';
import { useGlobalPeriod } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/hooks';
import { GlobalProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/types';
import {
  StyledExportPageContent,
  StyledExportPageSection,
} from 'shared/Styles/exportPages.styles';

export const Global: FC<GlobalProps> = ({ dataTestId }) => {
  useDataRefreshForTab('volume-page-global');
  const { kpi } = useVolumePagesKpi();

  const containerRef = useRef<HTMLDivElement>(null);
  const { getPageByName } = usePageIndexes(containerRef);

  const { dt_end, monthYear, period } = useGlobalPeriod(kpi);

  const globalCoverLink = useMemo(
    () =>
      `/value-creation?${FilterRegistry.buildFilterQueryString({
        zone: 'ABI',
        country: 'ABI',
      })}`,
    [],
  );

  return (
    <div ref={containerRef}>
      <StyledExportPageContent>
        <GlobalResultsSection
          globalCoverLink={globalCoverLink}
          getPageByName={getPageByName}
          dataTestId={dataTestId}
          monthYear={monthYear}
          period={period}
        />

        {Object.entries(KPI_CONFIGS[kpi].growthLevers).map(([key, config]) => {
          const leverConfig = config;

          if (!leverConfig) return null;

          const mainSubFiltersWithDtEnd = {
            ...leverConfig.mainSubFilters,
            bigNumbers: {
              ...leverConfig.mainSubFilters.bigNumbers,
              dt_end,
              kpi,
            },
            topBottomBrands: {
              ...leverConfig.mainSubFilters.topBottomBrands,
              dt_end,
              kpi,
            },
            kpi,
          };

          return (
            <Fragment key={key}>
              <GrowthLeverSection
                prioritiesPageType={leverConfig.prioritiesPageType}
                prioritiesGrowthLever={leverConfig.prioritiesGrowthLever}
                portfolioConfig={leverConfig.portfolioConfig}
                mainSubFilters={mainSubFiltersWithDtEnd}
                tableOrder={leverConfig.tableOrder}
                getPageByName={getPageByName}
                dataTestId={dataTestId}
                config={config}
                period={period}
                dt_end={dt_end}
                leverKey={key}
              />
            </Fragment>
          );
        })}

        <GlobalMovesSection
          getPageByName={getPageByName}
          dataTestId={dataTestId}
          period={period}
          dt_end={dt_end}
        />

        <KeyMarketsSection
          getPageByName={getPageByName}
          dataTestId={dataTestId}
        />

        <StyledExportPageSection data-page-name={pageSections.backCover}>
          <Cover
            dataTestId={dataTestId ? `${dataTestId}-thank-you` : undefined}
            link={globalCoverLink}
            name="Thank You"
            centerLogo
            showLogo
          />
        </StyledExportPageSection>
      </StyledExportPageContent>
    </div>
  );
};
