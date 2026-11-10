export const AXIS_HEADROOM_MULTIPLIER = 1.5;
export const DATALABEL_OFFSET = 5;
export const PROXIMITY_THRESHOLD_PIXELS = 10;

export const CHART_COLORS = {
  population: {
    background: '#D1A33C',
    border: '#B28C35',
  },
  icl: {
    background: '#F5DC03',
    border: '#F5DC03',
  },
} as const;

export const TOOLTIP_CONFIG = {
  background: 'rgba(20, 20, 20, 1)',
  textColor: '#ffffff',
  fontSize: '0.75rem',
  fontFamily: "'Work Sans', sans-serif",
  padding: '0.5rem',
  borderRadius: '0.5rem',
  zIndex: '99999',
  offsetX: 5,
  transformLeft: 'translate(-115%, -50%)',
  transformRight: 'translate(10%, -50%)',
  lastColumnsThreshold: 2,
} as const;

export const AXIS_CONFIG = {
  y: {
    width: 55,
  },
  y1: {
    width: 40,
  },
} as const;
