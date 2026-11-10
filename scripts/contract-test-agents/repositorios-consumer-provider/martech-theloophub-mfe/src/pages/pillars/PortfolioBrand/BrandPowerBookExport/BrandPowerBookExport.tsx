import { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { Cover, StickyScrollWithFilters } from 'components';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { FilterDataAccessor } from 'domain/Filter';
import {
  useExportPdf,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterStatus,
} from 'hooks';
import { StyledGridContainer, StyledGridItem } from 'shared/Styles';
import {
  StyledExportButton,
  StyledExportIcon,
  StyledExportPageContent,
  StyledExportPageHeader,
  StyledExportPageSection,
} from 'shared/Styles/exportPages.styles';
import { formatDateToQuarterYear } from 'utils/format';

import { CountryView, GlobalView } from './components';
import { pageSections } from './constants';

export const BRAND_POWER_BOOK_EXPORT_PAGE_NAME =
  'portfolio-brand_brand-power-results-export';
const ExportIcon = () => <StyledExportIcon />;

export const BrandPowerBookExport: React.FC = () => {
  useDataRefreshForTab('Brand Power Book - Power Book');
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(BRAND_POWER_BOOK_EXPORT_PAGE_NAME);
  const { dataFilters } = usePageFilterData(BRAND_POWER_BOOK_EXPORT_PAGE_NAME);
  const { isLoading: filtersLoading } = usePageFilterStatus(
    BRAND_POWER_BOOK_EXPORT_PAGE_NAME,
  );
  const country = useMemo(() => {
    return FilterDataAccessor.getInstance().getCountry(dataFilters, applied);
  }, [dataFilters, applied]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoadingData, setIsLoadingData] = useState({
    country: true,
    global: true,
  });

  const { lastDataRefreshKpisDate } = useLastDataRefresh();

  const quarterYearFull = useMemo(() => {
    if (!lastDataRefreshKpisDate.power) return '';
    return formatDateToQuarterYear(lastDataRefreshKpisDate.power, ' ', 0);
  }, [lastDataRefreshKpisDate]);

  const period = useMemo(() => {
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

  const { onExport, isExporting } = useExportPdf(
    useMemo(
      () => ({
        scale: 1.5,
        format: 'a4' as const,
        orientation: 'landscape' as const,
        margin: 0,
        preserveLinks: true,
        quality: 1,
        imageFormat: 'JPEG' as const,
        compression: true,
        improveCanvasQuality: true,
      }),
      [],
    ),
  );

  const handlePDFExport = useCallback(() => {
    onExport(
      Object.values(pageSections)
        .map((section) => document.querySelector(`[data-page-name=${section}]`))
        .filter(Boolean) as HTMLElement[],
    );
  }, [onExport]);

  const countries = useMemo(
    () => [
      {
        code: String(country?.value) || '',
        name: String(country?.label) || '',
      },
    ],
    [country?.value, country?.label],
  );

  const renderView = useCallback((): JSX.Element | null => {
    if (!countries[0].code) return null;

    return countries[0].code === 'ABI' ? (
      <GlobalView
        containerRef={containerRef}
        loadingCallback={setIsLoadingData}
      />
    ) : (
      <CountryView
        containerRef={containerRef}
        loadingCallback={setIsLoadingData}
      />
    );
  }, [countries, containerRef]);

  const isLoading = useMemo(() => {
    return countries[0].code === 'ABI'
      ? isLoadingData.global
      : isLoadingData.country;
  }, [isLoadingData, countries]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: BRAND_POWER_BOOK_EXPORT_PAGE_NAME,
          visibleFields: ['zone', 'country', 'time_frame'],
          dataTestId: 'brand-power-book-export-filter',
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/portfolio-brand',
              pageName: formatMessage({
                id: 'Pillars.pageName.portfolioBrand',
              }),
            },
            {
              href: '/portfolio-brand/brand-power-book-export',
              pageName: formatMessage({
                id: 'Sidebar.brandPowerBookExport',
              }),
            },
          ],
          showIcon: true,
        }}
        isExportPage
      />

      <StyledGridContainer isExportPage>
        <StyledGridItem xs={12} sm={12} md={12} lg={12} xl={12}>
          <StyledExportPageContent ref={containerRef} noMargin>
            <StyledExportPageHeader>
              <StyledExportButton
                variant="primary"
                size="medium"
                onClick={handlePDFExport}
                data-testid="refresh-button"
                isLoading={isExporting || isLoading}
                icon={ExportIcon}
                trailing
              >
                Export File
              </StyledExportButton>
            </StyledExportPageHeader>

            <StyledExportPageSection data-page-name={pageSections.cover}>
              <Cover
                category="One Way Reports"
                name="Brand Power Book"
                countries={countries}
                loading={filtersLoading}
                period={period}
                showLogo
              />
            </StyledExportPageSection>

            {renderView()}

            <StyledExportPageSection data-page-name={pageSections.backCover}>
              <Cover
                name="Thank You"
                centerLogo
                showLogo
                dataTestId={`${BRAND_POWER_BOOK_EXPORT_PAGE_NAME}-thank-you`}
              />
            </StyledExportPageSection>
          </StyledExportPageContent>
        </StyledGridItem>
      </StyledGridContainer>
    </>
  );
};
