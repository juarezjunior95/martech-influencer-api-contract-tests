import { Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledStrategicInnovationTitle = styled(Heading, {
  marginBottom: '$6',
});
export const StyledHeaderContainer = styled('div', {
  fontWeight: 600,
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
  borderRadius: '16px 16px 0 0',
  borderBottom: '1px solid #14141429',
});

export const StyledStrategicInnovationContainer = styled('div', {
  display: 'flex',
  gap: '$2',
  width: '100%',
  flexWrap: 'wrap',
});
export const StyledStrategicInnovationHeader = styled('span', {
  fontSize: '20px !important',
  fontWeight: 600,
  lineHeight: '24px',
  color: theme.colors.txt.default,
  fontFamily: 'Barlow',
});

export const StyledStrategicInnovationItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  border: '1px solid #14141429',
  flex: 1,
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  variants: {
    variant: {
      default: {},
      portfolio: {
        flex: 2,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
