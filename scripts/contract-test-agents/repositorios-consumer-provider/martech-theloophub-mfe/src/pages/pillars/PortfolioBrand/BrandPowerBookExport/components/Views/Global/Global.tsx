import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Cover, TemplateSlide } from 'components';
import { useLastDataRefresh } from 'contexts';
import { usePageIndexes } from 'hooks';
import { PORTFOLIOS_TYPES } from 'pages/constants';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';
import { formatDateToQuarterYear } from 'utils/format';

import { StyledContent } from '../../../BrandPowerBookExport.styles';
import {
  AI_SUMMARY_GLOBAL_IDENTIFIER,
  UNIFIED_GLOBAL_SLIDES,
} from '../../../constants';
import { usePowerBookGlobalData } from '../../../hooks/usePowerBookGlobalData/usePowerBookGlobalData';
import { ByCountrySlide } from '../../ByCountrySlide';
import { EvolutionSlideWrapper } from '../../EvolutionSlideWrapper';
import { GenericPerformanceSlide } from '../../GenericPerformanceSlide';
import { TopCountryContribution } from '../../TopContribuitionCountry';

interface GlobalViewProps {
  containerRef: React.RefObject<HTMLElement>;
  loadingCallback: (loading: { country: boolean; global: boolean }) => void;
}

