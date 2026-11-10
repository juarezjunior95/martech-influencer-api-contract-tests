import { styled } from '@hexa-ui/theme';

export const StyledChartLegendContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: 12,

  variants: {
    orientation: {
      vertical: {
        flexDirection: 'column',
        alignItems: 'start',
      },
      horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  },
});

export const StyledChartLegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  justifyContent: 'center',

  variants: {
    clickeable: {
      true: {
        cursor: 'pointer',
      },
      false: {},
    },
  },
});

export const StyledChartLegendLabel = styled('span', {
  fontSize: '12px',
  lineHeight: '12px',
  fontFamily: '$paragraph',
  color: '#141414',
  textDecoration: 'none',
  margin: 0,

  variants: {
    size: {
      small: {
        fontSize: '10px',
        lineHeight: '10px',
      },
      medium: {
        fontSize: '12px',
        lineHeight: '12px',
      },
      large: { fontSize: '14px', lineHeight: '14px' },
    },
    strike: {
      true: {
        textDecoration: 'line-through',
      },
      false: {},
    },
    fontWeight: {
      normal: { fontWeight: 400 },
      medium: { fontWeight: 500 },
      semibold: { fontWeight: 600 },
      bold: { fontWeight: 700 },
    },
  },
});

export const StyledChartLegendShape = styled('div', {
  display: 'grid',
  placeItems: 'center',
  width: '12px',
  height: '12px',
  borderRadius: '2px',

  variants: {
    type: {
      rectangle: {
        width: '16px',
        height: '8px',
        '&.large': { width: '24px', height: '12px' },
        '&.small': { width: '12px', height: '6px' },
      },
      circle: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        '&.large': { width: '12px', height: '12px' },
        '&.small': { width: '4px', height: '4px' },
      },
      square: {
        width: '10px',
        height: '10px',
        '&.large': { width: '12px', height: '12px' },
        '&.small': { width: '8px', height: '8px' },
      },
      thinPill: {
        width: '12px',
        height: '4px',
        borderRadius: '999px',
        '&.large': { width: '16px', height: '4px' },
        '&.small': { width: '8px', height: '4px' },
      },
      pill: {
        width: '16px',
        height: '8px',
        borderRadius: '999px',
        '&.large': { width: '24px', height: '16px' },
        '&.small': { width: '12px', height: '8px' },
      },
    },
  },
});

export const StyledChartLegendLayer = styled('div', {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  '&.large': { width: '8px', height: '8px' },
  '&.small': { width: '4px', height: '4px' },
});
