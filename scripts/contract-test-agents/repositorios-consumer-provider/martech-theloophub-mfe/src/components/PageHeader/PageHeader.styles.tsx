import { Heading, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledPageHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  margin: '1.7rem 0',
  gap: '4px',
});

export const StyledPageHeaderTitle = styled(Heading, {
  fontSize: '40px !important',
  fontWeight: 'bold',

  '@media (max-width: 1439px)': {
    fontSize: '32px !important',
  },
});

export const StyledPageSubtitle = styled(Paragraph, {
  fontSize: '18px',
  color: '#5C5C5C !important',
});
