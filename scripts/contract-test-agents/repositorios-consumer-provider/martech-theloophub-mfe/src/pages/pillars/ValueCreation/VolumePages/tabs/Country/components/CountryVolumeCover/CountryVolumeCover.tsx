import { FC } from 'react';
import { useIntl } from 'react-intl';

import { Cover } from 'components';
import { CountryVolumeCoverProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryVolumeCover/types';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/constants/sections';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

export const CountryVolumeCover: FC<CountryVolumeCoverProps> = ({
  countryCoverLink,
  countryLabel,
  countryCode,
  dataTestId,
  monthYear,
  kpi,
}) => {
  const { formatMessage } = useIntl();
  const kpiPagesLabel = formatMessage({
    id: `ValueCreation.PRPages.${kpi}`,
  });
  const countryMainCoverDataTestId = dataTestId
    ? `${dataTestId}-country-main-cover`
    : undefined;

  return (
    <StyledExportPageSection data-page-name={pageSections.countryMainCover}>
      <Cover
        dataTestId={countryMainCoverDataTestId}
        category="One Way Reports"
        name={`${countryLabel} ${kpiPagesLabel} Pages`}
        countries={[{ code: countryCode, name: countryLabel }]}
        period={monthYear.toUpperCase()}
        link={countryCoverLink}
        loading={false}
        showLogo
      />
    </StyledExportPageSection>
  );
};
