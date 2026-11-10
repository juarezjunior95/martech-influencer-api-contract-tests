import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledGrowthLeversItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '2px 12px',
  height: '64px',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  '&:last-child': {
    borderBottom: 'none',
  },

  variants: {
    alignItems: {
      default: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
    },
  },
});

export const StyledBigNumberContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  overflow: 'hidden',
  width: '100%',
  minWidth: 0,
});

export const StyledSmallText = styled(Paragraph, {
  color: '#5C5C5C !important',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

export const StyledVariationText = styled(Paragraph, {
  marginLeft: '4px',
  marginRight: '4px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});
