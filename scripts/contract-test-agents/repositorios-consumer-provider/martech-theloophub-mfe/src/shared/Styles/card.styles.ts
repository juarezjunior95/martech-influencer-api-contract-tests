import { Card } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledCard = styled(Card, {
  position: 'relative',
  borderRadius: '$4',
  minHeight: '56px',
  flex: 1,
});

export const StyledCardContainer = styled('div', {
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  border: '1px solid #1414141F',
  borderRadius: '16px',
  overflow: 'hidden',
  flex: 1,
});

export const StyledLeftContainer = styled('div', {
  width: '464px',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #1414141F',
});

export const StyledRightContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '746px',
});

export const StyledMainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backgroundColor: '#F9F9F9',
  borderRadius: '16px',
  border: '1px solid rgba(20, 20, 20, 0.08)',
  padding: '24px',

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
    noPaddingX: {
      true: {
        paddingLeft: '0px',
        paddingRight: '0px',
      },
      false: {},
    },
    noPaddingY: {
      true: {
        paddingTop: '0px',
        paddingBottom: '0px',
      },
      false: {},
    },
  },
});
