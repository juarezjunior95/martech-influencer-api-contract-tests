import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledInsightsWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'stretch',
  flex: '1 1 0',
  minHeight: 0,
});

export const StyledInsightsContainer = styled('div', {
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(20, 20, 20, 0.12)',
  backgroundColor: '#FFFFFF',
  position: 'relative',
  height: '100%',
  zIndex: 1,

  variants: {
    titleRight: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
  },
});

export const StyledTitleInsight = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '24px 16px',
  backgroundColor: '#F7F3E5',
  fontSize: '20px',
  minWidth: '220px',
  height: 'auto',
  fontFamily: '$heading',
  color: '$interfaceLabelPrimary',
});

export const StyledContentInsight = styled('div', {
  flex: 1,
  padding: '20px 24px',
  color: '#141414',
  fontSize: '14px',
  lineHeight: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  minHeight: 0,

  ul: {
    margin: 0,
    paddingLeft: '20px',
  },

  li: {
    marginBottom: '8px',
  },
});

export const StyledIndexBadge = styled('div', {
  position: 'absolute',
  left: '-12px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '42px',
  height: '42px',
  borderRadius: '21px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(20, 20, 20, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#141414',
  zIndex: 2,
});

export const StyledContentWrapper = styled('div', {
  fontSize: '18px !important',
  lineHeight: '20px !important',
  fontFamily: '$paragraph',
  color: '$interfaceLabelPrimary',

  ul: {
    margin: 0,
    paddingLeft: '20px',
  },

  li: {
    marginBottom: '8px',
  },
});

export const StyledParagraph = styled(Paragraph, {
  fontSize: '18px !important',
  lineHeight: '20px !important',
});

export const StyledTitle = styled(Paragraph, {
  fontSize: '18px !important',
  lineHeight: '20px !important',
  fontWeight: 'bold !important',
});
