import { TemplateSlide } from 'components';

import { StyledSection } from '../../ComponentsPage.styles';

export const TemplateSlideExample = () => {
  return (
    <TemplateSlide
      title="Template Slide"
      period="Aug'25"
      headline="Example Headline"
      footnotes="Example footnote"
      page={1}
      countryId="ABI"
    >
      <StyledSection style={{ height: '600px' }} />
    </TemplateSlide>
  );
};
