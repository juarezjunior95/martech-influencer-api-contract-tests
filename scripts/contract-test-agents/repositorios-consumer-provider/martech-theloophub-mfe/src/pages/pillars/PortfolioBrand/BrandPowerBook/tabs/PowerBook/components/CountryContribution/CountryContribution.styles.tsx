import { styled } from '@hexa-ui/theme';

export const StyledCountryContributionContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  border: '1px solid rgba(20, 20, 20, 0.12)',
  paddingBottom: '16px',

  variants: {
    loading: {
      true: {
        paddingBottom: '0',
      },
    },
  },
});

export const StyledWaterfallContainer = styled('div', {
  width: '100%',
  height: '260px',
  borderBottom: '1px solid rgba(20, 20, 20, 0.12)',
  marginBottom: '16px',
});

export const StyledCaptionFlagGrid = styled('div', {
  display: 'grid',
  gap: '6px 8px',
  marginBottom: '8px',
  paddingLeft: '20px',
  paddingRight: '15px',
});
