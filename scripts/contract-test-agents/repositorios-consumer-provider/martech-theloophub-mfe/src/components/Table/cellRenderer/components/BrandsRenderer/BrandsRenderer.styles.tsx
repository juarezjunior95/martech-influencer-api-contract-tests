import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledBrandsContainer = styled('div', {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$4',
});

export const StyleBrandTooltipContainer = styled('div', {
  background: '#141414',
  color: '#ffffff',
  padding: '0 8px',
  borderRadius: '$2',
  fontSize: '$1',
  fontFamily: '$paragraph',
});

export const StyledBrandsItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$1',
  position: 'relative',
});

export const StyledBrandsImg = styled('img', {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  border: '1px solid #1414141F',

  variants: {
    country: {
      false: {},
      true: {
        position: 'absolute',
        width: '16px',
        height: '16px',
        right: '50%',
        transform: 'translateX(28px)',
      },
    },
  },
});

export const StyledBrandsVariation = styled('p', {
  fontSize: '$1',
  lineHeight: '$3',
  color: '$interfaceLabelPrimary',
  margin: 0,
  variants: {
    variation: {
      up: {
        color: theme.colors.green.high,
      },
      down: {
        color: theme.colors.red.high,
      },
    },
  },
});
