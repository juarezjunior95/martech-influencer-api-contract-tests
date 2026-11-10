import { FC, useRef } from 'react';

import { usePageIndexes } from 'hooks';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { CountryBrandsBreakdownSlide } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryBrandsBreakdownSlide';
import { CountryVolumeCover } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryVolumeCover/CountryVolumeCover';
import { CountryVolumeSlide } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryVolumeSlide';
import { ExportCountryPageHeader } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/ExportCountryPageHeader';
import { useCountryPageData } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/hooks';
import { CountryProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/types';
import { StyledExportPageContent } from 'shared/Styles/exportPages.styles';

export const Country: FC<CountryProps> = ({ dataTestId }) => {
  const { kpi, kpiName } = useVolumePagesKpi();
  const containerRef = useRef<HTMLDivElement>(null);
  const { getPageByName } = usePageIndexes(containerRef);
  const { data, country, monthYear, period, countryCoverLink } =
    useCountryPageData(kpi);

  useRegisterLoading('country-data', data.loading);

  const countryLabel = String(country?.label ?? '');
  const countryCode = String(country?.value ?? '');

  return (
    <div
      ref={containerRef}
      data-testid={dataTestId ? `tabpanel-country-${dataTestId}` : undefined}
    >
      <StyledExportPageContent
        data-testid={
          dataTestId
            ? `tabpanel-country-export-page-content-${dataTestId}`
            : undefined
        }
      >
        <ExportCountryPageHeader
          monthYear={monthYear}
          dataTestId={
            dataTestId
              ? `tabpanel-country-export-page-header-${dataTestId}`
              : undefined
          }
        />

        <CountryVolumeCover
          countryCoverLink={countryCoverLink}
          countryLabel={countryLabel}
          countryCode={countryCode}
          dataTestId={dataTestId}
          monthYear={monthYear}
          kpi={kpi}
        />

        <CountryVolumeSlide
          getPageByName={getPageByName}
          countryLabel={countryLabel}
          countryCode={countryCode}
          dataTestId={dataTestId}
          period={period}
          data={data}
          kpiName={kpiName}
        />

        <CountryBrandsBreakdownSlide
          getPageByName={getPageByName}
          countryLabel={countryLabel}
          countryCode={countryCode}
          dataTestId={dataTestId}
          period={period}
          data={data}
          kpiName={kpiName}
        />
      </StyledExportPageContent>
    </div>
  );
};
