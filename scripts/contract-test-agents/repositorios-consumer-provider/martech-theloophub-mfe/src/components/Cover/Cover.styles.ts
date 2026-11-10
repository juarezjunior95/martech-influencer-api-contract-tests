import { Link } from 'react-router-dom';

import { Heading, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import CoverBackground from 'assets/img/cover-background.svg';

export const StyledCoverContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '938px',
  padding: '0 160px',
  background: ' #000000',
  backgroundImage: `url(${CoverBackground})`,
  backgroundSize: 'cover',
});

export const StyledCoverHeading = styled(Heading, {
  color: '#FFFFFF !important',
  lineHeight: '120% !important',
  fontFamily: "'Avantt', sans-serif",
  fontWeight: 700,

  variants: {
    centerText: {
      true: { textAlign: 'center' },
      false: { textAlign: 'left' },
    },
  },
});

export const StyledCoverParagraph = styled(Paragraph, {
  fontFamily: "'Avantt', sans-serif",
  color: '#FFFFFF !important',
  lineHeight: '120% !important',

  variants: {
    centerText: {
      true: { textAlign: 'center' },
      false: { textAlign: 'left' },
    },
  },
});

export const StyledCoverBlackParagraph = styled(Paragraph, {
  fontFamily: "'Avantt', sans-serif",
  fontWeight: '600 !important',
  fontSize: '24px !important',
  lineHeight: '120% !important',
});

export const StyledCoverMainSection = styled('div', {
  paddingTop: '125px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '144px',

  '&.no-category': {
    marginTop: '274px',
  },

  '&.category-and-name': {
    marginTop: '212px',
  },
});

export const StyledCoverCountrySection = styled('div', {
  background: '#FFFFFF',
  padding: '12px 22px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '32px',
  justifyContent: 'space-between',
  borderRadius: '36px',
  width: 'max-content',
  marginTop: '24px',
});

export const StyledCoverCountryItem = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
});

export const StyledCoverCountryItemSeparator = styled('div', {
  width: '8px',
  height: '8px',
  background: '#000000',
  borderRadius: '50%',
});

export const StyledCoverFooter = styled('div', {
  paddingBottom: '90px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 'auto',
});

export const StyledLogoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',

  variants: {
    centerLogo: {
      true: { margin: '0 auto' },
      false: { marginLeft: 'auto' },
    },
  },
});

export const StyledSmallCoverParagraph = styled(Paragraph, {
  fontSize: '12px',
  color: '#FFFFFF !important',
  width: 'max-content',
});

export const StyledCoverLink = styled(Link, {
  color: '#FFFFFF !important',
});
