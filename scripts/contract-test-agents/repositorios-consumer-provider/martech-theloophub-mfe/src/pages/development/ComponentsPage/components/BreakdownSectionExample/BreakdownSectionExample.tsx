import { Heading } from '@hexa-ui/components';
import dataFailedImage from 'assets/data-failed.svg';
import errorImage from 'assets/error.png';
import { NoResultsState } from 'components/NoResultsState';
import { BreakdownSection } from 'pages/components/BreakdownSection';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';
import {
  FULL_WIDTH_OVERRIDES,
  MOCK_DESCRIPTION_VALUES,
  mockTiers,
  mockTiersNoData,
} from './BreakdownSectionExample.mock';

const noop = () => {
  return null;
};

export const BreakdownSectionExample = () => {
  return (
    <StyledContainer style={{ backgroundColor: '#ffffff', width: '1440px' }}>
      <StyledSection>
        <Heading>Breakdown Section - Participation (with Halo)</Heading>
      </StyledSection>
      <StyledSection>
        <BreakdownSection
          variant="participation"
          tiers={mockTiers}
          loading={false}
          error={null}
          dataTestId="example-participation"
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - Occasions (without Halo)</Heading>
      </StyledSection>
      <StyledSection>
        <BreakdownSection
          variant="occasions"
          tiers={mockTiers}
          loading={false}
          error={null}
          dataTestId="example-occasions"
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - Brand Power (No Data)</Heading>
      </StyledSection>
      <StyledSection>
        <BreakdownSection
          variant="brandPower"
          tiers={mockTiersNoData}
          loading={false}
          error={null}
          dataTestId="example-brand-power"
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - Loading State</Heading>
      </StyledSection>
      <StyledSection>
        <BreakdownSection
          variant="participation"
          tiers={[]}
          loading
          error={null}
          dataTestId="example-loading"
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - No Country Data</Heading>
      </StyledSection>
      <StyledSection>
        <NoResultsState
          type="audienceTargeting"
          openModal={noop}
          onSecondaryClick={noop}
          descriptionValues={MOCK_DESCRIPTION_VALUES}
          headerTitleId="Consumer.AudienceTargeting.Empty.noCountryDataTitle"
          descriptionId="Consumer.AudienceTargeting.Empty.noCountryDataDescription"
          buttonTextId="Consumer.AudienceTargeting.Empty.returnToHome"
          secondaryButtonTextId="Consumer.AudienceTargeting.Empty.resetFilters"
          dataTestId="example-no-country-data"
          overrides={FULL_WIDTH_OVERRIDES}
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - No Country Data (No Access)</Heading>
      </StyledSection>
      <StyledSection>
        <NoResultsState
          type="audienceTargeting"
          openModal={noop}
          descriptionValues={MOCK_DESCRIPTION_VALUES}
          headerTitleId="Consumer.AudienceTargeting.Empty.noCountryDataTitle"
          descriptionId="Consumer.AudienceTargeting.Empty.noCountryDataNoAccessDescription"
          buttonTextId="Consumer.AudienceTargeting.Empty.returnToHome"
          buttonVariant="secondary"
          dataTestId="example-no-country-no-access"
          overrides={FULL_WIDTH_OVERRIDES}
        />
      </StyledSection>

      <StyledSection>
        <Heading>
          Breakdown Section - Permission Required (Has Other Countries)
        </Heading>
      </StyledSection>
      <StyledSection>
        <NoResultsState
          type="audienceTargeting"
          openModal={noop}
          onSecondaryClick={noop}
          imageSrc={errorImage}
          descriptionValues={MOCK_DESCRIPTION_VALUES}
          headerTitleId="Consumer.AudienceTargeting.Empty.permissionRequiredTitle"
          descriptionId="Consumer.AudienceTargeting.Empty.permissionRequiredDescription"
          buttonTextId="Consumer.AudienceTargeting.Empty.returnToHome"
          secondaryButtonTextId="Consumer.AudienceTargeting.Empty.resetFilters"
          dataTestId="example-permission-required-other-countries"
          overrides={{ container: { width: '100%' } }}
        />
      </StyledSection>

      <Heading>
        Breakdown Section - Permission Required (No Other Access)
      </Heading>
      <StyledSection>
        <NoResultsState
          type="audienceTargeting"
          openModal={noop}
          imageSrc={errorImage}
          descriptionValues={MOCK_DESCRIPTION_VALUES}
          headerTitleId="Consumer.AudienceTargeting.Empty.permissionRequiredTitle"
          descriptionId="Consumer.AudienceTargeting.Empty.permissionRequiredNoOtherAccessDescription"
          buttonTextId="Consumer.AudienceTargeting.Empty.returnToHome"
          buttonVariant="secondary"
          dataTestId="example-permission-required-no-access"
          overrides={FULL_WIDTH_OVERRIDES}
        />
      </StyledSection>

      <StyledSection>
        <Heading>Breakdown Section - Data Refresh Failed</Heading>
      </StyledSection>
      <StyledSection>
        <NoResultsState
          type="audienceTargeting"
          openModal={noop}
          onSecondaryClick={noop}
          imageSrc={dataFailedImage}
          headerTitleId="Consumer.AudienceTargeting.Empty.dataRefreshFailedTitle"
          descriptionId="Consumer.AudienceTargeting.Empty.dataRefreshFailedDescription"
          buttonTextId="Consumer.AudienceTargeting.Empty.returnToHome"
          secondaryButtonTextId="Consumer.AudienceTargeting.Empty.refreshPage"
          secondaryButtonVariant="primary"
          dataTestId="example-data-refresh-failed"
          overrides={FULL_WIDTH_OVERRIDES}
        />
      </StyledSection>
    </StyledContainer>
  );
};
