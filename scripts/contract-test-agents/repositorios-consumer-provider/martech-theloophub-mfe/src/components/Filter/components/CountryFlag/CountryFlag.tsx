import { useEffect, useState } from 'react';

import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { StyledFlag } from 'shared/Styles';
import { getCountryAssetImageUrl, getRegionIdentifier } from 'utils/filter';

interface CountryFlagProps {
  dataTestId?: string;
}

export const CountryFlag = ({ dataTestId }: CountryFlagProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const [countryImageUrl, setCountryImageUrl] = useState<string | null>(null);

  const region = getRegionIdentifier(applied?.zone, applied?.country);
  const regionCode = typeof region === 'string' ? region : null;

  useEffect(() => {
    let cancelled = false;

    if (!regionCode) {
      setCountryImageUrl(null);
      return undefined;
    }

    getCountryAssetImageUrl(regionCode).then((url) => {
      if (!cancelled) setCountryImageUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [regionCode]);

  if (!regionCode) return null;
  if (!countryImageUrl) return null;

  return (
    <StyledFlag
      data-testid={dataTestId ? `country-flag-${dataTestId}` : undefined}
      src={countryImageUrl}
      alt={regionCode}
    />
  );
};
