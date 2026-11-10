import React, { useEffect, useState } from 'react';

import Logo from 'assets/logo.png';
import { Skeleton } from 'components';
import { StyledFlag } from 'shared/Styles';
import { getCountryAssetImageUrl } from 'utils';
import { createDataTestId } from 'utils/test/createDataTestId';

import {
  StyledCoverBlackParagraph,
  StyledCoverContainer,
  StyledCoverCountryItem,
  StyledCoverCountryItemSeparator,
  StyledCoverCountrySection,
  StyledCoverFooter,
  StyledCoverHeading,
  StyledCoverLink,
  StyledCoverMainSection,
  StyledCoverParagraph,
  StyledLogoContainer,
  StyledSmallCoverParagraph,
} from './Cover.styles';

interface Country {
  code: string;
  name: string;
}

interface CoverProps {
  category?: string;
  name?: string;
  subname?: string;
  countries?: Country[];
  period?: string | React.ReactNode;
  showLogo?: boolean;
  showLink?: boolean;
  link?: string;
  centerLogo?: boolean;
  centerText?: boolean;
  loading?: boolean;
  dataTestId?: string;
}

interface CoverCountryFlagProps {
  code: string;
  name: string;
  dataTestId?: string;
  index: number;
}

const CoverCountryFlag: React.FC<CoverCountryFlagProps> = ({
  code,
  name,
  dataTestId,
  index,
}) => {
  const [countryImageUrl, setCountryImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!code?.trim()) {
      setCountryImageUrl(null);
      return undefined;
    }

    getCountryAssetImageUrl(code).then((url) => {
      if (!cancelled) setCountryImageUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!code?.trim()) return null;
  if (!countryImageUrl) return null;

  return (
    <StyledFlag
      data-testid={createDataTestId(dataTestId, `country-flag-${index}`)}
      src={countryImageUrl}
      alt={`${name} flag`}
    />
  );
};

export const Cover: React.FC<CoverProps> = ({
  category,
  name,
  subname,
  countries,
  period,
  showLogo,
  showLink = true,
  link = '/',
  centerLogo = false,
  centerText = false,
  loading,
  dataTestId,
}) => {
  const categoryAndNameClass = category && name ? 'category-and-name' : '';

  if (loading)
    return (
      <Skeleton
        width="1668px"
        height="938px"
        length={1}
        dataTestId={createDataTestId(dataTestId, 'skeleton')}
        borderRadius="none"
      />
    );

  const renderCountries = () => {
    return countries.map((country, index) => (
      <React.Fragment key={country.code}>
        {country.code && (
          <>
            {index > 0 && <StyledCoverCountryItemSeparator />}
            <StyledCoverCountryItem
              data-testid={createDataTestId(
                dataTestId,
                `country-item-${index}`,
              )}
            >
              <CoverCountryFlag
                code={country.code}
                name={country.name}
                dataTestId={dataTestId}
                index={index}
              />
              <StyledCoverBlackParagraph
                data-testid={createDataTestId(
                  dataTestId,
                  `country-name-${index}`,
                )}
              >
                {country.name.toUpperCase()}
              </StyledCoverBlackParagraph>
            </StyledCoverCountryItem>
          </>
        )}
      </React.Fragment>
    ));
  };

  return (
    <StyledCoverContainer data-testid={dataTestId}>
      <StyledCoverMainSection
        data-testid={createDataTestId(dataTestId, 'main-section')}
        className={`${category ? categoryAndNameClass : 'no-category'}`}
      >
        {category && (
          <StyledCoverParagraph
            data-testid={createDataTestId(dataTestId, 'category')}
            style={{ fontSize: '40px' }}
            centerText={centerText}
          >
            {category}
          </StyledCoverParagraph>
        )}

        {name && (
          <StyledCoverHeading
            size="H2"
            style={{ fontSize: '96px' }}
            centerText={centerText}
            data-testid={createDataTestId(dataTestId, 'name')}
          >
            {name}
          </StyledCoverHeading>
        )}

        {subname && (
          <StyledCoverHeading
            size="H2"
            style={{ fontSize: '64px' }}
            centerText={centerText}
            data-testid={createDataTestId(dataTestId, 'subname')}
          >
            {subname}
          </StyledCoverHeading>
        )}

        {countries && (
          <StyledCoverCountrySection
            data-testid={createDataTestId(dataTestId, 'country-section')}
          >
            {renderCountries()}
          </StyledCoverCountrySection>
        )}
      </StyledCoverMainSection>

      <StyledCoverFooter data-testid={createDataTestId(dataTestId, 'footer')}>
        {period && (
          <StyledCoverParagraph
            style={{ fontSize: '36px' }}
            data-testid={createDataTestId(dataTestId, 'period')}
          >
            {period}
          </StyledCoverParagraph>
        )}
        {showLogo && (
          <StyledLogoContainer
            centerLogo={centerLogo}
            data-testid={createDataTestId(dataTestId, 'logo-container')}
          >
            <img
              src={Logo}
              alt="One Way"
              data-testid={createDataTestId(dataTestId, 'logo')}
            />
            {showLink && (
              <StyledSmallCoverParagraph
                data-testid={createDataTestId(dataTestId, 'link-text')}
              >
                <StyledCoverLink
                  to={link}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Click here
                </StyledCoverLink>{' '}
                to unlock insights on the One Way Platform
              </StyledSmallCoverParagraph>
            )}
          </StyledLogoContainer>
        )}
      </StyledCoverFooter>
    </StyledCoverContainer>
  );
};
