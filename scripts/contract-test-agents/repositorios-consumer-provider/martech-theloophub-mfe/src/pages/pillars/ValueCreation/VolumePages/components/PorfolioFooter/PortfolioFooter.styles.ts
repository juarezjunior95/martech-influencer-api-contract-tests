import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledPortfolioFooterContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  '&:not(:last-child)': {
    marginBottom: '12px',
  },
});

export const StyledCard = styled('div', {
  position: 'relative',
  padding: '16px',
  borderRadius: '16px',
  height: '62px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF',
  border: '1px solid #14141429',

  variants: {
    type: {
      portfolio: {
        width: '240px',
      },
      data: {
        width: '346px',
      },
    },
    darkBg: {
      true: {
        backgroundColor: '#E2E7EA',
      },
    },
  },
});

export const StyledComparisonContainer = styled('div', {
  height: '17px',
  borderRadius: '999px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #14141429',
  backgroundColor: '#FFF',
  position: 'absolute',
  top: '-9px',
  left: '8px',
  padding: '0 4px',
});

export const StyledComparisonText = styled(Paragraph, {
  fontSize: '10px',
  color: '#5C5C5C !important',
});

export const StyledSubtitle = styled(Paragraph, {
  fontSize: '12px',
  color: '#5C5C5C !important',
});

export const StyledValue = styled(Paragraph, {
  fontSize: '18px',
});
