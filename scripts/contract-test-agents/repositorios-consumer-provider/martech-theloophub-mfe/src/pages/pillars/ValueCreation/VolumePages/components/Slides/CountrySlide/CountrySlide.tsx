import { useIntl } from 'react-intl';

import { TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { SlideContent } from 'pages/components/ValueCreation/Slides/SlideContent';
import { TopBottomBarChartSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomBarChartSlideContent';
import { TopBottomWaterfallSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent';
import { useVolumePagesKpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import {
  COUNTRY_MARKET_BRANDS_BREAKDOWN_TITLE_MESSAGE_ID,
  COUNTRY_MARKET_TITLE_MESSAGE_ID,
} from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/countries';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { KPI_CONFIGS } from '../../../config';
import { BigNumbersKpiData, LineChartKpiData } from '../../../types';
import { barChartWithLegend, waterfallChartWithLegend } from '../../../utils';
import { CountrySlideProps } from './types';

export const CountrySlide: React.FC<CountrySlideProps> = ({
  countryCode,
  config,
  countryData,
  period,
  getPageByName,
  dataTestId,
}) => {
  const { kpi, kpiName } = useVolumePagesKpi();
  const { formatMessage } = useIntl();
  const legend = KPI_CONFIGS[kpi].legend.portfolio;
  const isMarketShare = kpi === 'market_share';
  const countryMarketTitle = formatMessage(
    { id: COUNTRY_MARKET_TITLE_MESSAGE_ID },
    { countryName: config.countryName, kpiLabel: kpiName },
  );
  const countryMarketBrandsBreakdownTitle = formatMessage(
    { id: COUNTRY_MARKET_BRANDS_BREAKDOWN_TITLE_MESSAGE_ID },
    { countryName: config.countryName, kpiLabel: kpiName },
  );

  const sectionName = config.section;
  const barChartSectionName = config.barChartSection;

  return (
    <>
      <StyledExportPageSection
        key={countryCode}
        data-page-name={sectionName}
        data-testid={dataTestId ? `${dataTestId}-${sectionName}` : undefined}
      >
        <TemplateSlide
          enablePngCopy
          title={countryMarketTitle}
          measure={KPI_CONFIGS[kpi].measure}
          period={period}
          footnotes=""
          page={getPageByName(sectionName)?.index}
          countryId={countryCode}
          headerDivider={false}
          dataTestId={dataTestId ? `${dataTestId}-${sectionName}` : sectionName}
        >
          <SlideContent
            data={{
              bigNumbersKpiData: countryData?.data?.[
                'big-numbers'
              ] as BigNumbersKpiData[],
              lineChartKpiData: countryData?.data?.[
                'line-chart'
              ] as LineChartKpiData,
              portfolioTableKpiData: countryData?.data?.[
                'portfolio'
              ] as TableDataType,
              prioritiesTableKpiData: countryData?.data?.[
                'growth-levers'
              ] as TableDataType,
              marketsTableKpiData: { header: [], rows: [] },
            }}
            dataTestId={dataTestId ? `${dataTestId}-country-slide` : undefined}
            tableOrder={['portfolio', 'priorities']}
            adaptiveLayout
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        key={`${countryCode}-bar`}
        data-page-name={barChartSectionName}
        data-testid={
          dataTestId ? `${dataTestId}-${barChartSectionName}` : undefined
        }
      >
        <TemplateSlide
          enablePngCopy
          title={countryMarketBrandsBreakdownTitle}
          measure={KPI_CONFIGS[kpi].measure}
          period={period}
          footnotes={
            isMarketShare
              ? 'Brands are ordered by Portfolio Classification, then ranked by total market share.'
              : 'Brands are ordered by Portfolio Classification, then ranked by vol. size. Product Type filtered by Beer + ADJ.'
          }
          page={getPageByName(barChartSectionName)?.index}
          countryId={countryCode}
          headerDivider={false}
          dataTestId={
            dataTestId
              ? `${dataTestId}-${barChartSectionName}`
              : barChartSectionName
          }
        >
          {isMarketShare ? (
            <TopBottomBarChartSlideContent
              chartHeight="200px"
              dataTestId={
                dataTestId ? `${dataTestId}-${barChartSectionName}` : undefined
              }
              loading={countryData.loading}
              error={countryData.error}
              data={{
                topKpiData: barChartWithLegend(
                  countryData?.data,
                  'brands-volume-YTD',
                  legend,
                ),
                bottomKpiData: barChartWithLegend(
                  countryData?.data,
                  'brands-volume-MTD',
                  legend,
                ),
              }}
            />
          ) : (
            <TopBottomWaterfallSlideContent
              dataTestId={
                dataTestId ? `${dataTestId}-${barChartSectionName}` : undefined
              }
              loading={countryData.loading}
              error={countryData.error}
              data={{
                topKpiData: waterfallChartWithLegend(
                  countryData?.data,
                  'brands-volume-YTD',
                  legend,
                ),
                bottomKpiData: waterfallChartWithLegend(
                  countryData?.data,
                  'brands-volume-MTD',
                  legend,
                ),
              }}
            />
          )}
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};
