import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledComparisonLineContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  '& > div:first-child': {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },

  '& > div:last-child': {
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },

  '& > div + div': {
    borderTop: 'none',
  },

  variants: {
    striped: {
      true: {
        '& > div:nth-child(even)': {
          backgroundColor: '#14141405',
        },
      },
    },
  },
});

export const StyledComparisonLine = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  border: '1px solid #EDEDED',
  padding: '12px 8px',
});

export const StyledComparisonLineTitleContainer = styled('div', {
  position: 'absolute',
  top: 0,
  left: 8,
  transform: 'translateY(-50%)',
  border: '1px solid #EDEDED',
  borderRadius: '512px',
  padding: '2px',
  background: 'white',

  '@media (min-width: 1920px)': {
    padding: '4px',
  },
});

export const StyledComparisonLineTitle = styled(Paragraph, {
  color: '#5C5C5C',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '10px !important',
});

export const StyledComparisonLineValue = styled(Paragraph, {
  fontSize: '10px !important',
  lineHeight: '10px !important',
  textAlign: 'center !important',

  '@media (min-width: 1920px)': {
    fontSize: '12px !important',
    lineHeight: '12px !important',
  },

  variants: {
    size: {
      default: {},
      small: {
        fontSize: '12px !important',
        lineHeight: '12px !important',
        paddingLeft: '4px',
      },
      medium: { fontSize: '14px !important', lineHeight: '14px !important' },
      large: { fontSize: '16px !important', lineHeight: '16px !important' },
    },
  },
});

export const StyledComparisonLineBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  padding: '4px 11px',
  width: 'fit-content',
  margin: '0 auto',

  borderRadius: '4px',

  fontFamily: "'Work Sans', sans-serif",
  fontSize: '12px',
  fontWeight: '500',
  lineHeight: '18px !important',

  '@media (min-width: 1920px)': {
    fontSize: '12px',
  },

  variants: {
    badgeColor: {
      positive: {
        backgroundColor: '#E6F4EA',
        color: '#00810d',
      },
      neutral: {
        backgroundColor: '#F2F3F4',
        color: 'rgba(20, 20, 20, 0.56)',
      },
      negative: {
        backgroundColor: '#FEE2E2',
        color: '#B91C1C',
      },
    },
  },
});

export const StyledTooltipInfoIcon = styled('div', {
  marginLeft: '3px',

  '& > div': {
    width: '11.5px',
    height: '11.5px',
  },

  '& > div > svg': {
    width: '11.5px',
    height: '11.5px',
  },

  '& path': {
    fill: theme.colors.charts.bg.neutrals['60'],
  },
});
