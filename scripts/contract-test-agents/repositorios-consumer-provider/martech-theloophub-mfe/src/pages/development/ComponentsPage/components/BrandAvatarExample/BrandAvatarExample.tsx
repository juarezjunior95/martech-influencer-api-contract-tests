import { Heading } from '@hexa-ui/components';
import { BrandAvatarList } from 'components';
import {
  BrandAvatarItemsMock,
  BrandAvatarItemsNoBrandMock,
  BrandAvatarItemsNoDescriptionMock,
  BrandAvatarItemsNoFlagMock,
  BrandAvatarItemsWithImageNoDescriptionMock,
  CountryAvatarItemsMock,
} from 'components/BrandAvatar/__mocks/BrandAvatarMock';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const BrandAvatarExample = () => {
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Brand Avatars</Heading>
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...CountryAvatarItemsMock} />
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...BrandAvatarItemsMock} />
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...BrandAvatarItemsNoBrandMock} />
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...BrandAvatarItemsNoDescriptionMock} />
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...BrandAvatarItemsWithImageNoDescriptionMock} />
      </StyledSection>
      <StyledSection style={{ width: '600px', padding: '16px' }}>
        <BrandAvatarList {...BrandAvatarItemsNoFlagMock} />
      </StyledSection>
    </StyledContainer>
  );
};
