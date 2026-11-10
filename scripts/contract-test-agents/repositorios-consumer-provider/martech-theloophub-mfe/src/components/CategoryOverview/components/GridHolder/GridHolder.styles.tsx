import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const ContainerGridHolder = styled('div', {
  height: '100%',
});

export const WapperGridHolder = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const GridHolder = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  color: '#374151',
  width: '123px',
  rowGap: '0px',

  'p:nth-child(5)': {
    borderRight: '1px solid #E0E0E0',
  },

  'p:nth-child(8)': {
    borderTop: '1px solid #E0E0E0',
    borderRight: '1px solid #E0E0E0',
  },

  'p:nth-child(9)': {
    borderTop: '1px solid #E0E0E0',
  },
});

export const LabelHolder = styled(Paragraph, {
  textAlign: 'center !important',

  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#141414',

  variants: {
    isExportPage: {
      true: {
        fontSize: '14px',
      },
    },
  },
});

export const ValueHolder = styled(Paragraph, {
  textAlign: 'center !important',

  fontWeight: '600',
  fontSize: '12px',
  lineHeight: '18px',
  color: '#1414148F',

  variants: {
    direction: {
      up: {
        color: '#00810D',
      },
      down: {
        color: '#A20A0A',
      },
    },
    isExportPage: {
      true: {
        fontSize: '14px',
        padding: '0 14px',
      },
    },
  },
});

export const BalancedChoicesFooter = styled(Paragraph, {
  textAlign: 'end !important',
  fontSize: '10px',
  fontWeight: '400',
  color: '#7B7B7B !important',
  marginRight: '0.55rem',
  height: '24px',
});
