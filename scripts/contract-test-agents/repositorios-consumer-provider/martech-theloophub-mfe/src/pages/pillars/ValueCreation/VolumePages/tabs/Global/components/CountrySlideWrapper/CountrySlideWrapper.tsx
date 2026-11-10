import { memo } from 'react';

import { CountrySlide } from 'pages/pillars/ValueCreation/VolumePages/components';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useCountrySlideData } from 'pages/pillars/ValueCreation/VolumePages/hooks/useCountrySlideData';

import { CountrySlideWrapperProps } from './types';

export const CountrySlideWrapper = memo(
  ({
    getPageByName,
    countryCode,
    dataTestId,
    subFilters,
    config,
    period,
  }: CountrySlideWrapperProps) => {
    const { kpi } = useVolumePagesKpi();
    const countryData = useCountrySlideData(kpi, subFilters);

    useRegisterLoading(
      `key-markets-country-${countryCode}`,
      countryData.loading,
    );

    return (
      <CountrySlide
        getPageByName={getPageByName}
        countryCode={countryCode}
        countryData={countryData}
        dataTestId={dataTestId}
        config={config}
        period={period}
      />
    );
  },
);

CountrySlideWrapper.displayName = 'CountrySlideWrapper';
