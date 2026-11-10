import { useEffect, useState } from 'react';

import { Heading } from '@hexa-ui/components';
import { Calendar } from '@hexa-ui/icons2';
import { BrandImg } from 'components/BrandImg';
import { useBrandImage } from 'hooks';
import { StyledRowContainer } from 'shared/Styles';
import { getCountryAssetImageUrl } from 'utils';

import {
  StyledCalendarIcon,
  StyledDivider,
  StyledDot,
  StyledFlagContainer,
  StyledHeaderFlag,
  StyledHeadlineText,
  StyledHorizontalDivider,
  StyledMeasureText,
  StyledPeriodText,
  StyledSpacedContainer,
  StyledVerticalDivider,
} from './Header.styles';

export interface HeaderProps {
  title: string;
  measure?: string;
  headline?: string;
  period?: string;
  countryId?: string;
  countryId2?: string;
  brandId?: string;
  divider?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  measure,
  headline,
  period,
  countryId,
  countryId2,
  brandId,
  divider = true,
}) => {
  const [countryImageUrl, setCountryImageUrl] = useState<string | null>(null);
  const [country2ImageUrl, setCountry2ImageUrl] = useState<string | null>(null);
  const brandImageUrl = useBrandImage(brandId) ?? '';

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [url1, url2] = await Promise.all([
        countryId ? getCountryAssetImageUrl(countryId) : Promise.resolve(null),
        countryId2
          ? getCountryAssetImageUrl(countryId2)
          : Promise.resolve(null),
      ]);
      if (!cancelled) {
        setCountryImageUrl(url1);
        setCountry2ImageUrl(url2);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [countryId, countryId2]);

  return (
    <div data-header>
      <StyledSpacedContainer>
        <StyledRowContainer>
          {period && (
            <>
              <StyledCalendarIcon icon={Calendar} />
              <StyledPeriodText>{period}</StyledPeriodText>
              <StyledVerticalDivider />
            </>
          )}
          <Heading size="H3">{title}</Heading>
          {measure && <StyledMeasureText>{measure}</StyledMeasureText>}
        </StyledRowContainer>
        <StyledFlagContainer>
          {brandId && brandImageUrl && (
            <BrandImg
              src={brandImageUrl}
              alt={brandId}
              width="32px"
              height="32px"
            />
          )}

          {countryId2 && country2ImageUrl && (
            <StyledHeaderFlag
              data-testid="country-flag"
              src={country2ImageUrl}
              alt={`${countryId2} flag`}
            />
          )}

          {(brandId || countryId2) && countryId && <StyledDivider />}

          {countryId && countryImageUrl && (
            <StyledHeaderFlag
              data-testid="country-flag"
              src={countryImageUrl}
              alt={`${countryId} flag`}
            />
          )}
        </StyledFlagContainer>
      </StyledSpacedContainer>
      {divider && <StyledHorizontalDivider />}
      {headline && (
        <StyledRowContainer marginBottom={'sm'}>
          <StyledDot />
          <StyledHeadlineText size="H5">{headline}</StyledHeadlineText>
        </StyledRowContainer>
      )}
    </div>
  );
};
