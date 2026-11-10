import { useIntl } from 'react-intl';

import { DataStateHandler } from 'components';
import { CaptionWithFlag } from 'components/CaptionWithFlag/CaptionWithFlag';
import { Waterfall } from 'components/Chart/Bar/Waterfall';
import { VariationCaption } from 'components/VariationCaption/VariationCaption';
import { useBffData, usePageFilterApplied } from 'hooks';
import { ContentHeader } from 'pages/components';
import { SharedKpis } from 'pages/enums';
import { BRAND_POWER_BOOK_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandPowerBook/BrandPowerBook';

import * as S from './CountryContribution.styles';

export interface CountryContributionData {
  data: number[];
  labels: {
    value: string;
    image: string;
    country?: string;
  }[];
  variationCaptions: {
    title: string;
    subtitle: string;
    data: {
      value: string;
      unit_of_measure: string;
      color: string;
    }[];
  }[];
  empty?: boolean;
}

interface CountryContributionProps {
  dataTestId?: string;
}

export const CountryContribution = ({
  dataTestId,
}: CountryContributionProps = {}) => {
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(BRAND_POWER_BOOK_PAGE_NAME);

  const bffData = useBffData({
    id: SharedKpis.BFF.COUNTRY_CONTRIBUTION,
    kpiGroup: 'power',
    subFilters: {
      page_filter: applied?.sub_scopes || 'All',
    },
  });

  const countriesContribution = bffData.data?.countriesContribution as
    CountryContributionData | undefined;

  const waterfallLabels =
    countriesContribution?.labels?.map(
      (label) => label.value || label.country,
    ) || [];

  return (
    <S.StyledCountryContributionContainer
      loading={bffData.loading}
      data-testid={dataTestId}
    >
      <ContentHeader
        title={formatMessage({
          id: 'PortfolioBrand.BrandPowerBook.PowerBook.CountryContribution.title',
        })}
        subtitle={formatMessage({
          id: 'PortfolioBrand.BrandPowerBook.PowerBook.CountryContribution.subtitle',
        })}
      />
      <DataStateHandler
        loading={bffData.loading}
        error={bffData.error}
        empty={countriesContribution?.empty}
        skeletonProps={{
          length: 1,
          width: '1262px',
          height: '533px',
          borderRadius: 'none',
        }}
      >
        <S.StyledWaterfallContainer>
          <Waterfall
            values={countriesContribution?.data || []}
            decimalPlaces={2}
            labels={waterfallLabels}
            showLabels={false}
            options={{
              layout: {
                padding: { left: 18, top: 49, bottom: 0, right: 10 },
              },
              plugins: {
                connectBars: {
                  color: 'rgba(20, 20, 20, 0.5)',
                },
              },
            }}
            colors={{
              first: '#e2e7ea',
              last: '#54616d',
              retained: '#D1A33C',
              negative: '#af4848',
              positive: '#417575',
            }}
          />
        </S.StyledWaterfallContainer>

        <S.StyledCaptionFlagGrid
          style={{
            gridTemplateColumns: `repeat(${waterfallLabels.length}, 1fr)`,
          }}
        >
          {countriesContribution?.labels?.map((label, index) => (
            <CaptionWithFlag
              key={`${label.value}-${index}`}
              label={label.value}
              flag={label.image}
            />
          ))}
        </S.StyledCaptionFlagGrid>

        <VariationCaption
          variationCaptionData={countriesContribution?.variationCaptions}
          gridColumnsCount={waterfallLabels.length}
        />
      </DataStateHandler>
    </S.StyledCountryContributionContainer>
  );
};
