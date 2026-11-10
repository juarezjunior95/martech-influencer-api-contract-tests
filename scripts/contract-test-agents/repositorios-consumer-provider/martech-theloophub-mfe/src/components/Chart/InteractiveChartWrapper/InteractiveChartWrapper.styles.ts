import { keyframes, styled } from '@hexa-ui/theme';

const liftAnimation = keyframes({
  '0%': {
    transform: 'translateY(0)',
  },
  '100%': {
    transform: 'translateY(-8px)',
  },
});

const clipCutAnimation = keyframes({
  '0%': {
    clipPath:
      'polygon(' +
      'calc(var(--clip-left)) 0, ' +
      'calc(100% - var(--clip-right)) 0, ' +
      'calc(100% - var(--clip-right)) var(--chart-height-percent), ' +
      'calc(100% - var(--clip-right)) var(--chart-height-percent), ' +
      'calc(100% - var(--clip-right)) 100%, ' +
      'calc(var(--clip-left)) 100%, ' +
      'calc(var(--clip-left)) var(--chart-height-percent), ' +
      'calc(var(--clip-left)) var(--chart-height-percent)' +
      ')',
  },
  '100%': {
    clipPath:
      'polygon(' +
      'calc(var(--clip-left) + 8px) 0, ' +
      'calc(100% - var(--clip-right) - 8px) 0, ' +
      'calc(100% - var(--clip-right) - 8px) var(--chart-height-percent), ' +
      'calc(100% - var(--clip-right)) var(--chart-height-percent), ' +
      'calc(100% - var(--clip-right)) 100%, ' +
      'calc(var(--clip-left)) 100%, ' +
      'calc(var(--clip-left)) var(--chart-height-percent), ' +
      'calc(var(--clip-left) + 8px) var(--chart-height-percent)' +
      ')',
  },
});

const fadeInAnimation = keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const StyledInteractiveWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',

  variants: {
    fillHeight: {
      true: {
        height: '100%',
      },
      false: {
        height: 'auto',
      },
    },
  },

  defaultVariants: {
    fillHeight: false,
  },
});

export const StyledChartContainer = styled('div', {
  width: '100%',
  zIndex: 0,

  variants: {
    fillHeight: {
      true: {
        flex: 1,
        minHeight: 0,
      },
      false: {},
    },
  },

  defaultVariants: {
    fillHeight: false,
  },
});

export const StyledInteractiveColumn = styled('div', {
  position: 'absolute',
  zIndex: 5,
  cursor: 'pointer',
});

export const StyledColumnLiftWrapper = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 3,
  pointerEvents: 'none',
  overflow: 'hidden',

  variants: {
    show: {
      true: {},
      false: {
        opacity: 0,
      },
    },
    isHorizontal: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      show: true,
      isHorizontal: false,
      css: {
        animation: `${liftAnimation} 0.5s 0.15s ease forwards, ${clipCutAnimation} 0.5s ease forwards`,
      },
    },
    {
      show: true,
      isHorizontal: true,
      css: {
        clipPath: 'inset(calc(var(--clip-top)) 0 calc(var(--clip-bottom)) 0)',
      },
    },
  ],

  defaultVariants: {
    show: false,
    isHorizontal: false,
  },
});

export const StyledColumnMaskOverlay = styled('div', {
  position: 'absolute',
  zIndex: 2,
  pointerEvents: 'none',
  borderRadius: '24px',
  backgroundColor: '#FEFCF5',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
  opacity: 0,

  variants: {
    show: {
      true: {
        animation: `${fadeInAnimation} 0.3s ease forwards`,
      },
      false: {},
    },
  },
});

export const StyledColumnSelectedOverlay = styled('div', {
  position: 'absolute',
  zIndex: 2,
  pointerEvents: 'none',
  borderRadius: '24px',
  backgroundColor: '#E5B6110A',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
  opacity: 0,

  variants: {
    show: {
      true: {
        animation: `${fadeInAnimation} 0.3s ease forwards`,
      },
      false: {},
    },
  },
});

const TOOLTIP_OFFSET = 12;

export const StyledCursorTooltip = styled('div', {
  position: 'fixed',
  zIndex: 99999,
  pointerEvents: 'none',
  padding: '$2',
  borderRadius: '$1',
  maxWidth: '250px',
  color: '$interfaceForegroundLabelPrimary',
  fontFamily: '$paragraph',
  fontSize: '$2',
  fontLineHeight: '$2',
  backgroundColor: '#000000cc',
  whiteSpace: 'nowrap',
  transform: `translate(${TOOLTIP_OFFSET}px, ${TOOLTIP_OFFSET}px)`,
  boxSizing: 'border-box',
});

export const StyledLegendGrid = styled('div', {
  display: 'grid',
  width: '100%',
  paddingBottom: '8px',
});

export const StyledBoldLegendWrapper = styled('div', {
  '& p': {
    fontWeight: 500,
  },
});

export const StyledLegendItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  minWidth: 0,
  overflow: 'hidden',
  transition: 'opacity 0.15s ease',
  padding: '0 8px',

  '& p': {
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'clip',
    lineHeight: '14px',
    wordBreak: 'break-word',
  },

  variants: {
    isHovered: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0.4,
      },
    },
    isNeutral: {
      true: {
        opacity: 1,
      },
    },
  },

  defaultVariants: {
    isHovered: false,
    isNeutral: true,
  },
});
