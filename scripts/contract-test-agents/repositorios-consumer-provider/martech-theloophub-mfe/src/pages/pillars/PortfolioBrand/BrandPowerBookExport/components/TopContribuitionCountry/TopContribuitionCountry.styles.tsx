import { styled } from '@hexa-ui/theme';

export const StyledCountryContributionContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(20, 20, 20, 0.12)',
  paddingBottom: '16px',
  backgroundColor: '#FFFFFF',

  variants: {
    loading: {
      true: {
        paddingBottom: '0',
      },
    },
  },

  '& > *:first-child': {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
});

export const StyledWaterfallContainer = styled('div', {
  width: '100%',
  height: '140px',
  borderBottom: '1px solid rgba(20, 20, 20, 0.12)',
});

export const StyledCaptionFlagGrid = styled('div', {
  display: 'grid',
  gap: '6px 8px',
  marginBottom: '15px',
  paddingLeft: '20px',
  paddingRight: '15px',
});

export const StyledAvatarContainer = styled('div', {
  alignItems: 'center',
  paddingLeft: '20px',
  paddingRight: '16px',
  marginBottom: '15px',
});

export const StyledLegend = styled('div', {
  padding: '8px 12px',
});
