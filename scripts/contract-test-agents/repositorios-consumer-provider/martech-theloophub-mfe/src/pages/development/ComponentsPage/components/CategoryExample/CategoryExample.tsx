import { Heading } from '@hexa-ui/components';
import { CategoryGrowthLevers } from 'components';
import {
  categoryGrowthLeversFiveKpisMock,
  categoryGrowthLeversMock,
  categoryGrowthLeversNoImageMock,
  categoryGrowthLeversNoVariationMock,
} from 'components/CategoryGrowthLevers/__mocks/categoryGrowthLeversMock';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const CategoryExample = () => {
  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Category Growth Levers</Heading>
      </StyledSection>
      <StyledSection>
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />
        <CategoryGrowthLevers {...categoryGrowthLeversNoImageMock} />
        <CategoryGrowthLevers {...categoryGrowthLeversNoVariationMock} />
        <CategoryGrowthLevers {...categoryGrowthLeversFiveKpisMock} />
      </StyledSection>
    </StyledContainer>
  );
};