export const GlobalView = ({
  containerRef,
  loadingCallback,
}: GlobalViewProps) => {
  const { formatMessage } = useIntl();
  const { getPageByName, updateIndexes } = usePageIndexes(containerRef);
  const { lastDataRefreshKpisDate } = useLastDataRefresh();

  const { globalData, loading } = usePowerBookGlobalData();
  useEffect(() => {
    updateIndexes();
  }, [updateIndexes]);

  const quarterYear = useMemo(() => {
    if (!lastDataRefreshKpisDate.power) return '';
    return formatDateToQuarterYear(lastDataRefreshKpisDate.power);
  }, [lastDataRefreshKpisDate]);

  const quarterYearFull = useMemo(() => {
    if (!lastDataRefreshKpisDate.power) return '';
    return formatDateToQuarterYear(lastDataRefreshKpisDate.power, ' ', 0);
  }, [lastDataRefreshKpisDate]);

  const quarterYearFullPeriod = useMemo(() => {
    if (!lastDataRefreshKpisDate.power || !quarterYearFull) return '';
    const [quarter, year] = quarterYearFull.split(' ');
    if (!quarter || !year) return quarterYearFull;
    return (
      <span>
        {quarter}
        <span style={{ letterSpacing: '0.3em', marginRight: '0.05em' }}>´</span>
        {year}
      </span>
    );
  }, [lastDataRefreshKpisDate.power, quarterYearFull]);

  useEffect(() => {
    loadingCallback({ country: false, global: loading });
  }, [loading, loadingCallback]);

  const renderEvolution = (
    config: Extract<
      (typeof UNIFIED_GLOBAL_SLIDES)[number],
      { type: 'evolution' }
    >,
  ) => {
    const source = globalData.trendPowerEvolutionData[config.dataKey];

    return (
      <EvolutionSlideWrapper
        key={config.section}
        section={config.section}
        title={config.title}
        period={quarterYear}
        pageIndex={getPageByName(config.section)?.index}
        data={source?.data}
        loading={source?.loading || false}
        error={source?.error}
        portfolioType={config.portfolioType as keyof typeof PORTFOLIOS_TYPES}
      />
    );
  };

  const renderByCountry = (
    config: Extract<
      (typeof UNIFIED_GLOBAL_SLIDES)[number],
      { type: 'by-country' }
    >,
  ) => {
    return (
      <StyledExportPageSection
        key={config.section}
        data-page-name={config.section}
      >
        <TemplateSlide
          backgroundColor="#F5F5F4"
          title={config.title}
          period={quarterYear}
          footnotes={
            <>
              <b>Global Power</b> calculated on weighted average based on NR
              BU’26. <b>Source & Scope:</b> Power from Kantar Brand Guidance in
              30 countries delivering 96% of NR.
            </>
          }
          page={getPageByName(config.section)?.index}
          countryId="ABI"
          headerDivider={false}
          dataTestId={config.section}
        >
          <StyledContent>
            <ByCountrySlide
              loading={globalData[config.dataKey]?.loading}
              error={globalData[config.dataKey]?.error}
              bigNumbersKpiData={globalData[config.dataKey]?.data?.bigNumbers}
              zoneKpiData={
                globalData[config.dataKey]?.data?.zonePerformance
                  ?.zonePowerPerformance
              }
              nazKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.NAZ
                  ?.data
              }
              sazKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.SAZ
                  ?.data
              }
              mazKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.MAZ
                  ?.data
              }
              apacKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.APAC
                  ?.data
              }
              afrKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.AFR
                  ?.data
              }
              eurKpiData={
                globalData[config.dataKey]?.data?.zonePerformanceDetails?.EUR
                  ?.data
              }
              alerts={[]}
              dataTestId={`slide-${config.section}`}
              section={config.section}
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>
    );
  };

  const renderPerformance = (
    config: Extract<
      (typeof UNIFIED_GLOBAL_SLIDES)[number],
      { type: 'performance' }
    >,
  ) => {
    return (
      <GenericPerformanceSlide
        key={config.section}
        pageName={config.section}
        title={config.title}
        period={quarterYear}
        footnotes={
          <>
            <b>Global Power</b> calculated on weighted average based on NR
            BU’26. <b>Source & Scope:</b> Power from Kantar Brand Guidance in 30
            countries delivering 96% of NR.
          </>
        }
        pageIndex={getPageByName(config.section)?.index}
        loading={globalData[config.dataKey]?.loading}
        error={globalData[config.dataKey]?.error}
        data={globalData[config.dataKey]?.data}
        alerts={[]}
        isCompetitor={config.isCompetitor}
      />
    );
  };

  const renderContribution = (
    config: Extract<
      (typeof UNIFIED_GLOBAL_SLIDES)[number],
      { type: 'contribution' }
    >,
  ) => {
    return (
      <StyledExportPageSection
        key={config.section}
        data-page-name={config.section}
      >
        <TemplateSlide
          backgroundColor="#F5F5F4"
          title={config.title}
          period={quarterYear}
          footnotes={
            <>
              <b>Global Power</b> calculated on weighted average based on NR
              BU’26. <b>Source & Scope:</b> Power from Kantar Brand Guidance in
              30 countries delivering 96% of NR.
            </>
          }
          page={getPageByName(config.section)?.index}
          countryId="ABI"
          headerDivider={false}
          dataTestId={config.section}
        >
          <StyledContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <TopCountryContribution
              countryContribuitionKpiData={
                globalData.contribution?.global?.data
              }
              loading={globalData.contribution?.global?.loading}
              error={globalData.contribution?.global?.error}
              title={formatMessage({
                id: 'PortfolioBrand.BrandPowerBook.PowerBook.TopCountryContribution.titleTotalAbi',
              })}
              dataTestId="chart-country-contribution-abi"
              aiSummary={AI_SUMMARY_GLOBAL_IDENTIFIER[`${config.section}_all`]}
            />
            <TopCountryContribution
              countryContribuitionKpiData={
                globalData.contribution?.megabrands?.data
              }
              loading={globalData.contribution?.megabrands?.loading || false}
              error={globalData.contribution?.megabrands?.error}
              title={formatMessage({
                id: 'PortfolioBrand.BrandPowerBook.PowerBook.TopCountryContribution.titleMegaBrands',
              })}
              dataTestId="chart-country-contribution-megabrands"
              aiSummary={
                AI_SUMMARY_GLOBAL_IDENTIFIER[`${config.section}_megabrands`]
              }
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>
    );
  };

  const renderCover = (
    config: Extract<(typeof UNIFIED_GLOBAL_SLIDES)[number], { type: 'cover' }>,
  ) => {
    return (
      <StyledExportPageSection
        key={config.section}
        data-page-name={config.section}
      >
        <Cover
          category={config.category}
          name={config.name}
          loading={false}
          period={quarterYearFullPeriod}
          showLogo
        />
      </StyledExportPageSection>
    );
  };

  return (
    <>
      {UNIFIED_GLOBAL_SLIDES.map((config) => {
        switch (config.type) {
          case 'executive-summary':
            return null;
          case 'evolution':
            return renderEvolution(config);
          case 'by-country':
            return renderByCountry(config);
          case 'performance':
            return renderPerformance(config);
          case 'contribution':
            return renderContribution(config);
          case 'cover':
            return renderCover(config);
          default:
            return null;
        }
      })}
    </>
  );
};
