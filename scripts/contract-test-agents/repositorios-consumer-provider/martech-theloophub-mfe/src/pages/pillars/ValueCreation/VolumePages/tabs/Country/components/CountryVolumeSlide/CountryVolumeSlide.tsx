import { memo } from 'react';

import { TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { SlideContent } from 'pages/components/ValueCreation/Slides/SlideContent';
import { BigNumbersKpiData } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/types';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import { useVolumePagesKpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { CountryVolumeSlideProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryVolumeSlide/types';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/constants/sections';
import { LineChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

export const CountryVolumeSlide = memo(
  ({
    getPageByName,
    countryLabel,
    countryCode,
    dataTestId,
    period,
    data,
    kpiName,
  }: CountryVolumeSlideProps) => {
    const { kpi } = useVolumePagesKpi();

    return (
      <StyledExportPageSection
        data-page-name={pageSections.countryVolumeReport}
        data-testid={
          dataTestId
            ? `tabpanel-country-export-page-section-${dataTestId}`
            : undefined
        }
      >
        <TemplateSlide
          title={`${countryLabel} ${kpiName}`}
          measure={KPI_CONFIGS[kpi].measure}
          period={period}
          footnotes=""
          page={getPageByName(pageSections.countryVolumeReport)?.index}
          countryId={countryCode}
          headerDivider={false}
          dataTestId={pageSections.countryVolumeReport}
        >
          <SlideContent
            loading={data.loading}
            error={data.error}
            data={{
              bigNumbersKpiData: data.data?.[
                'big-numbers'
              ] as BigNumbersKpiData[],
              lineChartKpiData: data.data?.['line-chart'] as LineChartKpiData,
              portfolioTableKpiData: data.data?.['portfolio'] as TableDataType,
              prioritiesTableKpiData: data.data?.[
                'growth-levers'
              ] as TableDataType,
              marketsTableKpiData: { header: [], rows: [] },
            }}
            tableOrder={['portfolio', 'priorities']}
            adaptiveLayout
            lineChartHeight={411}
            dataTestId={
              dataTestId ? `country-slide-content-${dataTestId}` : undefined
            }
          />
        </TemplateSlide>
      </StyledExportPageSection>
    );
  },
);

CountryVolumeSlide.displayName = 'CountryVolumeSlide';
