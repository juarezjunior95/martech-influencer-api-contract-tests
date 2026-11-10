import { useMemo } from 'react';

import { Divider } from '@hexa-ui/components';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { ALL_BRAND } from 'models/Filters';

import { BrandFlag } from '../BrandFlag';
import { CountryFlag } from '../CountryFlag';
import {
  StyledCountryBrandContainer,
  StyledDivider,
} from './CountryBrandFlag.styles';

interface CountryBrandFlagProps {
  brandFlagHidden?: boolean;
  dataTestId?: string;
}

export const CountryBrandFlag = ({
  brandFlagHidden = true,
  dataTestId,
}: CountryBrandFlagProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { brands } = applied || {};

  const isGlobalBrandsScopeSelected = useMemo(() => {
    return applied?.scope === 'global_brands';
  }, [applied]);

  return (
    <StyledCountryBrandContainer
      data-testid={dataTestId ? `country-brand-flag-${dataTestId}` : undefined}
    >
      <CountryFlag
        dataTestId={dataTestId ? `${dataTestId}-country-brand-flag` : undefined}
      />
      {((brands && brands !== ALL_BRAND) || isGlobalBrandsScopeSelected) &&
        brandFlagHidden && (
          <>
            <StyledDivider
              data-testid={
                dataTestId
                  ? `country-brand-flag-divider-${dataTestId}`
                  : undefined
              }
            >
              <Divider
                data-testid={
                  dataTestId
                    ? `country-brand-flag-divider-${dataTestId}`
                    : undefined
                }
                orientation="vertical"
              ></Divider>
            </StyledDivider>
            <BrandFlag
              dataTestId={dataTestId ? `${dataTestId}-brand-flag` : undefined}
            />
          </>
        )}
    </StyledCountryBrandContainer>
  );
};
