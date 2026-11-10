import CommingSoonIcon from 'assets/comming-soon.svg';

import {
  StyledEmptySection,
  StyledEmptySectionContainer,
} from './EmptySection.styles';

export const EmptySection: React.FC = () => {
  return (
    <StyledEmptySectionContainer>
      <StyledEmptySection
        title="The Drivers view & data is coming soon!"
        customIlustration={{
          alt: 'no data yet',
          height: '256px',
          src: CommingSoonIcon,
          width: '256px',
        }}
      />
    </StyledEmptySectionContainer>
  );
};
